"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/auth/actions";
import DashboardPageShell from "@/components/DashboardPageShell";

export default function ProfilePage() {
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
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                display_name: profile.display_name || "",
                phone: profile.phone || "",
            });
            setAvatarUrl((profile as any).avatar_url || null);
        }
    }, [profile]);

    // ── Photo upload (base64, no Storage bucket needed) ──────────────────────
    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploadingPhoto(true);
        setErrorMsg("");

        try {
            // Resize & compress to JPEG 300×300 via canvas
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

    // Compress image to target size using canvas
    function resizeImage(file: File, size: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext("2d")!;
                // Center-crop to square
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


    // ── Profile fields save ──────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setSuccess(false);
        setErrorMsg("");

        const supabase = createClient();
        const { error } = await supabase
            .from("profiles")
            .update({
                display_name: formData.display_name,
                phone: formData.phone,
            })
            .eq("id", user.id);

        if (error) {
            setErrorMsg(error.message);
        } else {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-[var(--vy-primary-200)] border-t-[var(--vy-primary-600)] rounded-full" />
            </div>
        );
    }

    const initials = profile?.display_name?.charAt(0)?.toUpperCase() || "👤";

    return (
        <DashboardPageShell title="Mi Perfil">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl border border-[var(--vy-neutral-200)] p-6 md:p-8 shadow-sm">

                    {/* ── Avatar + name ── */}
                    <div className="flex flex-col sm:flex-row gap-6 sm:items-center mb-8 pb-8 border-b border-[var(--vy-neutral-100)]">

                        {/* Hoverable avatar */}
                        <div className="relative shrink-0">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                onMouseEnter={() => setPhotoHover(true)}
                                onMouseLeave={() => setPhotoHover(false)}
                                className="w-24 h-24 rounded-full overflow-hidden relative focus:outline-none focus:ring-4 focus:ring-[var(--vy-primary-300)] transition-all"
                                title="Cambiar foto de perfil"
                                disabled={uploadingPhoto}
                            >
                                {/* Avatar image or initials */}
                                {avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={avatarUrl}
                                        alt="Foto de perfil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[var(--vy-primary-100)] to-[var(--vy-primary-300)] flex items-center justify-center text-3xl font-bold text-[var(--vy-primary-700)]">
                                        {initials}
                                    </div>
                                )}

                                {/* Hover / loading overlay */}
                                <AnimatePresence>
                                    {(photoHover || uploadingPhoto) && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
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

                            {/* Hidden file input */}
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
                                {profile?.display_name || "Usuario VetYa"}
                            </h2>
                            <p className="text-[var(--vy-neutral-500)] text-sm mt-0.5">{user?.email}</p>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] text-xs font-semibold">
                                {profile?.role === "vet" ? "⚕️ Veterinario" : "🐕 Dueño de mascota"}
                            </div>
                            <p className="text-[11px] text-[var(--vy-neutral-400)] mt-2">
                                Pasa el cursor sobre la foto para cambiarla
                            </p>
                        </div>
                    </div>

                    {/* ── Error banner ── */}
                    {errorMsg && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    {/* ── Edit form ── */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    value={formData.display_name}
                                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                    required
                                    placeholder="Tu nombre"
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] text-sm focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+51 999 999 999"
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] text-sm focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-200)] text-sm bg-[var(--vy-neutral-50)] text-[var(--vy-neutral-400)] cursor-not-allowed"
                            />
                            <p className="text-[11px] text-[var(--vy-neutral-400)] mt-1">El correo no se puede modificar</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-[var(--vy-neutral-100)]">
                            <button
                                type="button"
                                onClick={() => logout()}
                                className="px-5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                Cerrar Sesión
                            </button>
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
                                    className="px-6 py-2.5 text-sm font-semibold bg-[var(--vy-primary-600)] text-white hover:bg-[var(--vy-primary-700)] rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {saving ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardPageShell>
    );
}
