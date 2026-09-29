"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextAreaField, CheckboxGroup } from "@/components/forms/FormSection";
import { RAISONS_REFUS_MENAGES_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section4({ control, register, errors }: Props) {
  return (
    <FormSection title="Raisons du refus">
      <Controller
        name="raisons_refus_menages"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Raisons de refus" options={RAISONS_REFUS_MENAGES_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.raisons_refus_menages?.message} />
        )}
      />
      <TextAreaField label="Exemple concret" register={register("exemple_refus")} error={errors.exemple_refus?.message} />
    </FormSection>
  );
}
