import { createClient } from "@/lib/supabase/server";
import { getActiveEmergencies, getVetAvailability } from "@/app/dashboard/sos/actions";
import VetSOSDashboard from "./VetSOSDashboard";
import { redirect } from "next/navigation";

export default async function VetSOSPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const [emergenciesRes, availabilityRes] = await Promise.all([
        getActiveEmergencies(),
        getVetAvailability(),
    ]);

    return (
        <div className="space-y-6">
            <VetSOSDashboard
                initialEmergencies={emergenciesRes.data || []}
                initialOnDuty={availabilityRes.data ?? true}
                currentUserId={user.id}
            />
        </div>
    );
}
