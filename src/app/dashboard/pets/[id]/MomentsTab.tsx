"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addPetMoment } from "../momentsActions";

export default function MomentsTab({
    petId,
    initialMoments
}: {
    petId: string;
    initialMoments: any[];
}) {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const { error: uploadError } = await addPetMoment(petId, formData);

        if (uploadError) {
            setError(uploadError);
            setLoading(false);
        } else {
            setLoading(false);
            setShowForm(false);
            setPreviewUrl(null);
            // Revalidation handles the data refresh
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[var(--vy-neutral-900)]">Momentos Inolvidables 📸</h3>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setPreviewUrl(null);
                        setError(null);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--vy-primary-500)] text-white hover:bg-[var(--vy-primary-600)] text-sm font-semibold rounded-xl transition-all shadow-sm"
                >
                    {showForm ? "Cerrar" : "+ Nuevo Momento"}
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-200)] rounded-2xl p-6 mb-8 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs border border-red-100 italic">
                                    ⚠️ {error}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Descripción o Hito</label>
                                        <input
                                            name="caption"
                                            type="text"
                                            placeholder="Ej. Mi primer baño, Durmiendo..."
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-[var(--vy-neutral-300)] text-sm outline-none focus:ring-2 focus:ring-[var(--vy-primary-500)] transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Fecha del Momento</label>
                                        <input
                                            name="moment_date"
                                            type="date"
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-[var(--vy-neutral-300)] text-sm outline-none focus:ring-2 focus:ring-[var(--vy-primary-500)] transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Foto del momento</label>
                                    <div className="relative group aspect-video rounded-xl border-2 border-dashed border-[var(--vy-neutral-300)] bg-white flex flex-col items-center justify-center overflow-hidden hover:border-[var(--vy-primary-400)] transition-colors">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <span className="text-3xl mb-2 block">🖼️</span>
                                                <span className="text-xs text-[var(--vy-neutral-500)]">Haz clic para subir foto</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            required
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setPreviewUrl(URL.createObjectURL(file));
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-2.5 rounded-xl bg-[var(--vy-primary-600)] text-white text-sm font-semibold hover:bg-[var(--vy-primary-700)] transition-all shadow-md disabled:opacity-50"
                                >
                                    {loading ? "Subiendo..." : "Publicar Momento"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {initialMoments.length === 0 ? (
                <div className="py-20 text-center bg-[var(--vy-neutral-50)] rounded-3xl border border-dashed border-[var(--vy-neutral-200)]">
                    <div className="text-5xl mb-4 opacity-30">📓</div>
                    <h4 className="text-lg font-bold text-[var(--vy-neutral-800)]">Tu diario está vacío</h4>
                    <p className="text-sm text-[var(--vy-neutral-500)] mt-1">Comienza a capturar los mejores momentos de tu mascota hoy mismo.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialMoments.map((moment, index) => (
                        <motion.div
                            key={moment.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl border border-[var(--vy-neutral-200)] overflow-hidden shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="aspect-square relative overflow-hidden bg-[var(--vy-neutral-100)]">
                                <img
                                    src={moment.image_url}
                                    alt={moment.caption}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold">
                                    {new Date(moment.moment_date).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-medium text-[var(--vy-neutral-800)] line-clamp-2 italic">
                                    "{moment.caption}"
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
