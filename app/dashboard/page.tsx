"use client";

import { useState } from "react";
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
} from "lucide-react";
import { KpiCard, StatCard } from "@/components/dashboard/KpiCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { COLORS } from "@/lib/constants";

// ============================================================
// Demo data — to be replaced by Supabase queries
// ============================================================

const kpiData = {
  totalEnquetes: 347,
  pme: 82,
  menages: 156,
  transit: 45,
  autorites: 64,
  tauxLabal: 73,
  mobileMoney: 41,
  saturationCritique: 28,
};

const enquetesParActeur = [
  { name: "PME Collecte", value: 82, color: COLORS.lime },
  { name: "Ménages", value: 156, color: COLORS.deep },
  { name: "Transit", value: 45, color: "#2D8F4E" },
  { name: "Autorités", value: 64, color: "#4CAF50" },
];

const ratioPaiement = [
  { commune: "Kaloum", especes: 65, mobileMoney: 35 },
  { commune: "Dixinn", especes: 58, mobileMoney: 42 },
  { commune: "Matam", especes: 72, mobileMoney: 28 },
  { commune: "Ratoma", especes: 55, mobileMoney: 45 },
  { commune: "Matoto", especes: 60, mobileMoney: 40 },
];

const saturationTransit = [
  { commune: "Kaloum", quotidienne: 40, hebdomadaire: 35, occasionnelle: 25 },
  { commune: "Dixinn", quotidienne: 25, hebdomadaire: 40, occasionnelle: 35 },
  { commune: "Matam", quotidienne: 55, hebdomadaire: 30, occasionnelle: 15 },
  { commune: "Ratoma", quotidienne: 30, hebdomadaire: 45, occasionnelle: 25 },
  { commune: "Matoto", quotidienne: 45, hebdomadaire: 35, occasionnelle: 20 },
];

const evolutionSoumissions = [
  { mois: "Jan", pme: 8, menages: 15, transit: 4, autorites: 6 },
  { mois: "Fév", pme: 12, menages: 22, transit: 6, autorites: 8 },
  { mois: "Mar", pme: 10, menages: 18, transit: 5, autorites: 10 },
  { mois: "Avr", pme: 15, menages: 28, transit: 8, autorites: 12 },
  { mois: "Mai", pme: 18, menages: 35, transit: 10, autorites: 14 },
  { mois: "Jun", pme: 19, menages: 38, transit: 12, autorites: 14 },
];

const interetLabal = [
  { acteur: "PME", oui: 68, peutEtre: 20, non: 12 },
  { acteur: "Ménages", oui: 72, peutEtre: 18, non: 10 },
  { acteur: "Transit", oui: 80, peutEtre: 15, non: 5 },
  { acteur: "Autorités", oui: 75, peutEtre: 20, non: 5 },
];

const pmeParTranche = [
  { tranche: "<100", count: 25 },
  { tranche: "100-300", count: 32 },
  { tranche: "300-700", count: 18 },
  { tranche: ">700", count: 7 },
];

export default function DashboardPage() {
  const [commune, setCommune] = useState("all");
  const [period, setPeriod] = useState("all");
  const [actor, setActor] = useState("all");
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      const response = await fetch("/api/export/pdf");
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `labal-rapport-${new Date().toISOString().slice(0, 10)}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Export PDF error:", err);
    } finally {
      setExporting(null);
    }
  };

  const handleExportPPTX = async () => {
    setExporting("pptx");
    try {
      const response = await fetch("/api/export/pptx");
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `labal-presentation-${new Date().toISOString().slice(0, 10)}.pptx`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Export PPTX error:", err);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-labal-deep">
            Tableau de bord
          </h1>
          <p className="text-sm text-labal-gray-dark mt-1">
            Vue d&apos;ensemble des enquêtes d&apos;assainissement — Conakry
          </p>
          <div className="mt-2 h-1 w-16 bg-labal-lime rounded-full" />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            disabled={exporting === "pdf"}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-labal-deep text-white font-semibold rounded-lg hover:bg-labal-deep/90 transition-all text-sm shadow-sm disabled:opacity-60"
          >
            <FileDown className="w-4 h-4" />
            {exporting === "pdf" ? "Génération..." : "Rapport PDF"}
          </button>
          <button
            onClick={handleExportPPTX}
            disabled={exporting === "pptx"}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-labal-lime text-white font-semibold rounded-lg hover:bg-labal-lime/90 transition-all text-sm shadow-sm disabled:opacity-60"
          >
            <Presentation className="w-4 h-4" />
            {exporting === "pptx" ? "Génération..." : "Présentation PPTX"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <FilterBar
          selectedCommune={commune}
          onCommuneChange={setCommune}
          selectedPeriod={period}
          onPeriodChange={setPeriod}
          selectedActor={actor}
          onActorChange={setActor}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          icon={ClipboardList}
          value={kpiData.totalEnquetes}
          label="Total enquêtes"
          trend="+12%"
          trendUp
        />
        <KpiCard
          icon={TrendingUp}
          value={`${kpiData.tauxLabal}%`}
          label="Intérêt Lâbal"
          trend="+5%"
          trendUp
        />
        <KpiCard
          icon={Smartphone}
          value={`${kpiData.mobileMoney}%`}
          label="Mobile Money"
          trend="+8%"
          trendUp
        />
        <KpiCard
          icon={AlertTriangle}
          value={`${kpiData.saturationCritique}%`}
          label="Saturation critique ZST"
          trend="-3%"
          trendUp={false}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={Truck} value={kpiData.pme} label="Enquêtes PME" />
        <KpiCard icon={Users} value={kpiData.menages} label="Enquêtes Ménages" />
        <KpiCard icon={Recycle} value={kpiData.transit} label="Enquêtes Transit" />
        <KpiCard icon={Building2} value={kpiData.autorites} label="Enquêtes Autorités" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart 1: Répartition par acteur (Pie) */}
        <StatCard title="Répartition des enquêtes par acteur">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={enquetesParActeur}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  `${name || ""} (${((percent || 0) * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {enquetesParActeur.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${COLORS.deep}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </StatCard>

        {/* Chart 2: Ratio Espèces vs Mobile Money */}
        <StatCard title="Ratio Espèces vs Mobile Money par commune">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ratioPaiement}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grayMedium} />
              <XAxis
                dataKey="commune"
                tick={{ fill: COLORS.deep, fontSize: 12 }}
                axisLine={{ stroke: COLORS.deep }}
              />
              <YAxis
                tick={{ fill: COLORS.deep, fontSize: 12 }}
                axisLine={{ stroke: COLORS.deep }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${COLORS.deep}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Bar
                dataKey="especes"
                name="Espèces"
                fill={COLORS.deep}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="mobileMoney"
                name="Mobile Money"
                fill={COLORS.lime}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </StatCard>

        {/* Chart 3: Saturation ZST */}
        <StatCard title="Taux de saturation des zones de transit">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={saturationTransit} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grayMedium} />
              <XAxis
                type="number"
                tick={{ fill: COLORS.deep, fontSize: 12 }}
                axisLine={{ stroke: COLORS.deep }}
                unit="%"
              />
              <YAxis
                dataKey="commune"
                type="category"
                tick={{ fill: COLORS.deep, fontSize: 12 }}
                axisLine={{ stroke: COLORS.deep }}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${COLORS.deep}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Bar
                dataKey="quotidienne"
                name="Quotidienne"
                stackId="a"
                fill="#dc2626"
              />
              <Bar
                dataKey="hebdomadaire"
                name="Hebdomadaire"
                stackId="a"
                fill={COLORS.lime}
              />
              <Bar
                dataKey="occasionnelle"
                name="Occasionnelle"
                stackId="a"
                fill={COLORS.deep}
              />
            </BarChart>
          </ResponsiveContainer>
        </StatCard>

        {/* Chart 4: Évolution des soumissions */}
        <StatCard title="Évolution des soumissions dans le temps">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={evolutionSoumissions}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grayMedium} />
              <XAxis
                dataKey="mois"
                tick={{ fill: COLORS.deep, fontSize: 12 }}
                axisLine={{ stroke: COLORS.deep }}
              />
              <YAxis
                tick={{ fill: COLORS.deep, fontSize: 12 }}
                axisLine={{ stroke: COLORS.deep }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${COLORS.deep}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="pme"
                name="PME"
                stackId="1"
                stroke={COLORS.lime}
                fill={COLORS.lime}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="menages"
                name="Ménages"
                stackId="1"
                stroke={COLORS.deep}
                fill={COLORS.deep}
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="transit"
                name="Transit"
                stackId="1"
                stroke="#2D8F4E"
                fill="#2D8F4E"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="autorites"
                name="Autorités"
                stackId="1"
                stroke="#4CAF50"
                fill="#4CAF50"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </StatCard>

        {/* Chart 5: Intérêt pour Lâbal */}
        <StatCard title="Intérêt pour Lâbal par type d'acteur">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={interetLabal}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grayMedium} />
              <XAxis
                dataKey="acteur"
                tick={{ fill: COLORS.deep, fontSize: 12 }}
                axisLine={{ stroke: COLORS.deep }}
              />
              <YAxis
                tick={{ fill: COLORS.deep, fontSize: 12 }}
                axisLine={{ stroke: COLORS.deep }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${COLORS.deep}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Bar
                dataKey="oui"
                name="Oui"
                fill={COLORS.lime}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="peutEtre"
                name="Peut-être"
                fill={COLORS.deep}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="non"
                name="Non"
                fill={COLORS.grayDark}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </StatCard>

        {/* Chart 6: PME par tranche de ménages */}
        <StatCard title="PME par tranche de ménages desservis">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pmeParTranche}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grayMedium} />
              <XAxis
                dataKey="tranche"
                tick={{ fill: COLORS.deep, fontSize: 12 }}
                axisLine={{ stroke: COLORS.deep }}
                label={{
                  value: "Nb ménages",
                  position: "insideBottom",
                  offset: -5,
                  style: { fill: COLORS.deep, fontSize: 11 },
                }}
              />
              <YAxis
                tick={{ fill: COLORS.deep, fontSize: 12 }}
                axisLine={{ stroke: COLORS.deep }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${COLORS.deep}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="count"
                name="Nb PME"
                fill={COLORS.lime}
                radius={[6, 6, 0, 0]}
              >
                {pmeParTranche.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? COLORS.lime : COLORS.deep}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </StatCard>
      </div>
    </div>
  );
}
