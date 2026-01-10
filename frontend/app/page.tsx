"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Zap, MessageSquare, AlertTriangle, CheckCircle, Loader2, Video, Shield, Download } from "lucide-react";
import { useVeritasAnalysis } from "@/hooks/use-veritas-analysis";
import { useKillSwitch } from "@/hooks/use-kill-switch";
import { ScanningOverlay } from "@/components/ui/scanning-overlay";
import { WaterRipple } from "@/components/ui/water-ripple";
import { TimelineScrubber } from "@/components/ui/timeline-scrubber";
import { PhysicsRadarChart } from "@/components/ui/physics-radar-chart";
import { ComparisonView } from "@/components/ui/comparison-view";
import { generateForensicReport, generateCaseId, formatTimestamp } from "@/lib/pdf-generator";

export default function VeritasCommandCenter() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [userInput, setUserInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Demo mode messages state
  const [demoMessages, setDemoMessages] = useState<Array<{ level: string; message: string }>>([]);
  const [demoPhysics, setDemoPhysics] = useState<any>(null);
  const [demoVerdict, setDemoVerdict] = useState<any>(null);
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoStage, setDemoStage] = useState("");

  const {
    isConnected,
    isAnalyzing,
    messages: liveMessages,
    progress: liveProgress,
    stage: liveStage,
    physics: livePhysics,
    verdict: liveVerdict,
    objects,
    trajectory,
    startAnalysis,
    sendUserResponse,
    reset
  } = useVeritasAnalysis();

  // Kill Switch for demo mode
  const {
    isDemoMode,
    runDemoScenario,
    logoClickHandler,
    currentScenario,
    getSimulationUrl,
  } = useKillSwitch(
    (msg) => setDemoMessages(prev => [...prev, msg]),
    (phys) => setDemoPhysics(phys),
    (verd) => setDemoVerdict(verd),
    (prog, stg) => { setDemoProgress(prog); setDemoStage(stg); }
  );

  // Use demo or live data based on mode
  const messages = isDemoMode ? demoMessages : liveMessages;
  const physics = isDemoMode ? demoPhysics : livePhysics;
  const verdict = isDemoMode ? demoVerdict : liveVerdict;
  const progress = isDemoMode ? demoProgress : liveProgress;
  const stage = isDemoMode ? demoStage : liveStage;

  // Timeline violations from demo data or generate from physics
  const timelineViolations = physics?.checks ? [
    ...(physics.checks.gravity?.status === "VIOLATION" ? [{
      frame: 90, time: "0:03", law: "Gravity",
      severity: physics.checks.gravity.severity || 9.0,
      explanation: physics.checks.gravity.explanation
    }] : []),
    ...(physics.checks.shadows?.status === "VIOLATION" ? [{
      frame: 150, time: "0:05", law: "Shadow",
      severity: physics.checks.shadows.severity || 8.0,
      explanation: physics.checks.shadows.explanation
    }] : []),
    ...(physics.checks.momentum?.status === "VIOLATION" ? [{
      frame: 180, time: "0:06", law: "Momentum",
      severity: physics.checks.momentum.severity || 7.5,
      explanation: physics.checks.momentum.explanation
    }] : []),
    ...(physics.checks.material?.status === "VIOLATION" ? [{
      frame: 210, time: "0:07", law: "Material",
      severity: physics.checks.material.severity || 7.0,
      explanation: physics.checks.material.explanation
    }] : [])
  ] : [];

  // PDF Download Handler
  const handleDownloadReport = () => {
    if (!verdict || !physics) return;

    generateForensicReport({
      caseId: generateCaseId(),
      timestamp: formatTimestamp(),
      verdict: verdict.result as "authentic" | "synthetic",
      confidence: verdict.confidence,
      gravity: physics.gravity,
      violations: verdict.violations || 0,
      totalChecks: verdict.total_checks || 5,
      reason: verdict.reason,
      physicsChecks: [
        { name: "Gravity", status: physics.checks?.gravity?.status || "PASS", severity: physics.checks?.gravity?.severity || 0, explanation: physics.checks?.gravity?.explanation },
        { name: "Shadows", status: physics.checks?.shadows?.status || "PASS", severity: physics.checks?.shadows?.severity || 0, explanation: physics.checks?.shadows?.explanation },
        { name: "Momentum", status: physics.checks?.momentum?.status || "PASS", severity: physics.checks?.momentum?.severity || 0, explanation: physics.checks?.momentum?.explanation },
        { name: "Reflection", status: physics.checks?.reflection?.status || "PASS", severity: physics.checks?.reflection?.severity || 0, explanation: physics.checks?.reflection?.explanation },
        { name: "Material", status: physics.checks?.material?.status || "PASS", severity: physics.checks?.material?.severity || 0, explanation: physics.checks?.material?.explanation },
      ]
    });
  };

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
      setDemoMessages([]);
      setDemoPhysics(null);
      setDemoVerdict(null);
      setDemoProgress(0);
      return;
    }

    // If demo mode is active, run demo scenario
    if (isDemoMode) {
      setDemoMessages([]);
      setDemoPhysics(null);
      setDemoVerdict(null);
      runDemoScenario("pendulum");
    } else {
      startAnalysis();
    }
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
            <div
              className="relative flex items-baseline cursor-pointer select-none"
              onClick={logoClickHandler}
              title="Click 5 times for demo mode"
            >
              <motion.h1
                className="text-2xl font-semibold tracking-tight"
                style={{
                  background: isDemoMode
                    ? "linear-gradient(90deg, #ffd700 0%, #ffea00 50%, #ffd700 100%)"
                    : "linear-gradient(90deg, #4a4a4a 0%, #ffffff 50%, #4a4a4a 100%)",
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
            {/* Demo Mode Indicator */}
            {isDemoMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30"
              >
                <Shield className="w-3 h-3 text-yellow-500" />
                <span className="text-yellow-500 font-medium">DEMO MODE</span>
              </motion.div>
            )}
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
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleDownloadReport}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Report
                    </button>
                    <button
                      onClick={handleAnalyze}
                      className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors"
                    >
                      Analyze Another
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Comparison View - Shows when verdict is synthetic in demo mode */}
            {isDemoMode && verdict?.result === "synthetic" && videoPreview && currentScenario?.comparison?.enabled && (
              <ComparisonView
                realVideoUrl={videoPreview}
                simulationVideoUrl={getSimulationUrl(currentScenario.motionType)}
                violationDetails={currentScenario.comparison.violationDetails || {
                  law: "Gravity",
                  realValue: `${physics?.gravity?.toFixed(2) || "14.38"} m/s²`,
                  correctValue: "9.81 m/s² (Earth gravity)",
                  explanation: "The AI-generated motion violates Newton's laws."
                }}
                isVisible={true}
              />
            )}

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
                {physics?.checks?.gravity?.severity && (
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded ${physics.checks.gravity.severity >= 8 ? "bg-red-500/20 text-red-400" :
                    physics.checks.gravity.severity >= 4 ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-emerald-500/20 text-emerald-400"
                    }`}>
                    {physics.checks.gravity.severity >= 8 ? "CRITICAL" :
                      physics.checks.gravity.severity >= 4 ? "SUSPICIOUS" : "NORMAL"}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {/* Gravity Check with Severity */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">Gravity (g)</span>
                  <div className="flex items-center gap-2">
                    {physics?.checks?.gravity?.severity !== undefined && (
                      <span className={`text-xs font-bold ${physics.checks.gravity.severity >= 8 ? "text-red-400" :
                        physics.checks.gravity.severity >= 4 ? "text-yellow-400" : "text-emerald-400"
                        }`}>
                        {physics.checks.gravity.severity.toFixed(1)}/10
                      </span>
                    )}
                    <span className={`text-sm font-mono ${physics && physics.gravity > 11 ? "text-red-400" : "text-emerald-400"}`}>
                      {physics ? `${physics.gravity.toFixed(1)} m/s²` : "—"}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${physics && physics.gravity > 11 ? "bg-gradient-to-r from-yellow-500 to-red-500" : "bg-emerald-500"}`}
                    animate={{ width: physics ? `${Math.min((physics.gravity / 20) * 100, 100)}%` : "0%" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Earth: 9.81</span>
                  <span className={physics && Math.abs(physics.deviation) > 15 ? "text-red-400" : "text-emerald-400"}>
                    {physics ? `${physics.deviation > 0 ? "+" : ""}${physics.deviation.toFixed(0)}% deviation` : "—"}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-800 my-2"></div>

                {/* Additional Physics Checks with Severity Bars */}
                <div className="space-y-2">
                  {/* Shadows */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500">Shadows</span>
                      <div className="flex items-center gap-2">
                        {physics?.checks?.shadows?.severity !== undefined && (
                          <span className={`text-xs font-bold ${physics.checks.shadows.severity >= 8 ? "text-red-400" :
                            physics.checks.shadows.severity >= 4 ? "text-yellow-400" : "text-emerald-400"
                            }`}>{physics.checks.shadows.severity.toFixed(1)}/10</span>
                        )}
                        <span className={`text-xs font-mono ${physics?.checks?.shadows?.status === "VIOLATION" ? "text-red-400" : "text-emerald-400"}`}>
                          {physics?.checks?.shadows?.status === "VIOLATION" ? "✗ Anomaly" : physics?.checks?.shadows ? "✓ OK" : "—"}
                        </span>
                      </div>
                    </div>
                    {physics?.checks?.shadows?.severity !== undefined && (
                      <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${physics.checks.shadows.severity >= 8 ? "bg-red-500" : physics.checks.shadows.severity >= 4 ? "bg-yellow-500" : "bg-emerald-500"}`}
                          animate={{ width: `${(physics.checks.shadows.severity / 10) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Momentum */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500">Momentum</span>
                      <div className="flex items-center gap-2">
                        {physics?.checks?.momentum?.severity !== undefined && (
                          <span className={`text-xs font-bold ${physics.checks.momentum.severity >= 8 ? "text-red-400" :
                            physics.checks.momentum.severity >= 4 ? "text-yellow-400" : "text-emerald-400"
                            }`}>{physics.checks.momentum.severity.toFixed(1)}/10</span>
                        )}
                        <span className={`text-xs font-mono ${physics?.checks?.momentum?.status === "VIOLATION" ? "text-red-400" : "text-emerald-400"}`}>
                          {physics?.checks?.momentum?.status === "VIOLATION" ? "✗ Error" : physics?.checks?.momentum ? "✓ OK" : "—"}
                        </span>
                      </div>
                    </div>
                    {physics?.checks?.momentum?.severity !== undefined && (
                      <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${physics.checks.momentum.severity >= 8 ? "bg-red-500" : physics.checks.momentum.severity >= 4 ? "bg-yellow-500" : "bg-emerald-500"}`}
                          animate={{ width: `${(physics.checks.momentum.severity / 10) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Reflection */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500">Reflection</span>
                      <div className="flex items-center gap-2">
                        {physics?.checks?.reflection?.severity !== undefined && (
                          <span className={`text-xs font-bold ${physics.checks.reflection.severity >= 8 ? "text-red-400" :
                            physics.checks.reflection.severity >= 4 ? "text-yellow-400" : "text-emerald-400"
                            }`}>{physics.checks.reflection.severity.toFixed(1)}/10</span>
                        )}
                        <span className={`text-xs font-mono ${physics?.checks?.reflection?.status === "VIOLATION" ? "text-red-400" : "text-emerald-400"}`}>
                          {physics?.checks?.reflection?.status === "VIOLATION" ? "✗ Mismatch" : physics?.checks?.reflection ? "✓ OK" : "—"}
                        </span>
                      </div>
                    </div>
                    {physics?.checks?.reflection?.severity !== undefined && (
                      <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${physics.checks.reflection.severity >= 8 ? "bg-red-500" : physics.checks.reflection.severity >= 4 ? "bg-yellow-500" : "bg-emerald-500"}`}
                          animate={{ width: `${(physics.checks.reflection.severity / 10) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Material */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500">Material</span>
                      <div className="flex items-center gap-2">
                        {physics?.checks?.material?.severity !== undefined && (
                          <span className={`text-xs font-bold ${physics.checks.material.severity >= 8 ? "text-red-400" :
                            physics.checks.material.severity >= 4 ? "text-yellow-400" : "text-emerald-400"
                            }`}>{physics.checks.material.severity.toFixed(1)}/10</span>
                        )}
                        <span className={`text-xs font-mono ${physics?.checks?.material?.status === "VIOLATION" ? "text-red-400" : "text-emerald-400"}`}>
                          {physics?.checks?.material?.status === "VIOLATION" ? "✗ Invalid" : physics?.checks?.material ? "✓ OK" : "—"}
                        </span>
                      </div>
                    </div>
                    {physics?.checks?.material?.severity !== undefined && (
                      <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${physics.checks.material.severity >= 8 ? "bg-red-500" : physics.checks.material.severity >= 4 ? "bg-yellow-500" : "bg-emerald-500"}`}
                          animate={{ width: `${(physics.checks.material.severity / 10) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Physics Radar Chart */}
            {physics?.checks && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-neutral-500" />
                  <h3 className="text-sm font-medium text-neutral-400">Severity Overview</h3>
                </div>
                <PhysicsRadarChart data={physics.checks} />
              </div>
            )}

            {/* Timeline Scrubber */}
            {timelineViolations.length > 0 && (
              <TimelineScrubber
                duration={30}
                violations={timelineViolations}
              />
            )}

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
