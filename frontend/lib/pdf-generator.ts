"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PhysicsCheck {
    name: string;
    status: "PASS" | "VIOLATION";
    severity: number;
    value?: string;
    expected?: string;
    explanation?: string;
}

interface ReportData {
    caseId: string;
    timestamp: string;
    verdict: "authentic" | "synthetic";
    confidence: number;
    gravity: number;
    violations: number;
    totalChecks: number;
    reason: string;
    physicsChecks: PhysicsCheck[];
    matchedSignature?: string;
}

export function generateForensicReport(data: ReportData): void {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Colors
    const primaryColor: [number, number, number] = [20, 20, 30];
    const accentColor: [number, number, number] = data.verdict === "synthetic" ? [239, 68, 68] : [34, 197, 94];
    const textGray: [number, number, number] = [100, 100, 100];

    // Header
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 45, "F");

    // Logo
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("VERITAS.AI", 20, 25);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("FORENSIC ANALYSIS REPORT", 20, 35);

    // Case ID on right
    pdf.setFontSize(9);
    pdf.text(`Case: ${data.caseId}`, pageWidth - 20, 25, { align: "right" });
    pdf.text(data.timestamp, pageWidth - 20, 35, { align: "right" });

    // Verdict Banner
    const verdictY = 55;
    pdf.setFillColor(...accentColor);
    pdf.rect(15, verdictY, pageWidth - 30, 25, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(
        data.verdict === "synthetic" ? "⚠ AI-GENERATED CONTENT DETECTED" : "✓ AUTHENTIC VIDEO CONFIRMED",
        pageWidth / 2,
        verdictY + 16,
        { align: "center" }
    );

    // Summary Section
    let y = 95;
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("ANALYSIS SUMMARY", 20, y);

    y += 10;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...textGray);

    const summaryData = [
        ["Confidence Level", `${data.confidence}%`],
        ["Detected Gravity", `${data.gravity.toFixed(2)} m/s² (Earth: 9.81 m/s²)`],
        ["Physics Violations", `${data.violations} of ${data.totalChecks} checks failed`],
        ["Assessment", data.reason]
    ];

    summaryData.forEach(([label, value]) => {
        pdf.setFont("helvetica", "bold");
        pdf.text(label + ":", 20, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(value), 70, y);
        y += 8;
    });

    // Physics Checks Table
    y += 10;
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("PHYSICS VERIFICATION RESULTS", 20, y);

    y += 5;

    const tableData = data.physicsChecks.map(check => [
        check.name,
        check.status,
        `${check.severity.toFixed(1)}/10`,
        check.status === "VIOLATION" ? "CRITICAL" : check.severity >= 4 ? "SUSPICIOUS" : "NORMAL",
        check.explanation || "—"
    ]);

    autoTable(pdf, {
        startY: y,
        head: [["Law", "Status", "Severity", "Level", "Finding"]],
        body: tableData,
        theme: "striped",
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: "bold"
        },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 20 },
            2: { cellWidth: 20 },
            3: { cellWidth: 25 },
            4: { cellWidth: "auto" }
        },
        bodyStyles: {
            fontSize: 9
        },
        didParseCell: (data) => {
            if (data.column.index === 1) {
                const status = data.cell.raw as string;
                if (status === "VIOLATION") {
                    data.cell.styles.textColor = [239, 68, 68];
                    data.cell.styles.fontStyle = "bold";
                } else {
                    data.cell.styles.textColor = [34, 197, 94];
                }
            }
            if (data.column.index === 3) {
                const level = data.cell.raw as string;
                if (level === "CRITICAL") {
                    data.cell.styles.textColor = [239, 68, 68];
                } else if (level === "SUSPICIOUS") {
                    data.cell.styles.textColor = [234, 179, 8];
                } else {
                    data.cell.styles.textColor = [34, 197, 94];
                }
            }
        }
    });

    // Get final Y position after table
    const finalY = (pdf as any).lastAutoTable.finalY + 15;

    // Matched Signature (if any)
    if (data.matchedSignature) {
        pdf.setFillColor(255, 243, 205);
        pdf.rect(15, finalY, pageWidth - 30, 20, "F");
        pdf.setTextColor(180, 83, 9);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("⚠ PATTERN MATCH DETECTED", 20, finalY + 8);
        pdf.setFont("helvetica", "normal");
        pdf.text(data.matchedSignature, 20, finalY + 15);
    }

    // Footer
    const footerY = pdf.internal.pageSize.getHeight() - 20;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(15, footerY - 5, pageWidth - 15, footerY - 5);

    pdf.setTextColor(...textGray);
    pdf.setFontSize(8);
    pdf.text("This report was generated by VERITAS.AI - Physics-Based Deepfake Detection", 20, footerY);
    pdf.text("Powered by Gemini 3 Pro Vision | Newton's Laws Never Lie", 20, footerY + 5);
    pdf.text(`Report ID: ${data.caseId}`, pageWidth - 20, footerY, { align: "right" });

    // Save
    pdf.save(`VERITAS_Report_${data.caseId}.pdf`);
}

export function generateCaseId(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `VRT-${year}${month}${day}-${random}`;
}

export function formatTimestamp(): string {
    return new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short"
    });
}
