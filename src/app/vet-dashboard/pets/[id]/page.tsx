import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// Helper component for clean key-value rows
function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-2 py-1.5 border-b border-[var(--vy-neutral-100)] last:border-0">
            <span className="text-xs font-semibold text-[var(--vy-neutral-500)] uppercase tracking-wide shrink-0 pt-0.5">
                {label}
            </span>
            <span className="text-sm font-medium text-[var(--vy-neutral-800)] text-right">
                {value}
            </span>
        </div>
    );
}

export default async function VetPetDetailsPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Fetch the specific pet details
    const { data: pet, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", params.id)
        .single();

    if (error || !pet) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <span className="text-4xl mb-4">⚠️</span>
                <h1 className="text-2xl font-bold text-[var(--vy-neutral-900)]">Mascota no encontrada</h1>
                <p className="text-[var(--vy-neutral-500)] mt-2 mb-6">El paciente no existe o no tienes acceso.</p>
                <Link href="/vet-dashboard/pets" className="px-6 py-2 bg-teal-600 text-white rounded-xl font-medium">
                    Volver al directorio
                </Link>
            </div>
        );
    }

    // Calculate age from birth_date
    const birthDate = pet.birth_date ? new Date(pet.birth_date) : null;
    const currentYear = new Date().getFullYear();
    const age = birthDate ? currentYear - birthDate.getFullYear() : null;

    const formattedBirthDate = birthDate
        ? birthDate.toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" })
        : "No registrado";

    const speciesLabel: Record<string, string> = {
        dog: "Perro 🐕",
        cat: "Gato 🐱",
        bird: "Ave 🐦",
        reptile: "Reptil 🦎",
        other: "Otro",
    };

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <header className="flex items-center gap-4 mb-8">
                <Link
                    href="/vet-dashboard/pets"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[var(--vy-neutral-200)] text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-50)] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-[var(--vy-neutral-900)] tracking-tight">
                        Historial de {pet.name}
                    </h1>
                    <p className="text-[var(--vy-neutral-500)] mt-1">
                        Expediente clínico detallado del paciente.
                    </p>
                </div>
            </header>

            {/* ── Pet Profile Card ── */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--vy-neutral-200)] shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-teal-50 rounded-bl-[120px]" />

                {/* Photo */}
                <div className="w-28 h-28 rounded-full bg-teal-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0 relative z-10">
                    {pet.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl">{pet.species === "cat" ? "🐱" : "🐕"}</span>
                    )}
                </div>

                {/* Name and quick badges */}
                <div className="flex-1 relative z-10 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-[var(--vy-neutral-900)]">{pet.name}</h2>
                    <p className="text-[var(--vy-neutral-500)] font-medium mb-4">
                        {speciesLabel[pet.species] || pet.species} &bull; {pet.breed || "Raza desconocida"}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {age !== null && (
                            <span className="px-4 py-2 bg-[var(--vy-neutral-50)] text-[var(--vy-neutral-700)] rounded-xl text-sm font-semibold border border-[var(--vy-neutral-200)]">
                                🎂 {age} {age === 1 ? "año" : "años"}
                            </span>
                        )}
                        {pet.weight_kg != null && (
                            <span className="px-4 py-2 bg-[var(--vy-neutral-50)] text-[var(--vy-neutral-700)] rounded-xl text-sm font-semibold border border-[var(--vy-neutral-200)]">
                                ⚖️ {pet.weight_kg} kg
                            </span>
                        )}
                        {pet.sex && (
                            <span className="px-4 py-2 bg-[var(--vy-neutral-50)] text-[var(--vy-neutral-700)] rounded-xl text-sm font-semibold border border-[var(--vy-neutral-200)]">
                                ⚧️ {pet.sex === "male" ? "Macho" : "Hembra"}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Two-column layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Medical records */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white rounded-3xl p-6 border border-[var(--vy-neutral-200)] shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[var(--vy-neutral-900)]">🩺 Consultas Recientes</h3>
                            <button className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">
                                + Añadir Consulta
                            </button>
                        </div>
                        <div className="bg-[var(--vy-neutral-50)] rounded-2xl p-10 flex flex-col items-center justify-center text-center border border-dashed border-[var(--vy-neutral-200)]">
                            <span className="text-3xl mb-2">📋</span>
                            <h4 className="font-bold text-[var(--vy-neutral-900)]">Sin historial médico</h4>
                            <p className="text-sm text-[var(--vy-neutral-500)] mt-1 max-w-[250px]">
                                Aún no has registrado ninguna consulta o control para este paciente.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Right: Patient info + Vaccines */}
                <div className="space-y-6">

                    {/* ── Complete Patient Info Card ── */}
                    <section className="bg-white rounded-3xl p-6 border border-[var(--vy-neutral-200)] shadow-sm">
                        <h3 className="text-lg font-bold text-[var(--vy-neutral-900)] mb-4">📋 Información del Paciente</h3>
                        <div className="space-y-1">
                            <InfoRow label="Nombre" value={pet.name} />
                            <InfoRow label="Especie" value={speciesLabel[pet.species] || pet.species || "—"} />
                            <InfoRow label="Raza" value={pet.breed || "—"} />
                            <InfoRow label="Nacimiento" value={formattedBirthDate} />
                            <InfoRow label="Edad" value={age !== null ? `${age} ${age === 1 ? "año" : "años"}` : "—"} />
                            <InfoRow label="Peso" value={pet.weight_kg != null ? `${pet.weight_kg} kg` : "—"} />
                            <InfoRow label="Sexo" value={pet.sex === "male" ? "Macho" : pet.sex === "female" ? "Hembra" : "—"} />
                            {pet.notes && (
                                <div className="pt-3 border-t border-[var(--vy-neutral-100)]">
                                    <span className="block text-xs font-semibold text-[var(--vy-neutral-500)] uppercase tracking-wide mb-1">Notas</span>
                                    <p className="text-sm text-[var(--vy-neutral-700)]">{pet.notes}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Vaccines */}
                    <section className="bg-white rounded-3xl p-6 border border-[var(--vy-neutral-200)] shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-[var(--vy-neutral-900)]">💉 Vacunas</h3>
                            <button className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 text-xl font-bold flex items-center justify-center hover:bg-teal-100 transition-colors">
                                +
                            </button>
                        </div>
                        <p className="text-sm text-[var(--vy-neutral-500)] text-center py-4">
                            No hay vacunas registradas
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
