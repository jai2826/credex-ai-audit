import { normalizeToUSD } from "@/lib/currency";
import { SAAS_PRICING_DB } from "@/lib/db";
import type { SaasOptimization } from "../types";

export function calculateCopilotOptimization(
  currentPlanName: string,
  currentSeats: number,
  currentMonthlySpend: number,
): SaasOptimization {
        console.log("Fired Copilot Optimization");

  const toolId = "copilot";
  const toolData = SAAS_PRICING_DB[toolId];
  const currentPlan = toolData.plans.find(
    (p) => p.name === currentPlanName,
  );

  if (!currentPlan)
    throw new Error(
      `Copilot plan ${currentPlanName} not found.`,
    );

  const standardCost = normalizeToUSD(
    currentPlan.costPerUser * currentSeats,
    currentPlan.currency,
  );

  if (
    currentPlanName === "Enterprise" &&
    currentSeats < 50
  ) {
    const bizPlan = toolData.plans.find(
      (p) => p.name === "Business",
    )!;
    const optimizedCost = normalizeToUSD(
      bizPlan.costPerUser * currentSeats,
      bizPlan.currency,
    );
    const monthlySavings = standardCost - optimizedCost;

    return {
      type: "tool",
      toolId: toolId,
      recommendedPlan: "Business",
      recommendedSeats: currentSeats,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      currentMonthlySpend: standardCost,
      rationale: `With only ${currentSeats} seats on Enterprise, you likely aren't utilizing organizational deployment policies. Downgrading to Business retains IP indemnity and saves $${monthlySavings}/month.`,
    };
  }

  const savings = Math.max(
    0,
    currentMonthlySpend - standardCost,
  );
  return {
    type: "tool",
    toolId: toolId,
    recommendedPlan: currentPlanName,
    recommendedSeats: currentSeats,
    monthlySavings: savings,
    annualSavings: savings * 12,
    currentMonthlySpend: standardCost,
    rationale: `Copilot ${currentPlanName} for ${currentSeats} users is properly allocated.`,
  };
}
