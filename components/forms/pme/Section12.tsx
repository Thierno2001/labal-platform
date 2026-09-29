"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextAreaField, BooleanRadio, CheckboxGroup } from "@/components/forms/FormSection";
import { INITIATIVE_ANNULATION_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section12({ control, register, errors }: Props) {
  return (
    <FormSection title="Incidents & Litiges">
      <BooleanRadio label="Avez-vous un système pour suivre les incidents ?" name="systeme_incidents" register={register("systeme_incidents")} error={errors.systeme_incidents?.message} />
      <Controller
        name="initiative_annulation"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Qui prend l'initiative d'une annulation ?" options={INITIATIVE_ANNULATION_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.initiative_annulation?.message} />
        )}
      />
      <TextAreaField label="Procédure en cas d'annulation" register={register("procedure_annulation")} error={errors.procedure_annulation?.message} />
    </FormSection>
  );
}
