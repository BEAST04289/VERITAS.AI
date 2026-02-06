"use client";

import { useCallback, useEffect, useState } from "react";

export function useVoice() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.getVoices();
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (typeof window === "undefined" || !window.speechSynthesis || !isEnabled) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            v.name.includes("Google US English") ||
            v.name.includes("Samantha") ||
            v.name.includes("Microsoft Zira") ||
            (v.lang.startsWith("en") && v.name.includes("Female"))
        );
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [isEnabled]);

    const stop = useCallback(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    const toggleVoice = useCallback(() => {
        if (isSpeaking) stop();
        setIsEnabled(prev => !prev);
    }, [isSpeaking, stop]);

    return { speak, stop, isSpeaking, isEnabled, toggleVoice };
}
