"use client";

import { UseFormReturn } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, TextAreaField, BooleanRadio } from "@/components/forms/FormSection";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section10({ form }: SectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Tri & Sensibilisation" description="Actions éducatives et projets">
      <TextAreaField
        label="Actions d'éducation menées"
        register={register("actions_education")}
        error={errors.actions_education?.message}
      />
      <BooleanRadio
        label="Existe-t-il une synergie avec Sanita ?"
        register={register("synergie_sanita")}
        error={errors.synergie_sanita?.message}
      />
      <TextAreaField
        label="Projets de valorisation en cours ou prévus"
        register={register("projets_valorisation")}
        error={errors.projets_valorisation?.message}
      />
    </FormSection>
  );
}
