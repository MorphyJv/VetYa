"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createConversation, saveMessage, getConversationMessages } from "./actions";
import { useChat } from "@ai-sdk/react";
import Link from "next/link";

export default function AIChatClient({
    pets,
    initialConversations,
    currentUserId,
}: {
    pets: any[];
    initialConversations: any[];
    currentUserId: string;
}) {
    const [selectedPet, setSelectedPet] = useState<any | null>(null);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [conversations, setConversations] = useState(initialConversations);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Vercel AI SDK useChat
    const {
        messages,
        setMessages,
        input,
        setInput,
        handleInputChange,
        handleSubmit,
        append,
        isLoading,
        error
    } = useChat({
        api: "/api/chat",
        onResponse: (response) => {
            console.log("Chat Response status:", response.status);
        },
        onFinish: async (message) => {
            console.log("Chat finished:", message.content.substring(0, 20) + "...");
            if (activeConversationId) {
                const isUrgent = message.content.includes("[URGENCIA DETECTADA]");
                await saveMessage(activeConversationId, "assistant", message.content, isUrgent);
            }
        },
        onError: (err) => {
            console.error("Chat Hook Error:", err);
        }
    });

    console.log("AIChatClient Render - Messages:", messages.length, "Loading:", isLoading);

    if (error) {
        console.error("VERBOSE CHAT ERROR:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
            cause: error.cause
        });
    }

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load an existing conversation from DB
    const loadConversation = async (convId: string, petObj: any) => {
        setActiveConversationId(convId);
        setSelectedPet(petObj);
        setSidebarOpen(false);
        const res = await getConversationMessages(convId);
        if (res.data) {
            setMessages(
                res.data.map((m: any) => ({
                    id: m.id,
                    role: m.role as "user" | "assistant",
                    content: m.content,
                }))
            );
        }
    };

    const createNewChat = () => {
        setActiveConversationId(null);
        setMessages([]);
        setSidebarOpen(false);
        setSelectedPet(null);
    };

    // Use append instead of handleSubmit for more control over DB sync
    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const userText = (input || "").trim();
        if (!userText || isLoading) return;

        let convId = activeConversationId;
        if (!convId) {
            const res = await createConversation(selectedPet?.id ?? null, userText);
            if (res.data) {
                convId = res.data.id;
                setActiveConversationId(convId);
                setConversations((prev) => [
                    {
                        id: convId,
                        title: userText.length > 50 ? userText.substring(0, 47) + "..." : userText,
                        pet: selectedPet,
                        updated_at: new Date().toISOString(),
                    },
                    ...prev,
                ]);
            }
        }

        // Save user message to DB
        if (convId) await saveMessage(convId, "user", userText, false);

        // Clear input
        setInput("");

        // Append to chat (triggers API call)
        append({
            role: "user",
            content: userText,
        }, {
            data: {
                petContext: selectedPet ? {
                    id: selectedPet.id,
                    name: selectedPet.name,
                    species: selectedPet.species,
                    breed: selectedPet.breed,
                    sex: selectedPet.sex,
                    weight_kg: selectedPet.weight_kg,
                    birth_date: selectedPet.birth_date,
                } : null,
            }
        });
    };

    const formatDate = (dateStr: any) => {
        if (!dateStr) return "Reciente";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return "Reciente";
            return d.toLocaleDateString();
        } catch {
            return "Reciente";
        }
    };

    const getUrgencyStrippedContent = (content: any) => {
        if (typeof content !== 'string') return "";
        return content.replace("[URGENCIA DETECTADA]", "").trim();
    };

    return (
        <div className="flex w-full h-full relative">

            {/* ── Mobile Sidebar Overlay ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden absolute inset-0 bg-black/40 z-20"
                    />
                )}
            </AnimatePresence>

            {/* ── Sidebar ── */}
            <div className={`
        absolute lg:relative w-[280px] h-full bg-[var(--vy-neutral-50)] border-r border-[var(--vy-neutral-200)] z-30 transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
                <div className="p-4 border-b border-[var(--vy-neutral-200)] flex justify-between items-center bg-[var(--surface)] shrink-0">
                    <span className="font-bold text-[var(--vy-neutral-900)]">Asistente VetYa</span>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--vy-neutral-100)]">✕</button>
                </div>
                <div className="p-4 shrink-0 border-b border-[var(--vy-neutral-200)]">
                    <button onClick={createNewChat}
                        className="w-full py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--vy-neutral-300)] font-semibold text-sm text-[var(--vy-neutral-700)] shadow-sm hover:border-[var(--vy-primary-400)] hover:text-[var(--vy-primary-700)] transition-colors flex items-center justify-center gap-2">
                        <span className="text-lg leading-none">+</span> Nuevo Chat
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    <p className="px-3 py-2 text-xs font-bold text-[var(--vy-neutral-400)] uppercase tracking-wider">Historial</p>
                    {conversations.length === 0 ? (
                        <div className="px-3 py-4 text-xs text-[var(--vy-neutral-500)]">No hay chats anteriores.</div>
                    ) : (
                        conversations.map((conv) => (
                            <button key={conv.id} onClick={() => loadConversation(conv.id, conv.pet)}
                                className={`w-full text-left p-3 rounded-xl transition-colors ${activeConversationId === conv.id
                                    ? "bg-[var(--vy-primary-100)] text-[var(--vy-primary-800)]"
                                    : "hover:bg-[var(--surface)] text-[var(--vy-neutral-600)]"}`}>
                                <div className="text-sm font-semibold truncate leading-tight mb-1">{conv.title || "Chat sin título"}</div>
                                <div className="text-[10px] flex items-center gap-1 opacity-70">
                                    {conv.pet ? `🐾 ${conv.pet.name}` : "Gral."} · {formatDate(conv.updated_at)}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* ── Main Chat Area ── */}
            <div className="flex-1 flex flex-col min-w-0 bg-[var(--background)] relative">

                {/* Top Bar */}
                <div className="h-16 px-4 border-b border-[var(--vy-neutral-200)] flex items-center justify-between shrink-0 bg-[var(--surface)]/80 backdrop-blur-md z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-xl bg-[var(--vy-neutral-50)] flex items-center justify-center text-[var(--vy-neutral-600)] border border-[var(--vy-neutral-200)]">☰</button>
                        {messages.length === 0 ? (
                            <select onChange={(e) => setSelectedPet(pets.find((x) => x.id === e.target.value) || null)}
                                value={selectedPet?.id || ""}
                                className="appearance-none bg-[var(--vy-neutral-100)] border border-[var(--vy-neutral-300)] text-[var(--vy-neutral-700)] text-sm rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--vy-primary-500)] cursor-pointer">
                                <option value="">Consulta General</option>
                                {pets.map((p) => (<option key={p.id} value={p.id}>🐾 {p.name}</option>))}
                            </select>
                        ) : selectedPet ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--vy-primary-50)] text-[var(--vy-primary-800)] rounded-full text-xs font-semibold border border-[var(--vy-primary-200)]">
                                <span>{selectedPet.species === "dog" ? "🐶" : selectedPet.species === "cat" ? "🐱" : "🐾"}</span>
                                Triage: {selectedPet.name}
                            </div>
                        ) : (
                            <span className="text-sm text-[var(--vy-neutral-500)]">Consulta General</span>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[var(--vy-primary-50)]/50">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto opacity-70">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--vy-primary-200)] to-[var(--vy-primary-400)] flex items-center justify-center text-4xl mb-6 shadow-inner text-white">🤖</div>
                            <h2 className="text-xl font-bold text-[var(--vy-neutral-900)] mb-2">Hola, soy VetYa AI</h2>
                            <p className="text-sm text-[var(--vy-neutral-500)]">Estoy aquí para resolver tus dudas sobre nutrición, cuidados preventivos y bienestar de tu familia de cuatro patas.</p>
                            {selectedPet && (
                                <p className="mt-4 text-xs bg-[var(--vy-primary-50)] text-[var(--vy-primary-700)] py-1.5 px-3 rounded-lg font-medium">
                                    He cargado el expediente de {selectedPet.name} para responderte mejor.
                                </p>
                            )}
                        </div>
                    ) : (
                        messages.map((m) => {
                            const isUrgent = typeof m.content === 'string' && m.content.includes("[URGENCIA DETECTADA]");
                            const cleanContent = getUrgencyStrippedContent(m.content);
                            return (
                                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-4 max-w-3xl ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xl shadow-sm ${m.role === "user" ? "bg-[var(--vy-neutral-200)]" : "bg-gradient-to-br from-[var(--vy-primary-500)] to-[var(--vy-primary-600)] text-white"}`}>
                                        {m.role === "user" ? "👤" : "🤖"}
                                    </div>
                                    <div className={`flex flex-col gap-2 min-w-0 ${m.role === "user" ? "items-end" : "items-start"}`}>
                                        <div className={`px-5 py-3.5 text-[0.95rem] leading-relaxed shadow-sm break-words whitespace-pre-wrap ${m.role === "user"
                                            ? "bg-[var(--surface)] rounded-2xl rounded-tr-sm border border-[var(--vy-neutral-200)] text-[var(--vy-neutral-900)]"
                                            : "bg-[var(--surface)] rounded-2xl rounded-tl-sm border-2 border-[var(--vy-primary-100)] text-[var(--vy-neutral-800)]"}`}>
                                            {cleanContent || (isLoading && m.role === "assistant" ? <span className="opacity-40 italic text-xs">Escribiendo...</span> : null)}
                                        </div>
                                        {isUrgent && m.role !== "user" && (
                                            <div className="mt-2 w-full max-w-sm rounded-2xl bg-red-50 border-2 border-red-300 p-4 shadow-sm">
                                                <div className="flex items-center gap-2 text-red-700 font-bold mb-2">⚠️ ALERTA DE EMERGENCIA</div>
                                                <p className="text-xs text-red-900 mb-4">Mis algoritmos sugieren que podría haber un riesgo vital. No pierdas tiempo.</p>
                                                <Link href="/dashboard/sos" className="block w-full text-center py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-md">
                                                    Usar Centro de Emergencias (SOS)
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="absolute top-20 left-4 right-4 z-20 animate-in fade-in slide-in-from-top-4">
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">⚠️</span>
                                <div>
                                    <p className="text-sm font-bold text-red-900">Error de conexión</p>
                                    <p className="text-xs text-red-700">No pudimos conectar con la IA. Verifica tu sesión.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                )}

                {/* Input Form */}
                <div className="p-4 bg-[var(--surface)] border-t border-[var(--vy-neutral-200)] shrink-0 z-10">
                    <form onSubmit={onFormSubmit} className="max-w-4xl mx-auto relative flex items-end bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-300)] focus-within:border-[var(--vy-primary-400)] focus-within:ring-4 focus-within:ring-[var(--vy-primary-100)] transition-all rounded-3xl p-1.5 shadow-sm">
                        <textarea
                            value={input || ""}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    // Call the submit handler directly with a simulated event
                                    onFormSubmit({ preventDefault: () => { } } as React.FormEvent<HTMLFormElement>);
                                }
                            }}
                            placeholder="Escribe tu consulta sobre prevención y cuidado..."
                            className="flex-1 max-h-32 min-h-12 bg-transparent resize-none outline-none py-3 px-4 text-sm text-[var(--vy-neutral-900)] placeholder-[var(--vy-neutral-400)] leading-relaxed"
                            rows={1}
                        />
                        <button type="submit" disabled={!(input || "").trim() || isLoading}
                            className="w-12 h-12 shrink-0 rounded-2xl bg-[var(--vy-primary-600)] text-white flex items-center justify-center hover:bg-[var(--vy-primary-700)] transition-transform active:scale-95 disabled:opacity-50 disabled:bg-[var(--vy-neutral-300)] ml-2">
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </button>
                    </form>
                    <p className="text-[10px] text-[var(--vy-neutral-400)] text-center mt-2">
                        VetYa AI no reemplaza una evaluación veterinaria profesional. Powered by Gemini
                    </p>
                </div>
            </div>
        </div>
    );
}
