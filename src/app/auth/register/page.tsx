"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { signup } from "../actions";

export default function RegisterPage() {
    const [role, setRole] = useState<"owner" | "vet">("owner");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [password, setPassword] = useState("");

    const getStrength = (pass: string) => {
        if (!pass) return -1;
        let score = 0;
        if (pass.length > 7) score++;
        if (pass.length > 11) score++;
        if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return Math.min(4, Math.floor(score / 1.25)); // Normalize to 0-4
    };

    const strength = Math.max(0, getStrength(password));
    const strengthConfig = [
        { label: "Muy Débil 🚩", color: "bg-red-500", width: "25%" },
        { label: "Débil ⚠️", color: "bg-orange-500", width: "50%" },
        { label: "Segura 🛡️", color: "bg-yellow-500", width: "75%" },
        { label: "Muy Segura 🔒", color: "bg-emerald-500", width: "100%" },
        { label: "Inviolable 👑", color: "bg-[var(--vy-primary-500)]", width: "100%" },
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const formData = new FormData(e.currentTarget);
        formData.append("role", role); // inject selected role

        const res = await signup(formData);
        
        if (res?.needsConfirmation) {
            setSuccess(true);
            setLoading(false);
            return;
        }

        if (res?.error) {
            setErrorMsg(res.error);
            setLoading(false);
        }
    };

    return (
        <div className="gradient-bg min-h-screen flex flex-col items-center justify-center px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                <Link href="/" className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--vy-primary-500)] to-[var(--vy-primary-700)] flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">🐾</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[var(--vy-neutral-900)]">
                        Vet<span className="text-[var(--vy-primary-600)]">Ya</span>
                    </span>
                </Link>

                {/* Card */}
                <div className="glass-card rounded-3xl p-8">
                    <h1 className="text-2xl font-bold text-[var(--vy-neutral-900)] text-center">
                        Crear Cuenta
                    </h1>
                    <p className="text-sm text-[var(--vy-neutral-500)] text-center mt-2">
                        Únete a VetYa y cuida mejor de tus mascotas
                    </p>

                    {success ? (
                        <div className="mt-8 text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-[var(--vy-primary-100)] text-[var(--vy-primary-600)] rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                                📩
                            </div>
                            <h2 className="text-xl font-bold text-[var(--vy-neutral-900)] mb-2">
                                ¡Casi listo! 🐾
                            </h2>
                            <p className="text-sm text-[var(--vy-neutral-500)] mb-8 leading-relaxed px-4">
                                Te hemos enviado un enlace de confirmación a tu correo. Por favor, revísalo para activar tu cuenta.
                            </p>
                            <Link href="/auth/login" className="w-full inline-block py-3 rounded-xl bg-[var(--vy-primary-600)] text-white font-semibold text-sm hover:bg-[var(--vy-primary-700)] transition-colors shadow-md">
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mt-6 flex rounded-xl bg-[var(--vy-neutral-100)] p-1">
                                {(["owner", "vet"] as const).map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`relative flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === r
                                            ? "text-[var(--vy-primary-700)]"
                                            : "text-[var(--vy-neutral-500)] hover:text-[var(--vy-neutral-700)]"
                                            }`}
                                    >
                                        {role === r && (
                                            <motion.div
                                                layoutId="role-indicator"
                                                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative">
                                            {r === "owner" ? "🐕 Dueño" : "⚕️ Veterinario"}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                                {/* ... form fields ... */}
                                {/* I'll use a larger block replacement to avoid indentation issues */}
                                {errorMsg && (
                                    <div className="bg-[var(--vy-danger)]/10 text-[var(--vy-danger)] text-sm px-4 py-3 rounded-xl border border-[var(--vy-danger)]/20">
                                        {errorMsg}
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                        Nombre completo
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="María García"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-[var(--vy-neutral-900)] text-sm placeholder:text-[var(--vy-neutral-400)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="reg-email" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                        Correo electrónico
                                    </label>
                                    <input
                                        id="reg-email"
                                        name="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-[var(--vy-neutral-900)] text-sm placeholder:text-[var(--vy-neutral-400)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="reg-password" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                        Contraseña
                                    </label>
                                    <input
                                        id="reg-password"
                                        name="password"
                                        type="password"
                                        placeholder="Mínimo 8 caracteres"
                                        required
                                        minLength={8}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-[var(--vy-neutral-900)] text-sm placeholder:text-[var(--vy-neutral-400)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all"
                                    />

                                    {password && (
                                        <div className="mt-3 space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--vy-neutral-500)]">
                                                    Seguridad:
                                                </span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${strengthConfig[strength].color.replace('bg-', 'text-')}`}>
                                                    {strengthConfig[strength].label}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[var(--vy-neutral-100)] rounded-full overflow-hidden border border-black/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: strengthConfig[strength].width }}
                                                    className={`h-full ${strengthConfig[strength].color} transition-colors duration-500 shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-xl bg-[var(--vy-primary-600)] text-white font-semibold text-sm hover:bg-[var(--vy-primary-700)] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Creando cuenta...
                                        </span>
                                    ) : (
                                        "Crear Cuenta"
                                    )}
                                </motion.button>
                            </form>

                            <div className="mt-6 text-center text-sm text-[var(--vy-neutral-500)]">
                                ¿Ya tienes cuenta?{" "}
                                <Link href="/auth/login" className="text-[var(--vy-primary-600)] hover:text-[var(--vy-primary-700)] font-semibold">
                                    Inicia sesión
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
