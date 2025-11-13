import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { getTrendingTemplates } from "@/data/templates";

const highlights = [
  {
    title: "AI voiceover that matches your brand",
    body: "Choose from cinematic, hype, or neutral voices and blend them with AI-designed background scores that react to your pacing.",
    icon: "🎙️",
  },
  {
    title: "Stock visuals in seconds",
    body: "Autoselect stock c-roll and transitions for every sentence. Swap any scene with 5K licensed footage with one click.",
    icon: "🎞️",
  },
  {
    title: "Live preview & instant download",
    body: "Preview vertical videos in real time with glassmorphism overlays and export watermark-free HD when you upgrade.",
    icon: "⚡",
  },
];

const benefits = [
  "Optimized for Reels, Shorts, and TikTok canvases",
  "Daily refreshing templates mapped to platform trends",
  "Auto watermark for free tier, HD export for premium",
  "Stripe & Razorpay ready monetization flows",
  "Firebase-backed project history and collaboration",
];

export default function Home() {
  const trending = getTrendingTemplates(3);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-neon-blue to-neon-pink text-white shadow-glow">
            <span className="text-xl font-semibold">AI</span>
          </span>
          <div className="space-y-0">
            <p className="text-lg font-semibold tracking-tight text-white">
              AI Reels Maker
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-primary-200">
              Viral in minutes
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            className="text-sm font-medium text-primary-100 transition hover:text-white"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="text-sm font-medium text-primary-100 transition hover:text-white"
            href="#pricing"
          >
            Pricing
          </Link>
          <ThemeToggle />
          <Button asChild variant="primary" size="sm" className="hidden md:flex">
            <Link href="/dashboard">Launch Studio</Link>
          </Button>
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-28 px-6 pb-32 pt-16">
        <section className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-400/40 bg-primary-500/10 px-4 py-2 text-sm text-primary-100 shadow-soft-glow backdrop-blur">
              <span className="text-primary-200">🚀 Trending now</span>
              <span className="font-medium text-white">
                Viral short videos, no timeline stress.
              </span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-gradient md:text-6xl">
              Generate viral Reels from words — faster than you can open a video
              editor.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-primary-100/80">
              Paste a script or idea. AI Reels Maker drafts hooks, designs
              motion graphics, scores the audio, and renders platform-perfect
              vertical videos with live preview — ready for Shorts, Reels, and
              TikTok.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/dashboard">Start creating now</Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link href="#demo">See how it works</Link>
              </Button>
              <p className="text-sm text-primary-100/70">
                Free plan includes watermark + ad monetization.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-primary-100/80 shadow-glass"
                >
                  <span className="text-neon-green">✧</span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 animate-pulseSlow rounded-3xl bg-gradient-to-br from-primary-500/30 via-transparent to-neon-pink/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-primary-400/30 bg-black/40 shadow-glass backdrop-blur">
              <div className="absolute left-6 top-6 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-primary-200">
                <span className="h-2 w-2 rounded-full bg-neon-green" />
                Live Preview
              </div>
              <Image
                src="/assets/futuristic-lights.jpg"
                alt="AI Reels Maker Preview"
                width={720}
                height={1280}
                className="h-full w-full object-cover opacity-80"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6">
                <p className="text-sm font-medium uppercase tracking-[0.35em] text-primary-200">
                  storyboard
                </p>
                <p className="text-lg font-semibold text-white">
                  Hook · Visual Swap · CTA
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 flex-1 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary-500 via-neon-blue to-neon-pink" />
                  </div>
                  <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                    00:29
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.45em] text-primary-200">
              Workflow
            </p>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              A creative team compressed into a single dashboard.
            </h2>
            <p className="max-w-lg text-primary-100/80">
              AI Reels Maker gives you the storyboard, script polish, stock
              visuals, voiceover, soundtrack, and publishing checklist in one
              place — using Firebase to store every project and share access
              with collaborators.
            </p>
            <div className="space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="glass rounded-3xl p-5 shadow-glass">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-base font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm text-primary-100/70">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass relative rounded-3xl border border-primary-400/30 p-8 shadow-glass">
            <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-primary-300/30 bg-primary-500/20 px-5 py-2 text-xs uppercase tracking-[0.35em] text-primary-100 backdrop-blur">
              <span>Daily</span>
              <span>Trending Templates</span>
            </div>
            <div className="mt-4 space-y-6">
              {trending.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur"
                >
                  <Image
                    src={template.coverImage}
                    alt={template.name}
                    width={96}
                    height={96}
                    className="h-24 w-20 rounded-2xl object-cover"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      {template.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary-200">
                      {template.platform.join(" • ")}
                    </p>
                    <p className="text-xs text-primary-100/70">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] uppercase tracking-[0.2em] text-primary-200">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-white/10 px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="grid gap-10 md:grid-cols-2 md:items-center"
        >
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.45em] text-primary-200">
              Monetization
            </p>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Free plan to go viral, Premium plan to remove limits.
            </h2>
            <p className="max-w-lg text-primary-100/80">
              AI-generated ads are shown on free exports with subtle watermarking,
              while premium creators unlock HD renders, no ads, and API access
              via Stripe or Razorpay subscriptions.
            </p>
            <div className="flex gap-3">
              <Button asChild size="lg">
                <Link href="/dashboard">Generate a free reel</Link>
              </Button>
              <Button asChild variant="glass" size="lg">
                <Link href="/pricing">Compare plans</Link>
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="glass relative rounded-3xl border border-primary-400/30 p-6 shadow-glass">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-white">Creator</p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-primary-200">
                  Free
                </span>
              </div>
              <p className="mt-3 text-sm text-primary-100/70">
                Watermarked exports · Access to 12 templates · Sponsored ads
                baked into timeline suggestions · Firebase storage for 5 reels.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-primary-100/80">
                <li>• Live preview and auto music &amp; voiceover pairing</li>
                <li>• Collaborative script editor with comments</li>
                <li>• Auto posting checklist per platform</li>
              </ul>
            </div>
            <div className="glass relative rounded-3xl border border-neon-pink/40 bg-gradient-to-br from-primary-500/20 via-transparent to-neon-pink/20 p-6 shadow-soft-glow">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-white">Premium</p>
                <span className="rounded-full bg-neon-pink/30 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white">
                  $29 / mo
                </span>
              </div>
              <p className="mt-3 text-sm text-primary-100/80">
                HD exports without watermark · Custom brand packs · Upload your
                own fonts and music stems · Priority render queue with 4K ready
                masters.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-primary-100/90">
                <li>• Stripe &amp; Razorpay billing handled out-of-the-box</li>
                <li>• Firebase-backed history for unlimited projects</li>
                <li>• Shareable preview links and collaborative approvals</li>
              </ul>
              <Button
                asChild
                size="lg"
                className="mt-6 w-full bg-gradient-to-r from-neon-pink via-primary-400 to-neon-blue"
              >
                <Link href="/dashboard?upgrade=premium">Upgrade now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
