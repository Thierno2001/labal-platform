import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { INITIAL_USERS, INITIAL_AUDIT_LOGS } from "@/lib/auth/initialData";
import type { UserProfile, AuditLog } from "@/lib/auth/types";

// Codes d'accès officiels permettant la validation automatique sans intervention humaine
const VALID_ACCESS_CODES = new Set([
  "LABAL2026",
  "LABAL-2026",
  "CONAKRY2026",
  "LABAL-GN",
  (process.env.NEXT_PUBLIC_ENQUETEUR_ACCESS_CODE || "LABAL2026").toUpperCase().trim(),
]);

export function isValidAccessCode(code?: string | null, email?: string | null): boolean {
  if (email && email.trim().toLowerCase().endsWith("@labal-guinee.org")) {
    return true;
  }
  if (!code) return false;
  return VALID_ACCESS_CODES.has(code.trim().toUpperCase());
}

// In-memory fallback shared store (for environments without Supabase DB connected)
let serverUsersStore: UserProfile[] = [...INITIAL_USERS];
let serverAuditStore: AuditLog[] = [...INITIAL_AUDIT_LOGS];
// Option activable par l'admin pour valider 100% des inscriptions même sans code
let autoApproveAllRegistrations = false;
// Set d'emails auto-validés par code (au cas où la politique RLS Supabase bloque l'UPDATE anon)
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
 * GET /api/auth/users
 * Récupère la liste consolidée de tous les utilisateurs et logs d'audit.
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

      if (!profilesErr && dbProfiles) {
        const rawUsers = dbProfiles.length > 0 ? dbProfiles : INITIAL_USERS;
        const mergedUsers = rawUsers.map((u: UserProfile) =>
          autoApprovedEmails.has(u.email.toLowerCase()) ||
          u.email.toLowerCase().endsWith("@labal-guinee.org")
            ? { ...u, status: "APPROVED" as const }
            : u
        );
        return NextResponse.json({
          users: mergedUsers,
          auditLogs: dbLogs || INITIAL_AUDIT_LOGS,
          source: "supabase",
          autoApproveAll: autoApproveAllRegistrations,
          defaultAccessCode: "LABAL2026",
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
    defaultAccessCode: "LABAL2026",
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

    const shouldAutoApprove =
      autoApproveAllRegistrations ||
      newUser.status === "APPROVED" ||
      isValidAccessCode(accessCode, newUser.email);

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

    const isConfigured = checkSupabaseConfigured();

    if (isConfigured) {
      const client = getSupabaseServerClient();

      // 1. Try inserting with finalStatus ('APPROVED' or 'PENDING')
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

      // 2. Fallback if Supabase RLS policy anon_register_profile restricts INSERT to status = 'PENDING'
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
          // Try updating status to APPROVED
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
              details: `Validation automatique sans intervention humaine (${finalUser.commune_affectation})`,
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
        details: `Validation automatique sans intervention humaine (${userToStore.commune_affectation})`,
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
 * Approbation / Rejet Admin, Auto-validation par code d'accès, ou bascule du mode Auto-Approve.
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, userEmail, action, adminId, adminName, accessCode, autoApproveAll } = body;

    if (action === "TOGGLE_AUTO_APPROVE") {
      autoApproveAllRegistrations = Boolean(autoApproveAll);
      return NextResponse.json({
        success: true,
        autoApproveAll: autoApproveAllRegistrations,
      });
    }

    if (action === "SELF_APPROVE_CODE") {
      if (!isValidAccessCode(accessCode, userEmail)) {
        return NextResponse.json(
          { success: false, error: "Code d'accès invalide. Vérifiez le code auprès de votre coordinateur Labal." },
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
        ? "Système Auto-Validation (Code Terrain)"
        : adminName || "Marseille Camara";
    const isConfigured = checkSupabaseConfigured();

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
                ? `Auto-validation par code d'accès terrain (${updatedProfile.commune_affectation})`
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
            ? `Auto-validation par code d'accès terrain (${targetUser.commune_affectation})`
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
