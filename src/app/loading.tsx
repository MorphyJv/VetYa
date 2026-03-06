"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--vy-neutral-100)] z-[9999] backdrop-blur-sm">
            <div className="text-center flex flex-col items-center">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-16 h-16 bg-gradient-to-br from-[var(--vy-primary-400)] to-[var(--vy-primary-600)] rounded-3xl flex items-center justify-center text-3xl shadow-xl mb-6 shadow-[var(--vy-primary-200)]"
                >
                    <span className="text-white">🐾</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-1"
                >
                    <span className="w-2 h-2 rounded-full bg-[var(--vy-primary-500)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--vy-primary-500)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--vy-primary-500)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </motion.div>
                <h2 className="mt-4 text-sm font-bold text-[var(--vy-neutral-500)] uppercase tracking-widest">
                    Cargando VetYa...
                </h2>
            </div>
        </div>
    );
}
