import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { UserProfile } from "@/types/user";

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
