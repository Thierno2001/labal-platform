"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextField, BooleanRadio, CheckboxGroup } from "@/components/forms/FormSection";
import { MODE_RECRUTEMENT_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section3({ control, register, errors }: Props) {
  return (
    <FormSection title="Recrutement des ménages">
      <Controller
        name="mode_recrutement"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Mode de recrutement" options={MODE_RECRUTEMENT_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.mode_recrutement?.message} />
        )}
      />
      <TextField label="Le ménage a-t-il le libre choix ?" name="choix_libre_menage" register={register("choix_libre_menage")} error={errors.choix_libre_menage?.message} />
      <BooleanRadio label="Vous arrive-t-il de refuser des ménages ?" name="refus_menages" register={register("refus_menages")} error={errors.refus_menages?.message} />
    </FormSection>
  );
}
