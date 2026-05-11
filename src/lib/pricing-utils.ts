import { SAAS_PRICING_DB, API_PRICING_DB } from "./db";

export function calculateSaasRetailCost(
  toolId: keyof typeof SAAS_PRICING_DB,
  planId: string,
  declaredSeats: number,
): number {
  const tool = SAAS_PRICING_DB[toolId];
  if (!tool)
    throw new Error(
      `CRITICAL: Tool ID '${toolId}' does not exist in SAAS_PRICING_DB.`,
    );

  const plan = tool.plans.find((p) => p.name === planId);
  if (!plan)
    throw new Error(
      `CRITICAL: Plan ID '${planId}' does not exist for tool '${toolId}'.`,
    );

  
  const billableSeats = Math.max(
    declaredSeats,
    plan.minSeats || 1,
  );

  return billableSeats * plan.costPerUser;
}

export function calculateApiRetailCost(
  toolId: keyof typeof API_PRICING_DB,
  modelId: string,
  inputTokensMillions: number,
  outputTokensMillions: number,
): number {
  const tool = API_PRICING_DB[toolId];
  if (!tool)
    throw new Error(
      `CRITICAL: Tool ID '${toolId}' does not exist in API_PRICING_DB.`,
    );

  const model = tool.find((m) => m.modelId === modelId);
  if (!model)
    throw new Error(
      `CRITICAL: Model ID '${modelId}' does not exist for tool '${toolId}'.`,
    );

  const inputCost =
    inputTokensMillions * model.inputCostPerMillion;
  const outputCost =
    outputTokensMillions * model.outputCostPerMillion;

  return inputCost + outputCost;
}
