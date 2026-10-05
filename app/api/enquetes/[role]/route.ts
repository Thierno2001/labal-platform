import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { pmeSchema } from "@/lib/schemas/pme.schema";
import { menagesSchema } from "@/lib/schemas/menages.schema";
import { transitSchema } from "@/lib/schemas/transit.schema";
import { autoritesSchema } from "@/lib/schemas/autorites.schema";

// Strict schemas for server-side validation (preventing Mass Assignment Injection)
const roleSchemas: Record<string, z.ZodSchema> = {
  pme: pmeSchema,
  menages: menagesSchema,
  transit: transitSchema,
  autorites: autoritesSchema,
};

const roleToTable: Record<string, string> = {
  pme: "enquetes_pme",
  menages: "enquetes_menages",
  transit: "enquetes_transit",
  autorites: "enquetes_autorites",
};

const booleanFields = new Set([
  "dessert_commerces", "refus_menages", "zone_geographique_definie", 
  "refus_collecteur", "demandes_en_attente", "systeme_incidents", 
  "accord_recontact", "a_change_collecteur", "bacs_debordants_7_jours", 
  "interet_bouton_commande", "notification_approche", "suivi_carte_temps_reel", 
  "tri_actuel", "pret_modules_video", "recu_papier", "conflit_paiement", 
  "possession_smartphone", "pret_installer_labal", "cloture_dalle", 
  "presence_pont_bascule", "tri_sur_place", "acces_limite_agrees", 
  "refus_acces", "systeme_pesee", "registre_entrees_sorties", 
  "conventions_pme_signees", "tri_source_exige", "sanctions_non_respect", 
  "espace_transit_dedie", "interet_plateforme_labal", "pret_integrer_projet_pilote"
]);

const integerFields = new Set([
  "annee_creation", "nb_commerces", "duree_tournee_heures", "voyages_par_jour",
  "nb_personnes_foyer", "nb_sacs_semaine", "montant_mensuel_gnf",
  "nb_trieurs", "nb_pme_clientes", "nb_rotations_quotidiennes", "annee_prise_fonction"
]);

function sanitizePayload(data: Record<string, any>) {
  const clean: Record<string, any> = {};

  for (const [key, val] of Object.entries(data)) {
    if (val === "" || val === undefined) {
      clean[key] = null;
    } else if (booleanFields.has(key)) {
      if (typeof val === "boolean") clean[key] = val;
      else if (val === "true" || val === "Oui") clean[key] = true;
      else if (val === "false" || val === "Non") clean[key] = false;
      else clean[key] = Boolean(val);
    } else if (integerFields.has(key)) {
      if (typeof val === "number") clean[key] = Math.round(val);
      else {
        const parsed = parseInt(String(val), 10);
        clean[key] = isNaN(parsed) ? null : parsed;
      }
    } else {
      clean[key] = val;
    }
  }

  return clean;
}

type RouteParams = {
  params: Promise<{ role: string }>;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { role } = await params;

    if (!roleSchemas[role]) {
      return NextResponse.json(
        { error: `Rôle invalide: ${role}. Rôles acceptés: pme, menages, transit, autorites.` },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Strict schema validation (reject unmapped payload attributes)
    const schema = roleSchemas[role];
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données de formulaire invalides ou incomplètes.", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const sanitizedData = sanitizePayload(result.data);

    // Try to insert into Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("placeholder")) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      const tableName = roleToTable[role];
      const { data, error } = await supabase
        .from(tableName)
        .insert(sanitizedData)
        .select("id, created_at")
        .single();

      if (error) {
        console.error(`[API] Erreur Supabase ${tableName}:`, error);
        return NextResponse.json(
          { error: `Erreur d'enregistrement DB: ${error.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: `Enquête ${role} enregistrée avec succès.`,
          id: data.id,
          created_at: data.created_at,
        },
        { status: 201 }
      );
    }

    // Fallback: local mode
    return NextResponse.json(
      {
        success: true,
        message: `Enquête ${role} reçue (mode local — Supabase non configuré).`,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API] Erreur inattendue:", err);
    return NextResponse.json(
      { error: `Erreur interne du serveur: ${err?.message || err}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { role } = await params;

    if (!roleToTable[role]) {
      return NextResponse.json(
        { error: `Rôle invalide: ${role}` },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("placeholder")) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      const url = new URL(request.url);
      const rawCommune = url.searchParams.get("commune");
      const rawLimit = url.searchParams.get("limit") || "100";
      const rawOffset = url.searchParams.get("offset") || "0";

      // Sanitize pagination bounds to prevent resource exhaustion / DoS
      const limit = Math.min(Math.max(parseInt(rawLimit) || 10, 1), 500);
      const offset = Math.max(parseInt(rawOffset) || 0, 0);

      let query = supabase
        .from(roleToTable[role])
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (rawCommune) {
        // Sanitize string filter
        const commune = rawCommune.trim();
        if (role === "pme") {
          query = query.contains("communes", JSON.stringify([commune]));
        } else {
          query = query.eq("commune", commune);
        }
      }

      const { data, error, count } = await query;

      if (error) {
        return NextResponse.json(
          { error: "Erreur de lecture" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        data,
        total: count,
        limit,
        offset,
      });
    }

    return NextResponse.json({
      data: [],
      total: 0,
      limit: 100,
      offset: 0,
    });
  } catch (err) {
    console.error("[API] Erreur GET:", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
