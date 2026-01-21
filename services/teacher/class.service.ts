import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { Classroom } from "@/types/classroom";

export class ClassService {

    static async getClassesByTeacher(teacherId: string): Promise<Classroom[]> {
        const q = query(collection(db, "classrooms"), where("teacherId", "==", teacherId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Classroom));
    }

    static async createClass(teacherId: string, name: string, subject: string): Promise<string> {
        const code = this.generateUniqueCode();
        await addDoc(collection(db, "classrooms"), {
            name,
            subject,
            code,
            teacherId,
            createdAt: serverTimestamp(),
            isActive: true,
            studentCount: 0,
            averageScore: 0
        });
        return code;
    }

    private static generateUniqueCode(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    static async getClassDetails(classId: string): Promise<Classroom | null> {
        const docRef = doc(db, "classrooms", classId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Classroom;
        }
        return null;
    }

    static async getStudentsInClass(classId: string): Promise<any[]> {
        const q = query(collection(db, "class_members"), where("classId", "==", classId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static subscribeToClassStudents(classId: string, callback: (students: any[]) => void): () => void {
        const q = query(collection(db, "class_members"), where("classId", "==", classId));
        return onSnapshot(q, (snapshot) => {
            const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Order by score descending
            students.sort((a: any, b: any) => (b.lastScore || 0) - (a.lastScore || 0));
            callback(students);
        });
    }
}
