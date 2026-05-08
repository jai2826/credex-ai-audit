// THIS IS YOUR SOURCE OF TRUTH.

import { calculateChatGPTToolOptimization } from "@/lib/calculators/chatgpt";
import {
  calculateClaudeApiOptimization,
  calculateClaudeToolOptimization,
} from "@/lib/calculators/claude";
import { calculateCopilotOptimization } from "@/lib/calculators/copilot";
import { calculateCursorOptimization } from "@/lib/calculators/cursor";
import {
  calculateGeminiApiOptimization,
  calculateGeminiToolOptimization,
} from "@/lib/calculators/gemini";
import { calculateOpenAiApiOptimization } from "@/lib/calculators/openai";
import { calculateV0ToolOptimization } from "@/lib/calculators/v0";
import { convertToDisplay } from "@/lib/currency";
import { SAAS_PRICING_DB } from "@/lib/db";
import {
  ApiOptimization,
  AuditInput,
  CurrencyType,
  OptimizationResult,
  SaasKey,
  SaasOptimization,
} from "@/lib/types";

interface GlobalAuditResult {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  currency: CurrencyType;
  individualResults: OptimizationResult[];
}

export function calculateToolOptimization(
  toolId: SaasKey,
  currentPlanName: string,
  currentSeats: number,
  currentMonthlySpend: number,
): SaasOptimization {
  // 1. Fetch the official pricing from our SAAS_PRICING_DB
  const toolData = SAAS_PRICING_DB[toolId];
  if (!toolData) {
    throw new Error(
      `Pricing data not found for tool: ${toolId}`,
    );
  }

  switch (toolId) {
    case "claude":
      return calculateClaudeToolOptimization(
        currentPlanName,
        currentSeats,
        currentMonthlySpend,
      );

    case "cursor":
      return calculateCursorOptimization(
        currentPlanName,
        currentSeats,
        currentMonthlySpend,
      );
    case "copilot":
      return calculateCopilotOptimization(
        currentPlanName,
        currentSeats,
        currentMonthlySpend,
      );
    case "chatgpt":
      return calculateChatGPTToolOptimization(
        currentPlanName,
        currentSeats,
        currentMonthlySpend,
      );
    case "gemini":
      return calculateGeminiToolOptimization(
        currentPlanName,
        currentSeats,
        currentMonthlySpend,
      );
    case "v0":
      return calculateV0ToolOptimization(
        currentPlanName,
        currentSeats,
        currentMonthlySpend,
      );

    default:
      throw new Error(
        `Optimization logic not yet implemented for: ${toolId}`,
      );
  }
}

export function calculateApiOptimization(
  providerKey: string, // e.g., 'claude_api'
  modelId: string, // e.g., 'claude_opus_4_7'
  monthlyInputTokens: number, // IN MILLIONS (e.g., 50 for 50M tokens)
  monthlyOutputTokens: number, // IN MILLIONS
  isLatencyCritical: boolean, // Does the user NEED real-time responses?
  useCase: string, // e.g., "customer support chatbot", "internal knowledge base", etc.
  currentMonthlySpend: number, // User's current monthly spend on this API
): ApiOptimization {
  switch (providerKey) {
    case "claude_api":
      return calculateClaudeApiOptimization(
        providerKey,
        modelId,
        monthlyInputTokens,
        monthlyOutputTokens,
        currentMonthlySpend,
        isLatencyCritical,
        useCase,
      );
    case "openai_api":
      return calculateOpenAiApiOptimization(
        providerKey,
        modelId,
        monthlyInputTokens,
        monthlyOutputTokens,
        currentMonthlySpend,
        isLatencyCritical,
        useCase,
      );
    case "gemini_api":
      return calculateGeminiApiOptimization(
        providerKey,
        modelId,
        monthlyInputTokens,
        monthlyOutputTokens,
        currentMonthlySpend,
        isLatencyCritical,
        useCase,
      );

    default:
      throw new Error(
        `Optimization logic not yet implemented for: ${providerKey}`,
      );
  }
}

export function calculateGlobalAudit(
  userInputs: AuditInput[],
  preferredCurrency: CurrencyType = "USD",
): GlobalAuditResult {
  const individualResults: OptimizationResult[] = [];
  let totalMonthlySavingsUSD = 0;

  for (const input of userInputs) {
    try {
      let result: OptimizationResult;

      switch (input.type) {
        case "tool":
          result = calculateToolOptimization(
            input.toolId,
            input.plan,
            input.seats,
            input.spend,
          );
          break;
        case "api":
          // Use the ROUTER, not a specific calculator
          result = calculateApiOptimization(
            input.providerKey,
            input.modelId,
            input.inputTokens,
            input.outputTokens,
            input.isLatencyCritical,
            input.useCase,
            input.spend,
          );
          break;
        default:
          continue;
      }

      individualResults.push(result);
      totalMonthlySavingsUSD += result.monthlySavings;
    } catch (error) {
      console.error(
        `Audit failed for ${input.toolId}:`,
        error,
      );
    }
  }

  // Final step: Normalize the totals for the UI
  return {
    totalMonthlySavings: convertToDisplay(
      totalMonthlySavingsUSD,
      preferredCurrency,
    ),
    totalAnnualSavings: convertToDisplay(
      totalMonthlySavingsUSD * 12,
      preferredCurrency,
    ),
    currency: preferredCurrency,
    individualResults,
  };
}
