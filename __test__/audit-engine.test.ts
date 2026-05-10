import { calculateOpenAiApiOptimization } from "@/lib/calculators/openai";
import { describe, expect, it } from "vitest";
import { calculateV0ToolOptimization } from "../src/lib/calculators/v0";

describe("v0 SaaS Calculator Engine", () => {
  it("should catch the Vercel ghost-seat trap for under-utilized Team plans", () => {
    // Scenario: A solo dev buys the Team plan, which forces a 2-seat minimum.
    // They input 1 seat, but their forced spend is actually $60 (2 min seats * $30).
    const result = calculateV0ToolOptimization(
      "Team",
      1,
      60,
    );

    expect(result.recommendedPlan).toBe("Premium");
    expect(result.monthlySavings).toBeGreaterThan(0);
    // Forced minimum ($60) minus Premium cost for 1 seat ($20) = $40 savings
    expect(result.monthlySavings).toBe(40);
    expect(result.rationale).toContain(
      "paying for ghost seats",
    );
  });
  it("should not recommend changes if the team meets the seat minimums", () => {
    // Scenario: A real team of 3 using the Team plan ($30/mo * 3 = $90).
    const result = calculateV0ToolOptimization(
      "Team",
      3,
      90,
    );

    // We EXPECT the engine to leave them alone.
    expect(result.recommendedPlan).toBe("Team");
    expect(result.monthlySavings).toBe(0);
  });

  it("should throw an error if a garbage plan name is passed", () => {
    // We EXPECT the system to hard fail, not silently return bad math.
    expect(() =>
      calculateV0ToolOptimization("FakePlan", 1, 100),
    ).toThrow();
  });
});
describe("OpenAI API Calculator Engine", () => {
  it("should apply a 50% discount when latency is NOT critical (Batch API)", () => {
    // Scenario: A background data extraction job processing 10M input tokens and 2M output tokens on GPT-5.5.
    // GPT-5.5 standard cost: $5/M input, $30/M output.
    // Standard total: (10 * 5) + (2 * 30) = $50 + $60 = $110.
    // With 50% batch discount: Cost should drop to $55. Savings should be $55.

    const result = calculateOpenAiApiOptimization(
      "openai_api",
      "gpt_5_5",
      10, // 10 Million input tokens
      2, // 2 Million output tokens
      110, // They are currently paying the standard $110 synchronous rate
      false, // LATENCY IS NOT CRITICAL -> Trigger Batch Discount
      "Bulk Data Extraction",
    );

    expect(result.batchDiscountPercentage).toBe(0.5); // Proves the 50% discount was applied
    expect(result.monthlySavings).toBe(55); // $110 - $55 = $55
    expect(result.rationale).toContain("Batch API");
  });

  it("should charge full price when latency IS critical", () => {
    // Scenario: A real-time customer support chatbot using the exact same token volume.
    // Standard total: $110.

    const result = calculateOpenAiApiOptimization(
      "openai_api",
      "gpt_5_5",
      10,
      2,
      110,
      true, // LATENCY IS CRITICAL -> No discount
      "Customer Support Chatbot",
    );

    expect(result.batchDiscountPercentage).toBe(0); // Proves no discount was applied
    expect(result.monthlySavings).toBe(0); // No savings possible
    expect(result.rationale).toContain(
      "Synchronous execution required",
    );
  });

  it("should throw an error if a fake model ID is passed", () => {
    expect(() =>
      calculateOpenAiApiOptimization(
        "openai_api",
        "fake_model",
        1,
        1,
        10,
        false,
        "Test",
      ),
    ).toThrow();
  });
});
