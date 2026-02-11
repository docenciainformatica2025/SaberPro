import { Skeleton } from "./Skeleton";
import { Card } from "./Card";

export function DashboardSkeleton() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Welcome Section Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-[var(--theme-border-soft)] pb-8">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-96 md:w-[500px]" />
                    <Skeleton className="h-5 w-72" />
                </div>
                <Skeleton className="h-12 w-48 rounded-xl" />
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} variant="glass" className="p-6 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                        <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48 mb-4 opacity-50" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats & Classes Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Card */}
                    <Card variant="glass" className="p-8 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                        <Skeleton className="h-6 w-48 mb-6" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Skeleton className="h-32 w-full rounded-2xl" />
                            <Skeleton className="h-32 w-full rounded-2xl" />
                        </div>
                    </Card>

                    {/* Classes Card */}
                    <Card variant="glass" className="p-8 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                        <Skeleton className="h-6 w-48 mb-6" />
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-[var(--theme-bg-overlay)] border border-[var(--theme-border-soft)] rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-20 opacity-50" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Column: Recent Results */}
                <Card variant="glass" className="p-8 border-[var(--theme-border-soft)] bg-[var(--theme-bg-surface)]">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-10" />
                                </div>
                                <Skeleton className="h-2 w-full rounded-full" />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
