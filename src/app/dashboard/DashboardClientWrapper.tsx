"use client";

import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

export default function DashboardClientWrapper({
    petCount,
    eventsCount
}: {
    petCount: number;
    eventsCount: number;
}) {
    const stats = [
        {
            label: "Mascotas",
            value: petCount,
            icon: "🐾",
            color: "from-[var(--vy-primary-100)] to-[var(--vy-primary-200)]",
            textColor: "text-[var(--vy-primary-700)]"
        },
        {
            label: "Eventos hoy",
            value: eventsCount,
            icon: "📅",
            color: "from-[var(--vy-accent-100)] to-[var(--vy-accent-200)]",
            textColor: "text-[var(--vy-accent-700)]"
        },
        {
            label: "SOS Activos",
            value: "0",
            icon: "🚨",
            color: "from-[#fee2e2] to-[#fecaca]",
            textColor: "text-red-700"
        },
        {
            label: "Chats Asistente",
            value: "0",
            icon: "🤖",
            color: "from-[var(--vy-primary-100)] to-[var(--vy-primary-300)]",
            textColor: "text-[var(--vy-primary-700)]"
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    custom={i + 1}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-[var(--surface)] rounded-3xl border border-[var(--vy-neutral-200)] p-5 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm hover:shadow-md hover:border-[var(--vy-primary-200)] transition-all cursor-default"
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br ${stat.color} shadow-inner`}>
                        {stat.icon}
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[var(--vy-neutral-900)] leading-none mb-1">
                            {stat.value}
                        </p>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--vy-neutral-500)]">
                            {stat.label}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
