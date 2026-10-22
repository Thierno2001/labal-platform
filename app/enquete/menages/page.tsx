"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, PlusCircle, Home } from "lucide-react";
import { FormStepper } from "@/components/forms/FormStepper";
import { MENAGES_SECTION_LABELS } from "@/lib/constants";
import { menagesSchema, MenagesFormData } from "@/lib/schemas/menages.schema";
import {
  saveDraft,
  getDraft,
  deleteDraft,
  addPendingSubmission,
  recordLocalSubmission,
} from "@/lib/offline/indexeddb";
import { useAuth } from "@/lib/auth/AuthContext";

import { Section1 } from "@/components/forms/menages/Section1";
import { Section2 } from "@/components/forms/menages/Section2";
import { Section3 } from "@/components/forms/menages/Section3";
import { Section4 } from "@/components/forms/menages/Section4";
import { Section5 } from "@/components/forms/menages/Section5";
import { Section6 } from "@/components/forms/menages/Section6";
import { Section7 } from "@/components/forms/menages/Section7";
import { Section8 } from "@/components/forms/menages/Section8";
import { Section9 } from "@/components/forms/menages/Section9";
import { Section10 } from "@/components/forms/menages/Section10";
import { Section11 } from "@/components/forms/menages/Section11";
import { Section12 } from "@/components/forms/menages/Section12";
import { Section13 } from "@/components/forms/menages/Section13";
import { Section14 } from "@/components/forms/menages/Section14";
import { Section15 } from "@/components/forms/menages/Section15";
import { Section16 } from "@/components/forms/menages/Section16";

import { RoleGuard } from "@/components/auth/RoleGuard";

const FORM_TYPE = "menages";
const TOTAL_STEPS = 16;

const EMPTY_MENAGES_DEFAULTS: MenagesFormData = {
  email: "",
  nom_repondant: "",
  nb_personnes_foyer: undefined,
  type_habitation: "",
  commune: "",
  quartier: "",
  reperes_visuels: "",
  accessibilite: "",
  mode_evacuation: "",
  motif_non_abonne: "",
  nom_pme_connue: "",
  libre_choix_collecteur: "",
  a_change_collecteur: "",
  motifs_insatisfaction: [],
  nb_sacs_semaine: undefined,
  typologie_dechets: [],
  alerte_ramassage_actuelle: "",
  bacs_debordants_7_jours: "",
  interet_bouton_commande: "",
  respect_horaire: "",
  notification_approche: "",
  suivi_carte_temps_reel: "",
  preuve_passage: "",
  procedure_absence: "",
  tri_actuel: "",
  facteurs_stimulants: [],
  connaissance_risques: [],
  pret_modules_video: "",
  montant_mensuel_gnf: undefined,
  perception_qualite_prix: "",
  mode_paiement: "",
  recu_papier: "",
  conflit_paiement: "",
  nature_differend: "",
  resolution_litige: "",
  possession_smartphone: "",
  frequence_mobile_money: "",
  applications_favorites: "",
  pret_installer_labal: "",
  telephone_groupe_test: "",
  suggestions_amelioration: "",
};

export default function MenagesSurveyPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "ENQUETEUR"]} requireApproved={true}>
      <MenagesSurveyContent />
    </RoleGuard>
  );
}

function MenagesSurveyContent() {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const isResettingRef = useRef(false);

  const methods = useForm<MenagesFormData>({
    resolver: zodResolver(menagesSchema) as any,
    mode: "onChange",
    defaultValues: EMPTY_MENAGES_DEFAULTS,
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = methods;

  // Load draft on mount
  useEffect(() => {
    const load = async () => {
      const draft = await getDraft(FORM_TYPE);
      if (draft && draft.data && Object.keys(draft.data).length > 0) {
        isResettingRef.current = true;
        reset({ ...EMPTY_MENAGES_DEFAULTS, ...(draft.data as Partial<MenagesFormData>) });
        if (typeof draft.currentStep === "number" && draft.currentStep >= 0 && draft.currentStep < TOTAL_STEPS) {
          setCurrentStep(draft.currentStep);
        }
        setTimeout(() => {
          isResettingRef.current = false;
        }, 50);
      }
      setIsReady(true);
    };
    load();
  }, [reset]);

  // Auto-save draft
  useEffect(() => {
    if (!isReady) return;
    const subscription = watch((value) => {
      if (isResettingRef.current || submitSuccess) return;
      saveDraft(FORM_TYPE, value as Record<string, unknown>, currentStep);
    });
    return () => subscription.unsubscribe();
  }, [watch, isReady, currentStep, submitSuccess]);

  const clearFormCompletely = async () => {
    isResettingRef.current = true;
    await deleteDraft(FORM_TYPE);
    reset(EMPTY_MENAGES_DEFAULTS, { keepValues: false, keepDefaultValues: false });
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setFormKey((prev) => prev + 1);
    setTimeout(() => {
      isResettingRef.current = false;
    }, 100);
  };

  const handleManualReset = async () => {
    if (window.confirm("Voulez-vous vraiment vider tous les champs de ce formulaire et recommencer à zéro ?")) {
      await clearFormCompletely();
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const onInvalid = () => {
    setCurrentStep(0);
    window.scrollTo(0, 0);
    alert("Veuillez renseigner le nom du répondant (Section 1) avant de soumettre l'enquête.");
  };

  const onSubmit = async (data: MenagesFormData) => {
    setIsSubmitting(true);
    try {
      const payload: MenagesFormData = {
        ...data,
        enqueteur_id: currentUser?.id || "",
        enqueteur_nom: currentUser?.full_name || "",
        enqueteur_email: currentUser?.email || "",
      };

      if (navigator.onLine) {
        const res = await fetch("/api/enquetes/menages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.error || resData.details || "Erreur de soumission");
        }
        recordLocalSubmission({
          id: resData.id || `menages-${Date.now()}`,
          formType: FORM_TYPE,
          label: payload.nom_repondant || "Ménage citoyen",
          commune: payload.commune || currentUser?.commune_affectation || "Conakry",
          enqueteur_id: currentUser?.id,
          enqueteur_nom: currentUser?.full_name,
          enqueteur_email: currentUser?.email,
          createdAt: resData.created_at || new Date().toISOString(),
          syncStatus: "synced",
        });
      } else {
        const pendingId = await addPendingSubmission(FORM_TYPE, payload as Record<string, unknown>);
        recordLocalSubmission({
          id: pendingId,
          formType: FORM_TYPE,
          label: payload.nom_repondant || "Ménage citoyen",
          commune: payload.commune || currentUser?.commune_affectation || "Conakry",
          enqueteur_id: currentUser?.id,
          enqueteur_nom: currentUser?.full_name,
          enqueteur_email: currentUser?.email,
          createdAt: new Date().toISOString(),
          syncStatus: "pending",
        });
      }

      await clearFormCompletely();
      setSubmitSuccess(true);
      window.scrollTo(0, 0);
    } catch (error: any) {
      console.error(error);
      alert(`Une erreur est survenue lors de la soumission : ${error.message || "Erreur inconnue"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) return null;

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-3xl shadow-lg border border-labal-deep/10 mt-10 space-y-5 animate-slide-up">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-labal-deep">Enquête Ménage envoyée avec succès !</h2>
        <p className="text-sm text-labal-gray-dark max-w-md mx-auto">
          Les réponses ont bien été enregistrées et le formulaire a été intégralement vidé pour votre prochaine enquête.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={async () => {
              await clearFormCompletely();
              setSubmitSuccess(false);
            }}
            className="inline-flex items-center justify-center gap-2 bg-labal-deep text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-labal-deep/90 shadow-sm transition-all w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4 text-labal-lime" />
            Nouvelle enquête Ménage (Formulaire vierge)
          </button>
          <Link
            href="/mes-enquetes"
            className="inline-flex items-center justify-center gap-2 bg-labal-lime/20 text-labal-deep border border-labal-lime/40 px-5 py-3 rounded-xl font-bold text-xs hover:bg-labal-lime/30 transition-all w-full sm:w-auto"
          >
            <ClipboardCheck className="w-4 h-4" />
            Voir mes enquêtes réalisées
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-labal-gray-light text-labal-deep px-4 py-3 rounded-xl font-bold text-xs hover:bg-labal-gray-medium transition-all w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
        </div>
      </div>
    );
  }

  // Conditional rendering values
  const aChangeCollecteur = watch("a_change_collecteur");
  const conflitPaiement = watch("conflit_paiement");

  return (
    <form
      key={formKey}
      className="min-h-screen bg-labal-gray-light py-8"
      onSubmit={handleSubmit(onSubmit, onInvalid)}
    >
      <div className="max-w-4xl mx-auto px-4 mb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-labal-deep">Enquête Ménages & Citoyens</h1>
        <p className="text-xs sm:text-sm text-labal-gray-dark mt-1">
          Formulaire de collecte de données usagers — Labal Platform
        </p>
      </div>

      <FormStepper
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        sectionLabels={MENAGES_SECTION_LABELS}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        onReset={handleManualReset}
        onStepClick={(step) => setCurrentStep(step)}
        isSubmitting={isSubmitting}
        isValid={isValid}
        completedSteps={completedSteps}
      >
        {currentStep === 0 && <Section1 register={register} errors={errors} />}
        {currentStep === 1 && <Section2 register={register} errors={errors} />}
        {currentStep === 2 && <Section3 register={register} errors={errors} />}
        {currentStep === 3 && <Section4 register={register} errors={errors} />}
        {currentStep === 4 &&
          (aChangeCollecteur === "true" ? (
            <Section5 control={control} errors={errors} />
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-labal-gray-medium">
              <p className="text-labal-gray-dark">
                Cette section n&apos;est pas applicable (Vous n&apos;avez pas changé de collecteur).
              </p>
            </div>
          ))}
        {currentStep === 5 && <Section6 register={register} control={control} errors={errors} />}
        {currentStep === 6 && <Section7 register={register} errors={errors} />}
        {currentStep === 7 && <Section8 register={register} errors={errors} />}
        {currentStep === 8 && <Section9 register={register} errors={errors} />}
        {currentStep === 9 && <Section10 register={register} control={control} errors={errors} />}
        {currentStep === 10 && <Section11 register={register} control={control} errors={errors} />}
        {currentStep === 11 && <Section12 register={register} errors={errors} />}
        {currentStep === 12 && <Section13 register={register} errors={errors} />}
        {currentStep === 13 &&
          (conflitPaiement === "true" ? (
            <Section14 register={register} errors={errors} />
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-labal-gray-medium">
              <p className="text-labal-gray-dark">
                Cette section n&apos;est pas applicable (Aucun conflit de paiement).
              </p>
            </div>
          ))}
        {currentStep === 14 && <Section15 register={register} errors={errors} />}
        {currentStep === 15 && <Section16 register={register} errors={errors} />}
      </FormStepper>
    </form>
  );
}
