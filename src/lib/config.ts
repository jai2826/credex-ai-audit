import { API_PRICING_DB, SAAS_PRICING_DB } from "@/lib/db";
import type { ApiProviderKey, SaasKey } from "@/lib/types";

// The Registry maps UI concepts to Database keys.
const TOOL_REGISTRY: Record<string, { saas?: SaasKey; api?: ApiProviderKey; displayName?: string }> = {
  claude: { saas: "claude", api: "anthropic_api" },
  chatgpt: { saas: "chatgpt", api: "openai_api" },
  gemini: { saas: "gemini", api: "gemini_api" },
  cursor: { saas: "cursor" },
  copilot: { saas: "copilot" },
  v0: { saas: "v0" },
  anthropic_api: { api: "anthropic_api", displayName: "Anthropic API Direct" },
  openai_api: { api: "openai_api", displayName: "OpenAI API Direct" },
};

export type ToolConfigData = {
  name: string;
  supportsSaaS: boolean;
  supportsAPI: boolean;
  apiProviderKey?: ApiProviderKey;
  plans: string[];
  // NEW: Array of valid models with IDs and Display Names
  models: { id: string; name: string }[]; 
};

export const TOOLS_CONFIG: Record<string, ToolConfigData> = Object.entries(TOOL_REGISTRY).reduce(
  (acc, [uiKey, mapping]) => {
    const saasData = mapping.saas ? SAAS_PRICING_DB[mapping.saas] : null;
    const apiData = mapping.api ? API_PRICING_DB[mapping.api] : null;

    acc[uiKey] = {
      name: mapping.displayName || saasData?.name || uiKey.replace("_", " ").toUpperCase(),
      supportsSaaS: !!saasData,
      supportsAPI: !!apiData,
      apiProviderKey: mapping.api,
      plans: saasData ? saasData.plans.map((p) => p.name) : [],
      models: apiData ? apiData.map((m) => ({ id: m.modelId, name: m.modelName })) : [],
    };

    return acc;
  },
  {} as Record<string, ToolConfigData>

);

