import { describe, expect, it } from "vitest";
import { calculateV0ToolOptimization } from "@/lib/calculators/v0";
import { calculateOpenAiApiOptimization } from "@/lib/calculators/openai";

describe("v0 SaaS Calculator Engine", () => {
  it("should catch the Vercel ghost-seat trap for under-utilized Team plans", () => {
    // Team plan has minSeats: 2. Inputting 1 seat triggers the trap.
    const result = calculateV0ToolOptimization("Team", 1, 60);

    expect(result.recommendedPlan).toBe("Premium");
    expect(result.monthlySavings).toBe(40); // 60 - 20 = 40
    expect(result.rationale).toContain("requires a minimum of 2 seats");
  });

  it("should report zero savings if the team meets seat minimums", () => {
    const result = calculateV0ToolOptimization("Team", 3, 90);
    expect(result.monthlySavings).toBe(0);
  });

  it("should throw an error if a garbage plan name is passed", () => {
    expect(() => calculateV0ToolOptimization("Fake", 1, 100)).toThrow();
  });
});

describe("OpenAI API Calculator Engine", () => {
  
  // We use "gpt-4.0" as it matches your db.ts dot-notation
  const TEST_MODEL = "gpt-5.4"; 

  it("should apply batch discount when latency is NOT critical", () => {
    const result = calculateOpenAiApiOptimization(
      "openai_api",
      TEST_MODEL, 
      10, // 10M input
      2,  // 2M output
      110, // current spend
      false, // NOT critical -> Batch applies
      "research"
    );

    expect(result.batchDiscountPercentage).toBe(0.5);
    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(result.rationale).toContain("Batch API");
  });

  it("should charge full price when latency IS critical", () => {
    const result = calculateOpenAiApiOptimization(
      "openai_api",
      TEST_MODEL,
      10,
      2,
      32.50,
      true, // IS critical -> No batch
      "coding"
    );

    expect(result.batchDiscountPercentage).toBe(0);
    expect(result.monthlySavings).toBe(0);
    expect(result.rationale).toContain("Synchronous execution required");
  });

  it("should throw an error if a fake model ID is passed", () => {
    expect(() =>
      calculateOpenAiApiOptimization(
        "openai_api",
        "invalid-id",
        1,
        1,
        10,
        false,
        "mixed"
      )
    ).toThrow(/not found/);
  });
});