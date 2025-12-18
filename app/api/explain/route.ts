import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { question, selectedOption, correctAnswer, userProfile } = await req.json();

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
    } catch (error: any) {
        console.error("Error completo de IA:", error);
        // Verificar si es error de API Key
        if (error.status === 400 && error.message?.includes('API key')) {
            return NextResponse.json(
                { error: "Clave API inválida o expirada." },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: `Error generando explicación: ${error.message || 'Desconocido'}` },
            { status: 500 }
        );
    }
}
