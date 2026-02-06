"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X } from "lucide-react";

interface UserConfirmationModalProps {
    isOpen: boolean;
    question: string;
    options: string[];
    onConfirm: (response: string) => void;
    onClose: () => void;
}

export function UserConfirmationModal({
    isOpen,
    question,
    options,
    onConfirm,
    onClose
}: UserConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative max-w-md w-full mx-4 rounded-2xl border border-blue-500/30 bg-neutral-900/95 p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center"
                        >
                            <HelpCircle className="w-8 h-8 text-blue-400" />
                        </motion.div>
                    </div>

                    {/* Question */}
                    <h3 className="text-lg font-semibold text-white text-center mb-2">
                        VERITAS needs your input
                    </h3>
                    <p className="text-sm text-neutral-400 text-center mb-6">
                        {question}
                    </p>

                    {/* Options */}
                    <div className="grid gap-2">
                        {options.map((option) => (
                            <motion.button
                                key={option}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onConfirm(option)}
                                className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-blue-500/50 text-white text-sm font-medium transition-all"
                            >
                                {option}
                            </motion.button>
                        ))}
                    </div>

                    {/* Skip Option */}
                    <button
                        onClick={onClose}
                        className="w-full mt-4 py-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                    >
                        Skip - let VERITAS decide
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
