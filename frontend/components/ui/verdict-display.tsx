"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";

interface VerdictDisplayProps {
    verdict: "synthetic" | "authentic" | null;
    confidence: number;
    gravity: number;
    isVisible: boolean;
}

export const VerdictDisplay: React.FC<VerdictDisplayProps> = ({
    verdict,
    confidence,
    gravity,
    isVisible,
}) => {
    if (!isVisible || !verdict) return null;

    const isSynthetic = verdict === "synthetic";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-30"
        >
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.3, stiffness: 200 }}
                    className={`
            w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center
            ${isSynthetic
                            ? "bg-red-500/10 border-2 border-red-500/30"
                            : "bg-green-500/10 border-2 border-green-500/30"
                        }
          `}
                >
                    {isSynthetic ? (
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                    ) : (
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    )}
                </motion.div>

                {/* Verdict Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className={`text-4xl font-bold tracking-tight mb-2 ${isSynthetic ? "text-red-400" : "text-green-400"}`}>
                        {isSynthetic ? "SYNTHETIC" : "AUTHENTIC"}
                    </h2>
                    <p className="text-neutral-500 text-sm mb-4">
                        {isSynthetic ? "AI-generated content detected" : "No physics anomalies found"}
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex gap-8 justify-center mt-6"
                >
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">{confidence}%</p>
                        <p className="text-xs text-neutral-500 uppercase">Confidence</p>
                    </div>
                    <div className="text-center">
                        <p className={`text-2xl font-bold ${isSynthetic ? "text-red-400" : "text-white"}`}>
                            {gravity.toFixed(1)} m/s²
                        </p>
                        <p className="text-xs text-neutral-500 uppercase">Calculated G</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">9.8 m/s²</p>
                        <p className="text-xs text-neutral-500 uppercase">Expected G</p>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
