-- ============================================================
-- LÂBAL — Schéma PostgreSQL / Supabase
-- Plateforme de Gestion et Enquête Déchets — Guinée (Conakry)
-- ============================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE 1 : ENQUÊTES PME DE COLLECTE & COLLECTEURS (CONAAG)
-- ============================================================
CREATE TABLE IF NOT EXISTS enquetes_pme (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Section 1 : Identification
  email TEXT,
  nom_structure TEXT NOT NULL,
  affilie_conaag TEXT CHECK (affilie_conaag IN ('Oui', 'Non', 'En cours')),
  type_structure TEXT,
  num_agrement TEXT,
  annee_creation INT,

  -- Section 2 : Couverture géographique
  communes JSONB DEFAULT '[]'::jsonb,
  quartiers TEXT,
  nb_menages_desservis TEXT CHECK (nb_menages_desservis IN ('<100', '100-300', '300-700', '>700')),
  dessert_commerces BOOLEAN DEFAULT false,
  nb_commerces INT DEFAULT 0,

  -- Section 3 : Relation et recrutement des ménages
  mode_recrutement JSONB DEFAULT '[]'::jsonb,
  choix_libre_menage TEXT,
  refus_menages BOOLEAN DEFAULT false,

  -- Section 4 : Raisons du refus (conditionnel si refus_menages = true)
  raisons_refus_menages JSONB DEFAULT '[]'::jsonb,
  exemple_refus TEXT,

  -- Section 5 : Zones géographiques & Exclusivité
  zone_geographique_definie BOOLEAN DEFAULT false,

  -- Section 6 : Modalités de délimitation (conditionnel si zone_geographique_definie = true)
  modalite_definition_zone JSONB DEFAULT '[]'::jsonb,
  conflits_territoriaux TEXT CHECK (conflits_territoriaux IN ('Fréquent', 'Parfois', 'Jamais')),

  -- Section 7 : Organisation et affectation des collecteurs
  nb_collecteurs TEXT CHECK (nb_collecteurs IN ('1-3', '4-7', '8-15', '>15')),
  exclusivite_collecteurs TEXT CHECK (exclusivite_collecteurs IN ('Oui', 'Non')),
  engins_utilises JSONB DEFAULT '[]'::jsonb,
  decision_affectation TEXT,
  refus_collecteur BOOLEAN DEFAULT false,

  -- Section 8 : Motifs de refus collecteurs (conditionnel)
  raisons_refus_collecteur JSONB DEFAULT '[]'::jsonb,

  -- Section 9 : Gestion des demandes de collecte
  canaux_demandes JSONB DEFAULT '[]'::jsonb,
  type_prestation TEXT CHECK (type_prestation IN ('À la demande', 'Abonnement régulier', 'Mixte')),
  fixation_horaire TEXT,
  demandes_en_attente TEXT CHECK (demandes_en_attente IN ('Oui', 'Non')),

  -- Section 10 : Déroulement opérationnel
  etapes_collecte TEXT,
  duree_tournee_heures NUMERIC,
  confirmation_collecte TEXT,
  gestion_imprevus TEXT,

  -- Section 11 : Décharge aux ZST & Goulets
  lieu_decharge JSONB DEFAULT '[]'::jsonb,
  voyages_par_jour INT,
  frequence_saturation_transit TEXT CHECK (frequence_saturation_transit IN ('Permanente', 'Souvent', 'Rarement')),
  temps_attente_transit TEXT CHECK (temps_attente_transit IN ('<15min', '15-30min', '30-60min', '>2h')),

  -- Section 12 : Annulations, incidents & litiges
  systeme_incidents BOOLEAN DEFAULT false,
  initiative_annulation JSONB DEFAULT '[]'::jsonb,
  procedure_annulation TEXT,

  -- Section 13 : Modèle tarifaire & Paiements
  modes_paiement_recus JSONB DEFAULT '[]'::jsonb,
  part_especes_vs_mobile TEXT,
  moment_paiement TEXT CHECK (moment_paiement IN ('Avance', 'À l''acte', 'Fin de mois')),
  politique_impayes TEXT,

  -- Section 14 : Rémunération des collecteurs
  remuneration_collecteurs TEXT,
  frequence_paie_collecteurs TEXT CHECK (frequence_paie_collecteurs IN ('Jour', 'Semaine', 'Mois')),
  suivi_comptable_collecteurs TEXT,

  -- Section 15 : Difficultés & Outils actuels
  difficultes_rencontrees JSONB DEFAULT '[]'::jsonb,
  outil_numerique_actuel TEXT CHECK (outil_numerique_actuel IN ('Aucun', 'WhatsApp', 'Excel', 'Logiciel')),
  nom_logiciel TEXT,

  -- Section 16 : Attentes Lâbal
  interet_labal TEXT CHECK (interet_labal IN ('Oui', 'Non', 'Peut-être')),
  modules_prioritaires JSONB DEFAULT '[]'::jsonb,
  capacite_smartphone_collecteurs TEXT,
  nom_contact TEXT,
  telephone_contact TEXT,
  accord_recontact BOOLEAN DEFAULT false
);

-- Index enquetes_pme
CREATE INDEX idx_pme_created_at ON enquetes_pme (created_at DESC);
CREATE INDEX idx_pme_communes ON enquetes_pme USING GIN (communes);
CREATE INDEX idx_pme_modes_paiement ON enquetes_pme USING GIN (modes_paiement_recus);
CREATE INDEX idx_pme_difficultes ON enquetes_pme USING GIN (difficultes_rencontrees);

-- ============================================================
-- TABLE 2 : ENQUÊTES MÉNAGES & CITOYENS (USAGERS)
-- ============================================================
CREATE TABLE IF NOT EXISTS enquetes_menages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Section 1 : Identification du ménage
  email TEXT,
  nom_repondant TEXT NOT NULL,
  nb_personnes_foyer INT,
  type_habitation TEXT,

  -- Section 2 : Localisation géographique
  commune TEXT,
  quartier TEXT,
  reperes_visuels TEXT,
  accessibilite TEXT CHECK (accessibilite IN ('Camion', 'Tricycle', 'Piéton uniquement')),

  -- Section 3 : Mode actuel d'évacuation
  mode_evacuation TEXT,
  motif_non_abonne TEXT,
  nom_pme_connue TEXT,

  -- Section 4 : Choix et adhésion
  libre_choix_collecteur TEXT,
  a_change_collecteur BOOLEAN DEFAULT false,

  -- Section 5 : Motifs d'insatisfaction (conditionnel si a_change_collecteur = true)
  motifs_insatisfaction JSONB DEFAULT '[]'::jsonb,

  -- Section 6 : Volume et nature des déchets
  nb_sacs_semaine INT,
  typologie_dechets JSONB DEFAULT '[]'::jsonb,

  -- Section 7 : Commande & Demande
  alerte_ramassage_actuelle TEXT,
  bacs_debordants_7_jours BOOLEAN DEFAULT false,
  interet_bouton_commande BOOLEAN DEFAULT false,

  -- Section 8 : Ponctualité & Suivi
  respect_horaire TEXT,
  notification_approche BOOLEAN DEFAULT false,
  suivi_carte_temps_reel BOOLEAN DEFAULT false,

  -- Section 9 : Confirmation & Absence
  preuve_passage TEXT,
  procedure_absence TEXT,

  -- Section 10 : Pratiques de tri à domicile
  tri_actuel BOOLEAN DEFAULT false,
  facteurs_stimulants JSONB DEFAULT '[]'::jsonb,

  -- Section 11 : Sensibilisation & Risques sanitaires
  connaissance_risques JSONB DEFAULT '[]'::jsonb,
  pret_modules_video BOOLEAN DEFAULT false,

  -- Section 12 : Budget ménage
  montant_mensuel_gnf INT,
  perception_qualite_prix TEXT,

  -- Section 13 : Pratiques de paiement
  mode_paiement TEXT,
  recu_papier BOOLEAN DEFAULT false,
  conflit_paiement BOOLEAN DEFAULT false,

  -- Section 14 : Détail des litiges (conditionnel si conflit_paiement = true)
  nature_differend TEXT,
  resolution_litige TEXT,

  -- Section 15 : Usage numérique personnel
  possession_smartphone BOOLEAN DEFAULT false,
  frequence_mobile_money TEXT,
  applications_favorites TEXT,

  -- Section 16 : Intérêt Lâbal & Contact
  pret_installer_labal BOOLEAN DEFAULT false,
  telephone_groupe_test TEXT,
  suggestions_amelioration TEXT
);

-- Index enquetes_menages
CREATE INDEX idx_menages_created_at ON enquetes_menages (created_at DESC);
CREATE INDEX idx_menages_commune ON enquetes_menages (commune);
CREATE INDEX idx_menages_motifs ON enquetes_menages USING GIN (motifs_insatisfaction);
CREATE INDEX idx_menages_typologie ON enquetes_menages USING GIN (typologie_dechets);

-- ============================================================
-- TABLE 3 : ENQUÊTES ZONES DE TRANSIT & TRI (ZST / PA)
-- ============================================================
CREATE TABLE IF NOT EXISTS enquetes_transit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Section 1 : Identification du site
  email_responsable TEXT,
  nom_site TEXT NOT NULL,
  statut_site TEXT CHECK (statut_site IN ('Officiel aménagé', 'Temporaire', 'Quai de transfert')),
  entite_gestionnaire TEXT,

  -- Section 2 : Emplacement et caractéristiques
  commune TEXT,
  quartier_repere TEXT,
  capacite_caissons INT,
  cloture_dalle BOOLEAN DEFAULT false,

  -- Section 3 : Équipements disponibles
  equipements JSONB DEFAULT '[]'::jsonb,
  presence_pont_bascule BOOLEAN DEFAULT false,
  tri_sur_place BOOLEAN DEFAULT false,

  -- Section 4 : Tri et valorisation informelle (conditionnel si tri_sur_place = true)
  filieres_triees JSONB DEFAULT '[]'::jsonb,
  nb_trieurs INT,
  acheteurs TEXT,

  -- Section 5 : Flux entrants PME
  nb_pme_clientes INT,
  nb_rotations_quotidiennes INT,
  tranches_horaires_pointe TEXT,

  -- Section 6 : Régulation de l'accès
  acces_limite_agrees BOOLEAN DEFAULT false,
  redevance_deversement BOOLEAN DEFAULT false,
  refus_acces BOOLEAN DEFAULT false,

  -- Section 7 : Causes de refus d'accès (conditionnel si refus_acces = true)
  causes_refus JSONB DEFAULT '[]'::jsonb,

  -- Section 8 : Enregistrement des volumes
  outil_enregistrement TEXT CHECK (outil_enregistrement IN ('Registre papier', 'Feuilles volantes', 'Excel', 'Aucun')),
  donnees_consignees JSONB DEFAULT '[]'::jsonb,

  -- Section 9 : Transfert vers la décharge finale
  frequence_rotation TEXT CHECK (frequence_rotation IN ('1 fois/jour', '2 fois/jour', '3-4 fois/jour', '<1 fois/irrégulier')),
  prestataire_transporteur TEXT,

  -- Section 10 : Gravité de la saturation
  frequence_saturation TEXT CHECK (frequence_saturation IN ('Quotidienne', 'Hebdomadaire', 'Occasionnelle')),
  consequences_environnementales TEXT,

  -- Section 11 : Facteurs de blocage
  causes_blocage JSONB DEFAULT '[]'::jsonb,
  duree_max_blocage TEXT,

  -- Section 12 : Coordination institutionnelle
  canal_alerte_mairie TEXT,
  delai_reaction_communal TEXT,

  -- Section 13 : Suivi financier
  encaissements_especes_vs_mobile TEXT,
  litiges_caisse BOOLEAN DEFAULT false,

  -- Section 14 : Hygiène et protection
  dotation_epi JSONB DEFAULT '[]'::jsonb,
  nuisances_vecteurs TEXT,

  -- Section 15 : Environnement numérique
  local_securise_courant BOOLEAN DEFAULT false,
  qualite_reseau_4g TEXT,
  smartphone_fonction BOOLEAN DEFAULT false,

  -- Section 16 : Attentes Lâbal & Urgence
  bouton_alerte_sos BOOLEAN DEFAULT false,
  suivi_gps_camions BOOLEAN DEFAULT false,
  contact_responsable TEXT,
  suggestions_amenagement TEXT
);

-- Index enquetes_transit
CREATE INDEX idx_transit_created_at ON enquetes_transit (created_at DESC);
CREATE INDEX idx_transit_commune ON enquetes_transit (commune);
CREATE INDEX idx_transit_equipements ON enquetes_transit USING GIN (equipements);
CREATE INDEX idx_transit_causes_blocage ON enquetes_transit USING GIN (causes_blocage);

-- ============================================================
-- TABLE 4 : ENQUÊTES AUTORITÉS LOCALES, MAIRIES & SUPERVISEURS
-- ============================================================
CREATE TABLE IF NOT EXISTS enquetes_autorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Section 1 : Identification de l'autorité
  nom_repondant TEXT NOT NULL,
  titre_fonction TEXT,
  entite TEXT,
  commune TEXT,

  -- Section 2 : Cadre légal et PME
  nb_pme_conventionnees INT,
  convention_conaag BOOLEAN DEFAULT false,
  cahier_charges BOOLEAN DEFAULT false,

  -- Section 3 : Organisation spatiale
  zonage_exclusif BOOLEAN DEFAULT false,
  disponibilite_sig BOOLEAN DEFAULT false,

  -- Section 4 : Diagnostic décharges sauvages
  nb_points_noirs INT,
  causes_points_noirs JSONB DEFAULT '[]'::jsonb,

  -- Section 5 : Équipements de transfert secondaire
  flotte_communale JSONB DEFAULT '[]'::jsonb,
  capacite_4_transferts BOOLEAN DEFAULT false,

  -- Section 6 : Gestion décharge finale
  mode_gestion_decharge TEXT,
  obstacles_transport JSONB DEFAULT '[]'::jsonb,

  -- Section 7 : Équilibre financier communal
  sources_financement JSONB DEFAULT '[]'::jsonb,
  recouvrement_redevances TEXT,

  -- Section 8 : Traitement des signalements citoyens
  canal_reclamations TEXT,
  delai_resorption TEXT,

  -- Section 9 : Répression et conformité
  controles_inopines BOOLEAN DEFAULT false,
  sanctions_recentes BOOLEAN DEFAULT false,

  -- Section 10 : Tri sélectif & Sensibilisation
  actions_education TEXT,
  synergie_sanita BOOLEAN DEFAULT false,
  projets_valorisation TEXT,

  -- Section 11 : Transparence financière
  avis_suppression_liquide TEXT,
  volonte_mobile_money_obligatoire BOOLEAN DEFAULT false,

  -- Section 12 : Santé publique & Salubrité
  correlation_ordures_maladies BOOLEAN DEFAULT false,
  liens_centres_sante TEXT,

  -- Section 13 : Statistiques et rapports
  format_consolidation TEXT CHECK (format_consolidation IN ('Papier', 'Excel', 'Aucun')),
  frequence_reporting TEXT,

  -- Section 14 : Équipement des équipes techniques
  ordinateurs_mairie BOOLEAN DEFAULT false,
  smartphone_agents_terrain BOOLEAN DEFAULT false,

  -- Section 15 : Attentes Dashboard Lâbal
  besoins_dashboard JSONB DEFAULT '[]'::jsonb,

  -- Section 16 : Engagement pilote Lâbal
  point_focal_designe BOOLEAN DEFAULT false,
  coordonnees_point_focal TEXT,
  recommandations TEXT
);

-- Index enquetes_autorites
CREATE INDEX idx_autorites_created_at ON enquetes_autorites (created_at DESC);
CREATE INDEX idx_autorites_commune ON enquetes_autorites (commune);
CREATE INDEX idx_autorites_causes ON enquetes_autorites USING GIN (causes_points_noirs);
CREATE INDEX idx_autorites_besoins ON enquetes_autorites USING GIN (besoins_dashboard);

-- ============================================================
-- VUES D'AGRÉGATION STATISTIQUE
-- ============================================================

-- Vue 1 : Statistiques globales par acteur
CREATE OR REPLACE VIEW vue_statistiques_globales WITH (security_invoker = true) AS
SELECT
  'PME' AS type_acteur,
  COUNT(*) AS total_enquetes,
  COUNT(*) FILTER (WHERE interet_labal = 'Oui') AS prets_labal,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE interet_labal = 'Oui') / NULLIF(COUNT(*), 0), 1
  ) AS pct_prets_labal,
  COUNT(*) FILTER (WHERE modes_paiement_recus ? 'Espèces') AS utilisent_especes,
  COUNT(*) FILTER (WHERE modes_paiement_recus ? 'Orange Money' OR modes_paiement_recus ? 'MTN Money') AS utilisent_mobile_money,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE modes_paiement_recus ? 'Orange Money' OR modes_paiement_recus ? 'MTN Money')
    / NULLIF(COUNT(*), 0), 1
  ) AS pct_mobile_money
FROM enquetes_pme

UNION ALL

SELECT
  'Ménages' AS type_acteur,
  COUNT(*) AS total_enquetes,
  COUNT(*) FILTER (WHERE pret_installer_labal = true) AS prets_labal,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE pret_installer_labal = true) / NULLIF(COUNT(*), 0), 1
  ) AS pct_prets_labal,
  COUNT(*) FILTER (WHERE mode_paiement = 'Espèces') AS utilisent_especes,
  COUNT(*) FILTER (WHERE mode_paiement IN ('Orange Money', 'MTN Money')) AS utilisent_mobile_money,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE mode_paiement IN ('Orange Money', 'MTN Money'))
    / NULLIF(COUNT(*), 0), 1
  ) AS pct_mobile_money
FROM enquetes_menages

UNION ALL

SELECT
  'Transit' AS type_acteur,
  COUNT(*) AS total_enquetes,
  COUNT(*) FILTER (WHERE bouton_alerte_sos = true) AS prets_labal,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE bouton_alerte_sos = true) / NULLIF(COUNT(*), 0), 1
  ) AS pct_prets_labal,
  0 AS utilisent_especes,
  0 AS utilisent_mobile_money,
  0 AS pct_mobile_money
FROM enquetes_transit

UNION ALL

SELECT
  'Autorités' AS type_acteur,
  COUNT(*) AS total_enquetes,
  COUNT(*) FILTER (WHERE point_focal_designe = true) AS prets_labal,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE point_focal_designe = true) / NULLIF(COUNT(*), 0), 1
  ) AS pct_prets_labal,
  0 AS utilisent_especes,
  0 AS utilisent_mobile_money,
  0 AS pct_mobile_money
FROM enquetes_autorites;

-- Vue 2 : Saturation des zones de transit par commune
CREATE OR REPLACE VIEW vue_saturation_transit WITH (security_invoker = true) AS
SELECT
  commune,
  COUNT(*) AS nb_sites,
  COUNT(*) FILTER (WHERE frequence_saturation = 'Quotidienne') AS saturation_quotidienne,
  COUNT(*) FILTER (WHERE frequence_saturation = 'Hebdomadaire') AS saturation_hebdomadaire,
  COUNT(*) FILTER (WHERE frequence_saturation = 'Occasionnelle') AS saturation_occasionnelle,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE frequence_saturation = 'Quotidienne') / NULLIF(COUNT(*), 0), 1
  ) AS pct_saturation_critique
FROM enquetes_transit
GROUP BY commune;

-- Vue 3 : Fréquence de transfert secondaire vs objectif (4/jour)
CREATE OR REPLACE VIEW vue_frequence_transfert WITH (security_invoker = true) AS
SELECT
  commune,
  COUNT(*) AS nb_sites,
  COUNT(*) FILTER (WHERE frequence_rotation = '3-4 fois/jour') AS atteint_objectif,
  COUNT(*) FILTER (WHERE frequence_rotation = '<1 fois/irrégulier') AS tres_insuffisant,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE frequence_rotation = '3-4 fois/jour') / NULLIF(COUNT(*), 0), 1
  ) AS pct_objectif_atteint
FROM enquetes_transit
GROUP BY commune;

-- Vue 4 : Répartition PME par commune
CREATE OR REPLACE VIEW vue_pme_par_commune WITH (security_invoker = true) AS
SELECT
  commune_elem AS commune,
  COUNT(*) AS nb_pme,
  COUNT(*) FILTER (WHERE nb_menages_desservis = '>700') AS pme_grandes,
  COUNT(*) FILTER (WHERE nb_menages_desservis = '<100') AS pme_petites
FROM enquetes_pme
CROSS JOIN LATERAL jsonb_array_elements_text(communes) AS commune_elem
GROUP BY commune_elem;

-- Vue 5 : Ratio espèces vs Mobile Money PME détaillé
CREATE OR REPLACE VIEW vue_ratio_paiement_pme WITH (security_invoker = true) AS
SELECT
  commune_elem AS commune,
  COUNT(*) AS nb_pme,
  COUNT(*) FILTER (WHERE modes_paiement_recus ? 'Espèces') AS pme_especes,
  COUNT(*) FILTER (WHERE modes_paiement_recus ? 'Orange Money') AS pme_orange_money,
  COUNT(*) FILTER (WHERE modes_paiement_recus ? 'MTN Money') AS pme_mtn_money,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE modes_paiement_recus ? 'Orange Money' OR modes_paiement_recus ? 'MTN Money')
    / NULLIF(COUNT(*), 0), 1
  ) AS pct_mobile_money
FROM enquetes_pme
CROSS JOIN LATERAL jsonb_array_elements_text(communes) AS commune_elem
GROUP BY commune_elem;

-- Trigger pour auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pme_updated_at BEFORE UPDATE ON enquetes_pme
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menages_updated_at BEFORE UPDATE ON enquetes_menages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transit_updated_at BEFORE UPDATE ON enquetes_transit
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_autorites_updated_at BEFORE UPDATE ON enquetes_autorites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security (RLS) — Accès public en écriture pour les enquêtes
-- ============================================================
ALTER TABLE enquetes_pme ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquetes_menages ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquetes_transit ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquetes_autorites ENABLE ROW LEVEL SECURITY;

-- Politique : lecture et écriture publique (formulaires ouverts)
CREATE POLICY "Allow public insert on pme" ON enquetes_pme FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on pme" ON enquetes_pme FOR SELECT USING (true);

CREATE POLICY "Allow public insert on menages" ON enquetes_menages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on menages" ON enquetes_menages FOR SELECT USING (true);

CREATE POLICY "Allow public insert on transit" ON enquetes_transit FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on transit" ON enquetes_transit FOR SELECT USING (true);

CREATE POLICY "Allow public insert on autorites" ON enquetes_autorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on autorites" ON enquetes_autorites FOR SELECT USING (true);
