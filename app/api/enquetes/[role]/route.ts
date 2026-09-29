import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Simplified schemas for server-side validation
const roleSchemas: Record<string, z.ZodSchema> = {
  pme: z.object({ nom_structure: z.string().min(1) }).passthrough(),
  menages: z.object({ nom_repondant: z.string().min(1) }).passthrough(),
  transit: z.object({ nom_site: z.string().min(1) }).passthrough(),
  autorites: z.object({ nom_repondant: z.string().min(1) }).passthrough(),
};

const roleToTable: Record<string, string> = {
  pme: "enquetes_pme",
  menages: "enquetes_menages",
  transit: "enquetes_transit",
  autorites: "enquetes_autorites",
};

type RouteParams = {
  params: Promise<{ role: string }>;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { role } = await params;

    if (!roleSchemas[role]) {
      return NextResponse.json(
        { error: `Rôle invalide: ${role}. Rôles acceptés: pme, menages, transit, autorites.` },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate
    const schema = roleSchemas[role];
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.flatten() },
        { status: 422 }
      );
    }

    // Try to insert into Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("placeholder")) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      const tableName = roleToTable[role];
      const { data, error } = await supabase
        .from(tableName)
        .insert(result.data)
        .select("id, created_at")
        .single();

      if (error) {
        console.error(`[API] Erreur Supabase ${tableName}:`, error);
        return NextResponse.json(
          { error: "Erreur d'enregistrement en base de données", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: `Enquête ${role} enregistrée avec succès.`,
          id: data.id,
          created_at: data.created_at,
        },
        { status: 201 }
      );
    }

    // Fallback: no Supabase configured, return mock success
    return NextResponse.json(
      {
        success: true,
        message: `Enquête ${role} reçue (mode local — Supabase non configuré).`,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        _warning: "Supabase non configuré. Données non persistées en base.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API] Erreur inattendue:", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { role } = await params;

    if (!roleToTable[role]) {
      return NextResponse.json(
        { error: `Rôle invalide: ${role}` },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("placeholder")) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      const url = new URL(request.url);
      const commune = url.searchParams.get("commune");
      const limit = parseInt(url.searchParams.get("limit") || "100");
      const offset = parseInt(url.searchParams.get("offset") || "0");

      let query = supabase
        .from(roleToTable[role])
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (commune) {
        if (role === "pme") {
          query = query.contains("communes", JSON.stringify([commune]));
        } else {
          query = query.eq("commune", commune);
        }
      }

      const { data, error, count } = await query;

      if (error) {
        return NextResponse.json(
          { error: "Erreur de lecture", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        data,
        total: count,
        limit,
        offset,
      });
    }

    // Mock data when Supabase is not configured
    return NextResponse.json({
      data: [],
      total: 0,
      limit: 100,
      offset: 0,
      _warning: "Supabase non configuré. Aucune donnée disponible.",
    });
  } catch (err) {
    console.error("[API] Erreur GET:", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
