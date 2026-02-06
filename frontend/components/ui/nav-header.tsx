"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    Shield, Activity, BookOpen, FileVideo, History,
    ExternalLink, Wifi, WifiOff
} from "lucide-react";

interface NavHeaderProps {
    isConnected?: boolean;
    isDemoMode?: boolean;
}

const navLinks = [
    { href: "/", label: "Analyzer", icon: Activity },
    { href: "/how-it-works", label: "How it Works", icon: BookOpen },
    { href: "/evidence", label: "Evidence", icon: FileVideo },
    { href: "/history", label: "History", icon: History }
];

export function NavHeader({ isConnected = false, isDemoMode = false }: NavHeaderProps) {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Shield className="w-8 h-8 text-blue-400" />
                    </motion.div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-white tracking-tight">VERITAS</span>
                        <span className="text-blue-400 text-xl font-bold">.AI</span>
                    </div>
                </Link>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                                        }`}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Status Indicators */}
                <div className="flex items-center gap-3">
                    {/* Demo Mode Badge */}
                    {isDemoMode && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium"
                        >
                            DEMO MODE
                        </motion.div>
                    )}

                    {/* Connection Status */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${isConnected
                            ? "bg-green-500/10 text-green-400 border border-green-500/30"
                            : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                        }`}>
                        {isConnected ? (
                            <>
                                <Wifi className="w-3 h-3" />
                                <span>API Connected</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-3 h-3" />
                                <span>Offline</span>
                            </>
                        )}
                    </div>

                    {/* GitHub Link */}
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </header>
    );
}
