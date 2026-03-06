import { createClient } from "@/lib/supabase/server";
import { getPets } from "../pets/actions";
import AIChatClient from "./AIChatClient";
import React from "react";

export default async function AIPage() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-[var(--vy-neutral-200)] shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-[var(--vy-neutral-100)] flex items-center justify-center text-4xl mb-6 grayscale opacity-50">🤖</div>
            <h2 className="text-xl font-bold text-[var(--vy-neutral-900)] mb-2">Asistente VetYa AI</h2>
            <p className="text-sm text-[var(--vy-neutral-500)] max-w-xs">
                Esta función no está disponible por ahora. Estamos trabajando para mejorar tu experiencia. 🐾✨
            </p>
        </div>
    );
}

// vetya_serialization_fix_v2_applied_at_1772778180000

