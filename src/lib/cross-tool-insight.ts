// src/lib/calculators/cross-tool-rules.ts
//
// Hardcoded cross-tool rules. No AI. Pure if/else.
// Called AFTER calculateGlobalAudit() — it gets the full picture of everything
// the user is paying for and their use case, then finds what per-tool calculators can't.
//
// Rules:
//   1. REDUNDANCY          — paying for two SaaS tools that do the same job
//   2. USE CASE MISMATCH   — SaaS plan's bestFor doesn't match the user's use case
//   3. OVERPAY vs OFFICIAL — user-reported spend is higher than official pricing
//   4. API REDUNDANCY      — paying for two API providers with overlapping capability
//   5. CROSS-VENDOR MODEL  — cheaper model in a different provider fits the use case better

import { API_PRICING_DB, SAAS_PRICING_DB } from "@/lib/db";
import type { ApiInput, ApiProviderKey, AuditInput, SaasInput, UseCaseType } from "@/lib/types";

export interface CrossToolFinding {
  affectedTools: string[];
  finding: string;        // what's wrong — 1 sentence
  recommendation: string; // what to do — 1 sentence
  monthlySaving: number;  // USD — hardcoded math only, no AI
}

// ─── RULE 1: SAAS REDUNDANCY ─────────────────────────────────────────────────
// Tool pairs that do the same job. Having both is waste regardless of use case.

const REDUNDANT_PAIRS: { tools: string[]; reason: string; keepLabel: string }[] = [
  {
    tools: ["cursor", "copilot"],
    reason: "Cursor and GitHub Copilot are both AI coding assistants — you're paying for the same capability twice.",
    keepLabel: "Cursor (includes chat, generation, and inline completion)",
  },
  {
    tools: ["chatgpt", "claude"],
    reason: "ChatGPT and Claude heavily overlap for writing and research — most teams consolidate to one primary assistant.",
    keepLabel: "whichever your team uses more (check actual usage before cutting)",
  },
];

function checkRedundancy(inputs: SaasInput[]): CrossToolFinding[] {
  const findings: CrossToolFinding[] = [];
  const toolIds = new Set(inputs.map((i) => i.toolId));

  for (const pair of REDUNDANT_PAIRS) {
    const overlap = pair.tools.filter((t) => toolIds.has(t as SaasInput["toolId"]));
    if (overlap.length < 2) continue;

    // Drop the cheaper one — it's likely the secondary/underused tool
    const overlapInputs = [...inputs.filter((i) => overlap.includes(i.toolId))];
    overlapInputs.sort((a, b) => a.spend - b.spend);
    const redundantTool = overlapInputs[0];

    findings.push({
      affectedTools: overlap,
      finding: pair.reason,
      recommendation: `Drop ${redundantTool.toolId} ($${redundantTool.spend}/mo), keep ${pair.keepLabel}.`,
      monthlySaving: redundantTool.spend,
    });
  }

  return findings;
}

// ─── RULE 2: SAAS USE CASE MISMATCH ──────────────────────────────────────────
// The user's primary use case isn't in the plan's bestFor list.
// Uses bestFor directly from SAAS_PRICING_DB — no separate lookup table needed.

function checkUseCaseTypeMismatch(inputs: SaasInput[], useCase: UseCaseType[]): CrossToolFinding[] {
  const findings: CrossToolFinding[] = [];

  for (const input of inputs) {
    const toolData = SAAS_PRICING_DB[input.toolId];
    if (!toolData) continue;

    const plan = toolData.plans.find((p) => p.name === input.plan);
    if (!plan) continue;

    // "mixed" users are never mismatched — they use everything
    const isMatch = plan.bestFor.some((bestFor) => useCase.includes(bestFor)) || useCase.includes("mixed");
    if (isMatch) continue;

    // Check if they already have a better-matched tool in their stack
    const betterTool = inputs.find(
      (other) =>
        other.toolId !== input.toolId &&
        SAAS_PRICING_DB[other.toolId]?.plans
          .find((p) => p.name === other.plan)
          ?.bestFor.some((bestFor) => useCase.includes(bestFor))
    );

    const recommendation = betterTool
      ? `You already pay for ${SAAS_PRICING_DB[betterTool.toolId].name} which fits ${useCase.join("/")} better — consider whether ${toolData.name} is still needed.`
      : `${toolData.name} is built for ${plan.bestFor.join("/")} workloads. For ${useCase.join("/")}, evaluate a purpose-built alternative.`;

    findings.push({
      affectedTools: [input.toolId],
      finding: `You're paying for ${toolData.name} ${input.plan} ($${input.spend}/mo) but your primary use case is ${useCase.join("/")} — this plan is optimised for ${plan.bestFor.join("/")} workloads.`,
      recommendation,
      monthlySaving: 0, // can't claim savings without knowing what they'd switch to
    });
  }

  return findings;
}

// ─── RULE 3: OVERPAY vs OFFICIAL PRICE ───────────────────────────────────────
// User-reported spend is more than officialPrice × seats.
// Catches ghost seats, stale contracts, and hidden add-ons.
// NOTE: Gemini and ChatGPT are priced in INR — skip USD comparison for them.

const INR_TOOLS = new Set(["gemini", "chatgpt"]);

function checkOverpayVsOfficial(inputs: SaasInput[]): CrossToolFinding[] {
  const findings: CrossToolFinding[] = [];

  for (const input of inputs) {
    // Skip INR-priced tools — can't compare against USD spend reliably
    if (INR_TOOLS.has(input.toolId)) continue;

    const toolData = SAAS_PRICING_DB[input.toolId];
    if (!toolData) continue;

    const plan = toolData.plans.find(
      (p) => p.name.toLowerCase() === input.plan.toLowerCase()
    );
    // Skip free plans and Enterprise (costPerUser: 0 = custom pricing)
    if (!plan || plan.costPerUser === 0) continue;

    const officialMonthlyCost = plan.costPerUser * input.seats;
    const overpay = input.spend - officialMonthlyCost;

    // Only flag if paying >15% above official — filters out rounding noise
    if (overpay <= 0 || overpay / officialMonthlyCost < 0.15) continue;

    findings.push({
      affectedTools: [input.toolId],
      finding: `You reported paying $${input.spend}/mo for ${toolData.name} ${input.plan} (${input.seats} seats), but official pricing is $${officialMonthlyCost}/mo — a $${overpay.toFixed(0)}/mo gap.`,
      recommendation: `Audit your ${toolData.name} billing — likely causes: ghost seats, an annual contract locked at old rates, or unused add-ons.`,
      monthlySaving: overpay,
    });
  }

  return findings;
}

// ─── RULE 4: API REDUNDANCY ───────────────────────────────────────────────────
// More than one API provider in the stack.
// We flag it but set saving to 0 — we don't know which models are truly replaceable.

function checkApiRedundancy(inputs: ApiInput[]): CrossToolFinding[] {
  if (inputs.length < 2) return [];

  const providers = inputs.map((i) => i.toolId);
  // Sort without mutating the original array
  const sorted = [...inputs].sort((a, b) => a.spend - b.spend);
  const smallest = sorted[0];

  return [
    {
      affectedTools: providers,
      finding: `You're paying for ${providers.length} separate API providers (${providers.join(", ")}) — most teams consolidate to one.`,
      recommendation: `Evaluate whether ${smallest.toolId} ($${smallest.spend}/mo) can be replaced by your primary provider before the next billing cycle.`,
      monthlySaving: 0, // conservative — model capabilities may not overlap perfectly
    },
  ];
}

// ─── RULE 5: CROSS-VENDOR MODEL ALTERNATIVE ──────────────────────────────────
// Looks up the cheapest model across ALL other providers that:
//   a) fits the user's use case via bestFor
//   b) is from a provider the user isn't already paying for
//   c) is cheaper than their current model on input cost
//
// Fully dynamic — no hardcoded model names.
// Stays in sync with API_PRICING_DB automatically when models are added/removed.

function checkCrossVendorAlternative(
  inputs: ApiInput[],
  useCase: UseCaseType[]
): CrossToolFinding[] {
  const findings: CrossToolFinding[] = [];
  const existingProviders = new Set(inputs.map((i) => i.toolId));

  for (const input of inputs) {
    const currentModels = API_PRICING_DB[input.toolId];
    if (!currentModels) continue;

    const currentModel = currentModels.find((m) => m.modelId === input.modelId);
    if (!currentModel) continue;

    // Find the cheapest matching model from a provider they're not already using
    let bestAlternative: {
      toolId: ApiProviderKey;
      model: (typeof currentModels)[number];
    } | null = null;

    for (const [toolId, models] of Object.entries(API_PRICING_DB)) {
      if (existingProviders.has(toolId as ApiProviderKey)) continue;

      const candidates = models.filter(
        (m) => m.bestFor.some((bestFor) => useCase.includes(bestFor)) || useCase.includes("mixed")
      );

      for (const candidate of candidates) {
        const isCheaper =
          candidate.inputCostPerMillion < currentModel.inputCostPerMillion;
        const isBestSoFar =
          !bestAlternative ||
          candidate.inputCostPerMillion < bestAlternative.model.inputCostPerMillion;

        if (isCheaper && isBestSoFar) {
          bestAlternative = {
            toolId: toolId as ApiProviderKey,
            model: candidate,
          };
        }
      }
    }

    if (!bestAlternative) continue;

    const savingPerMillion =
      currentModel.inputCostPerMillion - bestAlternative.model.inputCostPerMillion;

    findings.push({
      affectedTools: [input.toolId],
      finding: `You're using ${currentModel.modelName} ($${currentModel.inputCostPerMillion}/M input) for ${useCase.join("/")} tasks — a cheaper alternative exists.`,
      recommendation: `${bestAlternative.model.modelName} (${bestAlternative.toolId}) costs $${bestAlternative.model.inputCostPerMillion}/M input — $${savingPerMillion.toFixed(2)} cheaper per million tokens for the same use case.`,
      monthlySaving: 0, // can't calculate exact saving without token volume
    });
  }

  return findings;
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function calculateCrossToolFindings(
  inputs: AuditInput[],
  useCase: UseCaseType[]
): CrossToolFinding[] {
  const saasInputs = inputs.filter((i): i is SaasInput => i.type === "saas");
  const apiInputs = inputs.filter((i): i is ApiInput => i.type === "api");

  return [
    ...checkRedundancy(saasInputs),
    ...checkUseCaseTypeMismatch(saasInputs, useCase),
    ...checkOverpayVsOfficial(saasInputs),
    ...checkApiRedundancy(apiInputs),
    ...checkCrossVendorAlternative(apiInputs, useCase),
  ];
}