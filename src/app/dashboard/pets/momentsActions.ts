"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPetMoments(petId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("pet_moments")
        .select("*")
        .eq("pet_id", petId)
        .order("moment_date", { ascending: false });

    if (error) return { error: error.message, data: null };
    return { data, error: null };
}

export async function addPetMoment(petId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return { error: "No autorizado" };

    const caption = formData.get("caption") as string;
    const moment_date = (formData.get("moment_date") as string) || new Date().toISOString().split('T')[0];
    const imageFile = formData.get("image") as File | null;

    if (!imageFile || imageFile.size === 0) {
        return { error: "Debes seleccionar una imagen para el momento." };
    }

    // 1. Upload to Storage
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${petId}-${Date.now()}.${fileExt}`;
    const filePath = `moments/${petId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('pets')
        .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        console.error("Moment upload error:", uploadError);
        return { error: "Error al subir la imagen a Supabase Storage." };
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('pets')
        .getPublicUrl(filePath);

    // 3. Save to Table
    const { error: insertError } = await supabase
        .from("pet_moments")
        .insert({
            pet_id: petId,
            image_url: publicUrl,
            caption: caption,
            moment_date: moment_date
        });

    if (insertError) {
        return { error: insertError.message };
    }

    revalidatePath(`/dashboard/pets/${petId}`);
    return { error: null };
}
