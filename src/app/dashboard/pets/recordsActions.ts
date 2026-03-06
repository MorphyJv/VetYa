"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMedicalRecords(petId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("medical_records")
        .select(`
      *,
      vet:vet_id (display_name, clinic_name)
    `)
        .eq("pet_id", petId)
        .order("visit_date", { ascending: false });

    if (error) return { error: error.message, data: null };
    return { data, error: null };
}

export async function addMedicalRecord(petId: string, formData: FormData) {
    const supabase = await createClient();

    const visit_date = formData.get("visit_date") as string;
    const record_type = formData.get("record_type") as string;
    const diagnosis = formData.get("diagnosis") as string;
    const treatment = formData.get("treatment") as string;
    const observations = formData.get("observations") as string;

    // Note: RLS allows vets to insert taking vet_id from auth.uid()
    // Or owners can insert. Here we just set pet_id and details.

    const { error } = await supabase
        .from("medical_records")
        .insert({
            pet_id: petId,
            visit_date,
            record_type,
            diagnosis,
            treatment,
            observations
        });

    if (error) return { error: error.message };

    revalidatePath(`/dashboard/pets/${petId}`);
    return { error: null };
}

export async function getVaccinations(petId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("vaccinations")
        .select(`
      *,
      vet:applied_by (display_name)
    `)
        .eq("pet_id", petId)
        .order("applied_date", { ascending: false });

    if (error) return { error: error.message, data: null };
    return { data, error: null };
}

export async function addVaccination(petId: string, formData: FormData) {
    const supabase = await createClient();

    const vaccine_name = formData.get("vaccine_name") as string;
    const applied_date = formData.get("applied_date") as string;
    const next_due_date = formData.get("next_due_date") as string || null;
    const lot_number = formData.get("lot_number") as string || null;

    const { error } = await supabase
        .from("vaccinations")
        .insert({
            pet_id: petId,
            vaccine_name,
            applied_date,
            next_due_date,
            lot_number
        });

    if (error) return { error: error.message };

    revalidatePath(`/dashboard/pets/${petId}`);
    return { error: null };
}
