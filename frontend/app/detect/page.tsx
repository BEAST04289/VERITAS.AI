"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Video, Image, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export default function DetectPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Physics-First Detection</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        Choose Your{" "}
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Detection Mode
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        VERITAS uses Newtonian Physics + Gemini 3 to expose AI-generated content.
                        Select your media type below.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Video Detector Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href="/">
                            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 cursor-pointer overflow-hidden">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Video className="w-8 h-8 text-white" />
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded-full">LIVE</span>
                                        <span className="bg-purple-500/20 text-purple-400 text-xs font-medium px-2 py-1 rounded-full">Gemini 3</span>
                                    </div>

                                    <h2 className="text-2xl font-bold mb-3">Video Deepfake Detector</h2>
                                    <p className="text-slate-400 mb-6">
                                        Analyze videos for physics violations: gravity anomalies, shadow inconsistencies,
                                        momentum errors, and more. Get frame-by-frame forensic reports.
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-4 h-4" />
                                            <span>96.4% Accuracy</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Zap className="w-4 h-4" />
                                            <span>3.2s Analysis</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-purple-400 font-medium group-hover:gap-4 transition-all">
                                        <span>Start Analyzing</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Image Detector Card - Coming Soon */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href="/detect/image">
                            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500 cursor-pointer overflow-hidden">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Image className="w-8 h-8 text-white" />
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-amber-500/20 text-amber-400 text-xs font-medium px-2 py-1 rounded-full animate-pulse">COMING SOON</span>
                                        <span className="bg-blue-500/20 text-blue-400 text-xs font-medium px-2 py-1 rounded-full">Premium</span>
                                    </div>

                                    <h2 className="text-2xl font-bold mb-3">AI Image Detector</h2>
                                    <p className="text-slate-400 mb-6">
                                        Detect AI-generated images using shadow geometry analysis, reflection consistency
                                        checks, and pixel-level artifact detection. Coming Q1 2027.
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-4 h-4" />
                                            <span>Shadow Analysis</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Zap className="w-4 h-4" />
                                            <span>Reflection Check</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-blue-400 font-medium group-hover:gap-4 transition-all">
                                        <span>Preview Coming Soon</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-16"
                >
                    <Link href="/pricing">
                        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                            <Sparkles className="w-5 h-5" />
                            View Pricing Plans
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
