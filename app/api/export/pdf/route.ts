import { NextResponse } from "next/server";
import { generatePdfBuffer } from "@/lib/generators/generatePdfReport";
import type { PdfReportData } from "@/lib/generators/generatePdfReport";

export async function GET() {
  try {
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
        { acteur: "PME de Collecte", oui: 68, peutEtre: 20, non: 12 },
        { acteur: "Ménages & Usagers", oui: 72, peutEtre: 18, non: 10 },
        { acteur: "Zones de Transit", oui: 80, peutEtre: 15, non: 5 },
        { acteur: "Autorités Locales", oui: 75, peutEtre: 20, non: 5 },
      ],
      dateGeneration: new Date().toLocaleDateString("fr-GN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    // Génération du buffer PDF binaire natif (%PDF-1.4)
    const pdfBuffer = generatePdfBuffer(reportData);
    const dateTag = new Date().toISOString().slice(0, 10);

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="labal-rapport-${dateTag}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("[API] Erreur génération PDF:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du rapport PDF" },
      { status: 500 }
    );
  }
}
