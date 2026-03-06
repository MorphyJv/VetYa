"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { addManualPatient } from "./actions";

export default function VetPetsClient({ pets }: { pets: any[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [modalView, setModalView] = useState<"selection" | "manual" | "qr">("selection");
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    className="bg-white rounded-3xl p-16 border border-[var(--vy-neutral-200)] flex flex-col items-center justify-center text-center"
                >
                    <div className="w-20 h-20 bg-[var(--vy-neutral-50)] rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
                        🐾
                    </div>
                    <h2 className="text-xl font-bold text-[var(--vy-neutral-900)]">
                        Directorio Vacío
                    </h2>
                    <p className="text-[var(--vy-neutral-500)] max-w-sm mt-2">
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
                                className="bg-white rounded-3xl p-5 border border-[var(--vy-neutral-200)] hover:border-teal-300 hover:shadow-lg transition-all group flex flex-col"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-100 flex items-center justify-center overflow-hidden shrink-0">
                                        {pet.photo_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl">🐕</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-[var(--vy-neutral-900)] truncate">
                                            {pet.name}
                                        </h3>
                                        <p className="text-sm text-[var(--vy-neutral-500)] truncate">
                                            {pet.breed || "Raza desconocida"}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-auto">
                                    <div className="bg-[var(--vy-neutral-50)] rounded-xl py-2 px-3 flex flex-col items-center">
                                        <span className="text-xs text-[var(--vy-neutral-500)] font-medium">Edad</span>
                                        <span className="font-bold text-[var(--vy-neutral-800)]">{age} años</span>
                                    </div>
                                    <div className="bg-[var(--vy-neutral-50)] rounded-xl py-2 px-3 flex flex-col items-center">
                                        <span className="text-xs text-[var(--vy-neutral-500)] font-medium">Peso</span>
                                        <span className="font-bold text-[var(--vy-neutral-800)]">{pet.weight_kg} kg</span>
                                    </div>
                                </div>
                                <Link
                                    href={`/vet-dashboard/pets/${pet.id}`}
                                    className="w-full mt-4 py-2 block text-center rounded-xl text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    Ver Historial
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
                            className="bg-white rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button
                                onClick={closeAddModal}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-500)] hover:bg-[var(--vy-neutral-200)] transition-colors z-10"
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
                                            <h3 className="text-2xl font-bold text-[var(--vy-neutral-900)] mb-1">
                                                Añadir paciente
                                            </h3>
                                            <p className="text-[var(--vy-neutral-500)] text-sm mb-6">
                                                ¿Cómo deseas vincular a la mascota a tu clínica?
                                            </p>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setModalView("qr")}
                                                className="w-full text-left p-5 rounded-2xl border-2 border-teal-100 bg-teal-50 hover:border-teal-300 transition-colors flex items-start gap-4 group"
                                            >
                                                <div className="w-12 h-12 shrink-0 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                    📷
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-teal-900 text-lg">Escanear código QR</h4>
                                                    <p className="text-teal-700/80 text-sm mt-1 leading-relaxed">
                                                        Toma una foto o escanea el código QR del dueño para vincular automáticamente su historial.
                                                    </p>
                                                </div>
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setModalView("manual")}
                                                className="w-full text-left p-5 rounded-2xl border-2 border-[var(--vy-neutral-100)] hover:border-[var(--vy-neutral-300)] transition-colors flex items-start gap-4 group"
                                            >
                                                <div className="w-12 h-12 shrink-0 bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-200)] rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-[var(--vy-neutral-600)]">
                                                    📝
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[var(--vy-neutral-900)] text-lg">Registro Manual</h4>
                                                    <p className="text-[var(--vy-neutral-500)] text-sm mt-1 leading-relaxed">
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
                                            <div className="flex items-center gap-3 mb-6">
                                                <button
                                                    onClick={() => setModalView("selection")}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-200)] transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <h3 className="text-xl font-bold text-[var(--vy-neutral-900)]">
                                                    Registro Manual
                                                </h3>
                                            </div>

                                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                                {/* Photo Upload Area */}
                                                <div className="flex justify-center mb-6">
                                                    <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-[var(--vy-neutral-300)] bg-[var(--vy-neutral-50)] hover:bg-[var(--vy-neutral-100)] transition-colors flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
                                                        {photoPreview ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <>
                                                                <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">📷</span>
                                                                <span className="text-xs text-[var(--vy-neutral-500)] font-medium">Subir foto</span>
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
                                                    <label htmlFor="name" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                                        Nombre de la mascota
                                                    </label>
                                                    <input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        required
                                                        placeholder="Ej. Firulais"
                                                        className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="breed" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                                            Raza
                                                        </label>
                                                        <input
                                                            id="breed"
                                                            name="breed"
                                                            type="text"
                                                            placeholder="Ej. Golden Retriever"
                                                            className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="age" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                                            Edad (Años)
                                                        </label>
                                                        <input
                                                            id="age"
                                                            name="age"
                                                            type="number"
                                                            required
                                                            placeholder="Ej. 3"
                                                            className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="weight" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                                        Peso (kg)
                                                    </label>
                                                    <input
                                                        id="weight"
                                                        name="weight"
                                                        type="number"
                                                        step="0.1"
                                                        required
                                                        placeholder="Ej. 12.5"
                                                        className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>

                                                <motion.button
                                                    whileTap={{ scale: 0.97 }}
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full py-3.5 mt-4 flex items-center justify-center gap-2 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Guardando...
                                                        </>
                                                    ) : (
                                                        "Guardar Paciente"
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
                                            <div className="flex items-center gap-3 mb-6">
                                                <button
                                                    onClick={() => setModalView("selection")}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-200)] transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <h3 className="text-xl font-bold text-[var(--vy-neutral-900)]">
                                                    Escáner QR
                                                </h3>
                                            </div>
                                            <div className="flex-1 rounded-2xl bg-black flex items-center justify-center overflow-hidden relative">
                                                <div className="absolute inset-x-0 h-[2px] bg-teal-500/80 animate-[ping_3s_linear_infinite] top-1/2" />
                                                <div className="absolute inset-0 border-[40px] border-black/50" />
                                                <p className="absolute bottom-6 text-white text-sm font-medium text-center px-4 z-10">
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
