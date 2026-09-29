"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextField, RadioGroup, CheckboxGroup } from "@/components/forms/FormSection";
import { DIFFICULTES_PME_OPTIONS, OUTIL_NUMERIQUE_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section15({ control, register, errors, watch }: Props) {
  const outilActuel = watch("outil_numerique_actuel");

  return (
    <FormSection title="Difficultés & Outils">
      <Controller
        name="difficultes_rencontrees"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Quelles difficultés rencontrez-vous ?" options={DIFFICULTES_PME_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.difficultes_rencontrees?.message} />
        )}
      />
      <RadioGroup label="Outil numérique actuellement utilisé" name="outil_numerique_actuel" options={OUTIL_NUMERIQUE_OPTIONS} register={register("outil_numerique_actuel")} error={errors.outil_numerique_actuel?.message} />
      {outilActuel === "Logiciel" && (
        <TextField label="Nom du logiciel" name="nom_logiciel" register={register("nom_logiciel")} error={errors.nom_logiciel?.message} />
      )}
    </FormSection>
  );
}
