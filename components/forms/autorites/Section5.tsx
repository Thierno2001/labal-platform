"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, BooleanRadio, CheckboxGroup } from "@/components/forms/FormSection";
import { FLOTTE_COMMUNALE_OPTIONS } from "@/lib/constants";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section5({ form }: SectionProps) {
  const { register, control, formState: { errors } } = form;

  return (
    <FormSection title="Équipements de transfert" description="Moyens logistiques de la commune">
      <Controller
        name="flotte_communale"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            label="Flotte communale disponible"
            options={FLOTTE_COMMUNALE_OPTIONS}
            values={field.value || []}
            onChange={field.onChange}
            error={errors.flotte_communale?.message}
          />
        )}
      />
      <BooleanRadio
        label="Capacité pour 4 transferts par jour ?"
        register={register("capacite_4_transferts")}
        error={errors.capacite_4_transferts?.message}
      />
    </FormSection>
  );
}
