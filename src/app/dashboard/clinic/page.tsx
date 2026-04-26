import { createClient } from "@/lib/supabase/server";
import ClinicDashboardClient from "./ClinicDashboardClient";

export default async function ClinicAffiliationPage() {
    const supabase = await createClient();

    // Fetch user pets to display in the "Carnet Digital" section
    const { data: { user } } = await supabase.auth.getUser();
    const { data: pets } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user?.id || "");

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24 overflow-x-hidden">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-black text-[var(--vy-neutral-900)] mb-2">Mi Clínica y Carnet 🏥</h1>
                <p className="text-[var(--vy-neutral-500)] text-sm max-w-2xl">
                    Gestiona tu afiliación veterinaria y accede al carnet digital oficial de tus mascotas para presentarlo en emergencias o citas.
                </p>
            </div>

            <ClinicDashboardClient pets={pets || []} />
        </div>
    );
}
