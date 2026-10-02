"use client";

import { UseFormReturn } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, TextField, TextAreaField, BooleanRadio } from "@/components/forms/FormSection";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section16({ form }: SectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Engagement pilote Labal" description="Participation au projet pilote">
      <BooleanRadio
        label="Un point focal est-il désigné ?"
        register={register("point_focal_designe")}
        error={errors.point_focal_designe?.message}
      />
      <TextField
        label="Coordonnées du point focal"
        register={register("coordonnees_point_focal")}
        error={errors.coordonnees_point_focal?.message}
      />
      <TextAreaField
        label="Recommandations ou suggestions"
        register={register("recommandations")}
        error={errors.recommandations?.message}
      />
    </FormSection>
  );
}
