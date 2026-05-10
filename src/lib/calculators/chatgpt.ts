import { normalizeToUSD } from "@/lib/currency";
import { SAAS_PRICING_DB } from "@/lib/db";
import type {
  SaasOptimization
} from "../types";

export function calculateChatGPTToolOptimization(
  currentPlanName: string,
  currentSeats: number,
  currentMonthlySpend: number,
): SaasOptimization {
  console.log("Fired ChatGPT Tool Optimization");

  const toolData = SAAS_PRICING_DB["chatgpt"];
  const currentPlan = toolData.plans.find(
    (p) => p.name === currentPlanName,
  );
  if (!currentPlan)
    throw new Error(
      `ChatGPT plan ${currentPlanName} not found.`,
    );

  // ChatGPT is strictly INR in your DB. We MUST convert to USD for the engine to sum it properly.
  const standardCostUSD = normalizeToUSD(
    currentPlan.costPerUser * currentSeats,
    currentPlan.currency,
  );
  const userSpendUSD = normalizeToUSD(
    currentMonthlySpend,
    currentPlan.currency,
  );

  if (currentPlanName === "Pro" && currentSeats > 1) {
    const plusPlan = toolData.plans.find(
      (p) => p.name === "Plus",
    )!;
    const optimizedCostUSD = normalizeToUSD(
      plusPlan.costPerUser * currentSeats,
      plusPlan.currency,
    );
    const monthlySavings =
      standardCostUSD - optimizedCostUSD;

    return {
      type: "saas",
      toolId: "chatgpt",
      recommendedPlan: "Plus",
      recommendedSeats: currentSeats,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      currentMonthlySpend: standardCostUSD,
      rationale: `ChatGPT Pro is extremely expensive (₹10,699/mo). Unless these ${currentSeats} users require o1-pro access daily, dropping to Plus (₹1,999/mo) saves $${monthlySavings.toFixed(2)} USD per month.`,
    };
  }

  return {
    type: "saas",
    toolId: "chatgpt",
    recommendedPlan: currentPlanName,
    recommendedSeats: currentSeats,
    monthlySavings: Math.max(
      0,
      userSpendUSD - standardCostUSD,
    ),
    annualSavings:
      Math.max(0, userSpendUSD - standardCostUSD) * 12,
    currentMonthlySpend: standardCostUSD,
    rationale: `ChatGPT ${currentPlanName} costs are optimized.`,
  };
}


