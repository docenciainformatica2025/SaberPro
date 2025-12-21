
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET() {
    const start = Date.now();
    let dbStatus = "healthy";
    let status = 200;

    try {
        // Lightweight check: Read system config or a known public doc
        // Using a timeout to ensure we don't hang indefinitely
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Database timeout")), 3000)
        );

        // Attempt to read a lightweight document (e.g., config)
        const dbCheck = getDoc(doc(db, "system", "config"));

        await Promise.race([dbCheck, timeoutPromise]);

    } catch (error: any) {
        dbStatus = "unhealthy";
        status = 503; // Service Unavailable
        console.error("Health check failed:", error);
    }

    const duration = Date.now() - start;

    return NextResponse.json(
        {
            status: dbStatus === "healthy" ? "ok" : "error",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(), // Server uptime
            database: dbStatus,
            latency: `${duration}ms`,
            environment: process.env.NODE_ENV,
            version: "1.0.0"
        },
        { status }
    );
}
