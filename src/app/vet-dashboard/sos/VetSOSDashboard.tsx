"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
    acceptEmergency,
    deriveEmergency,
    toggleVetAvailability,
    sendMessage,
    getEmergencyMessages,
} from "@/app/dashboard/sos/actions";

// ── Types ─────────────────────────────────────────────────────────────────────
type Emergency = {
    id: string;
    status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
    severity: "CRITICAL" | "MODERATE" | "MILD";
    description: string;
    created_at: string;
    pet: { id: string; name: string; species: string; photo_url: string | null; weight_kg: number | null };
    owner: { display_name: string; phone: string | null };
    assigned_vet_id: string | null;
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
    CRITICAL: { label: "CRÍTICO", bg: "bg-red-500/10 dark:bg-red-500/20", text: "text-red-600 dark:text-red-400", ring: "ring-red-500/30", dot: "bg-red-500" },
    MODERATE: { label: "MODERADO", bg: "bg-orange-500/10 dark:bg-orange-500/20", text: "text-orange-600 dark:text-orange-400", ring: "ring-orange-500/30", dot: "bg-orange-400" },
    MILD: { label: "LEVE", bg: "bg-yellow-500/10 dark:bg-yellow-500/20", text: "text-yellow-600 dark:text-yellow-400", ring: "ring-yellow-500/30", dot: "bg-yellow-400" },
};

function ElapsedTimer({ from }: { from: string }) {
    const [elapsed, setElapsed] = useState("");
    useEffect(() => {
        const update = () => {
            const diff = Date.now() - new Date(from).getTime();
            const m = Math.floor(diff / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setElapsed(`${m}m ${s}s`);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [from]);
    return <span>{elapsed}</span>;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function VetSOSDashboard({
    initialEmergencies,
    initialOnDuty,
    currentUserId,
}: {
    initialEmergencies: Emergency[];
    initialOnDuty: boolean;
    currentUserId: string;
}) {
    const [onDuty, setOnDuty] = useState(initialOnDuty);
    const [emergencies, setEmergencies] = useState<Emergency[]>(initialEmergencies);
    const [selected, setSelected] = useState<Emergency | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [msgInput, setMsgInput] = useState("");
    const [deriveModal, setDeriveModal] = useState(false);
    const [deriveNotes, setDeriveNotes] = useState("");
    const [loadingAction, setLoadingAction] = useState("");
    const [activeTab, setActiveTab] = useState<"chat" | "call">("chat");

    const supabase = createClient();

    // ── Real-time subscription ────────────────────────────────────────────────
    useEffect(() => {
        if (!onDuty) return;

        const channel = supabase
            .channel("vet-sos-radar")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "emergency_requests" },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        // New emergency — re-fetch enriched data from server
                        window.location.reload();
                    } else if (payload.eventType === "UPDATE") {
                        setEmergencies((prev) =>
                            prev.map((e) =>
                                e.id === (payload.new as any).id
                                    ? { ...e, ...(payload.new as any) }
                                    : e
                            )
                        );
                        setSelected((prev) =>
                            prev?.id === (payload.new as any).id
                                ? { ...prev, ...(payload.new as any) }
                                : prev
                        );
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [onDuty, supabase]);

    // ── Chat real-time ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!selected) return;

        getEmergencyMessages(selected.id).then((res) => setMessages(res.data || []));

        const channel = supabase
            .channel(`vet-chat-${selected.id}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "emergency_messages", filter: `emergency_id=eq.${selected.id}` },
                (payload) => setMessages((prev) => [...prev, payload.new as any])
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [selected?.id, supabase]);

    const handleToggleDuty = async () => {
        const next = !onDuty;
        setOnDuty(next);
        await toggleVetAvailability(next);
    };

    const handleAccept = async (id: string) => {
        setLoadingAction(id + "-accept");
        await acceptEmergency(id);
        setLoadingAction("");
    };

    const handleDerive = async () => {
        if (!selected) return;
        setLoadingAction(selected.id + "-derive");
        await deriveEmergency(selected.id, deriveNotes);
        setDeriveModal(false);
        setSelected(null);
        setLoadingAction("");
    };

    const handleSendMsg = async () => {
        if (!msgInput.trim() || !selected) return;
        const txt = msgInput;
        setMsgInput("");
        await sendMessage(selected.id, txt);
    };

    const pendingList = emergencies.filter((e) => e.status === "PENDING");
    const inProgressList = emergencies.filter(
        (e) => e.status === "IN_PROGRESS" && e.assigned_vet_id === currentUserId
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[85vh]">
            {/* ── Left Panel ─────────────────────────────────────────────── */}
            <div className="w-full lg:w-[500px] shrink-0 space-y-6">
                {/* Header + Toggle */}
                <div className="bg-[var(--surface)] rounded-[40px] p-8 border-2 border-[var(--border)] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-black text-[var(--vy-neutral-900)] flex items-center gap-3 uppercase tracking-tight">
                                Radar SOS
                                {onDuty && (
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                                    </span>
                                )}
                            </h1>
                            <p className="text-xs font-bold text-[var(--vy-neutral-400)] mt-1 uppercase tracking-widest">
                                {onDuty ? "Monitoreo en tiempo real" : "Guardia desactivada"}
                            </p>
                        </div>
                        {/* On-duty toggle */}
                        <button
                            onClick={handleToggleDuty}
                            className={`relative w-16 h-8 rounded-full transition-all duration-500 shadow-inner ${onDuty ? "bg-teal-500 shadow-teal-500/20" : "bg-[var(--vy-neutral-300)]"}`}
                        >
                            <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-xl transition-all duration-500 ease-out ${onDuty ? "translate-x-8" : "translate-x-0"}`} />
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${onDuty ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-500)]"}`}>
                            {onDuty ? "🟢 En Guardia" : "⚫ Fuera de Servicio"}
                        </span>
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-600 dark:text-red-400">
                            {pendingList.length} Alertas
                        </span>
                    </div>
                </div>

                {/* Emergency Triage Cards */}
                <div className="space-y-4">
                    {!onDuty && (
                        <div className="bg-[var(--surface)] rounded-[32px] p-12 text-center border-2 border-dashed border-[var(--border)] grayscale opacity-50">
                            <span className="text-4xl">😴</span>
                            <p className="text-xs font-black text-[var(--vy-neutral-500)] mt-4 uppercase tracking-widest">Guardia desactiva</p>
                        </div>
                    )}

                    {onDuty && pendingList.length === 0 && inProgressList.length === 0 && (
                        <div className="bg-[var(--surface)] rounded-[32px] p-12 text-center border-2 border-dashed border-[var(--border)]">
                            <span className="text-4xl mb-4 grayscale opacity-30">📡</span>
                            <p className="font-black text-[var(--vy-neutral-700)] text-sm uppercase tracking-tight">Radar despejado</p>
                            <p className="text-[10px] font-bold text-[var(--vy-neutral-400)] uppercase tracking-widest mt-1">Sin señales de emergencia</p>
                        </div>
                    )}

                    <AnimatePresence>
                        {[...pendingList, ...inProgressList].map((em) => {
                            const sv = SEVERITY_CONFIG[em.severity] || SEVERITY_CONFIG.MODERATE;
                            const isSelected = selected?.id === em.id;
                            return (
                                <motion.div
                                    key={em.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => setSelected(em)}
                                    className={`bg-[var(--surface)] rounded-[32px] p-6 border-2 cursor-pointer transition-all duration-300 group ${isSelected ? `border-teal-500 shadow-xl shadow-teal-500/10 scale-[1.02]` : "border-[var(--border)] hover:border-teal-500/30 shadow-sm"}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-20 h-20 rounded-[28px] bg-[var(--vy-neutral-100)] border-2 border-[var(--border)] flex items-center justify-center text-3xl shrink-0 overflow-hidden group-hover:scale-105 transition-transform shadow-sm">
                                            {em.pet?.photo_url
                                                // eslint-disable-next-line @next/next/no-img-element
                                                ? <img src={em.pet.photo_url} alt="" className="w-full h-full object-cover" />
                                                : em.pet?.species === "cat" ? "🐱" : "🐕"
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm ${sv.bg} ${sv.text}`}>
                                                    {sv.label}
                                                </span>
                                                {em.status === "IN_PROGRESS" && (
                                                    <span className="px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg bg-teal-500 text-white shadow-sm ring-2 ring-teal-500/20">ACTIVO</span>
                                                )}
                                            </div>
                                            <p className="font-black text-xl text-[var(--vy-neutral-900)] truncate tracking-tight uppercase">{em.pet?.name}</p>
                                            <p className="text-xs font-bold text-[var(--vy-neutral-500)] uppercase tracking-tighter">
                                                {em.pet?.species === "dog" ? "Canino" : em.pet?.species === "cat" ? "Felino" : em.pet?.species}
                                                {em.pet?.weight_kg ? ` · ${em.pet.weight_kg} kg` : ""}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-[10px] text-red-600 font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-red-500/5">
                                                <ElapsedTimer from={em.created_at} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    {isSelected && em.status === "PENDING" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 pt-6 border-t border-[var(--border)] flex gap-3"
                                        >
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleAccept(em.id); }}
                                                disabled={loadingAction === em.id + "-accept"}
                                                className="flex-1 py-3 rounded-2xl bg-teal-600 text-white text-xs font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 disabled:opacity-60 active:scale-95"
                                            >
                                                {loadingAction === em.id + "-accept" ? "Procesando..." : "✅ Tomar Caso"}
                                            </button>
                                            <a
                                                href={`tel:${em.owner?.phone || ""}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 text-lg hover:bg-blue-500/20 transition-all border border-blue-500/20 active:scale-95"
                                            >
                                                📞
                                            </a>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setDeriveModal(true); }}
                                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-500)] text-lg hover:bg-[var(--vy-neutral-200)] transition-all border border-[var(--border)] active:scale-95"
                                            >
                                                🔄
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Right Panel: Pre-consultation ───────────────────────────── */}
            <AnimatePresence>
                {selected && selected.status === "IN_PROGRESS" && selected.assigned_vet_id === currentUserId && (
                    <motion.div
                        key={selected.id}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex-1 bg-[var(--surface)] rounded-[40px] border-2 border-[var(--border)] shadow-sm overflow-hidden flex flex-col"
                    >
                        {/* Patient header */}
                        <div className="p-6 border-b border-[var(--border)] flex items-center gap-5 bg-teal-500/5">
                            <div className="w-16 h-16 rounded-full bg-[var(--surface)] border-2 border-teal-500 flex items-center justify-center text-3xl overflow-hidden shrink-0 shadow-lg">
                                {selected.pet?.photo_url
                                    // eslint-disable-next-line @next/next/no-img-element
                                    ? <img src={selected.pet.photo_url} alt="" className="w-full h-full object-cover" />
                                    : selected.pet?.species === "cat" ? "🐱" : "🐕"
                                }
                            </div>
                            <div>
                                <h2 className="font-black text-xl text-[var(--vy-neutral-900)] tracking-tight uppercase">{selected.pet?.name}</h2>
                                <p className="text-[10px] font-bold text-[var(--vy-neutral-500)] uppercase tracking-widest mt-1">
                                    En Triage Directo · {selected.owner?.display_name}
                                </p>
                            </div>
                            <div className="ml-auto">
                                <a href={`tel:${selected.owner.phone}`} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-teal-500 text-white shadow-lg active:scale-95 transition-transform">
                                    📞
                                </a>
                            </div>
                        </div>

                        {/* Symptom description */}
                        <div className="px-6 py-4 bg-red-500/5 border-b border-red-500/10">
                            <p className="text-[9px] font-black text-red-600 dark:text-red-400 uppercase tracking-[0.2em] mb-1.5">Sintomatología Crítica</p>
                            <p className="text-sm font-bold text-[var(--vy-neutral-700)] leading-relaxed italic">"{selected.description}"</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-[var(--border)] bg-[var(--vy-neutral-50)]/50">
                            <button
                                onClick={() => setActiveTab("chat")}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-center border-b-4 transition-all ${activeTab === "chat" ? "border-teal-500 text-teal-600" : "border-transparent text-[var(--vy-neutral-400)] hover:text-teal-500"}`}
                            >
                                💬 Comunicación
                            </button>
                            <button
                                onClick={() => setActiveTab("call")}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-center border-b-4 transition-all ${activeTab === "call" ? "border-teal-500 text-teal-600" : "border-transparent text-[var(--vy-neutral-400)] hover:text-teal-500"}`}
                            >
                                📞 Canal de Voz
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === "chat" ? (
                            <>
                                {/* Triage chat */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                    {messages.length === 0 && (
                                        <div className="text-center py-12 px-6">
                                            <div className="w-16 h-16 rounded-full bg-[var(--vy-neutral-100)] flex items-center justify-center text-3xl mx-auto mb-4 grayscale opacity-20">💬</div>
                                            <p className="text-xs font-black text-[var(--vy-neutral-400)] uppercase tracking-widest">Protocolo de chat iniciado</p>
                                            <p className="text-[10px] font-bold text-[var(--vy-neutral-300)] uppercase mt-2">En espera de interacción directa</p>
                                        </div>
                                    )}
                                    {messages.map((msg) => {
                                        const isVet = msg.sender?.role === "vet";
                                        return (
                                            <div key={msg.id} className={`flex ${isVet ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-[85%] px-5 py-3 rounded-[24px] shadow-sm ${isVet ? "bg-teal-600 text-white rounded-br-sm" : "bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-800)] rounded-bl-sm border border-[var(--border)]"}`}>
                                                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-70">{isVet ? "Dr. " : ""}{msg.sender?.display_name?.split(" ")[0]}</p>
                                                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Chat input */}
                                <div className="p-6 border-t border-[var(--border)] bg-[var(--surface)] flex gap-3">
                                    <input
                                        value={msgInput}
                                        onChange={(e) => setMsgInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMsg()}
                                        placeholder="Instrucciones clínicas..."
                                        className="flex-1 px-6 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold placeholder:text-[var(--vy-neutral-400)] focus:border-teal-500 outline-none transition-all shadow-inner"
                                    />
                                    <button
                                        onClick={handleSendMsg}
                                        disabled={!msgInput.trim()}
                                        className="w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-teal-700 active:scale-90 transition-all disabled:opacity-30"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 rotate-45" fill="none" stroke="currentColor" strokeWidth={3}>
                                            <path d="M12 19V5M5 12l7-7 7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-28 h-28 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center text-5xl mb-8 shadow-inner ring-4 ring-blue-500/5">
                                    📞
                                </div>
                                <h3 className="text-2xl font-black text-[var(--vy-neutral-900)] mb-2 uppercase tracking-tight">Canal de Emergencia</h3>
                                <p className="text-[var(--vy-neutral-500)] text-xs font-bold uppercase tracking-widest mb-10 max-w-xs leading-loose">
                                    Comunícate directamente con <strong className="text-teal-600">{selected.owner?.display_name}</strong> para indicaciones inmediatas.
                                </p>

                                {selected.owner?.phone ? (
                                    <div className="flex flex-col gap-4 w-full max-w-sm">
                                        <a
                                            href={`tel:${selected.owner.phone}`}
                                            className="w-full flex items-center justify-center gap-4 py-4 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                                        >
                                            Iniciar Llamada
                                        </a>
                                        <a
                                            href={`https://wa.me/${selected.owner.phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-4 py-4 rounded-2xl bg-green-500 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 active:scale-95"
                                        >
                                            Instrucciones WhatsApp
                                        </a>
                                    </div>
                                ) : (
                                    <div className="px-6 py-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/10">
                                        Dueño sin registro telefónico
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {selected && selected.status === "PENDING" && !selected.assigned_vet_id && (
                    <motion.div
                        key="pending-preview"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex-1 bg-[var(--surface)] rounded-[40px] border-2 border-[var(--border)] shadow-sm p-12 flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center text-5xl mb-8 animate-pulse shadow-inner">
                            🚨
                        </div>
                        <h2 className="text-3xl font-black text-[var(--vy-neutral-900)] tracking-tight uppercase">Protocolo SOS</h2>
                        <p className="text-[var(--vy-neutral-500)] text-xs font-bold uppercase tracking-widest mt-4 max-w-xs leading-loose">
                            Acepta el caso para habilitar la telemedicina en tiempo real y el expediente clínico.
                        </p>
                        <div className="mt-10 w-full max-w-sm space-y-4">
                            <button
                                onClick={() => handleAccept(selected.id)}
                                disabled={loadingAction === selected.id + "-accept"}
                                className="w-full py-4 bg-teal-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-500/20 active:scale-95"
                            >
                                {loadingAction === selected.id + "-accept" ? "Procesando..." : "✅ Iniciar Atención"}
                            </button>
                            <button
                                onClick={() => setDeriveModal(true)}
                                className="w-full py-4 bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-500)] text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[var(--vy-neutral-200)] transition-all border border-[var(--border)] active:scale-95"
                            >
                                🔄 Derivar Centro
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Derive Modal ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {deriveModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setDeriveModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative z-10 bg-[var(--surface)] rounded-[40px] p-10 w-full max-w-md shadow-2xl border-2 border-[var(--border)]"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center text-3xl mb-6 shadow-inner">🔄</div>
                            <h3 className="text-2xl font-black text-[var(--vy-neutral-900)] mb-2 uppercase tracking-tight">Derivar Caso</h3>
                            <p className="text-xs font-bold text-[var(--vy-neutral-500)] mb-8 uppercase tracking-widest leading-loose">
                                El caso se liberará para otras clínicas disponibles en la red.
                            </p>
                            <textarea
                                value={deriveNotes}
                                onChange={(e) => setDeriveNotes(e.target.value)}
                                placeholder="Motivo técnico de derivación comercial/clínica..."
                                rows={4}
                                className="w-full px-6 py-4 rounded-[24px] border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold placeholder:text-[var(--vy-neutral-400)] focus:border-orange-500 outline-none resize-none mb-8 shadow-inner transition-all"
                            />
                            <div className="flex gap-4">
                                <button onClick={() => setDeriveModal(false)} className="flex-1 py-4 rounded-2xl bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-500)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--vy-neutral-200)] transition-all">
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDerive}
                                    disabled={!!loadingAction}
                                    className="flex-1 py-4 rounded-2xl bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 shadow-xl shadow-orange-500/20 transition-all active:scale-95"
                                >
                                    {loadingAction ? "Confirmando..." : "Derivar Ahora"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
