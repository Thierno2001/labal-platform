"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextField, RadioGroup, CheckboxGroup } from "@/components/forms/FormSection";
import { LIEU_DECHARGE_OPTIONS, FREQUENCE_SATURATION_TRANSIT_OPTIONS, TEMPS_ATTENTE_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section11({ control, register, errors }: Props) {
  return (
    <FormSection title="Décharge & Zones de Transit">
      <Controller
        name="lieu_decharge"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Où déchargez-vous les déchets ?" options={LIEU_DECHARGE_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.lieu_decharge?.message} />
        )}
      />
      <TextField label="Nombre de voyages par jour au transit" name="voyages_par_jour" type="number" register={register("voyages_par_jour")} error={errors.voyages_par_jour?.message} />
      <RadioGroup label="Fréquence de saturation du transit" name="frequence_saturation_transit" options={FREQUENCE_SATURATION_TRANSIT_OPTIONS} register={register("frequence_saturation_transit")} error={errors.frequence_saturation_transit?.message} />
      <RadioGroup label="Temps d'attente moyen au transit" name="temps_attente_transit" options={TEMPS_ATTENTE_OPTIONS} register={register("temps_attente_transit")} error={errors.temps_attente_transit?.message} />
    </FormSection>
  );
}
