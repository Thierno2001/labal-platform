"use client";

import { UseFormReturn } from "react-hook-form";
import { AutoritesFormData } from "@/lib/schemas/autorites.schema";
import { FormSection, TextAreaField, BooleanRadio } from "@/components/forms/FormSection";

interface SectionProps {
  form: UseFormReturn<AutoritesFormData>;
}

export default function Section11({ form }: SectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <FormSection title="Transparence financière" description="Digitalisation des paiements">
      <TextAreaField
        label="Avis sur la suppression des paiements en liquide"
        register={register("avis_suppression_liquide")}
        error={errors.avis_suppression_liquide?.message}
      />
      <BooleanRadio
        label="Volonté de rendre le Mobile Money obligatoire ?"
        register={register("volonte_mobile_money_obligatoire")}
        error={errors.volonte_mobile_money_obligatoire?.message}
      />
    </FormSection>
  );
}
