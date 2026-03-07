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
        if (status === "saving") return <span className="text-teal-600 font-black uppercase tracking-widest text-[9px]">⏳ Gravando...</span>;
        if (status === "saved") return <span className="text-green-600 font-black uppercase tracking-widest text-[9px]">✅ Sincronizado</span>;
        if (status === "error") return <span className="text-red-600 font-black uppercase tracking-widest text-[9px]">❌ Error de Conexión</span>;
        return <span className="text-[var(--vy-neutral-400)] font-black uppercase tracking-widest text-[9px]">Auto-guardado activo</span>;
    };

    return (
        <div className="space-y-4">
            {/* Error banner */}
            {/* Error banner */}
            {status === "error" && errorMsg && (
                <div className="bg-red-500/10 border-2 border-red-500/20 rounded-2xl px-6 py-5 text-[10px] text-red-700 font-bold uppercase tracking-widest">
                    <p className="flex items-center gap-2 mb-2">⚠️ <span className="font-black">Fallo en la sincronización</span></p>
                    <p className="opacity-70 font-mono text-[9px] break-all mb-4">{errorMsg}</p>
                    <div className="pt-4 border-t border-red-500/10 text-[8px] opacity-60">
                        Si el error persiste: Supabase → SQL Editor → Crear tabla de notas.
                    </div>
                </div>
            )}

            {/* Toolbar */}
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface)] border-2 border-[var(--border)] text-[9px] font-black text-[var(--vy-neutral-500)] uppercase tracking-widest shadow-sm">
                        <span>📝 {wordCount} PALABRAS</span>
                        <span className="opacity-30">|</span>
                        <span>{content.length} CHARS</span>
                    </div>
                    {statusLabel()}
                </div>
                <button
                    onClick={handleManualSave}
                    disabled={status === "saving"}
                    className="px-6 py-3 bg-teal-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 active:scale-90"
                >
                    {status === "saving" ? "Sincronizando..." : "Guardar ahora"}
                </button>
            </div>

            {/* Editor */}
            {/* Editor */}
            <div className="bg-[var(--surface)] rounded-[48px] border-2 border-[var(--border)] shadow-2xl overflow-hidden relative group">
                <div className="h-2 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 opacity-60 group-hover:opacity-100 transition-opacity" />
                <textarea
                    value={content}
                    onChange={handleChange}
                    placeholder={`Empieza a documentar tu jornada...\n\nSugerencias:\n• Observaciones de pacientes complejos\n• Logística del consultorio\n• Reflexiones de mejora continua`}
                    className="w-full min-h-[70vh] px-10 md:px-14 py-10 md:py-14 text-lg md:text-xl font-medium leading-[2.5rem] md:leading-[3rem] text-[var(--vy-neutral-900)] placeholder-[var(--vy-neutral-300)] resize-none outline-none bg-transparent"
                    style={{
                        backgroundImage: "repeating-linear-gradient(transparent, transparent calc(2.5rem - 1px), var(--border) calc(2.5rem - 1px), var(--border) 2.5rem)",
                        backgroundAttachment: "local",
                    }}
                    spellCheck
                    autoFocus
                />
                <div className="px-10 md:px-14 py-6 border-t-2 border-[var(--border)] bg-[var(--background)] flex items-center justify-between">
                    <p className="text-[10px] font-black text-[var(--vy-neutral-400)] uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <span className="text-sm">🔒</span> Cifrado de extremo a extremo · {new Date(date + "T12:00:00").toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <div className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)] animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
