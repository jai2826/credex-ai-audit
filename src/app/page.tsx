'use client'
import { SpendInputForm } from "@/components/SpendInputForm";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  TrendingDown,
  CheckCircle,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">
              AISpendAudit
            </span>
          </div>
          <div className="text-sm text-slate-600">
            Powered by Credex
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Find Hidden Savings in Your AI Tool Stack
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Most teams overspend on AI tools without
              realizing it. Get a free, instant audit of
              your current spend and discover how much you
              could save every month.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                <span>Results in 30 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                <span>100% Private</span>
              </div>
            </div>
          </div>

          {/* Stats Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                35%
              </div>
              <p className="text-slate-600">
                Average savings potential
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                10+
              </div>
              <p className="text-slate-600">
                AI tools supported
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                Instant
              </div>
              <p className="text-slate-600">
                Real-time recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="audit-form" className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Start Your Free Audit
              </h2>
              <p className="text-slate-600">
                Enter your current AI tool spending below
                and get personalized recommendations in
                seconds.
              </p>
            </div>

            <SpendInputForm />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Enter Your Tools
              </h3>
              <p className="text-slate-600 text-sm">
                Tell us which AI tools you&apos;re using,
                what plans you&apos;re on, and how much
                you&apos;re spending monthly.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-slate-300 absolute left-1/2 transform -translate-x-1/2" />
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Get Analysis
              </h3>
              <p className="text-slate-600 text-sm">
                Our audit engine analyzes your spending
                against industry benchmarks and identifies
                optimization opportunities.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-slate-300 absolute left-1/2 transform -translate-x-1/2" />
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                See Savings
              </h3>
              <p className="text-slate-600 text-sm">
                Get a detailed breakdown of potential
                monthly and annual savings, with actionable
                recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            What You&apos;ll Discover
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <TrendingDown className="w-6 h-6 text-indigo-600 mt-1" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Unused Features
                </h3>
                <p className="text-slate-600">
                  Identify premium plans you could downgrade
                  to save immediately.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <TrendingDown className="w-6 h-6 text-indigo-600 mt-1" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Cheaper Alternatives
                </h3>
                <p className="text-slate-600">
                  Discover lower-cost tools that match your
                  actual use case perfectly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <TrendingDown className="w-6 h-6 text-indigo-600 mt-1" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Seat Optimization
                </h3>
                <p className="text-slate-600">
                  Find the optimal number of seats needed
                  for your team size and workload.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <TrendingDown className="w-6 h-6 text-indigo-600 mt-1" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Credit Opportunities
                </h3>
                <p className="text-slate-600">
                  Learn about discounted credits available
                  for your tools through Credex.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Optimize Your Stack?
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of engineering teams discovering
            hidden savings. Get your free audit now—it only
            takes 30 seconds.
          </p>
          <Button
            className="rounded-md"
            onClick={() =>
              document
                .getElementById("audit-form")
                ?.scrollIntoView({ behavior: "smooth" })
            }>
            Start Free Audit
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-600">
          <p>
            © {new Date().getFullYear()} AISpendAudit.
            Powered by{" "}
            <span className="font-medium text-slate-900">
              Credex
            </span>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
