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

/**
 * Génère un rapport PDF sous forme de page HTML stylisée convertie en PDF.
 * Utilise les couleurs de la charte Labal : fond blanc, texte #064420, accents #76C01D.
 */
export function generatePdfHtml(data: PdfReportData): string {
  const { deep, lime } = COLORS;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Labal — Rapport d'Analyse Assainissement</title>
  <style>
    @page { size: A4; margin: 20mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: ${deep};
      background: #FFFFFF;
      line-height: 1.6;
      font-size: 11pt;
    }
    .page { page-break-after: always; }
    .page:last-child { page-break-after: auto; }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 3px solid ${lime};
    }
    .header h1 {
      font-size: 28pt;
      color: ${deep};
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header .subtitle {
      font-size: 14pt;
      color: ${lime};
      margin-top: 5px;
      font-weight: 600;
    }
    .header .date {
      font-size: 10pt;
      color: ${deep};
      margin-top: 8px;
      opacity: 0.7;
    }

    /* Section titles */
    h2 {
      font-size: 16pt;
      color: ${deep};
      margin: 25px 0 15px;
      padding-bottom: 6px;
      border-bottom: 2px solid ${lime};
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 20px 0;
    }
    .kpi-box {
      border: 1px solid ${deep};
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      background: #FFFFFF;
    }
    .kpi-box .value {
      font-size: 28pt;
      font-weight: 800;
      color: ${lime};
      line-height: 1.1;
    }
    .kpi-box .label {
      font-size: 9pt;
      color: ${deep};
      margin-top: 5px;
      font-weight: 500;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th {
      background: ${deep};
      color: #FFFFFF;
      font-size: 10pt;
      font-weight: 600;
      padding: 10px 12px;
      text-align: left;
    }
    td {
      padding: 8px 12px;
      border-bottom: 1px solid #E5E7EB;
      font-size: 10pt;
      color: ${deep};
    }
    tr:nth-child(even) td {
      background: #F8FAF9;
    }

    /* Bar chart (CSS-based) */
    .bar-chart {
      margin: 20px 0;
    }
    .bar-row {
      display: flex;
      align-items: center;
      margin: 8px 0;
    }
    .bar-label {
      width: 80px;
      font-size: 10pt;
      font-weight: 500;
      color: ${deep};
      flex-shrink: 0;
    }
    .bar-container {
      flex: 1;
      height: 24px;
      background: #F0F0F0;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
    }
    .bar-fill-deep {
      background: ${deep};
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 8pt;
      font-weight: 600;
    }
    .bar-fill-lime {
      background: ${lime};
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 8pt;
      font-weight: 600;
    }
    .bar-value {
      width: 50px;
      text-align: right;
      font-size: 10pt;
      font-weight: 600;
      color: ${lime};
      flex-shrink: 0;
      margin-left: 8px;
    }

    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #E5E7EB;
      text-align: center;
      font-size: 8pt;
      color: #6B7280;
    }

    /* Highlight box */
    .highlight {
      background: rgba(118, 192, 29, 0.08);
      border-left: 4px solid ${lime};
      padding: 12px 16px;
      margin: 15px 0;
      border-radius: 0 6px 6px 0;
    }
    .highlight strong {
      color: ${lime};
    }
  </style>
</head>
<body>

  <!-- PAGE 1 : Couverture + KPIs -->
  <div class="page">
    <div class="header">
      <h1>LÂBAL</h1>
      <div class="subtitle">Rapport d'Analyse — Enquête Assainissement Urbain</div>
      <div class="date">Conakry, Guinée — ${data.dateGeneration}</div>
    </div>

    <h2>Indicateurs Clés de Performance</h2>
    <div class="kpi-grid">
      <div class="kpi-box">
        <div class="value">${data.kpis.totalEnquetes}</div>
        <div class="label">Total Enquêtes</div>
      </div>
      <div class="kpi-box">
        <div class="value">${data.kpis.tauxLabal}%</div>
        <div class="label">Intérêt Labal</div>
      </div>
      <div class="kpi-box">
        <div class="value">${data.kpis.mobileMoney}%</div>
        <div class="label">Mobile Money</div>
      </div>
      <div class="kpi-box">
        <div class="value">${data.kpis.saturationCritique}%</div>
        <div class="label">Saturation Critique</div>
      </div>
    </div>

    <h2>Répartition par Type d'Acteur</h2>
    <div class="kpi-grid">
      <div class="kpi-box">
        <div class="value">${data.kpis.pme}</div>
        <div class="label">🏭 PME de Collecte</div>
      </div>
      <div class="kpi-box">
        <div class="value">${data.kpis.menages}</div>
        <div class="label">🏠 Ménages</div>
      </div>
      <div class="kpi-box">
        <div class="value">${data.kpis.transit}</div>
        <div class="label">🔄 Zones Transit</div>
      </div>
      <div class="kpi-box">
        <div class="value">${data.kpis.autorites}</div>
        <div class="label">🏛️ Autorités</div>
      </div>
    </div>

    <div class="highlight">
      <strong>${data.kpis.tauxLabal}%</strong> des acteurs interrogés se déclarent prêts à intégrer la plateforme numérique Labal pour améliorer la gestion des déchets à Conakry.
    </div>
  </div>

  <!-- PAGE 2 : Ratio Paiement + Intérêt Labal -->
  <div class="page">
    <h2>Ratio Espèces vs Mobile Money par Commune</h2>
    <table>
      <thead>
        <tr>
          <th>Commune</th>
          <th>Espèces (%)</th>
          <th>Mobile Money (%)</th>
          <th>Visualisation</th>
        </tr>
      </thead>
      <tbody>
        ${data.ratioPaiement
          .map(
            (r) => `
          <tr>
            <td><strong>${r.commune}</strong></td>
            <td>${r.especes}%</td>
            <td style="color: ${lime}; font-weight: 700;">${r.mobileMoney}%</td>
            <td>
              <div class="bar-container">
                <div class="bar-fill-deep" style="width: ${r.especes}%">${r.especes}%</div>
                <div class="bar-fill-lime" style="width: ${r.mobileMoney}%">${r.mobileMoney}%</div>
              </div>
            </td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <h2>Intérêt pour Labal par Type d'Acteur</h2>
    <table>
      <thead>
        <tr>
          <th>Acteur</th>
          <th>Oui (%)</th>
          <th>Peut-être (%)</th>
          <th>Non (%)</th>
        </tr>
      </thead>
      <tbody>
        ${data.interetLabal
          .map(
            (i) => `
          <tr>
            <td><strong>${i.acteur}</strong></td>
            <td style="color: ${lime}; font-weight: 700;">${i.oui}%</td>
            <td>${i.peutEtre}%</td>
            <td>${i.non}%</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <div class="highlight">
      La commune de <strong>Ratoma</strong> affiche le taux le plus élevé d'adoption du Mobile Money (${data.ratioPaiement.reduce((a, b) => (b.mobileMoney > a.mobileMoney ? b : a)).mobileMoney}%), suggérant un terrain favorable pour le déploiement prioritaire de la facturation numérique.
    </div>
  </div>

  <!-- PAGE 3 : Conclusions -->
  <div class="page">
    <h2>Conclusions & Recommandations</h2>

    <div class="highlight">
      <strong>Synthèse :</strong> L'enquête auprès de ${data.kpis.totalEnquetes} acteurs de l'assainissement à Conakry révèle un fort intérêt pour la digitalisation de la chaîne de gestion des déchets.
    </div>

    <h2>Points Clés</h2>
    <table>
      <thead>
        <tr>
          <th>Indicateur</th>
          <th>Valeur</th>
          <th>Interprétation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Taux d'adhésion Labal</td>
          <td style="color: ${lime}; font-weight: 700;">${data.kpis.tauxLabal}%</td>
          <td>Forte acceptation de la plateforme numérique</td>
        </tr>
        <tr>
          <td>Adoption Mobile Money</td>
          <td style="color: ${lime}; font-weight: 700;">${data.kpis.mobileMoney}%</td>
          <td>Marge de progression significative</td>
        </tr>
        <tr>
          <td>Saturation critique ZST</td>
          <td style="color: ${lime}; font-weight: 700;">${data.kpis.saturationCritique}%</td>
          <td>Nécessite une intervention urgente</td>
        </tr>
      </tbody>
    </table>

    <h2>Recommandations Prioritaires</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Action</th>
          <th>Priorité</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Déployer le paiement Mobile Money (Orange/MTN) en priorité</td>
          <td style="color: ${lime}; font-weight: 700;">Haute</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Installer le système d'alerte saturation 80% dans les ZST</td>
          <td style="color: ${lime}; font-weight: 700;">Haute</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Lancer la phase pilote avec 5-10 PME engagées</td>
          <td style="color: ${lime}; font-weight: 700;">Haute</td>
        </tr>
        <tr>
          <td>4</td>
          <td>Équiper les agents terrain en smartphones avec l'app Labal</td>
          <td>Moyenne</td>
        </tr>
        <tr>
          <td>5</td>
          <td>Mettre en place le GPS tracking des tournées de collecte</td>
          <td>Moyenne</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Labal — Plateforme d'Assainissement Urbain — Conakry, Guinée</p>
      <p>Document confidentiel — Généré automatiquement le ${data.dateGeneration}</p>
    </div>
  </div>

</body>
</html>`;
}
