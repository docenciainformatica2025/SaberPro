import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, limit, orderBy } from "firebase/firestore";
import { Classroom } from "@/types/classroom";
import { adaptiveEngine } from "@/utils/adaptiveEngine";

export interface DashboardStats {
    totalSimulations: number;
    averageScore: number;
    weeklyProgress: number;
    masteryRadar: { name: string; value: number }[];
}

export interface DailyChallenge {
    module: string;
    label: string;
    icon: string;
}

export class StudentService {

    static async getDashboardStats(userId: string): Promise<DashboardStats | null> {
        try {
            const resultsRef = collection(db, "results");
            const q = query(resultsRef, where("userId", "==", userId), orderBy("completedAt", "desc"), limit(20));
            const snap = await getDocs(q);

            if (snap.empty) {
                return {
                    totalSimulations: 0,
                    averageScore: 0,
                    weeklyProgress: 0,
                    masteryRadar: []
                };
            }

            const results = snap.docs.map(d => d.data());
            const totalScore = results.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0);

            // Calculate module averages
            const moduleMap: Record<string, { sum: number; count: number }> = {};
            results.forEach(r => {
                if (r.module) {
                    if (!moduleMap[r.module]) moduleMap[r.module] = { sum: 0, count: 0 };
                    moduleMap[r.module].sum += (r.score / r.totalQuestions) * 100;
                    moduleMap[r.module].count += 1;
                }
            });

            const radarData = Object.keys(moduleMap).map(mod => ({
                name: mod,
                value: Math.round(moduleMap[mod].sum / moduleMap[mod].count)
            }));

            // Simple weekly progress (simulations this week / goal of 5)
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const weeklySims = results.filter(r => r.completedAt?.toDate() > oneWeekAgo).length;

            return {
                totalSimulations: snap.size,
                averageScore: Math.round(totalScore / snap.size),
                weeklyProgress: Math.min(100, Math.round((weeklySims / 5) * 100)),
                masteryRadar: radarData
            };
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            return null;
        }
    }

    static async getDailyChallenge(userId: string, stats: DashboardStats): Promise<DailyChallenge> {
        // Use adaptive engine to find the weakest module
        const advice = adaptiveEngine.analyzeProfile(stats.masteryRadar || [], { averageScore: stats.averageScore });

        const moduleDetails: Record<string, { label: string; icon: string }> = {
            "razonamiento_cuantitativo": { label: "Razonamiento Cuantitativo", icon: "Zap" },
            "lectura_critica": { label: "Lectura Crítica", icon: "Brain" },
            "competencias_ciudadanas": { label: "Competencias Ciudadanas", icon: "Sparkles" },
            "ingles": { label: "Inglés", icon: "Brain" },
            "comunicacion_escrita": { label: "Comunicación Escrita", icon: "Brain" }
        };

        const moduleKey = advice.nextRecommendedModule.toLowerCase().replace(/ /g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        // Map back to our fixed IDs if normalization isn't perfect
        const finalKey = Object.keys(moduleDetails).find(k => k.includes(moduleKey.split('_')[0])) || "lectura_critica";

        return {
            module: finalKey,
            label: moduleDetails[finalKey]?.label || "Lectura Crítica",
            icon: moduleDetails[finalKey]?.icon || "Brain"
        };
    }

    static async joinClassByCode(userId: string, code: string, studentName: string): Promise<{ success: boolean; message: string; classData?: Classroom }> {
        try {
            // 1. Validate Code
            const q = query(collection(db, "classrooms"), where("code", "==", code.toUpperCase()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return { success: false, message: "Código de clase inválido." };
            }

            const classDoc = querySnapshot.docs[0];
            const classData = classDoc.data();

            // 2. Check Enrollment
            const memberQ = query(
                collection(db, "class_members"),
                where("classId", "==", classDoc.id),
                where("userId", "==", userId)
            );
            const memberSnap = await getDocs(memberQ);

            if (!memberSnap.empty) {
                return { success: false, message: "Ya estás inscrito en esta clase." };
            }

            // 3. Register
            await addDoc(collection(db, "class_members"), {
                classId: classDoc.id,
                userId: userId,
                joinedAt: serverTimestamp(),
                role: 'student',
                studentName: studentName
            });

            return {
                success: true,
                message: `Te has unido a: ${classData.name}`,
                classData: { id: classDoc.id, ...classData } as Classroom
            };

        } catch (error) {
            console.error("Error joining class:", error);
            return { success: false, message: "Error interno al unirse a la clase." };
        }
    }
}
