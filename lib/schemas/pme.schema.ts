import { z } from "zod";

const optStr = z.string().optional().nullable().or(z.literal(""));
const optArr = z.array(z.string()).optional().default([]);

export const pmeSchema = z.object({
  email: optStr,
  nom_structure: z.string().min(2, "Le nom de la structure est requis"),
  affilie_conaag: optStr,
  type_structure: optStr,
  num_agrement: optStr,
  annee_creation: z.union([z.string(), z.number()]).optional().nullable(),

  communes: z.array(z.string()).default([]),
  quartiers: optStr,
  nb_menages_desservis: optStr,
  dessert_commerces: optStr,
  nb_commerces: z.union([z.string(), z.number()]).optional().nullable(),

  mode_recrutement: optArr,
  choix_libre_menage: optStr,
  refus_menages: optStr,

  raisons_refus_menages: optArr,
  exemple_refus: optStr,

  zone_geographique_definie: optStr,

  modalite_definition_zone: optArr,
  conflits_territoriaux: optStr,

  nb_collecteurs: optStr,
  exclusivite_collecteurs: optStr,
  engins_utilises: optArr,
  decision_affectation: optStr,
  refus_collecteur: optStr,

  raisons_refus_collecteur: optArr,

  canaux_demandes: optArr,
  type_prestation: optStr,
  fixation_horaire: optStr,
  demandes_en_attente: optStr,

  etapes_collecte: optStr,
  duree_tournee_heures: z.union([z.string(), z.number()]).optional().nullable(),
  confirmation_collecte: optStr,
  gestion_imprevus: optStr,

  lieu_decharge: optArr,
  voyages_par_jour: z.union([z.string(), z.number()]).optional().nullable(),
  frequence_saturation_transit: optStr,
  temps_attente_transit: optStr,

  systeme_incidents: optStr,
  initiative_annulation: optArr,
  procedure_annulation: optStr,

  modes_paiement_recus: optArr,
  part_especes_vs_mobile: optStr,
  moment_paiement: optStr,
  politique_impayes: optStr,

  remuneration_collecteurs: optStr,
  frequence_paie_collecteurs: optStr,
  suivi_comptable_collecteurs: optStr,

  difficultes_rencontrees: optArr,
  outil_numerique_actuel: optStr,
  nom_logiciel: optStr,

  interet_labal: optStr,
  modules_prioritaires: optArr,
  capacite_smartphone_collecteurs: optStr,
  nom_contact: optStr,
  telephone_contact: optStr,
  accord_recontact: optStr,

  // Traçabilité Enquêteur
  enqueteur_id: optStr,
  enqueteur_nom: optStr,
  enqueteur_email: optStr,
});

export type PmeFormData = z.infer<typeof pmeSchema>;
