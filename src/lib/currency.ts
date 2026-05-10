const FALLBACK_RATE = parseFloat(
  process.env.EXCHANGE_RATE_USD_TO_INR ?? "94.5"
);

let USD_TO_INR: number = FALLBACK_RATE;


export async function refreshExchangeRate(): Promise<void> {
  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`,
      { next: { revalidate: 86400 } } // Next.js: cache for 24h
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rate = data?.conversion_rates?.INR;
    if (typeof rate === "number" && rate > 0) {
      USD_TO_INR = rate;
    }
  } catch (err) {
    // Fail silently — module keeps using FALLBACK_RATE
    console.warn("[currency] Exchange rate fetch failed, using fallback:", FALLBACK_RATE, err);
  }
}

export function normalizeToUSD(amount: number, currency: "USD" | "INR"): number {
  return currency === "INR" ? amount / USD_TO_INR : amount;
}

export function convertToDisplay(amount: number, targetCurrency: "USD" | "INR"): number {
  return targetCurrency === "INR" ? amount * USD_TO_INR : amount;
}