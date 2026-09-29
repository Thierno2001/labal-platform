"use client";

import { UseFormReturn, Controller, Control } from "react-hook-form";
import { FormSection, CheckboxGroup } from "@/components/forms/FormSection";
import { CAUSES_REFUS_ACCES_OPTIONS } from "@/lib/constants";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section7({ control, errors, watch }: { control: any; errors: any; watch: any }) {
  const refusAcces = watch("refus_acces");
  if (refusAcces !== "true") return null;

  return (
    <FormSection title="Causes de refus">
      <Controller
        name="causes_refus"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Causes refus" options={CAUSES_REFUS_ACCES_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.causes_refus?.message} />
        )}
      />
    </FormSection>
  );
}
