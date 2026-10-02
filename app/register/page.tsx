"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { COMMUNES } from "@/lib/constants";
import { UserCheck, Clock, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
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
            Créer un Compte Enquêteur
          </h1>
          <p className="text-xs sm:text-sm text-labal-gray-dark font-medium max-w-md mx-auto">
            Plateforme Labal — Renseignez vos informations pour demander la création de votre compte d&apos;enquêteur terrain.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-4 animate-slide-up">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-emerald-950">Demande d&apos;Inscription Soumise !</h2>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              Votre demande d&apos;inscription pour <strong className="text-labal-deep">{formData.full_name}</strong> ({formData.commune_affectation}) a été enregistrée avec succès. Un responsable examinera et débloquera votre compte sous peu.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="px-6 py-3 bg-labal-deep text-white font-bold text-xs rounded-xl shadow-xs hover:bg-labal-deep/90 transition-all text-center"
              >
                Se Connecter
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-white text-labal-deep font-bold text-xs rounded-xl border border-labal-deep/15 hover:bg-labal-gray-light transition-all text-center"
              >
                Retour à l&apos;Accueil
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-labal-deep">
                Nom complet <span className="text-red-500">*</span>
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
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-labal-deep/20 text-sm focus:ring-2 focus:ring-labal-lime/50 focus:border-labal-deep transition-all touch-target"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-labal-deep text-white font-black text-sm rounded-xl shadow-md hover:bg-labal-deep/90 transition-all flex items-center justify-center gap-2 touch-target mt-2"
            >
              Créer mon compte
              <ArrowRight className="w-4 h-4 text-labal-lime" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-labal-deep/10 flex items-center justify-between text-xs font-semibold">
          <Link href="/" className="inline-flex items-center gap-1.5 text-labal-gray-dark hover:text-labal-deep">
            <ArrowLeft className="w-3.5 h-3.5" />
            Accueil
          </Link>
          <Link href="/login" className="text-labal-deep font-bold hover:underline">
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
