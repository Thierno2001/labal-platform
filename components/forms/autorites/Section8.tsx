"use client";

import { UseFormReturn } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, TextField } from "@/components/forms/FormSection";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section8({ form }: SectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Signalements citoyens" description="Gestion des réclamations">
      <TextField
        label="Canal principal des réclamations"
        register={register("canal_reclamations")}
        error={errors.canal_reclamations?.message}
      />
      <TextField
        label="Délai moyen de résorption d'une plainte"
        register={register("delai_resorption")}
        error={errors.delai_resorption?.message}
      />
    </FormSection>
  );
}
