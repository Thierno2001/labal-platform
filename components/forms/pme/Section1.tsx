"use client";

import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextField, RadioGroup, SelectField } from "@/components/forms/FormSection";
import { AFFILIATION_CONAAG_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section1({ register, errors }: Props) {
  return (
    <FormSection title="Adresse & Identification">
      <TextField label="Email" name="email" type="email" register={register("email")} error={errors.email?.message} />
      <TextField label="Nom de la structure" name="nom_structure" register={register("nom_structure")} required error={errors.nom_structure?.message} />
      <RadioGroup label="Affiliation CONAAG" name="affilie_conaag" options={AFFILIATION_CONAAG_OPTIONS} register={register("affilie_conaag")} error={errors.affilie_conaag?.message} />
      <SelectField label="Type de structure" options={['GIE', 'Sarl', 'Association', 'Informel']} register={register("type_structure")} error={errors.type_structure?.message} />
      <TextField label="N° d'agrément" name="num_agrement" register={register("num_agrement")} error={errors.num_agrement?.message} />
      <TextField label="Année de création" name="annee_creation" register={register("annee_creation")} error={errors.annee_creation?.message} />
    </FormSection>
  );
}
