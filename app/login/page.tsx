"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, INITIAL_ADMINS } from "@/lib/auth/AuthContext";
import { Lock, LogIn, ShieldCheck, UserCheck, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, users, setCurrentUserDirect } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const success = login(email);
    if (success) {
      router.push("/");
    } else {
      setErrorMsg("Adresse email non reconnue dans la base des utilisateurs Labal.");
    }
  };

  return (
    <div className="bg-labal-gray-light min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-3xl border border-labal-deep/10 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-labal-deep text-white flex items-center justify-center mx-auto border border-labal-lime/30 shadow-md">
            <Lock className="w-7 h-7 text-labal-lime" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-labal-deep tracking-tight">
            Connexion Plateforme Labal
          </h1>
          <p className="text-xs sm:text-sm text-labal-gray-dark font-medium max-w-md mx-auto">
            Accès sécurisé pour les 3 Administrateurs et les Enquêteurs Terrain validés.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-labal-deep">Adresse Email</label>
            <input
              type="email"
              required
              placeholder="admin1@labal-guinee.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-labal-deep/20 text-sm focus:ring-2 focus:ring-labal-lime/50 focus:border-labal-deep transition-all touch-target"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-labal-deep">Mot de passe</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-labal-deep/20 text-sm focus:ring-2 focus:ring-labal-lime/50 focus:border-labal-deep transition-all touch-target"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-labal-deep text-white font-bold text-sm rounded-xl shadow-md hover:bg-labal-deep/90 transition-all flex items-center justify-center gap-2 touch-target"
          >
            <LogIn className="w-4 h-4 text-labal-lime" />
            Se Connecter
          </button>
        </form>

        {/* 3 Pre-seeded Super Admin Fast Selector */}
        <div className="pt-4 border-t border-labal-deep/10 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-black text-labal-deep uppercase tracking-wider">
              Accès Direct — 3 Comptes Administrateurs Pré-configurés :
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {INITIAL_ADMINS.map((admin, idx) => (
              <button
                key={admin.id}
                onClick={() => {
                  setCurrentUserDirect(admin);
                  router.push("/admin/users");
                }}
                className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded">
                    Admin {idx + 1}
                  </span>
                  <ArrowRight className="w-3 h-3 text-amber-700 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                <p className="text-xs font-black text-labal-deep mt-1 truncate">{admin.full_name}</p>
                <p className="text-[0.65rem] text-labal-gray-dark truncate">{admin.email}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Demo Enquêteur accounts */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-black text-labal-deep uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-labal-lime" />
            Comptes Enquêteurs de démonstration :
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {users
              .filter((u) => u.role === "ENQUETEUR")
              .map((enq) => (
                <button
                  key={enq.id}
                  onClick={() => {
                    setCurrentUserDirect(enq);
                    router.push("/enquete/pme");
                  }}
                  className="p-2.5 bg-labal-gray-light hover:bg-white border border-labal-deep/10 rounded-xl text-left transition-all"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-labal-deep truncate">{enq.full_name}</p>
                    <span
                      className={`text-[0.6rem] px-1.5 py-0.5 rounded font-bold ${
                        enq.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {enq.status === "APPROVED" ? "Approuvé" : "En attente"}
                    </span>
                  </div>
                  <p className="text-[0.65rem] text-labal-gray-dark">{enq.commune_affectation}</p>
                </button>
              ))}
          </div>
        </div>

        <div className="pt-4 border-t border-labal-deep/10 flex items-center justify-between text-xs font-semibold">
          <Link href="/" className="inline-flex items-center gap-1.5 text-labal-gray-dark hover:text-labal-deep">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour accueil
          </Link>
          <Link href="/register" className="text-labal-deep font-bold hover:underline">
            Créer un nouveau compte Enquêteur
          </Link>
        </div>
      </div>
    </div>
  );
}
