"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileDown, FileText, Shield, Scale, AlertTriangle, CheckCircle } from "lucide-react";

interface ForensicReportProps {
    verdict: {
        result: string;
        confidence: number;
        gravity: number;
        reason: string;
        violations?: number;
        total_checks?: number;
    } | null;
    physics: {
        gravity: number;
        expected: number;
        deviation: number;
        checks?: Record<string, any>;
    } | null;
    filename?: string;
}

export function ForensicReportDownload({ verdict, physics, filename = "analysis" }: ForensicReportProps) {
    const generatePDFReport = async () => {
        if (!verdict || !physics) return;

        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();

        const isSynthetic = verdict.result === "synthetic" || verdict.result === "SYNTHETIC";
        const timestamp = new Date().toISOString();

        doc.setFillColor(10, 10, 10);
        doc.rect(0, 0, 210, 40, "F");

        doc.setTextColor(66, 133, 244);
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text("VERITAS.AI", 20, 25);

        doc.setTextColor(156, 163, 175);
        doc.setFontSize(10);
        doc.text("Physics-Based AI Video Detection", 20, 33);

        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text(`Report ID: ${Date.now().toString(36).toUpperCase()}`, 150, 20);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 150, 26);

        const verdictY = 55;
        if (isSynthetic) {
            doc.setFillColor(239, 68, 68);
            doc.rect(15, verdictY - 8, 180, 20, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("⚠ SYNTHETIC VIDEO DETECTED", 105, verdictY + 4, { align: "center" });
        } else {
            doc.setFillColor(34, 197, 94);
            doc.rect(15, verdictY - 8, 180, 20, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("✓ AUTHENTIC VIDEO VERIFIED", 105, verdictY + 4, { align: "center" });
        }

        doc.setTextColor(60, 60, 60);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Confidence Score: ${verdict.confidence.toFixed(1)}%`, 20, 85);

        doc.setFillColor(229, 231, 235);
        doc.roundedRect(20, 90, 100, 8, 2, 2, "F");
        const barColor = verdict.confidence > 80 ? [34, 197, 94] : verdict.confidence > 50 ? [234, 179, 8] : [239, 68, 68];
        doc.setFillColor(barColor[0], barColor[1], barColor[2]);
        doc.roundedRect(20, 90, verdict.confidence, 8, 2, 2, "F");

        doc.setTextColor(30, 30, 30);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Physics Analysis Results", 20, 115);

        doc.setDrawColor(200, 200, 200);
        doc.line(20, 118, 190, 118);

        const tableData = [
            ["Metric", "Measured", "Expected", "Status"],
            ["Gravity (m/s²)", physics.gravity.toFixed(2), physics.expected.toFixed(2),
                Math.abs(physics.deviation) < 10 ? "PASS" : "FAIL"],
            ["Deviation", `${physics.deviation.toFixed(1)}%`, "< 10%",
                Math.abs(physics.deviation) < 10 ? "PASS" : "FAIL"],
        ];

        let tableY = 125;
        doc.setFontSize(10);

        tableData.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const x = 20 + (colIndex * 45);
                if (rowIndex === 0) {
                    doc.setFont("helvetica", "bold");
                    doc.setFillColor(243, 244, 246);
                    doc.rect(x - 2, tableY - 5, 43, 10, "F");
                } else {
                    doc.setFont("helvetica", "normal");
                }

                if (colIndex === 3 && rowIndex > 0) {
                    doc.setTextColor(cell === "PASS" ? 34 : 239, cell === "PASS" ? 197 : 68, cell === "PASS" ? 94 : 68);
                } else {
                    doc.setTextColor(60, 60, 60);
                }

                doc.text(cell, x, tableY);
            });
            tableY += 12;
        });

        doc.setTextColor(30, 30, 30);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Analysis Reasoning", 20, tableY + 15);

        doc.setDrawColor(200, 200, 200);
        doc.line(20, tableY + 18, 190, tableY + 18);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);

        const reasonLines = doc.splitTextToSize(verdict.reason, 170);
        doc.text(reasonLines, 20, tableY + 28);

        if (verdict.violations !== undefined) {
            const violationsY = tableY + 50 + (reasonLines.length * 5);
            doc.setFillColor(254, 243, 199);
            doc.rect(15, violationsY - 5, 180, 25, "F");

            doc.setTextColor(146, 64, 14);
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(`Physics Violations: ${verdict.violations} / ${verdict.total_checks || 5} checks`, 20, violationsY + 5);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text("Violations indicate deviations from expected physical behavior", 20, violationsY + 14);
        }

        doc.setFillColor(250, 250, 250);
        doc.rect(0, 270, 210, 30, "F");
        doc.setDrawColor(200, 200, 200);
        doc.line(0, 270, 210, 270);

        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        doc.text("Generated by VERITAS.AI - Physics-Based AI Video Detection Engine", 105, 280, { align: "center" });
        doc.text("Powered by Google Gemini 3 Experimental | gemini-exp-1206", 105, 286, { align: "center" });

        doc.save(`VERITAS_Report_${filename}_${Date.now()}.pdf`);
    };

    if (!verdict || !physics) return null;

    return (
        <motion.button
            onClick={generatePDFReport}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all shadow-lg shadow-blue-500/20"
        >
            <FileDown className="w-5 h-5" />
            <span>Download Forensic Report (PDF)</span>
        </motion.button>
    );
}
