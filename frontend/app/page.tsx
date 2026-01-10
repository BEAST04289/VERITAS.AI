"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Zap, MessageSquare, AlertTriangle, CheckCircle, Loader2, Video } from "lucide-react";
import { useVeritasAnalysis } from "@/hooks/use-veritas-analysis";
import { ScanningOverlay } from "@/components/ui/scanning-overlay";
import { WaterRipple } from "@/components/ui/water-ripple";

export default function VeritasCommandCenter() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [userInput, setUserInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isConnected,
    isAnalyzing,
    messages,
    progress,
    stage,
    physics,
    verdict,
    objects,
    trajectory,
    startAnalysis,
    sendUserResponse,
    reset
  } = useVeritasAnalysis();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleAnalyze = () => {
    if (verdict) {
      // Reset for new analysis
      reset();
      setVideoFile(null);
      setVideoPreview(null);
      return;
    }
    startAnalysis();
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendUserResponse(userInput);
    setUserInput("");
    setShowQuestion(false);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#0f0f12] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
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
                  textShadow: ["0 0 2px rgba(96, 165, 250, 0.2)", "0 0 8px rgba(96, 165, 250, 0.4)", "0 0 2px rgba(96, 165, 250, 0.2)"],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >.</motion.span>
              <span className="text-2xl font-semibold tracking-tight text-neutral-500">AI</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              <span>{isConnected ? "Backend Online" : "Connecting..."}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Gemini Ready</span>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-4">

          {/* Video Area */}
          <div
            className="col-span-8 aspect-video rounded-2xl border border-neutral-800 bg-neutral-900/50 relative overflow-hidden cursor-pointer group"
            onClick={() => !isAnalyzing && !verdict && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Video Preview */}
            {videoPreview && !verdict && (
              <video
                src={videoPreview}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            )}

            {/* Scanning Overlay */}
            <ScanningOverlay
              isActive={isAnalyzing}
              progress={progress}
              stage={stage}
              objects={objects}
              trajectory={trajectory}
            />

            {/* Water Ripple for Agentic Questions */}
            <WaterRipple isActive={showQuestion} x={50} y={40} />

            <AnimatePresence mode="wait">
              {/* Idle State */}
              {!videoFile && !isAnalyzing && !verdict && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-neutral-800/50 border border-neutral-700 flex items-center justify-center mb-4 group-hover:border-blue-500/50 transition-colors">
                    <Upload className="w-6 h-6 text-neutral-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-sm text-neutral-500 mb-1">Drop any video to analyze</p>
                  <p className="text-xs text-neutral-600">Supports MP4, MOV, WebM</p>
                </motion.div>
              )}

              {/* Video Ready */}
              {videoFile && !isAnalyzing && !verdict && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/60"
                >
                  <Video className="w-10 h-10 text-blue-400 mb-4" />
                  <p className="text-sm text-neutral-300 mb-1">{videoFile.name}</p>
                  <p className="text-xs text-neutral-500 mb-4">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
                  >
                    Start Analysis
                  </button>
                </motion.div>
              )}

              {/* Analyzing */}
              {isAnalyzing && !verdict && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-black/80 rounded-full border border-neutral-700"
                >
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-neutral-300">Analyzing physics...</span>
                </motion.div>
              )}

              {/* Verdict */}
              {verdict && (
                <motion.div
                  key="verdict"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${verdict.result === "synthetic"
                      ? "bg-red-500/10 border-2 border-red-500/30"
                      : "bg-green-500/10 border-2 border-green-500/30"
                      }`}
                  >
                    {verdict.result === "synthetic"
                      ? <AlertTriangle className="w-12 h-12 text-red-500" />
                      : <CheckCircle className="w-12 h-12 text-green-500" />
                    }
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`text-4xl font-bold mb-2 ${verdict.result === "synthetic" ? "text-red-400" : "text-green-400"}`}
                  >
                    {verdict.result.toUpperCase()}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-neutral-500 mb-6"
                  >
                    {verdict.reason}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex gap-6"
                  >
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{verdict.confidence}%</p>
                      <p className="text-xs text-neutral-500">Confidence</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${physics && physics.gravity > 11 ? "text-red-400" : "text-emerald-400"}`}>
                        {(physics?.gravity || verdict.gravity).toFixed(1)} m/s²
                      </p>
                      <p className="text-xs text-neutral-500">Gravity</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${verdict.result === "synthetic" ? "text-red-400" : "text-emerald-400"}`}>
                        {verdict.violations || 0}
                      </p>
                      <p className="text-xs text-neutral-500">Violations</p>
                    </div>
                  </motion.div>
                  <button
                    onClick={handleAnalyze}
                    className="mt-8 px-6 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors"
                  >
                    Analyze Another
                  </button>
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
          </div>

          {/* Right Panel */}
          <div className="col-span-4 space-y-4">

            {/* Physics Data */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-neutral-500" />
                <h3 className="text-sm font-medium text-neutral-400">Physics Analysis</h3>
              </div>

              <div className="space-y-3">
                {/* Gravity Check */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">Gravity (g)</span>
                  <span className={`text-sm font-mono ${physics && physics.gravity > 11 ? "text-red-400" : "text-emerald-400"}`}>
                    {physics ? `${physics.gravity.toFixed(1)} m/s²` : "—"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${physics && physics.gravity > 11 ? "bg-gradient-to-r from-yellow-500 to-red-500" : "bg-emerald-500"}`}
                    animate={{ width: physics ? `${Math.min((physics.gravity / 20) * 100, 100)}%` : "0%" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Earth: 9.8</span>
                  <span className={physics && Math.abs(physics.deviation) > 15 ? "text-red-400" : "text-emerald-400"}>
                    {physics ? `${physics.deviation > 0 ? "+" : ""}${physics.deviation.toFixed(0)}% deviation` : "—"}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-800 my-2"></div>

                {/* Additional Physics Checks */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500">Shadows</span>
                    <span className={`text-xs font-mono ${physics?.checks?.shadows?.status === "VIOLATION" ? "text-red-400" : "text-emerald-400"}`}>
                      {physics?.checks?.shadows?.status === "VIOLATION" ? "✗ Multiple sources" : physics?.checks?.shadows ? "✓ Consistent" : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500">Momentum</span>
                    <span className={`text-xs font-mono ${physics?.checks?.momentum?.status === "VIOLATION" ? "text-red-400" : "text-emerald-400"}`}>
                      {physics?.checks?.momentum?.status === "VIOLATION" ? "✗ Conservation error" : physics?.checks?.momentum ? "✓ Conserved" : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500">Reflection</span>
                    <span className={`text-xs font-mono ${physics?.checks?.reflection?.status === "VIOLATION" ? "text-red-400" : "text-emerald-400"}`}>
                      {physics?.checks?.reflection?.status === "VIOLATION" ? "✗ Mismatch" : physics?.checks?.reflection ? "✓ Valid" : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500">Material</span>
                    <span className={`text-xs font-mono ${physics?.checks?.material?.status === "VIOLATION" ? "text-red-400" : "text-emerald-400"}`}>
                      {physics?.checks?.material?.status === "VIOLATION" ? "✗ Inconsistent" : physics?.checks?.material ? "✓ Valid" : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Console */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 h-72 flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-neutral-400">Agent Console</span>
                {isAnalyzing && (
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
                      className={`
                        ${msg.level === "system" ? "text-yellow-500 font-semibold" : ""}
                        ${msg.level === "agent" ? "text-neutral-400" : ""}
                        ${msg.level === "user" ? "text-blue-400" : ""}
                      `}
                    >
                      {msg.level === "agent" && <span className="text-neutral-600 mr-2">{">"}</span>}
                      {msg.level === "system" && <span className="text-yellow-600 mr-2">{"!"}</span>}
                      {msg.level === "user" && <span className="text-blue-600 mr-2">{"$"}</span>}
                      {msg.message}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {messages.length === 0 && (
                  <p className="text-neutral-600 italic">Waiting for video...</p>
                )}

                {/* Agentic Question Input */}
                {showQuestion && (
                  <form onSubmit={handleQuestionSubmit} className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Your answer..."
                      autoFocus
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-blue-600 rounded text-xs">
                      Send
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="col-span-12 grid grid-cols-4 gap-4 mt-2">
            {[
              { label: "Confidence", value: verdict ? `${verdict.confidence}%` : "—", color: verdict?.result === "synthetic" ? "text-red-400" : "text-neutral-300" },
              { label: "Objects Tracked", value: objects.length > 0 ? objects.length.toString() : "—", color: "text-neutral-300" },
              { label: "Trajectory Points", value: trajectory.length > 0 ? trajectory.length.toString() : "—", color: "text-neutral-300" },
              { label: "Analysis Stage", value: stage ? stage.replace("_", " ").toUpperCase() : "IDLE", color: "text-neutral-300" },
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
