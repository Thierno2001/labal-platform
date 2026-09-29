"use client";

import { UseFormReturn } from "react-hook-form";
import { FormSection, TextField, BooleanRadio } from "@/components/forms/FormSection";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section15({ register, errors }: { register: UseFormReturn<TransitFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Environnement numérique">
      <BooleanRadio label="Local sécurisé/courant" name="local_securise_courant" register={register("local_securise_courant")} error={errors.local_securise_courant?.message} />
      <TextField label="Qualité réseau 4G" name="qualite_reseau_4g" register={register("qualite_reseau_4g")} error={errors.qualite_reseau_4g?.message} />
      <BooleanRadio label="Smartphone fonction" name="smartphone_fonction" register={register("smartphone_fonction")} error={errors.smartphone_fonction?.message} />
    </FormSection>
  );
}
