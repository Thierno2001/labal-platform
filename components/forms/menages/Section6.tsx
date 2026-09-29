"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, TextField, CheckboxGroup } from "@/components/forms/FormSection";
import { TYPOLOGIE_DECHETS_OPTIONS } from "@/lib/constants";

export function Section6({ register, control, errors }: { register: UseFormReturn<MenagesFormData>["register"]; control: UseFormReturn<MenagesFormData>["control"]; errors: any }) {
  return (
    <FormSection title="Volume et nature des déchets">
      <TextField
        label="Nombre de sacs par semaine"
        name="nb_sacs_semaine"
        type="number"
        register={register("nb_sacs_semaine")}
        error={errors.nb_sacs_semaine?.message}
      />
      <Controller
        name="typologie_dechets"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            label="Typologie des déchets"
            options={TYPOLOGIE_DECHETS_OPTIONS}
            values={field.value || []}
            onChange={field.onChange}
            error={errors.typologie_dechets?.message}
          />
        )}
      />
    </FormSection>
  );
}
