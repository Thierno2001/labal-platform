import { z } from "zod";

const optStr = z.string().optional().nullable().or(z.literal(""));
const optNum = z
  .union([z.number(), z.string()])
  .optional()
  .nullable()
  .transform((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  });

export const autoritesSchema = z.object({
  nom_repondant: z.string().min(2, "Le nom est requis"),
  titre_fonction: optStr,
  entite: optStr,
  commune: optStr,
  nb_pme_conventionnees: optNum,
  convention_conaag: optStr,
  cahier_charges: optStr,
  zonage_exclusif: optStr,
  disponibilite_sig: optStr,
  nb_points_noirs: optNum,
  causes_points_noirs: z.array(z.string()).default([]),
  flotte_communale: z.array(z.string()).default([]),
  capacite_4_transferts: optStr,
  mode_gestion_decharge: optStr,
  obstacles_transport: z.array(z.string()).default([]),
  sources_financement: z.array(z.string()).default([]),
  recouvrement_redevances: optStr,
  canal_reclamations: optStr,
  delai_resorption: optStr,
  controles_inopines: optStr,
  sanctions_recentes: optStr,
  actions_education: optStr,
  synergie_sanita: optStr,
  projets_valorisation: optStr,
  avis_suppression_liquide: optStr,
  volonte_mobile_money_obligatoire: optStr,
  correlation_ordures_maladies: optStr,
  liens_centres_sante: optStr,
  format_consolidation: optStr,
  frequence_reporting: optStr,
  ordinateurs_mairie: optStr,
  smartphone_agents_terrain: optStr,
  besoins_dashboard: z.array(z.string()).default([]),
  point_focal_designe: optStr,
  coordonnees_point_focal: optStr,
  recommandations: optStr,

  // Traçabilité Enquêteur
  enqueteur_id: optStr,
  enqueteur_nom: optStr,
  enqueteur_email: optStr,
});

export type AutoritesFormData = z.infer<typeof autoritesSchema>;
