export type CompetencyType =
    | "lectura_critica"
    | "razonamiento_cuantitativo"
    | "competencias_ciudadanas"
    | "ingles"
    | "comunicacion_escrita";

export interface QuestionOption {
    id: string;
    text: string;
}

export interface Question {
    id?: string;
    module: CompetencyType;
    text: string;
    options: QuestionOption[];
    correctAnswer: string; // ID de la opción correcta
    explanation: string;
    difficulty: "baja" | "media" | "media_alta" | "avanzada" | "alta";
    imageUrl?: string;
    isPromptOnly?: boolean; // 2026: Para tareas de respuesta abierta (ej: Comunicación Escrita)
}
