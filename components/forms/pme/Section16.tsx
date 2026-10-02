"use client";

import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FormSection, TextField, RadioGroup, BooleanRadio, CheckboxGroup } from "@/components/forms/FormSection";
import { INTERET_LABAL_OPTIONS, MODULES_PRIORITAIRES_OPTIONS } from "@/lib/constants";
import { PmeFormData } from "@/lib/schemas/pme.schema";

interface Props {
  control: any;
  errors: FieldErrors<PmeFormData>;
  watch: UseFormWatch<PmeFormData>;
  register: UseFormRegister<PmeFormData>;
  setValue: UseFormSetValue<PmeFormData>;
}

export function Section16({ control, register, errors }: Props) {
  return (
    <FormSection title="Attentes Labal">
      <RadioGroup label="Seriez-vous intéressé par Labal ?" name="interet_labal" options={INTERET_LABAL_OPTIONS} register={register("interet_labal")} error={errors.interet_labal?.message} />
      <Controller
        name="modules_prioritaires"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Quels modules seraient prioritaires pour vous ?" options={MODULES_PRIORITAIRES_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.modules_prioritaires?.message} />
        )}
      />
      <TextField label="Quelle est la capacité de vos collecteurs à utiliser un smartphone ?" name="capacite_smartphone_collecteurs" register={register("capacite_smartphone_collecteurs")} error={errors.capacite_smartphone_collecteurs?.message} />
      
      <div className="mt-6 space-y-4">
        <h4 className="font-semibold text-labal-deep border-b border-labal-lime pb-2">Informations de contact</h4>
        <TextField label="Nom du contact" name="nom_contact" register={register("nom_contact")} required error={errors.nom_contact?.message} />
        <TextField label="Téléphone" name="telephone_contact" type="tel" register={register("telephone_contact")} required error={errors.telephone_contact?.message} />
        <BooleanRadio label="Acceptez-vous d'être recontacté pour tester Labal ?" name="accord_recontact" register={register("accord_recontact")} error={errors.accord_recontact?.message} />
      </div>
    </FormSection>
  );
}
