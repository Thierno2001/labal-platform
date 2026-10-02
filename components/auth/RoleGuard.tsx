"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { UserRole } from "@/lib/auth/types";
import Link from "next/link";
import { ShieldAlert, UserCheck, Clock, ArrowLeft, Lock } from "lucide-react";

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

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-labal-deep/10 shadow-lg max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-labal-deep">Connexion Requise</h2>
          <p className="text-xs text-labal-gray-dark font-medium">
            Veuillez vous connecter avec votre compte pour accéder à cet espace de la plateforme.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-3 bg-labal-deep text-white font-bold text-xs rounded-xl shadow-sm hover:bg-labal-deep/90 transition-all"
            >
              Se Connecter
            </Link>
            <Link
              href="/register"
              className="w-full py-3 bg-labal-gray-light text-labal-deep font-bold text-xs rounded-xl border border-labal-deep/10 hover:bg-white transition-all"
            >
              Créer un Compte Enquêteur
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check Approval Status
  if (requireApproved && currentUser.status === "PENDING") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-xl max-w-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border border-amber-300 animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
            Compte en attente de validation
          </div>
          <h2 className="text-2xl font-black text-labal-deep tracking-tight">
            Validation Administrateur Requise
          </h2>
          <p className="text-xs sm:text-sm text-labal-gray-dark font-medium leading-relaxed">
            Bienvenue <strong className="text-labal-deep">{currentUser.full_name}</strong> ! Votre compte d&apos;enquêteur pour la zone <strong className="text-labal-deep">{currentUser.commune_affectation}</strong> a été créé.
          </p>
          <div className="bg-labal-gray-light/60 p-4 rounded-2xl text-left border border-labal-deep/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-labal-deep">
              <UserCheck className="w-4 h-4 text-labal-lime" />
              Procédure de validation de sécurité :
            </div>
            <ul className="text-[0.75rem] text-labal-gray-dark space-y-1 list-disc pl-5">
              <li>Un administrateur Labal doit approuver votre identité.</li>
              <li>Aucune donnée ne peut être saisie tant que le compte n&apos;est pas validé.</li>
              <li>Consultez l&apos;administration pour débloquer votre accès.</li>
            </ul>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-labal-deep text-white font-bold text-xs rounded-xl shadow-xs hover:bg-labal-deep/90 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-labal-lime" />
              Retourner à l&apos;Accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (requireApproved && currentUser.status === "REJECTED") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-red-200 shadow-xl max-w-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto border border-red-300">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-red-700">Demande Inscription Refusée</h2>
          <p className="text-xs text-labal-gray-dark">
            Votre demande d&apos;inscription a été rejetée par l&apos;administration. Contactez le responsable d&apos;enquête.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-labal-deep text-white font-bold text-xs rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 text-labal-lime" /> Retour à l&apos;Accueil
          </Link>
        </div>
      </div>
    );
  }

  // Check Role Allowed
  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-labal-deep/10 shadow-xl max-w-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-labal-lime/20 text-labal-deep flex items-center justify-center mx-auto border border-labal-lime/40">
            <ShieldAlert className="w-8 h-8 text-labal-deep" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
            Accès Réservé aux Administrateurs
          </div>
          <h2 className="text-2xl font-black text-labal-deep">Permissions Insuffisantes</h2>
          <p className="text-xs sm:text-sm text-labal-gray-dark leading-relaxed">
            Vous êtes connecté avec un profil <strong className="text-labal-deep">Enquêteur Terrain</strong>. Cette section (Tableau de Bord & Exports) est exclusivement réservée à l&apos;Administrateur et aux Superviseurs.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/enquete/pme"
              className="w-full sm:w-auto px-5 py-3 bg-labal-deep text-white font-bold text-xs rounded-xl shadow-xs hover:bg-labal-deep/90 transition-all"
            >
              Accéder à la Collecte PME
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-3 bg-labal-gray-light text-labal-deep font-bold text-xs rounded-xl border border-labal-deep/10 hover:bg-white transition-all"
            >
              Page d&apos;Accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
