'use client';

import { Button } from '@/components/ui/button';

interface CredexConsultationBannerProps {
  totalSavings: number;
}

export function CredexConsultationBanner({ totalSavings }: CredexConsultationBannerProps) {
  if (totalSavings <= 500) {
    return null;
  }

  return (
    <section className="w-full rounded-lg border border-slate-800 bg-slate-900 p-6 text-white shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-sm leading-relaxed text-slate-100 md:text-base">
          You have significant savings opportunities. Book a free Credex consultation to capture
          these infrastructure discounts immediately.
        </p>
        <Button
          type="button"
          className="bg-white text-slate-900 hover:bg-slate-100"
        >
          Book Consultation
        </Button>
      </div>
    </section>
  );
}
