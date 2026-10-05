import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { INITIAL_USERS, INITIAL_AUDIT_LOGS } from "@/lib/auth/initialData";
import type { UserProfile, AuditLog } from "@/lib/auth/types";

// In-memory fallback shared store (for environments without Supabase DB connected)
let serverUsersStore: UserProfile[] = [...INITIAL_USERS];
let serverAuditStore: AuditLog[] = [...INITIAL_AUDIT_LOGS];

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

      const { data: dbLogs, error: logsErr } = await client
        .from("audit_logs")
        .select("*")
        .order("timestamp", { ascending: false });

      if (!profilesErr && dbProfiles) {
        const mergedUsers = dbProfiles.length > 0 ? dbProfiles : INITIAL_USERS;
        return NextResponse.json({
          users: mergedUsers,
          auditLogs: dbLogs || INITIAL_AUDIT_LOGS,
          source: "supabase",
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
  });
}

/**
 * POST /api/auth/users
 * Enregistre une nouvelle demande d'inscription Enquêteur dans Supabase.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { newUser } = body;

    if (!newUser || !newUser.email) {
      return NextResponse.json({ error: "Données d'utilisateur invalides." }, { status: 400 });
    }

    const isConfigured = checkSupabaseConfigured();

    if (isConfigured) {
      const client = getSupabaseServerClient();
      const { data, error } = await client
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

      if (!error && data) {
        serverUsersStore = [data, ...serverUsersStore.filter((u) => u.email !== data.email)];
        return NextResponse.json({ success: true, user: data, source: "supabase" });
      } else if (error) {
        console.error("[API Auth POST Supabase Error]:", error);

        // Si l'erreur est un conflit d'email unique, renvoyer succes
        if (error.code === "23505") {
          return NextResponse.json({ success: true, user: newUser, source: "supabase_duplicate" });
        }

        return NextResponse.json(
          {
            error: `Erreur Supabase: ${error.message}`,
            code: error.code,
          },
          { status: 400 }
        );
      }
    }

    // Fallback : Enregistrement dans la mémoire serveur partagée
    const existingIndex = serverUsersStore.findIndex((u) => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (existingIndex >= 0) {
      serverUsersStore[existingIndex] = newUser;
    } else {
      serverUsersStore = [newUser, ...serverUsersStore];
    }

    return NextResponse.json({ success: true, user: newUser, source: "server_memory" });
  } catch (error) {
    console.error("[API Auth POST Exception]:", error);
    return NextResponse.json({ error: "Erreur serveur lors de l'inscription." }, { status: 500 });
  }
}

/**
 * PATCH /api/auth/users
 * Approbation ou Rejet d'un compte utilisateur par un Admin.
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, action, adminId, adminName } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: "Action ou identifiant manquant." }, { status: 400 });
    }

    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";
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
        const logAction = action === "APPROVE" ? "USER_APPROVED" : "USER_REJECTED";
        await client.from("audit_logs").insert([
          {
            actor_id: adminId || "00000000-0000-0000-0000-000000000001",
            actor_name: adminName || "Marseille Camara",
            action: logAction,
            target_id: userId,
            target_name: updatedProfile.full_name,
            details: `Action ${action} pour le compte (${updatedProfile.commune_affectation})`,
          },
        ]);

        return NextResponse.json({ success: true, user: updatedProfile, source: "supabase" });
      } else if (updateErr) {
        console.error("[API Auth PATCH Supabase Error]:", updateErr);
      }
    }

    // Fallback store mémoire serveur
    const targetUser = serverUsersStore.find((u) => u.id === userId);
    if (targetUser) {
      targetUser.status = newStatus;
      targetUser.approved_by = adminId || "admin-1";
      targetUser.approved_at = new Date().toISOString();

      const newLog: AuditLog = {
        id: `audit-${Date.now()}`,
        actor_id: adminId || "admin-1",
        actor_name: adminName || "Marseille Camara",
        action: action === "APPROVE" ? "USER_APPROVED" : "USER_REJECTED",
        target_id: userId,
        target_name: targetUser.full_name,
        details: `Action ${action} pour le compte (${targetUser.commune_affectation})`,
        timestamp: new Date().toISOString(),
      };

      serverAuditStore = [newLog, ...serverAuditStore];
    }

    return NextResponse.json({ success: true, users: serverUsersStore, auditLogs: serverAuditStore, source: "server_memory" });
  } catch (error) {
    console.error("[API Auth PATCH Exception]:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour." }, { status: 500 });
  }
}
