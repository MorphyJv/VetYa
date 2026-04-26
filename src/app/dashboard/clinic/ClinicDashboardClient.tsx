"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function ClinicDashboardClient({ pets }: { pets: Pet[] }) {
    const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);

    const clinicContact = "+59160012345";

    const getAvatarFallback = (name: string, species: string) => {
        if (!name) return '🐾';
        if (species === 'dog') return '🐶';
        if (species === 'cat') return '🐱';
        if (species === 'bird') return '🐦';
        if (species === 'reptile') return '🦎';
        return '🐾';
    };

    return (
        <div className="space-y-8 overflow-x-hidden">
            {/* 1. SECCIÓN: CLÍNICA AFILIADA */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[var(--vy-neutral-800)]">Veterinaria Afiliada</h2>
                    <button className="text-xs font-bold text-[var(--vy-primary-600)] bg-[var(--vy-primary-50)] hover:bg-[var(--vy-primary-100)] px-3 py-1.5 rounded-lg transition-colors">
                        Cambiar Clínica
                    </button>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--vy-primary-200)] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--vy-primary-50)] rounded-full blur-3xl opacity-50 z-0"></div>

                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--vy-primary-400)] to-[var(--vy-primary-700)] flex items-center justify-center text-4xl shadow-md z-10 shrink-0">
                        🩺
                    </div>

                    <div className="flex-1 z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-2xl font-black text-[var(--vy-neutral-900)]">Central VetYa (Sede Norte)</h3>
                            <span className="bg-[var(--vy-success)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Activo</span>
                        </div>
                        <p className="text-[var(--vy-neutral-500)] mb-4 text-sm font-medium">Dr. Fernando Ramírez — Director Médico</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-[var(--vy-neutral-600)]">
                                <span className="p-1.5 bg-[var(--vy-neutral-50)] rounded-md border border-[var(--vy-neutral-200)] text-base">📍</span>
                                <span>Av. Los Pinos 456, Ciudad Capital</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--vy-neutral-600)]">
                                <span className="p-1.5 bg-[var(--vy-neutral-50)] rounded-md border border-[var(--vy-neutral-200)] text-base">📞</span>
                                <span>+591 600-12345</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--vy-neutral-600)]">
                                <span className="p-1.5 bg-[var(--vy-neutral-50)] rounded-md border border-[var(--vy-neutral-200)] text-base">🕒</span>
                                <span>Lunes a Sábados (08:00 - 20:00)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--vy-neutral-600)]">
                                <span className="p-1.5 bg-[var(--vy-neutral-50)] rounded-md border border-[var(--vy-neutral-200)] text-base">⭐</span>
                                <span>4.9 / 5 (Afiliada Premium)</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setAppointmentModalOpen(true)}
                                className="bg-[var(--vy-primary-600)] hover:bg-[var(--vy-primary-700)] text-white text-sm font-bold py-2 px-5 rounded-xl shadow-md transition-transform active:scale-95"
                            >
                                Agendar Cita
                            </button>
                            <Link 
                                href="/dashboard/clinic/details" 
                                className="bg-[var(--surface)] hover:bg-[var(--vy-neutral-50)] text-[var(--vy-neutral-700)] border border-[var(--vy-neutral-200)] text-sm font-bold py-2 px-5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center"
                            >
                                Ver Detalles del Centro
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. SECCIÓN: CARNET DIGITAL ESTILIZADO (Estilo VetYa Claro) */}
            <section className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[var(--vy-neutral-800)]">Carnet Digital de Mascotas</h2>
                    <p className="text-xs font-bold text-[var(--vy-primary-600)] bg-[var(--vy-primary-50)] px-2 py-1 rounded-md">Válido en red VetYa</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pets && pets.length > 0 ? (
                        pets.map(pet => (
                            <div key={pet.id} className="relative bg-[var(--surface)] border-[1.5px] border-[var(--vy-primary-100)] rounded-[2rem] p-6 shadow-md hover:shadow-xl hover:-translate-y-1 overflow-hidden group transition-all duration-300">
                                {/* Decoraciones del ID Card Claro */}
                                <div className="absolute -top-16 -right-10 text-[180px] opacity-[0.03] rotate-12 pointer-events-none scale-150">
                                    {getAvatarFallback(pet.name, pet.species)}
                                </div>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[var(--vy-primary-200)] to-transparent rounded-full blur-[60px] opacity-20"></div>

                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Header de la Tarjeta */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-[var(--vy-primary-500)] shadow-sm rounded-full flex items-center justify-center border-2 border-white">
                                            <span className="text-lg font-black text-white">V+</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-[var(--vy-primary-700)] font-bold">Documento de Identificación</p>
                                            <p className="text-sm font-black text-[var(--vy-neutral-900)] leading-tight tracking-tight">VetYa ID Card</p>
                                        </div>
                                        <div className="ml-auto flex items-center h-8 bg-[var(--vy-primary-50)] px-2.5 rounded-lg border border-[var(--vy-primary-100)] text-[11px] font-bold text-[var(--vy-primary-700)] shadow-sm">
                                            VERIFICADO 🛡️
                                        </div>
                                    </div>

                                    {/* Contenido principal */}
                                    <div className="flex gap-4">
                                        <div className="w-28 h-28 rounded-[20px] bg-[var(--vy-neutral-50)] border-4 border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center text-4xl">
                                            {pet.photo_url ? (
                                                <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                                            ) : (
                                                getAvatarFallback(pet.name, pet.species)
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-2xl font-black text-[var(--vy-neutral-900)] truncate tracking-tight">{pet.name}</h3>
                                            <p className="text-[var(--vy-neutral-500)] font-semibold text-xs capitalize truncate mb-3">
                                                {pet.breed || pet.species}
                                            </p>

                                            <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                                                <div className="bg-[var(--vy-neutral-50)] p-2 rounded-xl border border-[var(--vy-neutral-100)]">
                                                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--vy-neutral-400)] mb-0.5">Sexo</p>
                                                    <p className="text-xs font-bold text-[var(--vy-neutral-700)] truncate">{pet.sex === 'male' ? 'Macho' : pet.sex === 'female' ? 'Hembra' : 'N/A'}</p>
                                                </div>
                                                <div className="bg-[var(--vy-neutral-50)] p-2 rounded-xl border border-[var(--vy-neutral-100)]">
                                                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--vy-neutral-400)] mb-0.5">Nacimiento</p>
                                                    <p className="text-xs font-bold text-[var(--vy-neutral-700)] truncate">{pet.birth_date ? new Date(pet.birth_date).toLocaleDateString() : '--/--/----'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer / Barcode simulado */}
                                    <div className="mt-6 pt-4 flex items-center justify-between border-t border-[var(--vy-neutral-100)]">
                                        <div>
                                            <p className="text-[9px] uppercase font-bold tracking-wider text-[var(--vy-neutral-400)] mb-0.5">ID de Paciente</p>
                                            <p className="font-mono text-sm tracking-wider text-[var(--vy-primary-700)] font-bold">
                                                VY-{pet.id.split('-').shift()?.toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="h-6 w-24 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/UPC-A-036000291452.svg/320px-UPC-A-036000291452.svg.png')] bg-contain bg-no-repeat bg-right opacity-30 grayscale filter mix-blend-multiply"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-[var(--surface)] rounded-2xl p-8 border border-[var(--vy-neutral-200)] text-center shadow-sm">
                            <span className="text-4xl mb-3 block">🆔</span>
                            <h3 className="text-[var(--vy-neutral-900)] font-bold">No hay mascotas registradas</h3>
                            <p className="text-[var(--vy-neutral-50)] text-sm mt-1 mb-4">Registra una mascota para generar su carnet digital oficial.</p>
                            <Link href="/dashboard/pets" className="inline-block bg-[var(--vy-primary-500)] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[var(--vy-primary-600)] transition-colors">
                                Ir a Mascotas
                            </Link>
                        </div>
                    )}

                    {/* NUEVO BLOQUE: CONTACTOS SOCIALES (AL COSTADO DEL CARNET) */}
                    <div className="relative bg-gradient-to-br from-[var(--vy-primary-600)] to-[var(--vy-primary-800)] rounded-[2rem] p-8 shadow-xl text-white overflow-hidden flex flex-col justify-between group h-full min-h-[300px]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--vy-accent-400)]/20 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-1 tracking-tight">Conecta con nosotros</h3>
                            <p className="text-sm font-medium text-[var(--vy-primary-100)] mb-6">Estamos en tus redes favoritas para consejos y noticias.</p>

                            <div className="grid grid-cols-2 gap-3">
                                <a href="https://wa.me/59160012345" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group/icon">
                                    <span className="text-xl group-hover/icon:scale-125 transition-transform">📱</span>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase opacity-60">WhatsApp</p>
                                        <p className="text-xs font-bold truncate">Chat Directo</p>
                                    </div>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all group/icon">
                                    <span className="text-xl group-hover/icon:scale-125 transition-transform">📸</span>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase opacity-60">Instagram</p>
                                        <p className="text-xs font-bold truncate">@VetYaCentral</p>
                                    </div>
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group/icon">
                                    <span className="text-xl group-hover/icon:scale-125 transition-transform">📘</span>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase opacity-60">Facebook</p>
                                        <p className="text-xs font-bold truncate">Veterinaria CM</p>
                                    </div>
                                </a>
                                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group/icon">
                                    <span className="text-xl group-hover/icon:scale-125 transition-transform">🎵</span>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase opacity-60">Tiktok</p>
                                        <p className="text-xs font-bold truncate">VetYa_Tips</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="relative z-10 pt-6">
                            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-[var(--vy-success)] animate-pulse shadow-[0_0_8px_var(--vy-success)]"></div>
                                <p className="text-[10px] font-bold text-white/80">Respondemos en menos de 10 minutos por WhatsApp</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. MODAL DE AGENDAR CITA */}
            <AnimatePresence>
                {isAppointmentModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setAppointmentModalOpen(false)}
                            className="absolute inset-0 bg-[var(--vy-neutral-900)]/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", bounce: 0.4 }}
                            className="relative w-full max-w-sm bg-[var(--surface)] rounded-3xl p-6 shadow-2xl border border-[var(--vy-neutral-100)]"
                        >
                            <button 
                                onClick={() => setAppointmentModalOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-200)] hover:text-red-500 transition-colors"
                            >
                                ✕
                            </button>

                            <div className="text-center mb-6 pt-2">
                                <div className="mx-auto w-16 h-16 bg-[var(--vy-primary-50)] text-[var(--vy-primary-500)] text-3xl flex items-center justify-center rounded-full mb-3">
                                    🏥
                                </div>
                                <h3 className="text-xl font-bold text-[var(--vy-neutral-900)]">Contactar Clínica</h3>
                                <p className="text-[var(--vy-neutral-500)] text-sm px-2 mt-1">
                                    ¿Cómo prefieres agendar tu cita con Central VetYa?
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Link 
                                    href="/dashboard/clinic/chat"
                                    onClick={() => setAppointmentModalOpen(false)}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] hover:bg-[var(--vy-primary-50)] border border-[var(--vy-neutral-200)] hover:border-[var(--vy-primary-300)] shadow-sm hover:shadow-md transition-all group pointer-events-auto"
                                >
                                    <div className="text-2xl group-hover:scale-110 transition-transform">💬</div>
                                    <div className="text-left flex-1">
                                        <p className="font-bold text-[var(--vy-neutral-900)] text-sm">Escribir Mensaje</p>
                                        <p className="text-[10px] text-[var(--vy-neutral-500)]">Chatea directo con recepción</p>
                                    </div>
                                    <span className="text-[var(--vy-neutral-400)] transition-transform group-hover:translate-x-1">→</span>
                                </Link>

                                <a 
                                    href={`tel:${clinicContact}`}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] hover:bg-[var(--vy-success)]/10 border border-[var(--vy-neutral-200)] hover:border-[var(--vy-success)] shadow-sm hover:shadow-md transition-all group pointer-events-auto"
                                >
                                    <div className="text-2xl group-hover:scale-110 transition-transform">📞</div>
                                    <div className="text-left flex-1">
                                        <p className="font-bold text-[var(--vy-neutral-900)] text-sm">Llamar Ahora</p>
                                        <p className="text-[10px] text-[var(--vy-neutral-500)]">Atención telefónica directa</p>
                                    </div>
                                    <span className="text-green-500 font-bold transition-transform group-hover:translate-x-1">→</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
