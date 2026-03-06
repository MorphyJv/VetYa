import { getPets } from "./pets/actions";
import { getUpcomingEvents } from "./calendar/actions";
import { getPlaces } from "./explore/actions";
import Link from "next/link";
import DashboardClientWrapper from "./DashboardClientWrapper";
import SocialQRCard from "./SocialQRCard";

import DashboardPageShell from "@/components/DashboardPageShell";

export default async function DashboardPage() {
    const [petsRes, eventsRes, placesRes] = await Promise.all([
        getPets(),
        getUpcomingEvents(3),
        getPlaces("all")
    ]);

    const pets = petsRes.data || [];
    const upcomingEvents = eventsRes.data || [];
    const suggestedPlaces = (placesRes.data || []).slice(0, 2);

    return (
        <DashboardPageShell
            title="¡Bienvenido a VetYa! 👋"
            subtitle="Aquí tienes un resumen de tus mascotas y eventos."
        >
            {/* Quick stats rendered via Client Wrapper to use Framer Motion */}
            <DashboardClientWrapper
                petCount={pets.length}
                eventsCount={upcomingEvents.length}
            />

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content Area: Pets List / Empty State */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[var(--vy-neutral-900)]">Tus Mascotas</h2>
                            {pets.length > 0 && (
                                <Link href="/dashboard/pets" className="text-sm font-semibold text-[var(--vy-primary-600)] hover:text-[var(--vy-primary-700)] transition-colors">
                                    Ver todas →
                                </Link>
                            )}
                        </div>

                        {pets.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-dashed border-[var(--vy-neutral-300)] p-12 text-center">
                                <div className="text-5xl mb-4">🐶</div>
                                <h3 className="text-lg font-semibold text-[var(--vy-neutral-800)]">
                                    Comienza registrando a tu mascota
                                </h3>
                                <p className="mt-2 text-sm text-[var(--vy-neutral-500)] max-w-sm mx-auto">
                                    Agrega a tus compañeros peludos para llevar su historial médico y programar vacunas.
                                </p>
                                <Link href="/dashboard/pets/add" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--vy-primary-600)] text-white text-sm font-semibold hover:bg-[var(--vy-primary-700)] transition-colors shadow-md">
                                    <span>+</span> Agregar Mascota
                                </Link>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {pets.slice(0, 4).map(pet => (
                                    <Link key={pet.id} href={`/dashboard/pets/${pet.id}`} className="bg-white rounded-3xl p-4 border border-[var(--vy-neutral-200)] hover:border-[var(--vy-primary-300)] hover:shadow-md transition-all flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[var(--vy-primary-100)] flex items-center justify-center text-xl shrink-0 overflow-hidden">
                                            {pet.photo_url ? (
                                                <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                                            ) : (
                                                pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐾'
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[var(--vy-neutral-900)] leading-tight">{pet.name}</h3>
                                            <p className="text-xs text-[var(--vy-neutral-500)] capitalize">{pet.breed || pet.species}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Explore Quick Section */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[var(--vy-neutral-900)]">Explorar Zonas Pet-Friendly</h2>
                            <Link href="/dashboard/explore" className="text-sm font-semibold text-[var(--vy-primary-600)] hover:text-[var(--vy-primary-700)] transition-colors">
                                Ver todas 📍
                            </Link>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {suggestedPlaces.length === 0 ? (
                                <div className="sm:col-span-2 p-6 bg-white rounded-3xl border border-[var(--vy-neutral-100)] text-center text-sm text-[var(--vy-neutral-500)]">
                                    No hay lugares recomendados todavía.
                                </div>
                            ) : (
                                suggestedPlaces.map(place => (
                                    <Link key={place.id} href="/dashboard/explore" className="bg-white rounded-3xl p-4 border border-[var(--vy-neutral-200)] hover:border-[var(--vy-primary-200)] flex items-center gap-4 group">
                                        <div className="w-16 h-12 rounded-2xl bg-[var(--vy-neutral-100)] flex items-center justify-center text-2xl overflow-hidden">
                                            {place.image_url ? (
                                                <img src={place.image_url} alt={place.name} className="w-full h-full object-cover" />
                                            ) : "📍"}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm text-[var(--vy-neutral-900)] truncate">{place.name}</h4>
                                            <p className="text-xs text-[var(--vy-warning)] font-bold">🐾 {place.place_reviews?.length > 0 ? (place.place_reviews.reduce((a: any, c: any) => a + c.rating, 0) / place.place_reviews.length).toFixed(1) : "Nuevo"}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar: Upcoming Events Widget */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-[var(--vy-neutral-900)]">Próximos Eventos</h2>
                        <Link href="/dashboard/calendar" className="text-sm font-semibold text-[var(--vy-primary-600)] hover:text-[var(--vy-primary-700)] transition-colors">
                            Calendario →
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl border border-[var(--vy-neutral-200)] p-5 shadow-sm space-y-3">
                        {upcomingEvents.length === 0 ? (
                            <div className="text-center py-6">
                                <div className="w-12 h-12 rounded-full bg-[var(--vy-neutral-100)] flex items-center justify-center text-xl mx-auto mb-3">📅</div>
                                <p className="text-sm text-[var(--vy-neutral-500)]">No hay vacunas ni citas programadas próximamente.</p>
                            </div>
                        ) : (
                            upcomingEvents.map(ev => {
                                const date = new Date(ev.event_datetime);
                                const isToday = new Date().toDateString() === date.toDateString();

                                return (
                                    <div key={ev.id} className="flex gap-4 p-3 rounded-2xl bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-200)] items-center">
                                        <div className="text-center w-12 shrink-0">
                                            <span className="block text-[10px] font-bold text-[var(--vy-danger)] uppercase tracking-wider">
                                                {date.toLocaleDateString('es', { month: 'short' })}
                                            </span>
                                            <span className="block text-xl font-bold text-[var(--vy-neutral-900)] leading-none mt-0.5">
                                                {date.getDate()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                {isToday && <span className="w-2 h-2 rounded-full bg-[var(--vy-danger)] animate-pulse" />}
                                                <h4 className="font-bold text-[var(--vy-neutral-900)] text-sm truncate">{ev.title}</h4>
                                            </div>
                                            <p className="text-xs text-[var(--vy-neutral-500)] flex items-center gap-1 truncate">
                                                🐾 {ev.pet?.name} · {date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        <Link href="/dashboard/calendar" className="mt-4 w-full py-2.5 rounded-xl border border-[var(--vy-neutral-300)] text-[var(--vy-neutral-700)] font-semibold text-sm hover:bg-[var(--vy-neutral-50)] transition-colors flex flex-col items-center justify-center">
                            Agregar Recordatorio
                        </Link>
                    </div>

                    {/* Social QR Card */}
                    <SocialQRCard />
                </div>
            </div>
        </DashboardPageShell>
    );
}
