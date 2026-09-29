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
  Home,
  Building2,
  Recycle,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/enquete/pme", label: "PME Collecte", icon: Truck },
  { href: "/enquete/menages", label: "Ménages", icon: Home },
  { href: "/enquete/transit", label: "Zones Transit", icon: Recycle },
  { href: "/enquete/autorites", label: "Autorités", icon: Building2 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-labal-gray-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
              <Image
                src="/logo-labal.jpeg"
                alt="Lâbal"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-labal-deep tracking-tight">
                Lâbal
              </span>
              <span className="block text-[0.65rem] text-labal-gray-dark -mt-1 tracking-wide">
                Assainissement Urbain
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-labal-lime/10 text-labal-lime border border-labal-lime/20"
                      : "text-labal-deep hover:bg-labal-gray-light hover:text-labal-lime"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Survey Button (desktop) */}
          <div className="hidden lg:block">
            <Link
              href="/enquete/pme"
              className="inline-flex items-center gap-2 px-4 py-2 bg-labal-lime text-white font-semibold rounded-lg hover:bg-labal-lime/90 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
            >
              <ClipboardList className="w-4 h-4" />
              Nouvelle enquête
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-labal-deep hover:bg-labal-gray-light transition-colors"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-labal-gray-medium bg-white animate-fade-in-up">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-labal-lime/10 text-labal-lime"
                      : "text-labal-deep hover:bg-labal-gray-light"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
