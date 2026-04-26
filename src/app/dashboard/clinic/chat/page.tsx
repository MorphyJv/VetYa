"use client";

import Link from "next/link";
import { useState } from "react";

export default function ClinicChatPage() {
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState([
        { id: 1, text: "Hola, me gustaría agendar una cita para mi perro.", sender: "user", time: "10:30 AM" },
        { id: 2, text: "¡Hola! Claro que sí, enviaremos la disponibilidad de horarios de nuestro equipo en unos momentos. ¿Hay algún síntoma que debamos conocer previamente?", sender: "clinic", time: "10:35 AM" }
    ]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setChats([...chats, { id: Date.now(), text: message, sender: "user", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setMessage("");

        // Simulate clinic replying
        setTimeout(() => {
            setChats(prev => [...prev, { id: Date.now(), text: "Recibido. Estamos procesando tu solicitud.", sender: "clinic", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }, 3000);
    };

    return (
        <div className="p-3 md:p-4 max-w-4xl mx-auto flex flex-col gap-3 md:gap-4 pb-4" style={{ height: 'calc(100dvh - 3.5rem)' }}>
            
            <div className="bg-[var(--surface)] p-4 rounded-[2rem] border border-[var(--vy-neutral-200)] shadow-sm flex items-center gap-4 shrink-0">
                <Link href="/dashboard/clinic" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-500)] hover:bg-[var(--vy-neutral-200)] hover:text-[var(--vy-neutral-800)] transition-colors">
                    ←
                </Link>
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--vy-primary-400)] to-[var(--vy-primary-600)] flex items-center justify-center text-xl shadow-md rounded-xl text-white">
                    🩺
                </div>
                <div>
                    <h2 className="font-bold text-[var(--vy-neutral-900)]">Central VetYa (Sede Norte)</h2>
                    <p className="text-xs text-[var(--vy-success)] font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[var(--vy-success)] animate-pulse"></span>
                        En línea
                    </p>
                </div>
                <div className="ml-auto hidden sm:flex gap-2">
                    <button className="bg-[var(--vy-neutral-50)] text-[var(--vy-neutral-600)] p-2 rounded-xl border border-[var(--vy-neutral-200)] hover:bg-[var(--vy-neutral-100)]">
                        📞 Llamar
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-[var(--surface)] rounded-[2rem] border border-[var(--vy-neutral-200)] shadow-sm overflow-hidden flex flex-col relative">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[var(--background)]">
                    <div className="text-center text-xs text-[var(--vy-neutral-400)] font-medium mb-6">
                        Hoy — Conexión segura con la clínica
                    </div>
                    {chats.map(chat => (
                        <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                            <div className={`max-w-[80%] md:max-w-[60%] rounded-2xl p-3 shadow-sm ${
                                chat.sender === 'user' 
                                ? 'bg-[var(--vy-primary-600)] text-white rounded-br-none' 
                                : 'bg-[var(--surface)] border border-[var(--vy-neutral-200)] text-[var(--vy-neutral-800)] rounded-bl-none'
                            }`}>
                                <p className="text-sm font-medium">{chat.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${chat.sender === 'user' ? 'text-white/70' : 'text-[var(--vy-neutral-400)]'}`}>
                                    {chat.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[var(--surface)] border-t border-[var(--vy-neutral-200)] shrink-0">
                    <form onSubmit={handleSend} className="flex gap-2 relative">
                        <input 
                            type="text" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Escribe tu mensaje para el personal médico..."
                            className="flex-1 bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-200)] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vy-primary-200)] focus:border-[var(--vy-primary-500)] transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={!message.trim()}
                            className="bg-[var(--vy-primary-600)] hover:bg-[var(--vy-primary-700)] text-white w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-transform active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
