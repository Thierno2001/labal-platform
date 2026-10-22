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

export const transitSchema = z.object({
  email_responsable: optStr,
  nom_site: z.string().min(1, "Le nom du site est requis"),
  statut_site: optStr,
  entite_gestionnaire: optStr,
  commune: optStr,
  quartier_repere: optStr,
  capacite_caissons: optNum,
  cloture_dalle: optStr,
  equipements: z.array(z.string()).default([]),
  presence_pont_bascule: optStr,
  tri_sur_place: optStr,
  filieres_triees: z.array(z.string()).default([]),
  nb_trieurs: optNum,
  acheteurs: optStr,
  nb_pme_clientes: optNum,
  nb_rotations_quotidiennes: optNum,
  tranches_horaires_pointe: optStr,
  acces_limite_agrees: optStr,
  redevance_deversement: optStr,
  refus_acces: optStr,
  causes_refus: z.array(z.string()).default([]),
  outil_enregistrement: optStr,
  donnees_consignees: z.array(z.string()).default([]),
  frequence_rotation: optStr,
  prestataire_transporteur: optStr,
  frequence_saturation: optStr,
  consequences_environnementales: optStr,
  causes_blocage: z.array(z.string()).default([]),
  duree_max_blocage: optStr,
  canal_alerte_mairie: optStr,
  delai_reaction_communal: optStr,
  encaissements_especes_vs_mobile: optStr,
  litiges_caisse: optStr,
  dotation_epi: z.array(z.string()).default([]),
  nuisances_vecteurs: optStr,
  local_securise_courant: optStr,
  qualite_reseau_4g: optStr,
  smartphone_fonction: optStr,
  bouton_alerte_sos: optStr,
  suivi_gps_camions: optStr,
  contact_responsable: optStr,
  suggestions_amenagement: optStr,

  // Traçabilité Enquêteur
  enqueteur_id: optStr,
  enqueteur_nom: optStr,
  enqueteur_email: optStr,
});

export type TransitFormData = z.infer<typeof transitSchema>;
