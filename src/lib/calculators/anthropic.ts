import { API_PRICING_DB } from "@/lib/db";
import type {
    ApiOptimization,
    ApiProviderKey,
    UseCaseType
} from "../types";



export function calculateAnthropicApiOptimization(
  toolId: ApiProviderKey,
  modelId: string,
  monthlyInputTokens: number,
  monthlyOutputTokens: number,
  currentMonthlySpend: number,
  isLatencyCritical: boolean,
  useCase: UseCaseType,
): ApiOptimization {
  // 1. Fail loudly if the model doesn't exist
  const providerData = API_PRICING_DB[toolId];
  if (!providerData)
    throw new Error(
      `Provider key not found: ${toolId}`,
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
      toolId: toolId, // Cast because our SaasKey type includes API providers for simplicity
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
    toolId: toolId, // Cast because our SaasKey type includes API providers for simplicity
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
