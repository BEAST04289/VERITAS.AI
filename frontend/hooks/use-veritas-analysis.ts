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

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        const ws = new WebSocket("ws://localhost:8000/ws/analyze");

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
            }
        };

        wsRef.current = ws;
    }, []);

    const startAnalysis = useCallback((videoData?: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            connect();
            // Retry after connection
            setTimeout(() => startAnalysis(videoData), 500);
            return;
        }

        // Reset state
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
        startAnalysis,
        sendUserResponse,
        reset
    };
}
