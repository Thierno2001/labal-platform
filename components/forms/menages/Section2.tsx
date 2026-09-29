"use client";

import { UseFormReturn } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, TextField, TextAreaField, RadioGroup } from "@/components/forms/FormSection";
import { COMMUNES, ACCESSIBILITE_OPTIONS } from "@/lib/constants";

export function Section2({ register, errors }: { register: UseFormReturn<MenagesFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Localisation géographique">
      <RadioGroup
        label="Commune"
        name="commune"
        options={COMMUNES}
        register={register("commune")}
        error={errors.commune?.message}
      />
      <TextField
        label="Quartier"
        name="quartier"
        register={register("quartier")}
        error={errors.quartier?.message}
      />
      <TextAreaField
        label="Repères visuels"
        register={register("reperes_visuels")}
        error={errors.reperes_visuels?.message}
      />
      <RadioGroup
        label="Accessibilité"
        name="accessibilite"
        options={ACCESSIBILITE_OPTIONS}
        register={register("accessibilite")}
        error={errors.accessibilite?.message}
      />
    </FormSection>
  );
}
