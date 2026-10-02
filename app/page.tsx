import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Home as HomeIcon,
  Recycle,
  Building2,
  LayoutDashboard,
  ArrowRight,
  Wifi,
  WifiOff,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  TrendingUp,
} from "lucide-react";

const actorCards = [
  {
    href: "/enquete/pme",
    icon: Truck,
    title: "PME de Collecte",
    subtitle: "CONAAG & Collecteurs",
    description:
      "Diagnostic complet des entreprises de pré-collecte : équipements, modèle économique, rémunération et adhésion Lâbal.",
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
    title: "Zones de Transit & Tri",
    subtitle: "ZST & Points de regroupement",
    description:
      "Évaluation logistique des sites de transit : caissons, ponts bascules, saturation, transferts secondaires et sécurité EPI.",
    sections: 16,
    badge: "Formulaire Logistique",
  },
  {
    href: "/enquete/autorites",
    icon: Building2,
    title: "Autorités Locales",
    subtitle: "Mairies & Superviseurs",
    description:
      "Enquête institutionnelle : gouvernance communale, résorption des points noirs, flotte de transport et intégration du dashboard.",
    sections: 16,
    badge: "Formulaire Institutionnel",
  },
];

const features = [
  {
    icon: WifiOff,
    title: "Architecture Offline-First",
    description: "Saisie sans connexion internet avec sauvegarde locale et synchronisation automatique.",
  },
  {
    icon: BarChart3,
    title: "Analyses & Dataviz",
    description: "Tableau de bord dynamique avec filtres sectoriels, KPIs en temps réel et cartographie.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité & Exports",
    description: "Protection des données RLS, exports PDF imprimables et présentations PowerPoint (.pptx).",
  },
];

const quickStats = [
  { label: "Formulaires complets", value: "4" },
  { label: "Sections d'enquête", value: "64" },
  { label: "Communes couvertes", value: "Conakry" },
  { label: "Exports automatisés", value: "PDF & PPTX" },
];

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-labal-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-labal-deep/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Column Content */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-labal-lime/15 text-labal-deep text-xs font-black tracking-wide border border-labal-lime/30 shadow-xs">
                <Wifi className="w-3.5 h-3.5 text-labal-lime animate-pulse" />
                PLATEFORME OFFICIELLE LÂBAL GUINÉE
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-labal-deep tracking-tight leading-tight">
                Gestion &amp; Enquête{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-labal-lime via-labal-lime to-labal-deep">
                  Assainissement Urbain
                </span>
              </h1>

              <p className="text-base sm:text-lg text-labal-gray-dark max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Collectez, consolidez et analysez les données terrain des{" "}
                <strong className="text-labal-deep font-bold">PME de collecte</strong>,{" "}
                <strong className="text-labal-deep font-bold">ménages</strong>,{" "}
                <strong className="text-labal-deep font-bold">zones de transit</strong> et{" "}
                <strong className="text-labal-deep font-bold">mairies</strong> de la ville de Conakry.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
                <Link
                  href="/enquete/pme"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-gradient-to-r from-labal-deep to-labal-deep/95 text-white font-black rounded-2xl hover:from-labal-deep/95 hover:to-labal-deep shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm border border-labal-lime/30 group"
                >
                  <ClipboardList className="w-5 h-5 text-labal-lime group-hover:rotate-6 transition-transform" />
                  Démarrer une enquête
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-white text-labal-deep font-bold rounded-2xl border-2 border-labal-deep/15 hover:border-labal-deep hover:bg-labal-gray-light transition-all shadow-xs text-sm"
                >
                  <LayoutDashboard className="w-5 h-5 text-labal-lime" />
                  Consulter le Dashboard
                </Link>
              </div>

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

            {/* Right Column Logo & Visual Showcase */}
            <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-labal-lime/30 to-labal-deep/20 blur-3xl" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 bg-white p-3">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src="/logo-labal.jpeg"
                      alt="Plateforme Lâbal — Assainissement Urbain Guinée"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      priority
                      sizes="(max-width: 1024px) 320px, 384px"
                    />
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-labal-deep/10 flex items-center gap-3 animate-pulse-subtle">
                  <div className="p-2 bg-labal-lime/20 rounded-xl text-labal-deep">
                    <MapPin className="w-5 h-5 text-labal-deep" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-labal-deep">Conakry, Guinée</div>
                    <div className="text-[0.65rem] font-bold text-labal-gray-dark">5 Communes &amp; 16 Sections</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bar */}
      <section className="border-y border-labal-deep/10 bg-labal-gray-light/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-card rounded-2xl p-5 flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-labal-lime/20 to-labal-lime/5 flex items-center justify-center border border-labal-lime/20">
                    <Icon className="w-6 h-6 text-labal-deep" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-labal-deep">{f.title}</h3>
                    <p className="text-xs text-labal-gray-dark mt-1 leading-relaxed font-medium">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Actor Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-extrabold tracking-widest text-labal-lime uppercase bg-labal-lime/10 px-3.5 py-1.5 rounded-full border border-labal-lime/20">
            Formulaires Terrain
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-labal-deep tracking-tight mt-3">
            Sélectionnez votre profil d&apos;enquête
          </h2>
          <p className="text-labal-gray-dark mt-2.5 max-w-xl mx-auto text-sm sm:text-base font-medium">
            4 questionnaires exhaustifs de 16 sections avec enregistrement automatique et validation dynamique Zod.
          </p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-labal-lime to-labal-deep mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {actorCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="glass-card card-hover rounded-2xl p-6 sm:p-7 block group relative overflow-hidden"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-labal-lime/20 via-labal-lime/10 to-transparent flex items-center justify-center border border-labal-lime/30 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-labal-deep" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[0.65rem] font-bold text-labal-lime uppercase tracking-wider bg-labal-lime/10 px-2 py-0.5 rounded-md">
                          {card.badge}
                        </span>
                        <h3 className="text-xl font-extrabold text-labal-deep group-hover:text-labal-lime transition-colors mt-1">
                          {card.title}
                        </h3>
                      </div>
                      <div className="p-2 rounded-xl bg-labal-gray-light group-hover:bg-labal-lime group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5 text-labal-deep group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-labal-gray-dark mt-1">
                      {card.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-labal-gray-dark mt-3 leading-relaxed font-medium">
                      {card.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-labal-deep/5 flex items-center justify-between text-xs font-bold text-labal-deep">
                      <span className="flex items-center gap-1.5 text-labal-lime">
                        <CheckCircle2 className="w-4 h-4" />
                        {card.sections} sections guidées
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform text-labal-deep flex items-center gap-1">
                        Accéder <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Dashboard Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-labal-deep via-labal-deep to-labal-deep/95 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-labal-lime/20">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-labal-lime/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-labal-lime text-xs font-black tracking-wide border border-white/10">
              <Sparkles className="w-4 h-4 text-labal-lime" />
              PILOTAGE &amp; DÉCISION
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Tableau de Bord &amp; Générateur d&apos;Exports PDF / PPTX
            </h2>
            
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-medium">
              Consultez les 8 cartes KPI, filtrez la collecte par commune de Conakry, et téléchargez les présentations PowerPoint (.pptx) et rapports d&apos;analyse PDF générés automatiquement.
            </p>

            <div className="pt-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-labal-lime text-white font-black rounded-2xl hover:bg-labal-lime/90 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all text-sm border border-white/20"
              >
                <TrendingUp className="w-5 h-5" />
                Ouvrir le Tableau de Bord
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
