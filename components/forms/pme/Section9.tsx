"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextField, RadioGroup, CheckboxGroup } from "@/components/forms/FormSection";
import { CANAUX_DEMANDES_OPTIONS, TYPE_PRESTATION_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section9({ control, register, errors }: Props) {
  return (
    <FormSection title="Gestion des demandes">
      <Controller
        name="canaux_demandes"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Canaux de réception des demandes" options={CANAUX_DEMANDES_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.canaux_demandes?.message} />
        )}
      />
      <RadioGroup label="Type de prestation" name="type_prestation" options={TYPE_PRESTATION_OPTIONS} register={register("type_prestation")} error={errors.type_prestation?.message} />
      <TextField label="Comment se fixe l'horaire de passage ?" name="fixation_horaire" register={register("fixation_horaire")} error={errors.fixation_horaire?.message} />
      <RadioGroup label="Y a-t-il souvent des demandes en attente ?" name="demandes_en_attente" options={['Oui', 'Non']} register={register("demandes_en_attente")} error={errors.demandes_en_attente?.message} />
    </FormSection>
  );
}
