"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import {
  AuditResultsDashboard,
  type AuditResults,
} from "@/components/AuditResultsDashboard";
import { CredexConsultationBanner } from "@/components/CredexConsultationBanner";
import { Button } from "@/components/ui/button";
import { auditItemsAtom } from "@/lib/atoms";
import { calculateGlobalAudit } from "@/lib/audit-engine";
import { calculateCrossToolFindings } from "@/lib/cross-tool-insight";

export default function ResultsPage() {
  const router = useRouter();
  const [auditItems] = useAtom(auditItemsAtom);

  // 1. Run the real physics engine on the hydrated Jotai state
  const realAuditData = useMemo<AuditResults | null>(() => {
    if (!auditItems || auditItems.length === 0) return null;

    // Run the actual math
    const rawResult = calculateGlobalAudit(
      auditItems,
      "USD",
    );
    const aiInsights = calculateCrossToolFindings(
      auditItems,
      [...new Set(auditItems.map((item) => item.useCase))],
    );

    // 2. The Adapter: Transform our internal engine shape to match your UI components
    const transformedTools =
      rawResult.individualResults.map((r) => {
        const percentage =
          r.currentMonthlySpend > 0
            ? Math.round(
                (r.monthlySavings / r.currentMonthlySpend) *
                  100,
              )
            : 0;

        return {
          toolId: r.toolId,
          // Capitalize and format tool names nicely (e.g., "openai_api" -> "Openai Api")
          toolName: r.toolId
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          currentSpend: r.currentMonthlySpend,
          recommendedSpend:
            r.currentMonthlySpend - r.monthlySavings,
          recommendedAction: r.rationale, // Inject our hyper-specific rationales here
          monthlySavings: r.monthlySavings,
          percentageSavings: percentage,
        };
      });

    // Generate a dynamic summary based on their actual numbers
    const toolCount = transformedTools.length;
    const dynamicSummary = `Based on your current AI tool spending across ${toolCount} tool${toolCount !== 1 ? "s" : ""}, we've identified specific optimization opportunities totaling $${rawResult.totalMonthlySavings.toLocaleString()} in monthly savings.\n\nReview the breakdown below to see exactly how to eliminate ghost seats, leverage batch API discounts, and optimize your SaaS tiers.`;

    return {
      // Ensure we are passing actual numbers, parsing them if your convertToDisplay returns strings
      totalMonthlySavings:
        typeof rawResult.totalMonthlySavings === "string"
          ? parseFloat(rawResult.totalMonthlySavings)
          : rawResult.totalMonthlySavings,
      totalAnnualSavings:
        typeof rawResult.totalAnnualSavings === "string"
          ? parseFloat(rawResult.totalAnnualSavings)
          : rawResult.totalAnnualSavings,
      tools: transformedTools,
      summary: dynamicSummary,
      crossToolFindings: aiInsights,
    };
  }, [auditItems]);

  // 3. Handle the empty state (if they refreshed the page or bypassed the form)
  if (!realAuditData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          No Audit Data Found
        </h2>
        <p className="text-slate-600 mb-6 max-w-md">
          We couldn&apos;t find your tool stack. Please go
          back and complete the audit form to generate your
          financial breakdown.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to
          Form
        </Button>
      </div>
    );
  }

  // 4. Render the real data
  return (
    <main className="bg-slate-50 min-h-screen pb-20">
      <div className="mx-auto max-w-6xl px-4 pt-8">
        {/* Navigation back to form */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="mb-6 text-slate-600">
          <ArrowLeft className="w-4 h-4 mr-2" /> Edit Tool
          Stack
        </Button>
      </div>
      <AuditResultsDashboard results={realAuditData} />
      <CredexConsultationBanner
        totalSavings={realAuditData.totalMonthlySavings}
      />
    </main>
  );
}
