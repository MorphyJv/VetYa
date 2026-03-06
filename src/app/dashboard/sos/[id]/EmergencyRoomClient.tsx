"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, resolveEmergency } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Consistent emergency contacts
const QUICK_VETS = [
    { name: "Emergencias Nacionales", number: "105", icon: "🚑" },
    { name: "Clínica Vet Perú 24h", number: "+51 1 344-3030", icon: "🏥" },
    { name: "Animal Care Lima", number: "+51 1 222-5678", icon: "🩺" },
    { name: "VetCenter Emergencias", number: "+51 944 000 111", icon: "🐾" },
];

export default function EmergencyRoomClient({
    emergency,
    initialMessages,
    currentUserId,
    isVet,
    availableVets = [],
    allPets = []
}: {
    emergency: any;
    initialMessages: any[];
    currentUserId: string;
    isVet: boolean;
    availableVets?: any[];
    allPets?: any[];
}) {
    const router = useRouter();
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Supabase Realtime Subscription
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel(`emergency_${emergency.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'emergency_messages',
                    filter: `emergency_id=eq.${emergency.id}`
                },
                async (payload) => {
                    const newMsg = payload.new;
                    const sender_name = newMsg.sender_id === emergency.owner_id ? emergency.owner.display_name : (emergency.vet?.display_name || "Veterinario");
                    const augmentedMessage = {
                        ...newMsg,
                        sender: {
                            display_name: sender_name,
                            role: newMsg.sender_id === emergency.owner_id ? 'owner' : 'vet'
                        }
                    };
                    setMessages(prev => [...prev, augmentedMessage]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [emergency.id, emergency.owner_id, emergency.vet, emergency.owner.display_name]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || emergency.status === "RESOLVED") return;
        setLoading(true);
        const text = input;
        setInput("");
        await sendMessage(emergency.id, text);
        setLoading(false);
    };

    const handleResolve = async () => {
        if (confirm("¿Confirmas que la emergencia ha sido resuelta?")) {
            await resolveEmergency(emergency.id);
            router.push("/dashboard/sos");
        }
    };

    const isResolved = emergency.status === "RESOLVED";

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* ── TOP: Emergency Dashboard ── */}
            <div className="p-4 md:p-6 space-y-4 shrink-0">
                <div className="grid lg:grid-cols-2 gap-4">
                    {/* LEFT: Pets List (Restored Width) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-[28px] p-5 border border-[var(--vy-neutral-100)] shadow-sm flex flex-col h-[320px]"
                    >
                        <div className="flex items-center gap-2 mb-3 px-2 shrink-0">
                            <span className="text-2xl">🐾</span>
                            <h3 className="text-xs uppercase font-black text-[var(--vy-neutral-500)] tracking-widest leading-tight">Tus Mascotas</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {allPets.map((pet) => {
                                const isCrisis = emergency.pet.id === pet.id;
                                return (
                                    <div key={pet.id} className={`flex items-center gap-4 p-3 rounded-2xl border transition-colors ${isCrisis ? 'bg-red-50/50 border-red-100' : 'bg-[var(--vy-neutral-50)] border-transparent'}`}>
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl overflow-hidden shrink-0 ${isCrisis ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-white'}`}>
                                            {pet.photo_url ? (
                                                <img src={pet.photo_url} alt="" className="w-full h-full object-cover" />
                                            ) : "🐾"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <h4 className={`font-bold text-sm uppercase truncate ${isCrisis ? 'text-red-600' : 'text-[var(--vy-neutral-800)]'}`}>{pet.name}</h4>
                                                {isCrisis && (
                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 ${emergency.severity === 'CRITICAL' ? 'bg-red-500 animate-pulse' : emergency.severity === 'MODERATE' ? 'bg-orange-400' : 'bg-yellow-400'}`}>
                                                        {emergency.severity[0]}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-[9px] font-bold uppercase tracking-widest truncate ${isCrisis ? 'text-red-400' : 'text-[var(--vy-neutral-400)]'}`}>
                                                {pet.species}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* RIGHT: Quick Calls - HIGHLIGHTED & EVEN TALLER */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border border-[var(--vy-neutral-100)] rounded-[28px] p-6 shadow-sm flex flex-col h-[320px]"
                    >
                        <div className="flex items-center gap-3 mb-5 px-2 shrink-0">
                            <span className="text-red-500 bg-red-50 w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0">🚨</span>
                            <div className="flex flex-col">
                                <h3 className="text-base md:text-lg uppercase font-black text-[var(--vy-neutral-900)] tracking-tight">Asistencia Inmediata</h3>
                                <p className="text-[var(--vy-neutral-500)] text-xs font-medium">Llama directamente pulsando un botón</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
                            {QUICK_VETS.map((vet) => (
                                <a
                                    key={vet.number}
                                    href={`tel:${vet.number.replace(/\s/g, "")}`}
                                    className="flex items-center gap-4 p-3 bg-[var(--vy-neutral-50)] hover:bg-white border border-transparent hover:border-[var(--vy-neutral-100)] shadow-sm hover:shadow rounded-[20px] transition-all active:scale-95 group"
                                >
                                    <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center text-2xl shrink-0 group-hover:bg-red-50 transition-colors">
                                        {vet.icon}
                                    </div>
                                    <div className="min-w-0 flex flex-col justify-center flex-1">
                                        <p className="text-[10px] font-bold text-[var(--vy-neutral-500)] uppercase tracking-widest truncate leading-tight mb-0.5">{vet.name}</p>
                                        <p className="text-base font-black text-red-600 leading-none">{vet.number}</p>
                                    </div>
                                </a>
                            ))}

                            {/* Maps Button Ayacucho (Integrated into Grid) */}
                            <a
                                href="https://www.google.com/maps/search/veterinaria+cerca+de+mi+Ayacucho"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-3 bg-[var(--vy-neutral-900)] hover:bg-[var(--vy-neutral-800)] shadow-sm rounded-[20px] transition-all active:scale-95 group sm:col-span-2"
                            >
                                <div className="w-12 h-12 rounded-[14px] bg-white/10 flex items-center justify-center text-2xl shrink-0 transition-colors">
                                    📍
                                </div>
                                <div className="min-w-0 flex flex-col justify-center flex-1">
                                    <p className="text-[10px] font-bold text-[var(--vy-neutral-400)] uppercase tracking-widest truncate leading-tight mb-0.5">Buscar en Mapa</p>
                                    <p className="text-sm font-black text-white leading-none">Veterinarias en Ayacucho</p>
                                </div>
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Status Bar & Contact */}
                <div className="bg-white px-5 py-4 rounded-3xl border border-[var(--vy-neutral-200)] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${isResolved ? 'bg-[var(--vy-success)]' : 'bg-orange-400 animate-pulse'}`} />
                        <div>
                            <p className="text-[10px] font-black text-[var(--vy-neutral-400)] uppercase tracking-widest">{emergency.status === "PENDING" ? "EN ESPERA" : isResolved ? "RESUELTO" : "EN ATENCIÓN"}</p>
                            <p className="text-sm font-black text-[var(--vy-neutral-800)] uppercase tracking-tight">
                                {isVet ? `Dueño: ${emergency.owner.display_name}` : emergency.vet ? `Vet: ${emergency.vet.display_name}` : "Buscando Veterinario..."}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {((isVet && emergency.owner.phone) || (!isVet && emergency.vet?.phone)) && (
                            <>
                                <a
                                    href={`tel:${(isVet ? emergency.owner.phone : emergency.vet?.phone).replace(/\s/g, "")}`}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
                                >
                                    📞 Llamar
                                </a>
                                <a
                                    href={`https://wa.me/${(isVet ? emergency.owner.phone : emergency.vet?.phone).replace(/\+/g, "").replace(/\s/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-widest hover:bg-green-100 transition-all active:scale-95"
                                >
                                    💬 WhatsApp
                                </a>
                            </>
                        )}
                        {!isResolved && !isVet && (
                            <button
                                onClick={handleResolve}
                                className="text-[10px] font-black text-[var(--vy-neutral-400)] uppercase hover:text-red-600 transition-colors ml-4"
                            >
                                Finalizar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Chat Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6 space-y-4">
                <div className="text-center my-6">
                    <span className="px-4 py-1.5 bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-100)] rounded-full text-[10px] font-black tracking-[0.2em] text-[var(--vy-neutral-300)] uppercase">
                        Sala de comunicación
                    </span>
                </div>

                {messages.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                        <div className="w-16 h-16 rounded-full bg-[var(--vy-neutral-100)] flex items-center justify-center text-3xl mb-4">💬</div>
                        <p className="text-sm font-medium">No hay mensajes aún.<br />Describe la situación detalladamente.</p>
                    </div>
                )}

                {messages.map((msg, idx) => {
                    const isMine = msg.sender_id === currentUserId;
                    const isVetSender = msg.sender.role === 'vet';
                    return (
                        <motion.div
                            key={msg.id || idx}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex flex-col max-w-[85%] ${isMine ? "self-end items-end ml-auto" : "self-start items-start mr-auto"}`}
                        >
                            <div className={`px-5 py-3 rounded-3xl shadow-sm text-sm border ${isMine
                                ? "bg-[var(--vy-primary-600)] text-white border-[var(--vy-primary-700)] rounded-br-md"
                                : isVetSender
                                    ? "bg-red-50 text-red-900 border-red-100 rounded-bl-md"
                                    : "bg-white text-[var(--vy-neutral-900)] border-[var(--vy-neutral-200)] rounded-bl-md"
                                }`}>
                                {msg.content}
                            </div>
                            <div className="flex items-center gap-2 mt-1 px-2">
                                <span className="text-[9px] font-bold text-[var(--vy-neutral-400)] uppercase tracking-widest italic">
                                    {isMine ? 'Tú' : msg.sender.display_name}
                                </span>
                                <span className="text-[9px] text-[var(--vy-neutral-300)]">
                                    {new Date(msg.sent_at || Date.now()).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* ── Input box ── */}
            <div className="p-4 md:p-6 bg-white border-t border-[var(--vy-neutral-200)] shrink-0">
                <form onSubmit={handleSend} className="relative group max-w-3xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={isResolved ? "Caso cerrado" : "Describe la urgencia o responde aquí..."}
                        disabled={isResolved || loading}
                        className="w-full bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-200)] rounded-full py-4 pl-7 pr-16 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:bg-white transition-all shadow-inner disabled:opacity-50"
                    />
                    <motion.button
                        layout
                        type="submit"
                        disabled={!input.trim() || isResolved || loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-200 disabled:opacity-0 transition-opacity"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </motion.button>
                </form>
            </div>
        </div>
    );
}
