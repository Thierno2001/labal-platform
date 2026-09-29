"use client";

import { UseFormReturn } from "react-hook-form";
import { FormSection, RadioGroup, TextField } from "@/components/forms/FormSection";
import { FREQUENCE_ROTATION_OPTIONS } from "@/lib/constants";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section9({ register, errors }: { register: UseFormReturn<TransitFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Transfert décharge finale">
      <RadioGroup label="Fréquence rotation" name="frequence_rotation" options={FREQUENCE_ROTATION_OPTIONS} register={register("frequence_rotation")} error={errors.frequence_rotation?.message} />
      <TextField label="Prestataire transporteur" name="prestataire_transporteur" register={register("prestataire_transporteur")} error={errors.prestataire_transporteur?.message} />
    </FormSection>
  );
}
