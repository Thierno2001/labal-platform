"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PmeFormData, pmeSchema } from "@/lib/schemas/pme.schema";
import { PME_SECTION_LABELS } from "@/lib/constants";
import { FormStepper } from "@/components/forms/FormStepper";
import { saveDraft, getDraft, addPendingSubmission, deleteDraft } from "@/lib/offline/indexeddb";

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

export default function PmeFormPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "ENQUETEUR"]} requireApproved={true}>
      <PmeFormContent />
    </RoleGuard>
  );
}

function PmeFormContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const { control, register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<PmeFormData>({
    resolver: zodResolver(pmeSchema) as any,
    mode: "onBlur",
    defaultValues: {
      communes: [],
      mode_recrutement: [],
      raisons_refus_menages: [],
      modalite_definition_zone: [],
      engins_utilises: [],
      raisons_refus_collecteur: [],
      canaux_demandes: [],
      lieu_decharge: [],
      initiative_annulation: [],
      modes_paiement_recus: [],
      difficultes_rencontrees: [],
      modules_prioritaires: []
    }
  });

  useEffect(() => {
    const loadDraft = async () => {
      const draft = await getDraft(FORM_TYPE);
      if (draft && draft.data) {
        Object.entries(draft.data).forEach(([key, value]) => {
          setValue(key as keyof PmeFormData, value as any);
        });
      }
      setIsReady(true);
    };
    loadDraft();
  }, [setValue]);

  useEffect(() => {
    if (!isReady) return;
    const subscription = watch((value) => {
      saveDraft(FORM_TYPE, value, currentStep);
    });
    return () => subscription.unsubscribe();
  }, [watch, isReady, currentStep]);

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

  const onSubmit = async (data: PmeFormData) => {
    setIsSubmitting(true);
    try {
      const isOnline = navigator.onLine;
      if (isOnline) {
        const response = await fetch("/api/enquetes/pme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erreur serveur");
        alert("Enquête soumise avec succès !");
      } else {
        await addPendingSubmission(FORM_TYPE, data);
        alert("Hors ligne : L'enquête a été sauvegardée et sera envoyée dès le retour de la connexion.");
      }
      // Clear draft after submit
      await deleteDraft(FORM_TYPE);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la soumission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-20">
      <FormStepper
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        sectionLabels={PME_SECTION_LABELS}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit(onSubmit)}
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
