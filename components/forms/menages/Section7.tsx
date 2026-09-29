"use client";

import { UseFormReturn } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, TextField, BooleanRadio } from "@/components/forms/FormSection";

export function Section7({ register, errors }: { register: UseFormReturn<MenagesFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Commande & Demande">
      <TextField
        label="Comment alertez-vous le ramassage actuellement ?"
        name="alerte_ramassage_actuelle"
        register={register("alerte_ramassage_actuelle")}
        error={errors.alerte_ramassage_actuelle?.message}
      />
      <BooleanRadio
        label="Bacs débordants plus de 7 jours ?"
        name="bacs_debordants_7_jours"
        register={register("bacs_debordants_7_jours")}
        error={errors.bacs_debordants_7_jours?.message}
      />
      <BooleanRadio
        label="Intérêt pour un bouton de commande"
        name="interet_bouton_commande"
        register={register("interet_bouton_commande")}
        error={errors.interet_bouton_commande?.message}
      />
    </FormSection>
  );
}
