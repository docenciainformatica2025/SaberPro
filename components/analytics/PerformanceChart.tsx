"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from "recharts";

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
            <div className="bg-metal-black/80 backdrop-blur-xl border border-metal-silver/10 p-4 rounded-xl shadow-2xl shadow-black/50 animate-in fade-in zoom-in duration-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-metal-silver/40 mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-lg font-black text-white italic">
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
        <div className="h-64 flex items-center justify-center text-metal-silver/10 border border-white/5 rounded-xl bg-black/20">
            <div className="animate-pulse">Cargando visualización...</div>
        </div>
    );

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-metal-silver/30 border border-white/5 rounded-xl bg-black/20">
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
                        <CartesianGrid strokeDasharray="5 5" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey={categoryKey}
                            stroke="#ffffff60"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#ffffff60"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip color={color} />} />
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
                        <PolarGrid stroke="#ffffff10" />
                        <PolarAngleAxis
                            dataKey={categoryKey}
                            tick={{ fill: "#ffffff99", fontSize: 10, fontWeight: "bold" }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />
                        <Radar
                            name="Desempeño"
                            dataKey={dataKey}
                            stroke={color}
                            fill={color}
                            fillOpacity={0.5}
                            animationDuration={1500}
                        />
                        <Tooltip content={<CustomTooltip color={color} />} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return null;
}
