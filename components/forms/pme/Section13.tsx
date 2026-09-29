"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextField, TextAreaField, RadioGroup, CheckboxGroup } from "@/components/forms/FormSection";
import { MODES_PAIEMENT_OPTIONS, MOMENT_PAIEMENT_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section13({ control, register, errors }: Props) {
  return (
    <FormSection title="Tarification & Paiements">
      <Controller
        name="modes_paiement_recus"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Modes de paiement reçus" options={MODES_PAIEMENT_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.modes_paiement_recus?.message} />
        )}
      />
      <TextField label="Part estimée Espèces vs Mobile Money" name="part_especes_vs_mobile" register={register("part_especes_vs_mobile")} error={errors.part_especes_vs_mobile?.message} />
      <RadioGroup label="Moment du paiement" name="moment_paiement" options={MOMENT_PAIEMENT_OPTIONS} register={register("moment_paiement")} error={errors.moment_paiement?.message} />
      <TextAreaField label="Quelle est votre politique en cas d'impayé ?" register={register("politique_impayes")} error={errors.politique_impayes?.message} />
    </FormSection>
  );
}
