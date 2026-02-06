"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ChevronRight, Github, Linkedin, Twitter, Mail,
    Shield, Brain, Zap, Scale, Target, Trophy
} from "lucide-react";

const teamMembers = [
    {
        name: "Shaurya",
        role: "Founder & Developer",
        bio: "Building AI tools that detect AI. Physics enthusiast.",
        avatar: "🧑‍💻",
        links: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com"
        }
    }
];

const techHighlights = [
    {
        icon: Brain,
        title: "Gemini 3 Reasoning",
        description: "Advanced chain-of-thought for physics deduction"
    },
    {
        icon: Scale,
        title: "6 Physics Laws",
        description: "Gravity, momentum, shadows, reflection, material, pendulum"
    },
    {
        icon: Zap,
        title: "Real-time Analysis",
        description: "WebSocket streaming with live thinking logs"
    },
    {
        icon: Target,
        title: "Learning Loop",
        description: "ChromaDB stores fake signatures for future detection"
    }
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#0f0f12] pointer-events-none" />

            <div className="relative max-w-4xl mx-auto px-6 py-12">
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
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center"
                    >
                        <Shield className="w-10 h-10 text-blue-400" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">VERITAS.AI</span>
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                        Physics-based AI video detection. Because AI can fake pixels, but it cannot fake Newton.
                    </p>
                </motion.div>

                {/* Mission */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        Our Mission
                    </h2>
                    <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
                        <p className="text-neutral-300 leading-relaxed">
                            In a world where AI-generated content is becoming indistinguishable from reality,
                            VERITAS provides a scientific approach to truth verification. By analyzing videos
                            against the fundamental laws of physics, we detect impossible motion, incorrect
                            shadows, and material behavior that breaks Newton's laws — fingerprints that AI
                            video generators leave behind.
                        </p>
                    </div>
                </motion.section>

                {/* Tech Highlights */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-semibold mb-6">Technology</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {techHighlights.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 flex items-start gap-4"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">{item.title}</h3>
                                    <p className="text-sm text-neutral-500">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Team */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-semibold mb-6">Team</h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {teamMembers.map((member) => (
                            <motion.div
                                key={member.name}
                                whileHover={{ scale: 1.02 }}
                                className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 text-center w-64"
                            >
                                <div className="text-5xl mb-4">{member.avatar}</div>
                                <h3 className="font-semibold text-white text-lg">{member.name}</h3>
                                <p className="text-sm text-blue-400 mb-2">{member.role}</p>
                                <p className="text-xs text-neutral-500 mb-4">{member.bio}</p>
                                <div className="flex justify-center gap-2">
                                    <a href={member.links.github} target="_blank" rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors">
                                        <Github className="w-4 h-4" />
                                    </a>
                                    <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors">
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                    <a href={member.links.twitter} target="_blank" rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors">
                                        <Twitter className="w-4 h-4" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Hackathon Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10"
                >
                    <div className="text-4xl mb-3">🏆</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Gemini 3 Hackathon Submission</h3>
                    <p className="text-sm text-neutral-400">
                        Built with Google Gemini 3 Experimental (gemini-exp-1206) for advanced reasoning capabilities.
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
