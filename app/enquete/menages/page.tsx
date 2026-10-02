"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormStepper } from "@/components/forms/FormStepper";
import { MENAGES_SECTION_LABELS } from "@/lib/constants";
import { menagesSchema, MenagesFormData } from "@/lib/schemas/menages.schema";

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

const TOTAL_STEPS = 16;
const DRAFT_KEY = "labal_menages_draft";

export default function MenagesSurveyPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "ENQUETEUR"]} requireApproved={true}>
      <MenagesSurveyContent />
    </RoleGuard>
  );
}

function MenagesSurveyContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const methods = useForm<MenagesFormData>({
    resolver: zodResolver(menagesSchema) as any,
    mode: "onChange",
    defaultValues: {
      motifs_insatisfaction: [],
      typologie_dechets: [],
      facteurs_stimulants: [],
      connaissance_risques: [],
    },
  });

  const { register, control, watch, formState: { errors, isValid }, getValues, reset } = methods;

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        reset(parsed);
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, [reset]);

  // Auto-save draft
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = getValues();
      
      // Try online submission
      if (navigator.onLine) {
        const res = await fetch("/api/enquetes/menages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        
        if (!res.ok) throw new Error("Erreur de soumission");
      } else {
        // Offline submit simulation
        const offlineQueue = JSON.parse(localStorage.getItem("labal_offline_queue") || "[]");
        offlineQueue.push({ type: "menages", data, timestamp: Date.now() });
        localStorage.setItem("labal_offline_queue", JSON.stringify(offlineQueue));
      }
      
      // Success
      setSubmitSuccess(true);
      localStorage.removeItem(DRAFT_KEY);
      reset();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la soumission. Les données ont été sauvegardées localement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-xl shadow-sm border border-labal-gray-medium mt-10">
        <h2 className="text-2xl font-bold text-labal-deep mb-4">Enquête envoyée avec succès !</h2>
        <p className="text-labal-gray-dark mb-6">Merci pour votre participation.</p>
        <button
          onClick={() => {
            setSubmitSuccess(false);
            setCurrentStep(0);
            setCompletedSteps(new Set());
          }}
          className="bg-labal-lime text-white px-6 py-2.5 rounded-lg font-medium hover:bg-labal-lime/90"
        >
          Nouvelle enquête
        </button>
      </div>
    );
  }

  // Conditional rendering values
  const aChangeCollecteur = watch("a_change_collecteur");
  const conflitPaiement = watch("conflit_paiement");

  return (
    <form className="min-h-screen bg-labal-gray-light py-8" onSubmit={(e) => e.preventDefault()}>
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <h1 className="text-3xl font-bold text-labal-deep">Enquête Ménages & Citoyens</h1>
        <p className="text-labal-gray-dark mt-2">Formulaire de collecte de données - Labal Platform</p>
      </div>

      <FormStepper
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        sectionLabels={MENAGES_SECTION_LABELS}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        isValid={isValid}
        completedSteps={completedSteps}
      >
        {currentStep === 0 && <Section1 register={register} errors={errors} />}
        {currentStep === 1 && <Section2 register={register} errors={errors} />}
        {currentStep === 2 && <Section3 register={register} errors={errors} />}
        {currentStep === 3 && <Section4 register={register} errors={errors} />}
        {currentStep === 4 && (
          aChangeCollecteur === "true" ? (
            <Section5 control={control} errors={errors} />
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-labal-gray-medium">
              <p className="text-labal-gray-dark">Cette section n'est pas applicable (Vous n'avez pas changé de collecteur).</p>
            </div>
          )
        )}
        {currentStep === 5 && <Section6 register={register} control={control} errors={errors} />}
        {currentStep === 6 && <Section7 register={register} errors={errors} />}
        {currentStep === 7 && <Section8 register={register} errors={errors} />}
        {currentStep === 8 && <Section9 register={register} errors={errors} />}
        {currentStep === 9 && <Section10 register={register} control={control} errors={errors} />}
        {currentStep === 10 && <Section11 register={register} control={control} errors={errors} />}
        {currentStep === 11 && <Section12 register={register} errors={errors} />}
        {currentStep === 12 && <Section13 register={register} errors={errors} />}
        {currentStep === 13 && (
          conflitPaiement === "true" ? (
            <Section14 register={register} errors={errors} />
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-labal-gray-medium">
              <p className="text-labal-gray-dark">Cette section n'est pas applicable (Aucun conflit de paiement).</p>
            </div>
          )
        )}
        {currentStep === 14 && <Section15 register={register} errors={errors} />}
        {currentStep === 15 && <Section16 register={register} errors={errors} />}
      </FormStepper>
    </form>
  );
}
