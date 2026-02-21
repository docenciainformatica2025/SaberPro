import { db } from "@/lib/firebase";
import { collection, query, where, addDoc, serverTimestamp, getCountFromServer } from "firebase/firestore";

export interface AssignmentData {
    selectedClass: string;
    assignmentType: string;
    title?: string;
    dueDate?: string;
    teacherId: string;
}

export class AssignmentService {
    /**
     * Verifica cuántas tareas activas tiene un docente.
     */
    static async getActiveAssignmentsCount(teacherId: string): Promise<number> {
        const q = query(
            collection(db, "assignments"),
            where("teacherId", "==", teacherId),
            where("isActive", "==", true)
        );
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    }

    /**
     * Crea una nueva asignación en la base de datos.
     */
    static async createAssignment(data: AssignmentData): Promise<void> {
        const { selectedClass, assignmentType, title, dueDate, teacherId } = data;

        await addDoc(collection(db, "assignments"), {
            classId: selectedClass,
            teacherId: teacherId,
            type: assignmentType,
            title: title || this.getDefaultTitle(assignmentType),
            moduleId: assignmentType === 'simulation_full' ? 'full_simulation' : assignmentType,
            dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdAt: serverTimestamp(),
            isActive: true,
            requiresPro: assignmentType === 'simulation_full'
        });
    }

    /**
     * Retorna el título por defecto según el tipo de actividad.
     */
    static getDefaultTitle(type: string): string {
        const types: Record<string, string> = {
            'razonamiento_cuantitativo': 'Práctica de Razonamiento Cuantitativo',
            'lectura_critica': 'Práctica de Lectura Crítica',
            'competencias_ciudadanas': 'Práctica de Competencias Ciudadanas',
            'ingles': 'Práctica de Inglés',
            'simulation_full': 'Simulacro Completo Saber Pro'
        };
        return types[type] || 'Nueva Tarea';
    }
}
