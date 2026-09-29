"use client";

import { UseFormReturn } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, BooleanRadio } from "@/components/forms/FormSection";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section9({ form }: SectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Répression & Conformité" description="Contrôle des pratiques">
      <BooleanRadio
        label="Effectuez-vous des contrôles inopinés ?"
        register={register("controles_inopines")}
        error={errors.controles_inopines?.message}
      />
      <BooleanRadio
        label="Y a-t-il eu des sanctions récentes appliquées ?"
        register={register("sanctions_recentes")}
        error={errors.sanctions_recentes?.message}
      />
    </FormSection>
  );
}
