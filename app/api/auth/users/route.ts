import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { INITIAL_USERS, INITIAL_AUDIT_LOGS } from "@/lib/auth/initialData";
import type { UserProfile, AuditLog } from "@/lib/auth/types";

// Liste dynamique des codes d'accès créés/activés par les superviseurs (Admin)
let serverAccessCodes: string[] = [
  (process.env.NEXT_PUBLIC_ENQUETEUR_ACCESS_CODE || "LABAL-GN-2026").toUpperCase().trim(),
];

// In-memory fallback shared store (for environments without Supabase DB connected)
let serverUsersStore: UserProfile[] = [...INITIAL_USERS];
let serverAuditStore: AuditLog[] = [...INITIAL_AUDIT_LOGS];
let autoApproveAllRegistrations = false;
const autoApprovedEmails = new Set<string>();

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
}

function getSupabaseKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  );
}

function checkSupabaseConfigured() {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  return Boolean(url && url.length > 10 && !url.includes("placeholder") && key && key.length > 5);
}

function getSupabaseServerClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

/**
 * Reconstruit la liste des codes actifs à partir des logs d'audit Supabase + mémoire serveur
 */
function syncCodesFromAuditLogs(logs: AuditLog[]) {
  const codes = new Set<string>(serverAccessCodes);
  // Parcourir du plus ancien au plus récent
  const chronological = [...logs].reverse();
  for (const log of chronological) {
    if ((log.action as string) === "ACCESS_CODE_CREATED" && log.target_name) {
      codes.add(log.target_name.trim().toUpperCase());
    } else if ((log.action as string) === "ACCESS_CODE_REVOKED" && log.target_name) {
      codes.delete(log.target_name.trim().toUpperCase());
    }
  }
  serverAccessCodes = Array.from(codes);
}

function isValidAccessCode(code?: string | null): boolean {
  if (!code) return false;
  const normalized = code.trim().toUpperCase();
  if (!normalized) return false;
  return serverAccessCodes.includes(normalized);
}

/**
 * GET /api/auth/users
 * Récupère la liste consolidée de tous les utilisateurs, logs d'audit et codes actifs.
 */
export async function GET() {
  const isConfigured = checkSupabaseConfigured();

  if (isConfigured) {
    try {
      const client = getSupabaseServerClient();
      const { data: dbProfiles, error: profilesErr } = await client
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: dbLogs } = await client
        .from("audit_logs")
        .select("*")
        .order("timestamp", { ascending: false });

      if (Array.isArray(dbLogs)) {
        syncCodesFromAuditLogs(dbLogs as AuditLog[]);
      }

      if (!profilesErr && dbProfiles) {
        const rawUsers = dbProfiles.length > 0 ? dbProfiles : INITIAL_USERS;
        const mergedUsers = rawUsers.map((u: UserProfile) =>
          autoApprovedEmails.has(u.email.toLowerCase())
            ? { ...u, status: "APPROVED" as const }
            : u
        );
        return NextResponse.json({
          users: mergedUsers,
          auditLogs: dbLogs || INITIAL_AUDIT_LOGS,
          source: "supabase",
          autoApproveAll: autoApproveAllRegistrations,
          accessCodes: serverAccessCodes,
        });
      } else if (profilesErr) {
        console.error("[API Auth GET Supabase Error]:", profilesErr);
      }
    } catch (err) {
      console.error("[API Auth GET Exception]:", err);
    }
  }

  return NextResponse.json({
    users: serverUsersStore,
    auditLogs: serverAuditStore,
    source: "server_memory",
    autoApproveAll: autoApproveAllRegistrations,
    accessCodes: serverAccessCodes,
  });
}

/**
 * POST /api/auth/users
 * Enregistre une nouvelle demande d'inscription Enquêteur avec validation automatique si code valide.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { newUser, accessCode } = body;

    if (!newUser || !newUser.email) {
      return NextResponse.json({ error: "Données d'utilisateur invalides." }, { status: 400 });
    }

    const isConfigured = checkSupabaseConfigured();
    if (isConfigured) {
      try {
        const client = getSupabaseServerClient();
        const { data: dbLogs } = await client
          .from("audit_logs")
          .select("*")
          .order("timestamp", { ascending: false });
        if (Array.isArray(dbLogs)) {
          syncCodesFromAuditLogs(dbLogs as AuditLog[]);
        }
      } catch {
        // ignore
      }
    }

    const codeProvided = Boolean(accessCode && accessCode.trim().length > 0);
    const codeIsValid = isValidAccessCode(accessCode);

    // Si l'utilisateur a saisi un code mais qu'il est erroné, refuser explicitement pour qu'il corrige
    if (codeProvided && !codeIsValid && !autoApproveAllRegistrations) {
      return NextResponse.json(
        {
          error: "Le code d'accès saisi est invalide ou expiré. Vérifiez-le auprès de votre superviseur ou laissez ce champ vide pour une validation manuelle.",
        },
        { status: 403 }
      );
    }

    const shouldAutoApprove = autoApproveAllRegistrations || codeIsValid;
    const finalStatus = shouldAutoApprove ? "APPROVED" : "PENDING";
    const approvedAt = shouldAutoApprove ? new Date().toISOString() : null;
    const approvedBy = shouldAutoApprove ? "00000000-0000-0000-0000-000000000001" : null;

    if (shouldAutoApprove) {
      autoApprovedEmails.add(newUser.email.toLowerCase());
    }

    const userToStore: UserProfile = {
      ...newUser,
      role: "ENQUETEUR",
      status: finalStatus,
      approved_by: shouldAutoApprove ? "AUTO_SYSTEM" : null,
      approved_at: approvedAt,
    };

    if (isConfigured) {
      const client = getSupabaseServerClient();

      let { data, error } = await client
        .from("profiles")
        .insert([
          {
            email: newUser.email,
            full_name: newUser.full_name,
            phone: newUser.phone,
            commune_affectation: newUser.commune_affectation,
            role: "ENQUETEUR",
            status: finalStatus,
            password_hash: newUser.password_hash,
            ...(shouldAutoApprove ? { approved_by: approvedBy, approved_at: approvedAt } : {}),
          },
        ])
        .select()
        .single();

      // Fallback si la politique RLS Supabase restreint l'INSERT à status = 'PENDING'
      if (error && shouldAutoApprove) {
        const retryInsert = await client
          .from("profiles")
          .insert([
            {
              email: newUser.email,
              full_name: newUser.full_name,
              phone: newUser.phone,
              commune_affectation: newUser.commune_affectation,
              role: "ENQUETEUR",
              status: "PENDING",
              password_hash: newUser.password_hash,
            },
          ])
          .select()
          .single();

        if (!retryInsert.error && retryInsert.data) {
          const updateTry = await client
            .from("profiles")
            .update({
              status: "APPROVED",
              approved_by: approvedBy,
              approved_at: approvedAt,
            })
            .eq("id", retryInsert.data.id)
            .select()
            .single();

          data = updateTry.data || { ...retryInsert.data, status: "APPROVED", approved_at: approvedAt };
          error = null;
        }
      }

      if (!error && data) {
        const finalUser: UserProfile = {
          ...data,
          status: finalStatus,
        };
        serverUsersStore = [
          finalUser,
          ...serverUsersStore.filter((u) => u.email.toLowerCase() !== finalUser.email.toLowerCase()),
        ];

        if (shouldAutoApprove) {
          await client.from("audit_logs").insert([
            {
              actor_id: approvedBy,
              actor_name: "Système Auto-Validation",
              action: "USER_APPROVED",
              target_id: finalUser.id,
              target_name: finalUser.full_name,
              details: `Validation automatique par code d'accès (${finalUser.commune_affectation})`,
            },
          ]);
        }

        return NextResponse.json({
          success: true,
          user: finalUser,
          autoApproved: shouldAutoApprove,
          source: "supabase",
        });
      } else if (error) {
        console.error("[API Auth POST Supabase Error]:", error);

        if (error.code === "23505") {
          return NextResponse.json({
            success: true,
            user: userToStore,
            autoApproved: shouldAutoApprove,
            source: "supabase_duplicate",
          });
        }
      }
    }

    // Fallback : Enregistrement dans la mémoire serveur partagée
    const existingIndex = serverUsersStore.findIndex(
      (u) => u.email.toLowerCase() === userToStore.email.toLowerCase()
    );
    if (existingIndex >= 0) {
      serverUsersStore[existingIndex] = userToStore;
    } else {
      serverUsersStore = [userToStore, ...serverUsersStore];
    }

    if (shouldAutoApprove) {
      const autoLog: AuditLog = {
        id: `audit-${Date.now()}`,
        actor_id: "AUTO_SYSTEM",
        actor_name: "Système Auto-Validation",
        action: "USER_APPROVED",
        target_id: userToStore.id,
        target_name: userToStore.full_name,
        details: `Validation automatique par code d'accès (${userToStore.commune_affectation})`,
        timestamp: new Date().toISOString(),
      };
      serverAuditStore = [autoLog, ...serverAuditStore];
    }

    return NextResponse.json({
      success: true,
      user: userToStore,
      autoApproved: shouldAutoApprove,
      source: "server_memory",
    });
  } catch (error) {
    console.error("[API Auth POST Exception]:", error);
    return NextResponse.json({ error: "Erreur serveur lors de l'inscription." }, { status: 500 });
  }
}

/**
 * PATCH /api/auth/users
 * Approbation / Rejet Admin, création/révocation de codes d'accès par le superviseur, ou auto-validation par code.
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      userEmail,
      action,
      adminId,
      adminName,
      accessCode,
      autoApproveAll,
    } = body;

    const isConfigured = checkSupabaseConfigured();

    // 1. Création d'un nouveau code d'accès par le Superviseur / Admin
    if (action === "CREATE_ACCESS_CODE") {
      const cleanNewCode = (accessCode || "").trim().toUpperCase();
      if (!cleanNewCode || cleanNewCode.length < 4) {
        return NextResponse.json(
          { error: "Le code doit contenir au moins 4 caractères." },
          { status: 400 }
        );
      }
      if (!serverAccessCodes.includes(cleanNewCode)) {
        serverAccessCodes = [cleanNewCode, ...serverAccessCodes];
      }

      if (isConfigured) {
        const client = getSupabaseServerClient();
        await client.from("audit_logs").insert([
          {
            actor_id: adminId || "00000000-0000-0000-0000-000000000001",
            actor_name: adminName || "Administrateur",
            action: "ACCESS_CODE_CREATED",
            target_id: adminId || "00000000-0000-0000-0000-000000000001",
            target_name: cleanNewCode,
            details: "Création d'un nouveau code d'accès enquêteur",
          },
        ]);
      } else {
        serverAuditStore = [
          {
            id: `audit-${Date.now()}`,
            actor_id: adminId || "admin-1",
            actor_name: adminName || "Administrateur",
            action: "USER_APPROVED",
            target_id: "CODE",
            target_name: cleanNewCode,
            details: "Création d'un nouveau code d'accès enquêteur",
            timestamp: new Date().toISOString(),
          },
          ...serverAuditStore,
        ];
      }

      return NextResponse.json({
        success: true,
        accessCodes: serverAccessCodes,
      });
    }

    // 2. Suppression / Révocation d'un code d'accès par le Superviseur / Admin
    if (action === "REVOKE_ACCESS_CODE") {
      const cleanTarget = (accessCode || "").trim().toUpperCase();
      serverAccessCodes = serverAccessCodes.filter((c) => c !== cleanTarget);

      if (isConfigured) {
        const client = getSupabaseServerClient();
        await client.from("audit_logs").insert([
          {
            actor_id: adminId || "00000000-0000-0000-0000-000000000001",
            actor_name: adminName || "Administrateur",
            action: "ACCESS_CODE_REVOKED",
            target_id: adminId || "00000000-0000-0000-0000-000000000001",
            target_name: cleanTarget,
            details: "Révocation d'un code d'accès enquêteur",
          },
        ]);
      }

      return NextResponse.json({
        success: true,
        accessCodes: serverAccessCodes,
      });
    }

    // 3. Bascule du mode d'auto-approbation ouverte
    if (action === "TOGGLE_AUTO_APPROVE") {
      autoApproveAllRegistrations = Boolean(autoApproveAll);
      return NextResponse.json({
        success: true,
        autoApproveAll: autoApproveAllRegistrations,
      });
    }

    // 4. Auto-validation d'un compte en attente par saisie d'un code valide
    if (action === "SELF_APPROVE_CODE") {
      if (isConfigured) {
        try {
          const client = getSupabaseServerClient();
          const { data: dbLogs } = await client
            .from("audit_logs")
            .select("*")
            .order("timestamp", { ascending: false });
          if (Array.isArray(dbLogs)) {
            syncCodesFromAuditLogs(dbLogs as AuditLog[]);
          }
        } catch {
          // ignore
        }
      }

      if (!isValidAccessCode(accessCode)) {
        return NextResponse.json(
          {
            success: false,
            error: "Code d'activation invalide ou expiré. Veuillez demander le code actif à votre superviseur.",
          },
          { status: 403 }
        );
      }
      if (userEmail) {
        autoApprovedEmails.add(userEmail.toLowerCase());
      }
    }

    if (!userId || !action) {
      return NextResponse.json({ error: "Action ou identifiant manquant." }, { status: 400 });
    }

    const newStatus =
      action === "APPROVE" || action === "SELF_APPROVE_CODE" ? "APPROVED" : "REJECTED";
    const actorNameFinal =
      action === "SELF_APPROVE_CODE"
        ? "Système Auto-Validation (Code Superviseur)"
        : adminName || "Marseille Camara";

    if (isConfigured) {
      const client = getSupabaseServerClient();
      const { data: updatedProfile, error: updateErr } = await client
        .from("profiles")
        .update({
          status: newStatus,
          approved_by: adminId || "00000000-0000-0000-0000-000000000001",
          approved_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (!updateErr && updatedProfile) {
        const logAction = newStatus === "APPROVED" ? "USER_APPROVED" : "USER_REJECTED";
        await client.from("audit_logs").insert([
          {
            actor_id: adminId || "00000000-0000-0000-0000-000000000001",
            actor_name: actorNameFinal,
            action: logAction,
            target_id: userId,
            target_name: updatedProfile.full_name,
            details:
              action === "SELF_APPROVE_CODE"
                ? `Auto-validation par code superviseur (${updatedProfile.commune_affectation})`
                : `Action ${action} pour le compte (${updatedProfile.commune_affectation})`,
          },
        ]);

        return NextResponse.json({ success: true, user: updatedProfile, source: "supabase" });
      } else if (updateErr) {
        console.error("[API Auth PATCH Supabase Error]:", updateErr);
      }
    }

    // Fallback store mémoire serveur
    const targetUser = serverUsersStore.find(
      (u) => u.id === userId || (userEmail && u.email.toLowerCase() === userEmail.toLowerCase())
    );
    if (targetUser) {
      targetUser.status = newStatus;
      targetUser.approved_by = adminId || "AUTO_SYSTEM";
      targetUser.approved_at = new Date().toISOString();

      const newLog: AuditLog = {
        id: `audit-${Date.now()}`,
        actor_id: adminId || "AUTO_SYSTEM",
        actor_name: actorNameFinal,
        action: newStatus === "APPROVED" ? "USER_APPROVED" : "USER_REJECTED",
        target_id: userId,
        target_name: targetUser.full_name,
        details:
          action === "SELF_APPROVE_CODE"
            ? `Auto-validation par code superviseur (${targetUser.commune_affectation})`
            : `Action ${action} pour le compte (${targetUser.commune_affectation})`,
        timestamp: new Date().toISOString(),
      };

      serverAuditStore = [newLog, ...serverAuditStore];
    }

    return NextResponse.json({
      success: true,
      users: serverUsersStore,
      auditLogs: serverAuditStore,
      source: "server_memory",
    });
  } catch (error) {
    console.error("[API Auth PATCH Exception]:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour." }, { status: 500 });
  }
}
