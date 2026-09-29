"use client";

import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextField, RadioGroup } from "@/components/forms/FormSection";
import { FREQUENCE_PAIE_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section14({ register, errors }: Props) {
  return (
    <FormSection title="Rémunération des collecteurs">
      <TextField label="Comment les collecteurs sont-ils rémunérés (fixe, %...) ?" name="remuneration_collecteurs" register={register("remuneration_collecteurs")} error={errors.remuneration_collecteurs?.message} />
      <RadioGroup label="Fréquence de paie" name="frequence_paie_collecteurs" options={FREQUENCE_PAIE_OPTIONS} register={register("frequence_paie_collecteurs")} error={errors.frequence_paie_collecteurs?.message} />
      <TextField label="Comment suivez-vous la comptabilité liée aux collecteurs ?" name="suivi_comptable_collecteurs" register={register("suivi_comptable_collecteurs")} error={errors.suivi_comptable_collecteurs?.message} />
    </FormSection>
  );
}
