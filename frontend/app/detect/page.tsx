"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Video, Image, ArrowRight, Shield, Zap } from "lucide-react";

export default function DetectPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="container mx-auto px-6 py-20 max-w-5xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
                        Choose Detection Mode
                    </h1>
                    <p className="text-neutral-500 max-w-xl mx-auto">
                        Physics-first detection powered by Gemini 3
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Video Detector */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Link href="/">
                            <div className="group bg-neutral-900/50 border border-neutral-800 hover:border-purple-500/50 rounded-2xl p-6 transition-all cursor-pointer">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                        <Video className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">LIVE</span>
                                        <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">Gemini 3</span>
                                    </div>
                                </div>

                                <h2 className="text-xl font-semibold mb-2">Video Deepfake Detector</h2>
                                <p className="text-neutral-500 text-sm mb-4">
                                    Analyze videos for physics violations: gravity, shadows, momentum, and more.
                                </p>

                                <div className="flex items-center gap-4 text-xs text-neutral-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3.5 h-3.5" />
                                        <span>96.4% Accuracy</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Zap className="w-3.5 h-3.5" />
                                        <span>3.2s Analysis</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-purple-400 text-sm font-medium group-hover:gap-3 transition-all">
                                    <span>Start Analyzing</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Image Detector - Coming Soon */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href="/detect/image">
                            <div className="group bg-neutral-900/50 border border-neutral-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all cursor-pointer">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                        <Image className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">COMING SOON</span>
                                </div>

                                <h2 className="text-xl font-semibold mb-2">AI Image Detector</h2>
                                <p className="text-neutral-500 text-sm mb-4">
                                    Detect AI-generated images using shadow analysis and pixel forensics. Q1 2027.
                                </p>

                                <div className="flex items-center gap-4 text-xs text-neutral-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3.5 h-3.5" />
                                        <span>Shadow Analysis</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Zap className="w-3.5 h-3.5" />
                                        <span>Pixel Forensics</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                                    <span>Preview</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Link href="/pricing">
                        <button className="text-neutral-500 hover:text-white text-sm transition-colors">
                            View Pricing →
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
