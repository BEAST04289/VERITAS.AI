"use client";

import React from "react";
import { motion } from "framer-motion";

interface WaterRippleProps {
    isActive: boolean;
    x?: number;
    y?: number;
}

export const WaterRipple: React.FC<WaterRippleProps> = ({
    isActive,
    x = 50,
    y = 50
}) => {
    if (!isActive) return null;

    return (
        <div
            className="absolute pointer-events-none z-20"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
        >
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full border border-blue-400/30"
                    style={{
                        width: 20,
                        height: 20,
                        left: -10,
                        top: -10,
                    }}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{
                        scale: [1, 4, 8],
                        opacity: [0.6, 0.3, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: "easeOut"
                    }}
                />
            ))}

            {/* Center pulse */}
            <motion.div
                className="absolute w-3 h-3 bg-blue-400/50 rounded-full"
                style={{ left: -6, top: -6 }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
};
