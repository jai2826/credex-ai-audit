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
    throw new Error(`v0 plan "${currentPlanName}" not found.`);

  const actualSeatCost = normalizeToUSD(
    currentPlan.costPerUser * currentSeats,
    currentPlan.currency,
  );

  // TRAP: User is paying for more seats than they have people
  // because of the plan's minimum seat requirement
  if (currentSeats < currentPlan.minSeats) {
    // What they're actually being charged (minimum enforced by Vercel)
    const forcedMinimumCost = normalizeToUSD(
      currentPlan.costPerUser * currentPlan.minSeats,
      currentPlan.currency,
    );

    // Premium has minSeats: 1, so it's safe for solo/small users
    const premiumPlan = toolData.plans.find((p) => p.name === "Premium");
    if (!premiumPlan) throw new Error("v0 Premium plan missing from DB.");

    const optimizedCost = normalizeToUSD(
      premiumPlan.costPerUser * currentSeats,
      premiumPlan.currency,
    );

    const monthlySavings = forcedMinimumCost - optimizedCost;

    return {
      type: "saas",
      toolId,
      recommendedPlan: "Premium",
      recommendedSeats: currentSeats,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      currentMonthlySpend: forcedMinimumCost, // what they're actually paying
      rationale: `v0 ${currentPlanName} requires a minimum of ${currentPlan.minSeats} seats, but you only have ${currentSeats} — you're paying for ${currentPlan.minSeats - currentSeats} ghost seat(s). Downgrading to Premium ($${premiumPlan.costPerUser}/seat) removes the minimum and saves $${monthlySavings.toFixed(2)}/mo.`,
    };
  }

  // No trap triggered — check if they're overpaying vs official pricing
  const savings = Math.max(0, currentMonthlySpend - actualSeatCost);

  return {
    type: "saas",
    toolId,
    recommendedPlan: currentPlanName,
    recommendedSeats: currentSeats,
    monthlySavings: savings,
    annualSavings: savings * 12,
    currentMonthlySpend: actualSeatCost,
    rationale:
      savings > 0
        ? `You're reporting $${currentMonthlySpend}/mo but official v0 ${currentPlanName} pricing for ${currentSeats} seat(s) is $${actualSeatCost.toFixed(2)}/mo — audit your billing for ghost add-ons.`
        : `Your v0 ${currentPlanName} plan for ${currentSeats} seat(s) is correctly allocated.`,
  };
}