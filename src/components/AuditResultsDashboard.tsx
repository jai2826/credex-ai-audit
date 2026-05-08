'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CombinedKey } from '@/lib/types';
import { ArrowDownRight, Award, TrendingUp } from 'lucide-react';

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
}

interface AuditResultsDashboardProps {
  results: AuditResults;
}

export function AuditResultsDashboard({ results }: AuditResultsDashboardProps) {
  const { totalMonthlySavings, totalAnnualSavings, tools, summary } = results;

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section - Total Savings */}
        <Card className="border-0 shadow-lg bg-white overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-emerald-50 to-slate-50 px-8 py-12 lg:py-16">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Monthly Savings */}
                <div className="flex-1 text-center lg:text-left">
                  <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                    Monthly Savings
                  </p>
                  <div className="flex items-baseline justify-center lg:justify-start gap-2">
                    <span className="text-7xl lg:text-8xl font-mono font-bold text-emerald-600">
                      ${totalMonthlySavings.toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <span className="text-lg text-emerald-600 font-semibold">/mo</span>
                  </div>
                  <p className="text-slate-500 mt-3 text-sm">
                    Potential monthly cost reduction
                  </p>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-32 bg-slate-200" />

                {/* Annual Savings */}
                <div className="flex-1 text-center lg:text-right">
                  <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                    Annual Savings
                  </p>
                  <div className="flex items-baseline justify-center lg:justify-end gap-2">
                    <span className="text-7xl lg:text-8xl font-mono font-bold text-emerald-600">
                      ${totalAnnualSavings.toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <span className="text-lg text-emerald-600 font-semibold">/yr</span>
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
                  <p className="text-xs lg:text-sm text-slate-600 mt-2">Tools Analyzed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl lg:text-3xl font-bold text-emerald-600">
                    {Math.round(
                      (tools.reduce((sum, t) => sum + t.percentageSavings, 0) / tools.length) * 10
                    ) / 10}
                    %
                  </p>
                  <p className="text-xs lg:text-sm text-slate-600 mt-2">Avg. Reduction</p>
                </div>
                <div className="text-center col-span-2 lg:col-span-1">
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900">
                    {tools.filter((t) => t.monthlySavings > 0).length}
                  </p>
                  <p className="text-xs lg:text-sm text-slate-600 mt-2">Optimization Found</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tool Analysis Grid */}
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Tool Analysis</h2>
            <p className="text-slate-600 mt-2">
              Detailed breakdown and recommendations for each AI tool
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card
                key={tool.toolId}
                className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden"
              >
                {/* Savings Badge */}
                {tool.monthlySavings > 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Save ${tool.monthlySavings.toLocaleString()}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-900">{tool.toolName}</CardTitle>
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
                        ${tool.currentSpend.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <div className="flex items-center justify-center py-2">
                      <div className="flex-1 border-t border-slate-200" />
                      <ArrowDownRight className="w-4 h-4 text-emerald-600 mx-3" />
                      <div className="flex-1 border-t border-slate-200" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Recommended Monthly Spend
                      </p>
                      <p className="text-2xl font-bold text-emerald-600">
                        ${tool.recommendedSpend.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Recommended Action */}
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Recommended Action
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {tool.recommendedAction}
                    </p>
                  </div>

                  {/* Savings Percentage */}
                  {tool.monthlySavings > 0 && (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <span className="text-sm font-medium text-slate-700">Potential Savings</span>
                      <span className="text-lg font-bold text-emerald-600">
                        {tool.percentageSavings}%
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI-Generated Summary Section */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-slate-900">AI-Generated Summary</CardTitle>
            </div>
            <CardDescription>Strategic insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {summary ? (
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </p>
              ) : (
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <p className="text-slate-600 italic">
                    AI analysis is being generated based on your tool usage patterns and spending
                    data. This will provide personalized recommendations for optimizing your AI
                    tool stack and maximizing cost efficiency across your engineering team.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Footer */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Ready to optimize your stack?</h3>
              <p className="text-slate-600 mt-1 text-sm">
                Export these results or share them with your team to start implementing changes.
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none px-6 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Export PDF
              </button>
              <button className="flex-1 lg:flex-none px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Share Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
