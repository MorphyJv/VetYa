"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { addManualPatient } from "./actions";

export default function VetPetsClient({ pets }: { pets: any[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [modalView, setModalView] = useState<"selection" | "manual" | "qr">("selection");
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setTimeout(() => {
            setModalView("selection");
            if (photoPreview) URL.revokeObjectURL(photoPreview);
            setPhotoPreview(null);
        }, 300);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (photoPreview) URL.revokeObjectURL(photoPreview);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        // TODO: En el futuro se procesaría la imagen (photoPreview file) y se subiría a Supabase Storage aquí

        const result = await addManualPatient(formData);

        if (result.error) {
            alert(result.error);
        } else {
            closeAddModal();
        }
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--vy-neutral-900)] tracking-tight">
                        Mascotas
                    </h1>
                    <p className="text-[var(--vy-neutral-500)] mt-1">
                        Historial médico y registros de pacientes de la clínica.
                    </p>
                </div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-medium shadow-md hover:bg-teal-700 transition-colors shrink-0"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Añadir paciente
                </motion.button>
            </header>

            {pets.length === 0 ? (
                /* Empty State Directory */
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--surface)] rounded-[40px] p-20 border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-center shadow-sm"
                >
                    <div className="w-24 h-24 bg-[var(--vy-neutral-100)] rounded-[32px] flex items-center justify-center text-5xl mb-8 shadow-inner ring-4 ring-[var(--border)]/50">
                        🐾
                    </div>
                    <h2 className="text-2xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight">
                        Directorio Vacío
                    </h2>
                    <p className="text-[var(--vy-neutral-500)] max-w-sm mt-4 text-xs font-bold uppercase tracking-widest leading-loose">
                        Aún no tienes pacientes registrados. Utiliza el botón de arriba para añadir una mascota a tu historial clínico.
                    </p>
                </motion.div>
            ) : (
                /* Patient Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {pets.map((pet, index) => {
                        // Calculate years old
                        const birthYear = new Date(pet.birth_date).getFullYear();
                        const currentYear = new Date().getFullYear();
                        const age = currentYear - birthYear;

                        return (
                            <motion.div
                                key={pet.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-[var(--surface)] rounded-[40px] p-6 border-2 border-[var(--border)] hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/5 transition-all group flex flex-col shadow-sm"
                            >
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-20 h-20 rounded-[28px] bg-[var(--vy-neutral-100)] border-2 border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                        {pet.photo_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl">{pet.species === 'cat' ? '🐱' : '🐕'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-black text-[var(--vy-neutral-900)] truncate uppercase tracking-tight">
                                            {pet.name}
                                        </h3>
                                        <p className="text-[10px] font-black text-[var(--vy-neutral-500)] truncate uppercase tracking-widest opacity-70">
                                            {pet.breed || "Raza desconocida"}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-auto">
                                    <div className="bg-[var(--vy-neutral-100)] rounded-2xl py-3 px-3 flex flex-col items-center border border-[var(--border)] shadow-inner">
                                        <span className="text-[9px] text-[var(--vy-neutral-500)] font-black uppercase tracking-widest mb-1">Edad</span>
                                        <span className="font-black text-sm text-[var(--vy-neutral-900)]">{age} Años</span>
                                    </div>
                                    <div className="bg-[var(--vy-neutral-100)] rounded-2xl py-3 px-3 flex flex-col items-center border border-[var(--border)] shadow-inner">
                                        <span className="text-[9px] text-[var(--vy-neutral-500)] font-black uppercase tracking-widest mb-1">Peso</span>
                                        <span className="font-black text-sm text-[var(--vy-neutral-900)]">{pet.weight_kg} Kg</span>
                                    </div>
                                </div>
                                <Link
                                    href={`/vet-dashboard/pets/${pet.id}`}
                                    className="w-full mt-6 py-4 block text-center rounded-2xl text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-500/10 hover:bg-teal-500 hover:text-white transition-all shadow-sm active:scale-95"
                                >
                                    Abrir Expediente
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* ── Add Patient Selection Modal ── */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[var(--surface)] rounded-[40px] p-8 sm:p-10 max-w-md w-full shadow-2xl relative border-2 border-[var(--border)]"
                        >
                            <button
                                onClick={closeAddModal}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-500)] hover:bg-[var(--vy-neutral-200)] transition-colors z-10 border border-[var(--border)]"
                            >
                                ✕
                            </button>

                            <div className="relative overflow-hidden min-h-[400px]">
                                <AnimatePresence mode="wait">
                                    {modalView === "selection" && (
                                        <motion.div
                                            key="selection"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-4 absolute inset-0"
                                        >
                                            <h3 className="text-3xl font-black text-[var(--vy-neutral-900)] mb-2 uppercase tracking-tight">
                                                Añadir paciente
                                            </h3>
                                            <p className="text-[var(--vy-neutral-500)] text-[10px] font-bold uppercase tracking-widest mb-8">
                                                ¿Cómo deseas vincular a la mascota a tu clínica?
                                            </p>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setModalView("qr")}
                                                className="w-full text-left p-6 rounded-[32px] border-2 border-teal-500/20 bg-teal-500/5 hover:border-teal-500 transition-all flex items-start gap-5 group shadow-sm"
                                            >
                                                <div className="w-14 h-14 shrink-0 bg-[var(--surface)] rounded-2xl shadow-md flex items-center justify-center text-3xl group-hover:scale-110 transition-transform border border-teal-500/10">
                                                    📷
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-teal-600 text-lg uppercase tracking-tight">Escanear código QR</h4>
                                                    <p className="text-teal-700/60 dark:text-teal-400/60 text-[10px] font-bold uppercase tracking-widest mt-1.5 leading-relaxed">
                                                        Toma una foto o escanea el código QR del dueño para vincular automáticamente su historial.
                                                    </p>
                                                </div>
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setModalView("manual")}
                                                className="w-full text-left p-6 rounded-[32px] border-2 border-[var(--border)] hover:border-teal-500/30 transition-all flex items-start gap-5 group shadow-sm"
                                            >
                                                <div className="w-14 h-14 shrink-0 bg-[var(--vy-neutral-100)] border-2 border-[var(--border)] rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-[var(--vy-neutral-600)] shadow-inner">
                                                    📝
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-[var(--vy-neutral-900)] text-lg uppercase tracking-tight">Registro Manual</h4>
                                                    <p className="text-[var(--vy-neutral-500)] text-[10px] font-bold uppercase tracking-widest mt-1.5 leading-relaxed">
                                                        Ingresa los datos de la mascota a mano si el dueño no tiene la aplicación instalada.
                                                    </p>
                                                </div>
                                            </motion.button>
                                        </motion.div>
                                    )}

                                    {modalView === "manual" && (
                                        <motion.div
                                            key="manual"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="absolute inset-0 overflow-y-auto pb-4 pr-2 custom-scrollbar"
                                        >
                                            <div className="flex items-center gap-4 mb-8">
                                                <button
                                                    onClick={() => setModalView("selection")}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-200)] transition-colors border border-[var(--border)]"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <h3 className="text-2xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight">
                                                    Registro Manual
                                                </h3>
                                            </div>

                                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                                {/* Photo Upload Area */}
                                                <div className="flex justify-center mb-8">
                                                    <div className="relative w-32 h-32 rounded-[32px] border-2 border-dashed border-[var(--border)] bg-[var(--vy-neutral-100)] hover:bg-[var(--vy-neutral-200)] transition-all flex flex-col items-center justify-center cursor-pointer group overflow-hidden shadow-inner">
                                                        {photoPreview ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <>
                                                                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📷</span>
                                                                <span className="text-[9px] text-[var(--vy-neutral-500)] font-black uppercase tracking-widest">Subir foto</span>
                                                            </>
                                                        )}
                                                        <input
                                                            name="photo"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handlePhotoChange}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="name" className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest mb-2 px-1">
                                                        Nombre de la mascota
                                                    </label>
                                                    <input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        required
                                                        placeholder="Ej. Firulais"
                                                        className="w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold placeholder:text-[var(--vy-neutral-300)] focus:border-teal-500 outline-none transition-all shadow-inner"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="breed" className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest mb-2 px-1">
                                                            Raza
                                                        </label>
                                                        <input
                                                            id="breed"
                                                            name="breed"
                                                            type="text"
                                                            placeholder="Ej. Golden Retriever"
                                                            className="w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold placeholder:text-[var(--vy-neutral-300)] focus:border-teal-500 outline-none transition-all shadow-inner"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="age" className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest mb-2 px-1">
                                                            Edad
                                                        </label>
                                                        <input
                                                            id="age"
                                                            name="age"
                                                            type="number"
                                                            required
                                                            placeholder="Ej. 3"
                                                            className="w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold placeholder:text-[var(--vy-neutral-300)] focus:border-teal-500 outline-none transition-all shadow-inner"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="weight" className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest mb-2 px-1">
                                                        Peso (kg)
                                                    </label>
                                                    <input
                                                        id="weight"
                                                        name="weight"
                                                        type="number"
                                                        step="0.1"
                                                        required
                                                        placeholder="Ej. 12.5"
                                                        className="w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold placeholder:text-[var(--vy-neutral-300)] focus:border-teal-500 outline-none transition-all shadow-inner"
                                                    />
                                                </div>

                                                <motion.button
                                                    whileTap={{ scale: 0.97 }}
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full py-4 mt-6 flex items-center justify-center gap-2 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Procesando...
                                                        </>
                                                    ) : (
                                                        "Confirmar Registro"
                                                    )}
                                                </motion.button>
                                            </form>
                                        </motion.div>
                                    )}

                                    {modalView === "qr" && (
                                        <motion.div
                                            key="qr"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="absolute inset-0 flex flex-col"
                                        >
                                            <div className="flex items-center gap-4 mb-8">
                                                <button
                                                    onClick={() => setModalView("selection")}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-200)] transition-colors border border-[var(--border)]"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <h3 className="text-2xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight">
                                                    Escáner SOS
                                                </h3>
                                            </div>
                                            <div className="flex-1 rounded-[32px] bg-black flex items-center justify-center overflow-hidden relative shadow-inner ring-4 ring-black/10">
                                                <div className="absolute inset-x-0 h-[2px] bg-teal-500/80 animate-[ping_3s_linear_infinite] top-1/2" />
                                                <div className="absolute inset-0 border-[60px] border-black/50" />
                                                <p className="absolute bottom-10 text-white text-[10px] font-black uppercase tracking-[0.2em] text-center px-10 z-10 leading-relaxed">
                                                    Apunta la cámara al código QR de la mascota
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
