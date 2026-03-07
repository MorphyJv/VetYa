"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { useTheme, palettes } from "@/providers/ThemeContext";

export default function VetProfilePage() {
    const { user, profile, loading } = useUser();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoHover, setPhotoHover] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { primaryColor, surfaceColor, setPrimaryColor, setSurfaceColor } = useTheme();

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
        <div className="max-w-3xl mx-auto space-y-10 pb-20">
            <h1 className="text-4xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight">Mi Perfil</h1>

            <div className="bg-[var(--surface)] rounded-[48px] border-2 border-[var(--border)] p-10 md:p-14 shadow-2xl shadow-black/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[100px] -z-10 rounded-full" />

                {/* ── Avatar + name ── */}
                <div className="flex flex-col sm:flex-row gap-8 sm:items-center mb-12 pb-12 border-b-2 border-[var(--border)]">
                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            onMouseEnter={() => setPhotoHover(true)}
                            onMouseLeave={() => setPhotoHover(false)}
                            className="w-32 h-32 rounded-[40px] overflow-hidden relative focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all shadow-xl border-4 border-[var(--surface)]"
                            disabled={uploadingPhoto}
                        >
                            {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatarUrl} alt="Foto de perfil" className="w-full h-full object-cover scale-110" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-4xl font-black text-white">
                                    {initials}
                                </div>
                            )}

                            <AnimatePresence>
                                {(photoHover || uploadingPhoto) && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2"
                                    >
                                        {uploadingPhoto ? (
                                            <div className="w-6 h-6 border-3 border-teal-400 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-white text-[9px] font-black uppercase tracking-widest text-center leading-tight">
                                                    {avatarUrl ? "Cambiar" : "Añadir"}
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
                        <h2 className="text-2xl font-black text-[var(--vy-neutral-900)] uppercase tracking-tight">
                            {profile?.display_name || "Veterinario VetYa"}
                        </h2>
                        <p className="text-[var(--vy-neutral-400)] text-[10px] font-black uppercase tracking-widest mt-1">{user?.email}</p>
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-teal-500/10 text-teal-600 text-[10px] font-black uppercase tracking-widest border border-teal-500/20 shadow-sm">
                            ⚕️ Veterinario Certificado
                        </div>
                    </div>
                </div>

                {errorMsg && (
                    <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                        ⚠️ {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Personal info */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-[var(--vy-neutral-400)] uppercase tracking-[0.2em] mb-4">Información Personal</h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest px-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={formData.display_name}
                                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                    required
                                    placeholder="Dr. Nombre Apellido"
                                    className="w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold text-[var(--vy-neutral-800)] focus:border-teal-500 outline-none transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest px-1">Teléfono Personal</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+51 999 999 999"
                                    className="w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold text-[var(--vy-neutral-800)] focus:border-teal-500 outline-none transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clinic info */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-[var(--vy-neutral-400)] uppercase tracking-[0.2em] mb-4">Información de la Clínica</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest px-1">Nombre de la Institución</label>
                                <input
                                    type="text"
                                    value={formData.clinic_name}
                                    onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
                                    placeholder="Clínica Veterinaria San Pedro"
                                    className="w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold text-[var(--vy-neutral-800)] focus:border-teal-500 outline-none transition-all shadow-inner"
                                />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest px-1">Dirección Física</label>
                                    <input
                                        type="text"
                                        value={formData.clinic_address}
                                        onChange={(e) => setFormData({ ...formData, clinic_address: e.target.value })}
                                        placeholder="Av. Principal 123, Lima"
                                        className="w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold text-[var(--vy-neutral-800)] focus:border-teal-500 outline-none transition-all shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest px-1">Teléfono Institucional</label>
                                    <input
                                        type="tel"
                                        value={formData.clinic_phone}
                                        onChange={(e) => setFormData({ ...formData, clinic_phone: e.target.value })}
                                        placeholder="+51 1 234-5678"
                                        className="w-full px-5 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-bold text-[var(--vy-neutral-800)] focus:border-teal-500 outline-none transition-all shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Theme Customization */}
                    <div className="space-y-8 pt-6">
                        <h3 className="text-[10px] font-black text-[var(--vy-neutral-400)] uppercase tracking-[0.2em] mb-6">Personalización Visual</h3>
                        
                        <div className="grid md:grid-cols-2 gap-10">
                            {/* Primary Color */}
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest px-1">Color de Marca</label>
                                <div className="flex flex-wrap gap-3">
                                    {["celeste", "blue", "violet", "rose", "emerald", "amber", "orange"].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setPrimaryColor(opt)}
                                            className={`w-10 h-10 rounded-full transition-all duration-300 relative group
                                                ${primaryColor === opt ? "ring-4 ring-offset-4 ring-offset-[var(--surface)] ring-teal-500 scale-110 shadow-lg" : "hover:scale-110 shadow-sm"}`}
                                            style={{ backgroundColor: palettes[opt as keyof typeof palettes]?.[500] || "#ccc" }}
                                        >
                                            {primaryColor === opt && (
                                                <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] drop-shadow-md">
                                                    ✨
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Background Style */}
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest px-1">Modo de Visualización</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: "white", label: "Claro", icon: "☀️", color: "#ffffff" },
                                        { id: "gray", label: "Tenue", icon: "🌫️", color: "#f1f5f9" },
                                        { id: "black", label: "Oscuro", icon: "🌙", color: "#0f172a" },
                                        { id: "light-blue", label: "Cielo", icon: "☁️", color: "#f0f9ff" },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setSurfaceColor(opt.id)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-300 text-left
                                                ${surfaceColor === opt.id 
                                                    ? "border-teal-500 bg-teal-500/5 shadow-md scale-[1.02]" 
                                                    : "border-[var(--border)] bg-[var(--background)] hover:border-teal-500/30"}`}
                                        >
                                            <span className="text-xl">{opt.icon}</span>
                                            <div className="flex flex-col">
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${surfaceColor === opt.id ? "text-teal-600" : "text-[var(--vy-neutral-600)]"}`}>
                                                    {opt.label}
                                                </span>
                                                <div className="w-4 h-0.5 rounded-full mt-1 bg-current opacity-20" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end pt-10 border-t-2 border-[var(--border)]">
                        <div className="flex items-center gap-6">
                            <AnimatePresence>
                                {success && (
                                    <motion.span
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-[10px] font-black text-green-600 uppercase tracking-widest"
                                    >
                                        ✓ Cambios guardados
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            <button
                                type="submit"
                                disabled={saving || !user}
                                className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] bg-teal-600 text-white hover:bg-teal-700 rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-95 disabled:opacity-60"
                            >
                                {saving ? "Guardando..." : "Actualizar Perfil"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
