import * as z from "zod";

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

export const menagesSchema = z.object({
  email: optStr,
  nom_repondant: z.string().min(1, "Le nom du répondant est requis"),
  nb_personnes_foyer: optNum,
  type_habitation: optStr,
  commune: optStr,
  quartier: optStr,
  reperes_visuels: optStr,
  accessibilite: optStr,
  mode_evacuation: optStr,
  motif_non_abonne: optStr,
  nom_pme_connue: optStr,
  libre_choix_collecteur: optStr,
  a_change_collecteur: optStr,
  motifs_insatisfaction: z.array(z.string()).optional().default([]),
  nb_sacs_semaine: optNum,
  typologie_dechets: z.array(z.string()).optional().default([]),
  alerte_ramassage_actuelle: optStr,
  bacs_debordants_7_jours: optStr,
  interet_bouton_commande: optStr,
  respect_horaire: optStr,
  notification_approche: optStr,
  suivi_carte_temps_reel: optStr,
  preuve_passage: optStr,
  procedure_absence: optStr,
  tri_actuel: optStr,
  facteurs_stimulants: z.array(z.string()).optional().default([]),
  connaissance_risques: z.array(z.string()).optional().default([]),
  pret_modules_video: optStr,
  montant_mensuel_gnf: optNum,
  perception_qualite_prix: optStr,
  mode_paiement: optStr,
  recu_papier: optStr,
  conflit_paiement: optStr,
  nature_differend: optStr,
  resolution_litige: optStr,
  possession_smartphone: optStr,
  frequence_mobile_money: optStr,
  applications_favorites: optStr,
  pret_installer_labal: optStr,
  telephone_groupe_test: optStr,
  suggestions_amelioration: optStr,

  // Traçabilité Enquêteur
  enqueteur_id: optStr,
  enqueteur_nom: optStr,
  enqueteur_email: optStr,
});

export type MenagesFormData = z.infer<typeof menagesSchema>;
