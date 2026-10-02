"use client";

import { COMMUNES } from "@/lib/constants";
import { Filter, MapPin, Calendar, Users, RotateCcw } from "lucide-react";

interface FilterBarProps {
  selectedCommune: string;
  onCommuneChange: (commune: string) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  selectedActor: string;
  onActorChange: (actor: string) => void;
}

const PERIODS = [
  { value: "all", label: "Toute la période" },
  { value: "7d", label: "7 derniers jours" },
  { value: "30d", label: "30 derniers jours" },
  { value: "90d", label: "3 derniers mois" },
];

const ACTORS = [
  { value: "all", label: "Tous les acteurs" },
  { value: "pme", label: "PME de Collecte" },
  { value: "menages", label: "Ménages" },
  { value: "transit", label: "Zones Transit" },
  { value: "autorites", label: "Autorités" },
];

export function FilterBar({
  selectedCommune,
  onCommuneChange,
  selectedPeriod,
  onPeriodChange,
  selectedActor,
  onActorChange,
}: FilterBarProps) {
  const hasActiveFilter = selectedCommune !== "all" || selectedPeriod !== "all" || selectedActor !== "all";

  const handleReset = () => {
    onCommuneChange("all");
    onPeriodChange("all");
    onActorChange("all");
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-labal-deep/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-labal-lime/15 text-labal-deep">
            <Filter className="w-4 h-4 text-labal-lime" />
          </div>
          <span className="text-sm font-bold text-labal-deep tracking-tight">
            Filtres analytiques
          </span>
        </div>
        {hasActiveFilter && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs font-bold text-labal-lime hover:text-labal-deep transition-colors px-2 py-1 rounded-md bg-labal-lime/10"
          >
            <RotateCcw className="w-3 h-3" />
            Réinitialiser
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Commune Filter */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-labal-gray-dark uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-labal-lime" />
            Commune
          </label>
          <select
            value={selectedCommune}
            onChange={(e) => onCommuneChange(e.target.value)}
            className="form-input-styled text-sm py-2.5"
          >
            <option value="all">Toutes les communes (Conakry)</option>
            {COMMUNES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Period Filter */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-labal-gray-dark uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-labal-lime" />
            Période
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="form-input-styled text-sm py-2.5"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actor Filter */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-labal-gray-dark uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-labal-lime" />
            Type d&apos;acteur
          </label>
          <select
            value={selectedActor}
            onChange={(e) => onActorChange(e.target.value)}
            className="form-input-styled text-sm py-2.5"
          >
            {ACTORS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
