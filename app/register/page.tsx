"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { COMMUNES } from "@/lib/constants";
import {
  UserCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Sparkles,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const { registerUser, autoApproveAll } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "+224 ",
    commune_affectation: "Kaloum",
    password: "",
    accessCode: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [wasAutoApproved, setWasAutoApproved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.full_name || !formData.email || !formData.phone || !formData.password) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerUser(
        {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          commune_affectation: formData.commune_affectation,
        },
        formData.password,
        formData.accessCode
      );

      if (!result.success) {
        setErrorMsg(result.error || "Impossible de créer le compte.");
        return;
      }

      setWasAutoApproved(Boolean(result.autoApproved));
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
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
            Plateforme Labal — Renseignez vos informations pour créer votre compte d&apos;enquêteur terrain.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submitted ? (
          wasAutoApproved ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-4 animate-slide-up">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Activation Confirmée
              </div>
              <h2 className="text-xl font-black text-emerald-950">
                Compte Enquêteur Activé Immédiatement !
              </h2>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                Bienvenue <strong className="text-labal-deep">{formData.full_name}</strong> ({formData.commune_affectation}). Votre code d&apos;activation a été vérifié et votre compte est immédiatement opérationnel.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/enquete/pme"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-labal-deep text-white font-bold text-xs rounded-xl shadow-xs hover:bg-labal-deep/90 transition-all text-center"
                >
                  <ClipboardList className="w-4 h-4 text-labal-lime" />
                  Démarrer une Enquête
                </Link>
                <Link
                  href="/mes-enquetes"
                  className="px-6 py-3 bg-white text-labal-deep font-bold text-xs rounded-xl border border-labal-deep/15 hover:bg-labal-gray-light transition-all text-center"
                >
                  Mon Espace Enquêteur
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-4 animate-slide-up">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto border border-amber-300">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-amber-950">Demande d&apos;Inscription Enregistrée</h2>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Votre demande pour <strong className="text-labal-deep">{formData.full_name}</strong> ({formData.commune_affectation}) a été enregistrée. Vous pourrez activer votre compte dès réception du code de votre superviseur ou après validation par un administrateur.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/enquete/pme"
                  className="px-6 py-3 bg-labal-deep text-white font-bold text-xs rounded-xl shadow-xs hover:bg-labal-deep/90 transition-all text-center"
                >
                  Saisir un code d&apos;activation
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 bg-white text-labal-deep font-bold text-xs rounded-xl border border-labal-deep/15 hover:bg-labal-gray-light transition-all text-center"
                >
                  Retour à l&apos;Accueil
                </Link>
              </div>
            </div>
          )
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-labal-deep">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nom et Prénom"
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
                  placeholder="votre.email@domaine.com"
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

            {/* Code d'Accès Terrain (Aucune information sensible affichée) */}
            <div className="p-4 rounded-2xl bg-labal-gray-light border border-labal-deep/10 space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-black text-labal-deep">
                  <KeyRound className="w-4 h-4 text-labal-lime" />
                  Code d&apos;activation superviseur (Optionnel)
                </label>
                <span className="px-2 py-0.5 rounded-full bg-labal-deep/10 text-labal-deep text-[0.65rem] font-bold">
                  Activation directe
                </span>
              </div>
              <input
                type="password"
                autoComplete="off"
                placeholder="Saisissez le code fourni par votre superviseur..."
                value={formData.accessCode}
                onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-labal-deep/20 bg-white text-sm font-bold tracking-wider text-labal-deep focus:ring-2 focus:ring-labal-lime/50 focus:border-labal-deep transition-all"
              />
              <p className="text-[0.7rem] text-labal-gray-dark leading-relaxed">
                {autoApproveAll
                  ? "L'activation automatique est ouverte pour cette campagne."
                  : "Si vous avez reçu un code d'activation de votre superviseur, renseignez-le ici pour activer immédiatement votre compte. Sinon, laissez ce champ vide."}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-labal-deep text-white font-black text-sm rounded-xl shadow-md hover:bg-labal-deep/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 touch-target mt-2"
            >
              {isSubmitting ? "Vérification en cours..." : "Créer mon compte"}
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
