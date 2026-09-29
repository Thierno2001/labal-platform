"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, BooleanRadio, CheckboxGroup } from "@/components/forms/FormSection";
import { FACTEURS_TRI_OPTIONS } from "@/lib/constants";

export function Section10({ register, control, errors }: { register: UseFormReturn<MenagesFormData>["register"]; control: UseFormReturn<MenagesFormData>["control"]; errors: any }) {
  return (
    <FormSection title="Pratiques de tri">
      <BooleanRadio
        label="Tri actuel pratiqué"
        name="tri_actuel"
        register={register("tri_actuel")}
        error={errors.tri_actuel?.message}
      />
      <Controller
        name="facteurs_stimulants"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            label="Facteurs stimulants pour le tri"
            options={FACTEURS_TRI_OPTIONS}
            values={field.value || []}
            onChange={field.onChange}
            error={errors.facteurs_stimulants?.message}
          />
        )}
      />
    </FormSection>
  );
}
