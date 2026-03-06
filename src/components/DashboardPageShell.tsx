"use client";

import { motion } from "framer-motion";

interface DashboardPageShellProps {
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
    maxWidth?: "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
}

export default function DashboardPageShell({
    title,
    subtitle,
    actions,
    children,
    maxWidth = "7xl"
}: DashboardPageShellProps) {
    const maxWidthClass = {
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        "full": "max-w-full"
    }[maxWidth];

    return (
        <div className={`mx-auto p-6 md:p-8 space-y-8 ${maxWidthClass}`}>
            {/* Header Section */}
            {(title || subtitle || actions) && (
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                        {title && (
                            <h1 className="text-2xl md:text-3xl font-bold text-[var(--vy-neutral-900)]">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="mt-1 text-[var(--vy-neutral-500)] text-sm md:text-base">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {actions && <div className="shrink-0">{actions}</div>}
                </div>
            )}

            {/* Content Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </div>
    );
}
