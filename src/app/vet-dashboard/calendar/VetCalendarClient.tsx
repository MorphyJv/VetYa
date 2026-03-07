"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { addVetCalendarEvent, toggleVetEventCompletion } from "./actions";


export default function VetCalendarClient({
    initialEvents,
    pets,
}: {
    initialEvents: any[];
    pets: any[];
}) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Derive days for the grid
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    // Adjust to Monday=0, Sunday=6
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const handlePrevMonth = () =>
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () =>
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    // GRID CALCULATION
    const totalCells = startingDay + daysInMonth;
    const trailingEmpty = (7 - (totalCells % 7)) % 7;

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        await addVetCalendarEvent(formData);
        setLoading(false);
        setShowModal(false);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "vaccine": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
            case "deworming": return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
            case "checkup": return "bg-teal-500/10 text-teal-600 dark:text-teal-400";
            case "medication": return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
            default: return "bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)]";
        }
    };

    const getDayEvents = (day: number) => {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return initialEvents.filter(ev => isSameDay(targetDate, new Date(ev.event_datetime)));
    };

    const selectedDateEvents = initialEvents.filter(ev =>
        isSameDay(selectedDate, new Date(ev.event_datetime))
    );

    return (
        <div className="bg-[var(--surface)] rounded-[40px] border-2 border-[var(--border)] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[750px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ── Left: Calendar Grid ── */}
            <div className="flex-1 p-8 lg:p-10 border-b-2 lg:border-b-0 lg:border-r-2 border-[var(--border)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-[var(--vy-neutral-900)] dark:text-white capitalize tracking-tight leading-none mb-2 underline decoration-[var(--vy-primary-500)] decoration-4">
                            Control de Citas
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--vy-neutral-600)] dark:text-slate-300">
                            {currentDate.toLocaleDateString("es", { month: "long" })} {currentDate.getFullYear()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrevMonth}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--vy-neutral-600)] hover:bg-[var(--vy-primary-500)] hover:text-white transition-all shadow-sm active:scale-90"
                        >
                            <span className="text-xl leading-none">←</span>
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--vy-neutral-600)] hover:bg-[var(--vy-primary-500)] hover:text-white transition-all shadow-sm active:scale-90"
                        >
                            <span className="text-xl leading-none">→</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-0 border-t-2 border-l-2 border-slate-300 dark:border-slate-500 sm:border-t-4 sm:border-l-4 rounded-[40px] overflow-hidden shadow-2xl shadow-black/40 bg-[var(--surface)]">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(day => (
                        <div key={day} className="text-center py-6 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--vy-neutral-700)] dark:text-white border-r-2 border-b-2 sm:border-r-4 sm:border-b-4 border-slate-300 dark:border-slate-500 bg-[var(--background)]/60 backdrop-blur-md">
                            {day}
                        </div>
                    ))}

                    {/* Start empty cells */}
                    {Array.from({ length: startingDay }).map((_, i) => (
                        <div key={`empty-start-${i}`} className="min-h-24 p-2 opacity-10 border-r-2 border-b-2 sm:border-r-4 sm:border-b-4 border-slate-300 dark:border-slate-500 bg-[var(--background)]/20" />
                    ))}

                    {/* Actual days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const thisDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const isToday = isSameDay(new Date(), thisDate);
                        const isSelected = isSameDay(selectedDate, thisDate);
                        const todayEvents = getDayEvents(day);

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(thisDate)}
                                className={`min-h-[140px] p-4 relative flex flex-col items-start hover:bg-[var(--vy-primary-500)]/10 transition-all outline-none group border-r-2 border-b-2 sm:border-r-4 sm:border-b-4 border-slate-300 dark:border-slate-500
                  ${isSelected ? "bg-[var(--vy-primary-500)]/[0.12] z-10 shadow-inner" : "bg-[var(--surface)]"}`}
                            >
                                <span className={`w-12 h-12 flex items-center justify-center rounded-2xl text-[18px] font-black transition-all shadow-sm
                  ${isToday && !isSelected ? "bg-[var(--vy-primary-500)]/20 text-[var(--vy-primary-500)] ring-2 ring-[var(--vy-primary-500)]/30" : ""}
                  ${isSelected ? "bg-[var(--vy-primary-600)] text-white scale-110 shadow-lg shadow-[var(--vy-primary-500)]/40" : "text-[var(--vy-neutral-900)] dark:text-white group-hover:scale-110"}`}>
                                    {day}
                                </span>
                                <div className="mt-4 w-full flex flex-col gap-2">
                                    {todayEvents.slice(0, 2).map(ev => (
                                        <div key={ev.id} className={`w-full text-left truncate text-[10px] font-black uppercase tracking-tight px-3 py-1.5 rounded-xl shadow-md border border-black/10 ${getTypeColor(ev.event_type)} ${ev.completed ? "opacity-30 line-through" : ""}`}>
                                            {ev.title}
                                        </div>
                                    ))}
                                    {todayEvents.length > 2 && (
                                        <div className="text-[10px] text-[var(--vy-neutral-600)] dark:text-[var(--vy-neutral-400)] font-black uppercase tracking-widest pl-1 mt-1">
                                            +{todayEvents.length - 2} más
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}

                    {/* End empty cells */}
                    {Array.from({ length: trailingEmpty }).map((_, i) => (
                        <div key={`empty-end-${i}`} className="min-h-24 p-2 opacity-10 border-r-2 border-b-2 sm:border-r-4 sm:border-b-4 border-slate-300 dark:border-slate-500 bg-[var(--background)]/20" />
                    ))}
                </div>
            </div>

            {/* ── Right: Sidebar ── */}
            <div className="w-full lg:w-[400px] p-8 lg:p-10 flex flex-col bg-[var(--background)]/30 backdrop-blur-md">
                <h3 className="text-2xl font-black text-[var(--vy-neutral-900)] mb-1 uppercase tracking-tight">
                    {isSameDay(selectedDate, new Date())
                        ? "Hoy"
                        : selectedDate.toLocaleDateString("es", { weekday: "long", day: "numeric" })}
                </h3>
                <p className="text-[10px] font-black text-[var(--vy-neutral-500)] mb-8 uppercase tracking-widest">
                    {selectedDateEvents.length} eventos programados
                </p>

                <div className="flex-1 overflow-y-auto space-y-4 mb-8 custom-scrollbar">
                    {selectedDateEvents.length === 0 ? (
                        <div className="text-center py-16 text-[var(--vy-neutral-400)]">
                            <div className="text-5xl mb-6 opacity-20 grayscale">📅</div>
                            <p className="text-[10px] font-black uppercase tracking-widest">Agenda despejada</p>
                        </div>
                    ) : (
                        selectedDateEvents.map(ev => (
                            <div key={ev.id} className={`p-5 bg-[var(--surface)] rounded-[32px] border-2 ${ev.completed ? "opacity-40 border-[var(--border)] grayscale" : "border-[var(--border)] shadow-sm hover:border-[var(--vy-primary-500)]/30"} transition-all group`}>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm ${getTypeColor(ev.event_type)}`}>
                                                {ev.event_type}
                                            </span>
                                            <span className="text-[9px] text-[var(--vy-neutral-400)] font-black uppercase tracking-widest opacity-70">
                                                {new Date(ev.event_datetime).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                        <h4 className={`font-black text-sm text-[var(--vy-neutral-900)] leading-tight uppercase tracking-tight ${ev.completed ? "line-through" : ""}`}>
                                            {ev.title}
                                        </h4>
                                        {ev.pet?.name && (
                                            <p className="text-[10px] font-bold text-[var(--vy-neutral-500)] mt-2 flex items-center gap-2 uppercase tracking-widest opacity-80">
                                                <span className="text-xs">🐾</span> {ev.pet.name}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => toggleVetEventCompletion(ev.id, ev.completed)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-2xl border-2 transition-all shrink-0 active:scale-90 ${ev.completed ? "bg-[var(--vy-primary-500)] border-[var(--vy-primary-500)] text-white shadow-lg shadow-[var(--vy-primary-500)]/30" : "border-[var(--border)] text-transparent hover:border-[var(--vy-primary-500)] group-hover:scale-105"}`}
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={4}>
                                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Link
                    href={`/vet-dashboard/calendar/notas/${selectedDate.toISOString().split("T")[0]}`}
                    className="w-full flex items-center gap-3 py-4 px-5 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] text-[10px] font-black uppercase tracking-widest text-[var(--vy-neutral-700)] hover:bg-[var(--vy-primary-500)]/5 hover:border-[var(--vy-primary-500)]/50 hover:text-[var(--vy-primary-600)] transition-all mb-4 mt-auto shadow-sm active:scale-95"
                >
                    <span className="text-xl">📓</span>
                    Notas del día
                    <span className="ml-auto text-lg opacity-30">→</span>
                </Link>

                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowModal(true)}
                    disabled={pets.length === 0}
                    className="w-full py-4 rounded-2xl bg-[var(--vy-primary-600)] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[var(--vy-primary-700)] transition-all shadow-xl shadow-[var(--vy-primary-500)]/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                    {pets.length === 0 ? "Registra un paciente primero" : "Añadir Evento"}
                </motion.button>
            </div>

            {/* ── Add Event Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[var(--surface)] p-10 rounded-[40px] shadow-2xl w-full max-w-md relative z-10 border-2 border-[var(--border)]"
                        >
                            <h3 className="text-2xl font-black text-[var(--vy-neutral-900)] mb-8 uppercase tracking-tight">Nuevo Evento</h3>

                            <form onSubmit={handleAddEvent} className="space-y-4">
                                <input
                                    type="hidden"
                                    name="event_datetime"
                                    value={`${selectedDate.toISOString().split("T")[0]}T10:00:00`}
                                />

                                <div>
                                    <label className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest mb-2 px-1">
                                        Título del compromiso
                                    </label>
                                    <input
                                        name="title"
                                        required
                                        placeholder="Ej. Vacuna Antirrábica"
                                        className="w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold placeholder:text-[var(--vy-neutral-300)] focus:border-[var(--vy-primary-500)] outline-none transition-all shadow-inner"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest mb-2 px-1">
                                            Paciente
                                        </label>
                                        <select
                                            name="pet_id"
                                            required
                                            className="w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold text-[var(--vy-neutral-800)] focus:border-[var(--vy-primary-500)] outline-none transition-all shadow-inner appearance-none"
                                        >
                                            <option value="">Selecciona...</option>
                                            {pets.map(pet => (
                                                <option key={pet.id} value={pet.id}>{pet.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest mb-2 px-1">
                                            Categoría
                                        </label>
                                        <select
                                            name="event_type"
                                            required
                                            className="w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold text-[var(--vy-neutral-800)] focus:border-[var(--vy-primary-500)] outline-none transition-all shadow-inner appearance-none"
                                        >
                                            <option value="vaccine">Vacuna</option>
                                            <option value="deworming">Desparasitación</option>
                                            <option value="checkup">Chequeo</option>
                                            <option value="medication">Medicamento</option>
                                            <option value="other">Otro</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-8 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--vy-neutral-500)] hover:bg-[var(--vy-neutral-100)] transition-all"
                                    >
                                        Volver
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] py-4 rounded-2xl bg-[var(--vy-primary-600)] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[var(--vy-primary-700)] shadow-xl shadow-[var(--vy-primary-500)]/20 transition-all disabled:opacity-50 active:scale-95"
                                    >
                                        {loading ? "Registrando..." : "Guardar Evento"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
