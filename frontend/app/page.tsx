"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Activity, AlertTriangle, Loader2, MessageSquare, Zap } from "lucide-react";

export default function VeritasCommandCenter() {
  const [status, setStatus] = useState<"idle" | "analyzing" | "interrogating" | "verdict">("idle");
  const [verdict, setVerdict] = useState<"synthetic" | "authentic" | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [gravity, setGravity] = useState(9.8);
  const [confidence, setConfidence] = useState(0);

  const runDemo = () => {
    if (status !== "idle") return;

    setStatus("analyzing");
    setMessages([]);
    setGravity(9.8);
    setConfidence(0);

    // Stage 1: Analysis messages
    const analysisMessages = [
      { role: "system", content: "INITIATING PHYSICS SCAN", delay: 500 },
      { role: "agent", content: "Tracking primary object...", delay: 1200 },
      { role: "agent", content: "Extracting trajectory data...", delay: 2000 },
      { role: "agent", content: "Fitting parabolic model...", delay: 2800 },
    ];

    analysisMessages.forEach(({ role, content, delay }) => {
      setTimeout(() => {
        setMessages(prev => [...prev, { role, content }]);
      }, delay);
    });

    // Stage 2: Physics anomaly detected
    setTimeout(() => {
      setGravity(14.2);
      setMessages(prev => [...prev,
      { role: "system", content: "⚠ ANOMALY DETECTED" },
      { role: "agent", content: "Calculated gravity: 14.2 m/s²" },
      { role: "agent", content: "Expected: 9.8 m/s² (Earth standard)" },
      { role: "agent", content: "Deviation: +45%" },
      ]);
    }, 3500);

    // Stage 3: Verdict
    setTimeout(() => {
      setStatus("verdict");
      setVerdict("synthetic");
      setConfidence(99.8);
      setMessages(prev => [...prev,
      { role: "system", content: "VERDICT: SYNTHETIC" },
      ]);
    }, 5000);
  };

  const resetDemo = () => {
    setStatus("idle");
    setVerdict(null);
    setMessages([]);
    setGravity(9.8);
    setConfidence(0);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#0f0f12] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="relative flex items-baseline">
              <motion.h1
                className="text-2xl font-semibold tracking-tight"
                style={{
                  background: "linear-gradient(90deg, #4a4a4a 0%, #ffffff 50%, #4a4a4a 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                VERITAS
              </motion.h1>
              <motion.span
                className="relative ml-0.5 text-2xl text-blue-400"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  textShadow: [
                    "0 0 2px rgba(96, 165, 250, 0.2)",
                    "0 0 8px rgba(96, 165, 250, 0.4)",
                    "0 0 2px rgba(96, 165, 250, 0.2)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                .
              </motion.span>
              <span className="text-2xl font-semibold tracking-tight text-neutral-500">AI</span>
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

          {/* Video Area */}
          <motion.div
            className="col-span-8 aspect-video rounded-2xl border border-neutral-800 bg-neutral-900/50 relative overflow-hidden cursor-pointer"
            whileHover={{ borderColor: status === "idle" ? "#3b82f6" : "#262626" }}
            onClick={status === "idle" ? runDemo : status === "verdict" ? resetDemo : undefined}
          >
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-neutral-800/50 border border-neutral-700 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-neutral-500" />
                  </div>
                  <p className="text-sm text-neutral-500 mb-1">Drop video to analyze</p>
                  <p className="text-xs text-neutral-600">or click to run demo</p>
                </motion.div>
              )}

              {status === "analyzing" && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                  <p className="text-sm text-neutral-400">Analyzing physics...</p>
                  <p className="text-xs text-neutral-600 mt-1">Tracking trajectory data</p>
                </motion.div>
              )}

              {status === "verdict" && verdict === "synthetic" && (
                <motion.div
                  key="verdict"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mb-6"
                  >
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold text-red-400 mb-2"
                  >
                    SYNTHETIC
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-neutral-500"
                  >
                    AI-generated content detected • Click to reset
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex gap-8 mt-8"
                  >
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{confidence}%</p>
                      <p className="text-xs text-neutral-500">Confidence</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-400">{gravity} m/s²</p>
                      <p className="text-xs text-neutral-500">Detected G</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
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
                <Zap className="w-4 h-4 text-neutral-500" />
                <h3 className="text-sm font-medium text-neutral-400">Physics Analysis</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">Gravity (g)</span>
                  <span className={`text-sm font-mono ${gravity > 10 ? "text-red-400" : "text-neutral-400"}`}>
                    {gravity.toFixed(1)} m/s²
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${gravity > 10 ? "bg-gradient-to-r from-yellow-500 to-red-500" : "bg-blue-500"}`}
                    animate={{ width: status !== "idle" ? `${Math.min((gravity / 20) * 100, 100)}%` : "0%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Earth: 9.8</span>
                  <span className={gravity > 10 ? "text-red-400" : ""}>
                    {gravity > 10 ? `+${((gravity - 9.8) / 9.8 * 100).toFixed(0)}% deviation` : "Normal"}
                  </span>
                </div>
              </div>
            </div>

            {/* Agent Console */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 h-64 flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-neutral-400">Agent Console</span>
                {status !== "idle" && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-blue-500 ml-auto"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`
                        ${msg.role === "system" ? "text-yellow-500 font-semibold" : ""}
                        ${msg.role === "agent" ? "text-neutral-400" : ""}
                      `}
                    >
                      {msg.role === "agent" && <span className="text-neutral-600 mr-2">{">"}</span>}
                      {msg.role === "system" && <span className="text-yellow-600 mr-2">{"!"}</span>}
                      {msg.content}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {messages.length === 0 && (
                  <p className="text-neutral-600 italic">Waiting for analysis...</p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="col-span-12 grid grid-cols-4 gap-4 mt-2">
            {[
              { label: "Confidence", value: confidence > 0 ? `${confidence}%` : "—", color: confidence > 0 ? "text-red-400" : "text-neutral-600" },
              { label: "Frames Analyzed", value: status !== "idle" ? "847" : "—", color: "text-neutral-300" },
              { label: "Objects Tracked", value: status !== "idle" ? "1" : "—", color: "text-neutral-300" },
              { label: "Processing Time", value: status === "verdict" ? "4.2s" : "—", color: "text-neutral-300" },
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
