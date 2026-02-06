"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface AnalysisMessage {
    type: string;
    level?: string;
    message?: string;
    progress?: number;
    stage?: string;
    gravity?: number;
    expected?: number;
    deviation?: number;
    result?: string;
    confidence?: number;
    reason?: string;
    objects?: Array<{ id: number; type: string; confidence: number }>;
    points?: Array<{ t: number; x: number; y: number }>;
}

interface UseVeritasAnalysisReturn {
    isConnected: boolean;
    isAnalyzing: boolean;
    messages: Array<{ level: string; message: string }>;
    progress: number;
    stage: string;
    physics: { gravity: number; expected: number; deviation: number; checks?: any } | null;
    verdict: { result: string; confidence: number; gravity: number; reason: string; violations?: number; total_checks?: number } | null;
    objects: Array<{ id: number; type: string; confidence: number }>;
    trajectory: Array<{ t: number; x: number; y: number }>;
    thinkingLogs: Array<{ content: string; type: string; timestamp: number }>;
    userConfirmation: { needed: boolean; question: string; options: string[] } | null;
    cacheHit: { hit: boolean; similarity: number; cachedResult?: any } | null;
    startAnalysis: (videoData?: string) => void;
    sendUserResponse: (response: string) => void;
    reset: () => void;
}

export function useVeritasAnalysis(): UseVeritasAnalysisReturn {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [messages, setMessages] = useState<Array<{ level: string; message: string }>>([]);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState("");
    const [physics, setPhysics] = useState<{ gravity: number; expected: number; deviation: number; checks?: any } | null>(null);
    const [verdict, setVerdict] = useState<{ result: string; confidence: number; gravity: number; reason: string; violations?: number; total_checks?: number } | null>(null);
    const [objects, setObjects] = useState<Array<{ id: number; type: string; confidence: number }>>([]);
    const [trajectory, setTrajectory] = useState<Array<{ t: number; x: number; y: number }>>([]);
    const [thinkingLogs, setThinkingLogs] = useState<Array<{ content: string; type: string; timestamp: number }>>([]);
    const [userConfirmation, setUserConfirmation] = useState<{ needed: boolean; question: string; options: string[] } | null>(null);
    const [cacheHit, setCacheHit] = useState<{ hit: boolean; similarity: number; cachedResult?: any } | null>(null);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
        const ws = new WebSocket(`${wsUrl}/ws/analyze`);

        ws.onopen = () => {
            setIsConnected(true);
            console.log("✓ Connected to VERITAS backend");
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log("× Disconnected from backend");
        };

        ws.onmessage = (event) => {
            const data: AnalysisMessage = JSON.parse(event.data);

            switch (data.type) {
                case "log":
                    setMessages(prev => [...prev, { level: data.level || "agent", message: data.message || "" }]);
                    break;

                case "scan_progress":
                    setProgress(data.progress || 0);
                    setStage(data.stage || "");
                    break;

                case "objects_detected":
                    setObjects(data.objects || []);
                    break;

                case "trajectory_data":
                    setTrajectory(data.points || []);
                    break;

                case "physics_update":
                    setPhysics({
                        gravity: data.gravity || 0,
                        expected: data.expected || 9.8,
                        deviation: data.deviation || 0,
                        checks: (data as any).checks
                    });
                    break;

                case "verdict":
                    setVerdict({
                        result: data.result || "",
                        confidence: data.confidence || 0,
                        gravity: data.gravity || 0,
                        reason: data.reason || "",
                        violations: (data as any).violations || 0,
                        total_checks: (data as any).total_checks || 5
                    });
                    setIsAnalyzing(false);
                    break;

                case "thinking":
                    setThinkingLogs(prev => [...prev, {
                        content: (data as any).content || "",
                        type: (data as any).type || "chain_of_thought",
                        timestamp: Date.now()
                    }]);
                    break;

                case "user_confirmation_needed":
                    setUserConfirmation({
                        needed: true,
                        question: (data as any).question || "Please confirm",
                        options: (data as any).options || ["Yes", "No"]
                    });
                    break;

                case "cache_hit":
                    setCacheHit({
                        hit: true,
                        similarity: (data as any).similarity || 0,
                        cachedResult: (data as any).cached_result
                    });
                    setMessages(prev => [...prev, {
                        level: "system",
                        message: `⚡ Cache hit! ${((data as any).similarity * 100).toFixed(0)}% similar video found`
                    }]);
                    break;
            }
        };

        wsRef.current = ws;
    }, []);

    const startAnalysis = useCallback((videoData?: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            connect();
            setTimeout(() => startAnalysis(videoData), 500);
            return;
        }

        setMessages([]);
        setProgress(0);
        setStage("");
        setPhysics(null);
        setVerdict(null);
        setObjects([]);
        setTrajectory([]);
        setIsAnalyzing(true);

        wsRef.current.send(JSON.stringify({
            type: "start_analysis",
            video_data: videoData
        }));
    }, [connect]);

    const sendUserResponse = useCallback((response: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        wsRef.current.send(JSON.stringify({
            type: "user_response",
            response
        }));
    }, []);

    const reset = useCallback(() => {
        setMessages([]);
        setProgress(0);
        setStage("");
        setPhysics(null);
        setVerdict(null);
        setObjects([]);
        setTrajectory([]);
        setThinkingLogs([]);
        setUserConfirmation(null);
        setCacheHit(null);
        setIsAnalyzing(false);
    }, []);

    useEffect(() => {
        connect();
        return () => {
            wsRef.current?.close();
        };
    }, [connect]);

    return {
        isConnected,
        isAnalyzing,
        messages,
        progress,
        stage,
        physics,
        verdict,
        objects,
        trajectory,
        thinkingLogs,
        userConfirmation,
        cacheHit,
        startAnalysis,
        sendUserResponse,
        reset
    };
}
