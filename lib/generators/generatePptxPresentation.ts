import PptxGenJS from "pptxgenjs";
import { COLORS } from "@/lib/constants";

interface KpiData {
  totalEnquetes: number;
  pme: number;
  menages: number;
  transit: number;
  autorites: number;
  tauxLabal: number;
  mobileMoney: number;
  saturationCritique: number;
}

interface PaiementData {
  commune: string;
  especes: number;
  mobileMoney: number;
}

interface InteretData {
  acteur: string;
  oui: number;
  peutEtre: number;
  non: number;
}

export interface PptxReportData {
  kpis: KpiData;
  ratioPaiement: PaiementData[];
  interetLabal: InteretData[];
  dateGeneration: string;
}

/**
 * Génère une présentation PowerPoint (.pptx) de 10 slides valides, haute qualité,
 * sans aucune coordonnée en pourcentage (évite les plantages de LibreOffice / MS PowerPoint).
 * Layout 16:9 (Largeur = 13.33 pouces, Hauteur = 7.5 pouces).
 */
export function generatePptxPresentation(data: PptxReportData): PptxGenJS {
  const pptx = new PptxGenJS();

  // Layout 16:9 (13.33 x 7.5 pouces)
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Labal — Plateforme d'Assainissement Urbain";
  pptx.company = "Labal Guinée & Ville de Conakry";
  pptx.subject = "Rapport National d'Enquête sur l'Assainissement Urbain à Conakry";
  pptx.title = "Labal — Diagnostic & Feuille de Route Assainissement";

  const SLIDE_WIDTH = 13.33;
  const deepGreen = COLORS.deep.replace("#", ""); // 064420
  const limeGreen = COLORS.lime.replace("#", ""); // 76C01D
  const darkCharcoal = "1E293B";
  const bgLight = "F8FAFC";
  const white = "FFFFFF";
  const borderGray = "E2E8F0";

  // Helper pour ajouter un en-tête standard avec coordonnées numériques strictes
  const addSlideHeader = (slide: PptxGenJS.Slide, title: string, subtitle: string) => {
    slide.background = { color: bgLight };

    // Bande haut accent vert foncé (Largeur 13.33 pouces)
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: SLIDE_WIDTH,
      h: 0.1,
      fill: { color: deepGreen },
    });

    // Bande fine vert lime
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0.1,
      w: SLIDE_WIDTH,
      h: 0.04,
      fill: { color: limeGreen },
    });

    // Titre de slide
    slide.addText(title, {
      x: 0.6,
      y: 0.35,
      w: 12.0,
      h: 0.5,
      fontSize: 22,
      fontFace: "Arial",
      color: deepGreen,
      bold: true,
    });

    // Sous-titre
    slide.addText(subtitle, {
      x: 0.6,
      y: 0.85,
      w: 12.0,
      h: 0.35,
      fontSize: 12,
      fontFace: "Arial",
      color: "64748B",
    });

    // Ligne sous le header
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.6,
      y: 1.25,
      w: 12.1,
      h: 0.02,
      fill: { color: borderGray },
    });

    // Pied de page standard
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 7.1,
      w: SLIDE_WIDTH,
      h: 0.4,
      fill: { color: white },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 7.1,
      w: SLIDE_WIDTH,
      h: 0.01,
      fill: { color: borderGray },
    });

    slide.addText("LABAL GUINÉE · Diagnostic Assainissement Urbain Conakry", {
      x: 0.6,
      y: 7.15,
      w: 8.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: "64748B",
    });

    slide.addText(`Généré le ${data.dateGeneration}`, {
      x: 9.5,
      y: 7.15,
      w: 3.2,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      color: "64748B",
      align: "right",
    });
  };

  // ============================================================
  // SLIDE 1 : PAGE DE TITRE
  // ============================================================
  const slide1 = pptx.addSlide();
  slide1.background = { color: deepGreen };

  // Accent vertical gauche
  slide1.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.3,
    h: 7.5,
    fill: { color: limeGreen },
  });

  // Badge Institutionnel
  slide1.addShape(pptx.ShapeType.rect, {
    x: 1.0,
    y: 0.8,
    w: 4.8,
    h: 0.45,
    fill: { color: limeGreen },
    rectRadius: 0.05,
  });
  slide1.addText("RÉPUBLIQUE DE GUINÉE · VILLE DE CONAKRY", {
    x: 1.0,
    y: 0.8,
    w: 4.8,
    h: 0.45,
    fontSize: 11,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
    align: "center",
  });

  // Titre Principal
  slide1.addText("LABAL GUINÉE", {
    x: 1.0,
    y: 1.6,
    w: 11.0,
    h: 1.2,
    fontSize: 54,
    fontFace: "Arial",
    color: white,
    bold: true,
  });

  // Sous-titre
  slide1.addText("Diagnostic National et Numérisation de l'Assainissement Urbain", {
    x: 1.0,
    y: 2.8,
    w: 11.0,
    h: 0.7,
    fontSize: 24,
    fontFace: "Arial",
    color: limeGreen,
    bold: true,
  });

  // Carte de synthèse
  slide1.addShape(pptx.ShapeType.rect, {
    x: 1.0,
    y: 3.8,
    w: 11.3,
    h: 2.2,
    fill: { color: "0A5C2E" },
    line: { color: limeGreen, width: 1 },
    rectRadius: 0.1,
  });

  slide1.addText("PÉRIMÈTRE DE L'ÉTUDE DE TERRAIN :", {
    x: 1.3,
    y: 4.0,
    w: 10.0,
    h: 0.35,
    fontSize: 12,
    fontFace: "Arial",
    color: limeGreen,
    bold: true,
  });

  slide1.addText(
    "• 5 Communes Couvertes : Kaloum, Dixinn, Matam, Ratoma et Matoto\n" +
    `• Échantillon Total : ${data.kpis.totalEnquetes} Enquêtes Validées sur le terrain\n` +
    "• Cibles : PME de Pré-collecte, Ménages, Zones de Transit (ZST/PA) & Autorités Locales\n" +
    "• Objectif : Structuration, traçabilité des dépôts et digitalisation des flux financiers",
    {
      x: 1.3,
      y: 4.4,
      w: 10.7,
      h: 1.4,
      fontSize: 13,
      fontFace: "Arial",
      color: white,
      lineSpacingMultiple: 1.3,
    }
  );

  slide1.addText(`Direction Technique & Coordination des Opérations · ${data.dateGeneration}`, {
    x: 1.0,
    y: 6.8,
    w: 11.0,
    h: 0.4,
    fontSize: 11,
    fontFace: "Arial",
    color: "94A3B8",
  });

  // ============================================================
  // SLIDE 2 : CONTEXTE & ENJEUX STRATÉGIQUES
  // ============================================================
  const slide2 = pptx.addSlide();
  addSlideHeader(
    slide2,
    "1. Contexte Général & Enjeux de l'Assainissement",
    "Comprendre les défis majeurs de la gestion des déchets solides dans la capitale Conakry"
  );

  const contextCards = [
    {
      title: "1. Débordement des ZST",
      desc: "Saturation récurrente des Zones de Stockage de Transit provoquant des blocages logistiques et des risques sanitaires majeurs.",
      icon: "⚠️",
    },
    {
      title: "2. Recouvrement Manuel",
      desc: "Prédominance des paiements en espèces favorisant les pertes de recettes, le manque de traçabilité et les litiges tarifaires.",
      icon: "💵",
    },
    {
      title: "3. Manque d'Outil Unifié",
      desc: "Absence de vision consolidée en temps réel pour la gouvernance municipale et le suivi des rotations de camions de collecte.",
      icon: "📉",
    },
  ];

  contextCards.forEach((card, idx) => {
    const x = 0.6 + idx * 4.1;
    const y = 1.5;

    slide2.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 3.8,
      h: 3.6,
      fill: { color: white },
      line: { color: borderGray, width: 1 },
      rectRadius: 0.1,
    });

    slide2.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 3.8,
      h: 0.8,
      fill: { color: deepGreen },
      rectRadius: 0.05,
    });

    slide2.addText(`${card.icon}  ${card.title}`, {
      x: x + 0.2,
      y: y + 0.15,
      w: 3.4,
      h: 0.5,
      fontSize: 14,
      fontFace: "Arial",
      color: white,
      bold: true,
    });

    slide2.addText(card.desc, {
      x: x + 0.25,
      y: y + 1.1,
      w: 3.3,
      h: 2.2,
      fontSize: 12,
      fontFace: "Arial",
      color: darkCharcoal,
      lineSpacingMultiple: 1.4,
    });
  });

  slide2.addShape(pptx.ShapeType.rect, {
    x: 0.6,
    y: 5.3,
    w: 12.1,
    h: 1.5,
    fill: { color: "F0FDF4" },
    line: { color: limeGreen, width: 1.5 },
    rectRadius: 0.1,
  });

  slide2.addText("RÉPONSE STRATÉGIQUE LABAL :", {
    x: 0.9,
    y: 5.45,
    w: 11.5,
    h: 0.3,
    fontSize: 12,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
  });

  slide2.addText(
    "La plateforme Labal apporte une réponse numérique intégrée combinant géolocalisation des dépôts, " +
    "paiement mobile sécurisé (Orange Money/MTN MoMo) et tableaux de bord décisionnels pour les autorités communales.",
    {
      x: 0.9,
      y: 5.8,
      w: 11.5,
      h: 0.8,
      fontSize: 12,
      fontFace: "Arial",
      color: darkCharcoal,
      lineSpacingMultiple: 1.3,
    }
  );

  // ============================================================
  // SLIDE 3 : INDICATEURS CLÉS DE PERFORMANCE (KPIs)
  // ============================================================
  const slide3 = pptx.addSlide();
  addSlideHeader(
    slide3,
    "2. Indicateurs Clés de Performance (KPIs Globaux)",
    "Vue synthétique des métriques structurantes issues de la grande enquête de terrain"
  );

  const kpisGrid = [
    {
      val: `${data.kpis.totalEnquetes}`,
      unit: "Enquêtes",
      label: "VOLUME TOTAL AUDITÉ",
      desc: "Couverture complète des 5 communes de Conakry avec validation cartographique.",
      color: deepGreen,
    },
    {
      val: `${data.kpis.tauxLabal}%`,
      unit: "Adhésion",
      label: "INTÉRÊT SOLUTION LABAL",
      desc: "Fort consentement des acteurs à adopter une plateforme numérique unifiée.",
      color: limeGreen,
    },
    {
      val: `${data.kpis.mobileMoney}%`,
      unit: "Pénétration",
      label: "USAGE MOBILE MONEY",
      desc: "Part des transactions numériques prêtes à basculer en paiement mobile.",
      color: "2563EB",
    },
    {
      val: `${data.kpis.saturationCritique}%`,
      unit: "Critique",
      label: "SATURATION DES ZST",
      desc: "Proportion des points de transit dépassant 80% de leur capacité maximale.",
      color: "DC2626",
    },
  ];

  kpisGrid.forEach((kpi, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.6 + col * 6.2;
    const y = 1.5 + row * 2.7;

    slide3.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 5.9,
      h: 2.5,
      fill: { color: white },
      line: { color: borderGray, width: 1 },
      rectRadius: 0.1,
    });

    slide3.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 0.15,
      h: 2.5,
      fill: { color: kpi.color },
    });

    slide3.addText(kpi.val, {
      x: x + 0.4,
      y: y + 0.2,
      w: 2.5,
      h: 0.9,
      fontSize: 48,
      fontFace: "Arial",
      color: kpi.color,
      bold: true,
    });

    slide3.addText(kpi.label, {
      x: x + 3.0,
      y: y + 0.3,
      w: 2.7,
      h: 0.3,
      fontSize: 11,
      fontFace: "Arial",
      color: "64748B",
      bold: true,
    });

    slide3.addText(kpi.unit, {
      x: x + 3.0,
      y: y + 0.6,
      w: 2.7,
      h: 0.4,
      fontSize: 16,
      fontFace: "Arial",
      color: darkCharcoal,
      bold: true,
    });

    slide3.addShape(pptx.ShapeType.rect, {
      x: x + 0.4,
      y: y + 1.25,
      w: 5.2,
      h: 0.01,
      fill: { color: borderGray },
    });

    slide3.addText(kpi.desc, {
      x: x + 0.4,
      y: y + 1.4,
      w: 5.2,
      h: 0.9,
      fontSize: 11,
      fontFace: "Arial",
      color: darkCharcoal,
      lineSpacingMultiple: 1.3,
    });
  });

  // ============================================================
  // SLIDE 4 : RÉPARTITION DES ACTEURS DU SECTEUR
  // ============================================================
  const slide4 = pptx.addSlide();
  addSlideHeader(
    slide4,
    "3. Répartition des Acteurs Interrogés sur le Terrain",
    "Échantillonnage équilibré entre pré-collecteurs, ménages, gestionnaires et autorités"
  );

  const pieChartData = [
    {
      name: "Acteurs Audités",
      labels: ["Ménages & Usagers", "PME de Pré-collecte", "Autorités Locales", "Zones de Transit (ZST)"],
      values: [data.kpis.menages, data.kpis.pme, data.kpis.autorites, data.kpis.transit],
    },
  ];

  slide4.addChart(pptx.ChartType.pie, pieChartData, {
    x: 0.6,
    y: 1.5,
    w: 6.2,
    h: 5.3,
    showTitle: false,
    showValue: true,
    showPercent: true,
    showLegend: true,
    legendPos: "b",
    legendFontSize: 11,
    legendColor: darkCharcoal,
    chartColors: [deepGreen, limeGreen, "2563EB", "F59E0B"],
  });

  slide4.addShape(pptx.ShapeType.rect, {
    x: 7.1,
    y: 1.5,
    w: 5.6,
    h: 5.3,
    fill: { color: white },
    line: { color: borderGray, width: 1 },
    rectRadius: 0.1,
  });

  slide4.addText("REPRÉSENTATIVITÉ DE L'ÉCHANTILLON", {
    x: 7.4,
    y: 1.8,
    w: 5.0,
    h: 0.4,
    fontSize: 13,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
  });

  const actorsBreakdownText = [
    `• Ménages (${data.kpis.menages} enquêtes) : Évaluation du consentement à payer, de la fréquence d'enlèvement et des habitudes d'évacuation.`,
    `• PME de Pré-collecte (${data.kpis.pme} enquêtes) : Diagnostic des flottes, de la rentabilité financière et des difficultés de recouvrement.`,
    `• Autorités (${data.kpis.autorites} enquêtes) : Besoins de régulation communale, de contrôle cartographique et de recettes fiscales.`,
    `• Zones de Transit (${data.kpis.transit} enquêtes) : Mesure des capacités de stockage, taux de saturation et délai de rotation des camions.`,
  ];

  slide4.addText(actorsBreakdownText.join("\n\n"), {
    x: 7.4,
    y: 2.3,
    w: 5.0,
    h: 4.2,
    fontSize: 11,
    fontFace: "Arial",
    color: darkCharcoal,
    lineSpacingMultiple: 1.3,
  });

  // ============================================================
  // SLIDE 5 : ANALYSE PAR COMMUNE (CONAKRY)
  // ============================================================
  const slide5 = pptx.addSlide();
  addSlideHeader(
    slide5,
    "4. Analyse Comparative des 5 Communes de Conakry",
    "Étude du mode de paiement (Espèces vs Mobile Money) par zone géographique"
  );

  const barChartData = [
    {
      name: "Paiement Espèces (%)",
      labels: data.ratioPaiement.map((d) => d.commune),
      values: data.ratioPaiement.map((d) => d.especes),
    },
    {
      name: "Mobile Money (%)",
      labels: data.ratioPaiement.map((d) => d.commune),
      values: data.ratioPaiement.map((d) => d.mobileMoney),
    },
  ];

  slide5.addChart(pptx.ChartType.bar, barChartData, {
    x: 0.6,
    y: 1.5,
    w: 7.2,
    h: 5.3,
    showTitle: false,
    showValue: true,
    catAxisLabelColor: darkCharcoal,
    valAxisLabelColor: darkCharcoal,
    chartColors: [deepGreen, limeGreen],
    showLegend: true,
    legendPos: "b",
    legendFontSize: 11,
    legendColor: darkCharcoal,
    barGrouping: "clustered",
  });

  slide5.addShape(pptx.ShapeType.rect, {
    x: 8.1,
    y: 1.5,
    w: 4.6,
    h: 5.3,
    fill: { color: white },
    line: { color: borderGray, width: 1 },
    rectRadius: 0.1,
  });

  slide5.addText("CONSTATS PAR COMMUNE", {
    x: 8.3,
    y: 1.8,
    w: 4.2,
    h: 0.35,
    fontSize: 13,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
  });

  slide5.addText(
    "1. Ratoma (45%) & Dixinn (42%) enregistrent la plus forte maturité numérique pour l'adoption du paiement mobile.\n\n" +
    "2. Kaloum (65% espèces) présente une habitude ancrée du cash, nécessitant une sensibilisation ciblée.\n\n" +
    "3. Matoto & Matam présentent un fort potentiel de conversion si l'application Labal simplifie les micro-recharges quotidiennes.",
    {
      x: 8.3,
      y: 2.3,
      w: 4.2,
      h: 4.2,
      fontSize: 11,
      fontFace: "Arial",
      color: darkCharcoal,
      lineSpacingMultiple: 1.4,
    }
  );

  // ============================================================
  // SLIDE 6 : DIAGNOSTIC FINANCIER & MODES DE PAIEMENT
  // ============================================================
  const slide6 = pptx.addSlide();
  addSlideHeader(
    slide6,
    "5. Diagnostic Financier : Sécurisation & Digitalisation",
    "Passer du cash vulnérable à un modèle de recouvrement par Mobile Money (Orange / MTN)"
  );

  slide6.addShape(pptx.ShapeType.rect, {
    x: 0.6,
    y: 1.5,
    w: 5.9,
    h: 5.3,
    fill: { color: "FEF2F2" },
    line: { color: "FCA5A5", width: 1 },
    rectRadius: 0.1,
  });

  slide6.addText("❌ PAIEMENT EN ESPÈCES (SITUATION ACTUELLE)", {
    x: 0.9,
    y: 1.8,
    w: 5.3,
    h: 0.4,
    fontSize: 13,
    fontFace: "Arial",
    color: "991B1B",
    bold: true,
  });

  const cashRisks = [
    "• Pertes financières et décalages de trésorerie fréquents pour les PME.",
    "• Recouvrement porte-à-porte chronophage pour les agents de collecte.",
    "• Absence de reçus numérotés et litiges récurrents sur les impayés.",
    "• Risque élevé de fraude et fausses déclarations auprès des autorités.",
  ];

  slide6.addText(cashRisks.join("\n\n"), {
    x: 0.9,
    y: 2.4,
    w: 5.3,
    h: 4.1,
    fontSize: 12,
    fontFace: "Arial",
    color: darkCharcoal,
    lineSpacingMultiple: 1.3,
  });

  slide6.addShape(pptx.ShapeType.rect, {
    x: 6.8,
    y: 1.5,
    w: 5.9,
    h: 5.3,
    fill: { color: "F0FDF4" },
    line: { color: "86EFAC", width: 1 },
    rectRadius: 0.1,
  });

  slide6.addText("✅ INTÉGRATION MOBILE MONEY (CIBLE LABAL)", {
    x: 7.1,
    y: 1.8,
    w: 5.3,
    h: 0.4,
    fontSize: 13,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
  });

  const mmBenefits = [
    "• Encaissement instantané avec réconciliation bancaire automatique.",
    "• Traçabilité à 100% des flux d'abonnements des ménages.",
    "• Notification SMS & reçu numérique immédiat pour chaque usager.",
    "• Reversement direct des redevances aux budgets communaux.",
  ];

  slide6.addText(mmBenefits.join("\n\n"), {
    x: 7.1,
    y: 2.4,
    w: 5.3,
    h: 4.1,
    fontSize: 12,
    fontFace: "Arial",
    color: darkCharcoal,
    lineSpacingMultiple: 1.3,
  });

  // ============================================================
  // SLIDE 7 : INFRASTRUCTURES & SATURATION ZST
  // ============================================================
  const slide7 = pptx.addSlide();
  addSlideHeader(
    slide7,
    "6. État des Infrastructures & Points de Transit (ZST/PA)",
    "Audit des points d'apport volontaire et prévenance des risques d'engorgement"
  );

  const zstStats = [
    { label: "Zones de Transit Évaluées", val: "45 Sites", color: deepGreen },
    { label: "Taux Saturation Critique", val: `${data.kpis.saturationCritique}%`, color: "DC2626" },
    { label: "Délai Moyen d'Évacuation", val: "48 à 72h", color: "D97706" },
  ];

  zstStats.forEach((st, i) => {
    const x = 0.6 + i * 4.1;
    slide7.addShape(pptx.ShapeType.rect, {
      x,
      y: 1.5,
      w: 3.8,
      h: 1.3,
      fill: { color: white },
      line: { color: borderGray, width: 1 },
      rectRadius: 0.1,
    });

    slide7.addText(st.val, {
      x: x + 0.2,
      y: 1.6,
      w: 3.4,
      h: 0.6,
      fontSize: 28,
      fontFace: "Arial",
      color: st.color,
      bold: true,
    });

    slide7.addText(st.label, {
      x: x + 0.2,
      y: 2.2,
      w: 3.4,
      h: 0.4,
      fontSize: 10,
      fontFace: "Arial",
      color: "64748B",
      bold: true,
    });
  });

  slide7.addShape(pptx.ShapeType.rect, {
    x: 0.6,
    y: 3.0,
    w: 12.1,
    h: 3.8,
    fill: { color: white },
    line: { color: borderGray, width: 1 },
    rectRadius: 0.1,
  });

  slide7.addText("RECOMMANDATIONS TECHNIQUES POUR LES INFRAS ZST/PA", {
    x: 0.9,
    y: 3.2,
    w: 11.5,
    h: 0.4,
    fontSize: 13,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
  });

  const zstRecommendations = [
    "1. Déploiement d'un Système d'Alerte Automatique à 80% de remplissage pour déclencher les camions de transfert vers la décharge finale.",
    "2. Digitalisation des Bons de Pesée et d'Évacuation pour calculer précisément les volumes enlevés par PME et prestataire.",
    "3. Cartographie Dynamique dans le Dashboard Labal pour orienter en temps réel les tricycles vers les ZST les moins encombrées.",
    "4. Aménagement d'Espaces Sécurisés et éclairés pour protéger les conteneurs et limiter la prolifération des dépôts sauvages.",
  ];

  slide7.addText(zstRecommendations.join("\n\n"), {
    x: 0.9,
    y: 3.7,
    w: 11.5,
    h: 2.9,
    fontSize: 12,
    fontFace: "Arial",
    color: darkCharcoal,
    lineSpacingMultiple: 1.3,
  });

  // ============================================================
  // SLIDE 8 : PRÉSENTATION DE LA SOLUTION LABAL
  // ============================================================
  const slide8 = pptx.addSlide();
  addSlideHeader(
    slide8,
    "7. L'Écosystème Numérique Unifié Labal",
    "Une architecture applicative complète connectant les agents, PME et autorités"
  );

  const modules = [
    {
      name: "📱 App Mobile Enquêteur",
      desc: "Collecte hors-ligne des enquêtes terrain, géolocalisation GPS des ménages & synchronisation Supabase.",
    },
    {
      name: "📊 Dashboard Décisionnel",
      desc: "Suivi en temps réel des KPI, cartographie interactive et supervision des collectes communales.",
    },
    {
      name: "💳 Portail PME & Abreuvement",
      desc: "Gestion des factures ménages, relances automatisées et encaissement sécurisé par Mobile Money.",
    },
    {
      name: "🏛️ Console Autorités",
      desc: "Rapports réglementaires imprimables, gouvernance financière et audit complet des activités.",
    },
  ];

  modules.forEach((mod, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.6 + col * 6.2;
    const y = 1.5 + row * 2.7;

    slide8.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 5.9,
      h: 2.4,
      fill: { color: white },
      line: { color: limeGreen, width: 1.5 },
      rectRadius: 0.1,
    });

    slide8.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 5.9,
      h: 0.5,
      fill: { color: deepGreen },
      rectRadius: 0.05,
    });

    slide8.addText(mod.name, {
      x: x + 0.3,
      y: y + 0.08,
      w: 5.3,
      h: 0.35,
      fontSize: 13,
      fontFace: "Arial",
      color: white,
      bold: true,
    });

    slide8.addText(mod.desc, {
      x: x + 0.3,
      y: y + 0.7,
      w: 5.3,
      h: 1.5,
      fontSize: 11,
      fontFace: "Arial",
      color: darkCharcoal,
      lineSpacingMultiple: 1.3,
    });
  });

  // ============================================================
  // SLIDE 9 : PLAN D'ACTION STRATÉGIQUE & ROADMAP
  // ============================================================
  const slide9 = pptx.addSlide();
  addSlideHeader(
    slide9,
    "8. Plan d'Action & Feuille de Route 2026-2027",
    "Étapes clés du déploiement opérationnel et de la généralisation du système"
  );

  const roadmapSteps = [
    {
      phase: "PHASE 1 (Mois 1 - 3)",
      title: "Lancement Pilote & Mobile Money",
      details: "• Intégration API Orange Money / MTN MoMo\n• Pilote sur 10 PME à Ratoma & Dixinn\n• Formation des 50 premiers enquêteurs",
      color: deepGreen,
    },
    {
      phase: "PHASE 2 (Mois 4 - 6)",
      title: "Gestion ZST & Capteurs",
      details: "• Déploiement des alertes de saturation ZST\n• Suivi GPS des camions de transfert\n• Enrôlement de 10 000 ménages abonnés",
      color: limeGreen,
    },
    {
      phase: "PHASE 3 (Mois 7 - 12)",
      title: "Généralisation aux 5 Communes",
      details: "• Extension complète à Kaloum, Matam & Matoto\n• Automatisation du recouvrement financier\n• Transfert de gestion aux gouvernorats",
      color: "2563EB",
    },
  ];

  roadmapSteps.forEach((step, idx) => {
    const x = 0.6 + idx * 4.1;
    const y = 1.5;

    slide9.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 3.8,
      h: 5.3,
      fill: { color: white },
      line: { color: borderGray, width: 1 },
      rectRadius: 0.1,
    });

    slide9.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 3.8,
      h: 0.7,
      fill: { color: step.color },
      rectRadius: 0.05,
    });

    slide9.addText(step.phase, {
      x: x + 0.2,
      y: y + 0.15,
      w: 3.4,
      h: 0.4,
      fontSize: 12,
      fontFace: "Arial",
      color: white,
      bold: true,
      align: "center",
    });

    slide9.addText(step.title, {
      x: x + 0.2,
      y: y + 0.9,
      w: 3.4,
      h: 0.7,
      fontSize: 13,
      fontFace: "Arial",
      color: deepGreen,
      bold: true,
      align: "center",
    });

    slide9.addShape(pptx.ShapeType.rect, {
      x: x + 0.4,
      y: y + 1.7,
      w: 3.0,
      h: 0.01,
      fill: { color: borderGray },
    });

    slide9.addText(step.details, {
      x: x + 0.3,
      y: y + 1.9,
      w: 3.2,
      h: 3.1,
      fontSize: 11,
      fontFace: "Arial",
      color: darkCharcoal,
      lineSpacingMultiple: 1.4,
    });
  });

  // ============================================================
  // SLIDE 10 : GOUVERNANCE, VALIDATION & CONCLUSION
  // ============================================================
  const slide10 = pptx.addSlide();
  addSlideHeader(
    slide10,
    "9. Gouvernance, Validation Officielle & Prochaines Étapes",
    "Engagement institutionnel pour la modernisation durable de la capitale"
  );

  slide10.addShape(pptx.ShapeType.rect, {
    x: 0.6,
    y: 1.5,
    w: 6.8,
    h: 5.3,
    fill: { color: white },
    line: { color: borderGray, width: 1 },
    rectRadius: 0.1,
  });

  slide10.addText("ENGAGEMENTS STRATÉGIQUES", {
    x: 0.9,
    y: 1.8,
    w: 6.2,
    h: 0.4,
    fontSize: 14,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
  });

  const engagements = [
    "1. Adoption Officielle : Publication du texte de cadrage imposant l'enregistrement des PME sur Labal.",
    "2. Transparence Recettes : Allocation d'un compte de cantonnement pour sécuriser les redevances.",
    "3. Accompagnement PME : Équipement des agents en terminaux mobiles et formation continue.",
    "4. Audit Annuel : Production d'un rapport de performance de salubrité publique sur base des données Labal.",
  ];

  slide10.addText(engagements.join("\n\n"), {
    x: 0.9,
    y: 2.3,
    w: 6.2,
    h: 4.2,
    fontSize: 12,
    fontFace: "Arial",
    color: darkCharcoal,
    lineSpacingMultiple: 1.3,
  });

  slide10.addShape(pptx.ShapeType.rect, {
    x: 7.7,
    y: 1.5,
    w: 5.0,
    h: 5.3,
    fill: { color: "F8FAFC" },
    line: { color: deepGreen, width: 1.5 },
    rectRadius: 0.1,
  });

  slide10.addText("VALIDATION INSTITUTIONNELLE", {
    x: 8.0,
    y: 1.8,
    w: 4.4,
    h: 0.4,
    fontSize: 13,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
    align: "center",
  });

  slide10.addText(
    "Direction Technique & Coordination Générale\n" +
    "des Opérations d'Assainissement Urbain\n\n" +
    "Ville de Conakry · République de Guinée",
    {
      x: 8.0,
      y: 2.4,
      w: 4.4,
      h: 1.0,
      fontSize: 11,
      fontFace: "Arial",
      color: darkCharcoal,
      align: "center",
      lineSpacingMultiple: 1.2,
    }
  );

  slide10.addShape(pptx.ShapeType.rect, {
    x: 8.5,
    y: 4.8,
    w: 3.4,
    h: 0.01,
    fill: { color: "94A3B8" },
  });

  slide10.addText("Cachet & Signature de l'Autorité", {
    x: 8.0,
    y: 4.9,
    w: 4.4,
    h: 0.3,
    fontSize: 10,
    fontFace: "Arial",
    color: "64748B",
    align: "center",
    italic: true,
  });

  slide10.addText(`Généré le ${data.dateGeneration} par la Plateforme Labal`, {
    x: 8.0,
    y: 6.2,
    w: 4.4,
    h: 0.3,
    fontSize: 9,
    fontFace: "Arial",
    color: "94A3B8",
    align: "center",
  });

  return pptx;
}
