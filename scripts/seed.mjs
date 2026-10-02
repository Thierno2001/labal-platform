import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env.local
const envPath = path.resolve(__dirname, "../.env.local");
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      if (key.trim() === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = value.trim();
      if (key.trim() === "NEXT_PUBLIC_SUPABASE_ANON_KEY") supabaseKey = value.trim();
    }
  });
}

console.log("🚀 Connexion Supabase REST API:", supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Erreur : URL ou Clé Supabase non trouvée dans .env.local");
  process.exit(1);
}

// Helper REST Insert One by One
async function insertTable(tableName, items) {
  let count = 0;
  for (const item of items) {
    const url = `${supabaseUrl}/rest/v1/${tableName}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(item)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ Erreur insertion ${tableName} (${response.status}):`, errText);
    } else {
      count++;
    }
  }
  console.log(`✅ ${count}/${items.length} enregistrements insérés dans '${tableName}' avec succès !`);
}

// Datasets à insérer
const pmeData = [
  {
    nom_structure: "GIE Guinée Propre & Salubre",
    affilie_conaag: "Oui",
    type_structure: "GIE",
    num_agrement: "AGR-2018-042",
    annee_creation: 2018,
    communes: ["Kaloum", "Dixinn"],
    quartiers: "Almamya, Boulbinet, Camayenne",
    nb_menages_desservis: ">700",
    dessert_commerces: true,
    nb_commerces: 45,
    mode_recrutement: ["Porte-à-porte", "Sensibilisation quartier", "Recommandation parrain"],
    choix_libre_menage: "Libre choix du ménage",
    refus_menages: true,
    raisons_refus_menages: ["Non-paiement récurrent", "Accès enclavé / ruelles inaccessibles"],
    exemple_refus: "Ruelle Boulbinet trop étroite pour tricycle",
    zone_geographique_definie: true,
    modalite_definition_zone: ["Convention Mairie", "Accord informel entre PME"],
    conflits_territoriaux: "Parfois",
    nb_collecteurs: "8-15",
    exclusivite_collecteurs: "Oui",
    engins_utilises: ["Tricycles à moteur", "Brouettes renforcées"],
    decision_affectation: "Affectation fixe par secteur",
    refus_collecteur: false,
    canaux_demandes: ["Appel téléphonique direct", "Groupe WhatsApp quartier"],
    type_prestation: "Abonnement régulier",
    fixation_horaire: "Fixe (Matin 7h-11h)",
    demandes_en_attente: "Non",
    etapes_collecte: "Collecte à domicile -> Regroupement -> Transfert vers ZST Kaloum",
    duree_tournee_heures: 4.5,
    confirmation_collecte: "Carnet reçu papier",
    gestion_imprevus: "Redéploiement tricycle de réserve",
    lieu_decharge: ["Point de regroupement Boulbinet", "ZST Coronthie"],
    voyages_par_jour: 5,
    frequence_saturation_transit: "Souvent",
    temps_attente_transit: "30-60min",
    systeme_incidents: true,
    initiative_annulation: ["Problème technique véhicule", "Retard de paiement prolongé"],
    procedure_annulation: "SMS d'avertissement au chef de ménage",
    modes_paiement_recus: ["Espèces", "Orange Money"],
    part_especes_vs_mobile: "60% Espèces / 40% Orange Money",
    moment_paiement: "Fin de mois",
    politique_impayes: "Suspension du service après 2 mois d'impayés",
    remuneration_collecteurs: "Salaire fixe + prime au volume",
    frequence_paie_collecteurs: "Mois",
    suivi_comptable_collecteurs: "Registre comptable Excel",
    difficultes_rencontrees: ["Paiements en retard des abonnés", "Saturation régulière du point de transit", "Coût élevé du carburant"],
    outil_numerique_actuel: "WhatsApp",
    interet_labal: "Oui",
    modules_prioritaires: ["Bouton de demande de ramassage client", "Suivi GPS des tricycles", "Paiement direct Mobile Money"],
    capacite_smartphone_collecteurs: "100% équipés de smartphones",
    nom_contact: "Mamadou Diallo",
    telephone_contact: "+224 622 10 20 30",
    accord_recontact: true
  },
  {
    nom_structure: "PME Conakry Assainissement Plus",
    affilie_conaag: "Oui",
    type_structure: "SARL",
    num_agrement: "AGR-2020-118",
    annee_creation: 2020,
    communes: ["Ratoma", "Matoto"],
    quartiers: "Kipé, Lambanyi, Cosa",
    nb_menages_desservis: ">700",
    dessert_commerces: true,
    nb_commerces: 80,
    mode_recrutement: ["Bouton de commande", "Prospection terrain"],
    choix_libre_menage: "Assigné par la Mairie",
    refus_menages: false,
    raisons_refus_menages: [],
    exemple_refus: null,
    zone_geographique_definie: true,
    modalite_definition_zone: ["Zonage exclusif communal"],
    conflits_territoriaux: "Jamais",
    nb_collecteurs: ">15",
    exclusivite_collecteurs: "Oui",
    engins_utilises: ["Camions benne 5t", "Tricycles à moteur"],
    decision_affectation: "Optimisation par quartier",
    refus_collecteur: false,
    canaux_demandes: ["Application mobile", "Appel téléphonique direct"],
    type_prestation: "Mixte",
    fixation_horaire: "Flexible",
    demandes_en_attente: "Non",
    etapes_collecte: "Tournée du matin en tricycle -> Vidage camion -> Décharge finale",
    duree_tournee_heures: 6.0,
    confirmation_collecte: "Notification SMS automatique",
    gestion_imprevus: "Camion de remplacement",
    lieu_decharge: ["Point d'apport Kipé", "ZST Enta"],
    voyages_par_jour: 8,
    frequence_saturation_transit: "Permanente",
    temps_attente_transit: ">2h",
    systeme_incidents: true,
    initiative_annulation: ["Panne mécanique camion"],
    procedure_annulation: "Avis diffusé sur le canal WhatsApp",
    modes_paiement_recus: ["Orange Money", "MTN Money", "Espèces"],
    part_especes_vs_mobile: "30% Espèces / 70% Mobile Money",
    moment_paiement: "À l'acte",
    politique_impayes: "Relance automatique puis pénalité",
    remuneration_collecteurs: "Pourcentage sur les encaissements",
    frequence_paie_collecteurs: "Semaine",
    suivi_comptable_collecteurs: "Logiciel de comptabilité dédié",
    difficultes_rencontrees: ["Embouteillages axes principaux", "Panne récurrente des caissons de transit"],
    outil_numerique_actuel: "Logiciel",
    interet_labal: "Oui",
    modules_prioritaires: ["Suivi de la flotte en temps réel", "Gestion automatisée des litiges de caisse"],
    capacite_smartphone_collecteurs: "90% équipés de smartphones",
    nom_contact: "Aissatou Bah",
    telephone_contact: "+224 628 45 67 89",
    accord_recontact: true
  }
];

const menagesData = [
  {
    nom_repondant: "Fatoumata Camara",
    email: "fatou.camara@gmail.com",
    nb_personnes_foyer: 6,
    type_habitation: "Maison individuelle",
    commune: "Dixinn",
    quartier: "Camayenne",
    reperes_visuels: "Près de la mosquée Kébé",
    accessibilite: "Camion",
    mode_evacuation: "PME de pré-collecte abonnée",
    nom_pme_connue: "GIE Guinée Propre",
    libre_choix_collecteur: "Oui",
    a_change_collecteur: false,
    motifs_insatisfaction: [],
    nb_sacs_semaine: 4,
    typologie_dechets: ["Restes alimentaires (orgniques)", "Plastiques & Bouteilles", "Emballages carton"],
    alerte_ramassage_actuelle: "Jours fixes connus (Mardi/Vendredi)",
    bacs_debordants_7_jours: false,
    interet_bouton_commande: true,
    respect_horaire: "En général respecté",
    notification_approche: true,
    suivi_carte_temps_reel: true,
    preuve_passage: "Reçu papier déposé sous la porte",
    procedure_absence: "Dépôt du bac devant le portail",
    tri_actuel: true,
    facteurs_stimulants: ["Réduction sur l'abonnement mensuel", "Bacs de tri de couleurs différentes offerts"],
    connaissance_risques: ["Maladies vectorielles (Paludisme, Choléra)", "Inondation des caniveaux obstrués"],
    pret_modules_video: true,
    montant_mensuel_gnf: 45000,
    perception_qualite_prix: "Acceptable",
    mode_paiement: "Orange Money",
    recu_papier: true,
    conflit_paiement: false,
    possession_smartphone: true,
    frequence_mobile_money: "Quotidienne",
    applications_favorites: "WhatsApp, Facebook, Orange Money",
    pret_installer_labal: true,
    telephone_groupe_test: "+224 621 88 99 00",
    suggestions_amelioration: "Fournir des poubelles codées par couleur pour le tri à domicile"
  },
  {
    nom_repondant: "Ousmane Bangoura",
    email: "o.bangoura@yahoo.fr",
    nb_personnes_foyer: 8,
    type_habitation: "Concession familiale",
    commune: "Ratoma",
    quartier: "Cosa",
    reperes_visuels: "Derrière le marché de Cosa",
    accessibilite: "Tricycle",
    mode_evacuation: "Apport au point de regroupement / transit",
    motif_non_abonne: "Prix trop élevé des PME",
    nom_pme_connue: "PME Conakry Assainissement",
    libre_choix_collecteur: "Non",
    a_change_collecteur: true,
    motifs_insatisfaction: ["Passages très irréguliers", "Augmentation brutale des tarifs", "Comportement irrespectueux des ramasseurs"],
    nb_sacs_semaine: 6,
    typologie_dechets: ["Restes alimentaires (orgniques)", "Sacs plastiques noirs (Fouda)", "Verre & Métal"],
    alerte_ramassage_actuelle: "Aucune alerte",
    bacs_debordants_7_jours: true,
    interet_bouton_commande: true,
    respect_horaire: "Très irrégulier",
    notification_approche: false,
    suivi_carte_temps_reel: true,
    preuve_passage: "Aucune preuve",
    procedure_absence: "Les ordures restent à la maison",
    tri_actuel: false,
    facteurs_stimulants: ["Sensibilisation dans le quartier", "Ramassage plus régulier"],
    connaissance_risques: ["Pollution de la nappe phréatique", "Odeurs nauséabondes"],
    pret_modules_video: true,
    montant_mensuel_gnf: 30000,
    perception_qualite_prix: "Cher pour le service fourni",
    mode_paiement: "Espèces",
    recu_papier: false,
    conflit_paiement: true,
    possession_smartphone: true,
    frequence_mobile_money: "Hebdomadaire",
    applications_favorites: "WhatsApp, IMO",
    pret_installer_labal: true,
    telephone_groupe_test: "+224 669 11 22 33",
    suggestions_amelioration: "Assurer une présence fixe des tricycles tous les 2 jours"
  }
];

const transitData = [
  {
    nom_site: "Zone de Transit & Tri (ZST) Coronthie",
    email_responsable: "zst.coronthie@kaloum.gov.gn",
    statut_site: "Officiel aménagé",
    entite_gestionnaire: "Direction Communale de l'Assainissement Kaloum",
    commune: "Kaloum",
    quartier_repere: "Coronthie 1 près du port",
    capacite_caissons: 4,
    cloture_dalle: true,
    equipements: ["Caissons ampliroll (30m³)", "Rampes d'accès bétonnées", "Éclairage solaire LED", "Point d'eau d'hygiène"],
    presence_pont_bascule: true,
    tri_sur_place: true,
    filieres_triees: ["Plastiques durs (PET/PEHD)", "Métaux & Ferraille", "Canettes aluminium", "Cartons compactés"],
    nb_trieurs: 14,
    acheteurs: "Usine de recyclage Top-Plastic & Récupérateurs locaux",
    nb_pme_clientes: 12,
    nb_rotations_quotidiennes: 18,
    tranches_horaires_pointe: "08h00 - 11h00 & 16h00 - 18h00",
    acces_limite_agrees: true,
    redevance_deversement: true,
    refus_acces: false,
    causes_refus: [],
    outil_enregistrement: "Registre papier",
    donnees_consignees: ["Identité PME / Tricycle", "Heure de décharge", "Volume estimé (caissons)", "Montant redevance perçue"],
    frequence_rotation: "3-4 fois/jour",
    prestataire_transporteur: "Société Albayrak / Mairie",
    frequence_saturation: "Quotidienne",
    consequences_environnementales: "Débordement des caissons sur la chaussée lors des retards de camion benne",
    causes_blocage: ["Pannes répétées des camions ampliroll", "Pluies diluviennes inondant la dalle", "Embouteillages du centre-ville"],
    duree_max_blocage: "24 heures",
    canal_alerte_mairie: "Appel direct au Directeur Technique Mairie + WhatsApp",
    delai_reaction_communal: "2 à 4 heures",
    encaissements_especes_vs_mobile: "70% Espèces / 30% Mobile Money",
    litiges_caisse: false,
    dotation_epi: ["Gants de protection renforcés", "Gilets haute visibilité", "Bottes de sécurité coquées", "Masques anti-poussière"],
    nuisances_vecteurs: "Moustiques en saison des pluies, mouches et odeurs lors des saturations",
    local_securise_courant: true,
    qualite_reseau_4g: "Excellente 4G",
    smartphone_fonction: true,
    bouton_alerte_sos: true,
    suivi_gps_camions: true,
    contact_responsable: "Sekouba Camara (Chef de Site)",
    suggestions_amenagement: "Installer une deuxième bascule et abriter la zone de tri du soleil"
  }
];

const autoritesData = [
  {
    nom_repondant: "Dr. Alpha Oumar Diallo",
    titre_fonction: "Directeur Communal de l'Assainissement",
    entite: "Mairie de Kaloum",
    commune: "Kaloum",
    nb_pme_conventionnees: 14,
    convention_conaag: true,
    cahier_charges: true,
    zonage_exclusif: true,
    disponibilite_sig: true,
    nb_points_noirs: 12,
    causes_points_noirs: ["Enclavement du quartier", "Refus de payer des ménages", "Saturation du transit"],
    flotte_communale: ["Bennes ampliroll", "Camions benne", "Tricycles de la Mairie"],
    capacite_4_transferts: true,
    mode_gestion_decharge: "Régie communale directe avec soutien ANASP",
    obstacles_transport: ["Panne récurrente des camions", "Embouteillages aux heures de pointe"],
    sources_financement: ["Budget propre de la Mairie", "Subvention de l'État", "Taxe d'insalubrité sur patentes"],
    recouvrement_redevances: "Faible (<30% de recouvrement)",
    canal_reclamations: "Numéro vert communal + Réunion du conseil de quartier",
    delai_resorption: "24 à 48 heures",
    controles_inopines: true,
    sanctions_recentes: true,
    actions_education: "Campagnes de sensibilisation mensuelles dans les marchés et écoles",
    synergie_sanita: true,
    projets_valorisation: "Projet de compostage des déchets organiques des marchés",
    avis_suppression_liquide: "Très favorable - Garantit la transparence et élimine la déperdition",
    volonte_mobile_money_obligatoire: true,
    correlation_ordures_maladies: true,
    liens_centres_sante: "Rapports hebdomadaires partagés avec la Direction Communale de la Santé",
    format_consolidation: "Excel",
    frequence_reporting: "Mensuel",
    ordinateurs_mairie: true,
    smartphone_agents_terrain: true,
    besoins_dashboard: ["Cartographie en temps réel des points noirs", "Suivi du taux de recouvrement des PME", "Alerte de saturation des ZST"],
    point_focal_designe: true,
    coordonnees_point_focal: "Dr. Alpha Oumar Diallo - +224 622 00 11 22",
    recommandations: "Digitaliser en priorité le paiement des abonnements PME via Lâbal"
  }
];

async function seed() {
  console.log("🌱 Insertion PME...");
  await insertTable("enquetes_pme", pmeData);

  console.log("🌱 Insertion Ménages...");
  await insertTable("enquetes_menages", menagesData);

  console.log("🌱 Insertion Transit...");
  await insertTable("enquetes_transit", transitData);

  console.log("🌱 Insertion Autorités...");
  await insertTable("enquetes_autorites", autoritesData);

  console.log("\n🎉 Opération terminée avec succès !");
}

seed();
