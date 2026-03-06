"use client";

import React, { useState } from "react";
import { useTheme, palettes } from "@/providers/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeSwitcher() {
    const { primaryColor, surfaceColor, setPrimaryColor, setSurfaceColor } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const primaryOptions = ["celeste", "blue", "violet", "rose", "emerald", "amber", "orange"];
    const backgroundOptions = [
        { id: "white", color: "#ffffff", label: "Blanco" },
        { id: "gray", color: "#e2e8f0", label: "Gris" },
        { id: "black", color: "#020617", label: "Negro" },
        { id: "light-blue", color: "#e0f2fe", label: "Azul" },
    ];

    return (
        <div className="relative mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-100)] hover:text-[var(--vy-primary-600)] transition-all group"
            >
                <div className="flex items-center gap-3">
                    <span className="text-lg group-hover:rotate-12 transition-transform">🎨</span>
                    <span>Cambiar de color</span>
                </div>
                <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute bottom-full left-0 sm:left-auto sm:right-0 w-[calc(100vw-2rem)] sm:w-80 mb-2 bg-[var(--surface)] rounded-2xl border border-[var(--vy-neutral-200)] shadow-2xl p-4 z-50 max-h-[70vh] overflow-y-auto"
                    >
                        <div className="flex gap-4">
                            {/* Color 1 Column */}
                            <div className="flex-1 space-y-3">
                                <p className="text-[10px] font-bold text-[var(--vy-neutral-400)] uppercase tracking-widest">Color 1</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {primaryOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => setPrimaryColor(opt)}
                                            className={`w-full h-8 rounded-lg transition-all border-2 ${primaryColor === opt ? "border-[var(--vy-primary-500)] scale-110 shadow-md" : "border-gray-100 opacity-70 hover:opacity-100"
                                                }`}
                                            style={{ backgroundColor: palettes[opt][500] }}
                                            title={opt}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-px bg-[var(--vy-neutral-100)]" />

                            {/* Color 2 Column */}
                            <div className="flex-1 space-y-3">
                                <p className="text-[10px] font-bold text-[var(--vy-neutral-400)] uppercase tracking-widest">Color 2</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {backgroundOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setSurfaceColor(opt.id)}
                                            className={`w-full h-8 rounded-lg transition-all border-2 ${surfaceColor === opt.id ? "border-[var(--vy-primary-500)] scale-110 shadow-md" : "border-gray-100 opacity-70 hover:opacity-100"
                                                }`}
                                            style={{ backgroundColor: opt.color }}
                                            title={opt.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
