import { getPets } from "../pets/actions";
import { getCalendarEvents } from "./actions";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
    // We'll pass server data to the client component to handle the interactive calendar
    // Default to current month
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    // Getting end of next month to have some overflow data just in case
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0).toISOString();

    const [petsRes, eventsRes] = await Promise.all([
        getPets(),
        getCalendarEvents(startOfMonth, endOfMonth)
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--vy-neutral-900)]">Calendario</h1>
                    <p className="text-sm text-[var(--vy-neutral-500)] mt-1">
                        Visualiza y programa vacunas, desparasitaciones y citas veterinarias.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-[var(--vy-neutral-200)] shadow-sm overflow-hidden">
                <CalendarClient
                    initialEvents={eventsRes.data || []}
                    pets={petsRes.data || []}
                />
            </div>
        </div>
    );
}
