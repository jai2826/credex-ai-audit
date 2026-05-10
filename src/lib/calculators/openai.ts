import { API_PRICING_DB } from "@/lib/db";
import type {
  ApiOptimization,
  ApiProviderKey,
  UseCaseType,
} from "../types";



export function calculateOpenAiApiOptimization(
  toolId: ApiProviderKey,
  modelId: string,
  monthlyInputTokens: number,
  monthlyOutputTokens: number,
  currentMonthlySpend: number,
  isLatencyCritical: boolean,
  useCase: UseCaseType,
): ApiOptimization {
  console.log("Fired OpenAI API Optimization");

  const providerData = API_PRICING_DB[toolId];
  if (!providerData)
    throw new Error(`Provider key not found: ${toolId}`);

  const modelData = providerData.find(
    (m) => m.modelId === modelId,
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
      toolId: toolId,
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
    toolId: toolId,
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
