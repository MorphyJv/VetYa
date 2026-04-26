"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addReview } from "./actions";

const categories = [
    { id: "all", label: "Todos", icon: "✨" },
    { id: "clinic", label: "Clínicas", icon: "🏥" },
    { id: "park", label: "Parques", icon: "🌳" },
    { id: "hotel", label: "Hoteles", icon: "🏨" },
    { id: "cafe", label: "Cafeterías", icon: "☕" },
];

export default function ExploreClient({ initialPlaces, currentType }: { initialPlaces: any[], currentType: string }) {
    const router = useRouter();
    const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCategoryClick = (id: string) => {
        router.push(`/dashboard/explore?type=${id}`);
    };

    const getGoogleMapsSearchUrl = (catLabel: string) => {
        const query = catLabel === "Todos" ? "lugares pet friendly en Ayacucho" : `${catLabel} pet friendly en Ayacucho`;
        return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    };

    const getPlaceNavigationUrl = (place: any) => {
        if (place.latitude && place.longitude) {
            return `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + (place.address || "") + " Ayacucho")}`;
    };

    const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(categories.find(c => c.id === currentType)?.label === 'Todos' ? 'lugares pet friendly en Ayacucho' : categories.find(c => c.id === currentType)?.label + ' pet friendly en Ayacucho')}&output=embed`;

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlace) return;

        setIsSubmitting(true);
        const res = await addReview(selectedPlace.id, rating, comment);
        setIsSubmitting(false);

        if (!res.error) {
            setComment("");
            setRating(5);
            router.refresh();
        } else {
            alert(res.error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Category Filter & View Toggle */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm
                                    ${currentType === cat.id
                                        ? "bg-[var(--vy-primary-500)] text-white scale-105 shadow-md"
                                        : "bg-[var(--surface)] text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-100)] border border-[var(--vy-neutral-200)]"
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-[var(--surface)] p-1 rounded-2xl border border-[var(--vy-neutral-200)] self-start md:self-auto">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "grid" ? "bg-[var(--vy-primary-50)] text-[var(--vy-primary-700)] shadow-sm" : "text-[var(--vy-neutral-500)]"}`}
                        >
                            Lista 📋
                        </button>
                        <button
                            onClick={() => setViewMode("map")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "map" ? "bg-[var(--vy-primary-50)] text-[var(--vy-primary-700)] shadow-sm" : "text-[var(--vy-neutral-500)]"}`}
                        >
                            Mapa 🌎
                        </button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <a
                        href={getGoogleMapsSearchUrl(categories.find(c => c.id === currentType)?.label || "Todos")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[var(--vy-primary-600)] hover:text-[var(--vy-primary-700)] bg-[var(--vy-primary-50)] px-4 py-2 rounded-xl transition-all border border-[var(--vy-primary-100)]"
                    >
                        🗺️ Ver más opciones en Google Maps →
                    </a>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === "map" ? (
                    <motion.div
                        key="map-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-[var(--vy-neutral-100)] relative z-0"
                    >
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={googleMapsEmbedUrl}
                        ></iframe>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {initialPlaces.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-[var(--surface)] rounded-3xl border border-dashed border-[var(--vy-neutral-200)]">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-[var(--vy-neutral-800)]">No se encontraron lugares</h3>
                                <p className="text-[var(--vy-neutral-500)] mt-2">Prueba seleccionando otra categoría.</p>
                            </div>
                        ) : (
                            initialPlaces.map((place, idx) => (
                                <motion.div
                                    key={place.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-[var(--surface)] rounded-3xl border border-[var(--vy-neutral-200)] overflow-hidden hover:shadow-xl transition-all group flex flex-col"
                                >
                                    <div className="aspect-[4/3] relative overflow-hidden bg-[var(--vy-neutral-100)]">
                                        {place.image_url ? (
                                            <img src={place.image_url} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-5xl">
                                                {categories.find(c => c.id === place.type)?.icon}
                                            </div>
                                        )}
                                        <a
                                            href={getPlaceNavigationUrl(place)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute top-4 right-4 bg-[var(--surface)]/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 hover:bg-[var(--surface)] transition-colors"
                                        >
                                            📍 Ir al mapa
                                        </a>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-[var(--vy-neutral-900)]">{place.name}</h3>
                                            <div className="flex items-center gap-1 text-[var(--vy-warning)] font-bold">
                                                🐾 {place.place_reviews?.length > 0
                                                    ? (place.place_reviews.reduce((acc: any, curr: any) => acc + curr.rating, 0) / place.place_reviews.length).toFixed(1)
                                                    : "N/A"
                                                }
                                            </div>
                                        </div>
                                        <p className="text-sm text-[var(--vy-neutral-500)] line-clamp-2 mb-6">
                                            {place.description || "Un lugar increíble para visitar con tu mascota."}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-[var(--vy-neutral-100)] flex justify-between items-center">
                                            <button
                                                onClick={() => setSelectedPlace(place)}
                                                className="text-sm font-bold text-[var(--vy-primary-600)] hover:text-[var(--vy-primary-700)] transition-colors"
                                            >
                                                Ver Reseñas ({place.place_reviews?.length || 0})
                                            </button>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--vy-neutral-400)] px-2 py-1 bg-[var(--vy-neutral-50)] rounded-lg">
                                                {categories.find(c => c.id === place.type)?.label}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Review Modal */}
            <AnimatePresence>
                {selectedPlace && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[var(--surface)] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedPlace.name}</h2>
                                    <p className="text-sm text-[var(--vy-neutral-500)]">Opiniones de la comunidad 🐾</p>
                                </div>
                                <button onClick={() => setSelectedPlace(null)} className="text-2xl text-[var(--vy-neutral-400)] hover:text-[var(--vy-neutral-600)] transition-colors">✕</button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div className="space-y-4">
                                    {selectedPlace.place_reviews?.length === 0 ? (
                                        <p className="text-center py-8 text-[var(--vy-neutral-400)] italic">Sé el primero en calificar este lugar.</p>
                                    ) : (
                                        selectedPlace.place_reviews.map((rev: any, i: number) => (
                                            <div key={i} className="p-4 bg-[var(--vy-neutral-50)] rounded-2xl border border-[var(--vy-neutral-200)]">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-bold text-sm text-[var(--vy-neutral-800)]">{rev.profiles?.display_name || "Usuario"}</span>
                                                    <span className="text-xs text-[var(--vy-warning)] font-bold">{"🐾".repeat(rev.rating)}</span>
                                                </div>
                                                <p className="text-sm text-[var(--vy-neutral-600)] italic">"{rev.comment}"</p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form onSubmit={handleReviewSubmit} className="mt-8 pt-8 border-t border-[var(--vy-neutral-100)] space-y-4">
                                    <h4 className="font-bold text-[var(--vy-neutral-900)] flex items-center gap-2">Deja tu huellita 🐾</h4>
                                    <div className="flex gap-2 text-2xl">
                                        {[1, 2, 3, 4, 5].map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => setRating(v)}
                                                className={`transition-all hover:scale-125 ${rating >= v ? "opacity-100 saturate-100" : "opacity-30 grayscale"}`}
                                            >
                                                🐾
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Cuéntanos tu experiencia con tu mascota aquí..."
                                        required
                                        className="w-full p-4 rounded-2xl border border-[var(--vy-neutral-200)] outline-none focus:ring-2 focus:ring-[var(--vy-primary-400)] text-sm h-24 transition-all"
                                    />
                                    <button
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-[var(--vy-primary-500)] text-white font-bold rounded-2xl hover:bg-[var(--vy-primary-600)] hover:shadow-lg transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? "Enviando..." : "Publicar Reseña ✨"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
