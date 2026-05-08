export type SaasKey =
  | "cursor"
  | "copilot"
  | "claude"
  | "chatgpt"
  | "gemini"
  | "v0";

export type ApiProviderKey =
  | "anthropic"
  | "claude_api"
  | "openai_api"
  | "gemini_api";  

export type CombinedKey = SaasKey | ApiProviderKey;

export type CurrencyType = "USD" | "INR";

export interface Plan {
  name: string;
  costPerUser: number;
  minSeats: number;
  currency: CurrencyType;
}

export interface ToolPricing {
  id: SaasKey;
  name: string;
  plans: Plan[];
}

export interface ApiModelPricing {
  modelId: string;
  modelName: string;
  inputCostPerMillion: number;
  outputCostPerMillion: number;
  batchDiscountPercentage: number;
}

// Base interface for the fields that EVERY result must have
interface BaseOptimizationResult {
  toolId: CombinedKey;
  monthlySavings: number;
  annualSavings: number;
  rationale: string;
  currentMonthlySpend: number;
}

// Strict interface specifically for tool seat-based tools
export interface SaasOptimization extends BaseOptimizationResult {
  type: "tool";
  recommendedPlan: string;
  recommendedSeats: number;
}

// Strict interface specifically for API consumption tools
export interface ApiOptimization extends BaseOptimizationResult {
  type: "api";
  recommendedModel: string;
  inputCostPerMillion: number;
  outputCostPerMillion: number;
  batchDiscountPercentage: number;
}

// The Union: It must be exactly one or the other, never a messy combination of both
export type OptimizationResult =
  | SaasOptimization
  | ApiOptimization;

export type SaasInput = {
  type: "tool";
  toolId: SaasKey;
  plan: string;
  seats: number;
  spend: number;
};

export type ApiInput = {
  type: "api";
  toolId: ApiProviderKey; 
  providerKey: ApiProviderKey; 
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  spend: number;
  isLatencyCritical: boolean;
  useCase: string;
};

export type AuditInput = SaasInput | ApiInput;
