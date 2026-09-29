"use client";

import { UseFormReturn } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, TextField, BooleanRadio } from "@/components/forms/FormSection";

export function Section4({ register, errors }: { register: UseFormReturn<MenagesFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Choix et adhésion">
      <TextField
        label="Libre choix du collecteur"
        name="libre_choix_collecteur"
        register={register("libre_choix_collecteur")}
        error={errors.libre_choix_collecteur?.message}
      />
      <BooleanRadio
        label="Avez-vous changé de collecteur ?"
        name="a_change_collecteur"
        register={register("a_change_collecteur")}
        error={errors.a_change_collecteur?.message}
      />
    </FormSection>
  );
}
