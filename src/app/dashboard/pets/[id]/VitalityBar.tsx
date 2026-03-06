"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function VitalityBar({ vitality }: { vitality: { score: number, status: string, suggestions: string[] } }) {
    const [showDetails, setShowDetails] = useState(false);

    const getStatusColor = (score: number) => {
        if (score < 40) return "bg-[var(--vy-danger)]";
        if (score < 75) return "bg-[var(--vy-warning)]";
        return "bg-[var(--vy-success)]";
    };

    const getStatusText = (score: number) => {
        if (score < 40) return "Crítico";
        if (score < 75) return "Estable";
        return "Excelente";
    };

    return (
        <div className="mt-4 w-full">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--vy-neutral-500)]">Vitalidad AI</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase ${getStatusColor(vitality.score)}`}>
                        {vitality.status}
                    </span>
                </div>
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs font-medium text-[var(--vy-primary-600)] hover:text-[var(--vy-primary-700)] transition-colors underline underline-offset-2"
                >
                    {showDetails ? "Ocultar detalles" : "Ver por qué"}
                </button>
            </div>

            <div className="h-2.5 w-full bg-[var(--vy-neutral-100)] rounded-full overflow-hidden border border-[var(--vy-neutral-200)] p-[1px]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${vitality.score}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${getStatusColor(vitality.score)} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                />
            </div>

            <motion.div
                initial={false}
                animate={{ height: showDetails ? "auto" : 0, opacity: showDetails ? 1 : 0 }}
                className="overflow-hidden"
            >
                <div className="mt-4 p-4 bg-[var(--vy-primary-50)] border border-[var(--vy-primary-100)] rounded-2xl">
                    <h5 className="text-xs font-bold text-[var(--vy-primary-800)] uppercase mb-2 flex items-center gap-1.5">
                        <span>🤖</span> Sugerencias de la IA
                    </h5>
                    {vitality.suggestions.length > 0 ? (
                        <ul className="space-y-1.5">
                            {vitality.suggestions.map((s, i) => (
                                <li key={i} className="text-xs text-[var(--vy-primary-700)] flex items-start gap-2">
                                    <span className="mt-1 w-1 h-1 rounded-full bg-[var(--vy-primary-400)] shrink-0" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-[var(--vy-success)] font-medium">✨ ¡Tu mascota está al día con todo! Sigue así.</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
