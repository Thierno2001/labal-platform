import { NextResponse } from "next/server";
import { generatePptxPresentation } from "@/lib/generators/generatePptxPresentation";
import type { PptxReportData } from "@/lib/generators/generatePptxPresentation";

export async function GET() {
  try {
    // Demo data — in production, fetch from Supabase views
    const reportData: PptxReportData = {
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

    const pptx = generatePptxPresentation(reportData);
    const buffer = await pptx.write({ outputType: "nodebuffer" });

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="labal-presentation-${new Date().toISOString().slice(0, 10)}.pptx"`,
      },
    });
  } catch (error) {
    console.error("[API] Erreur génération PPTX:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la présentation" },
      { status: 500 }
    );
  }
}
