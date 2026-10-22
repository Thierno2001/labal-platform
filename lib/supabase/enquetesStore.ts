import { createClient } from "@supabase/supabase-js";

export type SurveyRole = "pme" | "menages" | "transit" | "autorites";

export const roleToTable: Record<SurveyRole, string> = {
  pme: "enquetes_pme",
  menages: "enquetes_menages",
  transit: "enquetes_transit",
  autorites: "enquetes_autorites",
};

// In-memory store for local fallback and surveyor attribution enrichment
export const serverEnquetesStore: Record<SurveyRole, Record<string, any>[]> = {
  pme: [],
  menages: [],
  transit: [],
  autorites: [],
};

// Attribution map by survey ID (in case Supabase table doesn't yet have enqueteur_* columns)
export const surveyAttributionMap = new Map<
  string,
  { enqueteur_id?: string | null; enqueteur_nom?: string | null; enqueteur_email?: string | null }
>();

export function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";
  const isConfigured = Boolean(
    supabaseUrl &&
      supabaseUrl.length > 10 &&
      !supabaseUrl.includes("placeholder") &&
      supabaseKey &&
      supabaseKey.length > 5
  );
  return { supabaseUrl, supabaseKey, isConfigured };
}

export async function fetchAllEnquetesByRole(
  role: SurveyRole,
  options?: { commune?: string | null; limit?: number; offset?: number; enqueteur?: string | null }
): Promise<{ data: any[]; total: number; source: "supabase" | "server_memory" }> {
  const { supabaseUrl, supabaseKey, isConfigured } = getSupabaseConfig();
  const limit = Math.min(Math.max(options?.limit || 5000, 1), 10000);
  const offset = Math.max(options?.offset || 0, 0);
  const commune = options?.commune?.trim() || null;
  const enqueteur = options?.enqueteur?.trim().toLowerCase() || null;

  if (isConfigured) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      let query = supabase
        .from(roleToTable[role])
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (commune && commune !== "all") {
        if (role === "pme") {
          query = query.contains("communes", JSON.stringify([commune]));
        } else {
          query = query.eq("commune", commune);
        }
      }

      const { data, error, count } = await query;

      if (!error && Array.isArray(data)) {
        const enriched = data.map((row: any) => {
          const attr = surveyAttributionMap.get(row.id);
          return {
            ...row,
            enqueteur_id: row.enqueteur_id || attr?.enqueteur_id || null,
            enqueteur_nom: row.enqueteur_nom || attr?.enqueteur_nom || null,
            enqueteur_email: row.enqueteur_email || attr?.enqueteur_email || null,
          };
        });

        const filtered = enqueteur
          ? enriched.filter(
              (r) =>
                r.enqueteur_id?.toLowerCase() === enqueteur ||
                r.enqueteur_email?.toLowerCase() === enqueteur
            )
          : enriched;

        return {
          data: filtered,
          total: enqueteur ? filtered.length : count ?? filtered.length,
          source: "supabase",
        };
      }
    } catch (err) {
      console.error(`[enquetesStore] Supabase fetch error for ${role}:`, err);
    }
  }

  // Fallback to in-memory store
  let list = [...serverEnquetesStore[role]];
  if (commune && commune !== "all") {
    list = list.filter((row) =>
      role === "pme"
        ? Array.isArray(row.communes) && row.communes.includes(commune)
        : row.commune === commune
    );
  }
  if (enqueteur) {
    list = list.filter(
      (row) =>
        row.enqueteur_id?.toLowerCase() === enqueteur ||
        row.enqueteur_email?.toLowerCase() === enqueteur
    );
  }

  return {
    data: list.slice(offset, offset + limit),
    total: list.length,
    source: "server_memory",
  };
}
