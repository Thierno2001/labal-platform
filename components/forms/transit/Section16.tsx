"use client";

import { UseFormReturn } from "react-hook-form";
import { FormSection, TextField, BooleanRadio, TextAreaField } from "@/components/forms/FormSection";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section16({ register, errors }: { register: UseFormReturn<TransitFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Attentes Lâbal">
      <BooleanRadio label="Bouton alerte SOS" name="bouton_alerte_sos" register={register("bouton_alerte_sos")} error={errors.bouton_alerte_sos?.message} />
      <BooleanRadio label="Suivi GPS camions" name="suivi_gps_camions" register={register("suivi_gps_camions")} error={errors.suivi_gps_camions?.message} />
      <TextField label="Contact responsable" name="contact_responsable" register={register("contact_responsable")} error={errors.contact_responsable?.message} />
      <TextAreaField label="Suggestions aménagement" register={register("suggestions_amenagement")} error={errors.suggestions_amenagement?.message} />
    </FormSection>
  );
}
