import { normalizeToUSD } from "@/lib/currency";
import { SAAS_PRICING_DB, API_PRICING_DB } from "@/lib/db";
import type {
  SaasOptimization,
  ApiOptimization,
  ApiProviderKey,
} from "../types";

export function calculateGeminiToolOptimization(
  currentPlanName: string,
  currentSeats: number,
  currentMonthlySpend: number,
): SaasOptimization {
  console.log("Fired Gemini Tool Optimization");

  const toolData = SAAS_PRICING_DB["gemini"];
  const currentPlan = toolData.plans.find(
    (p) => p.name === currentPlanName,
  );
  if (!currentPlan)
    throw new Error(
      `Gemini plan ${currentPlanName} not found.`,
    );

  // INR to USD conversion for the aggregator
  const standardCostUSD = normalizeToUSD(
    currentPlan.costPerUser * currentSeats,
    currentPlan.currency,
  );
  const userSpendUSD = normalizeToUSD(
    currentMonthlySpend,
    currentPlan.currency,
  );

  return {
    type: "saas",
    toolId: "gemini",
    recommendedPlan: currentPlanName,
    recommendedSeats: currentSeats,
    monthlySavings: Math.max(
      0,
      userSpendUSD - standardCostUSD,
    ),
    annualSavings:
      Math.max(0, userSpendUSD - standardCostUSD) * 12,
    currentMonthlySpend: standardCostUSD,
    rationale: `Google AI ${currentPlanName} costs are optimized.`,
  };
}

export function calculateGeminiApiOptimization(
  providerKey: ApiProviderKey,
  modelId: string,
  monthlyInputTokens: number, // Acts as 'generations' for Veo/Imagen
  monthlyOutputTokens: number,
  currentMonthlySpend: number,
  isLatencyCritical: boolean,
  useCase: string,
): ApiOptimization {
  console.log("Fired Gemini API Optimization");
  const providerData = API_PRICING_DB[providerKey];
  if (!providerData)
    throw new Error(
      `Provider key not found: ${providerKey}`,
    );
  // Trim prevents typos from your DB (" lyria-3-pro-preview")
  const modelData = providerData.find(
    (m) => m.modelId.trim() === modelId.trim(),
  );
  if (!modelData)
    throw new Error(`Gemini model ${modelId} not found.`);

  let standardMonthlyCost = 0;
  let rationale = "";

  // TRAP: Media models bill entirely on output unit generations, input is $0.
  if (
    modelId.includes("imagen") ||
    modelId.includes("veo") ||
    modelId.includes("lyria")
  ) {
    standardMonthlyCost =
      modelData.outputCostPerMillion * monthlyOutputTokens; // monthlyOutputTokens = generation count here
    rationale = `Google Media models (${modelData.modelName}) are billed at a flat rate of $${modelData.outputCostPerMillion} per generation.`;
  } else {
    standardMonthlyCost =
      modelData.inputCostPerMillion * monthlyInputTokens +
      modelData.outputCostPerMillion * monthlyOutputTokens;
    rationale = `Standard Gemini API rate applied.`;
  }

  if (
    !isLatencyCritical &&
    modelData.batchDiscountPercentage > 0
  ) {
    const discountMultiplier =
      1 - modelData.batchDiscountPercentage;
    const optimizedMonthlyCost =
      standardMonthlyCost * discountMultiplier;
    const baselineSpend =
      currentMonthlySpend > 0
        ? currentMonthlySpend
        : standardMonthlyCost;
    const monthlySavings =
      baselineSpend - optimizedMonthlyCost;

    return {
      type: "api",
      toolId: providerKey,
      recommendedModel: modelData.modelName,
      inputCostPerMillion:
        modelData.inputCostPerMillion * discountMultiplier,
      outputCostPerMillion:
        modelData.outputCostPerMillion * discountMultiplier,
      batchDiscountPercentage:
        modelData.batchDiscountPercentage,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      currentMonthlySpend: baselineSpend,
      rationale: `By routing "${useCase}" through Google Batch API, you save ${modelData.batchDiscountPercentage * 100}%.`,
    };
  }

  const baselineSpend =
    currentMonthlySpend > 0
      ? currentMonthlySpend
      : standardMonthlyCost;
  return {
    type: "api",
    toolId: providerKey,
    recommendedModel: modelData.modelName,
    inputCostPerMillion: modelData.inputCostPerMillion,
    outputCostPerMillion: modelData.outputCostPerMillion,
    batchDiscountPercentage: 0,
    monthlySavings: Math.max(
      0,
      baselineSpend - standardMonthlyCost,
    ),
    annualSavings:
      Math.max(0, baselineSpend - standardMonthlyCost) * 12,
    currentMonthlySpend: baselineSpend,
    rationale: rationale,
  };
}
