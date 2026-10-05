import { jsPDF } from "jspdf";
import { COLORS } from "@/lib/constants";

export interface PdfReportData {
  kpis: {
    totalEnquetes: number;
    pme: number;
    menages: number;
    transit: number;
    autorites: number;
    tauxLabal: number;
    mobileMoney: number;
    saturationCritique: number;
  };
  ratioPaiement: { commune: string; especes: number; mobileMoney: number }[];
  interetLabal: { acteur: string; oui: number; peutEtre: number; non: number }[];
  dateGeneration: string;
}

// Color Palette RGB values
const RGB = {
  deep: [6, 68, 32] as [number, number, number],      // #064420
  lime: [118, 192, 29] as [number, number, number],   // #76C01D
  dark: [45, 55, 72] as [number, number, number],     // #2D3748
  light: [248, 250, 249] as [number, number, number], // #F8FAF9
  white: [255, 255, 255] as [number, number, number],
  grayBorder: [226, 232, 240] as [number, number, number],
};

/**
 * Génère un document PDF binaire natif (%PDF-1.4) de haute qualité
 */
export function generatePdfBuffer(data: PdfReportData): Buffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // =========================================================================
  // PAGE 1: EN-TÊTE & KPIS & RÉPARTITION
  // =========================================================================

  // Top Accent Banner
  doc.setFillColor(...RGB.deep);
  doc.rect(0, 0, pageWidth, 12, "F");
  doc.setFillColor(...RGB.lime);
  doc.rect(0, 10, pageWidth, 2, "F");

  // Title & Subtitle
  doc.setTextColor(...RGB.deep);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("LABAL GUINÉE", margin, 26);

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...RGB.lime);
  doc.text("Rapport d'Analyse — Enquête Assainissement Urbain Conakry", margin, 34);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...RGB.dark);
  doc.text(`Date de génération : ${data.dateGeneration}  |  Ville de Conakry (5 Communes)`, margin, 40);

  // Line separator
  doc.setDrawColor(...RGB.lime);
  doc.setLineWidth(0.6);
  doc.line(margin, 43, pageWidth - margin, 43);

  // SECTION 1: INDICATEURS CLÉS (KPIS)
  let yPos = 52;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...RGB.deep);
  doc.text("1. Indicateurs Clés de Performance (KPIs)", margin, yPos);

  yPos += 6;
  const kpiBoxWidth = (contentWidth - 9) / 4;
  const kpiBoxHeight = 24;

  const kpisList = [
    { label: "Total Enquêtes", value: `${data.kpis.totalEnquetes}` },
    { label: "Intérêt Labal", value: `${data.kpis.tauxLabal}%` },
    { label: "Mobile Money", value: `${data.kpis.mobileMoney}%` },
    { label: "Saturation ZST", value: `${data.kpis.saturationCritique}%` },
  ];

  kpisList.forEach((kpi, idx) => {
    const x = margin + idx * (kpiBoxWidth + 3);

    // Box Background
    doc.setFillColor(...RGB.light);
    doc.roundedRect(x, yPos, kpiBoxWidth, kpiBoxHeight, 2, 2, "F");
    doc.setDrawColor(...RGB.lime);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, yPos, kpiBoxWidth, kpiBoxHeight, 2, 2, "S");

    // Value
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...RGB.deep);
    doc.text(kpi.value, x + kpiBoxWidth / 2, yPos + 11, { align: "center" });

    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...RGB.dark);
    doc.text(kpi.label, x + kpiBoxWidth / 2, yPos + 19, { align: "center" });
  });

  // SECTION 2: RÉPARTITION PAR TYPE D'ACTEUR
  yPos += kpiBoxHeight + 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...RGB.deep);
  doc.text("2. Enquêtes Réalisées par Type d'Acteur", margin, yPos);

  yPos += 6;
  const actorsList = [
    { label: "PME de Collecte", count: data.kpis.pme },
    { label: "Ménages & Usagers", count: data.kpis.menages },
    { label: "Zones Transit (ZST/PA)", count: data.kpis.transit },
    { label: "Autorités Locales", count: data.kpis.autorites },
  ];

  actorsList.forEach((act, idx) => {
    const x = margin + idx * (kpiBoxWidth + 3);

    doc.setFillColor(...RGB.white);
    doc.roundedRect(x, yPos, kpiBoxWidth, kpiBoxHeight, 2, 2, "F");
    doc.setDrawColor(...RGB.deep);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, yPos, kpiBoxWidth, kpiBoxHeight, 2, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...RGB.lime);
    doc.text(`${act.count}`, x + kpiBoxWidth / 2, yPos + 11, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...RGB.dark);
    doc.text(act.label, x + kpiBoxWidth / 2, yPos + 19, { align: "center" });
  });

  // Highlight Box Page 1
  yPos += kpiBoxHeight + 14;
  doc.setFillColor(235, 247, 225); // Soft Lime Tint
  doc.roundedRect(margin, yPos, contentWidth, 24, 3, 3, "F");
  doc.setFillColor(...RGB.lime);
  doc.rect(margin, yPos, 4, 24, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...RGB.deep);
  doc.text("ENSEIGNEMENT CLÉ :", margin + 8, yPos + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...RGB.dark);
  doc.text(
    `Un taux d'adhésion fort de ${data.kpis.tauxLabal}% des acteurs du secteur de l'assainissement confirme la viabilité`,
    margin + 8,
    yPos + 15
  );
  doc.text(
    "et la nécessité de la numérisation complète des opérations de pré-collecte à Conakry.",
    margin + 8,
    yPos + 20
  );

  // Page 1 Footer
  addPageFooter(doc, 1, 3, data.dateGeneration);

  // =========================================================================
  // PAGE 2: TABLES DES Ratios ET ADHÉSION
  // =========================================================================
  doc.addPage();

  // Page Header
  addPageHeader(doc, "Ratio de Paiement & Intérêt par Acteur");

  yPos = 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...RGB.deep);
  doc.text("3. Ventilation du Mode de Paiement par Commune (%)", margin, yPos);

  yPos += 6;
  // Table Header
  const colW = [40, 40, 45, 55];
  drawTableHeader(doc, margin, yPos, colW, ["Commune", "Espèces (%)", "Mobile Money (%)", "Statut Adoption"]);

  yPos += 8;
  data.ratioPaiement.forEach((row, i) => {
    const isEven = i % 2 === 0;
    doc.setFillColor(...(isEven ? RGB.light : RGB.white));
    doc.rect(margin, yPos, contentWidth, 8, "F");
    doc.setDrawColor(...RGB.grayBorder);
    doc.line(margin, yPos + 8, margin + contentWidth, yPos + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...RGB.deep);
    doc.text(row.commune, margin + 4, yPos + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...RGB.dark);
    doc.text(`${row.especes}%`, margin + colW[0] + 4, yPos + 5.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RGB.lime);
    doc.text(`${row.mobileMoney}%`, margin + colW[0] + colW[1] + 4, yPos + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...RGB.dark);
    const statusText = row.mobileMoney >= 40 ? "Favorable (>40%)" : "À développer";
    doc.text(statusText, margin + colW[0] + colW[1] + colW[2] + 4, yPos + 5.5);

    yPos += 8;
  });

  // SECTION 4: INTÉRÊT LABAL PAR ACTEUR
  yPos += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...RGB.deep);
  doc.text("4. Taux d'Intérêt pour la Plateforme Labal par Acteur (%)", margin, yPos);

  yPos += 6;
  const colW2 = [45, 45, 45, 45];
  drawTableHeader(doc, margin, yPos, colW2, ["Acteur Interrogé", "Oui (%)", "Peut-être (%)", "Non (%)"]);

  yPos += 8;
  data.interetLabal.forEach((row, i) => {
    const isEven = i % 2 === 0;
    doc.setFillColor(...(isEven ? RGB.light : RGB.white));
    doc.rect(margin, yPos, contentWidth, 8, "F");
    doc.setDrawColor(...RGB.grayBorder);
    doc.line(margin, yPos + 8, margin + contentWidth, yPos + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...RGB.deep);
    doc.text(row.acteur, margin + 4, yPos + 5.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RGB.lime);
    doc.text(`${row.oui}%`, margin + colW2[0] + 4, yPos + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...RGB.dark);
    doc.text(`${row.peutEtre}%`, margin + colW2[0] + colW2[1] + 4, yPos + 5.5);
    doc.text(`${row.non}%`, margin + colW2[0] + colW2[1] + colW2[2] + 4, yPos + 5.5);

    yPos += 8;
  });

  // Page 2 Highlight Box
  yPos += 12;
  doc.setFillColor(235, 247, 225);
  doc.roundedRect(margin, yPos, contentWidth, 20, 3, 3, "F");
  doc.setFillColor(...RGB.lime);
  doc.rect(margin, yPos, 4, 20, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...RGB.deep);
  doc.text("OBSERVATION STRATÉGIQUE :", margin + 8, yPos + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...RGB.dark);
  doc.text(
    "Les PME et les Zones de Transit affichent une adhésion supérieure à 75%, marquant la volonté de moderniser la gestion.",
    margin + 8,
    yPos + 14
  );

  // Page 2 Footer
  addPageFooter(doc, 2, 3, data.dateGeneration);

  // =========================================================================
  // PAGE 3: RECOMMANDATIONS & SIGN-OFF
  // =========================================================================
  doc.addPage();
  addPageHeader(doc, "Recommandations & Plan d'Action");

  yPos = 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...RGB.deep);
  doc.text("5. Plan d'Action et Recommandations Prioritaires", margin, yPos);

  yPos += 6;
  const colW3 = [15, 120, 45];
  drawTableHeader(doc, margin, yPos, colW3, ["#", "Action Recommandée", "Niveau de Priorité"]);

  yPos += 8;
  const actions = [
    { id: "1", text: "Intégrer le paiement Mobile Money (Orange Money / MTN MoMo)", prio: "Haute (Urgent)" },
    { id: "2", text: "Mettre en place le système d'alerte saturation à 80% dans les ZST", prio: "Haute (Urgent)" },
    { id: "3", text: "Démarrer la phase pilote avec les 5-10 PME les plus engagées", prio: "Haute" },
    { id: "4", text: "Équiper les agents terrain en smartphones Android avec l'application Labal", prio: "Moyenne" },
    { id: "5", text: "Déployer le suivi GPS des camions de transfert vers la décharge finale", prio: "Moyenne" },
  ];

  actions.forEach((act, i) => {
    const isEven = i % 2 === 0;
    doc.setFillColor(...(isEven ? RGB.light : RGB.white));
    doc.rect(margin, yPos, contentWidth, 9, "F");
    doc.setDrawColor(...RGB.grayBorder);
    doc.line(margin, yPos + 9, margin + contentWidth, yPos + 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...RGB.deep);
    doc.text(act.id, margin + 5, yPos + 6);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...RGB.dark);
    doc.text(act.text, margin + colW3[0] + 4, yPos + 6);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RGB.lime);
    doc.text(act.prio, margin + colW3[0] + colW3[1] + 4, yPos + 6);

    yPos += 9;
  });

  // Official Sign-off Box
  yPos += 20;
  doc.setDrawColor(...RGB.deep);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, contentWidth, 40, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...RGB.deep);
  doc.text("VALIDATION ET NOMINATION OFFICIELLE — PROJET LABAL GUINÉE", margin + 8, yPos + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...RGB.dark);
  doc.text("Direction Technique & Coordination Générale des Opérations d'Assainissement", margin + 8, yPos + 17);
  doc.text("Ville de Conakry, République de Guinée", margin + 8, yPos + 23);

  doc.setDrawColor(...RGB.grayBorder);
  doc.line(margin + 110, yPos + 28, margin + 170, yPos + 28);
  doc.setFontSize(7.5);
  doc.text("Cachet & Signature de l'Autorité", margin + 110, yPos + 32);

  // Page 3 Footer
  addPageFooter(doc, 3, 3, data.dateGeneration);

  // Output as native Node.js Buffer
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}

/**
 * En-tête des pages 2 et 3
 */
function addPageHeader(doc: jsPDF, pageTitle: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(...RGB.deep);
  doc.rect(0, 0, pageWidth, 8, "F");
  doc.setFillColor(...RGB.lime);
  doc.rect(0, 7, pageWidth, 1.5, "F");

  doc.setTextColor(...RGB.deep);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`LABAL GUINÉE — ${pageTitle}`, 15, 15);

  doc.setDrawColor(...RGB.grayBorder);
  doc.setLineWidth(0.3);
  doc.line(15, 18, pageWidth - 15, 18);
}

/**
 * En-tête de tableau réutilisable
 */
function drawTableHeader(doc: jsPDF, x: number, y: number, colWidths: number[], headers: string[]) {
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  doc.setFillColor(...RGB.deep);
  doc.rect(x, y, totalW, 8, "F");

  doc.setTextColor(...RGB.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);

  let curX = x;
  headers.forEach((h, idx) => {
    doc.text(h, curX + 4, y + 5.5);
    curX += colWidths[idx];
  });
}

/**
 * Pied de page uniforme pour toutes les pages
 */
function addPageFooter(doc: jsPDF, pageNum: number, totalPages: number, dateStr: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(...RGB.grayBorder);
  doc.setLineWidth(0.3);
  doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 110, 120);
  doc.text(
    `© ${new Date().getFullYear()} Labal — Plateforme d'Assainissement Urbain Conakry, Guinée`,
    15,
    pageHeight - 9
  );

  doc.text(`Page ${pageNum} sur ${totalPages}`, pageWidth - 15, pageHeight - 9, { align: "right" });
}
