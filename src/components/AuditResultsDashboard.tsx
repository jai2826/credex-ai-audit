"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CrossToolFinding } from "@/lib/cross-tool-insight";
import { CombinedKey } from "@/lib/types";
import {
  ArrowDownRight,
  Award,
  Download,
  FileText,
  TrendingUp,
} from "lucide-react";

// Types for audit results
export interface ToolAnalysis {
  toolId: CombinedKey;
  toolName: string;
  currentSpend: number;
  recommendedSpend: number;
  recommendedAction: string;
  monthlySavings: number;
  percentageSavings: number;
}

export interface AuditResults {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  tools: ToolAnalysis[];
  summary?: string;
  crossToolFindings?: CrossToolFinding[];
}

interface AuditResultsDashboardProps {
  results: AuditResults;
}

export function AuditResultsDashboard({
  results,
}: AuditResultsDashboardProps) {
  const {
    totalMonthlySavings,
    totalAnnualSavings,
    tools,
    summary,
    crossToolFindings,
  } = results;

  // CSV Generator strictly for this component's data shape
  const handleExportCSV = () => {
    const headers = [
      "Tool Name",
      "Current Monthly Spend ($)",
      "Optimized Monthly Spend ($)",
      "Monthly Savings ($)",
      "Savings Percentage (%)",
      "Recommended Action",
    ];

    const rows = tools.map((t) =>
      [
        `"${t.toolName}"`,
        t.currentSpend.toFixed(2),
        t.recommendedSpend.toFixed(2),
        t.monthlySavings.toFixed(2),
        t.percentageSavings,
        `"${t.recommendedAction.replace(/"/g, '""')}"`, // Escape quotes for CSV
      ].join(","),
    );

    // Add totals row
    rows.push(
      `"TOTAL",,,${totalMonthlySavings.toFixed(2)},,`,
    );

    const csvContent = [headers.join(","), ...rows].join(
      "\n",
    );
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `credex-ai-audit-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    // Added print:bg-white to ensure clean backgrounds on paper
    <div className="w-full min-h-screen bg-slate-50 print:bg-white py-12 px-4 print:py-0">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Print-Only Header (Hidden on screen) */}
        <div className="hidden print:block border-b border-slate-300 pb-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Credex AI Infrastructure Audit
          </h1>
          <p className="text-slate-500 mt-1">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Hero Section - Total Savings */}
        <Card className="border-0 shadow-lg bg-white overflow-hidden print:shadow-none print:border print:border-slate-300">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-emerald-50 to-slate-50 print:bg-none print:bg-white px-8 py-12 lg:py-16">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Monthly Savings */}
                <div className="flex-1 text-center lg:text-left">
                  <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                    Monthly Savings
                  </p>
                  <div className="flex items-baseline justify-center lg:justify-start gap-2">
                    <span className="text-7xl lg:text-8xl font-mono font-bold text-emerald-600 print:text-slate-900">
                      $
                      {totalMonthlySavings.toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        },
                      )}
                    </span>
                    <span className="text-lg text-emerald-600 print:text-slate-900 font-semibold">
                      /mo
                    </span>
                  </div>
                  <p className="text-slate-500 mt-3 text-sm">
                    Potential monthly cost reduction
                  </p>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-32 bg-slate-200 print:bg-slate-300" />

                {/* Annual Savings */}
                <div className="flex-1 text-center lg:text-right">
                  <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                    Annual Savings
                  </p>
                  <div className="flex items-baseline justify-center lg:justify-end gap-2">
                    <span className="text-7xl lg:text-8xl font-mono font-bold text-emerald-600 print:text-slate-900">
                      $
                      {totalAnnualSavings.toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        },
                      )}
                    </span>
                    <span className="text-lg text-emerald-600 print:text-slate-900 font-semibold">
                      /yr
                    </span>
                  </div>
                  <p className="text-slate-500 mt-3 text-sm">
                    Potential annual cost reduction
                  </p>
                </div>
              </div>

              {/* Hero Stats Footer */}
              <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                    {tools.length}
                  </p>
                  <p className="text-xs lg:text-sm text-slate-600 mt-2">
                    Tools Analyzed
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-emerald-600 print:text-slate-900">
                    {tools.length > 0
                      ? Math.round(
                          (tools.reduce(
                            (sum, t) =>
                              sum + t.percentageSavings,
                            0,
                          ) /
                            tools.length) *
                            10,
                        ) / 10
                      : 0}
                    %
                  </p>
                  <p className="text-xs lg:text-sm text-slate-600 mt-2">
                    Avg. Reduction
                  </p>
                </div>
                <div className="text-center col-span-2 lg:col-span-1">
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                    {
                      tools.filter(
                        (t) => t.monthlySavings > 0,
                      ).length
                    }
                  </p>
                  <p className="text-xs lg:text-sm text-slate-600 mt-2">
                    Optimizations Found
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tool Analysis Grid */}
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Tool Analysis
            </h2>
            <p className="text-slate-600 mt-2">
              Detailed breakdown and recommendations for
              each AI tool
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card
                key={tool.toolId}
                // print:break-inside-avoid prevents the card from being sliced in half across two printed pages
                className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden print:break-inside-avoid print:shadow-none print:border-slate-300">
                {/* Savings Badge */}
                {tool.monthlySavings > 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 print:border print:border-emerald-300 print:bg-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Save $
                      {tool.monthlySavings.toLocaleString()}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-900 pr-24">
                    {tool.toolName}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    AI Tool Optimization Plan
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Current vs Recommended Spend */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Current Monthly Spend
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        $
                        {tool.currentSpend.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-center py-2">
                      <div className="flex-1 border-t border-slate-200" />
                      <ArrowDownRight className="w-4 h-4 text-emerald-600 print:text-slate-600 mx-3" />
                      <div className="flex-1 border-t border-slate-200" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Recommended Monthly Spend
                      </p>
                      <p className="text-2xl font-bold text-emerald-600 print:text-slate-900">
                        $
                        {tool.recommendedSpend.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Recommended Action */}
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Recommended Action
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {tool.recommendedAction}
                    </p>
                  </div>

                  {/* Savings Percentage */}
                  {tool.monthlySavings > 0 && (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200 print:bg-white print:border-slate-200">
                      <span className="text-sm font-medium text-slate-700">
                        Potential Savings
                      </span>
                      <span className="text-lg font-bold text-emerald-600 print:text-slate-900">
                        {tool.percentageSavings}%
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {crossToolFindings &&
          crossToolFindings.length > 0 && (
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader>
                <CardTitle>Cross-Tool Findings</CardTitle>
                <CardDescription>
                  Issues identified across your entire AI
                  stack
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {crossToolFindings.map(
                  (finding, i) => (
                    <div
                      key={i}
                      className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                      <p className="text-sm font-semibold text-amber-900">
                        {finding.finding}
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        {finding.recommendation}
                      </p>
                      {finding.monthlySaving > 0 && (
                        <p className="text-sm font-bold text-emerald-700 mt-2">
                          Potential saving: $
                          {finding.monthlySaving.toFixed(0)}
                          /mo
                        </p>
                      )}
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          )}

        {/* AI-Generated Summary Section */}
        <Card className="border-slate-200 shadow-sm bg-white print:shadow-none print:border-slate-300 print:break-inside-avoid">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 print:text-slate-600" />
              <CardTitle className="text-slate-900">
                Strategic Summary
              </CardTitle>
            </div>
            <CardDescription>
              Analysis based on your tool usage patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {summary ? (
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {summary}
                </p>
              ) : (
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <p className="text-slate-600 italic">
                    Analysis is being generated based on
                    your tool usage patterns and spending
                    data.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Footer - HIDDEN IN PRINT */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8 print:hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Ready to optimize your stack?
              </h3>
              <p className="text-slate-600 mt-1 text-sm">
                Export these results to share with your
                finance team and start implementing changes.
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              {/* WIRED: Triggers Browser Native Print Dialog */}
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center flex-1 lg:flex-none px-6 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>

              {/* WIRED: Triggers CSV generation based on actual tools array */}
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center flex-1 lg:flex-none px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                <FileText className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
