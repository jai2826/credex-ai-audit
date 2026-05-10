import { normalizeToUSD } from "@/lib/currency";
import { SAAS_PRICING_DB } from "@/lib/db";
import type {
  SaasOptimization
} from "../types";

export function calculateClaudeToolOptimization(
  currentPlanName: string,
  currentSeats: number,
  currentMonthlySpend: number, // We keep this for future edge-cases, even if we calculate the forced spend below
): SaasOptimization {
  console.log("Fired Claude Tool Optimization");

  const toolId = "claude";
  const claudePricing = SAAS_PRICING_DB[toolId];

  // Dynamically fetch the real costs from your single source of truth
  const currentPlanData = claudePricing.plans.find(
    (p) => p.name === currentPlanName,
  );
  const proPlanData = claudePricing.plans.find(
    (p) => p.name === "Pro",
  );

  if (!currentPlanData || !proPlanData) {
    throw new Error(
      `Invalid plan names provided to Claude calculator: ${currentPlanName}`,
    );
  }

  const currentCostUSD = normalizeToUSD(
    currentPlanData.costPerUser,
    currentPlanData.currency,
  );
  const proCostUSD = normalizeToUSD(
    proPlanData.costPerUser,
    proPlanData.currency,
  );

  // --- THE CLAUDE TRAP LOGIC ---
  if (currentSeats < currentPlanData.minSeats) {
    const forcedMonthlySpend =
      currentCostUSD * currentPlanData.minSeats;

    // Calculate what they SHOULD be paying on the Pro plan for their actual head count
    const optimizedMonthlySpend = proCostUSD * currentSeats;

    const monthlySavings =
      forcedMonthlySpend - optimizedMonthlySpend;

    return {
      type: "saas",
      toolId: toolId,
      recommendedPlan: "Pro",
      recommendedSeats: currentSeats,
      monthlySavings: monthlySavings,
      annualSavings: monthlySavings * 12,
      currentMonthlySpend: forcedMonthlySpend,
      rationale: `Claude Team requires a minimum of 5 seats. By downgrading your ${currentSeats} users to the Pro plan, you eliminate ghost seats and save $${monthlySavings}/month.`,
    };
  }

  // --- DEFAULT FALLBACK (If they are already optimized) ---
  return {
    type: "saas",
    toolId: toolId,
    recommendedPlan: currentPlanName,
    recommendedSeats: currentSeats,
    monthlySavings: 0,
    annualSavings: 0,
    currentMonthlySpend: currentMonthlySpend,
    rationale: `Your current ${currentPlanName} setup is appropriately optimized for your seat count.`,
  };
}


