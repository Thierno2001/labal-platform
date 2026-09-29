"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, BooleanRadio, CheckboxGroup } from "@/components/forms/FormSection";
import { RISQUES_SANITAIRES_OPTIONS } from "@/lib/constants";

export function Section11({ register, control, errors }: { register: UseFormReturn<MenagesFormData>["register"]; control: UseFormReturn<MenagesFormData>["control"]; errors: any }) {
  return (
    <FormSection title="Sensibilisation sanitaire">
      <Controller
        name="connaissance_risques"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            label="Connaissance des risques sanitaires"
            options={RISQUES_SANITAIRES_OPTIONS}
            values={field.value || []}
            onChange={field.onChange}
            error={errors.connaissance_risques?.message}
          />
        )}
      />
      <BooleanRadio
        label="Prêt pour des modules vidéo de sensibilisation"
        name="pret_modules_video"
        register={register("pret_modules_video")}
        error={errors.pret_modules_video?.message}
      />
    </FormSection>
  );
}
