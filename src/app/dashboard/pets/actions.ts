"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPets() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { error: "No autorizado", data: null };

    const { data, error } = await supabase
        .from("pets")
        .select("*")
        // RLS already filters by owner_id, but good practice to be explicit
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

    if (error) return { error: error.message, data: null };
    return { data, error: null };
}

export async function getPetById(id: string) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { error: "No autorizado", data: null };

    const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .eq("owner_id", user.id)
        .single();

    if (error) return { error: error.message, data: null };
    return { data, error: null };
}

export async function addPet(formData: FormData) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { error: "No autorizado" };

    const name = formData.get("name") as string;
    const species = formData.get("species") as string;
    const breed = formData.get("breed") as string;
    const weight_kg = formData.get("weight_kg") ? parseFloat(formData.get("weight_kg") as string) : null;
    const birth_date = formData.get("birth_date") as string || null;
    const sex = formData.get("sex") as string || null;

    const { error } = await supabase
        .from("pets")
        .insert({
            owner_id: user.id,
            name,
            species,
            breed,
            weight_kg,
            birth_date,
            sex
        });

    if (error) return { error: error.message };

    revalidatePath("/dashboard/pets");
    revalidatePath("/dashboard");
    return { error: null };
}

export async function updatePet(id: string, formData: FormData) {
    const supabase = await createClient();

    const updates: Record<string, any> = {};
    const fields = ['name', 'species', 'breed', 'weight_kg', 'birth_date', 'sex', 'notes'];

    fields.forEach(field => {
        const val = formData.get(field);
        if (val !== null && val !== "") {
            updates[field] = field === 'weight_kg' ? parseFloat(val as string) : val;
        }
    });

    // Handle photo upload
    const photoFile = formData.get('photo') as File | null;
    if (photoFile && photoFile.size > 0 && photoFile.name !== 'undefined') {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return { error: "No autorizado" };

        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${id}-${Date.now()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`; // organize by user ID

        const { error: uploadError } = await supabase.storage
            .from('pets')
            .upload(filePath, photoFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error("Storage upload error:", uploadError);
            return { error: 'Error al subir la imagen. Verifica que el bucket "pets" exista en Supabase y sea público.' };
        }

        const { data: publicUrlData } = supabase.storage
            .from('pets')
            .getPublicUrl(filePath);

        updates['photo_url'] = publicUrlData.publicUrl;
    }

    const { error } = await supabase
        .from("pets")
        .update(updates)
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath(`/dashboard/pets/${id}`);
    revalidatePath("/dashboard/pets");
    return { error: null };
}

export async function deletePet(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/pets");
    revalidatePath("/dashboard");
    return { error: null };
}
