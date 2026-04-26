import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AIChatClient from "./AIChatClient";
import { getPets } from "../pets/actions";
import { getConversations } from "./actions";

export default async function AIPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Fetch data in parallel for better performance
    const [petsRes, convsRes] = await Promise.all([
        getPets(),
        getConversations()
    ]);

    const pets = petsRes.data || [];
    const initialConversations = convsRes.data || [];

    return (
        <div className="h-[calc(100vh-120px)] lg:h-[calc(100vh-8rem)] p-4 md:p-6 lg:p-8 overflow-hidden">
            <AIChatClient 
                pets={pets} 
                initialConversations={initialConversations} 
                currentUserId={user.id} 
            />
        </div>
    );
}

