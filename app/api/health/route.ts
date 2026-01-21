
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
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
