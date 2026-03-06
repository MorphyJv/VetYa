import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getEmergencyById, getEmergencyMessages, getAvailableVets } from "../actions";
import { getPets } from "../../pets/actions";
import EmergencyRoomClient from "./EmergencyRoomClient";

export default async function EmergencyRoomPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) redirect("/auth/login");

    const [reqRes, msgsRes, vetsRes, petsRes] = await Promise.all([
        getEmergencyById(params.id),
        getEmergencyMessages(params.id),
        getAvailableVets(),
        getPets()
    ]);

    if (reqRes.error || !reqRes.data) {
        notFound();
    }

    const emergency = reqRes.data;
    const isOwner = session.user.id === emergency.owner_id;
    const isVet = session.user.id === emergency.assigned_vet_id;

    // Security check: Only owner or assigned vet can view (or vets viewing pending)
    if (!isOwner && emergency.status !== "PENDING" && !isVet) {
        redirect("/dashboard/sos");
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] -mx-6 -my-6 lg:m-0 bg-white lg:rounded-3xl lg:border border-[var(--vy-neutral-200)] lg:shadow-xl overflow-hidden max-w-5xl mx-auto">
            <EmergencyRoomClient
                emergency={emergency}
                initialMessages={msgsRes.data || []}
                currentUserId={session.user.id}
                isVet={isVet}
                availableVets={vetsRes.data || []}
                allPets={petsRes.data || []}
            />
        </div>
    );
}
