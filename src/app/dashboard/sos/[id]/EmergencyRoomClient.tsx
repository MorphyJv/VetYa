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
        <div className="flex flex-col h-full bg-[var(--surface)] font-sans overflow-hidden">
            {/* Centered Content Container */}
            <div className="flex-1 flex flex-col w-full max-w-[1100px] mx-auto overflow-hidden relative">
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                    {/* Top Section with balance */}
                    <div className="p-6 space-y-8">
                        {/* ── TOP: DASHBOARD ZONES ── */}
                        <div className="grid md:grid-cols-[1fr_1.3fr] gap-6 shrink-0">
                            {/* LEFT: TUS MASCOTAS */}
                            <div className="bg-[var(--surface)] rounded-[40px] border-2 border-[var(--vy-neutral-900)] p-8 flex flex-col h-[280px] shadow-lg">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="text-2xl">🐾</span>
                                    <h3 className="text-[12px] font-black text-[var(--vy-neutral-400)] uppercase tracking-[0.3em]">Tus Mascotas</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                                    {allPets.map((pet) => {
                                        const isCrisis = emergency.pet.id === pet.id;
                                        return (
                                            <div key={pet.id} className={`flex items-center gap-5 p-5 rounded-[28px] border-2 transition-all ${isCrisis ? 'bg-red-500/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-[var(--vy-neutral-50)] border-transparent'}`}>
                                                <div className="w-16 h-16 rounded-[22px] overflow-hidden border-2 border-[var(--surface)] shadow-md shrink-0">
                                                    {pet.photo_url ? (
                                                        <img src={pet.photo_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-[var(--vy-neutral-100)] flex items-center justify-center text-3xl">🐾</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`font-black text-base uppercase tracking-tight truncate ${isCrisis ? 'text-red-500' : 'text-[var(--vy-neutral-900)]'}`}>{pet.name}</h4>
                                                    <p className="text-[10px] font-black text-[var(--vy-neutral-400)] uppercase tracking-widest">{pet.species}</p>
                                                </div>
                                                {isCrisis && <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-xs text-white font-black animate-pulse">!</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* RIGHT: ASISTENCIA INMEDIATA */}
                            <div className="bg-[var(--surface)] rounded-[40px] border-2 border-[var(--vy-neutral-900)] p-8 flex flex-col h-[280px] shadow-lg">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="text-2xl">🚨</span>
                                    <div>
                                        <h3 className="text-sm font-black text-[var(--vy-neutral-900)] uppercase tracking-tight">Asistencia Inmediata</h3>
                                        <p className="text-[9px] font-bold text-[var(--vy-neutral-400)] uppercase">Soporte directo 24/7</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto scrollbar-hide">
                                    {QUICK_VETS.map((vet) => (
                                        <a
                                            key={vet.number}
                                            href={`tel:${vet.number.replace(/\s/g, "")}`}
                                            className="flex items-center gap-4 p-4 bg-[var(--vy-neutral-900)] rounded-[24px] hover:opacity-90 transition-all group border-2 border-transparent hover:border-red-500/50"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                                                {vet.icon}
                                            </div>
                                            <div className="min-w-0 flex flex-col">
                                                <p className="text-[8px] font-bold text-[var(--vy-neutral-400)] uppercase tracking-tighter truncate mb-1">{vet.name}</p>
                                                <p className="text-xs font-black text-red-500 truncate">{vet.number}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── MIDDLE: STATUS BAR ── */}
                        <div className="bg-[var(--surface)] rounded-[32px] border-2 border-[var(--vy-neutral-900)] px-8 py-5 flex items-center justify-between shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
                                <p className="text-xs font-black text-[var(--vy-neutral-900)] uppercase tracking-widest">
                                    <span className="text-[var(--vy-neutral-400)] mr-3">Estado SOS:</span>
                                    Dueño {emergency.owner.display_name} en espera de atención
                                </p>
                            </div>
                            {isResolved && (
                                <span className="text-xs font-black text-green-500 uppercase tracking-[0.2em] bg-green-500/10 px-4 py-1 rounded-full">Resuelto</span>
                            )}
                        </div>

                        {/* ── CHAT LABEL ── */}
                        <div className="flex flex-col items-center py-6">
                            <div className="bg-[var(--vy-neutral-900)] text-[var(--surface)] px-12 py-3 rounded-full text-[13px] font-black uppercase tracking-[0.5em] shadow-2xl border-2 border-[var(--vy-neutral-200)] text-center mb-4">
                                Sala de Comunicación
                            </div>
                            <div className="w-px h-12 bg-gradient-to-b from-[var(--vy-neutral-900)] to-transparent opacity-20" />
                        </div>

                        {/* ── CHAT MESSAGES AREA ── */}
                        <div className="space-y-6 pb-12">
                            {messages.length === 0 && (
                                <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
                                    <div className="text-6xl mb-6 grayscale animate-bounce">💬</div>
                                    <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[var(--vy-neutral-400)]">Esperando primer mensaje...</p>
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
                                        <div className={`px-8 py-5 rounded-[32px] shadow-sm text-sm font-bold leading-relaxed ${isMine
                                            ? "bg-[#e91e63] text-white rounded-br-none shadow-[0_10px_30px_rgba(233,30,99,0.15)]"
                                            : isVetSender
                                                ? "bg-red-500/10 text-red-500 border-2 border-red-500/20 rounded-bl-none"
                                                : "bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-900)] border-2 border-[var(--vy-neutral-200)] rounded-bl-none"
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <div className="flex items-center gap-3 mt-2 px-5">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${isMine ? 'text-[#e91e63]' : 'text-[var(--vy-neutral-400)]'}`}>
                                                {isMine ? 'Tú (Propietario)' : msg.sender.display_name}
                                            </span>
                                            <div className="w-1 h-1 rounded-full bg-[var(--vy-neutral-200)]" />
                                            <span className="text-[9px] font-bold text-[var(--vy-neutral-300)]">
                                                {new Date(msg.sent_at || Date.now()).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>

                {/* ── FOOTER: INPUT BOX ── */}
                <div className="p-8 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)] to-transparent shrink-0">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto">
                        <div className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder={isResolved ? "Caso cerrado" : "Escribe un mensaje aquí..."}
                                disabled={isResolved || loading}
                                className="w-full bg-[#1a1f2e] border-2 border-transparent focus:border-pink-500/30 rounded-full py-6 px-12 text-base text-white focus:outline-none transition-all shadow-2xl placeholder:text-[var(--vy-neutral-600)]"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isResolved || loading}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-pink-500 text-white shadow-lg active:scale-95 transition-all disabled:grayscale disabled:opacity-30"
                            >
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
