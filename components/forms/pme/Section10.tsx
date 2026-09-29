"use client";

import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextField, TextAreaField, RadioGroup } from "@/components/forms/FormSection";
import { CONFIRMATION_COLLECTE_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section10({ register, errors }: Props) {
  return (
    <FormSection title="Déroulement d'une tournée">
      <TextAreaField label="Étapes d'une collecte type" register={register("etapes_collecte")} error={errors.etapes_collecte?.message} />
      <TextField label="Durée moyenne d'une tournée (heures)" name="duree_tournee_heures" type="number" register={register("duree_tournee_heures")} error={errors.duree_tournee_heures?.message} />
      <RadioGroup label="Confirmation de collecte" name="confirmation_collecte" options={CONFIRMATION_COLLECTE_OPTIONS} register={register("confirmation_collecte")} error={errors.confirmation_collecte?.message} />
      <TextAreaField label="Comment gérez-vous les imprévus (panne, absence...) ?" register={register("gestion_imprevus")} error={errors.gestion_imprevus?.message} />
    </FormSection>
  );
}
