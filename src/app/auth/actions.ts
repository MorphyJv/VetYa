"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string; // From the new toggle

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    // Set the active role cookie to isolate views
    const cookieStore = await cookies();
    cookieStore.set("vetya-active-role", role || "owner");

    revalidatePath("/", "layout");

    if (role === "vet") {
        redirect("/vet-dashboard");
    } else {
        redirect("/dashboard");
    }
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: name,
                role: "owner" // We default profile creation to owner, the cookie dictates session
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    // Set the active role cookie
    const cookieStore = await cookies();
    cookieStore.set("vetya-active-role", role || "owner");

    revalidatePath("/", "layout");

    if (role === "vet") {
        redirect("/vet-dashboard");
    } else {
        redirect("/dashboard");
    }
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();

    revalidatePath("/", "layout");
    redirect("/auth/login");
}
