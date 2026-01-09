"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScanningOverlayProps {
    isActive: boolean;
    progress: number;
    stage: string;
    objects: Array<{ id: number; type: string; confidence: number }>;
    trajectory: Array<{ t: number; x: number; y: number }>;
}

export const ScanningOverlay: React.FC<ScanningOverlayProps> = ({
    isActive,
    progress,
    stage,
    objects,
    trajectory
}) => {
    if (!isActive) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-10">
            {/* Scanning beam effect */}
            <motion.div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
                initial={{ top: 0 }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-500/50" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-500/50" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-500/50" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-500/50" />

            {/* Object detection boxes */}
            {objects.map((obj, i) => (
                <motion.div
                    key={obj.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute border border-green-500/70 rounded"
                    style={{
                        // Simulated positions for demo
                        left: `${20 + i * 25}%`,
                        top: `${30 + i * 10}%`,
                        width: "60px",
                        height: "80px"
                    }}
                >
                    <div className="absolute -top-5 left-0 text-[10px] text-green-400 font-mono whitespace-nowrap">
                        {obj.type} ({(obj.confidence * 100).toFixed(0)}%)
                    </div>
                </motion.div>
            ))}

            {/* Trajectory path */}
            {trajectory.length > 1 && (
                <svg className="absolute inset-0 w-full h-full">
                    <motion.path
                        d={trajectory.map((p, i) =>
                            `${i === 0 ? 'M' : 'L'} ${p.x * 100}% ${(1 - p.y) * 100}%`
                        ).join(' ')}
                        fill="none"
                        stroke="rgba(251, 191, 36, 0.6)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1 }}
                    />
                    {trajectory.map((p, i) => (
                        <motion.circle
                            key={i}
                            cx={`${p.x * 100}%`}
                            cy={`${(1 - p.y) * 100}%`}
                            r="4"
                            fill="rgba(251, 191, 36, 0.8)"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.2 }}
                        />
                    ))}
                </svg>
            )}

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
                <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Stage indicator */}
            <div className="absolute bottom-3 left-4 text-xs font-mono text-blue-400/80">
                {stage.toUpperCase().replace("_", " ")} • {progress}%
            </div>
        </div>
    );
};
