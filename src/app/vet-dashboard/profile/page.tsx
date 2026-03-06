"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";

export default function VetProfilePage() {
    const { user, profile, loading } = useUser();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoHover, setPhotoHover] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        display_name: "",
        phone: "",
        clinic_name: "",
        clinic_address: "",
        clinic_phone: "",
    });

    useEffect(() => {
        if (!profile || !user) return;

        setFormData((prev) => ({
            ...prev,
            display_name: profile.display_name || "",
            phone: (profile as any).phone || "",
        }));
        setAvatarUrl((profile as any).avatar_url || null);

        // Fetch vet_profiles extras
        const supabase = createClient();
        supabase
            .from("vet_profiles")
            .select("clinic_name, clinic_address, clinic_phone")
            .eq("user_id", user.id)
            .maybeSingle()
            .then(({ data }) => {
                if (data) {
                    setFormData((prev) => ({
                        ...prev,
                        clinic_name: data.clinic_name || "",
                        clinic_address: data.clinic_address || "",
                        clinic_phone: data.clinic_phone || "",
                    }));
                }
            });
    }, [profile, user]);

    // ── Photo upload (base64, no Storage bucket needed) ──────────────────────
    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploadingPhoto(true);
        setErrorMsg("");

        try {
            const base64 = await resizeImage(file, 300);
            const supabase = createClient();
            const { error } = await supabase
                .from("profiles")
                .update({ avatar_url: base64 })
                .eq("id", user.id);

            if (error) {
                setErrorMsg("No se pudo guardar la foto: " + error.message);
            } else {
                setAvatarUrl(base64);
            }
        } catch (err: any) {
            setErrorMsg("Error al procesar la imagen: " + err.message);
        }

        setUploadingPhoto(false);
    };

    function resizeImage(file: File, size: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext("2d")!;
                const min = Math.min(img.width, img.height);
                const sx = (img.width - min) / 2;
                const sy = (img.height - min) / 2;
                ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
                URL.revokeObjectURL(url);
                resolve(canvas.toDataURL("image/jpeg", 0.82));
            };
            img.onerror = reject;
            img.src = url;
        });
    }



    // ── Save profile ─────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setSuccess(false);
        setErrorMsg("");

        const supabase = createClient();

        // Update profiles
        const { error: profileErr } = await supabase
            .from("profiles")
            .update({ display_name: formData.display_name, phone: formData.phone })
            .eq("id", user.id);

        // Upsert vet_profiles clinic info
        const { error: vetErr } = await supabase
            .from("vet_profiles")
            .upsert(
                {
                    user_id: user.id,
                    clinic_name: formData.clinic_name,
                    clinic_address: formData.clinic_address,
                    clinic_phone: formData.clinic_phone,
                },
                { onConflict: "user_id" }
            );

        if (profileErr || vetErr) {
            setErrorMsg((profileErr || vetErr)!.message);
        } else {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full" />
            </div>
        );
    }

    const initials = profile?.display_name?.charAt(0)?.toUpperCase() || "⚕️";

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-[var(--vy-neutral-900)]">Mi Perfil</h1>

            <div className="bg-white rounded-3xl border border-[var(--vy-neutral-200)] p-6 md:p-8 shadow-sm">

                {/* ── Avatar + name ── */}
                <div className="flex flex-col sm:flex-row gap-6 sm:items-center mb-8 pb-8 border-b border-[var(--vy-neutral-100)]">
                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            onMouseEnter={() => setPhotoHover(true)}
                            onMouseLeave={() => setPhotoHover(false)}
                            className="w-24 h-24 rounded-full overflow-hidden relative focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all"
                            disabled={uploadingPhoto}
                        >
                            {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatarUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-300 flex items-center justify-center text-3xl font-bold text-teal-700">
                                    {initials}
                                </div>
                            )}

                            <AnimatePresence>
                                {(photoHover || uploadingPhoto) && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 rounded-full"
                                    >
                                        {uploadingPhoto ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-white text-[10px] font-bold text-center leading-tight">
                                                    {avatarUrl ? "Cambiar\nfoto" : "Añadir\nfoto"}
                                                </span>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[var(--vy-neutral-900)]">
                            {profile?.display_name || "Veterinario VetYa"}
                        </h2>
                        <p className="text-[var(--vy-neutral-500)] text-sm mt-0.5">{user?.email}</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                            ⚕️ Veterinario
                        </div>
                        <p className="text-[11px] text-[var(--vy-neutral-400)] mt-2">
                            Pasa el cursor sobre la foto para cambiarla
                        </p>
                    </div>
                </div>

                {errorMsg && (
                    <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                        ⚠️ {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Personal info */}
                    <div>
                        <h3 className="text-sm font-bold text-[var(--vy-neutral-700)] uppercase tracking-wide mb-3">Datos Personales</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Nombre completo</label>
                                <input
                                    type="text"
                                    value={formData.display_name}
                                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                    required
                                    placeholder="Dr. Nombre Apellido"
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Teléfono personal</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+51 999 999 999"
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clinic info */}
                    <div>
                        <h3 className="text-sm font-bold text-[var(--vy-neutral-700)] uppercase tracking-wide mb-3">Datos de Clínica</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Nombre de la clínica</label>
                                <input
                                    type="text"
                                    value={formData.clinic_name}
                                    onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
                                    placeholder="Clínica Veterinaria San Pedro"
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Dirección</label>
                                    <input
                                        type="text"
                                        value={formData.clinic_address}
                                        onChange={(e) => setFormData({ ...formData, clinic_address: e.target.value })}
                                        placeholder="Av. Principal 123, Lima"
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Teléfono de clínica</label>
                                    <input
                                        type="tel"
                                        value={formData.clinic_phone}
                                        onChange={(e) => setFormData({ ...formData, clinic_phone: e.target.value })}
                                        placeholder="+51 1 234-5678"
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email (readonly) */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">Correo electrónico</label>
                        <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-200)] text-sm bg-[var(--vy-neutral-50)] text-[var(--vy-neutral-400)] cursor-not-allowed"
                        />
                        <p className="text-[11px] text-[var(--vy-neutral-400)] mt-1">El correo no se puede modificar</p>
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-[var(--vy-neutral-100)]">
                        <div className="flex items-center gap-3">
                            <AnimatePresence>
                                {success && (
                                    <motion.span
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm text-green-600 font-medium"
                                    >
                                        ✓ Cambios guardados
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            <button
                                type="submit"
                                disabled={saving || !user}
                                className="px-6 py-2.5 text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-60"
                            >
                                {saving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
