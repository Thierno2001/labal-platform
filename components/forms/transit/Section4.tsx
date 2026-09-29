"use client";

import { UseFormReturn, Controller, Control } from "react-hook-form";
import { FormSection, TextField, CheckboxGroup } from "@/components/forms/FormSection";
import { FILIERES_TRI_OPTIONS } from "@/lib/constants";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section4({ register, control, errors, watch }: { register: UseFormReturn<TransitFormData>["register"]; control: any; errors: any; watch: any }) {
  const triSurPlace = watch("tri_sur_place");
  if (triSurPlace !== "true") return null;

  return (
    <FormSection title="Tri & Valorisation">
      <Controller
        name="filieres_triees"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Filières triées" options={FILIERES_TRI_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.filieres_triees?.message} />
        )}
      />
      <TextField label="Nb trieurs" name="nb_trieurs" type="number" register={register("nb_trieurs")} error={errors.nb_trieurs?.message} />
      <TextField label="Acheteurs" name="acheteurs" register={register("acheteurs")} error={errors.acheteurs?.message} />
    </FormSection>
  );
}
