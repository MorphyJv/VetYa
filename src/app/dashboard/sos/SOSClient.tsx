"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createEmergencyRequest } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

const QUICK_VETS = [
    { name: "Principal Dr. Veterinario", number: "+51 999 999 999", icon: "👨‍⚕️" },
    { name: "Dra. Veterinaria de Turno", number: "+51 888 888 888", icon: "👩‍⚕️" },
    { name: "Clínica Vet 24 Horas", number: "+51 777 777 777", icon: "🏥" },
];

function QuickCallPanel({ onBack }: { onBack?: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[var(--surface)] border-2 border-[var(--vy-neutral-900)] rounded-[40px] p-8 shadow-2xl flex flex-col"
        >
            <div className="flex items-center gap-4 mb-8">
                {onBack && (
                    <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-100)] flex items-center justify-center text-xl hover:bg-[var(--vy-neutral-100)] transition-all">←</button>
                )}
                <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center text-lg shadow-sm ml-auto lg:ml-0">📞</div>
                <h2 className="text-xl font-black text-[var(--vy-neutral-900)] tracking-tight">Atención Rápida</h2>
            </div>

            <a
                href="tel:+51000000000"
                className="w-full mb-10 bg-red-500 hover:bg-red-600 text-white rounded-[28px] p-8 flex flex-col items-center justify-center shadow-lg transition-all active:scale-95 group relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20 animate-pulse" />
                <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">🚨</span>
                <span className="text-2xl font-black tracking-wide uppercase">Llamar Ahora</span>
                <span className="text-sm font-medium text-red-100 mt-1 opacity-80">Línea de emergencia directa</span>
            </a>

            <div className="flex-1">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-[11px] font-black text-[var(--vy-neutral-400)] uppercase tracking-widest">Contactar Veterinaros</h3>
                    <div className="h-px flex-1 bg-[var(--vy-neutral-100)] ml-4" />
                </div>

                <div className="flex overflow-x-auto md:flex-col gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                    {QUICK_VETS.map((vet) => (
                        <div key={vet.number} className="snap-center shrink-0 w-[85vw] md:w-auto flex items-center gap-4 p-5 bg-[var(--vy-neutral-900)] rounded-[28px] border border-white/5 shadow-xl transition-all hover:scale-[1.02] group">
                            <span className="text-2xl w-14 h-14 flex items-center justify-center bg-white rounded-2xl shrink-0">{vet.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-[var(--vy-neutral-400)] uppercase tracking-widest truncate">{vet.name}</p>
                                <p className="text-lg font-black text-white truncate tracking-tight">{vet.number}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={`tel:${vet.number.replace(/\s/g, "")}`}
                                    className="w-12 h-12 rounded-2xl bg-white text-[var(--vy-neutral-900)] flex items-center justify-center hover:bg-red-50 transition-all active:scale-90"
                                >
                                    📞
                                </a>
                                <a
                                    href={`https://wa.me/${vet.number.replace(/\+/g, "").replace(/\s/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-2xl bg-white text-[var(--vy-neutral-900)] flex items-center justify-center hover:bg-green-50 transition-all active:scale-90"
                                >
                                    💬
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default function SOSClient({
    pets,
    activeEmergencies,
}: {
    pets: any[];
    activeEmergencies: any[];
}) {
    const router = useRouter();
    const [step, setStep] = useState<0 | "choice" | "atencion" | 1 | 2>(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        pet_id: "",
        description: "",
        severity: "MODERATE",
    });

    const handleNext = () => {
        if (step === 0) setStep("choice");
        else if (step === "choice") setStep(1);
        else if (step === 1) setStep(2);
    };

    const handleBack = () => {
        if (step === "choice" || step === "atencion") setStep(0);
        else if (step === 1) setStep("choice");
        else if (step === 2) setStep(1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const data = new FormData();
        data.append("pet_id", formData.pet_id);
        data.append("description", formData.description);
        data.append("severity", formData.severity);
        const res = await createEmergencyRequest(data);
        if (!res.error) {
            router.push(`/dashboard/sos/${res.data.id}`);
        } else {
            setLoading(false);
            alert(res.error);
        }
    };

    if (activeEmergencies.length > 0) {
        const active = activeEmergencies[0];
        return (
            <div className="flex flex-col items-center pt-8 pb-20 px-4 min-h-screen bg-[var(--surface)]">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-2xl bg-[var(--surface)] rounded-[40px] border-2 border-[var(--vy-neutral-900)] shadow-2xl relative overflow-hidden flex flex-col items-center p-12 text-center"
                >
                    <div className="absolute top-0 left-0 w-full h-3 bg-red-500" />
                    <h2 className="text-3xl font-black text-[var(--vy-neutral-900)] mb-4 tracking-tight uppercase">Emergencia en Curso</h2>
                    <p className="text-base text-[var(--vy-neutral-500)] mb-12 font-bold">
                        Tu mascota <span className="text-red-500 font-black tracking-widest">{active.pet.name.toUpperCase()}</span> está siendo atendida.
                    </p>

                    <Link href={`/dashboard/sos/${active.id}`} className="group relative flex flex-col items-center justify-center outline-none">
                        <div className="relative flex items-center justify-center mb-10">
                            <motion.div className="absolute rounded-full bg-red-500/10" animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: "200px", height: "200px" }} />
                            <motion.div className="relative z-10 w-48 h-48 rounded-full bg-red-500 shadow-2xl flex items-center justify-center border-[8px] border-white group-hover:bg-red-600 transition-all active:scale-95">
                                <svg viewBox="0 0 24 24" className="w-24 h-24 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </motion.div>
                        </div>
                        <h3 className="text-6xl font-black text-[var(--vy-neutral-900)] uppercase leading-none italic tracking-tighter">SOS</h3>
                        <p className="text-xs font-black uppercase tracking-[0.6em] text-red-500 mt-6 animate-pulse">Entrar al Chat</p>
                    </Link>
                </motion.div>

                <div className="mt-12 w-full flex justify-center max-w-2xl">
                    <QuickCallPanel />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 py-8 md:px-8">
            <AnimatePresence mode="wait">
                {step === 0 && (
                    <motion.div
                        key="step-0"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[85vh] py-10"
                    >
                        <div className="relative flex items-center justify-center">
                            {/* --- Pulse rings --- */}
                            <motion.div className="absolute rounded-full bg-red-500/15" animate={{ scale: [1, 1.8, 2.5], opacity: [0.4, 0.15, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut", delay: 0 }} style={{ width: "min(90vw, 480px)", height: "min(90vw, 480px)" }} />
                            <motion.div className="absolute rounded-full bg-red-500/10" animate={{ scale: [1, 1.5, 2.0], opacity: [0.5, 0.2, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut", delay: 0.4 }} style={{ width: "min(80vw, 420px)", height: "min(80vw, 420px)" }} />
                            <motion.div className="absolute rounded-full bg-red-400/20" animate={{ scale: [1, 1.3, 1.6], opacity: [0.6, 0.3, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut", delay: 0.8 }} style={{ width: "min(70vw, 360px)", height: "min(70vw, 360px)" }} />

                            {/* --- Main SOS Button --- */}
                            <motion.button
                                onClick={handleNext}
                                whileTap={{ scale: 0.92 }}
                                className="relative z-10 rounded-full bg-red-500 flex items-center justify-center text-white border-[10px] border-white shadow-[0_25px_70px_-10px_rgba(239,68,68,0.6)] hover:bg-red-600 transition-colors group"
                                style={{ width: "min(75vw, 380px)", height: "min(75vw, 380px)" }}
                            >
                                {/* Siren SVG icon */}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-2/5 h-2/5 group-hover:scale-110 transition-transform">
                                    <path d="M7 16V10a5 5 0 0 1 10 0v6" />
                                    <rect x="5" y="16" width="14" height="4" rx="1" />
                                    <path d="M12 2v2" />
                                    <path d="M18.36 5.64l-1.42 1.42" />
                                    <path d="M5.64 5.64l1.42 1.42" />
                                </svg>
                            </motion.button>
                        </div>

                        {/* Text below button */}
                        <div className="text-center mt-12 space-y-3">
                            <h1 className="text-8xl font-black text-[var(--vy-neutral-900)] tracking-tighter leading-none italic">SOS</h1>
                            <p className="text-[var(--vy-neutral-400)] text-sm font-black uppercase tracking-[0.5em] animate-pulse">Toca para pedir ayuda</p>
                        </div>
                    </motion.div>
                )}

                {step === "choice" && (
                    <motion.div
                        key="choice"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-xl mx-auto flex flex-col items-center py-6 space-y-10"
                    >
                        {/* Header with back */}
                        <div className="flex items-center gap-4 w-full">
                            <button onClick={handleBack} className="w-12 h-12 rounded-2xl bg-[var(--surface)] border-2 border-[var(--vy-neutral-900)] flex items-center justify-center shadow-sm hover:bg-[var(--vy-neutral-50)] transition-all">←</button>
                            <h2 className="text-xl font-black text-[var(--vy-neutral-900)] tracking-tight">Opciones SOS</h2>
                        </div>

                        {/* --- CARD 1: INICIAR EMERGENCIA (Styled like the "Emergencia en curso" card) --- */}
                        <div className="w-full bg-[var(--surface)] rounded-[40px] border-2 border-[var(--vy-neutral-900)] shadow-2xl relative overflow-hidden flex flex-col items-center p-10 text-center">
                            <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
                            <h3 className="text-xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight mb-2">Solicitar Ambulancia</h3>
                            <p className="text-xs font-bold text-[var(--vy-neutral-400)] mb-10 max-w-[240px]">
                                Al activar el sistema, todos los veterinarios de la red recibirán tu ubicación.
                            </p>

                            <button
                                onClick={() => setStep(1)}
                                className="group relative flex flex-col items-center justify-center outline-none mb-4"
                            >
                                <div className="relative flex items-center justify-center mb-10">
                                    <motion.div className="absolute rounded-full bg-red-500/10" animate={{ scale: [1, 1.4], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} style={{ width: "140px", height: "140px" }} />
                                    <div className="relative z-10 w-32 h-32 rounded-full bg-red-500 shadow-xl flex items-center justify-center border-[6px] border-white group-hover:scale-105 transition-transform active:scale-95">
                                        <svg viewBox="0 0 24 24" className="w-16 h-16 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-4xl font-black text-[var(--vy-neutral-900)] uppercase leading-none">SOS</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mt-4">Iniciar Protocolo</p>
                            </button>
                        </div>

                        {/* --- CARD 2: ATENCIÓN RÁPIDA (Directly visible) --- */}
                        <div className="w-full">
                            <QuickCallPanel />
                        </div>
                    </motion.div>
                )}

                {step === "atencion" && (
                    <div className="flex justify-center py-10">
                        <QuickCallPanel onBack={handleBack} />
                    </div>
                )}

                {step === 1 && (
                    <motion.div
                        key="step-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-xl mx-auto pt-10"
                    >
                        <div className="bg-[var(--surface)] rounded-[40px] p-8 border-2 border-[var(--vy-neutral-900)] shadow-2xl">
                            <div className="flex items-center gap-6 mb-10">
                                <button onClick={handleBack} className="w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--vy-neutral-200)] flex items-center justify-center text-xl font-bold shadow-sm hover:bg-[var(--vy-neutral-50)] transition-all">←</button>
                                <h2 className="text-xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight">Elige tu Mascota</h2>
                            </div>
                            <div className="grid gap-4">
                                {pets.map((pet) => (
                                    <button
                                        key={pet.id}
                                        onClick={() => { setFormData({ ...formData, pet_id: pet.id }); handleNext(); }}
                                        className={`p-5 rounded-[28px] border-2 text-left flex items-center gap-6 transition-all ${formData.pet_id === pet.id ? "border-red-500 bg-red-50/10" : "border-transparent bg-[var(--vy-neutral-50)] hover:border-[var(--vy-neutral-100)]"}`}
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] border-2 border-[var(--vy-neutral-100)] shadow-md overflow-hidden shrink-0">
                                            {pet.photo_url ? <img src={pet.photo_url} alt="" className="w-full h-full object-cover" /> : "🐾"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-[var(--vy-neutral-900)] text-base uppercase tracking-tight truncate">{pet.name}</h3>
                                            <p className="text-[9px] font-black text-[var(--vy-neutral-400)] uppercase tracking-widest mt-0.5">{pet.species}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-xl mx-auto pt-10"
                    >
                        <div className="bg-[var(--surface)] rounded-[40px] p-8 border-2 border-[var(--vy-neutral-900)] shadow-2xl space-y-8">
                            <div className="flex items-center gap-6">
                                <button onClick={handleBack} disabled={loading} className="w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--vy-neutral-200)] flex items-center justify-center text-xl font-bold shadow-sm hover:bg-[var(--vy-neutral-50)] transition-all">←</button>
                                <h2 className="text-xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight">¿Qué ocurre?</h2>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--vy-neutral-400)] ml-2">Descripción de la situación</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Explica brevemente qué sucede..."
                                    className="w-full p-6 rounded-[28px] bg-[var(--vy-neutral-50)] border-2 border-transparent focus:border-red-400 focus:bg-white outline-none resize-none font-bold text-sm transition-all"
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !formData.description.trim()}
                                className="w-full py-5 bg-red-500 text-white font-black rounded-full text-base hover:bg-red-600 active:scale-95 shadow-xl shadow-red-200 transition-all disabled:opacity-50 uppercase tracking-[0.2em]"
                            >
                                {loading ? "Conectando..." : "ENVIAR SOS"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
