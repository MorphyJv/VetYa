import { getOwnerDiaryNote } from "../../ownerDiaryActions";
import OwnerDiaryEditorClient from "./OwnerDiaryEditorClient";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OwnerDiaryPage({ params }: { params: Promise<{ date: string }> }) {
    const { date } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const { data: note } = await getOwnerDiaryNote(date);

    const dateObj = new Date(date + "T12:00:00");
    const formattedDate = dateObj.toLocaleDateString("es-PE", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    return (
        <div className="min-h-screen bg-[var(--vy-neutral-50)]">
            {/* Top bar */}
            <div className="bg-white border-b border-[var(--vy-neutral-200)] px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                <Link
                    href="/dashboard/calendar"
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--vy-neutral-100)] text-[var(--vy-neutral-600)] hover:bg-[var(--vy-neutral-200)] transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div className="flex-1">
                    <h1 className="text-sm font-bold text-[var(--vy-neutral-900)] capitalize">{formattedDate}</h1>
                    <p className="text-xs text-[var(--vy-neutral-500)]">Notas personales — Solo visible para ti</p>
                </div>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
                    📓 Mi Diario
                </span>
            </div>

            {/* Editor */}
            <div className="max-w-3xl mx-auto px-6 py-10">
                <OwnerDiaryEditorClient
                    date={date}
                    initialContent={note?.content ?? ""}
                />
            </div>
        </div>
    );
}
