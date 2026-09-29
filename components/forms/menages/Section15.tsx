"use client";

import { UseFormReturn } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, TextField, BooleanRadio } from "@/components/forms/FormSection";

export function Section15({ register, errors }: { register: UseFormReturn<MenagesFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Usage numérique">
      <BooleanRadio
        label="Possession de smartphone"
        name="possession_smartphone"
        register={register("possession_smartphone")}
        error={errors.possession_smartphone?.message}
      />
      <TextField
        label="Fréquence d'utilisation Mobile Money"
        name="frequence_mobile_money"
        register={register("frequence_mobile_money")}
        error={errors.frequence_mobile_money?.message}
      />
      <TextField
        label="Applications favorites"
        name="applications_favorites"
        register={register("applications_favorites")}
        error={errors.applications_favorites?.message}
      />
    </FormSection>
  );
}
