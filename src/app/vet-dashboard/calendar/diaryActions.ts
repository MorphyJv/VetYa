"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Get diary note for a specific date
export async function getDiaryNote(date: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "No autorizado" };

    const { data, error } = await supabase
        .from("vet_personal_diary")
        .select("*")
        .eq("vet_id", user.id)
        .eq("date", date)
        .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
}

// Save diary note for a date — works without UNIQUE constraint
export async function saveDiaryNote(date: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autorizado" };

    // Check if a row already exists for this vet + date
    const { data: existing } = await supabase
        .from("vet_personal_diary")
        .select("id")
        .eq("vet_id", user.id)
        .eq("date", date)
        .maybeSingle();

    if (existing?.id) {
        // Update existing row
        const { error } = await supabase
            .from("vet_personal_diary")
            .update({ content, updated_at: new Date().toISOString() })
            .eq("id", existing.id);

        if (error) return { error: error.message };
    } else {
        // Insert new row
        const { error } = await supabase
            .from("vet_personal_diary")
            .insert({ vet_id: user.id, date, content });

        if (error) return { error: error.message };
    }

    revalidatePath("/vet-dashboard/calendar");
    return { error: null };
}

