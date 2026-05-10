import { OptimizationResult } from "./types";

export function downloadCSV(
  results: OptimizationResult[],
  totalSavings: number,
) {
  // 1. Define the CSV Headers
  const headers = [
    "Tool",
    "Type",
    "Current Spend ($)",
    "Optimized Spend ($)",
    "Monthly Savings ($)",
    "Annual Savings ($)",
    "Recommendation",
    "Rationale",
  ];

  // 2. Map the data into rows
  const rows = results.map((r) => {
    const optimizedSpend =
      r.currentMonthlySpend - r.monthlySavings;
    const recommendation =
      r.type === "saas"
        ? `${r.recommendedSeats} seats on ${r.recommendedPlan}`
        : `Model: ${r.recommendedModel} (Batch: ${r.batchDiscountPercentage * 100}%)`;

    return [
      r.toolId,
      r.type,
      r.currentMonthlySpend.toFixed(2),
      optimizedSpend.toFixed(2),
      r.monthlySavings.toFixed(2),
      r.annualSavings.toFixed(2),
      `"${recommendation}"`, // Wrap in quotes to prevent comma splitting
      `"${r.rationale.replace(/"/g, '""')}"`, // Escape inner quotes
    ].join(",");
  });

  // 3. Add a total row at the bottom
  rows.push(
    [
      '"TOTAL SAVINGS"',
      "", // Type
      "", // Current Spend
      "", // Optimized Spend
      totalSavings.toFixed(2), // Monthly Savings
      (totalSavings * 12).toFixed(2), // Annual Savings
      "", // Recommendation
      "", // Rationale
    ].join(","),
  );
  // 4. Combine and trigger download
  const csvContent = [headers.join(","), ...rows].join(
    "\n",
  );
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `credex-ai-audit-${new Date().toISOString().split("T")[0]}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
