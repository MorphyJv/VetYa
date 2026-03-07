"use client";

import React, { useState } from "react";
import { useTheme, palettes } from "@/providers/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeSwitcher() {
    const { primaryColor, surfaceColor, setPrimaryColor, setSurfaceColor } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    // Celeste is first!
    const primaryOptions = ["celeste", "blue", "violet", "rose", "emerald", "amber", "orange"];
    
    const backgroundOptions = [
        { id: "white", color: "#ffffff", label: "Claro", icon: "☀️" },
        { id: "gray", color: "#f1f5f9", label: "Tenue", icon: "🌫️" },
        { id: "black", color: "#0f172a", label: "Oscuro", icon: "🌙" },
        { id: "light-blue", color: "#f0f9ff", label: "Cielo", icon: "☁️" },
    ];

    return (
        <div className="relative mb-2">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group
                    ${isOpen 
                        ? "bg-[var(--vy-primary-500)] text-white shadow-lg shadow-[var(--vy-primary-500)]/20 scale-[0.98]" 
                        : "text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-100)] hover:text-[var(--vy-primary-600)]"
                    }`}
            >
                <div className="flex items-center gap-3">
                    <span className={`text-lg transition-transform duration-500 ${isOpen ? 'rotate-180' : 'group-hover:rotate-12'}`}>
                        🎨
                    </span>
                    <span>Personalizar App</span>
                </div>
                <motion.span 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-[10px] opacity-50"
                >
                    ▼
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for mobile to close easily */}
                        <div 
                            className="fixed inset-0 z-40 lg:hidden" 
                            onClick={() => setIsOpen(false)}
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="absolute bottom-full left-0 w-[calc(100vw-4rem)] sm:w-80 mb-3 glass-morphism rounded-[24px] border border-white/20 shadow-2xl p-5 z-50 overflow-hidden"
                        >
                            <div className="space-y-6">
                                {/* Primary Color Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-extrabold text-[var(--vy-neutral-400)] uppercase tracking-[0.1em]">Color Principal</p>
                                        <span className="text-[10px] py-0.5 px-2 rounded-full bg-[var(--vy-primary-100)] text-[var(--vy-primary-700)] font-bold capitalize">
                                            {primaryColor}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        {primaryOptions.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => setPrimaryColor(opt)}
                                                className={`group relative w-full aspect-square rounded-full transition-all duration-300 active:scale-90
                                                    ${primaryColor === opt 
                                                        ? "ring-4 ring-[var(--vy-primary-500)] ring-offset-2 ring-offset-[var(--surface)] scale-110 shadow-lg" 
                                                        : "hover:scale-105"
                                                    }`}
                                                style={{ backgroundColor: palettes[opt][500] }}
                                            >
                                                {primaryColor === opt && (
                                                    <motion.span 
                                                        layoutId="active-color"
                                                        className="absolute inset-0 flex items-center justify-center text-white text-[10px]"
                                                    >
                                                        ✨
                                                    </motion.span>
                                                )}
                                                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/5 transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-[var(--vy-neutral-200)] to-transparent" />

                                {/* Surface Color Section */}
                                <div className="space-y-3">
                                    <p className="text-[11px] font-extrabold text-[var(--vy-neutral-400)] uppercase tracking-[0.1em]">Fondo y Estilo</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {backgroundOptions.map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setSurfaceColor(opt.id)}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all duration-300 text-left
                                                    ${surfaceColor === opt.id 
                                                        ? "border-[var(--vy-primary-500)] bg-[var(--vy-primary-50)] shadow-sm scale-[1.02]" 
                                                        : "border-[var(--vy-neutral-100)] bg-white/50 hover:bg-white hover:border-[var(--vy-neutral-300)]"
                                                    }`}
                                            >
                                                <span className="text-lg">{opt.icon}</span>
                                                <div className="flex flex-col">
                                                    <span className={`text-xs font-bold leading-tight ${surfaceColor === opt.id ? "text-[var(--vy-primary-700)]" : "text-[var(--vy-neutral-700)]"}`}>
                                                        {opt.label}
                                                    </span>
                                                    <div 
                                                        className="w-4 h-1 rounded-full mt-0.5" 
                                                        style={{ backgroundColor: opt.color, border: "0.5px solid #eee" }} 
                                                    />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Decorative blur elements */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--vy-primary-500)]/10 blur-3xl -z-10 rounded-full" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-[var(--vy-accent-500)]/10 blur-3xl -z-10 rounded-full" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
