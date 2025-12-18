import { Timestamp } from "firebase/firestore";

export interface Classroom {
    id: string;              // Firestore Doc ID
    code: string;            // Unique Join Code (e.g., "MATH01")
    name: string;            // "Matemáticas 11-B"
    teacherId: string;       // UID of the teacher
    subject?: "lectura_critica" | "razonamiento_cuantitativo" | "competencias_ciudadanas" | "ingles" | "comunicacion_escrita" | "general";
    createdAt: Timestamp;    // Timestamp
    isActive: boolean;       // If false, students can't join

    // Stats (Aggregated)
    studentCount: number;
    averageScore?: number;
}

export interface ClassSession {
    id: string;
    classroomId: string;
    status: 'waiting' | 'live' | 'finished';
    currentQuestionIndex: number;
    startTime?: Timestamp;
}
