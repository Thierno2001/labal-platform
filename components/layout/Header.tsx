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
  ShieldCheck,
  ChevronDown,
  LogOut,
  UserPlus,
  LogIn,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { currentUser, logout } = useAuth();

  const isUserAdmin = currentUser?.role === "ADMIN";

  // Navigation Items according to strict RBAC
  const navItems = [
    { href: "/", label: "Accueil", icon: HomeIcon, show: true },
    { href: "/enquete/pme", label: "PME Collecte", icon: Truck, show: true },
    { href: "/enquete/menages", label: "Ménages", icon: HomeIcon, show: true },
    { href: "/enquete/transit", label: "Zones Transit", icon: Recycle, show: true },
    { href: "/enquete/autorites", label: "Autorités", icon: Building2, show: true },
    // Strict RBAC: Show Dashboard ONLY for ADMIN
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: isUserAdmin },
    // Strict RBAC: Show Administration ONLY for ADMIN
    { href: "/admin/users", label: "Administration", icon: ShieldCheck, show: isUserAdmin },
  ];

  const visibleNavItems = navItems.filter((item) => item.show);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-labal-deep/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-sm border border-labal-deep/10 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
              <Image
                src="/logo-labal.jpeg"
                alt="Labal"
                fill
                className="object-cover"
                priority
                sizes="44px"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-labal-deep tracking-tight">
                  Labal
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
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
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

          {/* Auth & Profile Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              /* User Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-labal-deep/15 shadow-xs hover:border-labal-deep/30 transition-all text-xs font-bold text-labal-deep"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-labal-lime animate-pulse" />
                  <span className="max-w-[140px] truncate">{currentUser.full_name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[0.65rem] font-black ${
                      currentUser.role === "ADMIN"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : currentUser.status === "PENDING"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-labal-lime/20 text-labal-deep"
                    }`}
                  >
                    {currentUser.role === "ADMIN"
                      ? "👑 Admin"
                      : currentUser.status === "PENDING"
                      ? "⏳ En attente"
                      : "👷 Enquêteur"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-labal-gray-dark" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-labal-deep/15 shadow-xl p-3 z-50 animate-slide-up space-y-2">
                    <div className="px-3 py-2.5 bg-labal-gray-light/80 rounded-xl border border-labal-deep/5">
                      <p className="text-[0.65rem] font-bold text-labal-gray-dark uppercase tracking-wider">
                        Compte connecté :
                      </p>
                      <p className="text-xs font-black text-labal-deep mt-0.5">{currentUser.full_name}</p>
                      <p className="text-[0.7rem] text-labal-gray-dark truncate">{currentUser.email}</p>
                      <p className="text-[0.65rem] font-semibold text-labal-lime mt-1">
                        Affectation : {currentUser.commune_affectation}
                      </p>
                    </div>

                    <div className="pt-1 flex flex-col gap-1">
                      {isUserAdmin && (
                        <Link
                          href="/admin/users"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                          Administration des Comptes
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Se Déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Logged-out buttons */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-labal-deep font-bold rounded-xl border border-labal-deep/15 hover:bg-labal-gray-light text-xs transition-all touch-target"
                >
                  <LogIn className="w-3.5 h-3.5 text-labal-deep" />
                  Se Connecter
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-labal-lime text-labal-deep font-black rounded-xl hover:bg-labal-lime/90 text-xs transition-all touch-target shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  S&apos;inscrire (Enquêteur)
                </Link>
              </div>
            )}

            <Link
              href="/enquete/pme"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-labal-deep to-labal-deep/90 text-white font-bold rounded-xl hover:from-labal-deep/95 hover:to-labal-deep shadow-xs text-xs transition-all duration-200 border border-labal-lime/30"
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
          {/* User Status Bar Mobile */}
          <div className="p-3 bg-labal-gray-light rounded-xl border border-labal-deep/10 mb-2 flex items-center justify-between">
            {currentUser ? (
              <div>
                <p className="text-xs font-bold text-labal-deep">{currentUser.full_name}</p>
                <p className="text-[0.65rem] text-labal-gray-dark">{currentUser.role === "ADMIN" ? "👑 Administrateur" : "👷 Enquêteur Terrain"}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold text-labal-deep">Non connecté</p>
                <p className="text-[0.65rem] text-labal-gray-dark">Connectez-vous pour accéder à vos enquêtes</p>
              </div>
            )}
            {currentUser ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[0.7rem] font-bold"
              >
                Déconnexion
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1 bg-labal-deep text-white rounded-lg text-[0.7rem] font-bold"
              >
                Se Connecter
              </Link>
            )}
          </div>

          {visibleNavItems.map((item) => {
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
              <ClipboardList className="w-4 h-4 text-labal-lime" />
              Lancer une nouvelle enquête
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
