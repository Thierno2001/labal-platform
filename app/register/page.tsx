"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { COMMUNES } from "@/lib/constants";
import { UserCheck, Clock, ShieldCheck, ArrowRight, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "+224 ",
    commune_affectation: "Kaloum",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.phone) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    registerUser({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      commune_affectation: formData.commune_affectation,
    });

    setSubmitted(true);
  };

  return (
    <div className="bg-labal-gray-light min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-3xl border border-labal-deep/10 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-labal-lime/15 text-labal-deep flex items-center justify-center mx-auto border border-labal-lime/30">
            <UserCheck className="w-7 h-7 text-labal-deep" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-labal-deep tracking-tight">
            Inscription Enquêteur Terrain
          </h1>
          <p className="text-xs sm:text-sm text-labal-gray-dark font-medium max-w-md mx-auto">
            Plateforme Labal — Créez votre compte pour enregistrer des enquêtes d&apos;assainissement urbain à Conakry.
          </p>
        </div>

        {submitted ? (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-4 animate-slide-up">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-300">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-amber-900">Demande Enregistrée !</h2>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Votre compte pour <strong className="text-labal-deep">{formData.full_name}</strong> dans la zone <strong className="text-labal-deep">{formData.commune_affectation}</strong> a été créé avec le statut <span className="inline-block px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md font-bold">EN ATTENTE DE VALIDATION</span>.
            </p>

            <div className="bg-white p-4 rounded-xl text-left border border-amber-200 text-xs text-labal-gray-dark space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-labal-deep">
                <CheckCircle2 className="w-4 h-4 text-labal-lime" />
                Prochaine étape :
              </div>
              <p>Un des 3 Administrateurs Labal examinera et validera votre compte d&apos;enquêteur dans le portail <strong className="text-labal-deep">/admin/users</strong>.</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/enquete/pme"
                className="px-5 py-3 bg-labal-deep text-white font-bold text-xs rounded-xl hover:bg-labal-deep/90 transition-all text-center"
              >
                Accéder aux formulaires
              </Link>
              <Link
                href="/login"
                className="px-5 py-3 bg-labal-gray-light text-labal-deep font-bold text-xs rounded-xl border border-labal-deep/10 hover:bg-white transition-all text-center"
              >
                Changer de Compte / Démo
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-labal-deep">
                Nom complet de l&apos;enquêteur <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Amara Diallo"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-labal-deep/20 text-sm focus:ring-2 focus:ring-labal-lime/50 focus:border-labal-deep transition-all touch-target"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-labal-deep">
                  Adresse Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="exemple@labal-guinee.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-labal-deep/20 text-sm focus:ring-2 focus:ring-labal-lime/50 focus:border-labal-deep transition-all touch-target"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-labal-deep">
                  Téléphone (+224) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="+224 620 00 00 00"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-labal-deep/20 text-sm focus:ring-2 focus:ring-labal-lime/50 focus:border-labal-deep transition-all touch-target"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-labal-deep">
                Commune d&apos;affectation principale <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.commune_affectation}
                onChange={(e) => setFormData({ ...formData, commune_affectation: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-labal-deep/20 text-sm focus:ring-2 focus:ring-labal-lime/50 focus:border-labal-deep transition-all touch-target bg-white"
              >
                {COMMUNES.map((c) => (
                  <option key={c} value={c}>
                    Commune de {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-labal-deep">
                Mot de passe sécurisé <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-labal-deep/20 text-sm focus:ring-2 focus:ring-labal-lime/50 focus:border-labal-deep transition-all touch-target"
              />
              <p className="text-[0.68rem] text-labal-gray-dark font-medium">
                Standard Sécurité OWASP : minimum 8 caractères.
              </p>
            </div>

            <div className="bg-labal-gray-light p-4 rounded-xl border border-labal-deep/10 text-xs text-labal-gray-dark space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-labal-deep">
                <ShieldCheck className="w-4 h-4 text-labal-lime" />
                Contrôle de Sécurité RBAC
              </div>
              <p className="text-[0.7rem] leading-relaxed">
                Après soumission, votre compte sera placé en attente et devra être validé par un des 3 administrateurs système avant de pouvoir enregistrer des enquêtes.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-labal-deep text-white font-black text-sm rounded-xl shadow-md hover:bg-labal-deep/90 transition-all flex items-center justify-center gap-2 touch-target"
            >
              Soumettre ma demande d&apos;inscription
              <ArrowRight className="w-4 h-4 text-labal-lime" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-labal-deep/10 flex items-center justify-between text-xs font-semibold">
          <Link href="/" className="inline-flex items-center gap-1.5 text-labal-gray-dark hover:text-labal-deep">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour accueil
          </Link>
          <Link href="/login" className="text-labal-deep hover:underline">
            Déjà inscrit ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
