import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import VetPetsClient from "./VetPetsClient";

export default async function VetPetsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Fetch patients assigned to this Vet 
    // (For manual registry, vet's user.id is currently used as the owner_id)
    const { data: pets, error } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching pets:", error);
    }

    return <VetPetsClient pets={pets || []} />;
}
