"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, RadioGroup, CheckboxGroup } from "@/components/forms/FormSection";
import { MODALITE_ZONE_OPTIONS, CONFLITS_TERRITORIAUX_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section6({ control, register, errors }: Props) {
  return (
    <FormSection title="Délimitation de la zone">
      <Controller
        name="modalite_definition_zone"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Modalités de délimitation" options={MODALITE_ZONE_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.modalite_definition_zone?.message} />
        )}
      />
      <RadioGroup label="Conflits territoriaux avec d'autres PME ?" name="conflits_territoriaux" options={CONFLITS_TERRITORIAUX_OPTIONS} register={register("conflits_territoriaux")} error={errors.conflits_territoriaux?.message} />
    </FormSection>
  );
}
