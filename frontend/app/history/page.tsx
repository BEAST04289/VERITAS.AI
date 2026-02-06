"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    History, CheckCircle, AlertTriangle, Download,
    ChevronRight, Calendar, Clock, TrendingUp, Filter
} from "lucide-react";

const analysisHistory = [
    {
        id: "analysis_001",
        filename: "suspect_video_01.mp4",
        date: "2026-02-06T21:30:00Z",
        verdict: "SYNTHETIC",
        confidence: 92.1,
        gravity: 14.38,
        violations: 2,
        matchedSignature: "OpenAI Sora"
    },
    {
        id: "analysis_002",
        filename: "street_footage.mp4",
        date: "2026-02-06T19:15:00Z",
        verdict: "AUTHENTIC",
        confidence: 96.4,
        gravity: 9.82,
        violations: 0,
        matchedSignature: null
    },
    {
        id: "analysis_003",
        filename: "falling_objects.mp4",
        date: "2026-02-05T14:22:00Z",
        verdict: "SYNTHETIC",
        confidence: 88.7,
        gravity: 12.94,
        violations: 3,
        matchedSignature: "Kling AI"
    },
    {
        id: "analysis_004",
        filename: "pendulum_demo.mp4",
        date: "2026-02-05T10:45:00Z",
        verdict: "AUTHENTIC",
        confidence: 94.2,
        gravity: 9.78,
        violations: 0,
        matchedSignature: null
    }
];

export default function HistoryPage() {
    const totalAnalyzed = analysisHistory.length;
    const syntheticCount = analysisHistory.filter(a => a.verdict === "SYNTHETIC").length;
    const authenticCount = analysisHistory.filter(a => a.verdict === "AUTHENTIC").length;
    const avgConfidence = (analysisHistory.reduce((sum, a) => sum + a.confidence, 0) / totalAnalyzed).toFixed(1);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

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
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Analysis <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">History</span>
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                        Track your past analyses. VERITAS learns from every video to improve detection.
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
                >
                    <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 text-center">
                        <History className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{totalAnalyzed}</p>
                        <p className="text-xs text-neutral-500">Total Analyzed</p>
                    </div>
                    <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 text-center">
                        <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-red-400">{syntheticCount}</p>
                        <p className="text-xs text-neutral-500">Fakes Detected</p>
                    </div>
                    <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 text-center">
                        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-400">{authenticCount}</p>
                        <p className="text-xs text-neutral-500">Authentic</p>
                    </div>
                    <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 text-center">
                        <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-400">{avgConfidence}%</p>
                        <p className="text-xs text-neutral-500">Avg Confidence</p>
                    </div>
                </motion.div>

                {/* History List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recent Analyses</h2>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-700 text-sm text-neutral-400 hover:text-white transition-colors">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>

                    {analysisHistory.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className="flex items-center gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors cursor-pointer"
                        >
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.verdict === "SYNTHETIC"
                                    ? "bg-red-500/10 border border-red-500/30"
                                    : "bg-green-500/10 border border-green-500/30"
                                }`}>
                                {item.verdict === "SYNTHETIC"
                                    ? <AlertTriangle className="w-5 h-5 text-red-400" />
                                    : <CheckCircle className="w-5 h-5 text-green-400" />
                                }
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{item.filename}</p>
                                <div className="flex items-center gap-3 text-xs text-neutral-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(item.date)}
                                    </span>
                                    {item.matchedSignature && (
                                        <span className="text-red-400">
                                            Matched: {item.matchedSignature}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="text-right">
                                <p className={`text-sm font-semibold ${item.verdict === "SYNTHETIC" ? "text-red-400" : "text-green-400"
                                    }`}>
                                    {item.verdict}
                                </p>
                                <p className="text-xs text-neutral-500">{item.confidence}% confidence</p>
                            </div>

                            {/* Download */}
                            <button className="p-2 rounded-lg border border-neutral-700 hover:border-blue-500/50 transition-colors">
                                <Download className="w-4 h-4 text-neutral-400" />
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </main>
    );
}
