"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Info, Zap, X } from "lucide-react";

interface Toast {
    id: string;
    type: "success" | "error" | "info" | "cache";
    message: string;
    duration?: number;
}

interface ToastContextType {
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { ...toast, id }]);

        setTimeout(() => {
            removeToast(id);
        }, toast.duration || 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
    const getIcon = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case "error":
                return <AlertTriangle className="w-5 h-5 text-red-400" />;
            case "info":
                return <Info className="w-5 h-5 text-blue-400" />;
            case "cache":
                return <Zap className="w-5 h-5 text-yellow-400" />;
        }
    };

    const getStyles = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return "border-green-500/30 bg-green-500/10";
            case "error":
                return "border-red-500/30 bg-red-500/10";
            case "info":
                return "border-blue-500/30 bg-blue-500/10";
            case "cache":
                return "border-yellow-500/30 bg-yellow-500/10";
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm min-w-[280px] ${getStyles(toast.type)}`}
                    >
                        {getIcon(toast.type)}
                        <span className="flex-1 text-sm text-white">{toast.message}</span>
                        <button
                            onClick={() => onRemove(toast.id)}
                            className="text-neutral-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
