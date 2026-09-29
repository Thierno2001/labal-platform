import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Home,
  Recycle,
  Building2,
  LayoutDashboard,
  ArrowRight,
  Wifi,
  WifiOff,
  ClipboardList,
  BarChart3,
  Shield,
} from "lucide-react";

const actorCards = [
  {
    href: "/enquete/pme",
    icon: Truck,
    title: "PME de Collecte",
    subtitle: "CONAAG & Collecteurs",
    description:
      "Formulaire d'enquête pour les entreprises de pré-collecte et collecte de déchets ménagers, leurs collecteurs et leur organisation opérationnelle.",
    sections: 16,
    color: "bg-labal-lime/10 border-labal-lime/30",
    iconColor: "text-labal-lime",
  },
  {
    href: "/enquete/menages",
    icon: Home,
    title: "Ménages & Citoyens",
    subtitle: "Usagers du service",
    description:
      "Enquête auprès des ménages sur leur expérience de collecte, tri à domicile, pratiques de paiement et besoins numériques.",
    sections: 16,
    color: "bg-labal-deep/5 border-labal-deep/20",
    iconColor: "text-labal-deep",
  },
  {
    href: "/enquete/transit",
    icon: Recycle,
    title: "Zones de Transit & Tri",
    subtitle: "ZST / Points d'apport",
    description:
      "Diagnostic des zones de transit : équipements, flux entrants, saturation, transferts secondaires et coordination mairie.",
    sections: 16,
    color: "bg-labal-lime/10 border-labal-lime/30",
    iconColor: "text-labal-lime",
  },
  {
    href: "/enquete/autorites",
    icon: Building2,
    title: "Autorités Locales",
    subtitle: "Mairies & Superviseurs",
    description:
      "Enquête institutionnelle : cadre légal, équipements communaux, finances, signalements citoyens et attentes numériques.",
    sections: 16,
    color: "bg-labal-deep/5 border-labal-deep/20",
    iconColor: "text-labal-deep",
  },
];

const features = [
  {
    icon: WifiOff,
    title: "Mode hors-ligne",
    description: "Saisie sans connexion, synchronisation automatique au retour du réseau.",
  },
  {
    icon: BarChart3,
    title: "Analyses en temps réel",
    description: "Tableau de bord avec KPIs, graphiques et filtres par commune.",
  },
  {
    icon: Shield,
    title: "Données sécurisées",
    description: "Chiffrement bout en bout et sauvegarde automatique de chaque brouillon.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-labal-deep/[0.03] via-transparent to-labal-lime/[0.05]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-labal-lime/10 text-labal-lime text-xs font-semibold mb-6">
                <Wifi className="w-3 h-3" />
                Plateforme PWA Offline-First
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-labal-deep leading-tight">
                Enquête{" "}
                <span className="text-labal-lime">Assainissement</span>
                <br />
                Urbain Conakry
              </h1>
              <p className="mt-5 text-lg text-labal-gray-dark max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Collectez, analysez et visualisez les données terrain des{" "}
                <strong className="text-labal-deep">PME de collecte</strong>,{" "}
                <strong className="text-labal-deep">ménages</strong>,{" "}
                <strong className="text-labal-deep">zones de transit</strong> et{" "}
                <strong className="text-labal-deep">autorités communales</strong>{" "}
                de Conakry.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/enquete/pme"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-labal-lime text-white font-bold rounded-xl hover:bg-labal-lime/90 transition-all shadow-lg hover:shadow-xl text-sm"
                >
                  <ClipboardList className="w-5 h-5" />
                  Démarrer une enquête
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-labal-deep text-labal-deep font-bold rounded-xl hover:bg-labal-deep hover:text-white transition-all text-sm"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Tableau de bord
                </Link>
              </div>
            </div>

            {/* Right — Logo */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-labal-lime/20 to-labal-deep/10 blur-2xl" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-labal-gray-medium">
                  <Image
                    src="/logo-labal.jpeg"
                    alt="Lâbal — Assainissement Urbain Guinée"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-labal-gray-medium bg-labal-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-labal-lime/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-labal-lime" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-labal-deep">{f.title}</h3>
                    <p className="text-xs text-labal-gray-dark mt-0.5">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Actor Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-labal-deep">
            Choisissez votre profil d&apos;enquête
          </h2>
          <p className="text-labal-gray-dark mt-2 max-w-lg mx-auto">
            Quatre questionnaires exhaustifs de 16 sections pour couvrir chaque acteur de la chaîne de gestion des déchets.
          </p>
          <div className="mt-3 h-1 w-20 bg-labal-lime mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {actorCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className={`group block p-6 rounded-2xl border-2 ${card.color} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center ${card.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-labal-deep group-hover:text-labal-lime transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-xs font-medium text-labal-gray-dark">{card.subtitle}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-labal-gray-dark group-hover:text-labal-lime group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-labal-gray-dark mt-2 leading-relaxed">
                      {card.description}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-labal-lime">
                      <ClipboardList className="w-3.5 h-3.5" />
                      {card.sections} sections détaillées
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Dashboard CTA */}
      <section className="bg-labal-deep">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <LayoutDashboard className="w-10 h-10 text-labal-lime mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Tableau de bord analytique
          </h2>
          <p className="text-white/70 mt-3 max-w-lg mx-auto">
            Visualisez les KPIs en temps réel, filtrez par commune, et exportez vos rapports PDF et présentations PowerPoint en un clic.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-labal-lime text-white font-bold rounded-xl hover:bg-labal-lime/90 transition-all shadow-lg text-sm"
          >
            <BarChart3 className="w-5 h-5" />
            Accéder au Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
