
import { Timestamp } from "firebase/firestore";

export type AssignmentType = 'standard' | 'simulation_full' | 'ai_practice';

export interface Assignment {
    id: string;
    classId: string;
    teacherId: string;
    moduleId: string; // e.g., 'razonamiento_cuantitativo' or 'full_simulation'
    type: AssignmentType;
    title: string;
    description?: string;
    dueDate: Timestamp | Date;
    createdAt: Timestamp | Date;
    isActive: boolean;

    // Monetization Flags
    requiresPro: boolean; // If true, basic students cannot access
}
