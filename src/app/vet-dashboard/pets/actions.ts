"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addManualPatient(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "No autorizado" };
    }

    const name = formData.get("name") as string;
    const breed = formData.get("breed") as string;
    const ageParams = formData.get("age") as string;
    const weightParams = formData.get("weight") as string;

    // For manual registry, if the owner doesn't have an account, the vet essentially "owns" the record.
    // We are temporarily assigning the Vet's profile ID as the owner so it satisfies the NOT NULL constraint.
    // In a real scenario, this might need a 'clinic_id' or nullable 'owner_id'.

    // Convert inputs safely 
    const age = parseFloat(ageParams) || 0;
    const weight_kg = parseFloat(weightParams) || 0;

    // Compute an approximate birth_date based on Age (years)
    const birth_date = new Date();
    birth_date.setFullYear(birth_date.getFullYear() - age);

    // Default to 'dog' and 'male' for now, can be expanded later
    const { error } = await supabase.from("pets").insert({
        owner_id: user.id, // Vet's ID representing the clinic
        name,
        breed,
        weight_kg,
        birth_date: birth_date.toISOString().split("T")[0],
        species: "dog",
        sex: "male",
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/vet-dashboard/pets");
    return { success: true };
}
