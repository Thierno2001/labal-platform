"use client";

import { UseFormReturn } from "react-hook-form";
import { FormSection, TextField } from "@/components/forms/FormSection";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section5({ register, errors }: { register: UseFormReturn<TransitFormData>["register"]; errors: any }) {
  return (
    <FormSection title="Flux entrants PME">
      <TextField label="Nb PME clientes" name="nb_pme_clientes" type="number" register={register("nb_pme_clientes")} error={errors.nb_pme_clientes?.message} />
      <TextField label="Rotations quotidiennes" name="nb_rotations_quotidiennes" type="number" register={register("nb_rotations_quotidiennes")} error={errors.nb_rotations_quotidiennes?.message} />
      <TextField label="Tranches horaires pointe" name="tranches_horaires_pointe" register={register("tranches_horaires_pointe")} error={errors.tranches_horaires_pointe?.message} />
    </FormSection>
  );
}
