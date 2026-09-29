"use client";

import { COMMUNES } from "@/lib/constants";

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
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-labal-gray-light rounded-xl border border-labal-gray-medium">
      {/* Commune Filter */}
      <div className="flex-1">
        <label className="block text-xs font-semibold text-labal-deep mb-1">
          Commune
        </label>
        <select
          value={selectedCommune}
          onChange={(e) => onCommuneChange(e.target.value)}
          className="w-full text-sm"
        >
          <option value="all">Toutes les communes</option>
          {COMMUNES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Period Filter */}
      <div className="flex-1">
        <label className="block text-xs font-semibold text-labal-deep mb-1">
          Période
        </label>
        <select
          value={selectedPeriod}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="w-full text-sm"
        >
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Actor Filter */}
      <div className="flex-1">
        <label className="block text-xs font-semibold text-labal-deep mb-1">
          Type d&apos;acteur
        </label>
        <select
          value={selectedActor}
          onChange={(e) => onActorChange(e.target.value)}
          className="w-full text-sm"
        >
          {ACTORS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
