"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Image, ArrowLeft, Bell, Shield, Zap, Star, Lock } from "lucide-react";

const features = [
    { icon: Shield, title: "Shadow Geometry", desc: "Light source consistency" },
    { icon: Zap, title: "Pixel Forensics", desc: "Compression artifacts" },
    { icon: Star, title: "Style Transfer", desc: "AI art signatures" },
];

export default function ImageDetectorPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                {/* Back */}
                <Link href="/detect">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-16 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Detectors
                    </motion.button>
                </Link>

                {/* Main Content */}
                <div className="text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8"
                    >
                        <span className="text-amber-400 text-sm">Coming Soon</span>
                    </motion.div>

                    {/* Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8"
                    >
                        <Image className="w-10 h-10 text-blue-400" />
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight"
                    >
                        AI Image Detector
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-neutral-500 mb-12 max-w-lg mx-auto"
                    >
                        Shadow geometry analysis, reflection checks, and pixel forensics.
                        Launching <span className="text-white">Q1 2027</span>.
                    </motion.p>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid md:grid-cols-3 gap-4 mb-12"
                    >
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5"
                            >
                                <feature.icon className="w-6 h-6 text-neutral-400 mb-3 mx-auto" />
                                <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                                <p className="text-neutral-600 text-xs">{feature.desc}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Email Signup */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 max-w-md mx-auto"
                    >
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Bell className="w-4 h-4 text-purple-400" />
                            <span className="font-medium text-sm">Get Notified</span>
                        </div>
                        <p className="text-neutral-500 text-xs mb-4">
                            Be the first to know when we launch.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <button className="bg-purple-500 hover:bg-purple-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                Notify Me
                            </button>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-10 flex items-center justify-center gap-2 text-neutral-600 text-xs"
                    >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Premium Feature · Patent Pending</span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
