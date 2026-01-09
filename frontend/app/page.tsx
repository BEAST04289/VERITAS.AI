"use client";
import React, { useState } from "react";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { GlitchText, CRTOverlay } from "@/components/ui/effects";
import { Upload, ShieldAlert, Activity, Crosshair } from "lucide-react";
import { motion } from "framer-motion";

export default function VeritasCommandCenter() {
  const [analyzing, setAnalyzing] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white p-6 font-mono overflow-hidden">
      <FollowerPointerCard className="h-full w-full" title={
        <div className="flex items-center gap-2 px-2 py-1 bg-cyan-900/80 rounded-full border border-cyan-500/50">
          <Crosshair size={12} className="text-cyan-200" />
          <span className="text-cyan-200 text-[10px] font-bold">VERITAS // TARGETING</span>
        </div>
      }>

        {/* HEADER */}
        <nav className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-600 animate-pulse rounded-sm" />
            <h1 className="text-3xl font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
              VERITAS
            </h1>
          </div>
          <div className="flex gap-4 text-xs text-emerald-500">
            <span>PHYSICS_ENGINE: ONLINE</span>
            <span>GEMINI_VISION: CONNECTED</span>
          </div>
        </nav>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-12 grid-rows-6 gap-4 h-[85vh]">

          {/* 1. MAIN FEED (Video Input) */}
          <div className="col-span-8 row-span-4 rounded-xl border border-white/10 bg-slate-900/50 relative overflow-hidden group">
            <div className="absolute inset-0 flex flex-col items-center justify-center cursor-none z-20 pointer-events-none">
              <Upload className="w-16 h-16 text-slate-700 group-hover:text-cyan-400 transition-colors duration-500" />
              <span className="mt-4 text-sm text-slate-500 uppercase tracking-widest">Drop Subject Footage</span>
            </div>
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-full w-full pointer-events-none animate-[scan_3s_ease-in-out_infinite]" />
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://ui.aceternity.com/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-20 pointer-events-none" />
          </div>

          {/* 2. LIVE TELEMETRY (Physics Data) */}
          <div className="col-span-4 row-span-3 rounded-xl border border-white/10 bg-black p-4 relative">
            <div className="flex items-center gap-2 mb-4 text-cyan-400">
              <Activity size={16} />
              <h3 className="text-xs uppercase tracking-widest">Real-time Gravity (g)</h3>
            </div>
            {/* Fake Graph for UI Demo */}
            <div className="flex items-end gap-1 h-32 w-full mt-8">
              {[40, 60, 45, 90, 30, 80, 50, 70, 40, 100].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
                  className={`w-full rounded-t-sm ${h > 80 ? "bg-red-600" : "bg-cyan-900"}`}
                />
              ))}
            </div>
            <div className="absolute top-2 right-2 text-[10px] text-slate-600">t=0.4s</div>
          </div>

          {/* 3. THREAT LOG (Console) */}
          <div className="col-span-4 row-span-3 rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-[10px] text-green-400/70 overflow-hidden">
            <div className="border-b border-white/5 pb-2 mb-2 text-white/40 uppercase">Sys.log</div>
            <div className="flex flex-col gap-1">
              <span>{">"}Initializing Trajectory Fit...</span>
              <span>{">"}Analyzing Object ID: #8821...</span>
              <span className="text-red-500">{">"}WARNING: Parabolic Anomaly Detected</span>
              <span>{">"}Accel_Y = 14.2 m/s^2 (Expected: 9.8)</span>
            </div>
          </div>

          {/* 4. THE VERDICT (Final Result) */}
          <div className="col-span-8 row-span-2 rounded-xl border border-red-900/30 bg-red-950/10 flex items-center justify-between p-8 relative overflow-hidden">
            <div>
              <h2 className="text-sm text-red-400 uppercase tracking-[0.5em] mb-2">Analysis Result</h2>
              <div className="text-6xl font-bold text-white tracking-tighter">SYNTHETIC</div>
            </div>
            <ShieldAlert className="w-32 h-32 text-red-600/20 absolute -right-4 -bottom-4" />
            <div className="text-right">
              <div className="text-4xl font-bold text-red-500">99.8%</div>
              <div className="text-xs text-red-400 uppercase">Confidence</div>
            </div>
          </div>

        </div>
      </FollowerPointerCard>
      <CRTOverlay />
    </main>
  );
}
