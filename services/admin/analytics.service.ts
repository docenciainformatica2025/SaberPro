import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AnalyticsStats {
    revenue: number;
    activeUsers: number;
    totalUsers: number;
    proCount: number;
    freeCount: number;
    conversionRate: number;
}

export interface ChartDataPoint {
    month: string;
    users: number;
    revenue: number;
}

export class AnalyticsService {
    /**
     * Calcula métricas avanzadas de crecimiento y conversión.
     */
    static async getGrowthMetrics(): Promise<{ stats: AnalyticsStats; chartData: ChartDataPoint[] }> {
        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                subscription: data.subscription || {},
                lastLogin: data.lastLogin?.toDate() || data.createdAt?.toDate() || new Date(0),
                createdAt: data.createdAt?.toDate() || new Date(0)
            };
        });

        let totalRevenue = 0;
        let activeCount = 0;
        let pro = 0;
        let free = 0;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const monthlyGrowth: Record<string, number> = {};

        interface AnalyticsUser {
            subscription?: { plan?: string };
            lastLogin: Date;
            createdAt: Date;
        }

        const typedUsers = users as unknown as AnalyticsUser[];

        typedUsers.forEach((u) => {
            if (u.subscription?.plan === 'pro') {
                pro++;
                totalRevenue += 24.99;
            } else {
                free++;
            }

            if (u.lastLogin > thirtyDaysAgo) {
                activeCount++;
            }

            const monthKey = u.createdAt.toLocaleString('es-ES', { month: 'short' });
            monthlyGrowth[monthKey] = (monthlyGrowth[monthKey] || 0) + 1;
        });

        const stats: AnalyticsStats = {
            revenue: totalRevenue,
            activeUsers: activeCount > 0 ? activeCount : Math.floor(users.length * 0.4), // Fallback if no lastLogin
            totalUsers: users.length,
            proCount: pro,
            freeCount: free,
            conversionRate: users.length > 0 ? (pro / users.length) * 100 : 0
        };

        const chartData: ChartDataPoint[] = Object.keys(monthlyGrowth).map(key => ({
            month: key.toUpperCase(),
            users: monthlyGrowth[key],
            revenue: monthlyGrowth[key] * (pro / (users.length || 1)) * 25
        })).slice(-6);

        return { stats, chartData };
    }
}
