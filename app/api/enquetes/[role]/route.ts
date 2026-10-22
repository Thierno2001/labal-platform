import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { pmeSchema } from "@/lib/schemas/pme.schema";
import { menagesSchema } from "@/lib/schemas/menages.schema";
import { transitSchema } from "@/lib/schemas/transit.schema";
import { autoritesSchema } from "@/lib/schemas/autorites.schema";
import {
  roleToTable,
  serverEnquetesStore,
  surveyAttributionMap,
  getSupabaseConfig,
  fetchAllEnquetesByRole,
  type SurveyRole,
} from "@/lib/supabase/enquetesStore";

// Strict schemas for server-side validation
const roleSchemas: Record<string, z.ZodSchema> = {
  pme: pmeSchema,
  menages: menagesSchema,
  transit: transitSchema,
  autorites: autoritesSchema,
};

// Exact boolean columns matching supabase/schema.sql
const booleanFields = new Set([
  // PME (note: demandes_en_attente is TEXT CHECK ('Oui', 'Non') in schema.sql)
  "dessert_commerces",
  "refus_menages",
  "zone_geographique_definie",
  "refus_collecteur",
  "systeme_incidents",
  "accord_recontact",
  // Ménages
  "a_change_collecteur",
  "bacs_debordants_7_jours",
  "interet_bouton_commande",
  "notification_approche",
  "suivi_carte_temps_reel",
  "tri_actuel",
  "pret_modules_video",
  "recu_papier",
  "conflit_paiement",
  "possession_smartphone",
  "pret_installer_labal",
  // Transit
  "cloture_dalle",
  "presence_pont_bascule",
  "tri_sur_place",
  "acces_limite_agrees",
  "redevance_deversement",
  "refus_acces",
  "litiges_caisse",
  "local_securise_courant",
  "smartphone_fonction",
  "bouton_alerte_sos",
  "suivi_gps_camions",
  // Autorités
  "convention_conaag",
  "cahier_charges",
  "zonage_exclusif",
  "disponibilite_sig",
  "capacite_4_transferts",
  "controles_inopines",
  "sanctions_recentes",
  "synergie_sanita",
  "volonte_mobile_money_obligatoire",
  "correlation_ordures_maladies",
  "ordinateurs_mairie",
  "smartphone_agents_terrain",
  "point_focal_designe",
]);

// Exact numeric columns matching supabase/schema.sql
const numericFields = new Set([
  // PME
  "annee_creation",
  "nb_commerces",
  "duree_tournee_heures",
  "voyages_par_jour",
  // Ménages
  "nb_personnes_foyer",
  "nb_sacs_semaine",
  "montant_mensuel_gnf",
  // Transit
  "capacite_caissons",
  "nb_trieurs",
  "nb_pme_clientes",
  "nb_rotations_quotidiennes",
  // Autorités
  "nb_pme_conventionnees",
  "nb_points_noirs",
]);

function sanitizePayload(data: Record<string, any>) {
  const clean: Record<string, any> = {};

  for (const [key, val] of Object.entries(data)) {
    if (val === null || val === undefined) {
      clean[key] = null;
      continue;
    }

    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed === "") {
        clean[key] = booleanFields.has(key) ? false : null;
        continue;
      }

      if (booleanFields.has(key)) {
        if (trimmed === "true" || trimmed === "Oui") clean[key] = true;
        else if (trimmed === "false" || trimmed === "Non") clean[key] = false;
        else clean[key] = Boolean(trimmed);
        continue;
      }

      if (numericFields.has(key)) {
        const parsed = Number(trimmed);
        clean[key] = isNaN(parsed) ? null : parsed;
        continue;
      }

      clean[key] = trimmed;
      continue;
    }

    if (typeof val === "number") {
      clean[key] = isNaN(val) ? null : val;
      continue;
    }

    if (typeof val === "boolean") {
      clean[key] = val;
      continue;
    }

    clean[key] = val;
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

    const schema = roleSchemas[role];
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données de formulaire invalides ou incomplètes.", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const sanitizedData = sanitizePayload(result.data);
    const { enqueteur_id, enqueteur_nom, enqueteur_email, ...coreDbFields } = sanitizedData;

    const { supabaseUrl, supabaseKey, isConfigured } = getSupabaseConfig();

    if (isConfigured) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      const tableName = roleToTable[role as SurveyRole];

      // 1. Try inserting with enqueteur_* columns included
      const payloadWithEnqueteur = {
        ...coreDbFields,
        ...(enqueteur_id ? { enqueteur_id } : {}),
        ...(enqueteur_nom ? { enqueteur_nom } : {}),
        ...(enqueteur_email ? { enqueteur_email } : {}),
      };

      let { data, error } = await supabase
        .from(tableName)
        .insert(payloadWithEnqueteur)
        .select("id, created_at")
        .single();

      // 2. Fallback: if the live Supabase table doesn't yet have enqueteur_* columns, insert coreDbFields
      if (
        error &&
        (error.code === "PGRST204" ||
          error.code === "42703" ||
          error.message?.includes("enqueteur_"))
      ) {
        const retryRes = await supabase
          .from(tableName)
          .insert(coreDbFields)
          .select("id, created_at")
          .single();
        data = retryRes.data;
        error = retryRes.error;
      }

      if (error || !data) {
        console.error(`[API] Erreur Supabase ${tableName}:`, error);
        return NextResponse.json(
          { error: `Erreur d'enregistrement DB: ${error?.message || "Erreur inconnue"}` },
          { status: 500 }
        );
      }

      // Store attribution in memory map as well
      if (enqueteur_id || enqueteur_nom || enqueteur_email) {
        surveyAttributionMap.set(data.id, {
          enqueteur_id,
          enqueteur_nom,
          enqueteur_email,
        });
      }

      const fullRecord = {
        id: data.id,
        created_at: data.created_at,
        ...sanitizedData,
      };
      serverEnquetesStore[role as SurveyRole] = [
        fullRecord,
        ...serverEnquetesStore[role as SurveyRole],
      ];

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

    // Fallback: local server memory mode
    const localId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const localRecord = {
      id: localId,
      created_at: createdAt,
      ...sanitizedData,
    };
    serverEnquetesStore[role as SurveyRole] = [
      localRecord,
      ...serverEnquetesStore[role as SurveyRole],
    ];

    return NextResponse.json(
      {
        success: true,
        message: `Enquête ${role} enregistrée (mode mémoire serveur).`,
        id: localId,
        created_at: createdAt,
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

    if (!roleToTable[role as SurveyRole]) {
      return NextResponse.json(
        { error: `Rôle invalide: ${role}` },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const rawCommune = url.searchParams.get("commune");
    const rawLimit = url.searchParams.get("limit") || "5000";
    const rawOffset = url.searchParams.get("offset") || "0";
    const rawEnqueteur = url.searchParams.get("enqueteur");

    const limit = Math.min(Math.max(parseInt(rawLimit) || 5000, 1), 10000);
    const offset = Math.max(parseInt(rawOffset) || 0, 0);

    const result = await fetchAllEnquetesByRole(role as SurveyRole, {
      commune: rawCommune,
      limit,
      offset,
      enqueteur: rawEnqueteur,
    });

    return NextResponse.json({
      data: result.data,
      total: result.total,
      limit,
      offset,
      source: result.source,
    });
  } catch (err) {
    console.error("[API] Erreur GET:", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
