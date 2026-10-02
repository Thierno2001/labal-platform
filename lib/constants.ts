// Labal Platform — Design Tokens & Constants

// ============================================================
// CHARTE GRAPHIQUE
// ============================================================
export const COLORS = {
  /** Fond neutre universel */
  white: '#FFFFFF',
  /** Couleur structurelle & typographique — textes, titres, bordures */
  deep: '#064420',
  /** Couleur d'accent & impact — boutons CTA, KPIs, barres de progression */
  lime: '#76C01D',
  /** Nuances auxiliaires */
  grayLight: '#F8FAF9',
  grayMedium: '#E5E7EB',
  grayDark: '#6B7280',
} as const;

// ============================================================
// COMMUNES DE CONAKRY
// ============================================================
export const COMMUNES = [
  'Kaloum',
  'Dixinn',
  'Matam',
  'Ratoma',
  'Matoto',
] as const;

export type Commune = (typeof COMMUNES)[number];

// ============================================================
// OPTIONS RÉUTILISABLES POUR LES FORMULAIRES
// ============================================================

export const AFFILIATION_CONAAG_OPTIONS = ['Oui', 'Non', 'En cours'] as const;

export const NB_MENAGES_OPTIONS = ['<100', '100-300', '300-700', '>700'] as const;

export const NB_COLLECTEURS_OPTIONS = ['1-3', '4-7', '8-15', '>15'] as const;

export const ENGINS_OPTIONS = [
  'Bacs roulants',
  'Charrettes à bras',
  'Tricycles motorisés',
  'Bennes tasseuses',
  'Camionnettes',
] as const;

export const CANAUX_DEMANDES_OPTIONS = [
  'Appels téléphoniques',
  'WhatsApp',
  'Passage au bureau',
  'Contact sur le terrain',
] as const;

export const TYPE_PRESTATION_OPTIONS = [
  'À la demande',
  'Abonnement régulier',
  'Mixte',
] as const;

export const FREQUENCE_SATURATION_OPTIONS = [
  'Permanente',
  'Souvent',
  'Rarement',
] as const;

export const TEMPS_ATTENTE_OPTIONS = ['<15min', '15-30min', '30-60min', '>2h'] as const;

export const MODES_PAIEMENT_OPTIONS = [
  'Espèces',
  'Orange Money',
  'MTN Money',
] as const;

export const MOMENT_PAIEMENT_OPTIONS = [
  'Avance',
  'À l\'acte',
  'Fin de mois',
] as const;

export const FREQUENCE_PAIE_OPTIONS = ['Jour', 'Semaine', 'Mois'] as const;

export const DIFFICULTES_PME_OPTIONS = [
  'Perte de reçus papier',
  'Litiges de paiement récurrents',
  'Retards de caisse',
  'Trajets à vide',
  'Saturation des zones de transit',
] as const;

export const OUTIL_NUMERIQUE_OPTIONS = [
  'Aucun',
  'WhatsApp',
  'Excel',
  'Logiciel',
] as const;

export const INTERET_LABAL_OPTIONS = ['Oui', 'Non', 'Peut-être'] as const;

export const MODULES_PRIORITAIRES_OPTIONS = [
  'GPS tournées en temps réel',
  'Paiement Orange/MTN Money intégré',
  'Alerte saturation transit',
  'Tableau de bord analytique',
  'Facturation automatisée',
] as const;

export const LIEU_DECHARGE_OPTIONS = [
  'Zone de transit officielle',
  'Bacs publics communaux',
  'Site informel',
  'Décharge de Minière',
] as const;

export const RAISONS_REFUS_MENAGES_OPTIONS = [
  'Hors zone de couverture',
  'Ruelles inaccessibles aux engins',
  'Capacité maximale atteinte',
  'Historique d\'impayés',
  'Déchets non conformes',
] as const;

export const RAISONS_REFUS_COLLECTEUR_OPTIONS = [
  'Distance excessive',
  'Déchets toxiques/dangereux',
  'Insécurité du quartier',
  'Panne de matériel',
  'Désaccord sur la rémunération',
] as const;

export const MODALITE_ZONE_OPTIONS = [
  'Par quartiers administratifs',
  'Par communes',
  'Accords informels entre PME',
  'Repères naturels (rivières, routes)',
] as const;

export const CONFLITS_TERRITORIAUX_OPTIONS = [
  'Fréquent',
  'Parfois',
  'Jamais',
] as const;

export const MODE_RECRUTEMENT_OPTIONS = [
  'Porte-à-porte',
  'Bouche-à-oreille / recommandation',
  'Affichage local',
  'Via le chef de quartier',
  'Réseaux sociaux / WhatsApp',
] as const;

export const CONFIRMATION_COLLECTE_OPTIONS = [
  'Appel du collecteur',
  'Confirmation par le ménage',
  'Validation par un superviseur',
  'Aucune confirmation',
] as const;

export const INITIATIVE_ANNULATION_OPTIONS = [
  'Le ménage annule',
  'Le collecteur annule',
  'La PME réorganise',
] as const;

// Ménages
export const TYPE_HABITATION_OPTIONS = [
  'Maison individuelle',
  'Concession familiale',
  'Immeuble / Appartement',
  'Commerce / Bureau',
] as const;

export const ACCESSIBILITE_OPTIONS = [
  'Camion',
  'Tricycle',
  'Piéton uniquement',
] as const;

export const MODE_EVACUATION_OPTIONS = [
  'PME privée (abonnement)',
  'Bac communal public',
  'Jeunes collecteurs informels',
  'Brûlage à domicile',
  'Dépôt dans les caniveaux',
  'Aucun service',
] as const;

export const TYPOLOGIE_DECHETS_OPTIONS = [
  'Organique (alimentaire)',
  'Bouteilles/sachets plastique',
  'Cartons et papiers',
  'Branchages et feuilles',
  'Gravats et débris',
] as const;

export const FACTEURS_TRI_OPTIONS = [
  'Bacs colorés de tri fournis',
  'Remise sur l\'abonnement',
  'Points cadeaux fidélité',
  'Conseils et sensibilisation',
] as const;

export const RISQUES_SANITAIRES_OPTIONS = [
  'Paludisme (moustiques / eaux stagnantes)',
  'Inondations récurrentes',
  'Maladies diarrhéiques',
  'Infections respiratoires',
] as const;

// Transit
export const STATUT_SITE_OPTIONS = [
  'Officiel aménagé',
  'Temporaire',
  'Quai de transfert',
] as const;

export const ENTITE_GESTIONNAIRE_OPTIONS = [
  'Mairie communale',
  'PME privée',
  'CONAAG',
  'Sanita SA',
] as const;

export const EQUIPEMENTS_TRANSIT_OPTIONS = [
  'Bennes ampliroll',
  'Bacs 660L',
  'Tas au sol',
] as const;

export const FILIERES_TRI_OPTIONS = [
  'PET (bouteilles plastique)',
  'Plastique dur',
  'Métaux ferreux',
  'Canettes aluminium',
  'Compost organique',
] as const;

export const OUTIL_ENREGISTREMENT_OPTIONS = [
  'Registre papier',
  'Feuilles volantes',
  'Excel',
  'Aucun',
] as const;

export const FREQUENCE_ROTATION_OPTIONS = [
  '1 fois/jour',
  '2 fois/jour',
  '3-4 fois/jour',
  '<1 fois/irrégulier',
] as const;

export const FREQUENCE_SATURATION_TRANSIT_OPTIONS = [
  'Quotidienne',
  'Hebdomadaire',
  'Occasionnelle',
] as const;

export const CAUSES_BLOCAGE_OPTIONS = [
  'Camions ampliroll en panne',
  'Pénurie de carburant',
  'Voie vers la décharge finale coupée',
  'Chauffeurs absents',
] as const;

export const CAUSES_REFUS_ACCES_OPTIONS = [
  'Saturation complète du site',
  'Déchets toxiques interdits',
  'PME sans agrément',
  'Litige d\'impayé redevance',
] as const;

export const DOTATION_EPI_OPTIONS = [
  'Gants de protection',
  'Bottes',
  'Masques',
  'Combinaisons',
] as const;

// Autorités
export const ENTITE_AUTORITE_OPTIONS = [
  'Mairie communale',
  'Ministère de l\'Environnement',
  'ANASP',
  'Partenaire technique (ONG/Bailleur)',
] as const;

export const FLOTTE_COMMUNALE_OPTIONS = [
  'Bennes ampliroll',
  'Chargeuses',
  'Tasseurs',
  'Camions benne',
] as const;

export const OBSTACLES_TRANSPORT_OPTIONS = [
  'Embouteillages chroniques',
  'Maintenance insuffisante',
  'Pénurie de carburant',
  'Budget insuffisant',
] as const;

export const SOURCES_FINANCEMENT_OPTIONS = [
  'Budget général communal',
  'Taxe d\'assainissement locale',
  'Subventions bailleurs internationaux',
  'Redevances PME',
] as const;

export const CAUSES_POINTS_NOIRS_OPTIONS = [
  'Enclavement du quartier',
  'Refus de payer des ménages',
  'Saturation du transit',
  'Absence de PME dans la zone',
] as const;

export const BESOINS_DASHBOARD_OPTIONS = [
  'Cartographie interactive dynamique',
  'Suivi des camions en temps réel',
  'Export de rapports en 1 clic',
  'Gestion des alertes citoyennes',
  'Consolidation automatique des tonnages',
] as const;

export const FORMAT_CONSOLIDATION_OPTIONS = [
  'Papier',
  'Excel',
  'Aucun',
] as const;

// ============================================================
// LABELS DES SECTIONS PAR FORMULAIRE
// ============================================================

export const PME_SECTION_LABELS = [
  'Adresse & Identification',
  'Couverture géographique',
  'Recrutement des ménages',
  'Raisons du refus',
  'Zones & Exclusivité',
  'Délimitation de la zone',
  'Organisation des collecteurs',
  'Motifs de refus collecteur',
  'Gestion des demandes',
  'Déroulement d\'une tournée',
  'Décharge & Zones de Transit',
  'Incidents & Litiges',
  'Tarification & Paiements',
  'Rémunération des collecteurs',
  'Difficultés & Outils',
  'Attentes Labal',
] as const;

export const MENAGES_SECTION_LABELS = [
  'Identification du ménage',
  'Localisation géographique',
  'Mode d\'évacuation actuel',
  'Choix et adhésion',
  'Motifs d\'insatisfaction',
  'Volume et nature des déchets',
  'Commande & Demande',
  'Ponctualité & Suivi',
  'Confirmation & Absence',
  'Pratiques de tri',
  'Sensibilisation sanitaire',
  'Budget assainissement',
  'Pratiques de paiement',
  'Détail des litiges',
  'Usage numérique',
  'Intérêt Labal',
] as const;

export const TRANSIT_SECTION_LABELS = [
  'Identification du site',
  'Emplacement & Caractéristiques',
  'Équipements disponibles',
  'Tri & Valorisation',
  'Flux entrants PME',
  'Régulation de l\'accès',
  'Causes de refus',
  'Enregistrement des volumes',
  'Transfert décharge finale',
  'Gravité de la saturation',
  'Facteurs de blocage',
  'Coordination institutionnelle',
  'Suivi financier',
  'Hygiène & Protection',
  'Environnement numérique',
  'Attentes Labal',
] as const;

export const AUTORITES_SECTION_LABELS = [
  'Identification de l\'autorité',
  'Cadre légal & PME',
  'Organisation spatiale',
  'Décharges sauvages',
  'Équipements de transfert',
  'Gestion décharge finale',
  'Équilibre financier',
  'Signalements citoyens',
  'Répression & Conformité',
  'Tri & Sensibilisation',
  'Transparence financière',
  'Santé publique',
  'Statistiques & Rapports',
  'Équipement technique',
  'Attentes Dashboard Labal',
  'Engagement pilote Labal',
] as const;
