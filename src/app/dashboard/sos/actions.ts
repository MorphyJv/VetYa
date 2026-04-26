"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEmergencyRequest(formData: FormData) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { error: "No autorizado", data: null };

    const pet_id = formData.get("pet_id") as string;
    const description = formData.get("description") as string;
    const severity = formData.get("severity") as string;
    // Opt: latitude/longitude if geolocation is implemented

    const { data, error } = await supabase
        .from("emergency_requests")
        .insert({
            owner_id: user.id,
            pet_id,
            description,
            severity,
            status: 'PENDING'
        })
        .select()
        .single();

    if (error) return { error: error.message, data: null };

    revalidatePath("/dashboard/sos");
    return { error: null, data: data };
}

export async function getActiveEmergencies() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { error: "No autorizado", data: [] };

    // This handles both owners (seeing their own) and vets (seeing pending/assigned) via RLS
    const { data, error } = await supabase
        .from("emergency_requests")
        .select(`
      *,
      pet:pet_id (id, name, species, photo_url),
      owner:owner_id (display_name, phone)
    `)
        .in("status", ["PENDING", "IN_PROGRESS"])
        .order("created_at", { ascending: false });

    if (error) return { error: error.message, data: null };
    return { data, error: null };
}

export async function getEmergencyById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("emergency_requests")
        .select(`
      *,
      pet:pet_id (id, name, species, photo_url, weight_kg, birth_date, breed),
      owner:owner_id (id, display_name, phone),
      vet:assigned_vet_id (id, display_name, phone)
    `)
        .eq("id", id)
        .single();

    if (error) return { error: error.message, data: null };
    return { data, error: null };
}

export async function acceptEmergency(emergencyId: string) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { error: "No autorizado" };

    const { error } = await supabase
        .from("emergency_requests")
        .update({
            status: 'IN_PROGRESS',
            assigned_vet_id: user.id
        })
        .eq("id", emergencyId)
        .eq("status", "PENDING"); // Prevent accepting if already taken

    if (error) return { error: error.message };

    revalidatePath(`/dashboard/sos`);
    revalidatePath(`/dashboard/sos/${emergencyId}`);
    return { error: null };
}

export async function resolveEmergency(emergencyId: string) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { error: "No autorizado" };

    const { error } = await supabase
        .from("emergency_requests")
        .update({
            status: 'RESOLVED',
            resolved_at: new Date().toISOString()
        })
        .eq("id", emergencyId);

    if (error) return { error: error.message };

    revalidatePath(`/dashboard/sos`);
    revalidatePath(`/dashboard/sos/${emergencyId}`);
    return { error: null };
}

export async function getEmergencyMessages(emergencyId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("emergency_messages")
        .select(`
      *,
      sender:sender_id (display_name, role)
    `)
        .eq("emergency_id", emergencyId)
        .order("sent_at", { ascending: true });

    if (error) return { error: error.message, data: null };
    return { data, error: null };
}

export async function sendMessage(emergencyId: string, content: string) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { error: "No autorizado" };

    const { error } = await supabase
        .from("emergency_messages")
        .insert({
            emergency_id: emergencyId,
            sender_id: user.id,
            content,
            message_type: 'text'
        });

    if (error) return { error: error.message };

    return { error: null };
}
export async function getAvailableVets() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("vet_profiles")
        .select(`
            clinic_name,
            clinic_address,
            clinic_phone,
            available,
            profiles:user_id (display_name)
        `)
        .eq("available", true)
        .limit(3);

    if (error) return { data: null, error: error.message };
    return { data, error: null };
}

export async function deriveEmergency(emergencyId: string, notes: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("emergency_requests")
        .update({
            status: 'CANCELLED',
            description: notes ? `[DERIVADA] ${notes}` : '[DERIVADA]'
        })
        .eq("id", emergencyId);

    if (error) return { error: error.message };

    revalidatePath(`/dashboard/sos`);
    revalidatePath(`/vet-dashboard/sos`);
    return { error: null };
}

export async function toggleVetAvailability(available: boolean) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { error: 'No autorizado' };

    // Upsert so it works even if vet_profiles row doesn't exist yet
    const { error } = await supabase
        .from("vet_profiles")
        .upsert({ user_id: user.id, available }, { onConflict: 'user_id' });

    if (error) return { error: error.message };

    revalidatePath(`/vet-dashboard/sos`);
    return { error: null };
}

export async function getVetAvailability() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return { data: false };

    const { data } = await supabase
        .from('vet_profiles')
        .select('available')
        .eq('user_id', session.user.id)
        .single();

    return { data: data?.available ?? true };
}
