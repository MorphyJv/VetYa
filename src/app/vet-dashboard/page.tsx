import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getActiveEmergencies } from "@/app/dashboard/sos/actions";
import SocialQRCard from "./SocialQRCard";

const QUICK_NAV = [
    {
        href: "/vet-dashboard/pets",
        icon: "🐾",
        label: "Mascotas",
        description: "Directorio de pacientes",
        color: "bg-emerald-500/10 border-emerald-50 transition-all hover:bg-emerald-500/20 active:scale-95",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
        text: "text-emerald-700 dark:text-emerald-400",
    },
    {
        href: "/vet-dashboard/calendar",
        icon: "📅",
        label: "Calendario",
        description: "Agenda y eventos",
        color: "bg-blue-500/10 border-blue-50 transition-all hover:bg-blue-500/20 active:scale-95",
        iconBg: "bg-blue-100 dark:bg-blue-900/50",
        text: "text-blue-700 dark:text-blue-400",
    },
    {
        href: "/vet-dashboard/sos",
        icon: "🚨",
        label: "SOS",
        description: "Emergencias activas",
        color: "bg-red-500/10 border-red-50 transition-all hover:bg-red-500/20 active:scale-95",
        iconBg: "bg-red-100 dark:bg-red-900/50",
        text: "text-red-700 dark:text-red-400",
    },
];

const SOCIAL_LINKS = [
    // ... existing SOCIAL_LINKS ...
];

export default async function VetDashboardHome() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    // Get vet's display name
    const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user?.id)
        .single();

    // Get active emergencies (in progress, assigned to this vet)
    const { data: allEmergencies } = await getActiveEmergencies();
    const activePatients = (allEmergencies || []).filter(
        (e: any) => e.status === "IN_PROGRESS" && e.assigned_vet_id === user?.id
    );

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

    return (
        <div className="space-y-8">
            {/* ── Greeting ── */}
            <header className="mb-4">
                <h1 className="text-4xl font-black text-[var(--vy-neutral-900)] tracking-tight">
                    {greeting}, <span className="text-teal-600">Dr. {profile?.display_name?.split(" ")[0] ?? "Veterinario"}</span> 👋
                </h1>
                <p className="text-[var(--vy-neutral-500)] mt-2 font-medium">
                    Aquí tienes el resumen estratégico de tu clínica.
                </p>
            </header>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* ── Main column ── */}
                <div className="flex-1 space-y-8">

                    {/* ── Quick Nav Cards ── */}
                    <div className="grid grid-cols-3 gap-6">
                        {QUICK_NAV.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-4 p-6 rounded-[32px] border-2 border-transparent transition-all group shadow-sm hover:shadow-xl ${item.color}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${item.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <div className="text-center">
                                    <p className={`font-black text-sm uppercase tracking-wider ${item.text}`}>{item.label}</p>
                                    <p className={`text-[10px] font-bold opacity-60 uppercase tracking-tight mt-1 ${item.text}`}>{item.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* ── Active Patients Section ── */}
                    <section className="bg-[var(--surface)] rounded-[40px] border-2 border-[var(--border)] shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-[var(--vy-neutral-100)]">
                            <div>
                                <h2 className="text-xl font-black text-[var(--vy-neutral-900)] flex items-center gap-3 uppercase tracking-tight">
                                    🏥 Pacientes en Atención
                                    {activePatients.length > 0 && (
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse shadow-lg">
                                            {activePatients.length}
                                        </span>
                                    )}
                                </h2>
                                <p className="text-xs font-bold text-[var(--vy-neutral-400)] uppercase tracking-widest mt-1">Monitoreo en tiempo real</p>
                            </div>
                            <Link href="/vet-dashboard/sos" className="text-xs font-black text-teal-600 hover:text-teal-700 uppercase tracking-widest">
                                Ver todos SOS →
                            </Link>
                        </div>

                        {activePatients.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                                <span className="text-5xl mb-6 grayscale opacity-20">✅</span>
                                <p className="text-lg font-black text-[var(--vy-neutral-700)] uppercase tracking-tight">Sin emergencias activas</p>
                                <p className="text-xs font-bold text-[var(--vy-neutral-400)] uppercase tracking-widest mt-2">La clínica está bajo control absoluto.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--vy-neutral-100)]">
                                {activePatients.map((em: any) => (
                                    <Link
                                        key={em.id}
                                        href={`/vet-dashboard/sos`}
                                        className="flex items-center gap-6 px-8 py-6 hover:bg-[var(--vy-neutral-50)] transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-[22px] bg-[var(--vy-neutral-100)] border-2 border-[var(--border)] flex items-center justify-center text-3xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                                            {em.pet?.photo_url
                                                // eslint-disable-next-line @next/next/no-img-element
                                                ? <img src={em.pet.photo_url} alt="" className="w-full h-full object-cover" />
                                                : em.pet?.species === "cat" ? "🐱" : "🐕"
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-lg text-[var(--vy-neutral-900)] uppercase tracking-tight leading-tight">{em.pet?.name}</p>
                                            <p className="text-sm font-bold text-[var(--vy-neutral-500)] truncate mt-1">{em.description}</p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${em.severity === "CRITICAL" ? "bg-red-500 text-white shadow-md shadow-red-500/20" : em.severity === "MODERATE" ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {em.severity === "CRITICAL" ? "CRÍTICO" : em.severity === "MODERATE" ? "MODERADO" : "LEVE"}
                                            </span>
                                            <p className="text-[10px] font-bold text-[var(--vy-neutral-400)] uppercase tracking-tighter mt-2">Dueño: {em.owner?.display_name?.split(" ")[0]}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* ── Right column: Social QR codes ── */}
                <div className="w-full xl:w-72 shrink-0">
                    <SocialQRCard />
                </div>
            </div>
        </div>
    );
}
