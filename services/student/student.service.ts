import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export class StudentService {

    static async joinClassByCode(userId: string, code: string, studentName: string): Promise<{ success: boolean; message: string; classData?: any }> {
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
                classData: { id: classDoc.id, ...classData }
            };

        } catch (error) {
            console.error("Error joining class:", error);
            return { success: false, message: "Error interno al unirse a la clase." };
        }
    }
}
