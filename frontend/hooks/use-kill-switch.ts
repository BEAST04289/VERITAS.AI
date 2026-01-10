"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface DemoScenario {
    name: string;
    verdict: {
        result: string;
        confidence: number;
        gravity: number;
        violations: number;
        total_checks: number;
        reason: string;
    };
    physics: {
        gravity: number;
        expected: number;
        deviation: number;
        checks: Record<string, any>;
    };
    messages: Array<{ level: string; message: string }>;
    timeline: Array<{ frame: number; time: string; law: string; severity: number }>;
}

interface DemoData {
    scenarios: Record<string, DemoScenario>;
    default_scenario: string;
}

interface UseKillSwitchReturn {
    isDemoMode: boolean;
    activateDemoMode: () => void;
    deactivateDemoMode: () => void;
    runDemoScenario: (scenario?: string) => Promise<void>;
    currentScenario: DemoScenario | null;
    logoClickHandler: () => void;
}

export function useKillSwitch(
    onMessage: (msg: { level: string; message: string }) => void,
    onPhysicsUpdate: (physics: any) => void,
    onVerdict: (verdict: any) => void,
    onProgress: (progress: number, stage: string) => void
): UseKillSwitchReturn {
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [demoData, setDemoData] = useState<DemoData | null>(null);
    const [currentScenario, setCurrentScenario] = useState<DemoScenario | null>(null);
    const clickCount = useRef(0);
    const clickTimer = useRef<NodeJS.Timeout | null>(null);

    // Load demo data on mount
    useEffect(() => {
        fetch("/demo_data.json")
            .then((res) => res.json())
            .then((data) => {
                setDemoData(data);
                console.log("🎭 Kill Switch: Demo data loaded");
            })
            .catch((err) => console.error("Failed to load demo data:", err));
    }, []);

    // Keyboard shortcut: Ctrl+Shift+D
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === "D") {
                e.preventDefault();
                if (isDemoMode) {
                    deactivateDemoMode();
                } else {
                    activateDemoMode();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isDemoMode]);

    // Logo click handler (5 clicks to activate)
    const logoClickHandler = useCallback(() => {
        clickCount.current += 1;

        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
        }

        clickTimer.current = setTimeout(() => {
            clickCount.current = 0;
        }, 2000); // Reset after 2 seconds

        if (clickCount.current >= 5) {
            clickCount.current = 0;
            if (isDemoMode) {
                deactivateDemoMode();
            } else {
                activateDemoMode();
            }
        }
    }, [isDemoMode]);

    const activateDemoMode = useCallback(() => {
        setIsDemoMode(true);
        console.log("🎭 KILL SWITCH ACTIVATED - Demo Mode ON");
        // Visual indicator (subtle)
        document.body.style.boxShadow = "inset 0 0 20px rgba(255, 215, 0, 0.1)";
    }, []);

    const deactivateDemoMode = useCallback(() => {
        setIsDemoMode(false);
        console.log("🔌 Kill Switch Deactivated - Live Mode");
        document.body.style.boxShadow = "none";
    }, []);

    const runDemoScenario = useCallback(
        async (scenarioKey?: string) => {
            if (!demoData) {
                console.error("Demo data not loaded");
                return;
            }

            const key = scenarioKey || demoData.default_scenario;
            const scenario = demoData.scenarios[key];

            if (!scenario) {
                console.error(`Scenario ${key} not found`);
                return;
            }

            setCurrentScenario(scenario);
            console.log(`🎬 Running demo scenario: ${scenario.name}`);

            // Simulate message stream with delays
            for (let i = 0; i < scenario.messages.length; i++) {
                const msg = scenario.messages[i];

                // Calculate progress
                const progress = Math.floor((i / scenario.messages.length) * 100);
                let stage = "init";
                if (msg.message.includes("PHASE 1")) stage = "detection";
                else if (msg.message.includes("PHASE 2")) stage = "trajectory";
                else if (msg.message.includes("PHASE 3")) stage = "physics";
                else if (msg.message.includes("PHASE 4")) stage = "learning";
                else if (msg.message.includes("AUTHENTICATED") || msg.message.includes("DETECTED")) stage = "verdict";

                onProgress(progress, stage);
                onMessage(msg);

                // Variable delay for realism
                const delay = msg.level === "system" ? 400 : 200;
                await new Promise((resolve) => setTimeout(resolve, delay));

                // Send physics update after physics phase
                if (msg.message.includes("Calculated gravity")) {
                    onPhysicsUpdate(scenario.physics);
                }
            }

            // Final verdict
            onProgress(100, "verdict");
            onVerdict(scenario.verdict);
        },
        [demoData, onMessage, onPhysicsUpdate, onVerdict, onProgress]
    );

    return {
        isDemoMode,
        activateDemoMode,
        deactivateDemoMode,
        runDemoScenario,
        currentScenario,
        logoClickHandler,
    };
}
