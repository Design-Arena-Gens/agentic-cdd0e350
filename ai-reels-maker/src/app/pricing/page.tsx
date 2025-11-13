"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function PricingPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-200 hover:text-white">
          AI Reels Maker
        </Link>
        <ThemeToggle />
      </header>
      <section className="space-y-5">
        <h1 className="text-4xl font-semibold text-white">Pricing</h1>
        <p className="text-sm text-primary-100/80">
          Connect your Stripe or Razorpay credentials to activate live
          subscriptions. Plans are stored in Firebase for usage-based analytics.
        </p>
      </section>
      <div className="glass grid gap-4 rounded-3xl border border-white/10 p-6 shadow-glass">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary-200">
            Premium
          </p>
          <p className="mt-1 text-3xl font-semibold text-white">$29 / month</p>
        </div>
        <ul className="space-y-2 text-sm text-primary-100/80">
          <li>• 4K-ready exports with no watermark</li>
          <li>• Custom brand kits and font uploads</li>
          <li>• Priority rendering and collaborator slots</li>
        </ul>
        <Button asChild size="lg" className="w-full">
          <Link href="/dashboard?upgrade=premium">Upgrade in dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

