"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Home as HomeIcon,
  Recycle,
  Building2,
  LayoutDashboard,
  ArrowRight,
  ClipboardList,
  ShieldCheck,
  Sparkles,
  MapPin,
  LogIn,
  UserPlus,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

const actorCards = [
  {
    href: "/enquete/pme",
    icon: Truck,
    title: "PME de Collecte",
    subtitle: "CONAAG & Collecteurs",
    description:
      "Diagnostic complet des entreprises de pré-collecte : équipements, modèle économique, rémunération et adhésion Labal.",
    sections: 16,
    badge: "Formulaire PME",
  },
  {
    href: "/enquete/menages",
    icon: HomeIcon,
    title: "Ménages & Usagers",
    subtitle: "Citoyens de Conakry",
    description:
      "Enquête auprès des usagers : mode d'évacuation, satisfaction PME, tri sélectif, consentement Mobile Money et usage smartphone.",
    sections: 16,
    badge: "Formulaire Citoyen",
  },
  {
    href: "/enquete/transit",
    icon: Recycle,
    title: "Zones de Transit (ZST/PA)",
    subtitle: "Tri & Transfert",
    description:
      "Évaluation des points d'apport volontaire : capacités, filières de tri, fréquence de saturation, tarification et sécurité.",
    sections: 16,
    badge: "Formulaire Transit",
  },
  {
    href: "/enquete/autorites",
    icon: Building2,
    title: "Autorités Locales",
    subtitle: "Mairies & Gouvernorat",
    description:
      "Gouvernance municipale : rôle des élus, fiscalité déchet, litiges de pré-collecte, priorités de numérisation et vision stratégique.",
    sections: 16,
    badge: "Formulaire Mairie",
  },
];

const quickStats = [
  { value: "4", label: "Formulaires Complets" },
  { value: "64", label: "Sections d'Enquête" },
  { value: "Conakry", label: "Communes Couvertes" },
  { value: "PDF & PPTX", label: "Exports Automatisés" },
];

export default function HomePage() {
  const { currentUser } = useAuth();

  const isLoggedIn = !!currentUser;
  const isUserApproved = currentUser?.status === "APPROVED";
  const isUserAdmin = currentUser?.role === "ADMIN";

  return (
    <div className="bg-gradient-to-b from-white via-labal-gray-light to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content Column */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-labal-lime/15 border border-labal-lime/40 text-labal-deep font-bold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-labal-lime" />
                <span>Plateforme Officielle Labal Guinée</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-labal-deep tracking-tight leading-tight">
                Gestion & Enquête{" "}
                <span className="bg-gradient-to-r from-labal-deep via-labal-deep/90 to-labal-lime bg-clip-text text-transparent block sm:inline">
                  Assainissement Urbain
                </span>
              </h1>

              <p className="text-base sm:text-lg text-labal-gray-dark max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Plateforme de collecte, de consolidation et d&apos;analyse des données terrain pour les{" "}
                <strong className="text-labal-deep font-bold">PME de collecte</strong>,{" "}
                <strong className="text-labal-deep font-bold">ménages</strong>,{" "}
                <strong className="text-labal-deep font-bold">zones de transit</strong> et{" "}
                <strong className="text-labal-deep font-bold">mairies</strong> de la ville de Conakry.
              </p>

              {/* Action Buttons conditionally rendered based on Auth & RBAC */}
              {!isLoggedIn ? (
                /* UNAUTHENTICATED VISITOR LANDING BUTTONS */
                <div className="pt-2 flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-labal-deep text-white font-black rounded-2xl hover:bg-labal-deep/90 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm border border-labal-lime/30 group"
                  >
                    <LogIn className="w-5 h-5 text-labal-lime group-hover:scale-110 transition-transform" />
                    Se Connecter à la Plateforme
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-labal-lime text-labal-deep font-black rounded-2xl hover:bg-labal-lime/90 transition-all shadow-xs text-sm"
                  >
                    <UserPlus className="w-5 h-5 text-labal-deep" />
                    Créer un Compte Enquêteur
                  </Link>
                </div>
              ) : (
                /* LOGGED IN USER BUTTONS */
                <div className="pt-2 flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
                  {isUserApproved && (
                    <Link
                      href="/enquete/pme"
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-gradient-to-r from-labal-deep to-labal-deep/95 text-white font-black rounded-2xl hover:from-labal-deep/95 hover:to-labal-deep shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm border border-labal-lime/30 group"
                    >
                      <ClipboardList className="w-5 h-5 text-labal-lime group-hover:rotate-6 transition-transform" />
                      Démarrer une enquête
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}

                  {/* Strict RBAC: Show Dashboard ONLY if ADMIN */}
                  {isUserAdmin && (
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-white text-labal-deep font-bold rounded-2xl border-2 border-labal-deep/15 hover:border-labal-deep hover:bg-labal-gray-light transition-all shadow-xs text-sm"
                    >
                      <LayoutDashboard className="w-5 h-5 text-labal-lime" />
                      Consulter le Dashboard
                    </Link>
                  )}
                </div>
              )}

              {/* Quick Specs Badges */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="glass-card rounded-xl p-3 text-center sm:text-left">
                    <div className="text-lg font-black text-labal-deep">{stat.value}</div>
                    <div className="text-[0.7rem] font-bold text-labal-gray-dark uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column Logo */}
            <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-labal-lime/30 to-labal-deep/20 blur-3xl" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 bg-white p-3">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src="/logo-labal.jpeg"
                      alt="Plateforme Labal — Assainissement Urbain Guinée"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      priority
                      sizes="(max-width: 1024px) 320px, 384px"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-labal-deep/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-labal-lime/20 text-labal-deep flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5 text-labal-deep" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-labal-deep">Conakry, Guinée</div>
                    <div className="text-[0.65rem] text-labal-gray-dark font-medium">5 Communes & 16 Sections</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION FOR UNAUTHENTICATED VISITORS: LOGIN PROMPT */}
      {!isLoggedIn && (
        <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 border-t border-labal-deep/5">
          <div className="max-w-3xl mx-auto bg-labal-gray-light p-8 sm:p-12 rounded-3xl border border-labal-deep/10 shadow-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-labal-deep text-white flex items-center justify-center mx-auto border border-labal-lime/30 shadow-md">
              <Lock className="w-8 h-8 text-labal-lime" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Accès Sécurisé Réservé
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-labal-deep tracking-tight">
              Espace Restreint aux Enquêteurs & Administrateurs
            </h2>
            <p className="text-xs sm:text-sm text-labal-gray-dark font-medium max-w-xl mx-auto leading-relaxed">
              Pour accéder aux formulaires de collecte sur le terrain ou au système d&apos;analyse, vous devez préalablement vous identifier avec votre compte utilisateur.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="px-8 py-3.5 bg-labal-deep text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-labal-deep/90 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-labal-lime" />
                Se Connecter
              </Link>
              <Link
                href="/register"
                className="px-8 py-3.5 bg-white text-labal-deep font-bold text-xs sm:text-sm rounded-xl border border-labal-deep/15 hover:bg-labal-gray-light transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-labal-deep" />
                Créer un Compte Enquêteur
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Forms Selection Grid - ONLY SHOWN TO LOGGED-IN APPROVED USERS */}
      {isLoggedIn && isUserApproved && (
        <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 border-t border-labal-deep/5 animate-slide-up">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-labal-gray-light text-labal-deep text-xs font-bold border border-labal-deep/10">
                <ClipboardList className="w-3.5 h-3.5 text-labal-lime" />
                Collecte Terrain
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-labal-deep tracking-tight">
                Sélectionnez le Formulaire à Remplir
              </h2>
              <p className="text-xs sm:text-sm text-labal-gray-dark font-medium">
                4 acteurs majeurs de la chaîne de valeur de l&apos;assainissement urbain à Conakry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {actorCards.map((actor) => {
                const Icon = actor.icon;
                return (
                  <Link
                    key={actor.href}
                    href={actor.href}
                    className="group bg-white rounded-3xl p-6 border border-labal-deep/10 hover:border-labal-deep/30 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-labal-gray-light text-labal-deep flex items-center justify-center group-hover:bg-labal-deep group-hover:text-white transition-colors">
                          <Icon className="w-6 h-6 text-labal-lime group-hover:text-labal-lime" />
                        </div>
                        <span className="text-[0.65rem] font-extrabold px-2.5 py-1 rounded-full bg-labal-lime/15 text-labal-deep border border-labal-lime/30">
                          {actor.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-labal-deep group-hover:text-labal-lime transition-colors">
                          {actor.title}
                        </h3>
                        <p className="text-[0.7rem] font-bold text-labal-gray-dark uppercase tracking-wider mt-0.5">
                          {actor.subtitle}
                        </p>
                      </div>

                      <p className="text-xs text-labal-gray-dark font-medium leading-relaxed">
                        {actor.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-labal-deep/5 flex items-center justify-between text-xs font-bold text-labal-deep mt-4">
                      <span>{actor.sections} Sections</span>
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform text-labal-lime">
                        Remplir <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
