import DashboardPageShell from "@/components/DashboardPageShell";

export default async function AIPage() {
    return (
        <DashboardPageShell title="Asistente IA">
            <div className="flex flex-col items-center justify-center text-center p-12 bg-[var(--surface)] rounded-3xl border border-[var(--vy-neutral-200)] shadow-sm">
                <div className="w-20 h-20 rounded-3xl bg-[var(--vy-neutral-100)] flex items-center justify-center text-4xl mb-6 grayscale opacity-50">🤖</div>
                <h2 className="text-xl font-bold text-[var(--vy-neutral-900)] mb-2">Asistente VetYa AI</h2>
                <p className="text-sm text-[var(--vy-neutral-500)] max-w-xs">
                    Esta función no está disponible por ahora. Estamos trabajando para mejorar tu experiencia. 🐾✨
                </p>
            </div>
        </DashboardPageShell>
    );
}

