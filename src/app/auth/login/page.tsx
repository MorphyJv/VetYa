"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { login } from "../actions";

export default function LoginPage() {
    const [role, setRole] = useState<"owner" | "vet">("owner");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const formData = new FormData(e.currentTarget);
        formData.append("role", role); // inject selected role
        const res = await login(formData);

        if (res?.error) {
            setErrorMsg(res.error);
            setLoading(false);
        }
    };

    return (
        <div className="gradient-bg min-h-screen flex flex-col items-center justify-center px-4">
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
                        Iniciar Sesión
                    </h1>
                    <p className="text-sm text-[var(--vy-neutral-500)] text-center mt-2">
                        Accede a tu cuenta para cuidar de tus mascotas
                    </p>

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
                                        layoutId="login-role-indicator"
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
                        {errorMsg && (
                            <div className="bg-[var(--vy-danger)]/10 text-[var(--vy-danger)] text-sm px-4 py-3 rounded-xl border border-[var(--vy-danger)]/20">
                                {errorMsg}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="tu@email.com"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-[var(--vy-neutral-900)] text-sm placeholder:text-[var(--vy-neutral-400)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-[var(--vy-neutral-900)] text-sm placeholder:text-[var(--vy-neutral-400)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-[var(--vy-neutral-600)]">
                                <input type="checkbox" className="w-4 h-4 rounded border-[var(--vy-neutral-300)] accent-[var(--vy-primary-600)]" />
                                Recordarme
                            </label>
                            <Link href="/auth/forgot-password" className="text-[var(--vy-primary-600)] hover:text-[var(--vy-primary-700)] font-medium">
                                ¿Olvidaste tu contraseña?
                            </Link>
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
                                    Iniciando sesión...
                                </span>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center text-sm text-[var(--vy-neutral-500)]">
                        ¿No tienes cuenta?{" "}
                        <Link href="/auth/register" className="text-[var(--vy-primary-600)] hover:text-[var(--vy-primary-700)] font-semibold">
                            Regístrate gratis
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
