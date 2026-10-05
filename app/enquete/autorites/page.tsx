"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { autoritesSchema, AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormStepper } from "@/components/forms/FormStepper";
import { AUTORITES_SECTION_LABELS } from "@/lib/constants";

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

const STORAGE_KEY = "labal_autorites_draft";

export default function AutoritesSurveyPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "ENQUETEUR"]} requireApproved={true}>
      <AutoritesContent />
    </RoleGuard>
  );
}

function AutoritesContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AutoritesFormData>({
    resolver: zodResolver(autoritesSchema) as any,
    defaultValues: {
      causes_points_noirs: [],
      flotte_communale: [],
      obstacles_transport: [],
      sources_financement: [],
      besoins_dashboard: [],
    },
    mode: "onChange",
  });

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        form.reset(parsed);
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, [form]);

  // Save draft when form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleNext = async () => {
    // We could validate the specific step here, but for now just move next
    setCompletedSteps(new Set([...completedSteps, currentStep]));
    setCurrentStep((prev) => Math.min(prev + 1, AUTORITES_SECTION_LABELS.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: AutoritesFormData) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch("/api/enquetes/autorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || resData.details || "Erreur de soumission");
      }

      localStorage.removeItem(STORAGE_KEY);
      alert("Enquête soumise avec succès !");
      
      // Optionally redirect or reset form
      form.reset();
      setCurrentStep(0);
      setCompletedSteps(new Set());
      
    } catch (error: any) {
      console.error(error);
      alert(`Une erreur s'est produite lors de la soumission : ${error.message || "Erreur inconnue"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="max-w-4xl mx-auto px-4 mb-8 text-center">
        <h1 className="text-3xl font-bold text-labal-deep">Enquête Autorités Locales</h1>
        <p className="text-labal-gray-dark mt-2">
          Collecte d&apos;informations auprès des mairies et institutions
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormStepper
          currentStep={currentStep}
          totalSteps={AUTORITES_SECTION_LABELS.length}
          sectionLabels={AUTORITES_SECTION_LABELS}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={form.handleSubmit(onSubmit)}
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
