"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, CheckboxGroup } from "@/components/forms/FormSection";

const MOTIFS_OPTIONS = [
  "Retards chroniques",
  "Impolitesse",
  "Augmentations injustifiées",
  "Arrêt de service",
  "Ordures délaissées"
];

export function Section5({ control, errors }: { control: UseFormReturn<MenagesFormData>["control"]; errors: any }) {
  return (
    <FormSection title="Motifs d'insatisfaction">
      <Controller
        name="motifs_insatisfaction"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            label="Quels étaient vos motifs d'insatisfaction ?"
            options={MOTIFS_OPTIONS}
            values={field.value || []}
            onChange={field.onChange}
            error={errors.motifs_insatisfaction?.message}
          />
        )}
      />
    </FormSection>
  );
}
