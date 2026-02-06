"use client";

import React from "react";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Link2, Share2 } from "lucide-react";

interface ShareButtonsProps {
    verdict: "synthetic" | "authentic" | string;
    confidence: number;
}

export function ShareButtons({ verdict, confidence }: ShareButtonsProps) {
    const isSynthetic = verdict.toLowerCase() === "synthetic";

    const shareText = isSynthetic
        ? `🚨 VERITAS.AI detected a FAKE video with ${confidence.toFixed(1)}% confidence using physics analysis. AI can't fake Newton! #VERITAS #DeepfakeDetection #AI`
        : `✅ VERITAS.AI verified this video as AUTHENTIC (${confidence.toFixed(1)}% confidence) using physics laws. #VERITAS #AIVerification`;

    const shareUrl = typeof window !== "undefined" ? window.location.href : "https://veritas.ai";

    const handleTwitterShare = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank", "width=550,height=420");
    };

    const handleLinkedInShare = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank", "width=550,height=420");
    };

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 mr-1">Share:</span>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleTwitterShare}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-[#1DA1F2] text-neutral-400 hover:text-white transition-all"
                title="Share on Twitter/X"
            >
                <Twitter className="w-4 h-4" />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLinkedInShare}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-[#0A66C2] text-neutral-400 hover:text-white transition-all"
                title="Share on LinkedIn"
            >
                <Linkedin className="w-4 h-4" />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all"
                title="Copy link"
            >
                <Link2 className="w-4 h-4" />
            </motion.button>
        </div>
    );
}
