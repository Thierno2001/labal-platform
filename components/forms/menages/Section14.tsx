"use client";

import { UseFormReturn } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, TextAreaField } from "@/components/forms/FormSection";

export function Section14({ register, errors }: { register: UseFormReturn<MenagesFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Détail des litiges">
      <TextAreaField
        label="Nature du différend"
        register={register("nature_differend")}
        error={errors.nature_differend?.message}
      />
      <TextAreaField
        label="Résolution du litige"
        register={register("resolution_litige")}
        error={errors.resolution_litige?.message}
      />
    </FormSection>
  );
}
