"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Clock,
  History,
  Users,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";

export default function AdminUsersPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <AdminUsersContent />
    </RoleGuard>
  );
}

function AdminUsersContent() {
  const { currentUser, users, auditLogs, approveUser, rejectUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "audit">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const pendingUsers = users.filter((u) => u.status === "PENDING");
  const approvedUsers = users.filter((u) => u.status === "APPROVED");
  const adminUsers = users.filter((u) => u.role === "ADMIN");

  const filteredPending = pendingUsers.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.commune_affectation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApproved = approvedUsers.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.commune_affectation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (userId: string, name: string) => {
    approveUser(userId);
    setSuccessNotice(`Le compte de ${name} a été approuvé avec succès.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleReject = (userId: string, name: string) => {
    rejectUser(userId);
    setSuccessNotice(`La demande de ${name} a été rejetée.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  return (
    <div className="bg-labal-gray-light min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-labal-deep/10 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                Portail d&apos;Administration RBAC
              </span>
              <span className="text-xs font-semibold text-labal-gray-dark">
                Connecté en tant que : <strong className="text-labal-deep">{currentUser?.full_name}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-labal-deep tracking-tight mt-1.5">
              Gestion des Comptes & Approbation Enquêteurs
            </h1>
            <p className="text-xs sm:text-sm text-labal-gray-dark font-medium mt-0.5">
              Validation administrative Zero-Trust et suivi du registre d&apos;audit de sécurité.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <div>
              <p className="font-bold text-amber-900">{pendingUsers.length} Demande(s) en attente</p>
              <p className="text-[0.65rem] text-amber-700">3 Administrateurs Actifs</p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl flex items-center justify-between animate-slide-up">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-labal-deep/10">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all touch-target ${
                activeTab === "pending"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-labal-gray-light text-labal-gray-dark hover:bg-labal-gray-medium"
              }`}
            >
              <Clock className="w-4 h-4" />
              Demandes en attente
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[0.65rem]">
                {pendingUsers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("approved")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all touch-target ${
                activeTab === "approved"
                  ? "bg-labal-deep text-white shadow-sm"
                  : "bg-labal-gray-light text-labal-gray-dark hover:bg-labal-gray-medium"
              }`}
            >
              <Users className="w-4 h-4" />
              Comptes Validés
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[0.65rem]">
                {approvedUsers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all touch-target ${
                activeTab === "audit"
                  ? "bg-labal-lime text-labal-deep font-black shadow-sm"
                  : "bg-labal-gray-light text-labal-gray-dark hover:bg-labal-gray-medium"
              }`}
            >
              <History className="w-4 h-4" />
              Logs d&apos;Audit ({auditLogs.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-labal-gray-dark absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Rechercher nom, commune..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-labal-gray-light rounded-xl text-xs border border-labal-deep/10 focus:ring-2 focus:ring-labal-lime/50"
            />
          </div>
        </div>

        {/* TAB 1: PENDING APPROVAL QUEUE */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {filteredPending.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-labal-deep/10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-labal-lime mx-auto" />
                <h3 className="text-lg font-black text-labal-deep">Aucune demande d&apos;enquêteur en attente !</h3>
                <p className="text-xs text-labal-gray-dark">Tous les comptes d&apos;enquêteurs ont été examinés et validés par l&apos;administration.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPending.map((u) => (
                  <div
                    key={u.id}
                    className="bg-white p-6 rounded-3xl border border-amber-200 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-labal-deep">{u.full_name}</h3>
                          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[0.65rem] font-extrabold border border-amber-300">
                            En Attente
                          </span>
                        </div>
                        <p className="text-xs text-labal-gray-dark mt-0.5">{u.email}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black border border-amber-200">
                        {u.full_name.charAt(0)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-labal-gray-light p-3 rounded-2xl border border-labal-deep/5">
                      <div>
                        <span className="text-[0.65rem] font-bold text-labal-gray-dark block">Téléphone :</span>
                        <span className="font-bold text-labal-deep">{u.phone}</span>
                      </div>
                      <div>
                        <span className="text-[0.65rem] font-bold text-labal-gray-dark block">Commune d&apos;affectation :</span>
                        <span className="font-black text-labal-lime">{u.commune_affectation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleApprove(u.id, u.full_name)}
                        className="flex-1 py-3 bg-labal-deep text-white font-bold text-xs rounded-xl shadow-xs hover:bg-labal-deep/90 transition-all flex items-center justify-center gap-1.5 touch-target"
                      >
                        <UserCheck className="w-4 h-4 text-labal-lime" />
                        Approuver le compte
                      </button>

                      <button
                        onClick={() => handleReject(u.id, u.full_name)}
                        className="py-3 px-4 bg-red-50 text-red-700 font-bold text-xs rounded-xl border border-red-200 hover:bg-red-100 transition-all flex items-center justify-center gap-1.5 touch-target"
                      >
                        <UserX className="w-4 h-4" />
                        Rejeter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APPROVED USERS LIST */}
        {activeTab === "approved" && (
          <div className="bg-white rounded-3xl border border-labal-deep/10 overflow-hidden shadow-xs">
            <div className="p-6 border-b border-labal-deep/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-labal-deep">Liste des Utilisateurs Validés</h3>
                <p className="text-xs text-labal-gray-dark">Comprenant les 3 Administrateurs et les Enquêteurs Approuvés.</p>
              </div>
              <span className="px-3 py-1 bg-labal-lime/20 text-labal-deep font-bold text-xs rounded-full">
                {filteredApproved.length} comptes actifs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-labal-gray-light border-b border-labal-deep/10 text-labal-gray-dark font-bold">
                    <th className="p-4">Utilisateur</th>
                    <th className="p-4">Rôle</th>
                    <th className="p-4">Commune</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4">Date de Création</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-labal-deep/10">
                  {filteredApproved.map((u) => (
                    <tr key={u.id} className="hover:bg-labal-gray-light/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-labal-deep">{u.full_name}</p>
                        <p className="text-[0.65rem] text-labal-gray-dark">{u.email}</p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[0.65rem] font-bold ${
                            u.role === "ADMIN"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-labal-lime/20 text-labal-deep border border-labal-lime/40"
                          }`}
                        >
                          {u.role === "ADMIN" ? "👑 Administrateur" : "👷 Enquêteur"}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-labal-deep">{u.commune_affectation}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Approuvé
                        </span>
                      </td>
                      <td className="p-4 text-labal-gray-dark">
                        {new Date(u.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-3xl border border-labal-deep/10 p-6 space-y-4 shadow-xs">
            <div>
              <h3 className="text-base font-black text-labal-deep flex items-center gap-2">
                <History className="w-5 h-5 text-labal-lime" />
                Registre des Actions d&apos;Audit (Audit Logging OWASP)
              </h3>
              <p className="text-xs text-labal-gray-dark mt-0.5">
                Historique inaltérable de chaque décision d&apos;approbation ou de rejet d&apos;accès.
              </p>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-labal-gray-light rounded-2xl border border-labal-deep/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                        log.action === "USER_APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.action === "USER_APPROVED" ? "✓" : "✕"}
                    </div>
                    <div>
                      <p className="font-bold text-labal-deep">
                        <strong className="text-amber-800">{log.actor_name}</strong> a exécuté{" "}
                        <span className="font-black underline">{log.action}</span> sur{" "}
                        <strong className="text-labal-deep">{log.target_name}</strong>
                      </p>
                      <p className="text-[0.7rem] text-labal-gray-dark mt-0.5">{log.details}</p>
                    </div>
                  </div>

                  <span className="text-[0.65rem] font-semibold text-labal-gray-dark bg-white px-2.5 py-1 rounded-lg border border-labal-deep/10 self-start sm:self-auto">
                    {new Date(log.timestamp).toLocaleString("fr-FR")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
