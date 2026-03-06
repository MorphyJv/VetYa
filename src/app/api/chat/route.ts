import { createClient } from '@/lib/supabase/server';
import { streamText, CoreMessage } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const SYSTEM_PROMPT_BASE = `
Eres "VetYa", un asistente virtual amigable, empático y profesional enfocado en la salud y bienestar de mascotas.
Tu objetivo es ayudar a los dueños de mascotas resolviendo dudas, brindando consejos de prevención y guiando.

REGLA CRÍTICA: Bajo ninguna circunstancia debes diagnosticar enfermedades ni recetar medicamentos.
Si detectas gravedad, incluye: "[URGENCIA DETECTADA]".
`;

export async function POST(req: Request) {
    try {
        console.log("Chat API called");
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new Response('Unauthorized', { status: 401 });
        }

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "API Key missing" }), { status: 500 });
        }

        const body = await req.json();
        const { messages = [], data } = body;
        const petContext = data?.petContext;

        // Type-safe message normalization
        const normalizedMessages: CoreMessage[] = Array.isArray(messages)
            ? messages
                .filter((m: any) => m.content && m.content.trim() !== "")
                .map((m: any) => ({
                    role: m.role === 'assistant' ? 'assistant' : 'user',
                    content: m.content,
                }))
            : [];

        if (normalizedMessages.length === 0) {
            return new Response(JSON.stringify({ error: "No messages" }), { status: 400 });
        }

        let activeSystemPrompt = SYSTEM_PROMPT_BASE;
        if (petContext?.id) {
            activeSystemPrompt += `\nCONTEXTO: Mascota ${petContext.name}, ${petContext.species}.\n`;
        }

        console.log("Starting Gemini stream...");
        const result = await streamText({
            model: google('gemini-1.5-flash'),
            system: activeSystemPrompt,
            messages: normalizedMessages,
            temperature: 0.7,
        });

        return result.toDataStreamResponse();
    } catch (error: any) {
        console.error("CRITICAL API ERROR:", error);
        return new Response(JSON.stringify({
            error: "Error interno",
            details: error.message
        }), { status: 500 });
    }
}
