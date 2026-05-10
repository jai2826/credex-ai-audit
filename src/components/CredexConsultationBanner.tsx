"use client";

import { Button } from "@/components/ui/button";

interface CredexConsultationBannerProps {
  totalSavings: number;
}

export function CredexConsultationBanner({
  totalSavings,
}: CredexConsultationBannerProps) {
  if (totalSavings > 500) {
    return (
      <section className="w-full rounded-lg border border-slate-800 bg-slate-900 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-sm leading-relaxed text-slate-100 md:text-base">
            You have significant savings opportunities. Book
            a free Credex consultation to capture these
            infrastructure discounts immediately.
          </p>
          <Button
            type="button"
            className="bg-white text-slate-900 hover:bg-slate-100">
            Book Consultation
          </Button>
        </div>
      </section>
    );
  }

  // Low savings — still show, but honest messaging
  return (
    <section className="w-full rounded-lg border border-slate-200 bg-slate-50 p-6">
      <p className="text-slate-700 font-medium">
        You&apos;re spending well — your current AI stack looks
        optimized.
      </p>
      <p className="text-slate-500 text-sm mt-1">
        Want us to notify you when new optimizations apply
        to your stack?
      </p>
      {/* LeadCapture or simple email input here */}
    </section>
  );
}
