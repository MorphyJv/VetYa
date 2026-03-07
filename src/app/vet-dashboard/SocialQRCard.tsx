"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
    {
        key: "whatsapp",
        label: "WhatsApp",
        url: "https://wa.me/",
        qr: "/qr_whatsapp.png",
        activeBg: "bg-green-500",
        activeText: "text-white",
        inactiveBg: "bg-green-500/5",
        inactiveText: "text-green-600 dark:text-green-400",
        qrBg: "bg-green-500/[0.02] dark:bg-green-500/[0.05]",
        qrBorder: "border-green-500/10",
        btnColor: "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20",
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
    },
    {
        key: "facebook",
        label: "Facebook",
        url: "https://www.facebook.com/",
        qr: "/qr_facebook.png",
        activeBg: "bg-blue-600",
        activeText: "text-white",
        inactiveBg: "bg-blue-500/5",
        inactiveText: "text-blue-600 dark:text-blue-400",
        qrBg: "bg-blue-500/[0.02] dark:bg-blue-500/[0.05]",
        qrBorder: "border-blue-500/10",
        btnColor: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20",
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        key: "messenger",
        label: "Messenger",
        url: "https://www.messenger.com/",
        qr: "/qr_messenger.png",
        activeBg: "bg-gradient-to-br from-purple-500 to-pink-500",
        activeText: "text-white",
        inactiveBg: "bg-purple-500/5",
        inactiveText: "text-purple-600 dark:text-purple-400",
        qrBg: "bg-purple-500/[0.02] dark:bg-purple-500/[0.05]",
        qrBorder: "border-purple-500/10",
        btnColor: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-pink-500/20",
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.471 8.652V24l4.064-2.242c1.084.3 2.232.464 3.465.464 6.627 0 12-4.975 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.26L19.752 8l-6.561 6.963z" />
            </svg>
        ),
    },
];

export default function SocialQRCard() {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    const tab = activeIdx !== null ? TABS[activeIdx] : null;

    return (
        <div className="bg-[var(--surface)] rounded-[40px] border-2 border-[var(--border)] shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-[var(--vy-neutral-100)]">
                <h3 className="text-sm font-black text-[var(--vy-neutral-900)] uppercase tracking-widest">📲 Contacto Social</h3>
                <p className="text-[10px] font-bold text-[var(--vy-neutral-400)] uppercase tracking-tighter mt-1">Interacción Digital</p>
            </div>

            {/* Scrollable icon row */}
            <div className="flex gap-2 px-6 py-4 overflow-x-auto scrollbar-hide border-b border-[var(--vy-neutral-100)]">
                {TABS.map((t, i) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shrink-0 transition-all duration-300 active:scale-95
                            ${activeIdx === i
                                ? `${t.activeBg} ${t.activeText} shadow-lg scale-105`
                                : `${t.inactiveBg} ${t.inactiveText} border border-transparent hover:border-current`
                            }`}
                    >
                        {t.icon}
                        {t.label}
                    </button>
                ))}
            </div>

            {/* QR area — contained within the card */}
            <AnimatePresence mode="wait">
                {tab ? (
                    <motion.div
                        key={tab.key}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "anticipate" }}
                        className="overflow-hidden"
                    >
                        <div className={`flex flex-col items-center gap-4 px-6 py-8 ${tab.qrBg}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={tab.qr}
                                alt={`QR de ${tab.label}`}
                                className="w-full max-w-[160px] h-auto rounded-[32px] shadow-2xl border-4 border-[var(--surface)]"
                            />
                            <p className="text-[10px] font-black text-[var(--vy-neutral-500)] text-center uppercase tracking-widest px-4 mt-2">
                                Escaneo Directo {tab.label}
                            </p>
                            <a
                                href={tab.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab.btnColor}`}
                            >
                                Iniciar Chat →
                            </a>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-12 text-center px-6"
                    >
                        <span className="text-3xl mb-4 grayscale opacity-30">📲</span>
                        <p className="text-[10px] font-black text-[var(--vy-neutral-400)] uppercase tracking-[0.2em]">Selección Requerida</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
