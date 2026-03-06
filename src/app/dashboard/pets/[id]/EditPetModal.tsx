"use client";

import { useState } from "react";
import { updatePet } from "../actions";

export default function EditPetModal({ pet, onClose }: { pet: any, onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(pet.photo_url || null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const { error: updateError } = await updatePet(pet.id, formData);
            if (updateError) {
                setError(updateError);
            } else {
                onClose();
            }
        } catch (err: any) {
            setError(err.message || "Ocurrió un error al actualizar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-[var(--vy-neutral-100)] flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold text-[var(--vy-neutral-900)]">Editar Perfil de {pet.name}</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-500)] transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    {error && (
                        <div className="m-6 mb-0 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 shrink-0">
                            {error}
                        </div>
                    )}

                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="grid md:grid-cols-2 gap-8 h-full">
                            {/* Left Column: Form Fields */}
                            <div className="space-y-4 pr-2 md:pr-4 md:border-r border-[var(--vy-neutral-100)]">
                                <h3 className="text-sm font-semibold text-[var(--vy-primary-600)] uppercase tracking-wider mb-2">Información de la mascota</h3>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={pet.name}
                                        required
                                        className="w-full px-4 py-2.5 bg-[var(--vy-neutral-50)] border outline-none border-[var(--vy-neutral-200)] focus:border-[var(--vy-primary-500)] focus:ring-2 focus:ring-[var(--vy-primary-100)] rounded-xl transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1">Especie</label>
                                        <select
                                            name="species"
                                            defaultValue={pet.species}
                                            required
                                            className="w-full px-4 py-2.5 bg-[var(--vy-neutral-50)] border outline-none border-[var(--vy-neutral-200)] focus:border-[var(--vy-primary-500)] rounded-xl"
                                        >
                                            <option value="dog">Perro 🐶</option>
                                            <option value="cat">Gato 🐱</option>
                                            <option value="bird">Ave 🐦</option>
                                            <option value="reptile">Reptil 🦎</option>
                                            <option value="other">Otro 🐾</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1">Raza (Opcional)</label>
                                        <input
                                            type="text"
                                            name="breed"
                                            defaultValue={pet.breed || ""}
                                            className="w-full px-4 py-2.5 bg-[var(--vy-neutral-50)] border outline-none border-[var(--vy-neutral-200)] focus:border-[var(--vy-primary-500)] rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1">Sexo</label>
                                        <select
                                            name="sex"
                                            defaultValue={pet.sex || ""}
                                            className="w-full px-4 py-2.5 bg-[var(--vy-neutral-50)] border outline-none border-[var(--vy-neutral-200)] focus:border-[var(--vy-primary-500)] rounded-xl"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="male">Macho</option>
                                            <option value="female">Hembra</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1">Peso (kg)</label>
                                        <input
                                            type="number"
                                            name="weight_kg"
                                            defaultValue={pet.weight_kg || ""}
                                            step="0.1"
                                            min="0"
                                            className="w-full px-4 py-2.5 bg-[var(--vy-neutral-50)] border outline-none border-[var(--vy-neutral-200)] focus:border-[var(--vy-primary-500)] rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        name="birth_date"
                                        defaultValue={pet.birth_date || ""}
                                        className="w-full px-4 py-2.5 bg-[var(--vy-neutral-50)] border outline-none border-[var(--vy-neutral-200)] focus:border-[var(--vy-primary-500)] rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Photo Upload */}
                            <div className="flex flex-col h-full pl-2 md:pl-4">
                                <h3 className="text-sm font-semibold text-[var(--vy-primary-600)] uppercase tracking-wider mb-2">Foto de la mascota</h3>

                                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[var(--vy-neutral-200)] bg-[var(--vy-neutral-50)] rounded-2xl hover:bg-[var(--vy-primary-50)] hover:border-[var(--vy-primary-300)] transition-colors cursor-pointer group p-8 text-center relative overflow-hidden min-h-[250px]">

                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setPreviewUrl(URL.createObjectURL(file));
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />

                                    {previewUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={previewUrl} alt="Vista previa de mascota" className="absolute inset-0 w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="mb-4 w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-4xl group-hover:scale-110 transition-transform text-[var(--vy-primary-500)]">
                                                📷
                                            </div>

                                            <h4 className="text-lg font-semibold text-[var(--vy-neutral-800)]">Añadir foto a la mascota</h4>
                                            <p className="text-sm text-[var(--vy-neutral-500)] mt-2 max-w-xs">
                                                Haz clic o arrastra una imagen aquí. (Formatos JPG o PNG, máximo 5MB)
                                            </p>

                                            <div className="mt-6 px-4 py-2 bg-white rounded-lg text-sm font-medium text-[var(--vy-primary-600)] shadow-sm border border-[var(--vy-neutral-200)]">
                                                Explorar archivos
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-[var(--vy-neutral-400)] italic mt-4 text-center">
                                    Asegúrate de tener un bucket público "pets" en Supabase.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 border-t border-[var(--vy-neutral-100)] flex justify-end gap-3 shrink-0 bg-[var(--vy-neutral-50)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-semibold rounded-xl text-[var(--vy-neutral-700)] bg-white border border-[var(--vy-neutral-200)] hover:bg-[var(--vy-neutral-100)] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2.5 text-sm font-semibold rounded-xl text-white bg-[var(--vy-primary-500)] hover:bg-[var(--vy-primary-600)] shadow-sm hover:shadow transition-all disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
