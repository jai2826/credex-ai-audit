import {
  ApiModelPricing,
  SaasKey,
  ToolPricing,
} from "@/lib/types";




export const SAAS_PRICING_DB: Record<SaasKey, ToolPricing> =
  {
    // Latest price tool tools
    claude: {
      id: "claude",
      name: "Claude",
      plans: [
        {
          name: "Free",
          costPerUser: 0,
          minSeats: 1,
          currency: "USD",
        },
        {
          name: "Pro",
          costPerUser: 20,
          minSeats: 1,
          currency: "USD",
        },
        {
          name: "Max",
          costPerUser: 100,
          minSeats: 1,
          currency: "USD",
        },
        {
          name: "Team Standard",
          costPerUser: 25,
          minSeats: 5,
          currency: "USD",
        },
        {
          name: "Team Premium",
          costPerUser: 125,
          minSeats: 5,
          currency: "USD",
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
        },
        {
          name: "Pro",
          costPerUser: 20,
          minSeats: 1,
          currency: "USD",
        },
        {
          name: "Pro+",
          costPerUser: 60,
          minSeats: 1,
          currency: "USD",
        },
        {
          name: "Ultra",
          costPerUser: 200,
          minSeats: 1,
          currency: "USD",
        },
        {
          name: "Teams",
          costPerUser: 40,
          minSeats: 1,
          currency: "USD",
        },
        {
          name: "Enterprise",
          costPerUser: 0,
          minSeats: 1,
          currency: "USD",
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
        },
        {
          name: "Pro",
          costPerUser: 10,
          minSeats: 1,
          currency: "USD",
        },
        {
          name: "Pro+",
          costPerUser: 39,
          minSeats: 1,
          currency: "USD",
        },
        {
          name: "Business",
          costPerUser: 19,
          minSeats: 1,
          currency: "USD",
        },
        {
          name: "Enterprise",
          costPerUser: 39,
          minSeats: 1,
          currency: "USD",
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
        },
        {
          name: "Google AI Plus",
          costPerUser: 399,
          minSeats: 1,
          currency: "INR",
        },
        {
          name: "Google AI Pro",
          costPerUser: 1950,
          minSeats: 1,
          currency: "INR",
        },
        {
          name: "Google AI Ultra",
          costPerUser: 24500,
          minSeats: 1,
          currency: "INR",
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
        },
        {
          name: "Go",
          costPerUser: 399,
          minSeats: 1,
          currency: "INR",
        },
        {
          name: "Plus",
          costPerUser: 1999,
          minSeats: 1,
          currency: "INR",
        },
        {
          name: "Pro",
          costPerUser: 10699,
          minSeats: 1,
          currency: "INR",
        },
        // {
        //   name: "Business Codex",
        //   costPerUser: 0,
        //   minSeats: 1,
        //   currency:"INR"
        // },
        {
          name: "Business ChatGPT & Codex",
          costPerUser: 1800,
          minSeats: 1,
          currency: "INR",
        },
        // {
        //   name: "Enterprise",
        //   costPerUser: 0,
        //   minSeats: 1,
        //   currency: "INR"
        // },
      ],
    },
    //NOTE: These are incomplete dummies, you need to fill in the real pricing data for each tool and their plans from your research. The engine relies on this data to be accurate, so make sure to double-check! The structure should be consistent: each tool has an array of plans, and each plan has a name, costPerUser, and minSeats.

    v0: {
      id: "v0",
      name: "v0",
      plans: [
        {
          name: "Free",
          costPerUser: 0,
          minSeats: 1,
          currency: "USD",
        },
        {
          name: "Premium",
          costPerUser: 20,
          minSeats: 1,
          currency: "USD",
        },
        {
          name: "Team",
          costPerUser: 30,
          minSeats: 2,
          currency: "USD",
        },
        {
          name: "Business",
          costPerUser: 100,
          minSeats: 5,
          currency: "USD",
        },
      ],
    },

    // APIs are variable, but we define their base state for the engine
  } as const;

export const API_PRICING_DB: Record<
  string,
  ApiModelPricing[]
> = {
  claude_api: [
    {
      modelId: "claude_opus_4.7",
      modelName: "Opus 4.7",
      inputCostPerMillion: 5.0,
      outputCostPerMillion: 25.0,
      batchDiscountPercentage: 0.5,
    },
    {
      modelId: "claude_sonnet_4.6",
      modelName: "Sonnet 4.6",
      inputCostPerMillion: 3.0,
      outputCostPerMillion: 15.0,
      batchDiscountPercentage: 0.5,
    },
    {
      modelId: "claude_haiku_4.5",
      modelName: "Haiku 4.5",
      inputCostPerMillion: 1.0,
      outputCostPerMillion: 5.0,
      batchDiscountPercentage: 0.5,
    },
  ],
  openai_api: [
    {
      modelId: "gpt_5_5",
      modelName: "GPT-5.5",
      inputCostPerMillion: 5.0,
      outputCostPerMillion: 30.0,
      batchDiscountPercentage: 0.5,
    },
    {
      modelId: "gpt_5_4",
      modelName: "GPT-5.4",
      inputCostPerMillion: 2.5,
      outputCostPerMillion: 15.0,
      batchDiscountPercentage: 0.5,
    },
    {
      modelId: "gpt_5_4_mini",
      modelName: "GPT-5.4 Mini",
      inputCostPerMillion: 0.75,
      outputCostPerMillion: 4.5,
      batchDiscountPercentage: 0.5,
    },
    {
      modelId: "gpt_realtime_1_5_audio",
      modelName: "GPT-Realtime-1.5 Audio",
      inputCostPerMillion: 32.0,
      outputCostPerMillion: 64.0,
      batchDiscountPercentage: 0.5,
    },
    {
      modelId: "gpt_realtime_1_5_text",
      modelName: "GPT-Realtime-1.5 Text",
      inputCostPerMillion: 4.0,
      outputCostPerMillion: 16.0,
      batchDiscountPercentage: 0.5,
    },
    {
      modelId: "gpt_realtime_1_5_image",
      modelName: "GPT-Realtime-1.5 Image",
      inputCostPerMillion: 5.0,
      outputCostPerMillion: 0,
      batchDiscountPercentage: 0.5,
    },
    {
      modelId: "gpt_image_2_image",
      modelName: "GPT-Image-2 Image",
      inputCostPerMillion: 8.0,
      outputCostPerMillion: 30.0,
      batchDiscountPercentage: 0.5,
    },
    {
      modelId: "gpt_image_2_text",
      modelName: "GPT-Image-2 Text",
      inputCostPerMillion: 5.0,
      outputCostPerMillion: 0,
      batchDiscountPercentage: 0.5,
    },
  ],
  gemini_api: [
    {
      modelId: "gemini-embedding-2",
      modelName: "Gemini Embedding 2",
      inputCostPerMillion: 0.2,
      outputCostPerMillion: 0,
      batchDiscountPercentage: 0,
    },
    {
      modelId: "gemini-3.1-flash-tts-preview",
      modelName: "Gemini 3.1 Flash TTS Preview",
      inputCostPerMillion: 1,
      outputCostPerMillion: 20,
      batchDiscountPercentage: 0.5,
    },

    {
      modelId: "gemini-3.1-pro-preview",
      modelName: "Gemini 3.1 Pro Preview",
      inputCostPerMillion: 2.0,
      outputCostPerMillion: 12.0,
      batchDiscountPercentage: 0.5,
    },

    {
      modelId: "gemini_3.1_flash_preview",
      modelName: "Gemini 3.1 Flash Preview",
      inputCostPerMillion: 0.75,
      outputCostPerMillion: 4.5,
      batchDiscountPercentage: 0,
    },

    {
      modelId: "gemini-3.1-flash-lite-preview",
      modelName: "Gemini 3.1 Flash Lite Preview",
      inputCostPerMillion: 0.25,
      outputCostPerMillion: 1.5,
      batchDiscountPercentage: 0.5,
    },

    {
      modelId: "gemini-3.1-flash-image-preview",
      modelName: "Gemini 3.1 Flash Image Preview",
      inputCostPerMillion: 0.5,
      outputCostPerMillion: 3.0,
      batchDiscountPercentage: 0.5,
    },

    {
      modelId: "imagen-4.0-fast-generate-001",
      modelName: "Imagen 4 Fast",
      inputCostPerMillion: 0,
      outputCostPerMillion: 0.02,
      batchDiscountPercentage: 0,
    },

    {
      modelId: "imagen-4.0-generate-001",
      modelName: "Imagen 4 Standard",
      inputCostPerMillion: 0,
      outputCostPerMillion: 0.04,
      batchDiscountPercentage: 0,
    },

    {
      modelId: "imagen-4.0-ultra-generate-001",
      modelName: "Imagen 4 Ultra",
      inputCostPerMillion: 0,
      outputCostPerMillion: 0.06,
      batchDiscountPercentage: 0,
    },

    {
      modelId: "veo-3.1-generate-preview",
      modelName: "Veo 3.1 Standard",
      inputCostPerMillion: 0,
      outputCostPerMillion: 0.4,
      batchDiscountPercentage: 0,
    },

    {
      modelId: "veo-3.1-fast-generate-preview",
      modelName: "Veo 3.1 Fast",
      inputCostPerMillion: 0,
      outputCostPerMillion: 0.1,
      batchDiscountPercentage: 0,
    },

    {
      modelId: "veo-3.1-lite-generate-preview",
      modelName: "Veo 3.1 Lite",
      inputCostPerMillion: 0,
      outputCostPerMillion: 0.05,
      batchDiscountPercentage: 0,
    },

    {
      modelId: "lyria-3-clip-preview",
      modelName: "Lyria 3 Clip Preview",
      inputCostPerMillion: 0,
      outputCostPerMillion: 0.04,
      batchDiscountPercentage: 0,
    },

    {
      modelId: " lyria-3-pro-preview",
      modelName: "Lyria 3 Pro Preview",
      inputCostPerMillion: 0,
      outputCostPerMillion: 0.08,
      batchDiscountPercentage: 0,
    },
  ],
};
