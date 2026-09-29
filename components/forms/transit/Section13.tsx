"use client";

import { UseFormReturn } from "react-hook-form";
import { FormSection, TextField, BooleanRadio } from "@/components/forms/FormSection";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section13({ register, errors }: { register: UseFormReturn<TransitFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Suivi financier">
      <TextField label="Encaissements espèces vs mobile" name="encaissements_especes_vs_mobile" register={register("encaissements_especes_vs_mobile")} error={errors.encaissements_especes_vs_mobile?.message} />
      <BooleanRadio label="Litiges caisse" name="litiges_caisse" register={register("litiges_caisse")} error={errors.litiges_caisse?.message} />
    </FormSection>
  );
}
