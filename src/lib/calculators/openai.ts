import { API_PRICING_DB } from "@/lib/db";
import type {
    ApiOptimization,
    ApiProviderKey
} from "../types";

// export function calculateOpenAiToolOptimization(
//   currentPlanName: string,
//   currentSeats: number,
//   currentMonthlySpend: number
// ): SaasOptimization {
//   const toolData = SAAS_PRICING_DB["chatgpt"];
//   const currentPlan = toolData.plans.find((p) => p.name === currentPlanName);
//   if (!currentPlan) throw new Error(`ChatGPT plan ${currentPlanName} not found.`);

//   // ChatGPT is strictly INR in your DB. We MUST convert to USD for the engine to sum it properly.
//   const standardCostUSD = normalizeToUSD(currentPlan.costPerUser * currentSeats, currentPlan.currency);
//   const userSpendUSD = normalizeToUSD(currentMonthlySpend, currentPlan.currency);

//   if (currentPlanName === "Pro" && currentSeats > 1) {
//     const plusPlan = toolData.plans.find((p) => p.name === "Plus")!;
//     const optimizedCostUSD = normalizeToUSD(plusPlan.costPerUser * currentSeats, plusPlan.currency);
//     const monthlySavings = standardCostUSD - optimizedCostUSD;

//     return {
//       type: "tool",
//       toolId: "chatgpt",
//       recommendedPlan: "Plus",
//       recommendedSeats: currentSeats,
//       monthlySavings,
//       annualSavings: monthlySavings * 12,
//       currentMonthlySpend: standardCostUSD,
//       rationale: `ChatGPT Pro is extremely expensive (₹10,699/mo). Unless these ${currentSeats} users require o1-pro access daily, dropping to Plus (₹1,999/mo) saves $${monthlySavings.toFixed(2)} USD per month.`,
//     };
//   }

//   return {
//     type: "tool",
//     toolId: "chatgpt",
//     recommendedPlan: currentPlanName,
//     recommendedSeats: currentSeats,
//     monthlySavings: Math.max(0, userSpendUSD - standardCostUSD),
//     annualSavings: Math.max(0, userSpendUSD - standardCostUSD) * 12,
//     currentMonthlySpend: standardCostUSD,
//     rationale: `ChatGPT ${currentPlanName} costs are optimized.`,
//   };
// }

export function calculateOpenAiApiOptimization(
  providerKey: ApiProviderKey,
  modelId: string,
  monthlyInputTokens: number,
  monthlyOutputTokens: number,
  currentMonthlySpend: number,
  isLatencyCritical: boolean,
  useCase: string,
): ApiOptimization {
  console.log("Fired OpenAI API Optimization");

  const providerData = API_PRICING_DB[providerKey];
  if (!providerData)
    throw new Error(
      `Provider key not found: ${providerKey}`,
    );

  const modelData = providerData.find(
    (m) => m.modelId.trim() === modelId.trim(),
  );

  if (!modelData)
    throw new Error(`OpenAI model ${modelId} not found.`);

  const standardMonthlyCost =
    modelData.inputCostPerMillion * monthlyInputTokens +
    modelData.outputCostPerMillion * monthlyOutputTokens;

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
      rationale: `By routing "${useCase}" through the OpenAI Batch API, you save ${modelData.batchDiscountPercentage * 100}%.`,
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
    rationale: `Synchronous execution required for latency-critical OpenAI workloads.`,
  };
}
