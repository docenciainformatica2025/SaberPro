import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// --- MODERN FALLBACK SYSTEM 2026 ---
const MODELS = [
    "gemini-2.0-flash",     // Primary
    "gemini-2.0-flash-lite", // Fallback 1 (Lower cost/quota)
    "gemini-2.0-flash-001",  // Fallback 2 (Specific version)
    "gemini-flash-latest",   // Fallback 3 (Dynamic)
];

async function generateWithFallback(prompt: string) {
    let lastError = null;

    for (const modelName of MODELS) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            lastError = error;
            console.warn(`Falló IA con modelo ${modelName}:`, error.message);
            if (error.status === 429) {
                console.warn(`Cuota agotada para ${modelName}, reintentando con el siguiente...`);
            }
        }
    }
    throw lastError;
}

const explainSchema = z.object({
    question: z.object({
        text: z.string().min(1, "El texto de la pregunta es requerido"),
        isPromptOnly: z.boolean().optional(),
    }),
    selectedOption: z.string().min(1),
    correctAnswer: z.string().min(1),
    userProfile: z.object({
        targetCareer: z.string().optional(),
    }).optional(),
});

export async function POST(req: Request) {
    try {
        // --- SECURITY & GATEKEEPING AUDIT 2026 ---
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "No autorizado. Se requiere token." }, { status: 401 });
        }

        const idToken = authHeader.split("Bearer ")[1];
        let uid = "";
        let email = "";

        try {
            if (!adminAuth) {
                // Bypass logic for local dev if needed, else throw
                if (process.env.NODE_ENV === 'production') throw new Error("Admin SDK missing in production");
                uid = "dev-user-id";
                email = "admin@test.com";
            } else {
                const decodedToken = await adminAuth.verifyIdToken(idToken);
                uid = decodedToken.uid;
                email = decodedToken.email || "";
            }
        } catch (error) {
            console.error("Error verificando token:", error);
            return NextResponse.json({ error: "Token inválido o expirado." }, { status: 401 });
        }

        // --- PRO SUBSCRIPTION GUARDIAN (Server Side) ---
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e: string) => e.trim().toLowerCase());
        const isSuperAdmin = email && adminEmails.includes(email.toLowerCase());

        if (!isSuperAdmin && adminDb) {
            const userDoc = await adminDb.collection("users").doc(uid).get();
            const userData = userDoc.data();
            const plan = userData?.subscription?.plan || 'free';
            
            if (plan === 'free') {
                return NextResponse.json({ 
                    error: "PREMIUM_REQUIRED",
                    message: "La explicación asistida por IA es exclusiva para usuarios PRO. Mejora tu plan para desbloquear el máximo análisis." 
                }, { status: 403 });
            }
        }

        // --- DATA PROCESSING ---
        const body = await req.json();
        const { question, selectedOption, correctAnswer, userProfile } = explainSchema.parse(body);

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "API Key no configurada." },
                { status: 500 }
            );
        }

        const isPromptOnly = question.isPromptOnly === true;
        const isCorrect = isPromptOnly ? true : (selectedOption === correctAnswer);

        const prompt = `
      Actúa como un profesor experto en preparación para pruebas Saber Pro / ICFES.
      El estudiante quiere estudiar: ${userProfile?.targetCareer || "una carrera universitaria"}.
      
      Pregunta del examen: "${question.text}"
      ${isPromptOnly ? `Respuesta/Análisis del estudiante: "${selectedOption}"` : `Opción Correcta: "${correctAnswer}"
      El estudiante eligió: "${selectedOption}" (${isCorrect ? "Correcto" : "Incorrecto"})`}

      Tu tarea:
      ${isPromptOnly ?
                `1. Analiza el texto del estudiante y dale retroalimentación constructiva sobre su capacidad de argumentación y coherencia.
         2. Explica los puntos clave que debería contener una respuesta ideal para esta tarea.
         3. Usa una analogía o ejemplo relacionado con "${userProfile?.targetCareer || 'su carrera'}" para reforzar la importancia de este concepto.`
                :
                `1. ${isCorrect ? "Felicita brevemente al estudiante y refuerza por qué su elección es la más acertada." : "Explica brevemente por qué la opción elegida es incorrecta."}
         2. Explica la lógica profunda detrás de la opción correcta.
         3. Usa una analogía o ejemplo relacionado con el área de "${userProfile?.targetCareer || 'su carrera'}" para que entienda mejor el concepto.`
            }
      4. Mantén un tono motivador y corto (máximo 150 palabras).
    `;

        const text = await generateWithFallback(prompt);

        return NextResponse.json({ explanation: text });
    } catch (error: any) {
        console.error("Error completo de IA:", error);

        if (error.status === 429) {
            return NextResponse.json(
                { error: "Límite de IA alcanzado. Reintenta en 60 segundos." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: `Error generando explicación: ${error.message || 'Desconocido'}` },
            { status: 500 }
        );
    }
}
