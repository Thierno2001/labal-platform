"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, TextField, CheckboxGroup } from "@/components/forms/FormSection";
import { OBSTACLES_TRANSPORT_OPTIONS } from "@/lib/constants";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section6({ form }: SectionProps) {
  const { register, control, formState: { errors } } = form;

  return (
    <FormSection title="Gestion décharge finale" description="Transport vers la décharge finale">
      <TextField
        label="Mode de gestion vers la décharge"
        register={register("mode_gestion_decharge")}
        error={errors.mode_gestion_decharge?.message}
      />
      <Controller
        name="obstacles_transport"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            label="Obstacles majeurs au transport"
            options={OBSTACLES_TRANSPORT_OPTIONS}
            values={field.value || []}
            onChange={field.onChange}
            error={errors.obstacles_transport?.message}
          />
        )}
      />
    </FormSection>
  );
}
