"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { Lock, LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/");
      } else {
        setErrorMsg(res.message || "Adresse email ou mot de passe incorrect.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-labal-gray-light min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-labal-deep/10 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-labal-deep text-white flex items-center justify-center mx-auto border border-labal-lime/30 shadow-md">
            <Lock className="w-7 h-7 text-labal-lime" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-labal-deep tracking-tight">
            Connexion
          </h1>
          <p className="text-xs sm:text-sm text-labal-gray-dark font-medium max-w-xs mx-auto">
            Accédez à votre espace utilisateur de la plateforme Labal.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {/* Standard Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-labal-deep">Adresse Email</label>
            <input
              type="email"
              required
              placeholder="votre.email@labal-guinee.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-labal-deep/20 text-sm focus:ring-2 focus:ring-labal-lime/50 focus:border-labal-deep transition-all touch-target"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-labal-deep">Mot de passe</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-labal-deep/20 text-sm focus:ring-2 focus:ring-labal-lime/50 focus:border-labal-deep transition-all touch-target"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-labal-deep text-white font-black text-sm rounded-xl shadow-md hover:bg-labal-deep/90 transition-all flex items-center justify-center gap-2 touch-target"
          >
            <LogIn className="w-4 h-4 text-labal-lime" />
            Se Connecter
          </button>
        </form>

        <div className="pt-4 border-t border-labal-deep/10 flex items-center justify-between text-xs font-semibold">
          <Link href="/" className="inline-flex items-center gap-1.5 text-labal-gray-dark hover:text-labal-deep">
            <ArrowLeft className="w-3.5 h-3.5" />
            Accueil
          </Link>
          <Link href="/register" className="text-labal-deep font-bold hover:underline">
            Pas encore de compte ? S&apos;inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}
