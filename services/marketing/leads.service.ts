import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface GabrielaLead {
    name: string;
    email: string;
    intent: string;
    region?: string;
    userAgent?: string;
    status: 'pending' | 'converted';
    createdAt: any;
}

export const saveGabrielaLead = async (data: Partial<GabrielaLead>) => {
    try {
        if (!db) return;
        const leadsRef = collection(db, "gabriela_leads");
        await addDoc(leadsRef, {
            ...data,
            status: data.status || 'pending',
            createdAt: serverTimestamp(),
            region: Intl.DateTimeFormat().resolvedOptions().timeZone,
            userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown'
        });
        console.log("Lead saved successfully to Firestore");
    } catch (error) {
        console.error("Error saving lead:", error);
    }
};
