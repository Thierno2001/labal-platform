"use client";

import { UseFormReturn } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, TextField } from "@/components/forms/FormSection";

export function Section12({ register, errors }: { register: UseFormReturn<MenagesFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Budget assainissement">
      <TextField
        label="Montant mensuel payé (GNF)"
        name="montant_mensuel_gnf"
        type="number"
        register={register("montant_mensuel_gnf")}
        error={errors.montant_mensuel_gnf?.message}
      />
      <TextField
        label="Perception du rapport qualité/prix"
        name="perception_qualite_prix"
        register={register("perception_qualite_prix")}
        error={errors.perception_qualite_prix?.message}
      />
    </FormSection>
  );
}
