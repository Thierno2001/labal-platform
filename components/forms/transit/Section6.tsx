"use client";

import { UseFormReturn } from "react-hook-form";
import { FormSection, BooleanRadio } from "@/components/forms/FormSection";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section6({ register, errors }: { register: UseFormReturn<TransitFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Régulation de l'accès">
      <BooleanRadio label="Accès limité agréés" name="acces_limite_agrees" register={register("acces_limite_agrees")} error={errors.acces_limite_agrees?.message} />
      <BooleanRadio label="Redevance déversement" name="redevance_deversement" register={register("redevance_deversement")} error={errors.redevance_deversement?.message} />
      <BooleanRadio label="Refus accès" name="refus_acces" register={register("refus_acces")} error={errors.refus_acces?.message} />
    </FormSection>
  );
}
