"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getConversations() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return { error: "No autorizado", data: null };

    const { data, error } = await supabase
        .from("ai_conversations")
        .select(`
      *,
      pet:pet_id (id, name, species)
    `)
        .eq("owner_id", session.user.id)
        .order("updated_at", { ascending: false });

    if (error) return { error: error.message, data: null };
    return { data, error: null };
}

export async function createConversation(petId: string | null = null, firstMessage: string) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return { error: "No autorizado", data: null };

    // Set a default title based on the first message
    const title = firstMessage.length > 50 ? firstMessage.substring(0, 47) + "..." : firstMessage;

    const { data, error } = await supabase
        .from("ai_conversations")
        .insert({
            owner_id: session.user.id,
            pet_id: petId,
            title
        })
        .select()
        .single();

    if (error) return { error: error.message, data: null };

    revalidatePath("/dashboard/ai");
    return { data, error: null };
}

export async function getConversationMessages(conversationId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("ai_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

    if (error) return { error: error.message, data: null };
    return { data, error: null };
}

export async function saveMessage(conversationId: string, role: string, content: string, guardsTriggered: boolean = false) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("ai_messages")
        .insert({
            conversation_id: conversationId,
            role,
            content,
            triggered_guardrail: guardsTriggered
        });

    if (error) return { error: error.message };

    // Touch conversation updated_at
    await supabase
        .from("ai_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

    return { error: null };
}

export async function deleteConversation(conversationId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("ai_conversations")
        .delete()
        .eq("id", conversationId);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/ai");
    return { error: null };
}
