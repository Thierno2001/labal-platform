"use client";

import { UseFormReturn, Controller, Control } from "react-hook-form";
import { FormSection, TextField, CheckboxGroup } from "@/components/forms/FormSection";
import { CAUSES_BLOCAGE_OPTIONS } from "@/lib/constants";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section11({ register, control, errors }: { register: UseFormReturn<TransitFormData>["register"]; control: any; errors: any }) {
  return (
    <FormSection title="Facteurs de blocage">
      <Controller
        name="causes_blocage"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Causes blocage" options={CAUSES_BLOCAGE_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.causes_blocage?.message} />
        )}
      />
      <TextField label="Durée max blocage" name="duree_max_blocage" register={register("duree_max_blocage")} error={errors.duree_max_blocage?.message} />
    </FormSection>
  );
}
