"use client";

import { UseFormReturn } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, TextField, RadioGroup } from "@/components/forms/FormSection";
import { COMMUNES, ENTITE_AUTORITE_OPTIONS } from "@/lib/constants";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section1({ form }: SectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Identification de l'autorité" description="Informations générales sur le répondant">
      <TextField
        label="Nom du répondant"
        register={register("nom_repondant")}
        error={errors.nom_repondant?.message}
        required
      />
      <TextField
        label="Titre ou fonction"
        register={register("titre_fonction")}
        error={errors.titre_fonction?.message}
      />
      <RadioGroup
        label="Entité"
        options={ENTITE_AUTORITE_OPTIONS}
        register={register("entite")}
        error={errors.entite?.message}
      />
      <RadioGroup
        label="Commune"
        options={COMMUNES}
        register={register("commune")}
        error={errors.commune?.message}
      />
    </FormSection>
  );
}
