"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronDown, ChevronUp, Sparkles, Zap } from "lucide-react";

interface ThinkingLog {
    content: string;
    type: string;
    timestamp: number;
}

interface ThinkingLogsPanelProps {
    logs: ThinkingLog[];
    isVisible: boolean;
}

function TypewriterText({ text, speed = 20 }: { text: string; speed?: number }) {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedText("");
        setIsComplete(false);
        let index = 0;

        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
            } else {
                setIsComplete(true);
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return (
        <span>
            {displayedText}
            {!isComplete && (
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-blue-400"
                >
                    ▋
                </motion.span>
            )}
        </span>
    );
}

export function ThinkingLogsPanel({ logs, isVisible }: ThinkingLogsPanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    if (!isVisible || logs.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5 p-4 backdrop-blur-sm"
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between mb-3"
            >
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        <Brain className="w-4 h-4 text-blue-400" />
                    </motion.div>
                    <span className="text-sm font-medium text-blue-400">
                        Gemini 3 Reasoning Chain
                    </span>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                    </motion.div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                        LIVE
                    </span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
            </button>

            {/* Thinking Logs with Typewriter Effect */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        ref={scrollRef}
                        className="space-y-2 overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-blue-500/20"
                    >
                        {logs.map((log, index) => {
                            const isLatest = index === logs.length - 1;
                            return (
                                <motion.div
                                    key={log.timestamp}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 }}
                                    className="flex items-start gap-2 text-xs"
                                >
                                    <motion.span
                                        className="text-blue-500 font-mono mt-0.5"
                                        animate={isLatest ? { opacity: [0.5, 1, 0.5] } : {}}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        {isLatest ? "→" : "✓"}
                                    </motion.span>
                                    <div className="flex-1">
                                        <span className="text-neutral-300">
                                            {isLatest ? (
                                                <TypewriterText text={log.content} speed={15} />
                                            ) : (
                                                log.content
                                            )}
                                        </span>
                                        {log.type === "chain_of_thought" && (
                                            <span className="ml-2 text-[10px] text-purple-500/50 uppercase">
                                                reasoning
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Neural Network Animation */}
                        <motion.div
                            className="flex items-center gap-2 text-xs text-blue-400/60 pt-3 border-t border-blue-500/10"
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Zap className="w-3 h-3" />
                            <span className="font-mono">
                                Processing physics reasoning...
                            </span>
                            <div className="flex gap-0.5">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 h-3 bg-blue-500/40 rounded-full"
                                        animate={{ scaleY: [0.3, 1, 0.3] }}
                                        transition={{
                                            duration: 0.8,
                                            repeat: Infinity,
                                            delay: i * 0.1
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
