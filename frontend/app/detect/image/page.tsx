"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Image, ArrowLeft, Sparkles, Lock, Bell, Zap, Shield, Star } from "lucide-react";

export default function ImageDetectorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
                />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Back Button */}
                <Link href="/detect">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Detection Modes
                    </motion.button>
                </Link>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto text-center">
                    {/* Floating Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full px-5 py-2 mb-8"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-5 h-5 text-amber-400" />
                        </motion.div>
                        <span className="text-amber-300 font-medium">Premium Feature</span>
                    </motion.div>

                    {/* Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="relative inline-block mb-8"
                    >
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30">
                            <Image className="w-16 h-16 text-white" />
                        </div>
                        {/* Orbiting Elements */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                        >
                            <div className="absolute -top-2 left-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                            <div className="absolute top-1/2 -right-2 w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50" />
                            <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
                        </motion.div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Coming Soon
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto"
                    >
                        AI Image Detection powered by shadow geometry analysis, reflection consistency checks,
                        and pixel-level artifact detection. Launching <span className="text-white font-semibold">Q1 2027</span>.
                    </motion.p>

                    {/* Feature Preview Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid md:grid-cols-3 gap-6 mb-12"
                    >
                        {[
                            { icon: Shield, title: "Shadow Geometry", desc: "Analyze light source consistency" },
                            { icon: Zap, title: "Pixel Forensics", desc: "Detect compression artifacts" },
                            { icon: Star, title: "Style Transfer", desc: "Identify AI art signatures" },
                        ].map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                            >
                                <feature.icon className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-400">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Email Signup */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 max-w-xl mx-auto"
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Bell className="w-5 h-5 text-purple-400" />
                            <span className="text-lg font-semibold">Get Notified on Launch</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-6">
                            Be the first to access our AI Image Detector when it launches.
                        </p>
                        <div className="flex gap-3">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105">
                                Notify Me
                            </button>
                        </div>
                    </motion.div>

                    {/* Lock Badge */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-12 flex items-center justify-center gap-2 text-slate-500"
                    >
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">Premium Feature • Patent Pending Technology</span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
