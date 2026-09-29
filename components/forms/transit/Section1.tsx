"use client";

import { UseFormReturn } from "react-hook-form";
import { FormSection, TextField, RadioGroup } from "@/components/forms/FormSection";
import { STATUT_SITE_OPTIONS, ENTITE_GESTIONNAIRE_OPTIONS } from "@/lib/constants";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section1({ register, errors }: { register: UseFormReturn<TransitFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Identification du site">
      <TextField label="Email responsable" name="email_responsable" type="email" register={register("email_responsable")} error={errors.email_responsable?.message} />
      <TextField label="Nom site" name="nom_site" required register={register("nom_site")} error={errors.nom_site?.message} />
      <RadioGroup label="Statut site" name="statut_site" options={STATUT_SITE_OPTIONS} register={register("statut_site")} error={errors.statut_site?.message} />
      <RadioGroup label="Entité gestionnaire" name="entite_gestionnaire" options={ENTITE_GESTIONNAIRE_OPTIONS} register={register("entite_gestionnaire")} error={errors.entite_gestionnaire?.message} />
    </FormSection>
  );
}
