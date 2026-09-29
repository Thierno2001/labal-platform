"use client";

import { UseFormReturn } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, BooleanRadio } from "@/components/forms/FormSection";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section14({ form }: SectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Équipement technique" description="Matériel informatique disponible">
      <BooleanRadio
        label="Ordinateurs disponibles à la mairie ?"
        register={register("ordinateurs_mairie")}
        error={errors.ordinateurs_mairie?.message}
      />
      <BooleanRadio
        label="Smartphones pour les agents de terrain ?"
        register={register("smartphone_agents_terrain")}
        error={errors.smartphone_agents_terrain?.message}
      />
    </FormSection>
  );
}
