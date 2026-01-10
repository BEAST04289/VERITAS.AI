"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

interface ComparisonViewProps {
    realVideoUrl: string;
    simulationVideoUrl: string;
    violationDetails?: {
        law: string;
        realValue: string;
        correctValue: string;
        explanation: string;
    };
    isVisible: boolean;
}

export function ComparisonView({
    realVideoUrl,
    simulationVideoUrl,
    violationDetails,
    isVisible
}: ComparisonViewProps) {
    const realVideoRef = useRef<HTMLVideoElement>(null);
    const simVideoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    // Sync both videos
    useEffect(() => {
        if (!realVideoRef.current || !simVideoRef.current) return;

        const handleTimeUpdate = () => {
            if (realVideoRef.current) {
                setCurrentTime(realVideoRef.current.currentTime);
            }
        };

        realVideoRef.current.addEventListener("timeupdate", handleTimeUpdate);
        return () => {
            realVideoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, []);

    const handlePlayPause = () => {
        if (!realVideoRef.current || !simVideoRef.current) return;

        if (isPlaying) {
            realVideoRef.current.pause();
            simVideoRef.current.pause();
        } else {
            realVideoRef.current.play();
            simVideoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleRestart = () => {
        if (!realVideoRef.current || !simVideoRef.current) return;

        realVideoRef.current.currentTime = 0;
        simVideoRef.current.currentTime = 0;
        realVideoRef.current.play();
        simVideoRef.current.play();
        setIsPlaying(true);
    };

    // Sync simulation video to real video
    useEffect(() => {
        if (simVideoRef.current && realVideoRef.current) {
            const diff = Math.abs(simVideoRef.current.currentTime - realVideoRef.current.currentTime);
            if (diff > 0.1) {
                simVideoRef.current.currentTime = realVideoRef.current.currentTime;
            }
        }
    }, [currentTime]);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl p-4 mt-4"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">
                    🔬 Physics Reconstruction
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRestart}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4 text-neutral-400" />
                    </button>
                    <button
                        onClick={handlePlayPause}
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
                    >
                        {isPlaying ? (
                            <Pause className="w-4 h-4 text-white" />
                        ) : (
                            <Play className="w-4 h-4 text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Split Screen */}
            <div className="grid grid-cols-2 gap-3">
                {/* Real Video */}
                <div className="relative rounded-xl overflow-hidden bg-black">
                    <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded bg-red-500/80 text-xs font-bold text-white">
                        AI GENERATED
                    </div>
                    <video
                        ref={realVideoRef}
                        src={realVideoUrl}
                        className="w-full h-40 object-cover"
                        muted
                        playsInline
                        loop
                    />
                    <div className="absolute bottom-2 left-2 text-xs text-white/80">
                        Gravity: <span className="text-red-400 font-bold">14.2 m/s²</span>
                    </div>
                </div>

                {/* Simulated Video */}
                <div className="relative rounded-xl overflow-hidden bg-black">
                    <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded bg-emerald-500/80 text-xs font-bold text-white">
                        PHYSICS CORRECT
                    </div>
                    <video
                        ref={simVideoRef}
                        src={simulationVideoUrl}
                        className="w-full h-40 object-cover"
                        muted
                        playsInline
                        loop
                    />
                    <div className="absolute bottom-2 left-2 text-xs text-white/80">
                        Gravity: <span className="text-emerald-400 font-bold">9.81 m/s²</span>
                    </div>
                </div>
            </div>

            {/* Violation Explanation */}
            {violationDetails && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-400 font-bold text-sm">
                            ⚠ {violationDetails.law} Violation Detected
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <span className="text-neutral-500">AI Generated:</span>
                            <span className="text-red-400 font-mono ml-2">{violationDetails.realValue}</span>
                        </div>
                        <div>
                            <span className="text-neutral-500">Should Be:</span>
                            <span className="text-emerald-400 font-mono ml-2">{violationDetails.correctValue}</span>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2">
                        {violationDetails.explanation}
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="mt-3 text-center text-xs text-neutral-500">
                Newton&apos;s Laws Never Lie • Real-time Physics Reconstruction
            </div>
        </motion.div>
    );
}
