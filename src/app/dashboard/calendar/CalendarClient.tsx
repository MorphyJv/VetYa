"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { addCalendarEvent, toggleEventCompletion, deleteCalendarEvent } from "./actions";

export default function CalendarClient({
    initialEvents,
    pets
}: {
    initialEvents: any[];
    pets: any[];
}) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Derive days for the grid
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    // Adjust to make Monday=0, Sunday=6
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        await addCalendarEvent(formData);
        setLoading(false);
        setShowModal(false);
    };

    // Helper to visually identify event type
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'vaccine': return 'bg-blue-100 text-blue-700';
            case 'deworming': return 'bg-purple-100 text-purple-700';
            case 'checkup': return 'bg-[var(--vy-success)]/10 text-[var(--vy-success)]';
            case 'medication': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getDayEvents = (day: number) => {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return initialEvents.filter(ev => {
            const evDate = new Date(ev.event_datetime);
            return isSameDay(targetDate, evDate);
        });
    };

    const selectedDateEvents = initialEvents.filter(ev => {
        const evDate = new Date(ev.event_datetime);
        return isSameDay(selectedDate, evDate);
    });

    return (
        <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* ── Calendar Grid ── */}
            <div className="flex-1 p-6 lg:border-r border-[var(--vy-neutral-200)]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-[var(--vy-neutral-900)] capitalize">
                        {currentDate.toLocaleDateString('es', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-200)] transition-colors">
                            ←
                        </button>
                        <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-200)] transition-colors">
                            →
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-px bg-[var(--vy-neutral-200)] border border-[var(--vy-neutral-200)] rounded-2xl overflow-hidden">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(day => (
                        <div key={day} className="bg-[var(--vy-neutral-50)] text-center py-3 text-xs font-semibold text-[var(--vy-neutral-500)]">
                            {day}
                        </div>
                    ))}

                    {Array.from({ length: startingDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-white min-h-24 p-2 opacity-30" />
                    ))}

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
                                className={`bg-white min-h-24 p-2 relative flex flex-col items-start hover:bg-[var(--vy-primary-50)] transition-colors outline-none
                  ${isSelected ? "ring-2 ring-inset ring-[var(--vy-primary-500)] z-10" : ""}
                `}
                            >
                                <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
                  ${isToday && !isSelected ? "bg-[var(--vy-primary-100)] text-[var(--vy-primary-700)]" : ""}
                  ${isSelected ? "bg-[var(--vy-primary-600)] text-white" : "text-[var(--vy-neutral-700)]"}
                `}>
                                    {day}
                                </span>

                                <div className="mt-2 w-full flex flex-col gap-1">
                                    {todayEvents.slice(0, 2).map(ev => (
                                        <div key={ev.id} className={`w-full text-left truncate text-[10px] font-medium px-1.5 py-0.5 rounded ${getTypeColor(ev.event_type)} ${ev.completed ? "opacity-50 line-through" : ""}`}>
                                            {ev.title}
                                        </div>
                                    ))}
                                    {todayEvents.length > 2 && (
                                        <div className="text-[10px] text-[var(--vy-neutral-500)] font-medium pl-1">
                                            +{todayEvents.length - 2} más
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Day Details Sidebar ── */}
            <div className="w-full lg:w-96 bg-[var(--vy-neutral-50)] p-6 flex flex-col h-full">
                <h3 className="font-semibold text-[var(--vy-neutral-900)] mb-1">
                    {isSameDay(selectedDate, new Date()) ? "Hoy" : selectedDate.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <p className="text-sm text-[var(--vy-neutral-500)] mb-6">
                    {selectedDateEvents.length} eventos programados
                </p>

                <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                    {selectedDateEvents.length === 0 ? (
                        <div className="text-center py-12 text-[var(--vy-neutral-400)] text-sm">
                            <div className="text-3xl mb-2 opacity-50">🍵</div>
                            No hay eventos para este día.
                        </div>
                    ) : (
                        selectedDateEvents.map(ev => (
                            <div key={ev.id} className={`p-4 bg-white rounded-2xl border ${ev.completed ? "border-[var(--vy-success)]/20 shadow-none opacity-60" : "border-[var(--vy-neutral-200)] shadow-sm"} transition-all relative overflow-hidden`}>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getTypeColor(ev.event_type)}`}>
                                                {ev.event_type}
                                            </span>
                                            <span className="text-xs text-[var(--vy-neutral-500)] font-medium">
                                                {new Date(ev.event_datetime).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h4 className={`font-bold text-[var(--vy-neutral-900)] leading-tight ${ev.completed ? "line-through" : ""}`}>{ev.title}</h4>
                                        <p className="text-sm text-[var(--vy-neutral-500)] mt-1 flex items-center gap-1.5">
                                            🐾 {ev.pet?.name}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleEventCompletion(ev.id, ev.completed)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors shrink-0 ${ev.completed ? "bg-[var(--vy-success)] border-[var(--vy-success)] text-white" : "border-[var(--vy-neutral-300)] text-transparent hover:border-[var(--vy-success)]"}`}
                                    >
                                        ✓
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Link
                    href={`/dashboard/calendar/notas/${selectedDate.toISOString().split("T")[0]}`}
                    className="w-full flex items-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--vy-neutral-200)] bg-white text-sm font-semibold text-[var(--vy-neutral-700)] hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all mb-3"
                >
                    <span className="text-base">📓</span>
                    Notas del día
                    <span className="ml-auto text-[10px] text-[var(--vy-neutral-400)] font-normal">→ abrir editor</span>
                </Link>

                <button
                    onClick={() => setShowModal(true)}
                    disabled={pets.length === 0}
                    className="w-full py-3 rounded-xl bg-[var(--vy-primary-600)] text-white font-semibold text-sm hover:bg-[var(--vy-primary-700)] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {pets.length === 0 ? "Registra una mascota primero" : "Agregar Evento"}
                </button>
            </div>

            {/* ── Add Event Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
                            <h3 className="text-xl font-bold text-[var(--vy-neutral-900)] mb-6">Nuevo Evento</h3>

                            <form onSubmit={handleAddEvent} className="space-y-4">
                                <input type="hidden" name="event_datetime" value={`${selectedDate.toISOString().split('T')[0]}T10:00:00`} />

                                <div>
                                    <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Título <span className="text-red-500">*</span></label>
                                    <input name="title" required placeholder="Ej. Vacuna Sextuple" className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] text-sm focus:ring-2 focus:ring-[var(--vy-primary-500)] outline-none" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Mascota <span className="text-red-500">*</span></label>
                                        <select name="pet_id" required className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-sm focus:ring-2 focus:ring-[var(--vy-primary-500)] outline-none">
                                            <option value="">Selecciona...</option>
                                            {pets.map(pet => (
                                                <option key={pet.id} value={pet.id}>{pet.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Tipo <span className="text-red-500">*</span></label>
                                        <select name="event_type" required className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-sm focus:ring-2 focus:ring-[var(--vy-primary-500)] outline-none">
                                            <option value="vaccine">Vacuna</option>
                                            <option value="deworming">Desparasitación</option>
                                            <option value="checkup">Chequeo</option>
                                            <option value="medication">Medicamento</option>
                                            <option value="other">Otro</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-100)] transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-[var(--vy-primary-600)] text-white text-sm font-semibold hover:bg-[var(--vy-primary-700)] shadow-md disabled:opacity-50">
                                        {loading ? "Guardando..." : "Guardar Evento"}
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
