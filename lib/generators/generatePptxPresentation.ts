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

export function generatePptxPresentation(data: PptxReportData): PptxGenJS {
  const pptx = new PptxGenJS();

  // Global settings
  pptx.layout = "LAYOUT_WIDE"; // 16:9
  pptx.author = "Lâbal — Plateforme Assainissement";
  pptx.company = "Lâbal Guinée";
  pptx.subject = "Rapport d'Enquête Assainissement Urbain — Conakry";
  pptx.title = "Lâbal — Enquête Assainissement Conakry";

  const deepGreen = COLORS.deep.replace("#", "");
  const limeGreen = COLORS.lime.replace("#", "");
  const white = "FFFFFF";

  // ============================================================
  // SLIDE 1 : TITRE
  // ============================================================
  const slide1 = pptx.addSlide();
  slide1.background = { color: white };

  // Top accent bar
  slide1.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.08,
    fill: { color: limeGreen },
  });

  // Title
  slide1.addText("LÂBAL", {
    x: 1,
    y: 1.8,
    w: 8,
    h: 1.2,
    fontSize: 54,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
    align: "center",
  });

  // Subtitle
  slide1.addText("Enquête Assainissement Urbain — Conakry", {
    x: 1,
    y: 3.0,
    w: 8,
    h: 0.6,
    fontSize: 22,
    fontFace: "Arial",
    color: limeGreen,
    align: "center",
  });

  // Date
  slide1.addText(`Rapport généré le ${data.dateGeneration}`, {
    x: 1,
    y: 4.0,
    w: 8,
    h: 0.4,
    fontSize: 12,
    fontFace: "Arial",
    color: deepGreen,
    align: "center",
  });

  // Bottom bar
  slide1.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 7.42,
    w: "100%",
    h: 0.08,
    fill: { color: deepGreen },
  });

  // ============================================================
  // SLIDE 2 : KPIs PRINCIPAUX
  // ============================================================
  const slide2 = pptx.addSlide();
  slide2.background = { color: white };

  slide2.addText("Indicateurs Clés de Performance", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
  });

  // Accent line under title
  slide2.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 0.85,
    w: 2,
    h: 0.04,
    fill: { color: limeGreen },
  });

  // KPI boxes
  const kpis = [
    { value: data.kpis.totalEnquetes.toString(), label: "Total Enquêtes" },
    { value: `${data.kpis.tauxLabal}%`, label: "Intérêt Lâbal" },
    { value: `${data.kpis.mobileMoney}%`, label: "Mobile Money" },
    { value: `${data.kpis.saturationCritique}%`, label: "Saturation Critique" },
  ];

  kpis.forEach((kpi, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.8;
    const y = 1.4 + row * 2.2;

    // KPI box with border
    slide2.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 4.2,
      h: 1.8,
      fill: { color: white },
      line: { color: deepGreen, width: 1 },
      rectRadius: 0.1,
    });

    // Big number
    slide2.addText(kpi.value, {
      x,
      y: y + 0.2,
      w: 4.2,
      h: 1,
      fontSize: 44,
      fontFace: "Arial",
      color: limeGreen,
      bold: true,
      align: "center",
    });

    // Label
    slide2.addText(kpi.label, {
      x,
      y: y + 1.1,
      w: 4.2,
      h: 0.4,
      fontSize: 14,
      fontFace: "Arial",
      color: deepGreen,
      align: "center",
    });
  });

  // ============================================================
  // SLIDE 3 : KPIs PAR ACTEUR
  // ============================================================
  const slide3 = pptx.addSlide();
  slide3.background = { color: white };

  slide3.addText("Enquêtes par Type d'Acteur", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
  });

  slide3.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 0.85,
    w: 2,
    h: 0.04,
    fill: { color: limeGreen },
  });

  const acteurKpis = [
    { value: data.kpis.pme.toString(), label: "PME de Collecte", icon: "🏭" },
    { value: data.kpis.menages.toString(), label: "Ménages & Citoyens", icon: "🏠" },
    { value: data.kpis.transit.toString(), label: "Zones de Transit", icon: "🔄" },
    { value: data.kpis.autorites.toString(), label: "Autorités Locales", icon: "🏛️" },
  ];

  acteurKpis.forEach((kpi, i) => {
    const x = 0.3 + i * 2.4;
    const y = 1.5;

    slide3.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 2.1,
      h: 3,
      fill: { color: white },
      line: { color: deepGreen, width: 1 },
      rectRadius: 0.1,
    });

    slide3.addText(kpi.icon, {
      x,
      y: y + 0.2,
      w: 2.1,
      h: 0.6,
      fontSize: 32,
      align: "center",
    });

    slide3.addText(kpi.value, {
      x,
      y: y + 0.9,
      w: 2.1,
      h: 0.8,
      fontSize: 40,
      fontFace: "Arial",
      color: limeGreen,
      bold: true,
      align: "center",
    });

    slide3.addText(kpi.label, {
      x,
      y: y + 1.8,
      w: 2.1,
      h: 0.6,
      fontSize: 11,
      fontFace: "Arial",
      color: deepGreen,
      align: "center",
    });
  });

  // ============================================================
  // SLIDE 4 : GRAPHIQUE RATIO PAIEMENT (Bar Chart natif)
  // ============================================================
  const slide4 = pptx.addSlide();
  slide4.background = { color: white };

  slide4.addText("Ratio Espèces vs Mobile Money par Commune", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
  });

  slide4.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 0.85,
    w: 2,
    h: 0.04,
    fill: { color: limeGreen },
  });

  const chartData4 = [
    {
      name: "Espèces",
      labels: data.ratioPaiement.map((d) => d.commune),
      values: data.ratioPaiement.map((d) => d.especes),
    },
    {
      name: "Mobile Money",
      labels: data.ratioPaiement.map((d) => d.commune),
      values: data.ratioPaiement.map((d) => d.mobileMoney),
    },
  ];

  slide4.addChart(pptx.ChartType.bar, chartData4, {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 5.5,
    showTitle: false,
    showValue: true,
    catAxisLabelColor: deepGreen,
    valAxisLabelColor: deepGreen,
    chartColors: [deepGreen, limeGreen],
    catAxisOrientation: "minMax",
    valAxisOrientation: "minMax",
    showLegend: true,
    legendPos: "b",
    legendFontSize: 10,
    legendColor: deepGreen,
  });

  // ============================================================
  // SLIDE 5 : GRAPHIQUE INTÉRÊT LÂBAL (Bar Chart groupé)
  // ============================================================
  const slide5 = pptx.addSlide();
  slide5.background = { color: white };

  slide5.addText("Intérêt pour la Plateforme Lâbal par Acteur", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
  });

  slide5.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 0.85,
    w: 2,
    h: 0.04,
    fill: { color: limeGreen },
  });

  const chartData5 = [
    {
      name: "Oui",
      labels: data.interetLabal.map((d) => d.acteur),
      values: data.interetLabal.map((d) => d.oui),
    },
    {
      name: "Peut-être",
      labels: data.interetLabal.map((d) => d.acteur),
      values: data.interetLabal.map((d) => d.peutEtre),
    },
    {
      name: "Non",
      labels: data.interetLabal.map((d) => d.acteur),
      values: data.interetLabal.map((d) => d.non),
    },
  ];

  slide5.addChart(pptx.ChartType.bar, chartData5, {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 5.5,
    showTitle: false,
    showValue: true,
    catAxisLabelColor: deepGreen,
    valAxisLabelColor: deepGreen,
    chartColors: [limeGreen, deepGreen, "9CA3AF"],
    showLegend: true,
    legendPos: "b",
    legendFontSize: 10,
    legendColor: deepGreen,
    barGrouping: "clustered",
  });

  // ============================================================
  // SLIDE 6 : RÉPARTITION GÉOGRAPHIQUE (Pie Chart)
  // ============================================================
  const slide6 = pptx.addSlide();
  slide6.background = { color: white };

  slide6.addText("Répartition des Enquêtes par Acteur", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
  });

  slide6.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 0.85,
    w: 2,
    h: 0.04,
    fill: { color: limeGreen },
  });

  const pieData = [
    {
      name: "Acteurs",
      labels: ["PME Collecte", "Ménages", "Transit", "Autorités"],
      values: [data.kpis.pme, data.kpis.menages, data.kpis.transit, data.kpis.autorites],
    },
  ];

  slide6.addChart(pptx.ChartType.pie, pieData, {
    x: 1.5,
    y: 1.2,
    w: 7,
    h: 5.5,
    showTitle: false,
    showValue: true,
    showPercent: true,
    showLegend: true,
    legendPos: "b",
    legendFontSize: 10,
    legendColor: deepGreen,
    chartColors: [limeGreen, deepGreen, "2D8F4E", "4CAF50"],
  });

  // ============================================================
  // SLIDE 7 : CONCLUSIONS & RECOMMANDATIONS
  // ============================================================
  const slide7 = pptx.addSlide();
  slide7.background = { color: white };

  slide7.addText("Conclusions & Recommandations", {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
  });

  slide7.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 0.85,
    w: 2,
    h: 0.04,
    fill: { color: limeGreen },
  });

  const conclusions = [
    `• ${data.kpis.tauxLabal}% des acteurs sont prêts à adopter la plateforme numérique Lâbal`,
    `• Le paiement mobile (Orange/MTN Money) représente ${data.kpis.mobileMoney}% des transactions`,
    `• ${data.kpis.saturationCritique}% des zones de transit connaissent une saturation critique quotidienne`,
    `• ${data.kpis.totalEnquetes} enquêtes collectées auprès des 4 types d'acteurs`,
    "",
    "Recommandations :",
    "• Accélérer le déploiement de la solution Mobile Money pour réduire les litiges",
    "• Prioriser les communes avec saturation quotidienne pour le suivi GPS",
    "• Lancer la phase pilote Lâbal avec les 5-10 PME les plus engagées",
  ];

  slide7.addText(conclusions.join("\n"), {
    x: 0.5,
    y: 1.3,
    w: 9,
    h: 5.5,
    fontSize: 14,
    fontFace: "Arial",
    color: deepGreen,
    lineSpacingMultiple: 1.5,
    valign: "top",
  });

  // ============================================================
  // SLIDE 8 : CONTACT
  // ============================================================
  const slide8 = pptx.addSlide();
  slide8.background = { color: white };

  slide8.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.08,
    fill: { color: limeGreen },
  });

  slide8.addText("Merci", {
    x: 1,
    y: 2,
    w: 8,
    h: 1,
    fontSize: 48,
    fontFace: "Arial",
    color: deepGreen,
    bold: true,
    align: "center",
  });

  slide8.addText("Plateforme Lâbal — Assainissement Urbain Guinée", {
    x: 1,
    y: 3.2,
    w: 8,
    h: 0.5,
    fontSize: 18,
    fontFace: "Arial",
    color: limeGreen,
    align: "center",
  });

  slide8.addText(`Rapport généré le ${data.dateGeneration}`, {
    x: 1,
    y: 4.2,
    w: 8,
    h: 0.4,
    fontSize: 12,
    fontFace: "Arial",
    color: deepGreen,
    align: "center",
  });

  slide8.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 7.42,
    w: "100%",
    h: 0.08,
    fill: { color: deepGreen },
  });

  return pptx;
}
