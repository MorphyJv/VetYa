import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMedicalRecords, getVaccinations } from "../recordsActions";
import { getPetMoments } from "../momentsActions";
import { calculateVitalityIndex } from "../vitalityActions";
import PetTabsClient from "./PetTabsClient";
import VitalityBar from "./VitalityBar";

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
        <div className="space-y-8 max-w-5xl mx-auto">
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
            <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start border border-[var(--vy-neutral-200)] shadow-sm relative overflow-hidden">
                <div className="absolute -top-12 -right-12 text-9xl opacity-5 pointer-events-none">
                    {getAvatarFallback(pet.name, pet.species)}
                </div>

                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[var(--vy-primary-100)] to-[var(--vy-primary-300)] flex items-center justify-center text-6xl shrink-0 shadow-inner overflow-hidden border-4 border-white">
                    {pet.photo_url ? (
                        <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                        getAvatarFallback(pet.name, pet.species)
                    )}
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                    <h1 className="text-3xl font-bold text-[var(--vy-neutral-900)]">{pet.name}</h1>
                    <p className="text-lg text-[var(--vy-neutral-500)] capitalize mt-1">
                        {pet.breed || pet.species}
                    </p>

                    {vitality && <VitalityBar vitality={vitality} />}

                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                        <Badge label="Especie" value={
                            pet.species === 'dog' ? 'Perro' :
                                pet.species === 'cat' ? 'Gato' :
                                    pet.species === 'bird' ? 'Ave' :
                                        pet.species === 'reptile' ? 'Reptil' : 'Otro'
                        } />
                        <Badge label="Sexo" value={pet.sex === 'male' ? 'Macho' : pet.sex === 'female' ? 'Hembra' : 'Desconocido'} />
                        <Badge label="Peso" value={pet.weight_kg ? `${pet.weight_kg} kg` : 'N/A'} />
                        <Badge label="Nacimiento" value={pet.birth_date ? new Date(pet.birth_date).toLocaleDateString() : 'N/A'} />
                    </div>
                </div>
            </div>

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

function Badge({ label, value }: { label: string; value: string }) {
    return (
        <div className="px-3 py-1.5 rounded-lg bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-200)] flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--vy-neutral-400)]">{label}</span>
            <span className="text-sm font-semibold text-[var(--vy-neutral-700)]">{value}</span>
        </div>
    );
}
