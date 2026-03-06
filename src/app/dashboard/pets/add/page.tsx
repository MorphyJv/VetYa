"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addPet } from "../actions";
import Link from "next/link";

export default function AddPetPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const formData = new FormData(e.currentTarget);
        const res = await addPet(formData);

        if (res.error) {
            setErrorMsg(res.error);
            setLoading(false);
        } else {
            router.push("/dashboard/pets");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/pets"
                    className="w-10 h-10 rounded-xl bg-white border border-[var(--vy-neutral-200)] flex items-center justify-center text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-50)] transition-colors"
                >
                    ←
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--vy-neutral-900)]">Registrar Mascota</h1>
                    <p className="text-sm text-[var(--vy-neutral-500)] mt-0.5">Ingresa los datos de tu nuevo compañero.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-[var(--vy-neutral-200)] p-6 md:p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errorMsg && (
                        <div className="bg-[var(--vy-danger)]/10 text-[var(--vy-danger)] text-sm px-4 py-3 rounded-xl border border-[var(--vy-danger)]/20">
                            {errorMsg}
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Nombre <span className="text-[var(--vy-danger)]">*</span></label>
                            <input id="name" name="name" type="text" required placeholder="Ej. Firulais" className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all" />
                        </div>

                        <div>
                            <label htmlFor="species" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Especie <span className="text-[var(--vy-danger)]">*</span></label>
                            <select id="species" name="species" required className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all bg-white">
                                <option value="">Selecciona...</option>
                                <option value="dog">Perro 🐕</option>
                                <option value="cat">Gato 🐈</option>
                                <option value="bird">Ave 🦜</option>
                                <option value="reptile">Reptil 🦎</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="breed" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Raza</label>
                            <input id="breed" name="breed" type="text" placeholder="Ej. Golden Retriever" className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all" />
                        </div>

                        <div>
                            <label htmlFor="sex" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Sexo</label>
                            <select id="sex" name="sex" className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all bg-white">
                                <option value="">Desconocido</option>
                                <option value="male">Macho</option>
                                <option value="female">Hembra</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="weight_kg" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Peso (kg)</label>
                            <input id="weight_kg" name="weight_kg" type="number" step="0.1" min="0" placeholder="Ej. 12.5" className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all" />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="birth_date" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Fecha de Nacimiento (Aproximada)</label>
                            <input id="birth_date" name="birth_date" type="date" className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all" />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 rounded-xl bg-[var(--vy-primary-600)] text-white font-semibold text-sm hover:bg-[var(--vy-primary-700)] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && (
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {loading ? "Guardando..." : "Registrar Mascota"}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
}
