"use client";

import { UseFormReturn } from "react-hook-form";
import { MenagesFormData } from "@/lib/schemas/menages.schema";
import { FormSection, TextField, RadioGroup } from "@/components/forms/FormSection";
import { TYPE_HABITATION_OPTIONS } from "@/lib/constants";

export function Section1({ register, errors }: { register: UseFormReturn<MenagesFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Identification du ménage">
      <TextField
        label="Email ou numéro WhatsApp"
        name="email"
        register={register("email")}
        error={errors.email?.message}
        placeholder="exemple@email.com / +224..."
      />
      <TextField
        label="Nom du répondant"
        name="nom_repondant"
        register={register("nom_repondant")}
        error={errors.nom_repondant?.message}
        required
      />
      <TextField
        label="Nombre de personnes dans le foyer"
        name="nb_personnes_foyer"
        type="number"
        register={register("nb_personnes_foyer")}
        error={errors.nb_personnes_foyer?.message}
      />
      <RadioGroup
        label="Type d'habitation"
        name="type_habitation"
        options={TYPE_HABITATION_OPTIONS}
        register={register("type_habitation")}
        error={errors.type_habitation?.message}
      />
    </FormSection>
  );
}
