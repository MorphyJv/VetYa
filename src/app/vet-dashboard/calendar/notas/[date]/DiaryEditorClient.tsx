"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { saveDiaryNote } from "../../diaryActions";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function DiaryEditorClient({
    date,
    initialContent,
}: {
    date: string;
    initialContent: string;
}) {
    const [content, setContent] = useState(initialContent);
    const [status, setStatus] = useState<SaveStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Word count
    useEffect(() => {
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        setWordCount(words);
    }, [content]);

    const doSave = useCallback(async (text: string) => {
        setStatus("saving");
        setErrorMsg("");
        try {
            const result = await saveDiaryNote(date, text);
            if (result?.error) {
                setStatus("error");
                setErrorMsg(result.error);
            } else {
                setStatus("saved");
                setTimeout(() => setStatus("idle"), 2500);
            }
        } catch (e: any) {
            setStatus("error");
            setErrorMsg(e?.message ?? "Error desconocido al guardar");
        }
    }, [date]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setContent(val);
        setStatus("idle");
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSave(val), 1500);
    };

    const handleManualSave = () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        doSave(content);
    };

    const statusLabel = () => {
        if (status === "saving") return <span className="text-teal-600 font-medium">⏳ Guardando...</span>;
        if (status === "saved") return <span className="text-green-600 font-medium">✅ Guardado</span>;
        if (status === "error") return <span className="text-red-600 font-medium">❌ Error al guardar</span>;
        return <span className="text-[var(--vy-neutral-400)]">Auto-guardado activado</span>;
    };

    return (
        <div className="space-y-4">
            {/* Error banner */}
            {status === "error" && errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-800">
                    <p className="font-bold mb-1">⚠️ No se pudo guardar</p>
                    <p className="font-mono text-xs break-all">{errorMsg}</p>
                    <p className="mt-2 text-red-600 text-xs">
                        Si ves "relation does not exist", necesitas crear la tabla en Supabase → SQL Editor.
                    </p>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[var(--vy-neutral-500)]">
                    <span>📝 {wordCount} palabras</span>
                    <span>·</span>
                    {statusLabel()}
                </div>
                <button
                    onClick={handleManualSave}
                    disabled={status === "saving"}
                    className="px-4 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                    {status === "saving" ? "Guardando..." : "Guardar ahora"}
                </button>
            </div>

            {/* Editor */}
            <div className="bg-white rounded-3xl border border-[var(--vy-neutral-200)] shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600" />
                <textarea
                    value={content}
                    onChange={handleChange}
                    placeholder={`Escribe aquí tus notas del día...\n\nPuedes anotar:\n• Observaciones clínicas\n• Pendientes administrativos\n• Recordatorios personales\n• Ideas y reflexiones`}
                    className="w-full min-h-[65vh] px-8 py-6 text-base leading-8 text-[var(--vy-neutral-900)] placeholder-[var(--vy-neutral-300)] resize-none outline-none"
                    style={{
                        backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e8f4f4 31px, #e8f4f4 32px)",
                        lineHeight: "2rem",
                    }}
                    spellCheck
                    autoFocus
                />
                <div className="px-8 py-3 border-t border-[var(--vy-neutral-100)] bg-[var(--vy-neutral-50)] flex items-center justify-between">
                    <p className="text-[11px] text-[var(--vy-neutral-400)]">
                        🔒 Solo visible para ti · {new Date(date + "T12:00:00").toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <p className="text-[11px] text-[var(--vy-neutral-400)]">{content.length} caracteres</p>
                </div>
            </div>
        </div>
    );
}
