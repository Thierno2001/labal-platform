"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, PlusCircle, Home } from "lucide-react";
import { PmeFormData, pmeSchema } from "@/lib/schemas/pme.schema";
import { PME_SECTION_LABELS } from "@/lib/constants";
import { FormStepper } from "@/components/forms/FormStepper";
import {
  saveDraft,
  getDraft,
  addPendingSubmission,
  deleteDraft,
  recordLocalSubmission,
} from "@/lib/offline/indexeddb";
import { useAuth } from "@/lib/auth/AuthContext";

import { Section1 } from "@/components/forms/pme/Section1";
import { Section2 } from "@/components/forms/pme/Section2";
import { Section3 } from "@/components/forms/pme/Section3";
import { Section4 } from "@/components/forms/pme/Section4";
import { Section5 } from "@/components/forms/pme/Section5";
import { Section6 } from "@/components/forms/pme/Section6";
import { Section7 } from "@/components/forms/pme/Section7";
import { Section8 } from "@/components/forms/pme/Section8";
import { Section9 } from "@/components/forms/pme/Section9";
import { Section10 } from "@/components/forms/pme/Section10";
import { Section11 } from "@/components/forms/pme/Section11";
import { Section12 } from "@/components/forms/pme/Section12";
import { Section13 } from "@/components/forms/pme/Section13";
import { Section14 } from "@/components/forms/pme/Section14";
import { Section15 } from "@/components/forms/pme/Section15";
import { Section16 } from "@/components/forms/pme/Section16";

import { RoleGuard } from "@/components/auth/RoleGuard";

const FORM_TYPE = "pme";
const TOTAL_STEPS = 16;

const EMPTY_PME_DEFAULTS: PmeFormData = {
  email: "",
  nom_structure: "",
  affilie_conaag: "",
  type_structure: "",
  num_agrement: "",
  annee_creation: "",
  communes: [],
  quartiers: "",
  nb_menages_desservis: "",
  dessert_commerces: "",
  nb_commerces: "",
  mode_recrutement: [],
  choix_libre_menage: "",
  refus_menages: "",
  raisons_refus_menages: [],
  exemple_refus: "",
  zone_geographique_definie: "",
  modalite_definition_zone: [],
  conflits_territoriaux: "",
  nb_collecteurs: "",
  exclusivite_collecteurs: "",
  engins_utilises: [],
  decision_affectation: "",
  refus_collecteur: "",
  raisons_refus_collecteur: [],
  canaux_demandes: [],
  type_prestation: "",
  fixation_horaire: "",
  demandes_en_attente: "",
  etapes_collecte: "",
  duree_tournee_heures: "",
  confirmation_collecte: "",
  gestion_imprevus: "",
  lieu_decharge: [],
  voyages_par_jour: "",
  frequence_saturation_transit: "",
  temps_attente_transit: "",
  systeme_incidents: "",
  initiative_annulation: [],
  procedure_annulation: "",
  modes_paiement_recus: [],
  part_especes_vs_mobile: "",
  moment_paiement: "",
  politique_impayes: "",
  remuneration_collecteurs: "",
  frequence_paie_collecteurs: "",
  suivi_comptable_collecteurs: "",
  difficultes_rencontrees: [],
  outil_numerique_actuel: "",
  nom_logiciel: "",
  interet_labal: "",
  modules_prioritaires: [],
  capacite_smartphone_collecteurs: "",
  nom_contact: "",
  telephone_contact: "",
  accord_recontact: "",
};

export default function PmeFormPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "ENQUETEUR"]} requireApproved={true}>
      <PmeFormContent />
    </RoleGuard>
  );
}

function PmeFormContent() {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const isResettingRef = useRef(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<PmeFormData>({
    resolver: zodResolver(pmeSchema) as any,
    mode: "onChange",
    defaultValues: EMPTY_PME_DEFAULTS,
  });

  useEffect(() => {
    const loadDraft = async () => {
      const draft = await getDraft(FORM_TYPE);
      if (draft && draft.data && Object.keys(draft.data).length > 0) {
        isResettingRef.current = true;
        reset({ ...EMPTY_PME_DEFAULTS, ...(draft.data as Partial<PmeFormData>) });
        if (typeof draft.currentStep === "number" && draft.currentStep >= 0 && draft.currentStep < TOTAL_STEPS) {
          setCurrentStep(draft.currentStep);
        }
        setTimeout(() => {
          isResettingRef.current = false;
        }, 50);
      }
      setIsReady(true);
    };
    loadDraft();
  }, [reset]);

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
    reset(EMPTY_PME_DEFAULTS, { keepValues: false, keepDefaultValues: false });
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

  const props = { control, errors, watch, register, setValue };

  const checkConditionsAndSkip = (step: number, direction: 1 | -1): number => {
    let nextStep = step + direction;
    while (nextStep >= 0 && nextStep < TOTAL_STEPS) {
      if (nextStep === 3 && watch("refus_menages") !== "true") {
        nextStep += direction;
        continue;
      }
      if (nextStep === 5 && watch("zone_geographique_definie") !== "true") {
        nextStep += direction;
        continue;
      }
      if (nextStep === 7 && watch("refus_collecteur") !== "true") {
        nextStep += direction;
        continue;
      }
      break;
    }
    return Math.max(0, Math.min(nextStep, TOTAL_STEPS - 1));
  };

  const handleNext = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);
    setCurrentStep(checkConditionsAndSkip(currentStep, 1));
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setCurrentStep(checkConditionsAndSkip(currentStep, -1));
    window.scrollTo(0, 0);
  };

  const onInvalid = () => {
    setCurrentStep(0);
    window.scrollTo(0, 0);
    alert("Veuillez renseigner le nom de la structure (Section 1) avant de soumettre l'enquête.");
  };

  const onSubmit = async (data: PmeFormData) => {
    setIsSubmitting(true);
    try {
      const payload: PmeFormData = {
        ...data,
        enqueteur_id: currentUser?.id || "",
        enqueteur_nom: currentUser?.full_name || "",
        enqueteur_email: currentUser?.email || "",
      };

      const isOnline = navigator.onLine;
      if (isOnline) {
        const response = await fetch("/api/enquetes/pme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.error || resData.details || "Erreur lors de la sauvegarde sur le serveur.");
        }
        recordLocalSubmission({
          id: resData.id || `pme-${Date.now()}`,
          formType: FORM_TYPE,
          label: payload.nom_structure || "PME Collecte",
          commune: Array.isArray(payload.communes) && payload.communes.length > 0 ? payload.communes.join(", ") : currentUser?.commune_affectation || "Conakry",
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
          label: payload.nom_structure || "PME Collecte",
          commune: Array.isArray(payload.communes) && payload.communes.length > 0 ? payload.communes.join(", ") : currentUser?.commune_affectation || "Conakry",
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
        <h2 className="text-2xl font-black text-labal-deep">Enquête PME enregistrée avec succès !</h2>
        <p className="text-sm text-labal-gray-dark max-w-md mx-auto">
          Les données ont bien été enregistrées et le formulaire a été intégralement vidé pour votre prochaine saisie.
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
            Nouvelle enquête PME (Formulaire vierge)
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

  return (
    <form key={formKey} onSubmit={handleSubmit(onSubmit, onInvalid)} className="pb-20 bg-labal-gray-light min-h-screen pt-6">
      <div className="max-w-4xl mx-auto px-4 mb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-labal-deep">Enquête PME de Collecte & CONAAG</h1>
        <p className="text-xs sm:text-sm text-labal-gray-dark mt-1">
          Diagnostic opérationnel des entreprises de pré-collecte — Labal Platform
        </p>
      </div>
      <FormStepper
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        sectionLabels={PME_SECTION_LABELS}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        onReset={handleManualReset}
        onStepClick={(step) => setCurrentStep(step)}
        isSubmitting={isSubmitting}
        completedSteps={completedSteps}
      >
        {currentStep === 0 && <Section1 {...props} />}
        {currentStep === 1 && <Section2 {...props} />}
        {currentStep === 2 && <Section3 {...props} />}
        {currentStep === 3 && <Section4 {...props} />}
        {currentStep === 4 && <Section5 {...props} />}
        {currentStep === 5 && <Section6 {...props} />}
        {currentStep === 6 && <Section7 {...props} />}
        {currentStep === 7 && <Section8 {...props} />}
        {currentStep === 8 && <Section9 {...props} />}
        {currentStep === 9 && <Section10 {...props} />}
        {currentStep === 10 && <Section11 {...props} />}
        {currentStep === 11 && <Section12 {...props} />}
        {currentStep === 12 && <Section13 {...props} />}
        {currentStep === 13 && <Section14 {...props} />}
        {currentStep === 14 && <Section15 {...props} />}
        {currentStep === 15 && <Section16 {...props} />}
      </FormStepper>
    </form>
  );
}
