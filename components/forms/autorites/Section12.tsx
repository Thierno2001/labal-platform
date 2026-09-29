"use client";

import { UseFormReturn } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, TextAreaField, BooleanRadio } from "@/components/forms/FormSection";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section12({ form }: SectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Santé publique" description="Impact sanitaire des déchets">
      <BooleanRadio
        label="Corrélation établie entre ordures et maladies ?"
        register={register("correlation_ordures_maladies")}
        error={errors.correlation_ordures_maladies?.message}
      />
      <TextAreaField
        label="Liens éventuels avec les centres de santé"
        register={register("liens_centres_sante")}
        error={errors.liens_centres_sante?.message}
      />
    </FormSection>
  );
}
