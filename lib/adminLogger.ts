
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function logAdminAction(
    adminEmail: string,
    action: string,
    target: string,
    details: string
) {
    try {
        await addDoc(collection(db, "admin_audit"), {
            adminEmail,
            action,
            target,
            details,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Failed to log admin action:", error);
    }
}
