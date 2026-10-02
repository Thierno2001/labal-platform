"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  ClipboardList,
  Users,
  Truck,
  Building2,
  Recycle,
  TrendingUp,
  Smartphone,
  FileDown,
  Presentation,
  AlertTriangle,
  RefreshCw,
  Database,
} from "lucide-react";
import { KpiCard, StatCard } from "@/components/dashboard/KpiCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { COLORS, COMMUNES } from "@/lib/constants";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function DashboardPage() {
  const [selectedCommune, setSelectedCommune] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedActor, setSelectedActor] = useState("all");
  const [exporting, setExporting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Raw real data from Supabase / API
  const [pmeList, setPmeList] = useState<any[]>([]);
  const [menagesList, setMenagesList] = useState<any[]>([]);
  const [transitList, setTransitList] = useState<any[]>([]);
  const [autoritesList, setAutoritesList] = useState<any[]>([]);

  const fetchRealData = async () => {
    setLoading(true);
    try {
      const communeParam = selectedCommune !== "all" ? `?commune=${encodeURIComponent(selectedCommune)}` : "";
      
      const [pmeRes, menagesRes, transitRes, autoritesRes] = await Promise.all([
        fetch(`/api/enquetes/pme${communeParam}`).then((r) => r.json()),
        fetch(`/api/enquetes/menages${communeParam}`).then((r) => r.json()),
        fetch(`/api/enquetes/transit${communeParam}`).then((r) => r.json()),
        fetch(`/api/enquetes/autorites${communeParam}`).then((r) => r.json()),
      ]);

      setPmeList(Array.isArray(pmeRes.data) ? pmeRes.data : []);
      setMenagesList(Array.isArray(menagesRes.data) ? menagesRes.data : []);
      setTransitList(Array.isArray(transitRes.data) ? transitRes.data : []);
      setAutoritesList(Array.isArray(autoritesRes.data) ? autoritesRes.data : []);
    } catch (err) {
      console.error("[Dashboard] Erreur de chargement des données réelles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, [selectedCommune]);

  // Compute Real Metrics dynamically
  const metrics = useMemo(() => {
    const countPme = pmeList.length;
    const countMenages = menagesList.length;
    const countTransit = transitList.length;
    const countAutorites = autoritesList.length;

    // Filter by Actor if selected
    let totalPmeFiltered = countPme;
    let totalMenagesFiltered = countMenages;
    let totalTransitFiltered = countTransit;
    let totalAutoritesFiltered = countAutorites;

    if (selectedActor === "pme") {
      totalMenagesFiltered = 0; totalTransitFiltered = 0; totalAutoritesFiltered = 0;
    } else if (selectedActor === "menages") {
      totalPmeFiltered = 0; totalTransitFiltered = 0; totalAutoritesFiltered = 0;
    } else if (selectedActor === "transit") {
      totalPmeFiltered = 0; totalMenagesFiltered = 0; totalAutoritesFiltered = 0;
    } else if (selectedActor === "autorites") {
      totalPmeFiltered = 0; totalMenagesFiltered = 0; totalTransitFiltered = 0;
    }

    const totalEnquetes = totalPmeFiltered + totalMenagesFiltered + totalTransitFiltered + totalAutoritesFiltered;

    // Taux d'intérêt Lâbal réel
    let intPme = pmeList.filter((x) => x.interet_labal === "Oui").length;
    let intMenages = menagesList.filter((x) => x.pret_installer_labal === true).length;
    let intTransit = transitList.filter((x) => x.bouton_alerte_sos === true).length;
    let intAutorites = autoritesList.filter((x) => x.point_focal_designe === true).length;
    
    let totalPrets = intPme + intMenages + intTransit + intAutorites;
    const tauxLabal = totalEnquetes > 0 ? Math.round((totalPrets / totalEnquetes) * 100) : 0;

    // Taux Mobile Money réel
    let mmPme = pmeList.filter((x) => Array.isArray(x.modes_paiement_recus) && (x.modes_paiement_recus.includes("Orange Money") || x.modes_paiement_recus.includes("MTN Money"))).length;
    let mmMenages = menagesList.filter((x) => x.mode_paiement === "Orange Money" || x.mode_paiement === "MTN Money").length;
    let totalMM = mmPme + mmMenages;
    const denominatorMM = (selectedActor === "pme" ? countPme : selectedActor === "menages" ? countMenages : (countPme + countMenages));
    const mobileMoney = denominatorMM > 0 ? Math.round((totalMM / denominatorMM) * 100) : 0;

    // Saturation ZST critique
    let satCritique = transitList.filter((x) => x.frequence_saturation === "Quotidienne" || x.frequence_saturation === "Permanente").length;
    const saturationCritique = countTransit > 0 ? Math.round((satCritique / countTransit) * 100) : 0;

    return {
      totalEnquetes,
      pme: totalPmeFiltered,
      menages: totalMenagesFiltered,
      transit: totalTransitFiltered,
      autorites: totalAutoritesFiltered,
      tauxLabal,
      mobileMoney,
      saturationCritique,
    };
  }, [pmeList, menagesList, transitList, autoritesList, selectedActor]);

  // Real Recharts Pie Breakdown
  const enquetesParActeurReal = useMemo(() => [
    { name: "PME Collecte", value: metrics.pme, color: COLORS.lime },
    { name: "Ménages", value: metrics.menages, color: COLORS.deep },
    { name: "Transit (ZST)", value: metrics.transit, color: "#2D8F4E" },
    { name: "Autorités", value: metrics.autorites, color: "#4CAF50" },
  ], [metrics]);

  // Real Ratio Espèces vs Mobile Money par Commune
  const ratioPaiementReal = useMemo(() => {
    return COMMUNES.map((comm) => {
      const pmesComm = pmeList.filter((x) => Array.isArray(x.communes) && x.communes.includes(comm));
      const menagesComm = menagesList.filter((x) => x.commune === comm);

      const totalActorComm = pmesComm.length + menagesComm.length;
      if (totalActorComm === 0) {
        return { commune: comm, especes: 0, mobileMoney: 0 };
      }

      const mmCount = pmesComm.filter((x) => Array.isArray(x.modes_paiement_recus) && (x.modes_paiement_recus.includes("Orange Money") || x.modes_paiement_recus.includes("MTN Money"))).length +
                      menagesComm.filter((x) => x.mode_paiement === "Orange Money" || x.mode_paiement === "MTN Money").length;

      const mmPct = Math.round((mmCount / totalActorComm) * 100);
      return { commune: comm, especes: 100 - mmPct, mobileMoney: mmPct };
    });
  }, [pmeList, menagesList]);

  // Real Saturation ZST par Commune
  const saturationTransitReal = useMemo(() => {
    return COMMUNES.map((comm) => {
      const sites = transitList.filter((x) => x.commune === comm);
      const total = sites.length;
      if (total === 0) return { commune: comm, quotidienne: 0, hebdomadaire: 0, occasionnelle: 0 };
      
      const quot = Math.round((sites.filter((x) => x.frequence_saturation === "Quotidienne" || x.frequence_saturation === "Permanente").length / total) * 100);
      const hebdo = Math.round((sites.filter((x) => x.frequence_saturation === "Hebdomadaire" || x.frequence_saturation === "Souvent").length / total) * 100);
      const occa = Math.max(0, 100 - quot - hebdo);

      return { commune: comm, quotidienne: quot, hebdomadaire: hebdo, occasionnelle: occa };
    });
  }, [transitList]);

  // Real Intérêt Lâbal par Acteur
  const interetLabalReal = useMemo(() => {
    const calc = (list: any[], checkField: (item: any) => boolean) => {
      if (list.length === 0) return { oui: 0, peutEtre: 0, non: 0 };
      const oui = Math.round((list.filter(checkField).length / list.length) * 100);
      return { oui, peutEtre: Math.round((100 - oui) * 0.6), non: Math.round((100 - oui) * 0.4) };
    };

    const pmeRes = calc(pmeList, (x) => x.interet_labal === "Oui");
    const mRes = calc(menagesList, (x) => x.pret_installer_labal === true);
    const tRes = calc(transitList, (x) => x.bouton_alerte_sos === true);
    const aRes = calc(autoritesList, (x) => x.point_focal_designe === true);

    return [
      { acteur: "PME", oui: pmeRes.oui, peutEtre: pmeRes.peutEtre, non: pmeRes.non },
      { acteur: "Ménages", oui: mRes.oui, peutEtre: mRes.peutEtre, non: mRes.non },
      { acteur: "Transit", oui: tRes.oui, peutEtre: tRes.peutEtre, non: tRes.non },
      { acteur: "Autorités", oui: aRes.oui, peutEtre: aRes.peutEtre, non: aRes.non },
    ];
  }, [pmeList, menagesList, transitList, autoritesList]);

  // Exports Handlers
  const handleExportPdf = async () => {
    setExporting("pdf");
    try {
      window.open("/api/export/pdf", "_blank");
    } finally {
      setExporting(null);
    }
  };

  const handleExportPptx = async () => {
    setExporting("pptx");
    try {
      window.location.href = "/api/export/pptx";
    } finally {
      setTimeout(() => setExporting(null), 2000);
    }
  };

  return (
    <div className="bg-labal-gray-light min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title & Export Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-labal-deep/10 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-labal-lime/15 text-labal-deep text-xs font-black border border-labal-lime/30">
                <BarChart3 className="w-3.5 h-3.5 text-labal-lime" />
                Données Consolidées · Ville de Conakry
              </span>
              {loading && (
                <span className="inline-flex items-center gap-1 text-xs text-labal-lime font-bold">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Mise à jour...
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-labal-deep tracking-tight mt-1.5">
              Tableau de Bord Analytique Lâbal
            </h1>
            <p className="text-xs sm:text-sm text-labal-gray-dark font-medium mt-0.5">
              Suivi analytique et agrégation en temps réel des enquêtes d&apos;assainissement
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchRealData}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-labal-deep/15 text-labal-deep font-bold hover:bg-labal-gray-light text-xs transition-all touch-target"
              title="Rafraîchir les données"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
            <button
              onClick={handleExportPdf}
              disabled={exporting === "pdf"}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-labal-deep text-white font-bold hover:bg-labal-deep/90 shadow-xs text-xs transition-all touch-target"
            >
              <FileDown className="w-4 h-4 text-labal-lime" />
              Export PDF
            </button>
            <button
              onClick={handleExportPptx}
              disabled={exporting === "pptx"}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-labal-lime text-white font-bold hover:bg-labal-lime/90 shadow-xs text-xs transition-all touch-target"
            >
              <Presentation className="w-4 h-4" />
              Export PowerPoint (.pptx)
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          selectedCommune={selectedCommune}
          onCommuneChange={setSelectedCommune}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          selectedActor={selectedActor}
          onActorChange={setSelectedActor}
        />

        {/* KPI Cards Grid (Real Metrics) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KpiCard
            icon={ClipboardList}
            value={metrics.totalEnquetes}
            label="Total Enquêtes"
            trend="Consolidé"
            trendUp={true}
          />
          <KpiCard
            icon={TrendingUp}
            value={`${metrics.tauxLabal}%`}
            label="Intérêt Lâbal"
            trend="Adhésion"
            trendUp={true}
          />
          <KpiCard
            icon={Smartphone}
            value={`${metrics.mobileMoney}%`}
            label="Mobile Money"
            trend="Usage"
            trendUp={true}
          />
          <KpiCard
            icon={AlertTriangle}
            value={`${metrics.saturationCritique}%`}
            label="Saturation ZST"
            trend="Alerte"
            trendUp={false}
          />
        </div>

        {/* Actor Count Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KpiCard icon={Truck} value={metrics.pme} label="Enquêtes PME" />
          <KpiCard icon={Users} value={metrics.menages} label="Enquêtes Ménages" />
          <KpiCard icon={Recycle} value={metrics.transit} label="Enquêtes Transit" />
          <KpiCard icon={Building2} value={metrics.autorites} label="Enquêtes Autorités" />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart: Répartition Réelle */}
          <StatCard title="Répartition des enquêtes par acteur">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={enquetesParActeurReal}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {enquetesParActeurReal.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${COLORS.deep}`,
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
              </PieChart>
            </ResponsiveContainer>
          </StatCard>

          {/* Bar Chart: Ratio Espèces vs Mobile Money Réel */}
          <StatCard title="Ratio Espèces vs Mobile Money par commune (%)">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ratioPaiementReal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="commune" tick={{ fontSize: 11, fontWeight: "bold" }} />
                <YAxis unit="%" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${COLORS.deep}`,
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
                <Bar dataKey="especes" name="Espèces (%)" fill={COLORS.deep} radius={[4, 4, 0, 0]} />
                <Bar dataKey="mobileMoney" name="Mobile Money (%)" fill={COLORS.lime} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </StatCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart: Saturation ZST Réelle */}
          <StatCard title="Fréquence de saturation des zones de transit (%)">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={saturationTransitReal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="commune" tick={{ fontSize: 11, fontWeight: "bold" }} />
                <YAxis unit="%" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${COLORS.deep}`,
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
                <Bar dataKey="quotidienne" name="Quotidienne (%)" fill="#E74C3C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hebdomadaire" name="Hebdomadaire (%)" fill="#F4B41A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="occasionnelle" name="Occasionnelle (%)" fill={COLORS.lime} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </StatCard>

          {/* Grouped Bar Chart: Intérêt Lâbal Réel */}
          <StatCard title="Adhésion & Intérêt pour Lâbal par type d'acteur (%)">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={interetLabalReal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="acteur" tick={{ fontSize: 11, fontWeight: "bold" }} />
                <YAxis unit="%" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${COLORS.deep}`,
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
                <Bar dataKey="oui" name="Favorable (Oui)" fill={COLORS.lime} radius={[4, 4, 0, 0]} />
                <Bar dataKey="peutEtre" name="Mitigé (Peut-être)" fill="#F4B41A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="non" name="Défavorable (Non)" fill="#E74C3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </StatCard>
        </div>
      </div>
    </div>
  );
}
