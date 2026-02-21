import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface LibraryItem {
    id: string | number;
    type: 'video' | 'practice' | 'reading';
    title: string;
    desc?: string;
    duration?: string;
    match?: string;
    priority?: string;
    image?: string;
    status?: string;
}

export class LibraryService {
    /**
     * Obtiene recursos recomendados por la IA para el estudiante.
     * En una fase posterior, esto consultará un motor de recomendaciones.
     */
    static async getRecommendedResources(): Promise<LibraryItem[]> {
        // Por ahora retornamos los mocks que estaban en el componente, 
        // pero preparados para ser consumidos de forma asíncrona.
        return [
            {
                id: 'rec_1',
                type: 'video',
                title: 'Dominando las Fracciones Complejas',
                desc: 'Tu Mentor notó que este tema te tomó más tiempo ayer.',
                duration: '5 min',
                match: '98% Match',
                priority: 'ALTA PRIORIDAD',
                image: 'bg-gradient-to-br from-slate-300 to-slate-400'
            },
            {
                id: 'rec_2',
                type: 'practice',
                title: 'Reto de Geometría',
                desc: 'Potencia tu visión espacial con ejercicios rápidos.',
                match: '95% Match',
                priority: 'PRÁCTICA',
                image: 'bg-gradient-to-br from-teal-300 to-teal-400'
            }
        ];
    }

    /**
     * Obtiene los recursos guardados por el usuario.
     */
    static async getSavedResources(userId: string): Promise<LibraryItem[]> {
        // Simulación de consulta a Firestore
        return [
            { id: 'save_1', title: 'Teoría de Probabilidades: Guía Visual', type: 'reading', status: 'Leído' },
            { id: 'save_2', title: 'Ecuaciones de Segundo Grado', type: 'video', status: 'Continuar' },
        ];
    }
}
