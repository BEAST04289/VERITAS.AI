"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    FileVideo, CheckCircle, AlertTriangle, Download,
    ChevronRight, Eye, PlayCircle
} from "lucide-react";

const evidenceItems = [
    {
        title: "Ball Drop - Real",
        source: "Real Camera",
        type: "real",
        verdict: "AUTHENTIC",
        confidence: 94.2,
        gravity: 9.78,
        file: "real/ball_drop.mp4",
        thumbnail: "/simulations/gravity_correct.mp4"
    },
    {
        title: "Ball Drop - Sora",
        source: "OpenAI Sora",
        type: "ai",
        verdict: "SYNTHETIC",
        confidence: 92.1,
        gravity: 14.38,
        file: "ai_generated/sora_ball_drop.mp4",
        thumbnail: "/simulations/gravity_correct.mp4"
    },
    {
        title: "Pendulum - Real",
        source: "Real Camera",
        type: "real",
        verdict: "AUTHENTIC",
        confidence: 91.8,
        gravity: 9.83,
        file: "real/pendulum.mp4",
        thumbnail: "/simulations/pendulum_correct.mp4"
    },
    {
        title: "Pendulum - Kling",
        source: "Kling AI",
        type: "ai",
        verdict: "SYNTHETIC",
        confidence: 88.5,
        gravity: 18.76,
        file: "ai_generated/kling_pendulum.mp4",
        thumbnail: "/simulations/pendulum_correct.mp4"
    }
];

export default function EvidencePage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#0f0f12] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        <span className="text-sm">Back to Analyzer</span>
                    </Link>
                </div>

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Evidence <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Library</span>
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                        Side-by-side comparisons of real physics vs AI-generated content. See VERITAS in action.
                    </p>
                </motion.div>

                {/* Evidence Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {evidenceItems.map((item, index) => (
                        <motion.div
                            key={item.file}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden group"
                        >
                            {/* Video Preview */}
                            <div className="relative aspect-video bg-neutral-800">
                                <video
                                    src={item.thumbnail}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                    muted
                                    loop
                                    autoPlay
                                    playsInline
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                                    >
                                        <PlayCircle className="w-8 h-8 text-white" />
                                    </motion.div>
                                </div>
                                {/* Badge */}
                                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${item.type === "real"
                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                                    }`}>
                                    {item.type === "real" ? "Real Video" : "AI Generated"}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                        <p className="text-sm text-neutral-500">{item.source}</p>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${item.verdict === "AUTHENTIC"
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-red-500/10 text-red-400"
                                        }`}>
                                        {item.verdict === "AUTHENTIC"
                                            ? <CheckCircle className="w-4 h-4" />
                                            : <AlertTriangle className="w-4 h-4" />
                                        }
                                        <span className="text-sm font-medium">{item.verdict}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-800">
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Confidence</p>
                                        <p className="text-lg font-semibold text-white">{item.confidence}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Measured Gravity</p>
                                        <p className={`text-lg font-semibold ${Math.abs(item.gravity - 9.81) < 1 ? "text-green-400" : "text-red-400"
                                            }`}>
                                            {item.gravity} m/s²
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Download Reports */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 text-center"
                >
                    <FileVideo className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Download Full Analysis Report</h3>
                    <p className="text-sm text-neutral-400 mb-4">
                        Get the complete forensic report with all physics calculations
                    </p>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors">
                        <Download className="w-4 h-4" />
                        Download comparison_report.pdf
                    </button>
                </motion.div>
            </div>
        </main>
    );
}
