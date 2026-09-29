"use client";

import { UseFormReturn, Controller, Control } from "react-hook-form";
import { FormSection, RadioGroup, CheckboxGroup } from "@/components/forms/FormSection";
import { OUTIL_ENREGISTREMENT_OPTIONS } from "@/lib/constants";
import { TransitFormData } from "@/lib/schemas/transit.schema";

const DONNEES_CONSIGNEES_OPTIONS = ['PME', 'Matricule', 'Heure', 'Volume estimé'] as const;

export default function Section8({ register, control, errors }: { register: UseFormReturn<TransitFormData>["register"]; control: any; errors: any }) {
  return (
    <FormSection title="Enregistrement des volumes">
      <RadioGroup label="Outil enregistrement" name="outil_enregistrement" options={OUTIL_ENREGISTREMENT_OPTIONS} register={register("outil_enregistrement")} error={errors.outil_enregistrement?.message} />
      <Controller
        name="donnees_consignees"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Données consignées" options={DONNEES_CONSIGNEES_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.donnees_consignees?.message} />
        )}
      />
    </FormSection>
  );
}
