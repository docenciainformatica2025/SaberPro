"use client";

import React from "react";
import {
    CartesianGrid as RechartsGrid,
    XAxis as RechartsXAxis,
    YAxis as RechartsYAxis,
    Tooltip as RechartsTooltip,
    CartesianGridProps,
    XAxisProps,
    YAxisProps,
    TooltipProps
} from "recharts";

/**
 * Startup-Grade Themed Chart Components
 * Ensures absolute standardization across all dashboards.
 */

export const ThemedGrid = (props: CartesianGridProps) => (
    <RechartsGrid
        strokeDasharray="3 3"
        stroke="var(--theme-chart-grid)"
        vertical={false}
        {...props}
    />
);

export const ThemedXAxis = (props: XAxisProps) => (
    <RechartsXAxis
        stroke="var(--theme-chart-axis)"
        fontSize={10}
        axisLine={false}
        tickLine={false}
        dy={10}
        fontStyle="italic"
        fontWeight="bold"
        {...props}
    />
);

export const ThemedYAxis = (props: YAxisProps) => (
    <RechartsYAxis
        stroke="var(--theme-chart-axis)"
        fontSize={10}
        axisLine={false}
        tickLine={false}
        fontWeight="bold"
        {...props}
    />
);

export const ThemedTooltip = (props: TooltipProps<any, any>) => (
    <RechartsTooltip
        contentStyle={{
            backgroundColor: 'var(--theme-chart-tooltip-bg)',
            border: '1px solid var(--theme-chart-tooltip-border)',
            borderRadius: '12px',
            fontSize: '11px',
            color: 'var(--theme-text-primary)',
            boxShadow: 'var(--theme-shadow-md)',
            backdropFilter: 'blur(8px)'
        }}
        itemStyle={{ fontWeight: 'bold' }}
        {...props}
    />
);
