"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, PlusCircle, Home } from "lucide-react";
import { autoritesSchema, AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormStepper } from "@/components/forms/FormStepper";
import { AUTORITES_SECTION_LABELS } from "@/lib/constants";
import {
  saveDraft,
  getDraft,
  deleteDraft,
  addPendingSubmission,
  recordLocalSubmission,
} from "@/lib/offline/indexeddb";
import { useAuth } from "@/lib/auth/AuthContext";

import Section1 from "@/components/forms/autorites/Section1";
import Section2 from "@/components/forms/autorites/Section2";
import Section3 from "@/components/forms/autorites/Section3";
import Section4 from "@/components/forms/autorites/Section4";
import Section5 from "@/components/forms/autorites/Section5";
import Section6 from "@/components/forms/autorites/Section6";
import Section7 from "@/components/forms/autorites/Section7";
import Section8 from "@/components/forms/autorites/Section8";
import Section9 from "@/components/forms/autorites/Section9";
import Section10 from "@/components/forms/autorites/Section10";
import Section11 from "@/components/forms/autorites/Section11";
import Section12 from "@/components/forms/autorites/Section12";
import Section13 from "@/components/forms/autorites/Section13";
import Section14 from "@/components/forms/autorites/Section14";
import Section15 from "@/components/forms/autorites/Section15";
import Section16 from "@/components/forms/autorites/Section16";

import { RoleGuard } from "@/components/auth/RoleGuard";

const FORM_TYPE = "autorites";
const TOTAL_STEPS = AUTORITES_SECTION_LABELS.length;

const EMPTY_AUTORITES_DEFAULTS: AutoritesFormData = {
  nom_repondant: "",
  titre_fonction: "",
  entite: "",
  commune: "",
  nb_pme_conventionnees: undefined,
  convention_conaag: "",
  cahier_charges: "",
  zonage_exclusif: "",
  disponibilite_sig: "",
  nb_points_noirs: undefined,
  causes_points_noirs: [],
  flotte_communale: [],
  capacite_4_transferts: "",
  mode_gestion_decharge: "",
  obstacles_transport: [],
  sources_financement: [],
  recouvrement_redevances: "",
  canal_reclamations: "",
  delai_resorption: "",
  controles_inopines: "",
  sanctions_recentes: "",
  actions_education: "",
  synergie_sanita: "",
  projets_valorisation: "",
  avis_suppression_liquide: "",
  volonte_mobile_money_obligatoire: "",
  correlation_ordures_maladies: "",
  liens_centres_sante: "",
  format_consolidation: "",
  frequence_reporting: "",
  ordinateurs_mairie: "",
  smartphone_agents_terrain: "",
  besoins_dashboard: [],
  point_focal_designe: "",
  coordonnees_point_focal: "",
  recommandations: "",
};

export default function AutoritesSurveyPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "ENQUETEUR"]} requireApproved={true}>
      <AutoritesContent />
    </RoleGuard>
  );
}

function AutoritesContent() {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const isResettingRef = useRef(false);

  const form = useForm<AutoritesFormData>({
    resolver: zodResolver(autoritesSchema) as any,
    defaultValues: EMPTY_AUTORITES_DEFAULTS,
    mode: "onChange",
  });

  // Load draft on mount
  useEffect(() => {
    const load = async () => {
      const draft = await getDraft(FORM_TYPE);
      if (draft && draft.data && Object.keys(draft.data).length > 0) {
        isResettingRef.current = true;
        form.reset({ ...EMPTY_AUTORITES_DEFAULTS, ...(draft.data as Partial<AutoritesFormData>) });
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
  }, [form]);

  // Save draft when form changes
  useEffect(() => {
    if (!isReady) return;
    const subscription = form.watch((value) => {
      if (isResettingRef.current || submitSuccess) return;
      saveDraft(FORM_TYPE, value as Record<string, unknown>, currentStep);
    });
    return () => subscription.unsubscribe();
  }, [form, isReady, currentStep, submitSuccess]);

  const clearFormCompletely = async () => {
    isResettingRef.current = true;
    await deleteDraft(FORM_TYPE);
    form.reset(EMPTY_AUTORITES_DEFAULTS, { keepValues: false, keepDefaultValues: false });
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
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const onInvalid = () => {
    setCurrentStep(0);
    window.scrollTo(0, 0);
    alert("Veuillez renseigner le nom du répondant (Section 1) avant de soumettre l'enquête.");
  };

  const onSubmit = async (data: AutoritesFormData) => {
    try {
      setIsSubmitting(true);
      const payload: AutoritesFormData = {
        ...data,
        enqueteur_id: currentUser?.id || "",
        enqueteur_nom: currentUser?.full_name || "",
        enqueteur_email: currentUser?.email || "",
      };

      if (navigator.onLine) {
        const response = await fetch("/api/enquetes/autorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.error || resData.details || "Erreur de soumission");
        }
        recordLocalSubmission({
          id: resData.id || `autorites-${Date.now()}`,
          formType: FORM_TYPE,
          label: `${payload.nom_repondant || "Autorité"} ${payload.entite ? `(${payload.entite})` : ""}`.trim(),
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
          label: `${payload.nom_repondant || "Autorité"} ${payload.entite ? `(${payload.entite})` : ""}`.trim(),
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
      alert(`Une erreur s'est produite lors de la soumission : ${error.message || "Erreur inconnue"}`);
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
        <h2 className="text-2xl font-black text-labal-deep">Enquête Autorité Locale enregistrée !</h2>
        <p className="text-sm text-labal-gray-dark max-w-md mx-auto">
          Les informations institutionnelles ont bien été enregistrées et le formulaire a été intégralement vidé.
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
            Nouvelle enquête Autorités (Formulaire vierge)
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

  const sections = [
    <Section1 key="1" form={form} />,
    <Section2 key="2" form={form} />,
    <Section3 key="3" form={form} />,
    <Section4 key="4" form={form} />,
    <Section5 key="5" form={form} />,
    <Section6 key="6" form={form} />,
    <Section7 key="7" form={form} />,
    <Section8 key="8" form={form} />,
    <Section9 key="9" form={form} />,
    <Section10 key="10" form={form} />,
    <Section11 key="11" form={form} />,
    <Section12 key="12" form={form} />,
    <Section13 key="13" form={form} />,
    <Section14 key="14" form={form} />,
    <Section15 key="15" form={form} />,
    <Section16 key="16" form={form} />,
  ];

  return (
    <div className="min-h-screen bg-labal-gray-light py-8">
      <div className="max-w-4xl mx-auto px-4 mb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-labal-deep">Enquête Autorités Locales & Mairies</h1>
        <p className="text-xs sm:text-sm text-labal-gray-dark mt-1">
          Collecte d&apos;informations auprès des mairies et superviseurs — Labal Platform
        </p>
      </div>

      <form key={formKey} onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <FormStepper
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          sectionLabels={AUTORITES_SECTION_LABELS}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          onReset={handleManualReset}
          onStepClick={(step) => setCurrentStep(step)}
          isSubmitting={isSubmitting}
          isValid={form.formState.isValid}
          completedSteps={completedSteps}
        >
          {sections[currentStep]}
        </FormStepper>
      </form>
    </div>
  );
}
