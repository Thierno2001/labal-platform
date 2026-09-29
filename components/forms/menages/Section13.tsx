"use client";

import { UseFormReturn } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, RadioGroup, BooleanRadio } from "@/components/forms/FormSection";
import { MODES_PAIEMENT_OPTIONS } from "@/lib/constants";

export function Section13({ register, errors }: { register: UseFormReturn<MenagesFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Pratiques de paiement">
      <RadioGroup
        label="Mode de paiement"
        name="mode_paiement"
        options={MODES_PAIEMENT_OPTIONS}
        register={register("mode_paiement")}
        error={errors.mode_paiement?.message}
      />
      <BooleanRadio
        label="Recevez-vous un reçu papier ?"
        name="recu_papier"
        register={register("recu_papier")}
        error={errors.recu_papier?.message}
      />
      <BooleanRadio
        label="Avez-vous eu un conflit de paiement ?"
        name="conflit_paiement"
        register={register("conflit_paiement")}
        error={errors.conflit_paiement?.message}
      />
    </FormSection>
  );
}
