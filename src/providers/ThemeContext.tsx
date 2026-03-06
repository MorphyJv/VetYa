"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ColorPalette = {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
};

type ThemeContextType = {
    primaryColor: string;
    surfaceColor: string;
    setPrimaryColor: (color: string) => void;
    setSurfaceColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to generate a monochromatic palette from a single HEX color
// For this MVP, we'll use pre-defined palettes for better aesthetic control
export const palettes: Record<string, ColorPalette> = {
    // Primary Options (Color 1 - Vibrant Accents)
    celeste: {
        50: "#f0fdff", 100: "#ccfaff", 200: "#99f5ff", 300: "#66f0ff", 400: "#33ebff",
        500: "#00e6ff", 600: "#00ccff", 700: "#00b3e6", 800: "#0099cc", 900: "#0080aa",
    },
    blue: {
        50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa",
        500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a",
    },
    violet: {
        50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa",
        500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95",
    },
    emerald: {
        50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399",
        500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b",
    },
    rose: {
        50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af", 400: "#fb7185",
        500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 800: "#9f1239", 900: "#881337",
    },
    amber: {
        50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24",
        500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f",
    },
    orange: {
        50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c",
        500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12",
    },
};

export const surfacePalettes: Record<string, { bg: string; fg: string; surface: string; border: string; neutral50: string; neutral100: string; neutral200: string }> = {
    white: {
        bg: "#ffffff",
        fg: "#0f172a",
        surface: "#ffffff",
        border: "#f1f5f9",
        neutral50: "#ffffff",
        neutral100: "#f8fafc",
        neutral200: "#f1f5f9"
    },
    gray: {
        bg: "#e2e8f0",
        fg: "#1e293b",
        surface: "#f1f5f9",
        border: "#cbd5e1",
        neutral50: "#f8fafc",
        neutral100: "#f1f5f9",
        neutral200: "#cbd5e1"
    },
    black: {
        bg: "#020617",
        fg: "#f8fafc",
        surface: "#0f172a",
        border: "#1e293b",
        neutral50: "#0f172a",
        neutral100: "#1e293b",
        neutral200: "#334155"
    },
    "light-blue": {
        bg: "#e0f2fe",
        fg: "#0c4a6e",
        surface: "#f0f9ff",
        border: "#bae6fd",
        neutral50: "#f0f9ff",
        neutral100: "#e0f2fe",
        neutral200: "#bae6fd"
    },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [primaryColor, setPrimaryColor] = useState("celeste");
    const [surfaceColor, setSurfaceColor] = useState("white");

    // Load from localStorage on mount
    useEffect(() => {
        const savedPrimary = localStorage.getItem("vy-primary-theme");
        const savedSurface = localStorage.getItem("vy-surface-theme");
        if (savedPrimary && palettes[savedPrimary]) setPrimaryColor(savedPrimary);
        if (savedSurface && surfacePalettes[savedSurface]) setSurfaceColor(savedSurface);
    }, []);

    // Apply CSS variables to :root
    useEffect(() => {
        const root = document.documentElement;
        const p = palettes[primaryColor];
        const s = surfacePalettes[surfaceColor];

        if (p) {
            Object.entries(p).forEach(([key, value]) => {
                root.style.setProperty(`--vy-primary-${key}`, value);
            });
            localStorage.setItem("vy-primary-theme", primaryColor);
        }

        if (s) {
            root.style.setProperty("--background", s.bg);
            root.style.setProperty("--foreground", s.fg);
            root.style.setProperty("--surface", s.surface);
            root.style.setProperty("--border", s.border);
            root.style.setProperty("--vy-neutral-50", s.neutral50);
            root.style.setProperty("--vy-neutral-100", s.neutral100);
            root.style.setProperty("--vy-neutral-200", s.neutral200);
            localStorage.setItem("vy-surface-theme", surfaceColor);
        }
    }, [primaryColor, surfaceColor]);

    return (
        <ThemeContext.Provider value={{ primaryColor, surfaceColor, setPrimaryColor, setSurfaceColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};
