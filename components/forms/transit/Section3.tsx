"use client";

import { UseFormReturn, Controller, Control } from "react-hook-form";
import { FormSection, BooleanRadio, CheckboxGroup } from "@/components/forms/FormSection";
import { EQUIPEMENTS_TRANSIT_OPTIONS } from "@/lib/constants";
import { TransitFormData } from "@/lib/schemas/transit.schema";

export default function Section3({ register, control, errors }: { register: UseFormReturn<TransitFormData>["register"]; control: any; errors: any }) {
  return (
    <FormSection title="Équipements disponibles">
      <Controller
        name="equipements"
        control={control}
        render={({ field }) => (
          <CheckboxGroup label="Équipements" options={EQUIPEMENTS_TRANSIT_OPTIONS} values={field.value || []} onChange={field.onChange} error={errors.equipements?.message} />
        )}
      />
      <BooleanRadio label="Présence pont-bascule" name="presence_pont_bascule" register={register("presence_pont_bascule")} error={errors.presence_pont_bascule?.message} />
      <BooleanRadio label="Tri sur place" name="tri_sur_place" register={register("tri_sur_place")} error={errors.tri_sur_place?.message} />
    </FormSection>
  );
}
