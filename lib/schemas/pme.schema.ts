import { z } from "zod";

export const pmeSchema = z.object({
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  nom_structure: z.string().min(2, "Nom requis"),
  affilie_conaag: z.string().min(1, "Requis"),
  type_structure: z.string().min(1, "Requis"),
  num_agrement: z.string().optional(),
  annee_creation: z.string().optional(),

  communes: z.array(z.string()).min(1, "Au moins une commune"),
  quartiers: z.string().min(1, "Quartiers requis"),
  nb_menages_desservis: z.string().min(1, "Requis"),
  dessert_commerces: z.string().min(1, "Requis"),
  nb_commerces: z.string().optional(),

  mode_recrutement: z.array(z.string()).min(1, "Requis"),
  choix_libre_menage: z.string().optional(),
  refus_menages: z.string().min(1, "Requis"),

  raisons_refus_menages: z.array(z.string()).optional(),
  exemple_refus: z.string().optional(),

  zone_geographique_definie: z.string().min(1, "Requis"),

  modalite_definition_zone: z.array(z.string()).optional(),
  conflits_territoriaux: z.string().optional(),

  nb_collecteurs: z.string().min(1, "Requis"),
  exclusivite_collecteurs: z.string().min(1, "Requis"),
  engins_utilises: z.array(z.string()).min(1, "Requis"),
  decision_affectation: z.string().optional(),
  refus_collecteur: z.string().min(1, "Requis"),

  raisons_refus_collecteur: z.array(z.string()).optional(),

  canaux_demandes: z.array(z.string()).min(1, "Requis"),
  type_prestation: z.string().min(1, "Requis"),
  fixation_horaire: z.string().optional(),
  demandes_en_attente: z.string().min(1, "Requis"),

  etapes_collecte: z.string().optional(),
  duree_tournee_heures: z.string().optional(),
  confirmation_collecte: z.string().min(1, "Requis"),
  gestion_imprevus: z.string().optional(),

  lieu_decharge: z.array(z.string()).min(1, "Requis"),
  voyages_par_jour: z.string().optional(),
  frequence_saturation_transit: z.string().min(1, "Requis"),
  temps_attente_transit: z.string().min(1, "Requis"),

  systeme_incidents: z.string().min(1, "Requis"),
  initiative_annulation: z.array(z.string()).min(1, "Requis"),
  procedure_annulation: z.string().optional(),

  modes_paiement_recus: z.array(z.string()).min(1, "Requis"),
  part_especes_vs_mobile: z.string().optional(),
  moment_paiement: z.string().min(1, "Requis"),
  politique_impayes: z.string().optional(),

  remuneration_collecteurs: z.string().optional(),
  frequence_paie_collecteurs: z.string().min(1, "Requis"),
  suivi_comptable_collecteurs: z.string().optional(),

  difficultes_rencontrees: z.array(z.string()).min(1, "Requis"),
  outil_numerique_actuel: z.string().min(1, "Requis"),
  nom_logiciel: z.string().optional(),

  interet_labal: z.string().min(1, "Requis"),
  modules_prioritaires: z.array(z.string()).min(1, "Requis"),
  capacite_smartphone_collecteurs: z.string().optional(),
  nom_contact: z.string().min(1, "Requis"),
  telephone_contact: z.string().min(1, "Requis"),
  accord_recontact: z.string().min(1, "Requis"),
});

export type PmeFormData = z.infer<typeof pmeSchema>;
