import {
    ApiModelPricing,
    SaasKey,
    ToolPricing,
} from "@/lib/types";

export const SAAS_PRICING_DB: Record<SaasKey, ToolPricing> =
  {
    claude: {
      id: "claude",
      name: "Claude",
      plans: [
        {
          name: "Free",
          costPerUser: 0,
          minSeats: 1,
          currency: "USD",
          bestFor: ["writing", "research", "mixed"],
        },
        {
          name: "Pro",
          costPerUser: 20,
          minSeats: 1,
          currency: "USD",
          bestFor: ["writing", "research", "mixed"],
        },
        {
          name: "Max",
          costPerUser: 100,
          minSeats: 1,
          currency: "USD",
          bestFor: ["writing", "research", "data", "mixed"],
        },
        {
          name: "Team Standard",
          costPerUser: 25,
          minSeats: 5,
          currency: "USD",
          bestFor: ["writing", "research", "mixed"],
        },
        {
          name: "Team Premium",
          costPerUser: 125,
          minSeats: 5,
          currency: "USD",
          bestFor: ["writing", "research", "data", "mixed"],
        },
      ],
    },

    cursor: {
      id: "cursor",
      name: "Cursor",
      plans: [
        {
          name: "Hobby",
          costPerUser: 0,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
        {
          name: "Pro",
          costPerUser: 20,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
        {
          name: "Pro+",
          costPerUser: 60,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
        {
          name: "Ultra",
          costPerUser: 200,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
        {
          name: "Teams",
          costPerUser: 40,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
        {
          name: "Enterprise",
          costPerUser: 0,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
      ],
    },

    copilot: {
      id: "copilot",
      name: "GitHub Copilot",
      plans: [
        {
          name: "Free",
          costPerUser: 0,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
        {
          name: "Pro",
          costPerUser: 10,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
        {
          name: "Pro+",
          costPerUser: 39,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
        {
          name: "Business",
          costPerUser: 19,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
        {
          name: "Enterprise",
          costPerUser: 39,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
      ],
    },

    // NOTE: INR Pricing
    gemini: {
      id: "gemini",
      name: "Google Gemini",
      plans: [
        {
          name: "Free",
          costPerUser: 0,
          minSeats: 1,
          currency: "INR",
          bestFor: ["research", "mixed"],
        },
        {
          name: "Google AI Plus",
          costPerUser: 399,
          minSeats: 1,
          currency: "INR",
          bestFor: ["research", "data", "mixed"],
        },
        {
          name: "Google AI Pro",
          costPerUser: 1950,
          minSeats: 1,
          currency: "INR",
          bestFor: ["research", "data", "mixed"],
        },
        {
          name: "Google AI Ultra",
          costPerUser: 24500,
          minSeats: 1,
          currency: "INR",
          bestFor: ["research", "data", "mixed"],
        },
      ],
    },

    // NOTE: INR Pricing
    chatgpt: {
      id: "chatgpt",
      name: "ChatGPT",
      plans: [
        {
          name: "Free",
          costPerUser: 0,
          minSeats: 1,
          currency: "INR",
          bestFor: ["writing", "mixed"],
        },
        {
          name: "Go",
          costPerUser: 399,
          minSeats: 1,
          currency: "INR",
          bestFor: ["writing", "mixed"],
        },
        {
          name: "Plus",
          costPerUser: 1999,
          minSeats: 1,
          currency: "INR",
          bestFor: ["writing", "research", "mixed"],
        },
        {
          name: "Pro",
          costPerUser: 10699,
          minSeats: 1,
          currency: "INR",
          bestFor: ["writing", "research", "data", "mixed"],
        },
        {
          name: "Business ChatGPT & Codex",
          costPerUser: 1800,
          minSeats: 1,
          currency: "INR",
          bestFor: ["writing", "coding", "mixed"],
        },
      ],
    },

    v0: {
      id: "v0",
      name: "v0",
      plans: [
        {
          name: "Free",
          costPerUser: 0,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
        {
          name: "Premium",
          costPerUser: 20,
          minSeats: 1,
          currency: "USD",
          bestFor: ["coding"],
        },
        {
          name: "Team",
          costPerUser: 30,
          minSeats: 2,
          currency: "USD",
          bestFor: ["coding"],
        },
        {
          name: "Business",
          costPerUser: 100,
          minSeats: 5,
          currency: "USD",
          bestFor: ["coding"],
        },
      ],
    },
  } as const;

export const API_PRICING_DB: Record<
  string,
  ApiModelPricing[]
> = {
  anthropic_api: [
    {
      modelId: "claude_opus_4.7",
      modelName: "Opus 4.7",
      inputCostPerMillion: 5.0,
      outputCostPerMillion: 25.0,
      batchDiscountPercentage: 0.5,
      bestFor: ["research", "data", "mixed"], // Deep reasoning, complex analysis
    },
    {
      modelId: "claude_sonnet_4.6",
      modelName: "Sonnet 4.6",
      inputCostPerMillion: 3.0,
      outputCostPerMillion: 15.0,
      batchDiscountPercentage: 0.5,
      bestFor: ["writing", "coding", "research", "mixed"], // Best balance — most use cases
    },
    {
      modelId: "claude_haiku_4.5",
      modelName: "Haiku 4.5",
      inputCostPerMillion: 1.0,
      outputCostPerMillion: 5.0,
      batchDiscountPercentage: 0.5,
      bestFor: ["writing", "mixed"], // Fast, cheap — simple classification, summarisation, drafts
    },
  ],

  openai_api: [
    {
      modelId: "gpt-5.5",
      modelName: "GPT-5.5",
      inputCostPerMillion: 0.5,
      outputCostPerMillion: 30.0,
      batchDiscountPercentage: 0.5,
      bestFor: ["research", "data", "mixed"], 
    },
    {
      modelId: "gpt-5.4",
      modelName: "GPT-5.4",
      inputCostPerMillion: 0.25,
      outputCostPerMillion: 15.0,
      batchDiscountPercentage: 0.5,
      bestFor: [
        "coding",
        "writing",
        "research",
        "data",
        "mixed",
      ], // Balanced workhorse
    },
    {
      modelId: "gpt-5.4-mini",
      modelName: "GPT-5.4 Mini",
      inputCostPerMillion: 0.075,
      outputCostPerMillion: 4.5,
      batchDiscountPercentage: 0.5,
      bestFor: ["writing", "mixed"], // High volume, simple tasks
    },
    {
      modelId: "gpt-5.4-nano",
      modelName: "GPT-5.4 Nano",
      inputCostPerMillion: 0.02,
      outputCostPerMillion: 1.25,
      batchDiscountPercentage: 0.5,
      bestFor: [],
    },

  ],

  gemini_api: [
    {
      modelId: "gemini-embedding-2",
      modelName: "Gemini Embedding 2",
      inputCostPerMillion: 0.2,
      outputCostPerMillion: 0,
      batchDiscountPercentage: 0,
      bestFor: ["data", "research"], // Embeddings — search, RAG, similarity — not text generation
    },

    {
      modelId: "gemini-3.1-pro-preview",
      modelName: "Gemini 3.1 Pro Preview",
      inputCostPerMillion: 2.0,
      outputCostPerMillion: 12.0,
      batchDiscountPercentage: 0.5,
      bestFor: ["research", "data", "writing", "mixed"], // Strong multimodal reasoning
    },
    {
      modelId: "gemini-3.1-flash-preview",
      modelName: "Gemini 3.1 Flash Preview",
      inputCostPerMillion: 0.75,
      outputCostPerMillion: 4.5,
      batchDiscountPercentage: 0,
      bestFor: ["writing", "coding", "mixed"], // Fast, cheap, good enough for most tasks
    },
    {
      modelId: "gemini-3.1-flash-lite-preview",
      modelName: "Gemini 3.1 Flash Lite Preview",
      inputCostPerMillion: 0.25,
      outputCostPerMillion: 1.5,
      batchDiscountPercentage: 0.5,
      bestFor: ["writing", "mixed"], // Highest volume, simplest tasks — cheapest in the DB
    },
    {
      modelId: "gemini-3.1-flash-image-preview",
      modelName: "Gemini 3.1 Flash Image Preview",
      inputCostPerMillion: 0.5,
      outputCostPerMillion: 3.0,
      batchDiscountPercentage: 0.5,
      bestFor: ["data", "mixed"], // Image understanding at low cost
    },
  ],
};
