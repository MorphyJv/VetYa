"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

export default function SplashScreen({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set a timer to dismiss the splash screen
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500); // Slightly longer for the large logo impact

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="splash-screen"
                        initial={{ opacity: 1 }}
                        exit={{
                            opacity: 0,
                            scale: 1.1,
                            filter: "blur(10px)",
                            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                        }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)]"
                    >
                        <div className="relative flex flex-col items-center">
                            {/* Animated Background Glow */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                    scale: [0.8, 1.4, 1.2],
                                    opacity: [0, 0.4, 0.3]
                                }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute inset-x-[-100px] inset-y-[-100px] rounded-full bg-gradient-to-br from-[var(--vy-primary-400)] to-[var(--vy-primary-600)] blur-[100px]"
                            />

                            {/* Logo Squircle Container - Large Appearance */}
                            <motion.div
                                initial={{ scale: 0.6, opacity: 0, y: 30 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    duration: 1,
                                    ease: [0.22, 1, 0.36, 1],
                                    delay: 0.2
                                }}
                                className="relative bg-white rounded-[28%] p-10 shadow-2xl overflow-hidden flex items-center justify-center w-64 h-64"
                            >
                                <Logo size={200} className="w-full h-full" />
                            </motion.div>

                            {/* Loading Bar Indicator */}
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "120px", opacity: 1 }}
                                transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
                                className="h-1 bg-[var(--vy-primary-200)] rounded-full mt-10 overflow-hidden"
                            >
                                <motion.div
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                    className="h-full w-full bg-[var(--vy-primary-500)] shadow-[0_0_10px_var(--vy-primary-300)]"
                                />
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                                className="mt-4 text-[var(--vy-neutral-400)] text-sm font-medium tracking-widest uppercase"
                            >
                                Cargando VetYa...
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.div>
        </>
    );
}
