"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setErrorMsg("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setErrorMsg(error.message);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        }
        setLoading(false);
    };

    return (
        <div className="gradient-bg min-h-screen flex flex-col items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--vy-primary-500)] to-[var(--vy-primary-700)] flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">🐾</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[var(--vy-neutral-900)]">
                        Vet<span className="text-[var(--vy-primary-600)]">Ya</span>
                    </span>
                </div>

                {/* Card */}
                <div className="glass-card rounded-3xl p-8">
                    <h1 className="text-2xl font-bold text-[var(--vy-neutral-900)] text-center">
                        Nueva Contraseña
                    </h1>
                    <p className="text-sm text-[var(--vy-neutral-500)] text-center mt-2">
                        Ingresa tu nueva contraseña para recuperar el acceso
                    </p>

                    {success ? (
                        <div className="mt-8 text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-[var(--vy-success)]/10 text-[var(--vy-success)] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                ✓
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--vy-neutral-900)]">
                                ¡Contraseña actualizada!
                            </h3>
                            <p className="text-sm text-[var(--vy-neutral-500)] mt-2">
                                Redirigiéndote al inicio de sesión...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            {errorMsg && (
                                <div className="bg-[var(--vy-danger)]/10 text-[var(--vy-danger)] text-sm px-4 py-3 rounded-xl border border-[var(--vy-danger)]/20">
                                    {errorMsg}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                    Nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-[var(--vy-neutral-900)] text-sm placeholder:text-[var(--vy-neutral-400)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--vy-neutral-700)] mb-1.5">
                                    Confirmar contraseña
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--vy-neutral-300)] bg-white text-[var(--vy-neutral-900)] text-sm placeholder:text-[var(--vy-neutral-400)] focus:ring-2 focus:ring-[var(--vy-primary-500)] focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl bg-[var(--vy-primary-600)] text-white font-semibold text-sm hover:bg-[var(--vy-primary-700)] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Actualizando..." : "Restablecer contraseña"}
                            </motion.button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
