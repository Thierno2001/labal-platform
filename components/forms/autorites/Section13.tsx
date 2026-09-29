"use client";

import { UseFormReturn } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, TextField, RadioGroup } from "@/components/forms/FormSection";
import { FORMAT_CONSOLIDATION_OPTIONS } from "@/lib/constants";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section13({ form }: SectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Statistiques & Rapports" description="Suivi des données">
      <RadioGroup
        label="Format actuel de consolidation des données"
        options={FORMAT_CONSOLIDATION_OPTIONS}
        register={register("format_consolidation")}
        error={errors.format_consolidation?.message}
      />
      <TextField
        label="Fréquence du reporting"
        register={register("frequence_reporting")}
        error={errors.frequence_reporting?.message}
      />
    </FormSection>
  );
}
