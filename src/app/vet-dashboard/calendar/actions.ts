"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getVetCalendarEvents(monthStart: string, monthEnd: string) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { error: "No autorizado", data: null };

    const { data, error } = await supabase
        .from("calendar_events")
        .select(`*, pet:pet_id (id, name, species)`)
        .eq("owner_id", session.user.id)
        .gte("event_datetime", monthStart)
        .lte("event_datetime", monthEnd)
        .order("event_datetime", { ascending: true });

    if (error) return { error: error.message, data: null };
    return { data, error: null };
}

export async function addVetCalendarEvent(formData: FormData) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { error: "No autorizado" };

    const pet_id = formData.get("pet_id") as string;
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || null;
    const event_datetime = formData.get("event_datetime") as string;
    const event_type = formData.get("event_type") as string;

    const { error } = await supabase
        .from("calendar_events")
        .insert({ owner_id: session.user.id, pet_id, title, description, event_datetime, event_type });

    if (error) return { error: error.message };

    revalidatePath("/vet-dashboard/calendar");
    return { error: null };
}

export async function toggleVetEventCompletion(eventId: string, currentStatus: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("calendar_events")
        .update({ completed: !currentStatus })
        .eq("id", eventId);

    if (error) return { error: error.message };

    revalidatePath("/vet-dashboard/calendar");
    return { error: null };
}

export async function deleteVetCalendarEvent(eventId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", eventId);

    if (error) return { error: error.message };

    revalidatePath("/vet-dashboard/calendar");
    return { error: null };
}

export async function getVetPets() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { error: "No autorizado", data: null };

    const { data, error } = await supabase
        .from("pets")
        .select("id, name, species")
        .eq("owner_id", session.user.id)
        .order("name", { ascending: true });

    if (error) return { error: error.message, data: null };
    return { data, error: null };
}
