"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ViolationMarker {
    frame: number;
    time: string;
    law: string;
    severity: number;
    explanation?: string;
}

interface TimelineScrubberProps {
    duration: number; // Total video duration in seconds
    violations: ViolationMarker[];
    currentTime?: number;
    onSeek?: (time: number) => void;
}

export function TimelineScrubber({
    duration = 30,
    violations = [],
    currentTime = 0,
    onSeek
}: TimelineScrubberProps) {
    const [selectedViolation, setSelectedViolation] = useState<ViolationMarker | null>(null);
    const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);

    const getSeverityColor = (severity: number) => {
        if (severity >= 8) return "bg-red-500";
        if (severity >= 4) return "bg-yellow-500";
        return "bg-emerald-500";
    };

    const getSeverityGlow = (severity: number) => {
        if (severity >= 8) return "shadow-red-500/50";
        if (severity >= 4) return "shadow-yellow-500/50";
        return "shadow-emerald-500/50";
    };

    const parseTimeToSeconds = (timeStr: string): number => {
        const parts = timeStr.split(":");
        if (parts.length === 2) {
            const [mins, secs] = parts.map(Number);
            return mins * 60 + secs;
        }
        return Number(timeStr) || 0;
    };

    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-medium text-neutral-400">Violation Timeline</h4>
                <span className="text-xs text-neutral-500">
                    {violations.length} violation{violations.length !== 1 ? "s" : ""} detected
                </span>
            </div>

            {/* Timeline Track */}
            <div className="relative h-8 bg-neutral-800 rounded-lg overflow-visible">
                {/* Progress bar */}
                <div
                    className="absolute inset-y-0 left-0 bg-neutral-700/50 rounded-l-lg"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                />

                {/* Violation markers */}
                {violations.map((violation, index) => {
                    const timeInSeconds = parseTimeToSeconds(violation.time);
                    const position = (timeInSeconds / duration) * 100;
                    const isHovered = hoveredMarker === index;
                    const isSelected = selectedViolation === violation;

                    return (
                        <motion.div
                            key={index}
                            className="absolute top-1/2 -translate-y-1/2 z-10"
                            style={{ left: `${position}%` }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <button
                                onClick={() => {
                                    setSelectedViolation(isSelected ? null : violation);
                                    onSeek?.(timeInSeconds);
                                }}
                                onMouseEnter={() => setHoveredMarker(index)}
                                onMouseLeave={() => setHoveredMarker(null)}
                                className={`
                                    w-4 h-4 rounded-full -ml-2 cursor-pointer transition-all
                                    ${getSeverityColor(violation.severity)}
                                    ${isHovered || isSelected ? `shadow-lg ${getSeverityGlow(violation.severity)} scale-125` : ""}
                                `}
                            />

                            {/* Tooltip */}
                            {(isHovered || isSelected) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20"
                                >
                                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
                                        <div className="font-bold text-white">{violation.law}</div>
                                        <div className="text-neutral-400">
                                            {violation.time} • Severity: {violation.severity.toFixed(1)}/10
                                        </div>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 border-r border-b border-neutral-700 rotate-45 -mt-1" />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}

                {/* Time markers */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[10px] text-neutral-600">
                    <span>0:00</span>
                    <span>{Math.floor(duration / 2)}s</span>
                    <span>{duration}s</span>
                </div>
            </div>

            {/* Selected Violation Details */}
            {selectedViolation && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3 rounded-lg bg-neutral-800/50 border border-neutral-700"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${selectedViolation.severity >= 8 ? "text-red-400" :
                                selectedViolation.severity >= 4 ? "text-yellow-400" : "text-emerald-400"
                            }`}>
                            {selectedViolation.law} Violation
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-300">
                            Frame {selectedViolation.frame}
                        </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                        {selectedViolation.explanation ||
                            `Detected at ${selectedViolation.time} with severity ${selectedViolation.severity.toFixed(1)}/10`}
                    </p>
                </motion.div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-[10px] text-neutral-500">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Critical (8-10)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Suspicious (4-7)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Minor (0-3)</span>
                </div>
            </div>
        </div>
    );
}
