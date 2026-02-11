"use client";

import {
    AreaChart,
    Area,
    ResponsiveContainer,
    RadarChart,
    Radar,
    PolarGrid
} from "recharts";
import {
    ThemedGrid,
    ThemedXAxis,
    ThemedYAxis,
    ThemedTooltip
} from "@/components/ui/ThemedChart";

import { useState, useEffect } from "react";

interface PerformanceChartProps {
    type: "line" | "radar";
    data: Record<string, any>[];
    dataKey?: string;
    categoryKey?: string;
    color?: string;
}

const CustomTooltip = ({ active, payload, label, color }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--theme-bg-surface)]/80 backdrop-blur-xl border border-[var(--theme-border-soft)] p-4 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-tertiary)] mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-lg font-semibold text-[var(--theme-text-primary)] italic">
                        {payload[0].value}%
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function PerformanceChart({ type, data, dataKey = "value", categoryKey = "name", color = "#D4AF37" }: PerformanceChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <div className="h-64 flex items-center justify-center text-[var(--theme-text-tertiary)] border border-[var(--theme-border-soft)] rounded-xl bg-[var(--theme-bg-surface)]/20">
            <div className="animate-pulse">Cargando visualización...</div>
        </div>
    );

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-[var(--theme-text-tertiary)] border border-[var(--theme-border-soft)] rounded-xl bg-[var(--theme-bg-surface)]/20">
                <p>No hay datos suficientes para graficar</p>
            </div>
        );
    }

    if (type === "line") {
        return (
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <ThemedGrid />
                        <ThemedXAxis dataKey={categoryKey} />
                        <ThemedYAxis domain={[0, 100]} />
                        <ThemedTooltip content={<CustomTooltip color={color} />} />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === "radar") {
        return (
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="var(--theme-border-soft)" />
                        <Radar
                            name="Desempeño"
                            dataKey={dataKey}
                            stroke={color}
                            fill={color}
                            fillOpacity={0.5}
                            animationDuration={1500}
                        />
                        <ThemedTooltip content={<CustomTooltip color={color} />} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return null;
}
