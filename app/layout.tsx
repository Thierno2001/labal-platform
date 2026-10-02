import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { OfflineBanner } from "@/components/layout/OfflineBanner";

export const metadata: Metadata = {
  title: "Labal — Plateforme d'Enquête Assainissement Urbain",
  description:
    "Plateforme de gestion et d'enquête sur les déchets ménagers pour les acteurs du secteur de l'assainissement en Guinée (Conakry). Collecte de données PME, ménages, zones de transit et autorités locales.",
  keywords: [
    "Labal",
    "assainissement",
    "Guinée",
    "Conakry",
    "déchets",
    "enquête",
    "PME collecte",
    "CONAAG",
  ],
  authors: [{ name: "Labal" }],
  openGraph: {
    title: "Labal — Enquête Assainissement Urbain Conakry",
    description:
      "Plateforme d'enquête et de gestion des déchets ménagers en Guinée.",
    type: "website",
    locale: "fr_GN",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#064420",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-labal-deep">
        <OfflineBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-labal-gray-medium py-6 px-4 text-center text-sm text-labal-gray-dark">
          <p>
            © {new Date().getFullYear()} Labal — Assainissement Urbain Guinée.
            Tous droits réservés.
          </p>
        </footer>
      </body>
    </html>
  );
}
