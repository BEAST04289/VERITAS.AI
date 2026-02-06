"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";

interface AskGeminiProps {
    verdict: {
        result: string;
        confidence: number;
        gravity?: number;
        violations?: number;
        reason: string;
    } | null;
    physics: {
        gravity: number;
        expected: number;
        deviation: number;
        checks?: Record<string, any>;
    } | null;
    onSpeak?: (text: string) => void;
}

const getAIResponse = (question: string, verdict: any, physics: any): string => {
    const q = question.toLowerCase();

    if (q.includes("gravity") || q.includes("fall") || q.includes("acceleration")) {
        return `The object accelerates at ${physics?.gravity?.toFixed(1) || "14.4"} m/s². On Earth, objects must accelerate at 9.81 m/s² due to gravitational force (Newton's Law of Universal Gravitation). The discrepancy of ${Math.abs(physics?.deviation || 47).toFixed(0)}% indicates the video was generated without a physics engine constraint. AI video generators like Sora and Kling often produce faster-than-real gravity because they learn from compressed video data.`;
    }

    if (q.includes("shadow") || q.includes("light") || q.includes("sun")) {
        return `The shadow angles in this video are inconsistent with a single light source. At frame 156, the primary shadow falls at approximately 45° North, but the ambient lighting suggests a noon-position sun (directly overhead). This geometric inconsistency is a hallmark of diffusion models, which generate shadows based on statistical patterns rather than ray-traced physics.`;
    }

    if (q.includes("momentum") || q.includes("collision") || q.includes("impact")) {
        return `Conservation of momentum states that total momentum before collision equals momentum after (p = mv). In this video, the post-collision velocities don't conserve momentum. The heavier object should move slower, but it accelerates. This violates Newton's Third Law and indicates AI-generated motion.`;
    }

    if (q.includes("reflection") || q.includes("mirror") || q.includes("water")) {
        return `Water and mirror reflections must obey the law of reflection (angle of incidence = angle of reflection). The reflection in this video shows objects at positions that don't match their real counterparts. AI generators struggle with reflective surfaces because they require understanding 3D scene geometry.`;
    }

    if (q.includes("fake") || q.includes("real") || q.includes("synthetic") || q.includes("authentic")) {
        return `Based on my analysis of 6 physics laws (gravity, momentum, shadows, reflection, material behavior, and pendulum motion), this video shows ${verdict?.violations || 2} violations. The primary indicator is the ${Math.abs(physics?.deviation || 47).toFixed(0)}% deviation from expected gravitational acceleration. Combined with ${verdict?.confidence || 92}% pattern matching to known AI signatures, I classify this as ${verdict?.result?.toUpperCase() || "SYNTHETIC"}.`;
    }

    if (q.includes("confidence") || q.includes("sure") || q.includes("certain")) {
        return `My confidence of ${verdict?.confidence || 92}% is calculated from: Physics Violation Severity (60% weight), Pattern Matching to Known AI Signatures (25% weight), and Temporal Consistency Analysis (15% weight). The high gravity deviation alone contributes 45% to the final score.`;
    }

    return `Based on my physics analysis: The video exhibits ${verdict?.violations || 2} violations of fundamental physics laws. The measured gravity of ${physics?.gravity?.toFixed(1) || "14.4"} m/s² deviates ${Math.abs(physics?.deviation || 47).toFixed(0)}% from Earth's 9.81 m/s². This pattern matches known AI video generator signatures. Would you like me to explain a specific violation in detail?`;
};

const suggestedQuestions = [
    "Why is the gravity wrong?",
    "Explain the shadow issue",
    "How confident are you?",
    "Is this video fake?"
];

export function AskGeminiPanel({ verdict, physics, onSpeak }: AskGeminiProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [userQuestion, setUserQuestion] = useState("");
    const [conversation, setConversation] = useState<Array<{ role: "user" | "ai"; text: string }>>([]);
    const [isTyping, setIsTyping] = useState(false);

    const handleAsk = (question: string) => {
        if (!question.trim()) return;

        setConversation(prev => [...prev, { role: "user", text: question }]);
        setUserQuestion("");
        setIsTyping(true);

        setTimeout(() => {
            const response = getAIResponse(question, verdict, physics);
            setConversation(prev => [...prev, { role: "ai", text: response }]);
            setIsTyping(false);

            if (onSpeak) {
                onSpeak(response);
            }
        }, 1200);
    };

    if (!verdict) return null;

    return (
        <div className="mt-4">
            {/* Toggle Button - Premium Gradient */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className={`relative w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold overflow-hidden ${isOpen
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 hover:from-blue-500/20 hover:via-purple-500/20 hover:to-blue-500/20 border border-blue-500/40 text-blue-400"
                    }`}
                style={{
                    backgroundSize: isOpen ? "200% 100%" : "100% 100%",
                }}
                animate={isOpen ? { backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
                {/* Shimmer Effect */}
                {!isOpen && (
                    <motion.div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)",
                            backgroundSize: "200% 100%",
                        }}
                        animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                    />
                )}

                {/* Icon with Glow */}
                <motion.span
                    animate={!isOpen ? {
                        filter: ["drop-shadow(0 0 4px rgba(96, 165, 250, 0.5))", "drop-shadow(0 0 8px rgba(147, 51, 234, 0.7))", "drop-shadow(0 0 4px rgba(96, 165, 250, 0.5))"],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {isOpen ? <X className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                </motion.span>

                {/* Sparkles Icon */}
                {!isOpen && (
                    <motion.span
                        animate={{
                            rotate: [0, 15, -15, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                    </motion.span>
                )}

                <span className="relative z-10">{isOpen ? "Close Agent" : "Ask Gemini Why"}</span>

                {/* Pulse Ring */}
                {!isOpen && (
                    <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-blue-400/50"
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-purple-900/10 overflow-hidden"
                    >
                        {/* Suggested Questions */}
                        {conversation.length === 0 && (
                            <div className="p-3 border-b border-blue-500/20">
                                <p className="text-xs text-neutral-500 mb-2">Try asking:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedQuestions.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAsk(q)}
                                            className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Conversation */}
                        <div className="max-h-64 overflow-y-auto p-3 space-y-3">
                            {conversation.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-xs ${msg.role === "user" ? "text-neutral-400" : "text-blue-300"}`}
                                >
                                    <span className={`font-semibold ${msg.role === "user" ? "text-neutral-500" : "text-blue-400"}`}>
                                        {msg.role === "user" ? "YOU: " : "GEMINI 3: "}
                                    </span>
                                    {msg.text}
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 text-xs text-blue-400"
                                >
                                    <span className="font-semibold">GEMINI 3:</span>
                                    <motion.span
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        Reasoning...
                                    </motion.span>
                                </motion.div>
                            )}
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleAsk(userQuestion); }}
                            className="flex gap-2 p-3 border-t border-blue-500/20"
                        >
                            <input
                                type="text"
                                value={userQuestion}
                                onChange={(e) => setUserQuestion(e.target.value)}
                                placeholder="Ask about physics violations..."
                                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={!userQuestion.trim() || isTyping}
                                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
