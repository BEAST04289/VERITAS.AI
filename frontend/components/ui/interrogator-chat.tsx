"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "agent" | "user" | "system";
    content: string;
    isTyping?: boolean;
}

interface InterrogatorChatProps {
    isActive: boolean;
    onUserResponse?: (response: string) => void;
    scenario?: "glass" | "jump" | null;
}

export const InterrogatorChat: React.FC<InterrogatorChatProps> = ({
    isActive,
    onUserResponse,
    scenario = "jump"
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const jumpScenario: Message[] = [
        { role: "system", content: "PHYSICS ANOMALY DETECTED" },
        { role: "agent", content: "Trajectory analysis complete." },
        { role: "agent", content: "Calculated gravity: 14.2 m/s²" },
        { role: "agent", content: "Expected gravity: 9.8 m/s²" },
        { role: "system", content: "DEVIATION: +45%" },
    ];

    const glassScenario: Message[] = [
        { role: "system", content: "MATERIAL ANALYSIS REQUIRED" },
        { role: "agent", content: "Impact detected at 15 m/s." },
        { role: "agent", content: "Object integrity: INTACT" },
        { role: "agent", content: "Ambiguity: Material unknown." },
    ];

    useEffect(() => {
        if (!isActive) {
            setMessages([]);
            setShowInput(false);
            return;
        }

        const scenarioMessages = scenario === "glass" ? glassScenario : jumpScenario;
        let index = 0;

        const interval = setInterval(() => {
            if (index < scenarioMessages.length) {
                setMessages(prev => [...prev, scenarioMessages[index]]);
                index++;
            } else {
                clearInterval(interval);
                if (scenario === "glass") {
                    setTimeout(() => setShowInput(true), 500);
                }
            }
        }, 800);

        return () => clearInterval(interval);
    }, [isActive, scenario]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, { role: "user", content: inputValue }]);
        setShowInput(false);

        setTimeout(() => {
            setMessages(prev => [...prev,
            { role: "agent", content: "Glass shatters at 8 m/s impact." },
            { role: "agent", content: "This object should have shattered." },
            { role: "system", content: "PHYSICS VIOLATION CONFIRMED" },
            ]);
            onUserResponse?.(inputValue);
        }, 1000);

        setInputValue("");
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Agent Console</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`
                ${msg.role === "system" ? "text-yellow-500 font-semibold" : ""}
                ${msg.role === "agent" ? "text-neutral-400" : ""}
                ${msg.role === "user" ? "text-blue-400" : ""}
              `}
                        >
                            {msg.role === "agent" && <span className="text-neutral-600 mr-2">{">"}</span>}
                            {msg.role === "user" && <span className="text-blue-600 mr-2">{"$"}</span>}
                            {msg.role === "system" && <span className="text-yellow-600 mr-2">{"!"}</span>}
                            {msg.content}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {showInput && (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onSubmit={handleSubmit}
                        className="flex items-center gap-2 mt-4"
                    >
                        <span className="text-blue-500">{">"}</span>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="What material is this?"
                            autoFocus
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-neutral-600"
                        />
                    </motion.form>
                )}
            </div>
        </div>
    );
};
