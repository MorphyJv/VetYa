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
            className="w-full max-w-lg bg-white border border-[var(--vy-neutral-100)] rounded-[40px] p-8 shadow-2xl flex flex-col"
        >
            <div className="flex items-center gap-4 mb-8">
                {onBack && (
                    <button onClick={onBack} className="w-10 h-10 rounded-full bg-[var(--vy-neutral-50)] flex items-center justify-center text-xl hover:bg-[var(--vy-neutral-100)] transition-all">←</button>
                )}
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl shadow-inner ml-auto lg:ml-0">📞</div>
                <h2 className="text-2xl font-black text-[var(--vy-neutral-900)] tracking-tight">Atención Rápida</h2>
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
                        <div key={vet.number} className="snap-center shrink-0 w-[85vw] md:w-auto flex items-center gap-4 p-5 bg-[var(--vy-neutral-50)] rounded-[28px] border border-[var(--vy-neutral-100)] hover:border-red-200 transition-all hover:shadow-md group">
                            <span className="text-2xl w-14 h-14 flex items-center justify-center bg-white border border-[var(--vy-neutral-100)] rounded-2xl group-hover:scale-105 transition-transform">{vet.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-[var(--vy-neutral-500)] uppercase tracking-widest truncate">{vet.name}</p>
                                <p className="text-lg font-black text-[var(--vy-neutral-800)] truncate tracking-tight">{vet.number}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={`tel:${vet.number.replace(/\s/g, "")}`}
                                    className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center border border-[var(--vy-neutral-100)] hover:bg-red-50 hover:border-red-200 transition-all active:scale-90"
                                >
                                    📞
                                </a>
                                <a
                                    href={`https://wa.me/${vet.number.replace(/\+/g, "").replace(/\s/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-2xl bg-white text-green-600 flex items-center justify-center border border-[var(--vy-neutral-100)] hover:bg-green-50 hover:border-green-200 transition-all active:scale-90"
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

    /* ── Active emergency view ── */
    if (activeEmergencies.length > 0) {
        const active = activeEmergencies[0];
        return (
            <div className="flex flex-col items-center pt-8 pb-20 px-6 min-h-screen bg-[var(--vy-neutral-50)]">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-lg z-10 flex flex-col items-center text-center p-10 bg-white rounded-[40px] border border-[var(--vy-neutral-100)] shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
                    <h2 className="text-2xl font-black text-[var(--vy-neutral-800)] mb-2 tracking-tight uppercase">Emergencia en Curso</h2>
                    <p className="text-sm text-[var(--vy-neutral-500)] mb-10 font-bold">
                        Tu mascota <span className="text-red-500 font-black">{active.pet.name}</span> está siendo atendida.
                    </p>

                    <Link href={`/dashboard/sos/${active.id}`} className="group relative flex flex-col items-center justify-center outline-none">
                        <div className="relative flex items-center justify-center mb-8">
                            <motion.div className="absolute rounded-full bg-red-500/20" animate={{ scale: [1, 1.4, 2], opacity: [0.6, 0.2, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} style={{ width: "160px", height: "160px" }} />
                            <motion.div className="relative z-10 w-40 h-40 rounded-full bg-red-500 shadow-xl flex items-center justify-center border-[6px] border-white group-hover:bg-red-600 transition-transform active:scale-95">
                                <svg viewBox="0 0 24 24" className="w-20 h-20 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </motion.div>
                        </div>
                        <h3 className="text-5xl font-black text-[var(--vy-neutral-800)] uppercase leading-none">SOS</h3>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500 mt-4 animate-pulse">Entrar al Chat</p>
                    </Link>
                </motion.div>

                <div className="mt-12 w-full flex justify-center">
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
                        className="max-w-4xl mx-auto flex flex-col items-center py-10"
                    >
                        <div className="flex items-center gap-4 mb-12 w-full max-w-lg">
                            <button onClick={handleBack} className="w-14 h-14 rounded-2xl bg-white border border-[var(--vy-neutral-100)] flex items-center justify-center shadow-sm hover:bg-[var(--vy-neutral-50)] transition-all">←</button>
                            <h2 className="text-3xl font-black text-[var(--vy-neutral-900)] tracking-tight">¿Cómo podemos ayudarte?</h2>
                        </div>

                        <div className="flex overflow-x-auto md:grid md:grid-cols-2 gap-6 w-full pb-8 px-4 -mx-4 scrollbar-hide snap-x snap-mandatory items-stretch">
                            <button
                                onClick={() => setStep(1)}
                                className="snap-center shrink-0 w-[85vw] md:w-auto bg-white p-10 rounded-[45px] border-2 border-transparent hover:border-red-500 shadow-xl transition-all hover:scale-[1.03] group flex flex-col items-center text-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-5xl mb-6 shadow-inner group-hover:bg-red-500 group-hover:text-white transition-all">🚑</div>
                                <h3 className="text-2xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight mb-2">Emergencia SOS</h3>
                                <p className="text-sm font-bold text-[var(--vy-neutral-500)] max-w-[200px]">Notifica automáticamente a los veterinarios de la red.</p>
                                <div className="mt-auto pt-8 px-6 py-3 bg-red-100 text-red-600 rounded-full text-xs font-black uppercase tracking-widest">Proceder</div>
                            </button>

                            <button
                                onClick={() => setStep("atencion")}
                                className="snap-center shrink-0 w-[85vw] md:w-auto bg-white p-10 rounded-[45px] border-2 border-transparent hover:border-[var(--vy-neutral-900)] shadow-xl transition-all hover:scale-[1.03] group flex flex-col items-center text-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-[var(--vy-neutral-50)] text-[var(--vy-neutral-900)] flex items-center justify-center text-5xl mb-6 shadow-inner group-hover:bg-[var(--vy-neutral-900)] group-hover:text-white transition-all">📞</div>
                                <h3 className="text-2xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight mb-2">Atención Rápida</h3>
                                <p className="text-sm font-bold text-[var(--vy-neutral-500)] max-w-[200px]">Llamada directa o WhatsApp con veterinarios especialistas.</p>
                                <div className="mt-auto pt-8 px-6 py-3 bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] rounded-full text-xs font-black uppercase tracking-widest">Ver Números</div>
                            </button>
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl mx-auto pt-10"
                    >
                        <div className="bg-white rounded-[40px] p-10 border border-[var(--vy-neutral-100)] shadow-2xl">
                            <div className="flex items-center gap-6 mb-12">
                                <button onClick={handleBack} className="w-14 h-14 rounded-2xl bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-100)] flex items-center justify-center text-2xl font-bold hover:bg-[var(--vy-neutral-100)] transition-all">←</button>
                                <h2 className="text-3xl font-black text-[var(--vy-neutral-900)] tracking-tight">Elige tu Mascota</h2>
                            </div>
                            <div className="flex overflow-x-auto md:grid gap-5 pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                                {pets.map((pet) => (
                                    <button
                                        key={pet.id}
                                        onClick={() => { setFormData({ ...formData, pet_id: pet.id }); handleNext(); }}
                                        className={`snap-center shrink-0 w-[85vw] md:w-full p-6 rounded-[32px] border-2 text-left flex items-center gap-6 transition-all ${formData.pet_id === pet.id ? "border-red-500 bg-red-50 shadow-lg scale-[1.02]" : "border-[var(--vy-neutral-50)] bg-[var(--vy-neutral-50)] hover:border-[var(--vy-neutral-100)]"}`}
                                    >
                                        <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-4xl overflow-hidden shadow-sm border border-[var(--vy-neutral-100)]">
                                            {pet.photo_url ? <img src={pet.photo_url} alt="" className="w-full h-full object-cover" /> : "🐾"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-[var(--vy-neutral-900)] text-xl uppercase tracking-tight truncate">{pet.name}</h3>
                                            <p className="text-[10px] font-black text-[var(--vy-neutral-400)] uppercase tracking-widest mt-1">{pet.species}</p>
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
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-xl mx-auto pt-10"
                    >
                        <div className="bg-white rounded-[40px] p-10 border border-[var(--vy-neutral-100)] shadow-2xl space-y-10">
                            <div className="flex items-center gap-6">
                                <button onClick={handleBack} disabled={loading} className="w-14 h-14 rounded-full bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-100)] flex items-center justify-center text-2xl font-bold hover:bg-[var(--vy-neutral-100)] transition-all">←</button>
                                <h2 className="text-3xl font-black text-[var(--vy-neutral-900)] tracking-tight">¿Qué ocurre?</h2>
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-[var(--vy-neutral-400)] ml-4">Descripción de la situación</label>
                                <textarea
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Explica qué le sucede a tu mascota..."
                                    className="w-full p-8 rounded-[35px] bg-[var(--vy-neutral-50)] border-2 border-transparent focus:border-red-400 focus:bg-white outline-none resize-none font-medium text-base transition-all shadow-inner"
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !formData.description.trim()}
                                className="w-full py-6 bg-red-500 text-white font-black rounded-full text-lg hover:bg-red-600 active:scale-95 shadow-xl shadow-red-200 transition-all disabled:opacity-50 uppercase tracking-[0.2em]"
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
