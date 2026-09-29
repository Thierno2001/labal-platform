"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, TextField, CheckboxGroup } from "@/components/forms/FormSection";
import { CAUSES_POINTS_NOIRS_OPTIONS } from "@/lib/constants";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section4({ form }: SectionProps) {
  const { register, control, formState: { errors } } = form;

  return (
    <FormSection title="Décharges sauvages" description="Gestion des points noirs">
      <TextField
        label="Nombre de points noirs estimés"
        type="number"
        register={register("nb_points_noirs")}
        error={errors.nb_points_noirs?.message}
      />
      <Controller
        name="causes_points_noirs"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            label="Causes des points noirs"
            options={CAUSES_POINTS_NOIRS_OPTIONS}
            values={field.value || []}
            onChange={field.onChange}
            error={errors.causes_points_noirs?.message}
          />
        )}
      />
    </FormSection>
  );
}
