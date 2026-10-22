"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, PlusCircle, Home } from "lucide-react";
import { FormStepper } from "@/components/forms/FormStepper";
import { TRANSIT_SECTION_LABELS } from "@/lib/constants";
import { transitSchema, TransitFormData } from "@/lib/schemas/transit.schema";
import {
  saveDraft,
  getDraft,
  deleteDraft,
  addPendingSubmission,
  recordLocalSubmission,
} from "@/lib/offline/indexeddb";
import { useAuth } from "@/lib/auth/AuthContext";

import Section1 from "@/components/forms/transit/Section1";
import Section2 from "@/components/forms/transit/Section2";
import Section3 from "@/components/forms/transit/Section3";
import Section4 from "@/components/forms/transit/Section4";
import Section5 from "@/components/forms/transit/Section5";
import Section6 from "@/components/forms/transit/Section6";
import Section7 from "@/components/forms/transit/Section7";
import Section8 from "@/components/forms/transit/Section8";
import Section9 from "@/components/forms/transit/Section9";
import Section10 from "@/components/forms/transit/Section10";
import Section11 from "@/components/forms/transit/Section11";
import Section12 from "@/components/forms/transit/Section12";
import Section13 from "@/components/forms/transit/Section13";
import Section14 from "@/components/forms/transit/Section14";
import Section15 from "@/components/forms/transit/Section15";
import Section16 from "@/components/forms/transit/Section16";

import { RoleGuard } from "@/components/auth/RoleGuard";

const FORM_TYPE = "transit";
const TOTAL_STEPS = 16;

const EMPTY_TRANSIT_DEFAULTS: TransitFormData = {
  email_responsable: "",
  nom_site: "",
  statut_site: "",
  entite_gestionnaire: "",
  commune: "",
  quartier_repere: "",
  capacite_caissons: undefined,
  cloture_dalle: "",
  equipements: [],
  presence_pont_bascule: "",
  tri_sur_place: "",
  filieres_triees: [],
  nb_trieurs: undefined,
  acheteurs: "",
  nb_pme_clientes: undefined,
  nb_rotations_quotidiennes: undefined,
  tranches_horaires_pointe: "",
  acces_limite_agrees: "",
  redevance_deversement: "",
  refus_acces: "",
  causes_refus: [],
  outil_enregistrement: "",
  donnees_consignees: [],
  frequence_rotation: "",
  prestataire_transporteur: "",
  frequence_saturation: "",
  consequences_environnementales: "",
  causes_blocage: [],
  duree_max_blocage: "",
  canal_alerte_mairie: "",
  delai_reaction_communal: "",
  encaissements_especes_vs_mobile: "",
  litiges_caisse: "",
  dotation_epi: [],
  nuisances_vecteurs: "",
  local_securise_courant: "",
  qualite_reseau_4g: "",
  smartphone_fonction: "",
  bouton_alerte_sos: "",
  suivi_gps_camions: "",
  contact_responsable: "",
  suggestions_amenagement: "",
};

export default function TransitPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "ENQUETEUR"]} requireApproved={true}>
      <TransitContent />
    </RoleGuard>
  );
}

function TransitContent() {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const isResettingRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    reset,
  } = useForm<TransitFormData>({
    resolver: zodResolver(transitSchema) as any,
    mode: "onChange",
    defaultValues: EMPTY_TRANSIT_DEFAULTS,
  });

  // Load draft on mount
  useEffect(() => {
    const load = async () => {
      const draft = await getDraft(FORM_TYPE);
      if (draft && draft.data && Object.keys(draft.data).length > 0) {
        isResettingRef.current = true;
        reset({ ...EMPTY_TRANSIT_DEFAULTS, ...(draft.data as Partial<TransitFormData>) });
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
    reset(EMPTY_TRANSIT_DEFAULTS, { keepValues: false, keepDefaultValues: false });
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
    setCompletedSteps(new Set([...completedSteps, currentStep]));
    let nextStep = currentStep + 1;
    const data = getValues();

    if (nextStep === 3 && data.tri_sur_place !== "true") {
      nextStep = 4;
    }
    if (nextStep === 6 && data.refus_acces !== "true") {
      nextStep = 7;
    }

    setCurrentStep(Math.min(nextStep, TOTAL_STEPS - 1));
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    let prevStep = currentStep - 1;
    const data = getValues();

    if (prevStep === 6 && data.refus_acces !== "true") {
      prevStep = 5;
    }
    if (prevStep === 3 && data.tri_sur_place !== "true") {
      prevStep = 2;
    }

    setCurrentStep(Math.max(prevStep, 0));
    window.scrollTo(0, 0);
  };

  const onInvalid = () => {
    setCurrentStep(0);
    window.scrollTo(0, 0);
    alert("Veuillez renseigner le nom du site (Section 1) avant de soumettre l'enquête.");
  };

  const onSubmit = async (data: TransitFormData) => {
    setIsSubmitting(true);
    try {
      const payload: TransitFormData = {
        ...data,
        enqueteur_id: currentUser?.id || "",
        enqueteur_nom: currentUser?.full_name || "",
        enqueteur_email: currentUser?.email || "",
      };

      if (navigator.onLine) {
        const res = await fetch("/api/enquetes/transit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.error || resData.details || "Erreur lors de la soumission");
        }
        recordLocalSubmission({
          id: resData.id || `transit-${Date.now()}`,
          formType: FORM_TYPE,
          label: payload.nom_site || "Zone de Transit (ZST)",
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
          label: payload.nom_site || "Zone de Transit (ZST)",
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
      alert(`Erreur lors de la soumission : ${error.message || "Erreur inconnue"}`);
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
        <h2 className="text-2xl font-black text-labal-deep">Enquête Zone de Transit enregistrée !</h2>
        <p className="text-sm text-labal-gray-dark max-w-md mx-auto">
          Les données du site ont bien été sauvegardées et le formulaire a été intégralement vidé pour votre prochaine saisie.
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
            Nouvelle enquête Transit (Formulaire vierge)
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

  const renderSection = () => {
    switch (currentStep) {
      case 0: return <Section1 register={register} errors={errors} />;
      case 1: return <Section2 register={register} errors={errors} />;
      case 2: return <Section3 register={register} control={control} errors={errors} />;
      case 3: return <Section4 register={register} control={control} errors={errors} watch={watch} />;
      case 4: return <Section5 register={register} errors={errors} />;
      case 5: return <Section6 register={register} errors={errors} />;
      case 6: return <Section7 control={control} errors={errors} watch={watch} />;
      case 7: return <Section8 register={register} control={control} errors={errors} />;
      case 8: return <Section9 register={register} errors={errors} />;
      case 9: return <Section10 register={register} errors={errors} />;
      case 10: return <Section11 register={register} control={control} errors={errors} />;
      case 11: return <Section12 register={register} errors={errors} />;
      case 12: return <Section13 register={register} errors={errors} />;
      case 13: return <Section14 register={register} control={control} errors={errors} />;
      case 14: return <Section15 register={register} errors={errors} />;
      case 15: return <Section16 register={register} errors={errors} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-labal-gray-light py-8">
      <div className="max-w-4xl mx-auto px-4 mb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-labal-deep">Enquête Zones de Transit & Tri (ZST/PA)</h1>
        <p className="text-xs sm:text-sm text-labal-gray-dark mt-1">
          Évaluation des capacités, de la saturation et du tri sur site — Labal Platform
        </p>
      </div>

      <form key={formKey} onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <FormStepper
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          sectionLabels={TRANSIT_SECTION_LABELS}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          onReset={handleManualReset}
          onStepClick={(step) => setCurrentStep(step)}
          isSubmitting={isSubmitting}
          isValid={isValid}
          completedSteps={completedSteps}
        >
          {renderSection()}
        </FormStepper>
      </form>
    </div>
  );
}
