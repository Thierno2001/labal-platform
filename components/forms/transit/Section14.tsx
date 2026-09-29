"use client";

import { UseFormReturn, Controller, Control } from "react-hook-form";
import { FormSection, TextAreaField, CheckboxGroup } from "@/components/forms/FormSection";
import { DOTATION_EPI_OPTIONS } from "@/lib/constants";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section14({ register, control, errors }: { register: UseFormReturn<TransitFormData>["register"]; control: any; errors: any }) {
  return (
    <FormSection title="Hygiène & Protection">
      <Controller
        name="dotation_epi"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Dotation EPI" options={DOTATION_EPI_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.dotation_epi?.message} />
        )}
      />
      <TextAreaField label="Nuisances vecteurs" register={register("nuisances_vecteurs")} error={errors.nuisances_vecteurs?.message} />
    </FormSection>
  );
}
