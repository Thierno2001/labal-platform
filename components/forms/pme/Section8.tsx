"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, CheckboxGroup } from "@/components/forms/FormSection";
import { RAISONS_REFUS_COLLECTEUR_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section8({ control, errors }: Props) {
  return (
    <FormSection title="Motifs de refus collecteur">
      <Controller
        name="raisons_refus_collecteur"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Raisons de refus du collecteur" options={RAISONS_REFUS_COLLECTEUR_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.raisons_refus_collecteur?.message} />
        )}
      />
    </FormSection>
  );
}
