import Link from "next/link";
import { motion } from "framer-motion"; // Note: Since this is a server component by default, and I want animations, I'll keep it static for now or add client boundary if needed. But I'll focus on CSS richness.

export default function ClinicDetailsPage() {
    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700 overflow-x-hidden">
            
            {/* Header / Back */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/clinic" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--surface)] border border-[var(--vy-neutral-200)] shadow-sm text-[var(--vy-neutral-600)] hover:text-[var(--vy-primary-600)] hover:bg-[var(--vy-primary-50)] transition-all hover:scale-105 active:scale-95">
                    <span className="text-xl">←</span>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-[var(--vy-neutral-900)] tracking-tight">Detalles de la Clínica</h1>
                    <p className="text-sm font-semibold text-[var(--vy-neutral-400)] uppercase tracking-wider">Centro Médico Afiliado VetYa Premium</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna Izquierda: Información Extendida */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Hero Card */}
                    <div className="bg-[var(--surface)] border border-[var(--vy-primary-100)] shadow-xl shadow-[var(--vy-primary-500)]/5 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative group">
                        {/* Premium Decorations */}
                        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[var(--vy-primary-100)] rounded-full blur-[100px] opacity-40 group-hover:opacity-70 transition-opacity"></div>
                        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[var(--vy-accent-100)] rounded-full blur-[80px] opacity-30"></div>
                        
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--vy-primary-500)] to-[var(--vy-primary-800)] flex items-center justify-center text-4xl shadow-2xl relative overflow-hidden ring-4 ring-white">
                                     <div className="absolute inset-0 bg-white/20 backdrop-blur-sm transform rotate-45 translate-y-12"></div>
                                     <span className="relative z-10">🏥</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-4xl font-black text-[var(--vy-neutral-900)] tracking-tighter">Central VetYa</h2>
                                        <span className="bg-[var(--vy-primary-500)] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg">Premium</span>
                                    </div>
                                    <p className="text-[var(--vy-primary-700)] font-black text-xs uppercase tracking-[0.2em]">Sede Norte Principal • Ciudad Capital</p>
                                </div>
                            </div>

                            <div className="bg-[var(--vy-neutral-50)] rounded-3xl p-6 border border-[var(--vy-neutral-100)] mb-10">
                                <p className="text-base text-[var(--vy-neutral-600)] leading-relaxed font-medium">
                                    "Nuestra misión es transformar el cuidado veterinario a través de la calidez humana y la tecnología de punta. Como centro de referencia principal de VetYa, garantizamos estándares internacionales en cada intervención médica."
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="font-black text-xs text-[var(--vy-neutral-400)] uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-6 h-px bg-[var(--vy-neutral-200)]"></span> Especialidades
                                    </h3>
                                    <ul className="grid grid-cols-1 gap-3">
                                        {["Medicina Interna", "Cirugía Altamente Compleja", "Odontología Láser", "Neurología Animmal"].map((item, i) => (
                                            <li key={i} className="text-sm font-bold text-[var(--vy-neutral-700)] flex items-center gap-3 group/li">
                                                <span className="w-8 h-8 rounded-xl bg-white border border-[var(--vy-neutral-200)] flex items-center justify-center text-[var(--vy-primary-500)] shadow-sm group-hover/li:bg-[var(--vy-primary-500)] group-hover/li:text-white transition-all">✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="font-black text-xs text-[var(--vy-neutral-400)] uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-6 h-px bg-[var(--vy-neutral-200)]"></span> Tecnología
                                    </h3>
                                    <ul className="grid grid-cols-1 gap-3">
                                        {["Laboratorio Genético 24h", "Tomografía Computarizada", "Telemedicina Integrada", "Sala Quirúrgica ISO 5"].map((item, i) => (
                                            <li key={i} className="text-sm font-bold text-[var(--vy-neutral-700)] flex items-center gap-3 group/li">
                                                <span className="w-8 h-8 rounded-xl bg-white border border-[var(--vy-neutral-200)] flex items-center justify-center text-[var(--vy-accent-500)] shadow-sm group-hover/li:bg-[var(--vy-accent-500)] group-hover/li:text-white transition-all">⚡</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Staff Card */}
                    <div className="bg-gradient-to-br from-[var(--vy-primary-600)] to-[var(--vy-primary-800)] shadow-lg rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 group">
                        <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden shrink-0 shadow-2xl relative">
                            <img src="https://ui-avatars.com/api/?name=Fernando+Ramirez&background=0D9488&color=fff&size=128" className="w-full h-full object-cover" alt="Dr. Fernando Ramírez" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-black text-2xl text-white tracking-tight">Dr. Fernando Ramírez</h3>
                            <p className="text-[var(--vy-primary-100)] font-bold text-sm mb-3">Director Médico Principal • Especialista en Cardiología</p>
                            <p className="text-white/80 text-xs leading-relaxed max-w-xl">
                                Liderando el equipo médico de Central VetYa con una visión de excelencia y empatía. Certificado Internacionalmente en Cuidados Críticos.
                            </p>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl">
                            🎓
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Mapa y Contacto */}
                <div className="space-y-8">
                    <div className="bg-[var(--surface)] border border-[var(--vy-neutral-200)] shadow-xl rounded-[2.5rem] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-[var(--vy-neutral-100)] flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-black text-sm text-[var(--vy-neutral-900)] uppercase tracking-widest">Ubicación GPS</h3>
                            <span className="text-2xl animate-bounce">📍</span>
                        </div>
                        
                        {/* MAPA GOOGLE MAPS IFRAME */}
                        <div className="w-full h-72 bg-gray-200 relative group">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115967.64024341991!2d-80.2017329774619!3d25.782545300000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a20ec8c111%3A0xff96f271ddad4f65!2sMiami%2C%20Florida%2C%20EE.%20UU.!5e0!3m2!1ses!2sbo!4v1714081699042!5m2!1ses!2sbo" 
                                className="absolute inset-0 w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                                allowFullScreen={false} 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10 group-hover:border-transparent transition-all"></div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[var(--vy-primary-50)] text-[var(--vy-primary-600)] flex items-center justify-center text-lg shrink-0">🏛️</div>
                                <div>
                                    <p className="text-[10px] uppercase font-black text-[var(--vy-neutral-400)] tracking-widest mb-1">Dirección Física</p>
                                    <p className="text-sm font-bold text-[var(--vy-neutral-800)] leading-tight">Av. Los Pinos 456, entre calles D y E.<br/>Barrio Residencial Norte.</p>
                                </div>
                            </div>
                            
                            <a target="_blank" rel="noreferrer" href="https://maps.google.com" className="w-full h-14 flex items-center justify-center gap-3 bg-[var(--vy-primary-600)] text-white font-black rounded-2xl text-sm hover:bg-[var(--vy-primary-700)] transition-all shadow-lg hover:shadow-[var(--vy-primary-500)]/30 active:scale-95">
                                <span>🗺️</span> VER RUTA EN MI GPS
                            </a>
                        </div>
                    </div>

                    {/* Emergency Widget */}
                    <div className="bg-gradient-to-br from-red-600 via-red-500 to-rose-600 p-8 rounded-[2.5rem] shadow-2xl shadow-red-500/20 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
                        <div className="text-5xl mb-4 animate-pulse">🏨</div>
                        <h3 className="font-black text-2xl mb-2 tracking-tight">Atención 24 Horas</h3>
                        <p className="text-xs text-white/70 font-semibold mb-8 uppercase tracking-widest">Traumatología y Cuidados Críticos</p>
                        <a href="tel:+59160012345" className="block w-full bg-white text-red-600 font-black py-4 rounded-2xl shadow-xl hover:bg-gray-100 transition-all active:scale-95 text-sm uppercase tracking-widest">
                            LLAMADA DE EMERGENCIA
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
