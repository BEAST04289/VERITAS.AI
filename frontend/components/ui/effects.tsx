"use client";
import { motion } from "framer-motion";

export const GlitchText = ({ text, className }: { text: string; className?: string }) => {
    return (
        <div className={`relative ${className}`}>
            <span className="relative inline-block">
                {text}
                <motion.span
                    className="absolute top-0 left-0 text-red-500 opacity-70"
                    animate={{
                        x: [0, -2, 2, -1, 0],
                        opacity: [0.7, 0.5, 0.7, 0.4, 0.7],
                    }}
                    transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        repeatDelay: 2,
                    }}
                >
                    {text}
                </motion.span>
                <motion.span
                    className="absolute top-0 left-0 text-cyan-500 opacity-70"
                    animate={{
                        x: [0, 2, -2, 1, 0],
                        opacity: [0.7, 0.4, 0.7, 0.5, 0.7],
                    }}
                    transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        delay: 0.1,
                    }}
                >
                    {text}
                </motion.span>
            </span>
        </div>
    );
};

export const CRTOverlay = () => {
    return (
        <div className="pointer-events-none fixed inset-0 z-[100]">
            {/* Scanlines */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    background: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)",
                }}
            />
            {/* Vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
                }}
            />
            {/* Flicker */}
            <motion.div
                className="absolute inset-0 bg-white"
                animate={{ opacity: [0, 0.01, 0, 0.02, 0] }}
                transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }}
            />
        </div>
    );
};
