"use client";

import { UseFormReturn } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, TextField, TextAreaField, BooleanRadio } from "@/components/forms/FormSection";

export function Section16({ register, errors }: { register: UseFormReturn<MenagesFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Intérêt Lâbal">
      <BooleanRadio
        label="Prêt à installer l'application Lâbal"
        name="pret_installer_labal"
        register={register("pret_installer_labal")}
        error={errors.pret_installer_labal?.message}
      />
      <TextField
        label="Téléphone pour groupe de test"
        name="telephone_groupe_test"
        register={register("telephone_groupe_test")}
        error={errors.telephone_groupe_test?.message}
      />
      <TextAreaField
        label="Suggestions d'amélioration"
        register={register("suggestions_amelioration")}
        error={errors.suggestions_amelioration?.message}
      />
    </FormSection>
  );
}
