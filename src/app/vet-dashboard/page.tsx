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
        color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
        iconBg: "bg-emerald-100",
        text: "text-emerald-700",
    },
    {
        href: "/vet-dashboard/calendar",
        icon: "📅",
        label: "Calendario",
        description: "Agenda y eventos",
        color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        iconBg: "bg-blue-100",
        text: "text-blue-700",
    },
    {
        href: "/vet-dashboard/sos",
        icon: "🚨",
        label: "SOS",
        description: "Emergencias activas",
        color: "bg-red-50 border-red-200 hover:bg-red-100",
        iconBg: "bg-red-100",
        text: "text-red-700",
    },
];

const SOCIAL_LINKS = [
    {
        name: "WhatsApp",
        url: "https://wa.me/",
        icon: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
        color: "bg-green-500 text-white hover:bg-green-600",
        qr: "/social_qr_codes.png",
        qrLabel: "WhatsApp",
    },
    {
        name: "Facebook",
        url: "https://www.facebook.com/",
        icon: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        color: "bg-blue-600 text-white hover:bg-blue-700",
        qr: "/social_qr_codes.png",
        qrLabel: "Facebook",
    },
    {
        name: "Messenger",
        url: "https://www.messenger.com/",
        icon: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.471 8.652V24l4.064-2.242c1.084.3 2.232.464 3.465.464 6.627 0 12-4.975 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.26L19.752 8l-6.561 6.963z" />
            </svg>
        ),
        color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
        qr: "/social_qr_codes.png",
        qrLabel: "Messenger",
    },
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
        <div className="space-y-6">
            {/* ── Greeting ── */}
            <header className="mb-2">
                <h1 className="text-3xl font-bold text-[var(--vy-neutral-900)] tracking-tight">
                    {greeting}, Dr. {profile?.display_name?.split(" ")[0] ?? "Veterinario"} 👋
                </h1>
                <p className="text-[var(--vy-neutral-500)] mt-1">
                    Aquí tienes el resumen de tu clínica.
                </p>
            </header>

            <div className="flex flex-col xl:flex-row gap-6">
                {/* ── Main column ── */}
                <div className="flex-1 space-y-6">

                    {/* ── Quick Nav Cards ── */}
                    <div className="grid grid-cols-3 gap-4">
                        {QUICK_NAV.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all group ${item.color}`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${item.iconBg} group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <div className="text-center">
                                    <p className={`font-bold text-sm ${item.text}`}>{item.label}</p>
                                    <p className={`text-xs opacity-70 ${item.text}`}>{item.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* ── Active Patients Section ── */}
                    <section className="bg-white rounded-3xl border border-[var(--vy-neutral-200)] shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[var(--vy-neutral-100)]">
                            <div>
                                <h2 className="text-lg font-bold text-[var(--vy-neutral-900)] flex items-center gap-2">
                                    🏥 Pacientes en Atención
                                    {activePatients.length > 0 && (
                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                                            {activePatients.length}
                                        </span>
                                    )}
                                </h2>
                                <p className="text-sm text-[var(--vy-neutral-500)]">Emergencias activas en tu clínica ahora mismo</p>
                            </div>
                            <Link href="/vet-dashboard/sos" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                                Ver SOS →
                            </Link>
                        </div>

                        {activePatients.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                                <span className="text-4xl mb-3">✅</span>
                                <p className="font-semibold text-[var(--vy-neutral-700)]">Sin pacientes de emergencia ahora mismo</p>
                                <p className="text-sm text-[var(--vy-neutral-400)] mt-1">Tu clínica está tranquila. ¡Buena señal!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--vy-neutral-100)]">
                                {activePatients.map((em: any) => (
                                    <Link
                                        key={em.id}
                                        href={`/vet-dashboard/sos`}
                                        className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--vy-neutral-50)] transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-xl overflow-hidden shrink-0">
                                            {em.pet?.photo_url
                                                // eslint-disable-next-line @next/next/no-img-element
                                                ? <img src={em.pet.photo_url} alt="" className="w-full h-full object-cover" />
                                                : em.pet?.species === "cat" ? "🐱" : "🐕"
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-[var(--vy-neutral-900)]">{em.pet?.name}</p>
                                            <p className="text-sm text-[var(--vy-neutral-500)] truncate">{em.description}</p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${em.severity === "CRITICAL" ? "bg-red-100 text-red-700" : em.severity === "MODERATE" ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {em.severity === "CRITICAL" ? "CRÍTICO" : em.severity === "MODERATE" ? "MODERADO" : "LEVE"}
                                            </span>
                                            <p className="text-xs text-[var(--vy-neutral-400)] mt-1">Dueño: {em.owner?.display_name}</p>
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
