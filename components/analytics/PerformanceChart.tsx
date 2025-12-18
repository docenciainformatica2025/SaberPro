"use client";

import {
    LineChart,
    Line,
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

interface PerformanceChartProps {
    type: "line" | "radar";
    data: any[];
    dataKey?: string;
    categoryKey?: string;
    color?: string;
}

export default function PerformanceChart({ type, data, dataKey = "value", categoryKey = "name", color = "#D4AF37" }: PerformanceChartProps) {
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
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey={categoryKey} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#333", color: "#fff" }}
                            itemStyle={{ color: color }}
                        />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={3}
                            dot={{ r: 4, fill: color }}
                            activeDot={{ r: 6, fill: "#fff" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === "radar") {
        return (
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#ffffff20" />
                        <PolarAngleAxis dataKey={categoryKey} tick={{ fill: "#9ca3af", fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Desempeño"
                            dataKey={dataKey}
                            stroke={color}
                            fill={color}
                            fillOpacity={0.4}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#333", color: "#fff" }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return null;
}
