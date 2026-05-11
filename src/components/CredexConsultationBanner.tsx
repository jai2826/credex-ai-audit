"use client";

import { LeadCapture } from "@/components/LeadCapture";
import { Zap, ShieldCheck } from "lucide-react";

interface CredexConsultationBannerProps {
  totalSavings: number;
}

export function CredexConsultationBanner({
  totalSavings,
}: CredexConsultationBannerProps) {
  const isHighSavings = totalSavings >= 500;

  return (
    <section
      className={`w-full max-w-6xl mx-auto rounded-xl border p-6 md:p-10 mb-12 flex flex-col gap-8 print:hidden transition-colors ${
        isHighSavings
          ? "bg-slate-900 border-slate-800 shadow-lg"
          : "bg-white border-slate-200 shadow-sm"
      }`}>
      {/* 1. The Header & Pitch (Top) */}
      <div className="flex flex-col gap-4 text-center items-center">
        <div
          className={`p-3 rounded-full w-fit ${
            isHighSavings ? "bg-slate-800" : "bg-slate-100"
          }`}>
          {isHighSavings ? (
            <Zap className="w-8 h-8 text-emerald-400" />
          ) : (
            <ShieldCheck className="w-8 h-8 text-slate-500" />
          )}
        </div>

        <h2
          className={`text-2xl md:text-3xl font-bold tracking-tight ${
            isHighSavings ? "text-white" : "text-slate-900"
          }`}>
          {isHighSavings
            ? "Stop burning cash."
            : "Your stack is optimized."}
        </h2>

        <p
          className={`text-base md:text-lg max-w-2xl ${
            isHighSavings
              ? "text-slate-300"
              : "text-slate-600"
          }`}>
          {isHighSavings
            ? "You have significant savings opportunities hiding in your stack. Enter your work email to get this full report and book a free consultation to capture these discounts."
            : "You are spending efficiently. Drop your email below and we will notify you the moment a new pricing tier or tool could save you money."}
        </p>
      </div>

      {/* 2. The Form (Bottom) */}
      <div
        className={`w-full  p-6 rounded-xl border ${
          isHighSavings
            ? "bg-slate-800/50 border-slate-700"
            : "bg-slate-50 border-slate-200"
        }`}>
        <LeadCapture totalMonthlySavings={totalSavings} />
      </div>
    </section>
  );
}
