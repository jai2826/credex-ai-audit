'use client';

import { AuditResultsDashboard, type AuditResults } from '@/components/AuditResultsDashboard';
import { CredexConsultationBanner } from '@/components/CredexConsultationBanner';

// Mock audit results for demonstration
const mockAuditResults: AuditResults = {
  totalMonthlySavings: 2450,
  totalAnnualSavings: 29400,
  tools: [
    {
      toolId: 'copilot',
      toolName: 'GitHub Copilot',
      currentSpend: 1200,
      recommendedSpend: 800,
      recommendedAction: 'Downgrade 5 seats from Business to Individual plan and optimize seat allocation.',
      monthlySavings: 400,
      percentageSavings: 33,
    },
    {
      toolId: 'claude',
      toolName: 'Claude',
      currentSpend: 950,
      recommendedSpend: 500,
      recommendedAction: 'Consolidate from 8 Claude Pro seats to 4 Claude API pay-as-you-go accounts.',
      monthlySavings: 450,
      percentageSavings: 47,
    },
    {
      toolId: 'chatgpt',
      toolName: 'ChatGPT',
      currentSpend: 680,
      recommendedSpend: 680,
      recommendedAction: 'Current plan is optimized. No changes recommended at this time.',
      monthlySavings: 0,
      percentageSavings: 0,
    },
    {
      toolId: 'cursor',
      toolName: 'Cursor',
      currentSpend: 450,
      recommendedSpend: 150,
      recommendedAction: 'Reduce Pro plan seats from 10 to 3 and move remaining to Free tier.',
      monthlySavings: 300,
      percentageSavings: 67,
    },
    {
      toolId: 'gemini',
      toolName: 'Gemini',
      currentSpend: 340,
      recommendedSpend: 340,
      recommendedAction: 'Consolidate multiple API keys to reduce redundancy and simplify management.',
      monthlySavings: 0,
      percentageSavings: 0,
    },
    {
      toolId: 'chatgpt',
      toolName: 'OpenAI API',
      currentSpend: 520,
      recommendedSpend: 280,
      recommendedAction: 'Implement request batching and optimize token usage to reduce API calls by 46%.',
      monthlySavings: 240,
      percentageSavings: 46,
    },
  ],
  summary: `Based on your current AI tool spending of $4,140/month across 6 tools serving a team of 45 engineers, we've identified significant optimization opportunities totaling $2,450 in monthly savings (59% potential reduction).

Key Findings:
• Your team is over-provisioned on several seat-based licenses, particularly GitHub Copilot and Cursor
• Multiple redundant tools are being utilized for similar tasks (Claude, ChatGPT, Gemini for writing tasks)
• OpenAI API usage shows high token waste that can be reduced through prompt engineering and batching

Strategic Recommendations:
1. Consolidate seat-based licenses to actual usage levels (estimated 45% reduction in GitHub Copilot spend)
2. Migrate from multiple Claude Pro seats to shared Claude API account for cost efficiency
3. Implement API usage monitoring to prevent token waste
4. Establish tool governance policy to prevent duplicate tool adoption
5. Consider tiered access: foundation tools for all engineers, specialized tools for specific teams

Implementation Priority:
• High Impact, Low Effort: Reduce GitHub Copilot and Cursor seats immediately (saves $700/month)
• High Impact, Medium Effort: Optimize Claude plan structure (saves $450/month)
• Medium Impact, Low Effort: Consolidate API keys and implement usage monitoring (saves $240/month)

Expected ROI: By implementing these recommendations, you can redirect $29,400 annually towards other engineering initiatives while maintaining or improving tool coverage across your team.`,
};

export default function ResultsPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <CredexConsultationBanner totalSavings={mockAuditResults.totalMonthlySavings} />
      </div>
      <AuditResultsDashboard results={mockAuditResults} />
    </main>
  );
}
