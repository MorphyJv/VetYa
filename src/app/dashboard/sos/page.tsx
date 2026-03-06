import { createClient } from "@/lib/supabase/server";
import { getPets } from "../pets/actions";
import { getActiveEmergencies } from "./actions";
import SOSClient from "./SOSClient";
import VetSOSClient from "./VetSOSClient";

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
            <div className="h-full min-h-screen relative">
                <VetSOSClient initialEmergencies={emergencies || []} />
            </div>
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
        <div className="h-full min-h-screen relative">
            <SOSClient pets={pets || []} activeEmergencies={myActiveEmergencies} />
        </div>
    );
}
