import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
    uid: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    role?: string;
    city?: string;
    targetCareer?: string;
    dreamUniversity?: string;
    [key: string]: unknown;
}

export const userService = {
    /**
     * Obtiene el perfil completo de un usuario por su UID.
     */
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
        }
        return null;
    },

    /**
     * Actualiza los datos del perfil de un usuario.
     */
    async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, data);
    }
};
