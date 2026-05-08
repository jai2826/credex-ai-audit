const USD_TO_INR = parseFloat(
  process.env.EXCHANGE_RATE_USD_TO_INR!,
); 


export function normalizeToUSD(
  amount: number,
  currency: "USD" | "INR",
): number {
  return currency === "INR" ? amount / USD_TO_INR : amount;
}

export function convertToDisplay(
  amount: number,
  targetCurrency: "USD" | "INR",
): number {
  return targetCurrency === "INR"
    ? amount * USD_TO_INR
    : amount;
}
