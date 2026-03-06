"use server";

import { createClient } from "@/lib/supabase/server";

export async function calculateVitalityIndex(petId: string) {
    const supabase = await createClient();

    // 1. Fetch all context
    const { data: pet } = await supabase.from("pets").select("*").eq("id", petId).single();
    const { data: records } = await supabase.from("medical_records").select("*").eq("pet_id", petId);
    const { data: vaccines } = await supabase.from("vaccinations").select("*").eq("pet_id", petId);

    if (!pet) return null;

    let score = 50; // Base score
    const suggestions: string[] = [];

    // --- LOGIC 1: Medical Records (40 pts) ---
    if (!records || records.length === 0) {
        score -= 20;
        suggestions.push("Registra su primera consulta médica para un mejor seguimiento.");
    } else {
        const lastVisit = new Date(Math.max(...records.map(r => new Date(r.visit_date).getTime())));
        const monthsSinceLastVisit = (new Date().getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24 * 30);

        if (monthsSinceLastVisit <= 6) {
            score += 20;
        } else if (monthsSinceLastVisit > 12) {
            score -= 10;
            suggestions.push("Ya pasó más de un año desde su última visita al veterinario.");
        } else {
            score += 10;
        }
    }

    // --- LOGIC 2: Vaccinations (30 pts) ---
    if (!vaccines || vaccines.length === 0) {
        score -= 15;
        suggestions.push("Completa su carnet de vacunación.");
    } else {
        const overdueVaccines = vaccines.filter(v => v.next_due_date && new Date(v.next_due_date) < new Date());
        if (overdueVaccines.length > 0) {
            score -= 15;
            suggestions.push(`Tiene ${overdueVaccines.length} vacuna(s) pendiente(s).`);
        } else {
            score += 15;
        }
    }

    // --- LOGIC 3: Profile Completion & Weight (30 pts) ---
    if (pet.weight_kg) score += 10;
    else suggestions.push("Agrega el peso actual para monitorear su estado físico.");

    if (pet.birth_date) score += 10;

    if (pet.photo_url) score += 10;
    else suggestions.push("Sube una foto de perfil para identificarlo mejor.");

    // Final clamp
    score = Math.max(5, Math.min(100, score));

    let status = "Estable";
    if (score > 85) status = "Excelente";
    else if (score < 40) status = "Crítico";

    return {
        score,
        status,
        suggestions
    };
}
