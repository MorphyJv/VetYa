"use client";

import { useState, useEffect, useCallback } from "react";
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
    CRITICAL: { label: "CRÍTICO", bg: "bg-red-100", text: "text-red-700", ring: "ring-red-400", dot: "bg-red-500" },
    MODERATE: { label: "MODERADO", bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-400", dot: "bg-orange-400" },
    MILD: { label: "LEVE", bg: "bg-yellow-100", text: "text-yellow-700", ring: "ring-yellow-400", dot: "bg-yellow-400" },
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
    }, [onDuty]);

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
    }, [selected?.id]);

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
        <div className="flex flex-col lg:flex-row gap-6 min-h-[80vh]">
            {/* ── Left Panel ─────────────────────────────────────────────── */}
            <div className="w-full lg:w-[600px] shrink-0 space-y-4">
                {/* Header + Toggle */}
                <div className="bg-white rounded-3xl p-7 border border-[var(--vy-neutral-200)] shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            <h1 className="text-xl font-bold text-[var(--vy-neutral-900)] flex items-center gap-2">
                                Centro de Comando SOS
                                {onDuty && (
                                    <span className="flex h-2.5 w-2.5 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                                    </span>
                                )}
                            </h1>
                            <p className="text-sm text-[var(--vy-neutral-500)] mt-0.5">
                                {onDuty ? "Escuchando emergencias en tiempo real" : "Activa la guardia para recibir alertas"}
                            </p>
                        </div>
                        {/* On-duty toggle */}
                        <button
                            onClick={handleToggleDuty}
                            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${onDuty ? "bg-teal-500" : "bg-[var(--vy-neutral-300)]"}`}
                        >
                            <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${onDuty ? "translate-x-7" : "translate-x-0"}`} />
                        </button>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${onDuty ? "bg-teal-100 text-teal-700" : "bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-500)]"}`}>
                            {onDuty ? "🟢 En Guardia" : "⚫ Fuera de Servicio"}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                            {pendingList.length} Pendientes
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-700">
                            {inProgressList.length} En curso
                        </span>
                    </div>
                </div>

                {/* Emergency Triage Cards */}
                <div className="space-y-3">
                    {!onDuty && (
                        <div className="bg-[var(--vy-neutral-50)] rounded-2xl p-8 text-center border border-dashed border-[var(--vy-neutral-200)]">
                            <span className="text-3xl">😴</span>
                            <p className="text-sm text-[var(--vy-neutral-500)] mt-2">Activa la guardia para ver emergencias</p>
                        </div>
                    )}

                    {onDuty && pendingList.length === 0 && inProgressList.length === 0 && (
                        <div className="bg-[var(--vy-neutral-50)] rounded-2xl p-8 text-center border border-dashed border-[var(--vy-neutral-200)]">
                            <span className="text-3xl">📡</span>
                            <p className="font-semibold text-[var(--vy-neutral-700)] mt-2">Radar activo</p>
                            <p className="text-sm text-[var(--vy-neutral-500)]">Sin emergencias entrantes por ahora</p>
                        </div>
                    )}

                    <AnimatePresence>
                        {[...pendingList, ...inProgressList].map((em) => {
                            const sv = SEVERITY_CONFIG[em.severity] || SEVERITY_CONFIG.MODERATE;
                            const isSelected = selected?.id === em.id;
                            return (
                                <motion.div
                                    key={em.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onClick={() => setSelected(em)}
                                    className={`bg-white rounded-2xl p-4 border cursor-pointer transition-all ${isSelected ? `ring-2 ${sv.ring} border-transparent` : "border-[var(--vy-neutral-200)] hover:border-teal-300 hover:shadow-sm"}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-16 h-16 rounded-full bg-[var(--vy-neutral-50)] border-2 border-[var(--vy-neutral-200)] flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                                            {em.pet?.photo_url
                                                // eslint-disable-next-line @next/next/no-img-element
                                                ? <img src={em.pet.photo_url} alt="" className="w-full h-full object-cover" />
                                                : em.pet?.species === "cat" ? "🐱" : "🐕"
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded-full ${sv.bg} ${sv.text}`}>
                                                    {sv.label}
                                                </span>
                                                {em.status === "IN_PROGRESS" && (
                                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-teal-100 text-teal-700">EN CURSO</span>
                                                )}
                                            </div>
                                            <p className="font-bold text-base text-[var(--vy-neutral-900)] truncate">{em.pet?.name}</p>
                                            <p className="text-sm text-[var(--vy-neutral-500)]">
                                                {em.pet?.species === "dog" ? "Perro" : em.pet?.species === "cat" ? "Gato" : em.pet?.species}
                                                {em.pet?.weight_kg ? ` · ${em.pet.weight_kg} kg` : ""}
                                            </p>
                                            <p className="text-sm text-[var(--vy-neutral-600)] mt-1 line-clamp-3">{em.description}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-xs text-red-600 font-bold">
                                                <ElapsedTimer from={em.created_at} />
                                            </div>
                                            <div className="text-[10px] text-[var(--vy-neutral-400)]">esperando</div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    {isSelected && em.status === "PENDING" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-3 pt-3 border-t border-[var(--vy-neutral-100)] flex gap-2"
                                        >
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleAccept(em.id); }}
                                                disabled={loadingAction === em.id + "-accept"}
                                                className="flex-1 py-2 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-colors disabled:opacity-60"
                                            >
                                                {loadingAction === em.id + "-accept" ? "Aceptando..." : "✅ Aceptar Caso"}
                                            </button>
                                            <a
                                                href={`tel:${em.owner?.phone || ""}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-3 py-2 rounded-xl bg-blue-100 text-blue-700 text-sm font-bold hover:bg-blue-200 transition-colors"
                                            >
                                                📞
                                            </a>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setDeriveModal(true); }}
                                                className="px-3 py-2 rounded-xl bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] text-sm font-bold hover:bg-[var(--vy-neutral-200)] transition-colors"
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
                        className="flex-1 bg-white rounded-3xl border border-[var(--vy-neutral-200)] shadow-sm overflow-hidden flex flex-col"
                    >
                        {/* Patient header */}
                        <div className="p-5 border-b border-[var(--vy-neutral-100)] flex items-center gap-4 bg-teal-50">
                            <div className="w-14 h-14 rounded-full bg-white border-2 border-teal-200 flex items-center justify-center text-2xl overflow-hidden shrink-0">
                                {selected.pet?.photo_url
                                    // eslint-disable-next-line @next/next/no-img-element
                                    ? <img src={selected.pet.photo_url} alt="" className="w-full h-full object-cover" />
                                    : selected.pet?.species === "cat" ? "🐱" : "🐕"
                                }
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-teal-900">{selected.pet?.name}</h2>
                                <p className="text-sm text-teal-700">
                                    Dueño: {selected.owner?.display_name}
                                    {selected.owner?.phone && (
                                        <a href={`tel:${selected.owner.phone}`} className="ml-2 underline">
                                            📞 {selected.owner.phone}
                                        </a>
                                    )}
                                </p>
                            </div>
                            <div className="ml-auto">
                                <span className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full">En atención</span>
                            </div>
                        </div>

                        {/* Symptom description */}
                        <div className="px-5 py-3 bg-red-50 border-b border-red-100">
                            <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">Síntoma reportado</p>
                            <p className="text-sm text-red-800">{selected.description}</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-[var(--vy-neutral-200)]">
                            <button
                                onClick={() => setActiveTab("chat")}
                                className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === "chat" ? "border-teal-600 text-teal-700" : "border-transparent text-[var(--vy-neutral-500)] hover:text-[var(--vy-neutral-800)]"}`}
                            >
                                💬 Chat
                            </button>
                            <button
                                onClick={() => setActiveTab("call")}
                                className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === "call" ? "border-teal-600 text-teal-700" : "border-transparent text-[var(--vy-neutral-500)] hover:text-[var(--vy-neutral-800)]"}`}
                            >
                                📞 Llamada
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === "chat" ? (
                            <>
                                {/* Triage chat */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.length === 0 && (
                                        <div className="text-center py-6 text-[var(--vy-neutral-400)] text-sm">
                                            <p>💬 Chat de Triage iniciado</p>
                                            <p className="text-xs mt-1">Comunícate con el dueño en tiempo real</p>
                                        </div>
                                    )}
                                    {messages.map((msg) => {
                                        const isVet = msg.sender?.role === "vet";
                                        return (
                                            <div key={msg.id} className={`flex ${isVet ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isVet ? "bg-teal-600 text-white rounded-br-sm" : "bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-800)] rounded-bl-sm"}`}>
                                                    <p className="text-[10px] font-semibold mb-0.5 opacity-70">{msg.sender?.display_name}</p>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Chat input */}
                                <div className="p-4 border-t border-[var(--vy-neutral-200)] flex gap-2">
                                    <input
                                        value={msgInput}
                                        onChange={(e) => setMsgInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMsg()}
                                        placeholder="Escribe un mensaje de triage..."
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--vy-neutral-300)] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                    <button
                                        onClick={handleSendMsg}
                                        disabled={!msgInput.trim()}
                                        className="px-4 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 disabled:opacity-40"
                                    >
                                        Enviar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[var(--vy-neutral-50)]">
                                <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-5xl mb-6 shadow-inner">
                                    📞
                                </div>
                                <h3 className="text-xl font-bold text-[var(--vy-neutral-900)] mb-2">Llamar al Dueño</h3>
                                <p className="text-[var(--vy-neutral-500)] text-sm mb-8 max-w-xs">
                                    Comunícate directamente con <strong className="text-[var(--vy-neutral-700)]">{selected.owner?.display_name}</strong> para indicaciones inmediatas.
                                </p>

                                {selected.owner?.phone ? (
                                    <div className="flex flex-col gap-3 w-full max-w-xs">
                                        <a
                                            href={`tel:${selected.owner.phone}`}
                                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md"
                                        >
                                            <span>📞</span> Llamar ahora ({selected.owner.phone})
                                        </a>
                                        <a
                                            href={`https://wa.me/${selected.owner.phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-md"
                                        >
                                            <span>💬</span> Mensaje por WhatsApp
                                        </a>
                                    </div>
                                ) : (
                                    <div className="px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
                                        El dueño no ha registrado un número de teléfono.
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {selected && selected.status === "PENDING" && !selected.assigned_vet_id && (
                    <motion.div
                        key="pending-preview"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex-1 bg-white rounded-3xl border border-[var(--vy-neutral-200)] shadow-sm p-8 flex flex-col items-center justify-center text-center"
                    >
                        <span className="text-5xl mb-4">🚨</span>
                        <h2 className="text-xl font-bold text-[var(--vy-neutral-900)]">Emergencia Pendiente</h2>
                        <p className="text-[var(--vy-neutral-500)] mt-2 max-w-xs">
                            Acepta el caso para activar el chat de triage y acceder al historial médico del paciente.
                        </p>
                        <div className="mt-6 w-full max-w-xs space-y-2">
                            <button
                                onClick={() => handleAccept(selected.id)}
                                disabled={loadingAction === selected.id + "-accept"}
                                className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-60"
                            >
                                {loadingAction === selected.id + "-accept" ? "Aceptando..." : "✅ Aceptar Caso"}
                            </button>
                            <button
                                onClick={() => setDeriveModal(true)}
                                className="w-full py-3 bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] font-bold rounded-xl hover:bg-[var(--vy-neutral-200)] transition-colors"
                            >
                                🔄 Derivar a otra clínica
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
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative z-10 bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-[var(--vy-neutral-900)] mb-4">🔄 Derivar Emergencia</h3>
                            <p className="text-sm text-[var(--vy-neutral-500)] mb-4">
                                Opcional: deja una nota explicando el motivo de derivación.
                            </p>
                            <textarea
                                value={deriveNotes}
                                onChange={(e) => setDeriveNotes(e.target.value)}
                                placeholder="Ej: No contamos con especialista en cardiología, derivar a..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] text-sm focus:ring-2 focus:ring-orange-400 outline-none resize-none mb-4"
                            />
                            <div className="flex gap-3">
                                <button onClick={() => setDeriveModal(false)} className="flex-1 py-2.5 rounded-xl bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] font-medium text-sm hover:bg-[var(--vy-neutral-200)]">
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDerive}
                                    disabled={!!loadingAction}
                                    className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 disabled:opacity-60"
                                >
                                    {loadingAction ? "Derivando..." : "Confirmar"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
