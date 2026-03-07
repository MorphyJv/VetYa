import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

function PetCard({ pet }: { pet: any }) {
    const getAvatarFallback = (name: string, species: string) => {
        if (species === 'dog') return '🐶';
        if (species === 'cat') return '🐱';
        if (species === 'bird') return '🐦';
        if (species === 'reptile') return '🦎';
        return '🐾';
    };

    return (
        <Link href={`/dashboard/pets/${pet.id}`} className="group relative block bg-[var(--surface)] rounded-3xl p-6 shadow-sm border border-[var(--vy-neutral-200)] hover:shadow-md hover:border-[var(--vy-primary-200)] transition-all">
            <div className="absolute top-4 right-4 text-2xl opacity-10 group-hover:opacity-100 transition-opacity">
                {getAvatarFallback(pet.name, pet.species)}
            </div>

            <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--vy-primary-100)] to-[var(--vy-primary-200)] flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                    {pet.photo_url ? (
                        <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                        getAvatarFallback(pet.name, pet.species)
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-bold text-[var(--vy-neutral-900)] decoration-[var(--vy-primary-400)] decoration-2 group-hover:underline underline-offset-4">
                        {pet.name}
                    </h3>
                    <p className="text-sm text-[var(--vy-neutral-500)] capitalize">
                        {pet.breed || pet.species}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex divide-x divide-[var(--vy-neutral-200)] text-sm rounded-xl bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-200)] overflow-hidden">
                <div className="flex-1 py-2 text-center">
                    <span className="block text-[var(--vy-neutral-500)] text-xs font-medium uppercase tracking-wider mb-0.5">Sexo</span>
                    <span className="font-semibold text-[var(--vy-neutral-700)] capitalize">{pet.sex === 'male' ? 'Macho' : pet.sex === 'female' ? 'Hembra' : '—'}</span>
                </div>
                <div className="flex-1 py-2 text-center">
                    <span className="block text-[var(--vy-neutral-500)] text-xs font-medium uppercase tracking-wider mb-0.5">Peso</span>
                    <span className="font-semibold text-[var(--vy-neutral-700)]">{pet.weight_kg ? `${pet.weight_kg} kg` : '—'}</span>
                </div>
                <div className="flex-1 py-2 text-center">
                    <span className="block text-[var(--vy-neutral-500)] text-xs font-medium uppercase tracking-wider mb-0.5">Nacimiento</span>
                    <span className="font-semibold text-[var(--vy-neutral-700)]">{pet.birth_date ? new Date(pet.birth_date).toLocaleDateString() : '—'}</span>
                </div>
            </div>
        </Link>
    );
}

import DashboardPageShell from "@/components/DashboardPageShell";

export default async function PetsDashboardPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const { data: pets } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", session?.user?.id)
        .order("created_at", { ascending: false });

    return (
        <DashboardPageShell
            title="Mis Mascotas"
            subtitle="Gestiona el historial médico de tu familia de cuatro patas."
            actions={
                <Link
                    href="/dashboard/pets/add"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--vy-primary-600)] hover:bg-[var(--vy-primary-700)] text-white text-sm font-semibold rounded-xl shadow-md transition-colors whitespace-nowrap"
                >
                    <span>➕</span> Agregar Mascota
                </Link>
            }
        >
            {!pets || pets.length === 0 ? (
                <div className="bg-[var(--surface)] rounded-3xl border border-dashed border-[var(--vy-neutral-300)] p-12 text-center">
                    <div className="text-5xl mb-4">🏠</div>
                    <h3 className="text-lg font-semibold text-[var(--vy-neutral-800)]">Sin mascotas aún</h3>
                    <p className="mt-2 text-sm text-[var(--vy-neutral-500)] max-w-sm mx-auto">
                        Registra a tus mascotas para poder solicitar citas, llevar su historia médica e interactuar con el asistente VetYa.
                    </p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map(pet => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </div>
            )}
        </DashboardPageShell>
    );
}
