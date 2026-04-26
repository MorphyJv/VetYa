"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addMedicalRecord, addVaccination } from "../recordsActions";
import MomentsTab from "./MomentsTab";

export default function PetTabsClient({
    petId,
    initialRecords,
    initialVaccinations,
    initialMoments
}: {
    petId: string;
    initialRecords: any[];
    initialVaccinations: any[];
    initialMoments: any[];
}) {
    const [activeTab, setActiveTab] = useState<"records" | "vaccinations" | "moments">("records");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRecordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        await addMedicalRecord(petId, formData);
        setLoading(false);
        setShowForm(false);
    };

    const handleVaccineSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        await addVaccination(petId, formData);
        setLoading(false);
        setShowForm(false);
    };

    return (
        <div className="bg-[var(--surface)] rounded-3xl border border-[var(--vy-neutral-200)] shadow-sm overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-[var(--vy-neutral-200)] bg-[var(--vy-neutral-50)]">
                <button
                    onClick={() => { setActiveTab("records"); setShowForm(false); }}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === "records" ? "text-[var(--vy-primary-700)]" : "text-[var(--vy-neutral-500)] hover:text-[var(--vy-neutral-700)] hover:bg-[var(--vy-neutral-100)]"
                        }`}
                >
                    Historial Médico
                    {activeTab === "records" && (
                        <motion.div layoutId="pet-tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--vy-primary-600)]" />
                    )}
                </button>
                <button
                    onClick={() => { setActiveTab("vaccinations"); setShowForm(false); }}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === "vaccinations" ? "text-[var(--vy-primary-700)]" : "text-[var(--vy-neutral-500)] hover:text-[var(--vy-neutral-700)] hover:bg-[var(--vy-neutral-100)]"
                        }`}
                >
                    Vacunación
                    {activeTab === "vaccinations" && (
                        <motion.div layoutId="pet-tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--vy-primary-600)]" />
                    )}
                </button>
                <button
                    onClick={() => { setActiveTab("moments"); setShowForm(false); }}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === "moments" ? "text-[var(--vy-primary-700)]" : "text-[var(--vy-neutral-500)] hover:text-[var(--vy-neutral-700)] hover:bg-[var(--vy-neutral-100)]"
                        }`}
                >
                    Momentos 📸
                    {activeTab === "moments" && (
                        <motion.div layoutId="pet-tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--vy-primary-600)]" />
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8">
                {activeTab !== "moments" && (
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--vy-primary-50)] text-[var(--vy-primary-700)] hover:bg-[var(--vy-primary-100)] text-sm font-semibold rounded-xl transition-colors"
                        >
                            {showForm ? "Cancelar" : activeTab === "records" ? "+ Nueva Consulta" : "+ Nueva Vacuna"}
                        </button>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {activeTab === "moments" ? (
                        <motion.div
                            key="moments"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <MomentsTab petId={petId} initialMoments={initialMoments} />
                        </motion.div>
                    ) : showForm ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-[var(--vy-neutral-50)] border border-[var(--vy-neutral-200)] rounded-2xl p-6 mb-8"
                        >
                            {activeTab === "records" ? (
                                <form onSubmit={handleRecordSubmit} className="space-y-4">
                                    <h3 className="text-lg font-bold text-[var(--vy-neutral-900)] mb-4">Registrar Consulta Médica</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Fecha</label>
                                            <input name="visit_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 rounded-xl border border-[var(--vy-neutral-300)] text-sm outline-none focus:ring-2 focus:ring-[var(--vy-primary-500)]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Tipo de Registro</label>
                                            <select name="record_type" required className="w-full px-4 py-2.5 rounded-xl border border-[var(--vy-neutral-300)] bg-[var(--surface)] text-sm outline-none focus:ring-2 focus:ring-[var(--vy-primary-500)]">
                                                <option value="routine">Rutina</option>
                                                <option value="emergency">Emergencia</option>
                                                <option value="followup">Seguimiento</option>
                                            </select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Diagnóstico</label>
                                            <input name="diagnosis" type="text" placeholder="Ej. Otitis leve" className="w-full px-4 py-2.5 rounded-xl border border-[var(--vy-neutral-300)] text-sm outline-none focus:ring-2 focus:ring-[var(--vy-primary-500)]" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Tratamiento / Indicaciones</label>
                                            <textarea name="treatment" rows={2} placeholder="Limpieza ótica 2 veces al día..." className="w-full px-4 py-2.5 rounded-xl border border-[var(--vy-neutral-300)] text-sm outline-none focus:ring-2 focus:ring-[var(--vy-primary-500)]"></textarea>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-[var(--vy-primary-600)] text-white text-sm font-semibold hover:bg-[var(--vy-primary-700)] transition-colors shadow-sm disabled:opacity-50">
                                            {loading ? "Guardando..." : "Guardar Registro"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleVaccineSubmit} className="space-y-4">
                                    <h3 className="text-lg font-bold text-[var(--vy-neutral-900)] mb-4">Registrar Vacunación</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Vacuna</label>
                                            <input name="vaccine_name" type="text" required placeholder="Ej. Rabia, Sextuple" className="w-full px-4 py-2.5 rounded-xl border border-[var(--vy-neutral-300)] text-sm outline-none focus:ring-2 focus:ring-[var(--vy-primary-500)]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Nº de Lote</label>
                                            <input name="lot_number" type="text" placeholder="Opcional" className="w-full px-4 py-2.5 rounded-xl border border-[var(--vy-neutral-300)] text-sm outline-none focus:ring-2 focus:ring-[var(--vy-primary-500)]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Fecha Aplicación</label>
                                            <input name="applied_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 rounded-xl border border-[var(--vy-neutral-300)] text-sm outline-none focus:ring-2 focus:ring-[var(--vy-primary-500)]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Próxima Dosis (Opcional)</label>
                                            <input name="next_due_date" type="date" className="w-full px-4 py-2.5 rounded-xl border border-[var(--vy-neutral-300)] text-sm outline-none focus:ring-2 focus:ring-[var(--vy-primary-500)]" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-[var(--vy-primary-600)] text-white text-sm font-semibold hover:bg-[var(--vy-primary-700)] transition-colors shadow-sm disabled:opacity-50">
                                            {loading ? "Guardando..." : "Guardar Vacuna"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {activeTab === "records" ? (
                                initialRecords.length === 0 ? (
                                    <EmptyState text="No hay consultas médicas registradas." />
                                ) : (
                                    <div className="space-y-4">
                                        {initialRecords.map(record => (
                                            <div key={record.id} className="p-5 rounded-2xl border border-[var(--vy-neutral-200)] hover:border-[var(--vy-primary-200)] transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide mb-2 ${record.record_type === 'emergency' ? 'bg-[var(--vy-danger)]/10 text-[var(--vy-danger)]' :
                                                            record.record_type === 'routine' ? 'bg-[var(--vy-success)]/10 text-[var(--vy-success)]' :
                                                                'bg-[var(--vy-primary-100)] text-[var(--vy-primary-700)]'
                                                            }`}>
                                                            {record.record_type === 'emergency' ? 'Emergencia' : record.record_type === 'routine' ? 'Rutina' : 'Seguimiento'}
                                                        </span>
                                                        <h4 className="font-bold text-[var(--vy-neutral-900)]">{record.diagnosis || "Consulta General"}</h4>
                                                    </div>
                                                    <span className="text-sm font-medium text-[var(--vy-neutral-500)]">
                                                        {new Date(record.visit_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {record.treatment && (
                                                    <p className="text-sm text-[var(--vy-neutral-600)] mt-2">
                                                        <span className="font-medium text-[var(--vy-neutral-800)]">Tratamiento:</span> {record.treatment}
                                                    </p>
                                                )}
                                                {record.vet && (
                                                    <div className="mt-4 flex items-center gap-2 text-xs text-[var(--vy-neutral-500)]">
                                                        <span className="w-5 h-5 rounded-full bg-[var(--vy-neutral-200)] flex items-center justify-center">⚕️</span>
                                                        Atendido por: <span className="font-medium text-[var(--vy-neutral-700)]">{record.vet.display_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                initialVaccinations.length === 0 ? (
                                    <EmptyState text="No hay vacunas registradas." />
                                ) : (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {initialVaccinations.map(vaccine => (
                                            <div key={vaccine.id} className="p-5 rounded-2xl border border-[var(--vy-neutral-200)] flex gap-4 items-start hover:border-[var(--vy-primary-200)] transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-[var(--vy-accent-100)] text-[var(--vy-accent-600)] flex items-center justify-center text-xl shrink-0">
                                                    💉
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-[var(--vy-neutral-900)]">{vaccine.vaccine_name}</h4>
                                                    <p className="text-xs text-[var(--vy-neutral-500)] mt-1">
                                                        Aplicada: <span className="font-medium text-[var(--vy-neutral-700)]">{new Date(vaccine.applied_date).toLocaleDateString()}</span>
                                                    </p>
                                                    {vaccine.next_due_date && (
                                                        <p className="text-xs text-[var(--vy-neutral-500)] mt-0.5">
                                                            Próxima dosis: <span className="font-medium text-[var(--vy-neutral-700)]">{new Date(vaccine.next_due_date).toLocaleDateString()}</span>
                                                        </p>
                                                    )}
                                                    {vaccine.lot_number && (
                                                        <p className="text-xs text-[var(--vy-neutral-400)] mt-2 font-mono">
                                                            Lote: {vaccine.lot_number}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="py-12 text-center text-[var(--vy-neutral-500)] flex flex-col items-center justify-center">
            <div className="text-4xl mb-3 opacity-20">📂</div>
            <p className="text-sm">{text}</p>
        </div>
    );
}
