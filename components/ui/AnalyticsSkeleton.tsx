import { Skeleton } from "./Skeleton";
import { Card } from "./Card";

export function AnalyticsSkeleton() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-96 md:w-[480px]" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-44" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* KPIs Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} variant="glass" className="p-6 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                        <Skeleton className="h-3 w-20 mb-4 opacity-50" />
                        <Skeleton className="h-10 w-24 mb-3" />
                        <Skeleton className="h-3 w-28 opacity-30" />
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card variant="glass" className="lg:col-span-2 p-8 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <div className="h-[300px] flex items-end gap-2 px-4">
                        {[...Array(12)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="flex-1"
                                style={{ height: `${Math.random() * 60 + 20}%` }}
                            />
                        ))}
                    </div>
                </Card>
                <Card variant="glass" className="p-8 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <div className="flex items-center justify-center h-[300px]">
                        <Skeleton className="w-48 h-48 rounded-full" />
                    </div>
                </Card>
            </div>

            {/* Recent Results/Table Skeleton */}
            <Card variant="glass" className="p-8 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                <Skeleton className="h-6 w-48 mb-8" />
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-[var(--theme-border-soft)]">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-32 opacity-50" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-24 rounded-lg" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
