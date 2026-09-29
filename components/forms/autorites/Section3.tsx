"use client";

import { UseFormReturn } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, BooleanRadio } from "@/components/forms/FormSection";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section3({ form }: SectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Organisation spatiale" description="Gestion des zones de collecte">
      <BooleanRadio
        label="Le zonage est-il exclusif ?"
        register={register("zonage_exclusif")}
        error={errors.zonage_exclusif?.message}
      />
      <BooleanRadio
        label="Disponibilité d'un SIG (Système d'Information Géographique) ?"
        register={register("disponibilite_sig")}
        error={errors.disponibilite_sig?.message}
      />
    </FormSection>
  );
}
