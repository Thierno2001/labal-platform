"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Menu,
  X,
  Truck,
  Home as HomeIcon,
  Building2,
  Recycle,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Accueil", icon: HomeIcon },
  { href: "/enquete/pme", label: "PME Collecte", icon: Truck },
  { href: "/enquete/menages", label: "Ménages", icon: HomeIcon },
  { href: "/enquete/transit", label: "Zones Transit", icon: Recycle },
  { href: "/enquete/autorites", label: "Autorités", icon: Building2 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-labal-deep/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-sm border border-labal-deep/10 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
              <Image
                src="/logo-labal.jpeg"
                alt="Lâbal"
                fill
                className="object-cover"
                priority
                sizes="44px"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-labal-deep tracking-tight">
                  Lâbal
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-bold bg-labal-lime/15 text-labal-deep border border-labal-lime/30">
                  Guinée
                </span>
              </div>
              <span className="block text-[0.7rem] font-semibold text-labal-gray-dark -mt-0.5 tracking-wide">
                Assainissement Urbain Conakry
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 bg-labal-gray-light/80 rounded-xl border border-labal-deep/5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-labal-deep shadow-sm border border-labal-deep/10 font-bold"
                      : "text-labal-gray-dark hover:text-labal-deep hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-labal-lime" : "text-labal-gray-dark"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Survey Button (desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/enquete/pme"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-labal-deep to-labal-deep/90 text-white font-bold rounded-xl hover:from-labal-deep/95 hover:to-labal-deep shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-xs sm:text-sm border border-labal-lime/30"
            >
              <ClipboardList className="w-4 h-4 text-labal-lime" />
              Lancer une enquête
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-labal-deep hover:bg-labal-gray-light border border-labal-deep/10 transition-colors touch-target flex items-center justify-center"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-b border-labal-deep/10 px-4 pt-3 pb-6 space-y-2 animate-slide-up">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all touch-target ${
                  isActive
                    ? "bg-labal-lime/15 text-labal-deep border border-labal-lime/30 font-bold"
                    : "text-labal-deep hover:bg-labal-gray-light"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-labal-lime" : "text-labal-gray-dark"}`} />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/enquete/pme"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-labal-deep text-white font-bold rounded-xl text-sm shadow-md"
            >
              <Sparkles className="w-4 h-4 text-labal-lime" />
              Lancer une nouvelle enquête
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
