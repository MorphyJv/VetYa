"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[var(--vy-neutral-100)] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl p-8 md:p-12 text-center border border-[var(--vy-neutral-200)] shadow-xl"
            >
                <div className="text-7xl mb-6 opacity-30">🐕</div>
                <h1 className="text-4xl font-black text-[var(--vy-neutral-900)] mb-2">404</h1>
                <h2 className="text-xl font-bold text-[var(--vy-neutral-800)] mb-4">¡Ups! Nos perdimos del camino</h2>
                <p className="text-[var(--vy-neutral-500)] mb-8">
                    La página o recurso que buscas no existe o fue movido. No te preocupes, el camino a casa está a un clic.
                </p>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center w-full py-4 rounded-xl bg-[var(--vy-primary-600)] text-white font-bold text-lg hover:bg-[var(--vy-primary-700)] transition-colors shadow-md active:scale-95"
                >
                    Volver al Inicio
                </Link>
            </motion.div>
        </div>
    );
}
