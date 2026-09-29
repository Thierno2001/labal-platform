"use client";

import { UseFormReturn } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, TextField, TextAreaField } from "@/components/forms/FormSection";

export function Section9({ register, errors }: { register: UseFormReturn<MenagesFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Confirmation & Absence">
      <TextField
        label="Preuve de passage"
        name="preuve_passage"
        register={register("preuve_passage")}
        error={errors.preuve_passage?.message}
      />
      <TextAreaField
        label="Procédure en cas d'absence"
        register={register("procedure_absence")}
        error={errors.procedure_absence?.message}
      />
    </FormSection>
  );
}
