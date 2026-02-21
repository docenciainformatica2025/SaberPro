import { collection, getCountFromServer, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface DashboardStats {
    users: number;
    questions: number;
    simulations: number;
    proUsers: number;
}

export interface DashboardUser {
    id: string;
    city?: string;
    targetCareer?: string;
    dreamUniversity?: string;
    [key: string]: unknown;
}

export const adminService = {
    /**
     * Obtiene las estadísticas globales para el Dashboard Administrativo.
     */
    async getDashboardStats(): Promise<DashboardStats> {
        const usersColl = collection(db, "users");
        const questionsColl = collection(db, "questions");
        const resultsColl = collection(db, "results");
        const qPro = query(usersColl, where("subscription.plan", "==", "pro"));

        const [usersSnapshot, questionsSnapshot, resultsSnapshot, proSnapshot] = await Promise.all([
            getCountFromServer(usersColl),
            getCountFromServer(questionsColl),
            getCountFromServer(resultsColl),
            getCountFromServer(qPro)
        ]);

        return {
            users: usersSnapshot.data().count,
            questions: questionsSnapshot.data().count,
            simulations: resultsSnapshot.data().count,
            proUsers: proSnapshot.data().count
        };
    },

    /**
     * Obtiene una lista de usuarios recientes para análisis.
     */
    async getRecentUsers(limitCount: number = 100): Promise<DashboardUser[]> {
        const usersColl = collection(db, "users");
        const qUsers = query(usersColl, limit(limitCount));
        const snapshot = await getDocs(qUsers);

        return snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
        } as DashboardUser));
    }
};
