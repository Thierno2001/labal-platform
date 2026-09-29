"use client";

import { UseFormReturn } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, TextField, BooleanRadio } from "@/components/forms/FormSection";

export function Section8({ register, errors }: { register: UseFormReturn<MenagesFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Ponctualité & Suivi">
      <TextField
        label="Respect des horaires"
        name="respect_horaire"
        register={register("respect_horaire")}
        error={errors.respect_horaire?.message}
      />
      <BooleanRadio
        label="Notification à l'approche"
        name="notification_approche"
        register={register("notification_approche")}
        error={errors.notification_approche?.message}
      />
      <BooleanRadio
        label="Suivi sur carte en temps réel"
        name="suivi_carte_temps_reel"
        register={register("suivi_carte_temps_reel")}
        error={errors.suivi_carte_temps_reel?.message}
      />
    </FormSection>
  );
}
