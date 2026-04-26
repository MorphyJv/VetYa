"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Pet {
    id: string;
    name: string;
    species: string;
    breed?: string;
    photo_url?: string;
    sex?: string;
    weight_kg?: number;
    birth_date?: string;
}

interface Vitality {
    score: number;
    suggestions?: string[];
}

export default function PetInteractiveHeader({ 
    pet, 
    initialVitality, 
    avatarFallback 
}: { 
    pet: Pet, 
    initialVitality: Vitality | null, 
    avatarFallback: string 
}) {
    const [vitalityScore, setVitalityScore] = useState<number>(initialVitality?.score || 50);
    const [showHappy, setShowHappy] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [faceProps, setFaceProps] = useState({ face: ":D", rotate: 0, scale: 1 });

    const getStatusColor = (score: number) => {
        if (score < 40) return "bg-[var(--vy-danger)]";
        if (score < 75) return "bg-[var(--vy-warning)]";
        return "bg-[var(--vy-success)]";
    };

    const getStatusText = (score: number) => {
        if (score < 40) return "Crítico (Hambriento/a)";
        if (score < 75) return "Estable";
        return "Excelente (Bien alimentado/a)";
    };

    const handleFeed = () => {
        setVitalityScore((prev: number) => Math.min(100, prev + 20));
        setShowHappy(true);
        setFaceProps({ face: ":D", rotate: 0, scale: 1 });
        
        setTimeout(() => setFaceProps({ face: ";D", rotate: 18, scale: 1.3 }), 800); // Parpadeo y salto
        setTimeout(() => setFaceProps({ face: ":D", rotate: 0, scale: 1 }), 1400); // Vuelve a la normalidad
        setTimeout(() => setShowHappy(false), 2200); // Se va más rápido
    };

    return (
        <div className="bg-[var(--surface)] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start border border-[var(--vy-neutral-200)] shadow-sm relative overflow-hidden">
            <div className="absolute -top-12 -right-12 text-9xl opacity-5 pointer-events-none z-0">
                {avatarFallback}
            </div>

            {/* Avatar Column */}
            <div className="relative flex flex-col items-center shrink-0 z-10 w-32">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[var(--vy-primary-100)] to-[var(--vy-primary-300)] flex items-center justify-center text-6xl shadow-inner overflow-hidden border-4 border-[var(--surface)] relative z-20">
                    {pet.photo_url ? (
                        <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                        avatarFallback
                    )}
                </div>

                {/* Happy Face Animation */}
                <div className="absolute -bottom-8 w-full flex justify-center h-8 z-30 pointer-events-none">
                    <AnimatePresence>
                        {showHappy && (
                            <motion.div
                                key="happy-face"
                                initial={{ opacity: 0, y: 0, scale: 0.5, rotate: 0 }}
                                animate={{ opacity: 1, y: 20, scale: faceProps.scale, rotate: faceProps.rotate }}
                                exit={{ opacity: 0, y: 10, scale: 0.5, transition: { duration: 0.3, type: "tween", ease: "easeIn" } }}
                                transition={{ duration: 0.4, type: "spring", bounce: 0.5 }}
                                className="text-2xl font-black text-[var(--vy-primary-500)] drop-shadow-md tracking-widest origin-center"
                            >
                                {faceProps.face}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Info Column */}
            <div className="flex-1 text-center md:text-left z-10 w-full">
                <h1 className="text-3xl font-bold text-[var(--vy-neutral-900)]">{pet.name}</h1>
                <p className="text-lg text-[var(--vy-neutral-500)] capitalize mt-1">
                    {pet.breed || pet.species}
                </p>

                {/* Interactive Vitality Bar */}
                <div className="mt-5 w-full bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-200)] rounded-2xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--vy-neutral-500)]">Vitalidad Diaria</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase transition-colors ${getStatusColor(vitalityScore)}`}>
                                {getStatusText(vitalityScore)}
                            </span>
                        </div>
                        
                        <div className="flex gap-2 justify-center sm:justify-end">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="text-xs font-medium text-[var(--vy-primary-600)] hover:text-[var(--vy-primary-700)] transition-colors underline underline-offset-2"
                            >
                                {showDetails ? "Ocultar IA" : "Ver por qué"}
                            </button>
                            <button
                                onClick={handleFeed}
                                disabled={vitalityScore >= 100}
                                className="px-4 py-1.5 bg-[var(--vy-primary-600)] hover:bg-[var(--vy-primary-700)] text-white items-center flex gap-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                🍖 Alimentar
                            </button>
                        </div>
                    </div>

                    <div className="h-3 w-full bg-[var(--vy-neutral-100)] rounded-full overflow-hidden border border-[var(--vy-neutral-200)] p-[1px] relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${vitalityScore}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full shadow-inner transition-colors duration-500 ${getStatusColor(vitalityScore)}`}
                        />
                    </div>

                    {/* AI Suggestions Dropdown */}
                    <AnimatePresence>
                        {showDetails && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-4 pt-4 border-t border-[var(--vy-neutral-200)]">
                                    <h5 className="text-xs font-bold text-[var(--vy-primary-800)] uppercase mb-2 flex items-center gap-1.5">
                                        <span>🤖</span> Sugerencias de Salud
                                    </h5>
                                    {initialVitality?.suggestions && initialVitality.suggestions.length > 0 ? (
                                        <ul className="space-y-1.5">
                                            {initialVitality.suggestions.map((s: string, i: number) => (
                                                <li key={i} className="text-xs text-[var(--vy-primary-700)] flex items-start gap-2">
                                                    <span className="mt-1 w-1 h-1 rounded-full bg-[var(--vy-primary-400)] shrink-0" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-[var(--vy-success)] font-medium">✨ ¡Tu mascota está al día con sus vacunas y controles médicos!</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

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
    );
}

function Badge({ label, value }: { label: string; value: string }) {
    return (
        <div className="px-3 py-1.5 rounded-lg bg-[var(--surface)] shadow-sm border border-[var(--vy-neutral-200)] flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--vy-neutral-400)]">{label}</span>
            <span className="text-sm font-semibold text-[var(--vy-neutral-700)]">{value}</span>
        </div>
    );
}
