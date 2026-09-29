"use client";

import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, BooleanRadio } from "@/components/forms/FormSection";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section5({ register, errors }: Props) {
  return (
    <FormSection title="Zones & Exclusivité">
      <BooleanRadio label="Avez-vous une zone géographique définie ?" name="zone_geographique_definie" register={register("zone_geographique_definie")} error={errors.zone_geographique_definie?.message} />
    </FormSection>
  );
}
