"use client";

import { UseFormReturn } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, TextField, RadioGroup } from "@/components/forms/FormSection";
import { MODE_EVACUATION_OPTIONS } from "@/lib/constants";

export function Section3({ register, errors }: { register: UseFormReturn<MenagesFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Mode d'évacuation actuel">
      <RadioGroup
        label="Mode d'évacuation"
        name="mode_evacuation"
        options={MODE_EVACUATION_OPTIONS}
        register={register("mode_evacuation")}
        error={errors.mode_evacuation?.message}
      />
      <TextField
        label="Motif si non abonné"
        name="motif_non_abonne"
        register={register("motif_non_abonne")}
        error={errors.motif_non_abonne?.message}
      />
      <TextField
        label="Nom de la PME connue (si applicable)"
        name="nom_pme_connue"
        register={register("nom_pme_connue")}
        error={errors.nom_pme_connue?.message}
      />
    </FormSection>
  );
}
