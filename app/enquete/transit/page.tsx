"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormStepper } from "@/components/forms/FormStepper";
import { TRANSIT_SECTION_LABELS } from "@/lib/constants";
import { transitSchema, TransitFormData } from "@/lib/schemas/transit.schema";
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

const TOTAL_STEPS = 16;
const STORAGE_KEY = "labal_transit_form_draft";

export default function TransitPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "ENQUETEUR"]} requireApproved={true}>
      <TransitContent />
    </RoleGuard>
  );
}

function TransitContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    formState: { errors, isValid },
    watch,
    getValues,
    setValue,
    trigger,
  } = useForm<TransitFormData>({
    resolver: zodResolver(transitSchema) as any,
    mode: "onChange",
  });

  const formData = watch();

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        Object.entries(parsed).forEach(([key, value]) => {
          setValue(key as keyof TransitFormData, value as any);
        });
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, [setValue]);

  // Auto-save draft
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData]);

  const validateStep = async (step: number) => {
    // Validate based on the specific fields in each section.
    // Since we're using a single large form and Zod schema without granular section schemas,
    // we do a partial trigger or assume true to allow skipping if fields are mostly optional.
    return true; 
  };

  const handleNext = async () => {
    const isValidStep = await validateStep(currentStep);
    if (isValidStep) {
      setCompletedSteps(new Set([...completedSteps, currentStep]));
      // Skip logic
      let nextStep = currentStep + 1;
      const data = getValues();
      
      if (nextStep === 3 && data.tri_sur_place !== "true") {
        nextStep = 4; // Skip Section4 if tri_sur_place is false
      }
      if (nextStep === 6 && data.refus_acces !== "true") {
        nextStep = 7; // Skip Section7 if refus_acces is false
      }

      setCurrentStep(Math.min(nextStep, TOTAL_STEPS - 1));
    }
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
  };

  const handleSubmitForm = async () => {
    const isValidForm = await trigger();
    if (!isValidForm) {
      alert("Veuillez vérifier les champs requis.");
      return;
    }
    setIsSubmitting(true);
    try {
      const data = getValues();
      const res = await fetch("/api/enquetes/transit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || resData.details || "Erreur lors de la soumission");
      }
      localStorage.removeItem(STORAGE_KEY);
      alert("Enquête soumise avec succès !");
      // Optional: reset form or redirect
    } catch (error: any) {
      console.error(error);
      alert(`Erreur lors de la soumission : ${error.message || "Erreur inconnue"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <h1 className="text-3xl font-bold text-labal-deep">Enquête Transit & Tri</h1>
        <p className="text-labal-gray-dark mt-2">
          Veuillez remplir le formulaire d'enquête pour les zones de transit.
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <FormStepper
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          sectionLabels={TRANSIT_SECTION_LABELS}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSubmitForm}
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
