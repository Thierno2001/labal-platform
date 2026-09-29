import { NextResponse } from "next/server";
import { generatePdfHtml } from "@/lib/generators/generatePdfReport";
import type { PdfReportData } from "@/lib/generators/generatePdfReport";

export async function GET() {
  try {
    // Demo data — in production, fetch from Supabase views
    const reportData: PdfReportData = {
      kpis: {
        totalEnquetes: 347,
        pme: 82,
        menages: 156,
        transit: 45,
        autorites: 64,
        tauxLabal: 73,
        mobileMoney: 41,
        saturationCritique: 28,
      },
      ratioPaiement: [
        { commune: "Kaloum", especes: 65, mobileMoney: 35 },
        { commune: "Dixinn", especes: 58, mobileMoney: 42 },
        { commune: "Matam", especes: 72, mobileMoney: 28 },
        { commune: "Ratoma", especes: 55, mobileMoney: 45 },
        { commune: "Matoto", especes: 60, mobileMoney: 40 },
      ],
      interetLabal: [
        { acteur: "PME", oui: 68, peutEtre: 20, non: 12 },
        { acteur: "Ménages", oui: 72, peutEtre: 18, non: 10 },
        { acteur: "Transit", oui: 80, peutEtre: 15, non: 5 },
        { acteur: "Autorités", oui: 75, peutEtre: 20, non: 5 },
      ],
      dateGeneration: new Date().toLocaleDateString("fr-GN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    const html = generatePdfHtml(reportData);

    // Return as HTML that the browser can print to PDF via Ctrl+P
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="labal-rapport-${new Date().toISOString().slice(0, 10)}.html"`,
      },
    });
  } catch (error) {
    console.error("[API] Erreur génération PDF:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du rapport" },
      { status: 500 }
    );
  }
}
