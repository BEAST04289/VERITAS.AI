"use client";

import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

interface PhysicsData {
    law: string;
    severity: number;
    fullMark: number;
}

interface PhysicsRadarChartProps {
    data: {
        gravity?: { severity: number };
        shadows?: { severity: number };
        momentum?: { severity: number };
        reflection?: { severity: number };
        material?: { severity: number };
    } | null;
}

export function PhysicsRadarChart({ data }: PhysicsRadarChartProps) {
    if (!data) {
        return (
            <div className="h-48 flex items-center justify-center text-neutral-500 text-xs">
                Awaiting analysis...
            </div>
        );
    }

    const chartData: PhysicsData[] = [
        { law: "Gravity", severity: data.gravity?.severity || 0, fullMark: 10 },
        { law: "Shadows", severity: data.shadows?.severity || 0, fullMark: 10 },
        { law: "Momentum", severity: data.momentum?.severity || 0, fullMark: 10 },
        { law: "Reflection", severity: data.reflection?.severity || 0, fullMark: 10 },
        { law: "Material", severity: data.material?.severity || 0, fullMark: 10 },
    ];

    // Calculate average severity for color
    const avgSeverity = chartData.reduce((acc, d) => acc + d.severity, 0) / chartData.length;

    const getColor = () => {
        if (avgSeverity >= 6) return "#ef4444"; // red
        if (avgSeverity >= 3) return "#eab308"; // yellow
        return "#22c55e"; // green
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 shadow-xl">
                    <p className="text-sm font-bold text-white">{data.law}</p>
                    <p className={`text-xs ${data.severity >= 8 ? "text-red-400" :
                            data.severity >= 4 ? "text-yellow-400" : "text-emerald-400"
                        }`}>
                        Severity: {data.severity.toFixed(1)}/10
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid
                        stroke="#374151"
                        strokeDasharray="3 3"
                    />
                    <PolarAngleAxis
                        dataKey="law"
                        tick={{ fill: "#9ca3af", fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 10]}
                        tick={{ fill: "#6b7280", fontSize: 8 }}
                        tickCount={6}
                    />
                    <Radar
                        name="Severity"
                        dataKey="severity"
                        stroke={getColor()}
                        fill={getColor()}
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
