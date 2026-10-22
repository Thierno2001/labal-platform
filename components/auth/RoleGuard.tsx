"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { UserRole } from "@/lib/auth/types";
import Link from "next/link";
import { ShieldAlert, Clock, ArrowLeft, Lock, LogIn, KeyRound, CheckCircle2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireApproved?: boolean;
}

export function RoleGuard({
  children,
  allowedRoles = ["ADMIN", "ENQUETEUR"],
  requireApproved = true,
}: RoleGuardProps) {
  const { currentUser, validatePendingWithCode } = useAuth();
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  // 1. NOT LOGGED IN
  if (!currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-labal-deep/15 shadow-2xl max-w-md w-full text-center space-y-5 animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-labal-deep text-white flex items-center justify-center mx-auto border border-labal-lime/30 shadow-md">
            <Lock className="w-8 h-8 text-labal-lime" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-labal-lime/15 text-labal-deep text-xs font-black border border-labal-lime/30">
            Connexion Obligatoire
          </div>
          <h2 className="text-2xl font-black text-labal-deep tracking-tight">Accès Sécurisé Labal</h2>
          <p className="text-xs sm:text-sm text-labal-gray-dark font-medium leading-relaxed">
            Vous devez vous identifier avec votre compte administrateur ou enquêteur pour accéder aux services de la plateforme.
          </p>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3.5 bg-labal-deep text-white font-bold text-xs rounded-xl shadow-md hover:bg-labal-deep/90 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-labal-lime" />
              Se Connecter avec mon Compte
            </Link>
            <Link
              href="/register"
              className="w-full py-3 bg-labal-gray-light text-labal-deep font-bold text-xs rounded-xl border border-labal-deep/10 hover:bg-white transition-all text-center"
            >
              Créer un Compte Enquêteur
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACCOUNT PENDING APPROVAL (WITH SUPERVISOR CODE UNLOCK — NO SENSITIVE HINTS)
  if (requireApproved && currentUser.status === "PENDING") {
    const handleUnlock = async (e: React.FormEvent) => {
      e.preventDefault();
      setCodeError(null);
      setValidating(true);
      try {
        const res = await validatePendingWithCode(accessCode);
        if (!res.success) {
          setCodeError(res.message || "Code d'activation invalide.");
        }
      } finally {
        setValidating(false);
      }
    };

    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-amber-200 shadow-2xl max-w-lg w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300 animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            ⏳ Statut : En attente d&apos;activation
          </div>
          <h2 className="text-2xl font-black text-labal-deep tracking-tight">
            Activation du Compte Enquêteur
          </h2>
          <p className="text-xs sm:text-sm text-labal-gray-dark font-medium leading-relaxed">
            Bienvenue <strong className="text-labal-deep">{currentUser.full_name}</strong> ({currentUser.commune_affectation}). Si votre superviseur vous a transmis un <strong>code d&apos;activation</strong>, saisissez-le ci-dessous pour débloquer votre accès immédiatement :
          </p>

          <form onSubmit={handleUnlock} className="bg-labal-gray-light p-4 rounded-2xl border border-labal-deep/10 text-left space-y-3">
            <label className="flex items-center gap-1.5 text-xs font-black text-labal-deep">
              <KeyRound className="w-4 h-4 text-labal-lime" />
              Code d&apos;activation transmis par votre superviseur :
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                autoComplete="off"
                required
                placeholder="Saisissez votre code secret..."
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-labal-deep/20 bg-white text-xs font-bold tracking-wider text-labal-deep"
              />
              <button
                type="submit"
                disabled={validating}
                className="px-4 py-2.5 bg-labal-deep text-white font-bold text-xs rounded-xl hover:bg-labal-deep/90 transition-all inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-labal-lime" />
                {validating ? "Vérification..." : "Activer"}
              </button>
            </div>
            {codeError && (
              <p className="text-xs font-bold text-red-600">{codeError}</p>
            )}
          </form>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-labal-gray-light text-labal-deep font-bold text-xs rounded-xl border border-labal-deep/10 hover:bg-labal-gray-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Retourner à l&apos;Accueil
          </Link>
        </div>
      </div>
    );
  }

  // 3. STRICT 403 FORBIDDEN ERROR PAGE FOR ENQUÊTEURS ACCESSING DASHBOARD/ADMIN
  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-red-200 shadow-2xl max-w-lg w-full text-center space-y-5 animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-black border border-red-200 uppercase tracking-wide">
            🚫 ERREUR 403 — ACCÈS RÉSERVÉ AUX ADMINISTRATEURS
          </div>

          <h2 className="text-2xl font-black text-labal-deep tracking-tight">
            Espace Administrateur Uniquement
          </h2>

          <p className="text-xs sm:text-sm text-labal-gray-dark leading-relaxed">
            Vous êtes connecté en tant qu&apos;<strong className="text-labal-deep">Enquêteur Terrain ({currentUser.full_name})</strong>. Le Tableau de Bord stratégique global est réservé aux <strong className="text-labal-deep">Administrateurs</strong>, mais vous disposez de votre propre espace de suivi <strong className="text-labal-deep">« Mes Enquêtes »</strong>.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/mes-enquetes"
              className="px-6 py-3.5 bg-labal-deep text-white font-bold text-xs rounded-xl shadow-xs hover:bg-labal-deep/90 transition-all text-center"
            >
              Voir Mes Enquêtes Réalisées
            </Link>
            <Link
              href="/"
              className="px-6 py-3.5 bg-labal-gray-light text-labal-deep font-bold text-xs rounded-xl border border-labal-deep/10 hover:bg-white transition-all text-center"
            >
              Retour à l&apos;Accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
