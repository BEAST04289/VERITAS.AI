"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Apple, Zap, Sun, Move, Boxes, RefreshCcw,
    ArrowRight, Play, Shield, Brain, ChevronRight
} from "lucide-react";

const physicsLaws = [
    {
        icon: Apple,
        name: "Gravity",
        equation: "y = v₀t - ½gt²",
        description: "AI videos often have objects falling 15-50% faster or slower than Earth's gravity (9.81 m/s²).",
        detection: "If g ≠ 9.81 m/s² → FAKE",
        color: "from-red-500 to-orange-500"
    },
    {
        icon: Zap,
        name: "Momentum",
        equation: "p₁ + p₂ = p₁' + p₂'",
        description: "In collisions, AI fails to conserve momentum - objects gain or lose energy impossibly.",
        detection: "Momentum violated → FAKE",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: Sun,
        name: "Shadows",
        equation: "θ₁ = θ₂ = θₙ",
        description: "AI often renders multiple shadow directions, revealing multiple impossible light sources.",
        detection: "Shadow angles don't align → FAKE",
        color: "from-yellow-500 to-amber-500"
    },
    {
        icon: Move,
        name: "Reflection",
        equation: "θᵢ = θᵣ",
        description: "Mirror and water reflections often don't match the actual object positions in AI videos.",
        detection: "Reflection mismatch → FAKE",
        color: "from-purple-500 to-pink-500"
    },
    {
        icon: Boxes,
        name: "Material",
        equation: "E = ½mv²",
        description: "Glass that doesn't shatter, rubber that doesn't bounce - AI fails material physics.",
        detection: "Impossible material behavior → FAKE",
        color: "from-green-500 to-emerald-500"
    },
    {
        icon: RefreshCcw,
        name: "Pendulum",
        equation: "T = 2π√(L/g)",
        description: "AI pendulums swing at wrong speeds - the period doesn't match the length.",
        detection: "Period deviation → FAKE",
        color: "from-indigo-500 to-violet-500"
    }
];

const pipelineSteps = [
    { step: 1, title: "Video Upload", description: "User uploads suspicious video" },
    { step: 2, title: "Object Tracking", description: "Gemini 3 identifies and tracks moving objects" },
    { step: 3, title: "Trajectory Extraction", description: "Extract position data (x, y, t)" },
    { step: 4, title: "Physics Analysis", description: "Apply 6 physics laws to verify motion" },
    { step: 5, title: "Pattern Matching", description: "Compare against known fake signatures" },
    { step: 6, title: "Verdict", description: "AUTHENTIC or SYNTHETIC with confidence score" }
];

export default function HowItWorksPage() {
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
                    <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-neutral-500">Powered by Gemini 3</span>
                    </div>
                </div>

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">VERITAS</span> Works
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                        AI can fake pixels. It cannot fake Newton. We use the laws of physics to expose AI-generated videos.
                    </p>
                </motion.div>

                {/* Pipeline */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-20"
                >
                    <h2 className="text-2xl font-semibold mb-8 text-center">Analysis Pipeline</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {pipelineSteps.map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="relative p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 text-center"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
                                    <span className="text-sm font-bold text-blue-400">{item.step}</span>
                                </div>
                                <h3 className="text-sm font-medium text-white mb-1">{item.title}</h3>
                                <p className="text-xs text-neutral-500">{item.description}</p>
                                {index < pipelineSteps.length - 1 && (
                                    <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* 6 Laws */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-20"
                >
                    <h2 className="text-2xl font-semibold mb-8 text-center">The 6 Laws of VERITAS</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {physicsLaws.map((law, index) => (
                            <motion.div
                                key={law.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ scale: 1.02 }}
                                className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${law.color} flex items-center justify-center mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}>
                                    <law.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{law.name}</h3>
                                <code className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded mb-3 inline-block">
                                    {law.equation}
                                </code>
                                <p className="text-sm text-neutral-400 mb-3">{law.description}</p>
                                <div className="text-xs text-red-400 font-mono">
                                    → {law.detection}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <Link href="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors"
                        >
                            <Play className="w-5 h-5" />
                            Try VERITAS Now
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
