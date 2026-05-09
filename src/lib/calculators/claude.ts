import { normalizeToUSD } from "@/lib/currency";
import { API_PRICING_DB, SAAS_PRICING_DB } from "@/lib/db";
import type {
  ApiOptimization,
  ApiProviderKey,
  SaasOptimization,
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
  if (
    (currentPlanName === "Team Standard" ||
      currentPlanName === "Team Premium") &&
    currentSeats < 5
  ) {
    // Calculate what they are ACTUALLY paying because of the 5-seat minimum trap
    const forcedMonthlySpend = currentCostUSD * 5;

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

export function calculateClaudeApiOptimization(
  providerKey: ApiProviderKey,
  modelId: string,
  monthlyInputTokens: number,
  monthlyOutputTokens: number,
  currentMonthlySpend: number,
  isLatencyCritical: boolean,
  useCase: string,
): ApiOptimization {
  console.log("Fired Claude API Optimization");

  // 1. Fail loudly if the model doesn't exist
  const providerData = API_PRICING_DB[providerKey];
  if (!providerData)
    throw new Error(
      `Provider key not found: ${providerKey}`,
    );

  const modelData = providerData.find(
    (m) => m.modelId === modelId,
  );
  if (!modelData)
    throw new Error(`Model ID not found: ${modelId}`);

  // 2. Calculate the baseline standard cost
  const standardMonthlyCost =
    modelData.inputCostPerMillion * monthlyInputTokens +
    modelData.outputCostPerMillion * monthlyOutputTokens;

  // --- THE BATCH DISCOUNT TRAP ---
  if (!isLatencyCritical) {
    // Calculate the actual discounted cost (e.g., standard * 0.50)
    const discountMultiplier =
      1 - modelData.batchDiscountPercentage;
    const optimizedMonthlyCost =
      standardMonthlyCost * discountMultiplier;

    // Calculate savings against their provided current spend (or standard cost if their input was inaccurate)
    const baselineSpend =
      currentMonthlySpend > 0
        ? currentMonthlySpend
        : standardMonthlyCost;
    const monthlySavings =
      baselineSpend - optimizedMonthlyCost;

    return {
      type: "api",
      toolId: providerKey, // Cast because our SaasKey type includes API providers for simplicity
      recommendedModel: modelData.modelName,
      inputCostPerMillion:
        modelData.inputCostPerMillion * discountMultiplier,
      outputCostPerMillion:
        modelData.outputCostPerMillion * discountMultiplier,
      batchDiscountPercentage:
        modelData.batchDiscountPercentage,
      monthlySavings: monthlySavings,
      annualSavings: monthlySavings * 12,
      currentMonthlySpend: baselineSpend,
      // We actually use the useCase variable here
      rationale: `Because '${useCase}' is a background task, you do not need synchronous execution. By routing this through the Anthropic Batch API, you save ${modelData.batchDiscountPercentage * 100}% on token costs.`,
    };
  }

  // --- DEFAULT FALLBACK (Synchronous is required) ---
  const baselineSpend =
    currentMonthlySpend > 0
      ? currentMonthlySpend
      : standardMonthlyCost;
  const savings =
    baselineSpend > standardMonthlyCost
      ? baselineSpend - standardMonthlyCost
      : 0;

  return {
    type: "api",
    toolId: providerKey, // Cast because our SaasKey type includes API providers for simplicity
    recommendedModel: modelData.modelName,
    inputCostPerMillion: modelData.inputCostPerMillion,
    outputCostPerMillion: modelData.outputCostPerMillion,
    batchDiscountPercentage: 0, // No discount applied
    monthlySavings: savings,
    annualSavings: savings * 12,
    currentMonthlySpend: baselineSpend,
    rationale: `Because '${useCase}' requires real-time latency, synchronous execution is necessary. No batch discounts can be applied.`,
  };
}
