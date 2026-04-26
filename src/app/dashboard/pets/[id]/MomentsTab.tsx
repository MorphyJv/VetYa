"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addPetMoment, updatePetMoment, deletePetMoment } from "../momentsActions";

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

    // Interactive States for Album Items
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [editMoment, setEditMoment] = useState<any | null>(null);
    const [deleteMoment, setDeleteMoment] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

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

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editMoment) return;
        setActionLoading(true);
        const formData = new FormData(e.currentTarget);
        const caption = formData.get("caption") as string;
        const momentDate = formData.get("moment_date") as string;
        
        await updatePetMoment(petId, editMoment.id, caption, momentDate);
        setActionLoading(false);
        setEditMoment(null);
    };

    const executeDelete = async () => {
        if (!deleteMoment) return;
        setActionLoading(true);
        await deletePetMoment(petId, deleteMoment.id, deleteMoment.image_url);
        setActionLoading(false);
        setDeleteMoment(null);
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
                                    <div className="relative group aspect-video rounded-xl border-2 border-dashed border-[var(--vy-neutral-300)] bg-[var(--surface)] flex flex-col items-center justify-center overflow-hidden hover:border-[var(--vy-primary-400)] transition-colors">
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
                        <div key={moment.id} className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-[var(--surface)] rounded-2xl border border-[var(--vy-neutral-200)] overflow-hidden shadow-sm hover:shadow-md transition-all group h-full flex flex-col"
                            >
                                <div className="aspect-square relative overflow-hidden bg-[var(--vy-neutral-100)] shrink-0">
                                    <img
                                        src={moment.image_url}
                                        alt={moment.caption}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Top Left: Date */}
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest shadow-sm">
                                        {new Date(moment.moment_date).toLocaleDateString()}
                                    </div>
                                    
                                    {/* Top Right: Settings Button */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === moment.id ? null : moment.id); }}
                                        className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 shadow-sm focus:opacity-100"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-4 flex-1 flex items-center">
                                    <p className="text-sm font-medium text-[var(--vy-neutral-800)] line-clamp-3 italic leading-relaxed">
                                        "{moment.caption}"
                                    </p>
                                </div>
                            </motion.div>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {openMenuId === moment.id && (
                                    <>
                                        {/* Invisible overlay to close menu on outside click */}
                                        <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                            className="absolute top-12 right-2 w-48 bg-[var(--surface)] border border-[var(--vy-neutral-200)] shadow-2xl rounded-xl z-50 overflow-hidden text-sm font-medium"
                                        >
                                            <div className="p-1">
                                                <button onClick={() => { setEditMoment(moment); setOpenMenuId(null); }} className="w-full text-left px-3 py-2.5 hover:bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-700)] rounded-lg flex items-center gap-2 transition-colors">
                                                    <span>✏️</span> Editar detalles
                                                </button>
                                                <div className="h-px bg-[var(--vy-neutral-200)] my-1" />
                                                <button onClick={() => { setDeleteMoment(moment); setOpenMenuId(null); }} className="w-full text-left px-3 py-2.5 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2 transition-colors">
                                                    <span>🗑️</span> Eliminar foto
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Edit Modal ── */}
            <AnimatePresence>
                {editMoment && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[var(--surface)] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[var(--vy-neutral-200)]"
                        >
                            <h3 className="text-xl font-bold text-[var(--vy-neutral-900)] mb-4">Editar Momento</h3>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Fecha</label>
                                    <input 
                                        type="date"
                                        name="moment_date"
                                        defaultValue={editMoment.moment_date}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-[var(--vy-neutral-50)] text-sm focus:ring-2 focus:ring-[var(--vy-primary-500)] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Descripción</label>
                                    <input 
                                        type="text"
                                        name="caption"
                                        defaultValue={editMoment.caption}
                                        required
                                        autoFocus
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-[var(--vy-neutral-50)] text-sm focus:ring-2 focus:ring-[var(--vy-primary-500)] outline-none"
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button type="button" onClick={() => setEditMoment(null)} className="flex-1 py-2.5 rounded-xl font-bold bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-700)] hover:bg-[var(--vy-neutral-200)] transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={actionLoading} className="flex-1 py-2.5 rounded-xl font-bold bg-[var(--vy-primary-600)] text-white hover:bg-[var(--vy-primary-700)] disabled:opacity-50 transition-colors shadow-sm">
                                        {actionLoading ? "Guardando..." : "Guardar"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Delete Confirm Modal ── */}
            <AnimatePresence>
                {deleteMoment && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[var(--surface)] rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl border border-[var(--vy-neutral-200)] flex flex-col items-center text-center"
                        >
                            <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 border-2 border-[var(--vy-neutral-200)] shadow-inner">
                                <img src={deleteMoment.image_url} alt="thumbnail" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--vy-neutral-900)] mb-2">¿Eliminar recuerdo?</h3>
                            <p className="text-sm text-[var(--vy-neutral-500)] mb-6">
                                Esta acción eliminará permanentemente la foto y su historia del diario. No se puede deshacer.
                            </p>
                            <div className="flex gap-2 w-full">
                                <button onClick={() => setDeleteMoment(null)} className="flex-1 py-3 rounded-xl font-bold bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-700)] hover:bg-[var(--vy-neutral-200)] transition-colors">
                                    Cancelar
                                </button>
                                <button onClick={executeDelete} disabled={actionLoading} className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm">
                                    {actionLoading ? "Borrando..." : "Sí, eliminar"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
