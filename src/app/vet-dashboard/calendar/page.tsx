import { getVetCalendarEvents, getVetPets } from "./actions";
import VetCalendarClient from "./VetCalendarClient";

export default async function VetCalendarPage() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0).toISOString();

    const [petsRes, eventsRes] = await Promise.all([
        getVetPets(),
        getVetCalendarEvents(startOfMonth, endOfMonth),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--vy-neutral-900)]">Calendario</h1>
                    <p className="text-sm text-[var(--vy-neutral-500)] mt-1">
                        Programa y gestiona las citas y procedimientos de tu clínica.
                    </p>
                </div>
            </div>

            <div className="overflow-hidden">
                <VetCalendarClient
                    initialEvents={eventsRes.data || []}
                    pets={petsRes.data || []}
                />
            </div>
        </div>
    );
}
