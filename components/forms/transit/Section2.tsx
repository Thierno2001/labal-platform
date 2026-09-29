"use client";

import { UseFormReturn } from "react-hook-form";
import { FormSection, TextField, RadioGroup, BooleanRadio } from "@/components/forms/FormSection";
import { COMMUNES } from "@/lib/constants";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section2({ register, errors }: { register: UseFormReturn<TransitFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Emplacement & Caractéristiques">
      <RadioGroup label="Commune" name="commune" options={COMMUNES} register={register("commune")} error={errors.commune?.message} />
      <TextField label="Quartier/repère" name="quartier_repere" register={register("quartier_repere")} error={errors.quartier_repere?.message} />
      <TextField label="Capacité caissons" name="capacite_caissons" type="number" register={register("capacite_caissons")} error={errors.capacite_caissons?.message} />
      <BooleanRadio label="Clôture/dalle" name="cloture_dalle" register={register("cloture_dalle")} error={errors.cloture_dalle?.message} />
    </FormSection>
  );
}
