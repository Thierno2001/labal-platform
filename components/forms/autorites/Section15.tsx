"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, CheckboxGroup } from "@/components/forms/FormSection";
import { BESOINS_DASHBOARD_OPTIONS } from "@/lib/constants";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section15({ form }: SectionProps) {
  const { control, formState: { errors } } = form;

  return (
    <FormSection title="Attentes Dashboard Lâbal" description="Fonctionnalités souhaitées">
      <Controller
        name="besoins_dashboard"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            label="Besoins prioritaires pour le tableau de bord"
            options={BESOINS_DASHBOARD_OPTIONS}
            values={field.value || []}
            onChange={field.onChange}
            error={errors.besoins_dashboard?.message}
          />
        )}
      />
    </FormSection>
  );
}
