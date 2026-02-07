"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles, Zap, Shield, Building2, Crown, Rocket, X } from "lucide-react";

const plans = [
    {
        name: "Free Tier",
        icon: Zap,
        price: "$0",
        period: "forever",
        description: "Perfect for testing and personal projects",
        color: "from-slate-600 to-slate-700",
        borderColor: "border-slate-600/50",
        features: [
            { text: "10 video analyses / month", included: true },
            { text: "Basic physics checks", included: true },
            { text: "Gemini Flash Model", included: true },
            { text: "Community support", included: true },
            { text: "Export PDF reports", included: false },
            { text: "API access", included: false },
            { text: "Priority processing", included: false },
        ],
        cta: "Get Started Free",
        popular: false,
    },
    {
        name: "Pro",
        icon: Crown,
        price: "$29",
        period: "/ month",
        description: "For journalists, researchers & fact-checkers",
        color: "from-purple-600 to-blue-600",
        borderColor: "border-purple-500/50",
        features: [
            { text: "500 video analyses / month", included: true },
            { text: "Advanced physics engine", included: true },
            { text: "Gemini Pro Model", included: true },
            { text: "Email support", included: true },
            { text: "Export PDF reports", included: true },
            { text: "API access (1000 req/day)", included: true },
            { text: "Priority processing", included: false },
        ],
        cta: "Start 14-Day Trial",
        popular: true,
    },
    {
        name: "Corporate",
        icon: Building2,
        price: "Custom",
        period: "",
        description: "For media companies & enterprises",
        color: "from-amber-500 to-orange-600",
        borderColor: "border-amber-500/50",
        features: [
            { text: "Unlimited analyses", included: true },
            { text: "Full physics suite", included: true },
            { text: "Gemini 3 Experimental", included: true },
            { text: "Dedicated support", included: true },
            { text: "Custom reports", included: true },
            { text: "Unlimited API access", included: true },
            { text: "Priority processing", included: true },
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Back Button */}
                <Link href="/">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </motion.button>
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Simple, Transparent Pricing</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        Choose Your{" "}
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Truth Plan
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Start free, scale as you grow. All plans include our physics-first detection engine.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border ${plan.borderColor} rounded-3xl p-8 ${plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-6`}>
                                <plan.icon className="w-7 h-7 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-slate-400">{plan.period}</span>
                            </div>

                            <div className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <div key={feature.text} className="flex items-center gap-3">
                                        {feature.included ? (
                                            <Check className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <X className="w-5 h-5 text-slate-600" />
                                        )}
                                        <span className={feature.included ? "text-slate-300" : "text-slate-600"}>
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${plan.popular
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                                        : 'bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-600'
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Google Partnership Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Rocket className="w-8 h-8 text-blue-400" />
                        <h3 className="text-2xl font-bold">Our Vision: Partner with Google</h3>
                    </div>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-6">
                        We envision VERITAS as the official deepfake detection tool powered by Google's Gemini technology.
                        Help us make truth accessible to everyone. <strong>We're seeking Google's support</strong> to scale this
                        tool globally and protect digital democracy.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Shield className="w-6 h-6 text-green-400" />
                        <span className="text-sm text-slate-400">Patent Pending • Trademark Registered • Open to Strategic Partnerships</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
