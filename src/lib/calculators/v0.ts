import { normalizeToUSD } from "@/lib/currency";
import { SAAS_PRICING_DB } from "@/lib/db";
import type { SaasOptimization } from "../types";

export function calculateV0ToolOptimization(
  currentPlanName: string,
  currentSeats: number,
  currentMonthlySpend: number,
): SaasOptimization {
  console.log("Fired V0 Tool Optimization");

  const toolId = "v0";
  const toolData = SAAS_PRICING_DB[toolId];
  const currentPlan = toolData.plans.find(
    (p) => p.name === currentPlanName,
  );

  if (!currentPlan)
    throw new Error(
      `v0 plan ${currentPlanName} not found.`,
    );

  const actualSeatCost = normalizeToUSD(
    currentPlan.costPerUser * currentSeats,
    currentPlan.currency,
  );
  const forcedMinimumCost = normalizeToUSD(
    currentPlan.costPerUser * currentPlan.minSeats,
    currentPlan.currency,
  );

  if (currentSeats < currentPlan.minSeats) {
    const premiumPlan = toolData.plans.find(
      (p) => p.name === "Premium",
    )!;
    const optimizedCost = normalizeToUSD(
      premiumPlan.costPerUser * currentSeats,
      premiumPlan.currency,
    );
    const monthlySavings =
      forcedMinimumCost - optimizedCost;

    return {
      type: "saas",
      toolId: toolId,
      recommendedPlan: "Premium",
      recommendedSeats: currentSeats,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      currentMonthlySpend: forcedMinimumCost,
      rationale: `Vercel imposes a ${currentPlan.minSeats}-seat minimum on the ${currentPlanName} tier. You are paying for ghost seats. Dropping to Premium saves $${monthlySavings}/mo while keeping individual generation limits.`,
    };
  }

  const savings = Math.max(
    0,
    currentMonthlySpend - actualSeatCost,
  );
  return {
    type: "saas",
    toolId: toolId,
    recommendedPlan: currentPlanName,
    recommendedSeats: currentSeats,
    monthlySavings: savings,
    annualSavings: savings * 12,
    currentMonthlySpend: actualSeatCost,
    rationale: `Your v0 ${currentPlanName} usage meets the seat minimums effectively.`,
  };
}
