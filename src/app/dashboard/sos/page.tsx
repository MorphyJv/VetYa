import { createClient } from "@/lib/supabase/server";
import { getPets } from "../pets/actions";
import { getActiveEmergencies } from "./actions";
import SOSClient from "./SOSClient";
import VetSOSClient from "./VetSOSClient";

import DashboardPageShell from "@/components/DashboardPageShell";

export default async function SOSPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Fetch user profile to determine role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, display_name")
        .eq("id", session?.user?.id)
        .single();
    const role = profile?.role || "owner";

    if (role === "vet") {
        const { data: emergencies } = await getActiveEmergencies();
        return (
            <DashboardPageShell
                title="Panel SOS Veterinario"
                subtitle="Monitorea y atiende emergencias activas en tiempo real."
            >
                <VetSOSClient initialEmergencies={emergencies || []} />
            </DashboardPageShell>
        );
    }

    // Owner flow
    const { data: pets } = await getPets();
    const { data: activeEmergencies } = await getActiveEmergencies();

    // Owners should only see their own active emergencies
    const myActiveEmergencies = (activeEmergencies || []).filter(
        (eq: any) => eq.owner_id === session?.user?.id
    );

    return (
        <DashboardPageShell
            title="Centro de Emergencias SOS"
            subtitle="Solicita ayuda inmediata para tu mascota en momentos críticos."
        >
            <SOSClient pets={pets || []} activeEmergencies={myActiveEmergencies} />
        </DashboardPageShell>
    );
}
