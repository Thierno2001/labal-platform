"use client";

import { UseFormReturn } from "react-hook-form";
import { FormSection, RadioGroup, TextAreaField } from "@/components/forms/FormSection";
import { FREQUENCE_SATURATION_TRANSIT_OPTIONS } from "@/lib/constants";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section10({ register, errors }: { register: UseFormReturn<TransitFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Gravité de la saturation">
      <RadioGroup label="Fréquence saturation" name="frequence_saturation" options={FREQUENCE_SATURATION_TRANSIT_OPTIONS} register={register("frequence_saturation")} error={errors.frequence_saturation?.message} />
      <TextAreaField label="Conséquences environnementales" register={register("consequences_environnementales")} error={errors.consequences_environnementales?.message} />
    </FormSection>
  );
}
