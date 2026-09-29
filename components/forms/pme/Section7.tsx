"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextField, RadioGroup, BooleanRadio, CheckboxGroup } from "@/components/forms/FormSection";
import { NB_COLLECTEURS_OPTIONS, ENGINS_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section7({ control, register, errors }: Props) {
  return (
    <FormSection title="Organisation des collecteurs">
      <RadioGroup label="Nombre de collecteurs" name="nb_collecteurs" options={NB_COLLECTEURS_OPTIONS} register={register("nb_collecteurs")} error={errors.nb_collecteurs?.message} />
      <RadioGroup label="Les collecteurs travaillent-ils en exclusivité ?" name="exclusivite_collecteurs" options={['Oui', 'Non']} register={register("exclusivite_collecteurs")} error={errors.exclusivite_collecteurs?.message} />
      <Controller
        name="engins_utilises"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Engins utilisés" options={ENGINS_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.engins_utilises?.message} />
        )}
      />
      <TextField label="Qui décide des affectations ?" name="decision_affectation" register={register("decision_affectation")} error={errors.decision_affectation?.message} />
      <BooleanRadio label="Un collecteur peut-il refuser d'aller à un endroit ?" name="refus_collecteur" register={register("refus_collecteur")} error={errors.refus_collecteur?.message} />
    </FormSection>
  );
}
