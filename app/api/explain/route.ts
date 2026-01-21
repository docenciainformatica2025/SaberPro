import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

import { z } from "zod";

const explainSchema = z.object({
    question: z.object({
        text: z.string().min(1, "El texto de la pregunta es requerido"),
    }),
    selectedOption: z.string().min(1),
    correctAnswer: z.string().min(1),
    userProfile: z.object({
        targetCareer: z.string().optional(),
    }).optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { question, selectedOption, correctAnswer, userProfile } = explainSchema.parse(body);

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "API Key no configurada. Por favor agrega GEMINI_API_KEY en .env.local" },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
      Actúa como un profesor experto en preparación para pruebas Saber Pro / ICFES.
      El estudiante quiere estudiar: ${userProfile?.targetCareer || "una carrera universitaria"}.
      
      Pregunta del examen: "${question.text}"
      Opción Correcta: "${correctAnswer}"
      El estudiante eligió: "${selectedOption}" (Incorrecto)

      Tu tarea:
      1. Explica brevemente por qué la opción elegida es incorrecta.
      2. Explica por qué la opción correcta es la acertada.
      3. Usa una analogía o ejemplo relacionado con el área de "${userProfile?.targetCareer}" para que entienda mejor el concepto.
      4. Mantén un tono motivador y corto (máximo 150 palabras).
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ explanation: text });
    } catch (error: unknown) {
        const err = error as { status?: number; message?: string };
        console.error("Error completo de IA:", err);
        // Verificar si es error de API Key
        if (err.status === 400 && err.message?.includes('API key')) {
            return NextResponse.json(
                { error: "Clave API inválida o expirada." },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: `Error generando explicación: ${err.message || 'Desconocido'}` },
            { status: 500 }
        );
    }
}
