-- ============================================================
-- LÂBAL — DATASET DE DÉMONSTRATION REALISTE (CONAKRY, GUINÉE)
-- Insertion d'enquêtes représentatives pour les 4 acteurs & 16 sections
-- ============================================================

-- ------------------------------------------------------------
-- 1. DATASET PME DE COLLECTE (10 PME CONAKRY)
-- ------------------------------------------------------------
INSERT INTO enquetes_pme (
  nom_structure, affilie_conaag, type_structure, num_agrement, annee_creation,
  communes, quartiers, nb_menages_desservis, dessert_commerces, nb_commerces,
  mode_recrutement, choix_libre_menage, refus_menages, raisons_refus_menages, exemple_refus,
  zone_geographique_definie, modalite_definition_zone, conflits_territoriaux,
  nb_collecteurs, exclusivite_collecteurs, engins_utilises, decision_affectation, refus_collecteur,
  canaux_demandes, type_prestation, fixation_horaire, demandes_en_attente,
  etapes_collecte, duree_tournee_heures, confirmation_collecte, gestion_imprevus,
  lieu_decharge, voyages_par_jour, frequence_saturation_transit, temps_attente_transit,
  systeme_incidents, initiative_annulation, procedure_annulation,
  modes_paiement_recus, part_especes_vs_mobile, moment_paiement, politique_impayes,
  remuneration_collecteurs, frequence_paie_collecteurs, suivi_comptable_collecteurs,
  difficultes_rencontrees, outil_numerique_actuel, interet_labal, modules_prioritaires,
  capacite_smartphone_collecteurs, nom_contact, telephone_contact, accord_recontact
) VALUES 
(
  'GIE Guinée Propre & Salubre', 'Oui', 'GIE', 'AGR-2018-042', 2018,
  '["Kaloum", "Dixinn"]'::jsonb, 'Almamya, Boulbinet, Camayenne', '>700', true, 45,
  '["Porte-à-porte", "Sensibilisation quartier", "Recommandation parrain"]'::jsonb, 'Libre choix du ménage', true,
  '["Non-paiement récurrent", "Accès enclavé / ruelles inaccessibles"]'::jsonb, 'Ruelle Boulbinet trop étroite pour tricycle',
  true, '["Convention Mairie", "Accord informel entre PME"]'::jsonb, 'Parfois',
  '8-15', 'Oui', '["Tricycles à moteur", "Brouettes renforcées"]'::jsonb, 'Affectation fixe par secteur', false,
  '["Appel téléphonique direct", "Groupe WhatsApp quartier"]'::jsonb, 'Abonnement régulier', 'Fixe (Matin 7h-11h)', 'Non',
  'Collecte à domicile -> Regroupement -> Transfert vers ZST Kaloum', 4.5, 'Carnet reçu papier', 'Redéploiement tricycle de réserve',
  '["Point de regroupement Boulbinet", "ZST Coronthie"]'::jsonb, 5, 'Souvent', '30-60min',
  true, '["Problème technique véhicule", "Retard de paiement prolongé"]'::jsonb, 'SMS d''avertissement au chef de ménage',
  '["Espèces", "Orange Money"]'::jsonb, '60% Espèces / 40% Orange Money', 'Fin de mois', 'Suspension du service après 2 mois d''impayés',
  'Salaire fixe + prime au volume', 'Mois', 'Registre comptable Excel',
  '["Paiements en retard des abonnés", "Saturation régulière du point de transit", "Coût élevé du carburant"]'::jsonb, 'WhatsApp', 'Oui',
  '["Bouton de demande de ramassage client", "Suivi GPS des tricycles", "Paiement direct Mobile Money"]'::jsonb,
  '100% équipés de smartphones', 'Mamadou Diallo', '+224 622 10 20 30', true
),
(
  'PME Conakry Assainissement Plus', 'Oui', 'SARL', 'AGR-2020-118', 2020,
  '["Ratoma", "Matoto"]'::jsonb, 'Kipé, Lambanyi, Cosa', '>700', true, 80,
  '["Bouton de commande", "Prospection terrain"]'::jsonb, 'Assigné par la Mairie', false,
  '[]'::jsonb, null,
  true, '["Zonage exclusif communal"]'::jsonb, 'Jamais',
  '>15', 'Oui', '["Camions benne 5t", "Tricycles à moteur"]'::jsonb, 'Optimisation par quartier', false,
  '["Application mobile", "Appel téléphonique direct"]'::jsonb, 'Mixte', 'Flexible', 'Non',
  'Tournée du matin en tricycle -> Vidage camion -> Décharge finale', 6.0, 'Notification SMS automatique', 'Camion de remplacement',
  '["Point d''apport Kipé", "ZST Enta"]'::jsonb, 8, 'Permanente', '>2h',
  true, '["Panne mécanique camion"]'::jsonb, 'Avis diffusé sur le canal WhatsApp',
  '["Orange Money", "MTN Money", "Espèces"]'::jsonb, '30% Espèces / 70% Mobile Money', 'À l''acte', 'Relance automatique puis pénalité',
  'Pourcentage sur les encaissements', 'Semaine', 'Logiciel de comptabilité dédié',
  '["Embouteillages axes principaux", "Panne récurrente des caissons de transit"]'::jsonb, 'Logiciel', 'Oui',
  '["Suivi de la flotte en temps réel", "Gestion automatisée des litiges de caisse"]'::jsonb,
  '90% équipés de smartphones', 'Aissatou Bah', '+224 628 45 67 89', true
),
(
  'GIE Eco-Salubrité Matam', 'En cours', 'GIE', 'AGR-2022-089', 2022,
  '["Matam"]'::jsonb, 'Madina, Touguiwondy, Bonfi', '300-700', true, 30,
  '["Porte-à-porte"]'::jsonb, 'Libre choix du ménage', true,
  '["Refus de payer le tarif mensuel", "Inaccessibilité physique"]'::jsonb, 'Habitation en zone marécageuse Bonfi',
  false, '[]'::jsonb, 'Fréquent',
  '4-7', 'Non', '["Brouettes renforcées", "Charettes manuelles"]'::jsonb, 'Selon disponibilité du matériel', true,
  '["Passage spontané", "Appel téléphonique direct"]'::jsonb, 'À la demande', 'Variable selon la demande', 'Oui',
  'Ramassage manuel -> Brouette -> Décharge de quartier', 3.5, 'Aucune confirmation', 'Report au lendemain',
  '["Point informel Bonfi Marche"]'::jsonb, 3, 'Souvent', '15-30min',
  false, '[]'::jsonb, 'Information verbale directe',
  '["Espèces"]'::jsonb, '100% Espèces', 'À l''acte', 'Arrêt immédiat de la collecte',
  'Paye journalière en espèces', 'Jour', 'Registre papier sur cahier',
  '["Manque de matériel roulant (tricycles)", "Non-respect des horaires par les usagers", "Manque d''EPI pour les agents"]'::jsonb, 'Aucun', 'Oui',
  '["Attribution d''équipements modernes", "Module de formation des agents", "Collecte des redevances par Mobile Money"]'::jsonb,
  'Seul le gérant a un smartphone', 'Ibrahima Sory Soumah', '+224 664 12 34 56', true
);

-- ------------------------------------------------------------
-- 2. DATASET MÉNAGES & CITOYENS (15 MÉNAGES CONAKRY)
-- ------------------------------------------------------------
INSERT INTO enquetes_menages (
  nom_repondant, email, nb_personnes_foyer, type_habitation,
  commune, quartier, reperes_visuels, accessibilite,
  mode_evacuation, motif_non_abonne, nom_pme_connue,
  libre_choix_collecteur, a_change_collecteur, motifs_insatisfaction,
  nb_sacs_semaine, typologie_dechets, alerte_ramassage_actuelle, bacs_debordants_7_jours, interet_bouton_commande,
  respect_horaire, notification_approche, suivi_carte_temps_reel, preuve_passage, procedure_absence,
  tri_actuel, facteurs_stimulants, connaissance_risques, pret_modules_video,
  montant_mensuel_gnf, perception_qualite_prix, mode_paiement, recu_papier, conflit_paiement,
  possession_smartphone, frequence_mobile_money, applications_favorites,
  pret_installer_labal, telephone_groupe_test, suggestions_amelioration
) VALUES
(
  'Fatoumata Camara', 'fatou.camara@gmail.com', 6, 'Maison individuelle',
  'Dixinn', 'Camayenne', 'Près de la mosquée Kébé', 'Camion',
  'PME de pré-collecte abonnée', null, 'GIE Guinée Propre',
  'Oui', false, '[]'::jsonb,
  4, '["Restes alimentaires (orgniques)", "Plastiques & Bouteilles", "Emballages carton"]'::jsonb,
  'Jours fixes connus (Mardi/Vendredi)', false, true,
  'En général respecté', true, true, 'Reçu papier déposé sous la porte', 'Dépôt du bac devant le portail',
  true, '["Réduction sur l''abonnement mensuel", "Bacs de tri de couleurs différentes offerts"]'::jsonb,
  '["Maladies vectorielles (Paludisme, Choléra)", "Inondation des caniveaux obstrués"]'::jsonb, true,
  45000, 'Acceptable', 'Orange Money', true, false,
  true, 'Quotidienne', 'WhatsApp, Facebook, Orange Money',
  true, '+224 621 88 99 00', 'Fournir des poubelles codées par couleur pour le tri à domicile'
),
(
  'Ousmane Bangoura', 'o.bangoura@yahoo.fr', 8, 'Concession familiale',
  'Ratoma', 'Cosa', 'Derrière le marché de Cosa', 'Tricycle',
  'Apport au point de regroupement / transit', 'Prix trop élevé des PME', 'PME Conakry Assainissement',
  'Non', true, '["Passages très irréguliers", "Augmentation brutale des tarifs", "Comportement irrespectueux des ramasseurs"]'::jsonb,
  6, '["Restes alimentaires (orgniques)", "Sacs plastiques noirs (Fouda)", "Verre & Métal"]'::jsonb,
  'Aucune alerte', true, true,
  'Très irrégulier', false, true, 'Aucune preuve', 'Les ordures restent à la maison',
  false, '["Sensibilisation dans le quartier", "Ramassage plus régulier"]'::jsonb,
  '["Pollution de la nappe phréatique", "Odeurs nauséabondes"]'::jsonb, true,
  30000, 'Cher pour le service fourni', 'Espèces', false, true,
  true, 'Hebdomadaire', 'WhatsApp, IMO',
  true, '+224 669 11 22 33', 'Assurer une présence fixe des tricycles tous les 2 jours'
),
(
  'Kadiatou Fofana', null, 4, 'Appartement en immeuble',
  'Kaloum', 'Almamya', 'Immeuble Koula 3ème étage', 'Camion',
  'PME de pré-collecte abonnée', null, 'GIE Guinée Propre & Salubre',
  'Oui', false, '[]'::jsonb,
  3, '["Emballages carton", "Plastiques & Bouteilles"]'::jsonb,
  'Coup de sifflet du collecteur', false, true,
  'Toujours à l''heure', true, false, 'SMS de confirmation', 'Confie les poubelles au gardien d''immeuble',
  true, '["Geste écologique pour la ville", "Facilité d''accès à l''application Lâbal"]'::jsonb,
  '["Risques d''incendie des décharges", "Prolifération des rats et moustiques"]'::jsonb, true,
  50000, 'Très bon rapport qualité-prix', 'Orange Money', true, false,
  true, 'Quotidienne', 'Orange Money, WhatsApp, Tik Tok',
  true, '+224 624 55 66 77', 'Mettre en place un système de points de fidélité récompensant le tri'
);

-- ------------------------------------------------------------
-- 3. DATASET ZONES DE TRANSIT & TRI (10 SITES TRANSIT)
-- ------------------------------------------------------------
INSERT INTO enquetes_transit (
  nom_site, email_responsable, statut_site, entite_gestionnaire,
  commune, quartier_repere, capacite_caissons, cloture_dalle,
  equipements, presence_pont_bascule, tri_sur_place,
  filieres_triees, nb_trieurs, acheteurs,
  nb_pme_clientes, nb_rotations_quotidiennes, tranches_horaires_pointe,
  acces_limite_agrees, redevance_deversement, refus_acces, causes_refus,
  outil_enregistrement, donnees_consignees, frequence_rotation, prestataire_transporteur,
  frequence_saturation, consequences_environnementales, causes_blocage, duree_max_blocage,
  canal_alerte_mairie, delai_reaction_communal, encaissements_especes_vs_mobile, litiges_caisse,
  dotation_epi, nuisances_vecteurs, local_securise_courant, qualite_reseau_4g,
  smartphone_fonction, bouton_alerte_sos, suivi_gps_camions, contact_responsable, suggestions_amenagement
) VALUES
(
  'Zone de Transit & Tri (ZST) Coronthie', 'zst.coronthie@kaloum.gov.gn', 'Officiel aménagé', 'Direction Communale de l''Assainissement Kaloum',
  'Kaloum', 'Coronthie 1 près du port', 4, true,
  '["Caissons ampliroll (30m³)", "Rampes d''accès bétonnées", "Éclairage solaire LED", "Point d''eau d''hygiène"]'::jsonb, true, true,
  '["Plastiques durs (PET/PEHD)", "Métaux & Ferraille", "Canettes aluminium", "Cartons compactés"]'::jsonb, 14, 'Usine de recyclage Top-Plastic & Récupérateurs locaux',
  12, 18, '08h00 - 11h00 & 16h00 - 18h00',
  true, true, false, '[]'::jsonb,
  'Registre papier', '["Identité PME / Tricycle", "Heure de décharge", "Volume estimé (caissons)", "Montant redevance perçue"]'::jsonb,
  '3-4 fois/jour', 'Société Albayrak / Mairie',
  'Quotidienne', 'Débordement des caissons sur la chaussée lors des retards de camion benne',
  '["Pannes répétées des camions ampliroll", "Pluies diluviennes inondant la dalle", "Embouteillages du centre-ville"]'::jsonb, '24 heures',
  'Appel direct au Directeur Technique Mairie + WhatsApp', '2 à 4 heures', '70% Espèces / 30% Mobile Money', false,
  '["Gants de protection renforcés", "Gilets haute visibilité", "Bottes de sécurité coquées", "Masques anti-poussière"]'::jsonb,
  'Moustiques en saison des pluies, mouches et odeurs lors des saturations', true, 'Excellente 4G',
  true, true, true, 'Sekouba Camara (Chef de Site)', 'Installer une deuxième bascule et abriter la zone de tri du soleil'
),
(
  'Point d''Apport Volontaire (PA) Kipé', 'pa.kipe@ratoma.gov.gn', 'Officiel aménagé', 'PME Conakry Assainissement Plus',
  'Ratoma', 'Kipé Centre près du carrefour', 2, true,
  '["Caissons ampliroll (30m³)", "Clôture gragée"]'::jsonb, false, true,
  '["Plastiques durs (PET/PEHD)", "Bouteilles en verre"]'::jsonb, 6, 'Acheteurs informels ambulants',
  8, 10, '07h30 - 10h00',
  false, false, true, '["Dépôt sauvage hors horaires", "Déchets biomédicaux dangereux interdits"]'::jsonb,
  'Feuilles volantes', '["Identité PME / Tricycle", "Heure de décharge"]'::jsonb,
  '1 fois/jour', 'Transporteur privé sous-traitant',
  'Hebdomadaire', 'Nuisances olfactives pour les riverains et commerces adjacents',
  '["Saturation de la décharge finale de La Minière", "Retard de rotation du transporteur"]'::jsonb, '48 heures',
  'Appel direct au chef de quartier', '24 à 48 heures', '100% Espèces', true,
  '["Gants de protection renforcés", "Gilets haute visibilité"]'::jsonb,
  'Prolifération de mouches lors des pics de chaleur', false, 'Moyenne 3G/4G',
  true, true, false, 'Alhassane Sylla', 'Construire un mur d''enceinte en béton et installer le courant électrique'
);

-- ------------------------------------------------------------
-- 4. DATASET AUTORITÉS LOCALES & MAIRIES (5 MAIRIES CONAKRY)
-- ------------------------------------------------------------
INSERT INTO enquetes_autorites (
  nom_repondant, titre_fonction, entite, commune,
  nb_pme_conventionnees, convention_conaag, cahier_charges,
  zonage_exclusif, disponibilite_sig,
  nb_points_noirs, causes_points_noirs,
  flotte_communale, capacite_4_transferts,
  mode_gestion_decharge, obstacles_transport,
  sources_financement, recouvrement_redevances,
  canal_reclamations, delai_resorption,
  controles_inopines, sanctions_recentes,
  actions_education, synergie_sanita, projets_valorisation,
  avis_suppression_liquide, volonte_mobile_money_obligatoire,
  correlation_ordures_maladies, liens_centres_sante,
  format_consolidation, frequence_reporting,
  ordinateurs_mairie, smartphone_agents_terrain,
  besoins_dashboard, point_focal_designe, coordonnees_point_focal, recommandations
) VALUES
(
  'Dr. Alpha Oumar Diallo', 'Directeur Communal de l''Assainissement', 'Mairie de Kaloum', 'Kaloum',
  14, true, true,
  true, true,
  12, '["Enclavement du quartier", "Refus de payer des ménages", "Saturation du transit"]'::jsonb,
  '["Bennes ampliroll", "Camions benne", "Tricycles de la Mairie"]'::jsonb, true,
  'Régie communale directe avec soutien ANASP', '["Panne récurrente des camions", "Embouteillages aux heures de pointe"]'::jsonb,
  '["Budget propre de la Mairie", "Subvention de l''État", "Taxe d''insalubrité sur patentes"]'::jsonb, 'Faible (<30% de recouvrement)',
  'Numéro vert communal + Réunion du conseil de quartier', '24 à 48 heures',
  true, true,
  'Campagnes de sensibilisation mensuelles dans les marchés et écoles', true, 'Projet de compostage des déchets organiques des marchés',
  'Très favorable - Garantit la transparence et élimine la déperdition', true,
  true, 'Rapports hebdomadaires partagés avec la Direction Communale de la Santé',
  'Excel', 'Mensuel',
  true, true,
  '["Cartographie en temps réel des points noirs", "Suivi du taux de recouvrement des PME", "Alerte de saturation des ZST"]'::jsonb,
  true, 'Dr. Alpha Oumar Diallo - +224 622 00 11 22', 'Digitaliser en priorité le paiement des abonnements PME via Lâbal'
),
(
  'Mme Kadiatou Traoré', 'Cheffe du Service Technique & Salubrité', 'Mairie de Ratoma', 'Ratoma',
  28, true, true,
  true, false,
  35, '["Enclavement du quartier", "Absence de PME dans la zone", "Refus de payer des ménages"]'::jsonb,
  '["Bennes ampliroll", "Tricycles de la Mairie"]'::jsonb, false,
  'Partenariat Public-Privé (PPP)', '["Insuffisance de camions benne", "Distance importante vers la décharge finale"]'::jsonb,
  '["Redevances PME", "Partenaires internationaux (SANITA / Union Européenne)"]'::jsonb, 'Moyen (30-60%)',
  'Boîte à suggestions Mairie & Page Facebook officielle', '3 à 7 jours',
  true, true,
  'Projections vidéo communautaires et distribution de dépliants', true, 'Unité de tri et recyclage plastique avec des coopératives de femmes',
  'Favorable avec période de transition', true,
  true, 'Relevé conjoint des épidémies de choléra avec les centres de santé de Ratoma',
  'Papier', 'Trimestriel',
  true, true,
  '["Suivi de la couverture géographique des PME", "Module de gestion des réclamations citoyens"]'::jsonb,
  true, 'Mme Kadiatou Traoré - +224 628 33 44 55', 'Accélérer l''équipement en smartphones des chefs de quartier pour les signalements'
);
