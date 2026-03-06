"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
    { href: "/vet-dashboard", label: "Inicio", icon: "🏠" },
    { href: "/vet-dashboard/pets", label: "Mascotas", icon: "🐾" },
    { href: "/vet-dashboard/calendar", label: "Calendario", icon: "📅" },
    { href: "/vet-dashboard/sos", label: "SOS", icon: "🚨" },
];

export default function VetDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleSignOut = () => {
        setIsLogoutModalOpen(true);
        setSidebarOpen(false); // Close mobile sidebar if open
    };

    const confirmSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setIsLogoutModalOpen(false);
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-[var(--vy-neutral-50)] flex">
            {/* ── Desktop Sidebar ── */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[var(--vy-neutral-200)] p-4 fixed inset-y-0 left-0 z-30">
                {/* Logo */}
                <Link href="/vet-dashboard" className="flex items-center gap-2 px-3 py-2 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                        <span className="text-white text-lg">⚕️</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[var(--vy-neutral-900)]">
                        Vet<span className="text-teal-600">Admin</span>
                    </span>
                </Link>

                {/* Nav */}
                <nav className="flex flex-col gap-1 flex-1">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/vet-dashboard"
                                ? pathname === "/vet-dashboard"
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                                        ? "text-teal-700 bg-teal-50"
                                        : "text-[var(--vy-neutral-600)] hover:text-[var(--vy-neutral-900)] hover:bg-[var(--vy-neutral-100)]"
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-vet"
                                        className="absolute inset-0 rounded-xl bg-teal-50 border border-teal-200"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <span className="relative text-lg">{item.icon}</span>
                                <span className="relative">{item.label}</span>
                                {item.href === "/vet-dashboard/sos" && (
                                    <span className="relative ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Profile section */}
                <div className="border-t border-[var(--vy-neutral-200)] pt-4 mt-4 space-y-2">
                    <Link
                        href="/vet-dashboard/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-100)] transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm">
                            👨‍⚕️
                        </div>
                        <span>Mi Clínica</span>
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-base">
                            🚪
                        </div>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* ── Mobile Header ── */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-xl border-b border-[var(--vy-neutral-200)] flex items-center justify-between px-4 z-40">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--vy-neutral-100)] transition-colors"
                    aria-label="Toggle menu"
                >
                    <svg className="w-5 h-5 text-[var(--vy-neutral-700)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span className="text-base font-bold text-[var(--vy-neutral-900)]">
                    Vet<span className="text-teal-600">Admin</span>
                </span>
                <Link href="/vet-dashboard/profile" className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm">
                    👨‍⚕️
                </Link>
            </header>

            {/* ── Mobile sidebar overlay ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/30 z-40"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 p-4 shadow-xl"
                        >
                            <div className="flex items-center gap-2 px-3 py-2 mb-6">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                                    <span className="text-white text-lg">⚕️</span>
                                </div>
                                <span className="text-xl font-bold tracking-tight text-[var(--vy-neutral-900)]">
                                    Vet<span className="text-teal-600">Admin</span>
                                </span>
                            </div>
                            <nav className="flex flex-col gap-1 flex-1">
                                {navItems.map((item) => {
                                    const isActive =
                                        item.href === "/vet-dashboard"
                                            ? pathname === "/vet-dashboard"
                                            : pathname.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${isActive
                                                    ? "text-teal-700 bg-teal-50 border border-teal-200"
                                                    : "text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-100)]"
                                                }`}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="border-t border-[var(--vy-neutral-200)] pt-4 mt-auto">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <span className="text-lg">🚪</span>
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ── Mobile Bottom Nav ── */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-t border-[var(--vy-neutral-200)] flex items-center justify-around px-2 z-40">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/vet-dashboard"
                            ? pathname === "/vet-dashboard"
                            : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all text-xs font-medium
                ${isActive
                                    ? "text-teal-600"
                                    : "text-[var(--vy-neutral-400)]"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottomnav-active-vet"
                                    className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-teal-500"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* ── Content ── */}
            <main className="flex-1 lg:ml-64 pt-14 pb-20 lg:pt-0 lg:pb-0">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="p-6 max-w-7xl mx-auto"
                >
                    {children}
                </motion.div>
            </main>

            {/* ── Logout Confirmation Modal ── */}
            <AnimatePresence>
                {isLogoutModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[28px] p-8 max-w-sm w-full shadow-2xl text-center border border-[var(--vy-neutral-100)]"
                        >
                            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center text-3xl mb-4 text-red-500">
                                🚪
                            </div>
                            <h3 className="text-xl font-bold text-[var(--vy-neutral-900)] mb-2">
                                ¿Estás seguro?
                            </h3>
                            <p className="text-[var(--vy-neutral-500)] mb-8 text-sm">
                                Tu sesión de veterinario se cerrará y tendrás que volver a ingresar tus credenciales.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-[var(--vy-neutral-600)] bg-[var(--vy-neutral-100)] hover:bg-[var(--vy-neutral-200)] transition-colors"
                                >
                                    No, cancelar
                                </button>
                                <button
                                    onClick={confirmSignOut}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg transition-all"
                                >
                                    Sí, salir
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
