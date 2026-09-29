"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextField, RadioGroup, BooleanRadio, CheckboxGroup } from "@/components/forms/FormSection";
import { COMMUNES, NB_MENAGES_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section2({ control, register, errors, watch }: Props) {
  const dessertCommerces = watch("dessert_commerces");
  
  return (
    <FormSection title="Couverture géographique">
      <Controller
        name="communes"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Communes" options={COMMUNES} values={field.value || []} onChange={field.onChange} error={errors.communes?.message} />
        )}
      />
      <TextField label="Quartiers" name="quartiers" register={register("quartiers")} required error={errors.quartiers?.message} />
      <RadioGroup label="Nombre de ménages desservis" name="nb_menages_desservis" options={NB_MENAGES_OPTIONS} register={register("nb_menages_desservis")} error={errors.nb_menages_desservis?.message} />
      <BooleanRadio label="Dessertez-vous des commerces ?" name="dessert_commerces" register={register("dessert_commerces")} error={errors.dessert_commerces?.message} />
      {dessertCommerces === "true" && (
        <TextField label="Nombre de commerces" name="nb_commerces" type="number" register={register("nb_commerces")} error={errors.nb_commerces?.message} />
      )}
    </FormSection>
  );
}
