"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, TextField, CheckboxGroup } from "@/components/forms/FormSection";
import { SOURCES_FINANCEMENT_OPTIONS } from "@/lib/constants";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section7({ form }: SectionProps) {
  const { register, control, formState: { errors } } = form;

  return (
    <FormSection title="Équilibre financier" description="Financement des opérations">
      <Controller
        name="sources_financement"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            label="Sources de financement"
            options={SOURCES_FINANCEMENT_OPTIONS}
            values={field.value || []}
            onChange={field.onChange}
            error={errors.sources_financement?.message}
          />
        )}
      />
      <TextField
        label="Taux de recouvrement des redevances estimé"
        register={register("recouvrement_redevances")}
        error={errors.recouvrement_redevances?.message}
      />
    </FormSection>
  );
}
