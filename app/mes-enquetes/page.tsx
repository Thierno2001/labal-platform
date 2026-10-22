"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Truck,
  Home as HomeIcon,
  Recycle,
  Building2,
  RefreshCw,
  CheckCircle2,
  Clock,
  Trash2,
  ArrowRight,
  PlusCircle,
  Wifi,
  FileEdit,
  MapPin,
} from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getAllDrafts,
  deleteDraft,
  getPendingSubmissions,
  getLocalSubmittedHistory,
  type FormType,
  type SubmittedSurveyRecord,
} from "@/lib/offline/indexeddb";
import { syncPendingSubmissions } from "@/lib/offline/sync";

const FORM_META: Record<
  FormType,
  { label: string; badge: string; href: string; icon: any }
> = {
  pme: {
    label: "PME de Collecte",
    badge: "PME / CONAAG",
    href: "/enquete/pme",
    icon: Truck,
  },
  menages: {
    label: "Ménages & Citoyens",
    badge: "Ménages",
    href: "/enquete/menages",
    icon: HomeIcon,
  },
  transit: {
    label: "Zones de Transit (ZST)",
    badge: "Transit ZST",
    href: "/enquete/transit",
    icon: Recycle,
  },
  autorites: {
    label: "Autorités Locales",
    badge: "Mairies",
    href: "/enquete/autorites",
    icon: Building2,
  },
};

export default function MesEnquetesPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "ENQUETEUR"]} requireApproved={true}>
      <MesEnquetesContent />
    </RoleGuard>
  );
}

function MesEnquetesContent() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [drafts, setDrafts] = useState<
    Array<{
      id: string;
      formType: FormType;
      data: Record<string, unknown>;
      currentStep: number;
      updatedAt: string;
    }>
  >([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [records, setRecords] = useState<SubmittedSurveyRecord[]>([]);

  const loadData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // 1. Load local drafts & pending submissions
      const [localDrafts, pendingList] = await Promise.all([
        getAllDrafts(),
        getPendingSubmissions(),
      ]);
      // Filter drafts that actually have at least one non-empty value
      const activeDrafts = localDrafts.filter((d) => {
        if (!d.data) return false;
        return Object.values(d.data).some((v) =>
          Array.isArray(v) ? v.length > 0 : v !== "" && v !== null && v !== undefined
        );
      });
      setDrafts(activeDrafts);
      setPendingCount(pendingList.length);

      // 2. Load local history for current user
      const localHistory = getLocalSubmittedHistory().filter(
        (item) =>
          !item.enqueteur_email ||
          item.enqueteur_email.toLowerCase() === currentUser.email.toLowerCase() ||
          item.enqueteur_id === currentUser.id
      );

      // 3. Load server surveys attributed to this surveyor
      const emailParam = encodeURIComponent(currentUser.email);
      const [pmeRes, menRes, traRes, autRes] = await Promise.all([
        fetch(`/api/enquetes/pme?enqueteur=${emailParam}`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`/api/enquetes/menages?enqueteur=${emailParam}`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`/api/enquetes/transit?enqueteur=${emailParam}`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`/api/enquetes/autorites?enqueteur=${emailParam}`).then((r) => r.json()).catch(() => ({ data: [] })),
      ]);

      const mergedMap = new Map<string, SubmittedSurveyRecord>();

      localHistory.forEach((rec) => {
        mergedMap.set(rec.id, rec);
      });

      const addServerRows = (rows: any[], formType: FormType) => {
        if (!Array.isArray(rows)) return;
        for (const r of rows) {
          if (!r || !r.id) continue;
          const label =
            formType === "pme"
              ? r.nom_structure || "PME Collecte"
              : formType === "menages"
              ? r.nom_repondant || "Ménage"
              : formType === "transit"
              ? r.nom_site || "Zone de Transit"
              : `${r.nom_repondant || "Autorité"} ${r.entite ? `(${r.entite})` : ""}`.trim();
          const commune =
            formType === "pme"
              ? Array.isArray(r.communes) && r.communes.length > 0
                ? r.communes.join(", ")
                : currentUser.commune_affectation
              : r.commune || currentUser.commune_affectation;

          mergedMap.set(r.id, {
            id: r.id,
            formType,
            label,
            commune,
            enqueteur_id: r.enqueteur_id || currentUser.id,
            enqueteur_nom: r.enqueteur_nom || currentUser.full_name,
            enqueteur_email: r.enqueteur_email || currentUser.email,
            createdAt: r.created_at || new Date().toISOString(),
            syncStatus: "synced",
          });
        }
      };

      addServerRows(pmeRes.data, "pme");
      addServerRows(menRes.data, "menages");
      addServerRows(traRes.data, "transit");
      addServerRows(autRes.data, "autorites");

      const sorted = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecords(sorted);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSyncNow = async () => {
    setSyncing(true);
    try {
      const res = await syncPendingSubmissions();
      await loadData();
      if (res.synced > 0) {
        alert(`${res.synced} enquête(s) hors-ligne synchronisée(s) avec succès !`);
      } else if (res.failed > 0) {
        alert(`${res.failed} enquête(s) n'ont pas pu être synchronisées. Vérifiez votre connexion.`);
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleClearDraft = async (formType: FormType) => {
    await deleteDraft(formType);
    await loadData();
  };

  const counts = useMemo(() => {
    return {
      total: records.length,
      pme: records.filter((r) => r.formType === "pme").length,
      menages: records.filter((r) => r.formType === "menages").length,
      transit: records.filter((r) => r.formType === "transit").length,
      autorites: records.filter((r) => r.formType === "autorites").length,
    };
  }, [records]);

  return (
    <div className="bg-labal-gray-light min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Profile & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-labal-deep/10 shadow-xs">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-labal-lime/15 text-labal-deep text-xs font-black border border-labal-lime/30">
                <ClipboardCheck className="w-3.5 h-3.5 text-labal-lime" />
                Espace Personnel Enquêteur
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-labal-gray-dark bg-labal-gray-light px-2.5 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-labal-deep" />
                Zone : <strong className="text-labal-deep">{currentUser?.commune_affectation}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-labal-deep tracking-tight mt-1.5">
              Mes Enquêtes Réalisées — {currentUser?.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-labal-gray-dark font-medium mt-0.5">
              Suivez le nombre d&apos;enquêtes que vous avez effectuées, vos brouillons en cours et l&apos;état de synchronisation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {pendingCount > 0 && (
              <button
                onClick={handleSyncNow}
                disabled={syncing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 text-xs transition-all shadow-xs"
              >
                <Wifi className={`w-4 h-4 ${syncing ? "animate-pulse" : ""}`} />
                {syncing ? "Synchronisation..." : `Synchroniser (${pendingCount})`}
              </button>
            )}
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-labal-deep/15 text-labal-deep font-bold hover:bg-labal-gray-light text-xs transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Personal KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="col-span-2 sm:col-span-1 bg-labal-deep text-white p-5 rounded-2xl shadow-md border border-labal-lime/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                Total Réalisé
              </span>
              <ClipboardCheck className="w-5 h-5 text-labal-lime" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-labal-lime">{counts.total}</span>
              <p className="text-[0.7rem] text-white/80 font-medium mt-0.5">
                Enquête(s) validée(s)
              </p>
            </div>
          </div>

          {(["pme", "menages", "transit", "autorites"] as FormType[]).map((type) => {
            const meta = FORM_META[type];
            const Icon = meta.icon;
            const val = counts[type];
            return (
              <Link
                key={type}
                href={meta.href}
                className="bg-white p-5 rounded-2xl border border-labal-deep/10 hover:border-labal-deep/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-labal-gray-dark">{meta.badge}</span>
                  <div className="w-8 h-8 rounded-xl bg-labal-gray-light flex items-center justify-center group-hover:bg-labal-deep transition-colors">
                    <Icon className="w-4 h-4 text-labal-deep group-hover:text-labal-lime" />
                  </div>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-black text-labal-deep">{val}</span>
                    <p className="text-[0.65rem] text-labal-gray-dark font-semibold">
                      {meta.label}
                    </p>
                  </div>
                  <span className="text-[0.65rem] font-bold text-labal-lime inline-flex items-center gap-0.5">
                    + Saisir <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Active Drafts Section (if any) */}
        {drafts.length > 0 && (
          <div className="bg-amber-50/90 border border-amber-200 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base font-black text-amber-950 flex items-center gap-2">
                  <FileEdit className="w-5 h-5 text-amber-700" />
                  Brouillons de formulaires en cours ({drafts.length})
                </h2>
                <p className="text-xs text-amber-800">
                  Ces formulaires contiennent des données non soumises. Vous pouvez reprendre votre saisie ou les vider.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {drafts.map((d) => {
                const meta = FORM_META[d.formType];
                return (
                  <div
                    key={d.id}
                    className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-black text-labal-deep">{meta.label}</span>
                      <p className="text-[0.7rem] text-labal-gray-dark mt-0.5">
                        Étape {d.currentStep + 1} sur 16 · Modifié à{" "}
                        {new Date(d.updatedAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={meta.href}
                        className="flex-1 py-2 px-3 bg-labal-deep text-white text-xs font-bold rounded-xl text-center hover:bg-labal-deep/90 transition-all"
                      >
                        Reprendre
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleClearDraft(d.formType)}
                        className="p-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl border border-red-200 transition-colors"
                        title="Vider ce brouillon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Submitted Surveys History Table */}
        <div className="bg-white rounded-3xl border border-labal-deep/10 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-labal-deep/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-labal-deep">
                Historique de mes enquêtes soumises
              </h2>
              <p className="text-xs text-labal-gray-dark">
                Liste chronologique des enquêtes validées depuis votre compte enquêteur.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["pme", "menages", "transit", "autorites"] as FormType[]).map((t) => (
                <Link
                  key={t}
                  href={FORM_META[t].href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-labal-gray-light hover:bg-labal-lime/20 text-labal-deep font-bold text-xs border border-labal-deep/10 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-labal-lime" />
                  {FORM_META[t].badge}
                </Link>
              ))}
            </div>
          </div>

          {records.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <ClipboardCheck className="w-12 h-12 text-labal-gray-dark/40 mx-auto" />
              <h3 className="text-base font-black text-labal-deep">
                Aucune enquête enregistrée pour le moment
              </h3>
              <p className="text-xs text-labal-gray-dark max-w-md mx-auto">
                Sélectionnez l&apos;un des 4 formulaires ci-dessus pour démarrer votre première enquête terrain. Dès sa validation, elle apparaîtra automatiquement ici.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-labal-gray-light border-b border-labal-deep/10 text-labal-gray-dark font-bold">
                    <th className="p-4">Catégorie</th>
                    <th className="p-4">Structure / Répondant / Site</th>
                    <th className="p-4">Commune</th>
                    <th className="p-4">Statut Synchronisation</th>
                    <th className="p-4">Date & Heure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-labal-deep/10">
                  {records.map((rec) => {
                    const meta = FORM_META[rec.formType];
                    return (
                      <tr key={rec.id} className="hover:bg-labal-gray-light/50 transition-colors">
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-labal-lime/15 text-labal-deep font-extrabold text-[0.65rem] border border-labal-lime/30">
                            {meta.badge}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-labal-deep">{rec.label}</td>
                        <td className="p-4 text-labal-gray-dark font-semibold">{rec.commune}</td>
                        <td className="p-4">
                          {rec.syncStatus === "synced" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[0.65rem]">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Synchronisé
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[0.65rem]">
                              <Clock className="w-3 h-3 text-amber-600" />
                              En attente réseau
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-labal-gray-dark">
                          {new Date(rec.createdAt).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
