import { getPets } from "../pets/actions";
import { getCalendarEvents } from "./actions";
import CalendarClient from "./CalendarClient";

import DashboardPageShell from "@/components/DashboardPageShell";

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
        <DashboardPageShell
            title="Calendario"
            subtitle="Visualiza y programa vacunas, desparasitaciones y citas veterinarias."
        >
            <div className="bg-[var(--surface)] rounded-3xl border border-[var(--vy-neutral-200)] shadow-sm overflow-hidden">
                <CalendarClient
                    initialEvents={eventsRes.data || []}
                    pets={petsRes.data || []}
                />
            </div>
        </DashboardPageShell>
    );
}
