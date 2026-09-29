"use client";

import { UseFormReturn } from "react-hook-form";
import { FormSection, TextField } from "@/components/forms/FormSection";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section12({ register, errors }: { register: UseFormReturn<TransitFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Coordination institutionnelle">
      <TextField label="Canal alerte mairie" name="canal_alerte_mairie" register={register("canal_alerte_mairie")} error={errors.canal_alerte_mairie?.message} />
      <TextField label="Délai réaction communal" name="delai_reaction_communal" register={register("delai_reaction_communal")} error={errors.delai_reaction_communal?.message} />
    </FormSection>
  );
}
