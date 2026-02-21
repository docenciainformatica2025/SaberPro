import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export interface UserProfile {
    uid: string;
    email: string;
    fullName?: string;
    role?: string;
    gradeLevel?: string;
    targetCareer?: string;
    dreamUniversity?: string;
    institution?: string;
    city?: string;
    scoreGoal?: string;
    subscription?: {
        plan: 'free' | 'pro';
        expiresAt?: number | Date | null;
    };
    onboardingCompleted?: boolean;
}

export class UserService {
    /**
     * Obtiene el perfil completo de un usuario desde Firestore.
     */
    static async getUserProfile(uid: string): Promise<UserProfile | null> {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
        }
        return null;
    }

    /**
     * Actualiza los datos del perfil del usuario.
     */
    static async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, data);
    }
}
