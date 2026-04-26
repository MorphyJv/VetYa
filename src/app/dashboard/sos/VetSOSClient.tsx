"use client";

import { motion, AnimatePresence } from "framer-motion";
import { acceptEmergency } from "./actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VetSOSClient({ initialEmergencies }: { initialEmergencies: any[] }) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const pending = initialEmergencies.filter(e => e.status === "PENDING");
    const inProgress = initialEmergencies.filter(e => e.status === "IN_PROGRESS");

    const handleAccept = async (id: string) => {
        setLoadingId(id);
        const res = await acceptEmergency(id);
        setLoadingId(null);
        if (!res.error) {
            router.push(`/dashboard/sos/${id}`);
        }
    };

    // If no cases, show a high-vis Vet Dashboard
    if (pending.length === 0 && inProgress.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[var(--surface)] rounded-[50px] p-20 border-4 border-[var(--vy-danger)]/5 shadow-2xl max-w-2xl"
                >
                    <div className="text-8xl mb-8 animate-bounce">🩺</div>
                    <h1 className="text-5xl font-black text-[var(--vy-neutral-900)] tracking-tighter uppercase mb-4 italic">Central Vet</h1>
                    <p className="text-[var(--vy-neutral-500)] font-bold text-lg max-w-sm mx-auto mb-10">
                        No hay emergencias activas en este momento. Estás en modo de guardia.
                    </p>
                    <div className="flex items-center justify-center gap-3 py-4 px-10 bg-red-50 rounded-full border-2 border-red-100 text-red-600 font-black uppercase tracking-widest text-sm translate-y-4">
                        <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                        Escaneando Red SOS
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">

            {/* GIANT VET HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--surface)] rounded-[40px] p-10 border-4 border-[var(--vy-danger)]/10 shadow-2xl flex flex-col md:flex-row items-center gap-8"
            >
                <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-5xl shadow-xl shadow-red-200 animate-bounce">
                    🚨
                </div>
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-5xl font-black text-red-600 uppercase tracking-tighter italic leading-none">Central de Emergencias</h1>
                    <p className="text-lg font-bold text-[var(--vy-neutral-500)] mt-2 uppercase tracking-widest">Atención Veterinaria Inmediata</p>
                </div>
                <div className="px-6 py-3 bg-red-50 rounded-2xl border-2 border-red-100">
                    <span className="text-2xl font-black text-red-600">{pending.length}</span>
                    <span className="text-xs font-black text-red-400 uppercase tracking-widest ml-2">Casos en espera</span>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* IN PROGRESS */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-[var(--vy-neutral-900)] flex items-center gap-3 uppercase tracking-tight">
                        <span className="w-3 h-3 rounded-full bg-[var(--vy-success)] animate-pulse" />
                        Tus Casos Activos
                    </h2>

                    <div className="space-y-4">
                        {inProgress.map(req => (
                            <button
                                key={req.id}
                                onClick={() => router.push(`/dashboard/sos/${req.id}`)}
                                className="w-full bg-[var(--surface)] p-6 rounded-[32px] border-2 border-[var(--vy-success)]/10 shadow-md flex items-center gap-5 hover:scale-[1.02] transition-transform text-left"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[var(--vy-neutral-50)] flex items-center justify-center text-2xl overflow-hidden shadow-inner">
                                    {req.pet.photo_url ? <img src={req.pet.photo_url} alt="" className="w-full h-full object-cover" /> : "🐾"}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-[var(--vy-neutral-900)] text-lg uppercase">{req.pet.name}</h3>
                                    <p className="text-[10px] font-black text-[var(--vy-neutral-400)] uppercase tracking-widest">{req.owner.display_name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {req.owner?.phone && (
                                        <a
                                            href={`tel:${req.owner.phone.replace(/\s/g, "")}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm"
                                            title="Llamar al dueño"
                                        >
                                            📞
                                        </a>
                                    )}
                                    <div className="w-10 h-10 rounded-full bg-[var(--vy-primary-50)] text-[var(--vy-primary-600)] flex items-center justify-center border border-[var(--vy-primary-100)]">
                                        💬
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* PENDING QUEUE */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-red-600 flex items-center gap-3 uppercase tracking-tight">
                        <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                        Nuevas Solicitudes
                    </h2>

                    <div className="space-y-4">
                        {pending.map(req => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 p-6 rounded-[32px] border-2 border-red-200 shadow-xl flex flex-col gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] border-2 border-[var(--vy-danger)]/20 flex items-center justify-center text-2xl overflow-hidden font-black">
                                        {req.pet.photo_url ? <img src={req.pet.photo_url} alt="" className="w-full h-full object-cover" /> : "🐾"}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-red-900 uppercase">{req.pet.name} <span className="text-xs opacity-50">({req.pet.species})</span></h3>
                                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Gravedad: {req.severity}</p>
                                    </div>
                                </div>
                                <p className="bg-white/50 p-4 rounded-2xl text-sm font-bold text-red-800 italic">"{req.description}"</p>
                                <button
                                    onClick={() => handleAccept(req.id)}
                                    disabled={loadingId === req.id}
                                    className="w-full py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg hover:bg-red-700 active:scale-95 transition-all uppercase tracking-widest text-xs"
                                >
                                    {loadingId === req.id ? "Aceptando..." : "ACEPTAR CASO 🚨"}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
