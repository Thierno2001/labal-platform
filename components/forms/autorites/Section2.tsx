"use client";

import { UseFormReturn } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, TextField, BooleanRadio } from "@/components/forms/FormSection";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section2({ form }: SectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Cadre légal & PME" description="Relation avec les PME de collecte">
      <TextField
        label="Nombre de PME conventionnées"
        type="number"
        register={register("nb_pme_conventionnees")}
        error={errors.nb_pme_conventionnees?.message}
      />
      <BooleanRadio
        label="Y a-t-il une convention avec CONAAG ?"
        register={register("convention_conaag")}
        error={errors.convention_conaag?.message}
      />
      <BooleanRadio
        label="Existe-t-il un cahier des charges strict ?"
        register={register("cahier_charges")}
        error={errors.cahier_charges?.message}
      />
    </FormSection>
  );
}
