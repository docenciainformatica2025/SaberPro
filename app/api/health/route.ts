
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        // --- SEGURIDAD MILITAR: VERIFICACIÓN DE IDENTIDAD ---
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Acceso denegado." }, { status: 401 });
        }

        const idToken = authHeader.split("Bearer ")[1];
        try {
            if (adminAuth) {
                const decodedToken = await adminAuth.verifyIdToken(idToken);
                // Opcional: Verificar si es admin en el token o en nuestra lista
                const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
                const isRoot = decodedToken.email && ['antonio_rburgos@msn.com', 'jarbugos40@gmail.com'].includes(decodedToken.email.toLowerCase());
                
                if (!isRoot && !adminEmails.includes(decodedToken.email || "")) {
                    return NextResponse.json({ error: "Privilegios insuficientes." }, { status: 403 });
                }
            }
        } catch (authError) {
            return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
        }
        // ---------------------------------------------------

        const memoryUsage = process.memoryUsage();
        const uptime = process.uptime();

        return NextResponse.json({
            status: 'ok',
            serverTime: new Date().toISOString(),
            uptime: uptime,
            memory: {
                rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
            },
            env: process.env.NODE_ENV
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Internal Server Monitor Error'
        }, { status: 500 });
    }
}
