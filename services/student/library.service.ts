import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";
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
     * Obtiene recursos recomendados desde Firestore (colección 'resources').
     * Retorna array vacío si no hay recursos publicados todavía.
     */
    static async getRecommendedResources(): Promise<LibraryItem[]> {
        try {
            const q = query(
                collection(db, "resources"),
                where("published", "==", true),
                orderBy("createdAt", "desc"),
                limit(10)
            );
            const snapshot = await getDocs(q);
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as LibraryItem[];
        } catch (error) {
            console.error("Error fetching recommended resources:", error);
            return [];
        }
    }

    /**
     * Obtiene los recursos guardados por el usuario desde Firestore.
     * Retorna array vacío si el usuario no ha guardado nada aún.
     */
    static async getSavedResources(userId: string): Promise<LibraryItem[]> {
        if (!userId) return [];
        try {
            const q = query(
                collection(db, "savedResources"),
                where("userId", "==", userId),
                orderBy("savedAt", "desc"),
                limit(20)
            );
            const snapshot = await getDocs(q);
            if (snapshot.empty) return [];
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as LibraryItem[];
        } catch (error) {
            console.error("Error fetching saved resources:", error);
            return [];
        }
    }
}
