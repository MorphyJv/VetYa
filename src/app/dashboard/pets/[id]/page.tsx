import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMedicalRecords, getVaccinations } from "../recordsActions";
import { getPetMoments } from "../momentsActions";
import { calculateVitalityIndex } from "../vitalityActions";
import PetTabsClient from "./PetTabsClient";
import PetInteractiveHeader from "./PetInteractiveHeader";

import PetDetailHeaderActions from "./PetDetailHeaderActions";

export default async function PetDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();
    const { data: pet, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", params.id)
        .single();

    if (error || !pet) {
        notFound();
    }

    // Fetch related data
    const { data: records } = await getMedicalRecords(pet.id);
    const { data: vaccinations } = await getVaccinations(pet.id);
    const { data: moments } = await getPetMoments(pet.id);
    const vitality = await calculateVitalityIndex(pet.id);

    const getAvatarFallback = (name: string, species: string) => {
        // ... (conservar lógica)
        if (species === 'dog') return '🐶';
        if (species === 'cat') return '🐱';
        if (species === 'bird') return '🐦';
        if (species === 'reptile') return '🦎';
        return '🐾';
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 lg:p-8 pt-8 pb-24">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard/pets"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--vy-neutral-500)] hover:text-[var(--vy-neutral-900)] transition-colors"
                >
                    <span>←</span> Volver a Mascotas
                </Link>
                <PetDetailHeaderActions pet={pet} />
            </div>

            {/* Pet Header Card */}
            <PetInteractiveHeader 
                pet={pet} 
                initialVitality={vitality} 
                avatarFallback={getAvatarFallback(pet.name, pet.species)} 
            />

            {/* Interactive Tabs for Records, Vaccinations & Moments */}
            <PetTabsClient
                petId={pet.id}
                initialRecords={records || []}
                initialVaccinations={vaccinations || []}
                initialMoments={moments || []}
            />
        </div>
    );
}


