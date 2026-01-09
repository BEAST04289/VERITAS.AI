"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Shield, Activity, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

// Premium Design System
const COLORS = {
  bg: "#0a0a0a",
  surface: "#141414",
  surfaceHover: "#1a1a1a",
  border: "#262626",
  borderSubtle: "#1f1f1f",
  text: "#fafafa",
  textMuted: "#a1a1a1",
  textSubtle: "#525252",
  accent: "#3b82f6",
  accentMuted: "#1d4ed8",
  danger: "#ef4444",
  dangerMuted: "#991b1b",
  success: "#22c55e",
};

export default function VeritasCommandCenter() {
  const [status, setStatus] = useState<"idle" | "analyzing" | "verdict">("idle");
  const [verdict, setVerdict] = useState<"synthetic" | "authentic" | null>(null);

  const handleDemo = () => {
    setStatus("analyzing");
    setTimeout(() => {
      setStatus("verdict");
      setVerdict("synthetic");
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#0f0f12] pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">VERITAS</h1>
              <p className="text-xs text-neutral-500">Physics Verification Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Engine Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Gemini Connected</span>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-4">

          {/* Video Upload Area */}
          <motion.div
            className="col-span-8 aspect-video rounded-2xl border border-neutral-800 bg-neutral-900/50 relative overflow-hidden group cursor-pointer"
            whileHover={{ borderColor: "#3b82f6" }}
            transition={{ duration: 0.2 }}
            onClick={handleDemo}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {status === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-neutral-800/50 border border-neutral-700 flex items-center justify-center mb-4 group-hover:border-blue-500/50 transition-colors">
                      <Upload className="w-6 h-6 text-neutral-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <p className="text-sm text-neutral-500 mb-1">Drop video to analyze</p>
                    <p className="text-xs text-neutral-600">or click to run demo</p>
                  </motion.div>
                )}

                {status === "analyzing" && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center"
                  >
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                    <p className="text-sm text-neutral-400">Analyzing physics...</p>
                  </motion.div>
                )}

                {status === "verdict" && verdict === "synthetic" && (
                  <motion.div
                    key="verdict"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4"
                    >
                      <AlertTriangle className="w-10 h-10 text-red-500" />
                    </motion.div>
                    <p className="text-2xl font-semibold text-red-400 mb-1">SYNTHETIC</p>
                    <p className="text-sm text-neutral-500">AI-generated content detected</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />
          </motion.div>

          {/* Right Panel */}
          <div className="col-span-4 space-y-4">

            {/* Physics Data */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-neutral-500" />
                <h3 className="text-sm font-medium text-neutral-400">Physics Analysis</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">Gravity (g)</span>
                  <span className="text-sm font-mono text-red-400">14.2 m/s²</span>
                </div>
                <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: status !== "idle" ? "85%" : "0%" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Expected: 9.8</span>
                  <span>Deviation: +45%</span>
                </div>
              </div>
            </div>

            {/* System Log */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 h-48">
              <h3 className="text-sm font-medium text-neutral-400 mb-4">System Log</h3>
              <div className="font-mono text-xs space-y-2 text-neutral-500">
                <p className="opacity-50">Initializing trajectory fit...</p>
                <p className="opacity-70">Object tracking: Subject #1</p>
                <p className="text-yellow-500/80">Parabolic anomaly detected</p>
                <p className="text-red-400">Gravity violation: +45%</p>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="col-span-12 grid grid-cols-4 gap-4">
            {[
              { label: "Confidence", value: "99.8%", color: "text-red-400" },
              { label: "Frames Analyzed", value: "847", color: "text-neutral-300" },
              { label: "Objects Tracked", value: "3", color: "text-neutral-300" },
              { label: "Processing Time", value: "2.4s", color: "text-neutral-300" },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-4">
                <p className="text-xs text-neutral-500 mb-1">{stat.label}</p>
                <p className={`text-xl font-semibold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}
