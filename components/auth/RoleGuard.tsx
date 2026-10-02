"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { UserRole } from "@/lib/auth/types";
import Link from "next/link";
import { ShieldAlert, Clock, ArrowLeft, Lock, LogIn } from "lucide-react";

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
  const { currentUser } = useAuth();

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

  // 2. ACCOUNT PENDING APPROVAL
  if (requireApproved && currentUser.status === "PENDING") {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-amber-200 shadow-2xl max-w-lg w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300 animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            ⏳ Statut : En attente de validation
          </div>
          <h2 className="text-2xl font-black text-labal-deep tracking-tight">
            Validation Administrateur Requise
          </h2>
          <p className="text-xs sm:text-sm text-labal-gray-dark font-medium leading-relaxed">
            Bienvenue <strong className="text-labal-deep">{currentUser.full_name}</strong>. Votre demande d&apos;inscription pour la zone <strong className="text-labal-deep">{currentUser.commune_affectation}</strong> est en cours d&apos;examen.
          </p>
          <div className="bg-amber-50/70 p-4 rounded-2xl text-left border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-bold">Politique de Sécurité Zero-Trust :</p>
            <p>Seuls les enquêteurs approuvés par l&apos;administration peuvent enregistrer des données sur le terrain.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-labal-deep text-white font-bold text-xs rounded-xl shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-labal-lime" />
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
            🚫 ERREUR 403 — ACCÈS REFUSÉ
          </div>

          <h2 className="text-2xl font-black text-labal-deep tracking-tight">
            Droits d&apos;accès Insuffisants
          </h2>

          <p className="text-xs sm:text-sm text-labal-gray-dark leading-relaxed">
            Vous êtes connecté en tant qu&apos;<strong className="text-labal-deep">Enquêteur Terrain ({currentUser.full_name})</strong>. En accord avec la politique de confidentialité, le Tableau de Bord décisionnel et la gestion des utilisateurs sont strictly réservés aux <strong className="text-labal-deep">Administrateurs</strong>.
          </p>

          <div className="p-4 bg-labal-gray-light rounded-2xl text-xs text-labal-deep border border-labal-deep/10 font-bold">
            Votre profil a accès uniquement à la collecte des enquêtes terrain (PME, Ménages, Transit, Mairies).
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/enquete/pme"
              className="px-6 py-3.5 bg-labal-deep text-white font-bold text-xs rounded-xl shadow-xs hover:bg-labal-deep/90 transition-all text-center"
            >
              Accéder aux Formulaires d&apos;Enquête
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
