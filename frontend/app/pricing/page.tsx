"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check, Zap, Shield, Building2, Crown, X } from "lucide-react";

const plans = [
    {
        name: "Free",
        icon: Zap,
        price: "$0",
        period: "forever",
        description: "For testing and personal use",
        features: [
            { text: "10 analyses / month", included: true },
            { text: "Basic physics checks", included: true },
            { text: "Gemini Flash", included: true },
            { text: "Community support", included: true },
            { text: "PDF reports", included: false },
            { text: "API access", included: false },
        ],
        cta: "Get Started",
        highlight: false,
    },
    {
        name: "Pro",
        icon: Crown,
        price: "$29",
        period: "/mo",
        description: "For journalists & researchers",
        features: [
            { text: "500 analyses / month", included: true },
            { text: "Advanced physics engine", included: true },
            { text: "Gemini Pro", included: true },
            { text: "Priority support", included: true },
            { text: "PDF reports", included: true },
            { text: "API access", included: true },
        ],
        cta: "Start Trial",
        highlight: true,
    },
    {
        name: "Enterprise",
        icon: Building2,
        price: "Custom",
        period: "",
        description: "For media companies",
        features: [
            { text: "Unlimited analyses", included: true },
            { text: "Full physics suite", included: true },
            { text: "Gemini 3 Experimental", included: true },
            { text: "Dedicated support", included: true },
            { text: "Custom integrations", included: true },
            { text: "SLA guarantee", included: true },
        ],
        cta: "Contact Sales",
        highlight: false,
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="container mx-auto px-6 py-12 max-w-6xl">
                {/* Back */}
                <Link href="/">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-12 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </motion.button>
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
                        Simple Pricing
                    </h1>
                    <p className="text-neutral-500 max-w-xl mx-auto">
                        Start free. Scale as you grow. All plans include physics-first detection.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-20">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className={`relative bg-neutral-900/50 border rounded-2xl p-6 ${plan.highlight
                                    ? 'border-purple-500/50 ring-1 ring-purple-500/20'
                                    : 'border-neutral-800'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                                        Popular
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.highlight ? 'bg-purple-500/20' : 'bg-neutral-800'
                                    }`}>
                                    <plan.icon className={`w-5 h-5 ${plan.highlight ? 'text-purple-400' : 'text-neutral-400'}`} />
                                </div>
                                <h3 className="text-xl font-semibold">{plan.name}</h3>
                            </div>

                            <p className="text-neutral-500 text-sm mb-4">{plan.description}</p>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-bold">{plan.price}</span>
                                <span className="text-neutral-500 text-sm">{plan.period}</span>
                            </div>

                            <div className="space-y-3 mb-6">
                                {plan.features.map((feature) => (
                                    <div key={feature.text} className="flex items-center gap-2 text-sm">
                                        {feature.included ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <X className="w-4 h-4 text-neutral-700" />
                                        )}
                                        <span className={feature.included ? "text-neutral-300" : "text-neutral-600"}>
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${plan.highlight
                                        ? 'bg-purple-500 hover:bg-purple-400 text-white'
                                        : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Vision Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center"
                >
                    <h3 className="text-xl font-semibold mb-3">Our Vision: Partner with Google</h3>
                    <p className="text-neutral-400 max-w-2xl mx-auto mb-4 text-sm">
                        We envision VERITAS as the official deepfake detection tool powered by Google's Gemini.
                        Help us make truth accessible to everyone.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-neutral-500 text-xs">
                        <Shield className="w-4 h-4" />
                        <span>Patent Pending · Trademark Pending · Open to Partnerships</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
