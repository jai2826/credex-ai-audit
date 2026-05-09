import { normalizeToUSD } from "@/lib/currency";
import { SAAS_PRICING_DB } from "@/lib/db";
import type { SaasOptimization } from "../types";

export function calculateCursorOptimization(
  currentPlanName: string,
  currentSeats: number,
  currentMonthlySpend: number,
): SaasOptimization {
      console.log("Fired Cursor Optimization");
  
  const toolId = "cursor";
  const toolData = SAAS_PRICING_DB[toolId];
  const currentPlan = toolData.plans.find(
    (p) => p.name === currentPlanName,
  );

  if (!currentPlan)
    throw new Error(
      `Cursor plan ${currentPlanName} not found.`,
    );

  const standardMonthlyCost = normalizeToUSD(
    currentPlan.costPerUser * currentSeats,
    currentPlan.currency,
  );

  if (currentPlanName === "Ultra" && currentSeats > 5) {
    const proPlusPlan = toolData.plans.find(
      (p) => p.name === "Pro+",
    )!;
    const optimizedCost = normalizeToUSD(
      proPlusPlan.costPerUser * currentSeats,
      proPlusPlan.currency,
    );
    const monthlySavings =
      standardMonthlyCost - optimizedCost;

    return {
      type: "saas",
      toolId: toolId,
      recommendedPlan: "Pro+",
      recommendedSeats: currentSeats,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      currentMonthlySpend: standardMonthlyCost,
      rationale: `You are paying for ${currentSeats} seats on Ultra ($200/mo). Downgrading to Pro+ ($60/mo) maintains premium model access for the team while saving $${monthlySavings}/month.`,
    };
  }

  const savings = Math.max(
    0,
    currentMonthlySpend - standardMonthlyCost,
  );
  return {
    type: "saas",
    toolId: toolId,
    recommendedPlan: currentPlanName,
    recommendedSeats: currentSeats,
    monthlySavings: savings,
    annualSavings: savings * 12,
    currentMonthlySpend: standardMonthlyCost,
    rationale: `Your ${currentSeats} Cursor ${currentPlanName} seats are optimally configured.`,
  };
}
