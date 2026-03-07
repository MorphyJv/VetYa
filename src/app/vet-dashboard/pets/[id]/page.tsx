import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// Helper component for clean key-value rows
function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 py-3 border-b-2 border-[var(--border)] last:border-0 group">
            <span className="text-[10px] font-black text-[var(--vy-neutral-400)] uppercase tracking-[0.15em] shrink-0 pt-1 group-hover:text-teal-600 transition-colors">
                {label}
            </span>
            <span className="text-sm font-black text-[var(--vy-neutral-800)] text-right uppercase tracking-tight">
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
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
                <span className="text-7xl mb-10 grayscale opacity-20">📂</span>
                <h1 className="text-4xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight">Mascota no encontrada</h1>
                <p className="text-[var(--vy-neutral-400)] mt-4 mb-10 font-bold uppercase tracking-widest text-xs max-w-md">El expediente que buscas no existe o ha sido trasladado.</p>
                <Link href="/vet-dashboard/pets" className="px-10 py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-teal-500/20 active:scale-95 transition-all">
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
        <div className="space-y-10 pb-20">
            {/* ── Header ── */}
            <header className="flex items-center gap-6 mb-12">
                <Link
                    href="/vet-dashboard/pets"
                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[var(--surface)] border-2 border-[var(--border)] text-[var(--vy-neutral-600)] hover:bg-teal-500/5 hover:border-teal-500/50 hover:text-teal-600 transition-all shadow-sm active:scale-90"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-4xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight">
                        Historial de {pet.name}
                    </h1>
                    <p className="text-[var(--vy-neutral-400)] text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">
                        Expediente clínico detallado del paciente • ID: {pet.id.slice(0, 8)}
                    </p>
                </div>
            </header>

            {/* ── Pet Profile Card ── */}
            <div className="bg-[var(--surface)] rounded-[48px] p-10 md:p-14 border-2 border-[var(--border)] shadow-2xl shadow-black/5 flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 blur-[100px] -z-10 rounded-full" />

                {/* Photo */}
                <div className="w-40 h-40 rounded-[40px] bg-[var(--background)] border-4 border-[var(--surface)] shadow-2xl flex items-center justify-center overflow-hidden shrink-0 relative z-10 scale-105 group">
                    {pet.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-6xl shadow-inner">
                            {pet.species === "cat" ? "🐱" : "🐕"}
                        </div>
                    )}
                </div>

                {/* Name and quick badges */}
                <div className="flex-1 relative z-10 text-center md:text-left pt-2">
                    <h2 className="text-5xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight mb-2">{pet.name}</h2>
                    <p className="text-[var(--vy-neutral-400)] text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        {speciesLabel[pet.species] || pet.species} &bull; {pet.breed || "Raza desconocida"}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        {age !== null && (
                            <span className="px-6 py-3 bg-[var(--background)] text-[var(--vy-neutral-700)] rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-[var(--border)] shadow-sm">
                                🎂 {age} {age === 1 ? "año" : "años"}
                            </span>
                        )}
                        {pet.weight_kg != null && (
                            <span className="px-6 py-3 bg-[var(--background)] text-[var(--vy-neutral-700)] rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-[var(--border)] shadow-sm">
                                ⚖️ {pet.weight_kg} kg
                            </span>
                        )}
                        {pet.sex && (
                            <span className="px-6 py-3 bg-[var(--background)] text-[var(--vy-neutral-700)] rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-[var(--border)] shadow-sm">
                                ⚧️ {pet.sex === "male" ? "Macho" : "Hembra"}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Two-column layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Medical records */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-[var(--surface)] rounded-[40px] p-10 border-2 border-[var(--border)] shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight">🩺 Consultas Recientes</h3>
                                <p className="text-[9px] font-black text-[var(--vy-neutral-400)] uppercase tracking-widest mt-1 opacity-70">Control de visitas y eventos médicos</p>
                            </div>
                            <button className="px-6 py-3 bg-[var(--background)] border-2 border-[var(--border)] text-[10px] font-black text-teal-600 rounded-2xl hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all shadow-sm active:scale-95 uppercase tracking-widest">
                                + Añadir Consulta
                            </button>
                        </div>
                        <div className="bg-[var(--background)] rounded-[32px] py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-[var(--border)] group">
                            <span className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500 grayscale opacity-20">📋</span>
                            <h4 className="font-black text-[var(--vy-neutral-900)] uppercase tracking-tight text-lg">Sin historial médico</h4>
                            <p className="text-[10px] font-black text-[var(--vy-neutral-400)] mt-3 max-w-[280px] uppercase tracking-widest leading-relaxed">
                                Aún no has registrado ninguna consulta o control para este paciente. Comienza añadiendo una visita.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Right: Patient info + Vaccines */}
                <div className="space-y-8">

                    {/* ── Complete Patient Info Card ── */}
                    <section className="bg-[var(--surface)] rounded-[40px] p-10 border-2 border-[var(--border)] shadow-xl">
                        <h3 className="text-xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight mb-8">📋 Información</h3>
                        <div className="space-y-1">
                            <InfoRow label="Nombre" value={pet.name} />
                            <InfoRow label="Especie" value={speciesLabel[pet.species] || pet.species || "—"} />
                            <InfoRow label="Raza" value={pet.breed || "—"} />
                            <InfoRow label="Nacimiento" value={formattedBirthDate} />
                            <InfoRow label="Edad" value={age !== null ? `${age} ${age === 1 ? "año" : "años"}` : "—"} />
                            <InfoRow label="Peso" value={pet.weight_kg != null ? `${pet.weight_kg} kg` : "—"} />
                            <InfoRow label="Sexo" value={pet.sex === "male" ? "Macho" : pet.sex === "female" ? "Hembra" : "—"} />
                            {pet.notes && (
                                <div className="pt-6 mt-2 border-t-2 border-[var(--border)]">
                                    <span className="block text-[10px] font-black text-[var(--vy-neutral-400)] uppercase tracking-widest mb-3">Observaciones</span>
                                    <p className="text-sm font-bold text-[var(--vy-neutral-700)] leading-relaxed">{pet.notes}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Vaccines */}
                    <section className="bg-[var(--surface)] rounded-[40px] p-10 border-2 border-[var(--border)] shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight">💉 Vacunas</h3>
                            <button className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 text-2xl font-black flex items-center justify-center hover:bg-teal-500 hover:text-white transition-all shadow-sm active:scale-90">
                                +
                            </button>
                        </div>
                        <div className="text-center py-10">
                            <p className="text-[10px] font-black text-[var(--vy-neutral-400)] uppercase tracking-widest opacity-60">
                                Sin registros activos
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
