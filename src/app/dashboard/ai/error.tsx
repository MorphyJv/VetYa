"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("AI PAGE CAUGHT ERROR:", error);
    }, [error]);

    return (
        <div className="flex w-full h-full p-8 flex-col items-center justify-center text-center bg-red-50 text-red-900 rounded-2xl border-4 border-red-500 m-4">
            <h2 className="text-2xl font-bold mb-4">🚨 ALERTA ROJA EN LA IA 🚨</h2>
            <p className="mb-4">Algo falló de manera crítica al cargar el chat.</p>
            <div className="bg-red-900 text-red-50 p-4 rounded-xl text-left w-full max-w-2xl overflow-auto text-xs font-mono whitespace-pre-wrap mb-4">
                <strong>Message:</strong> {error.message}
                <br /><br />
                <strong>Stack:</strong> {error.stack}
            </div>
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold shadow-lg"
            >
                Intentar de nuevo
            </button>
        </div>
    );
}
