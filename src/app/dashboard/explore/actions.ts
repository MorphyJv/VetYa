"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPlaces(type?: string) {
    const supabase = await createClient();
    let query = supabase
        .from("pet_friendly_places")
        .select(`
            *,
            place_reviews (
                rating,
                comment,
                created_at,
                profiles (display_name)
            )
        `);

    if (type && type !== "all") {
        query = query.eq("type", type);
    }

    // Force filtering to Ayacucho department only, as requested by user
    query = query.ilike("address", "%Ayacucho%");

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
}

export async function addReview(placeId: string, rating: number, comment: string) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return { error: "Debes iniciar sesión para dejar una reseña." };

    const { error } = await supabase
        .from("place_reviews")
        .insert({
            place_id: placeId,
            profile_id: session.user.id,
            rating,
            comment
        });

    if (error) return { error: error.message };

    revalidatePath("/dashboard/explore");
    return { error: null };
}
