"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Download,
  Loader2,
  Play,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wand2,
} from "lucide-react";
import clsx from "clsx";
import { Template, templates } from "@/data/templates";
import { musicStylesList, type MusicStyle } from "@/data/music";
import { voiceStylesList, type VoiceStyle } from "@/data/voices";
import { useVideoComposer } from "@/hooks/use-video-composer";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import toast from "react-hot-toast";

const platforms: { id: Template["platform"][number]; label: string }[] = [
  { id: "tiktok", label: "TikTok" },
  { id: "instagram", label: "Reels" },
  { id: "youtube", label: "Shorts" },
];

const defaultScript = `Unlock a game-changing social media workflow in three moves.
Hook viewers with a bold promise, show the transformation in seconds, then deliver a snappy CTA that tells them exactly what the next step is.
AI Reels Maker maps visuals, music, and voice timing so you can publish faster than your competitors.`;

export default function DashboardPage() {
  const [script, setScript] = useState(defaultScript);
  const [platform, setPlatform] =
    useState<Template["platform"][number]>("tiktok");
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "cyberwave");
  const [tone, setTone] = useState("Product launch hype with cinematic pacing.");
  const [musicStyle, setMusicStyle] = useState<MusicStyle>(
    (musicStylesList[0]?.id ?? "cyber-groove") as MusicStyle
  );
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>(
    (voiceStylesList[0]?.id ?? "lumen") as VoiceStyle
  );
  const [tier, setTier] = useState<"free" | "premium">("free");
  const { user, login, logout, loading, configured } = useAuth();

  const composer = useVideoComposer({
    tier,
    script,
    userId: user?.uid,
  });

  const selectedTemplate = useMemo(
    () => templates.find((item) => item.id === templateId) ?? templates[0]!,
    [templateId]
  );

  const handleGenerate = useCallback(async () => {
    await composer.generate({
      platform,
      templateId,
      musicStyle,
      tone,
      voiceStyle,
    });
  }, [composer, platform, templateId, musicStyle, tone, voiceStyle]);

  const handleDownload = useCallback(() => {
    if (!composer.videoUrl) return;
    const link = document.createElement("a");
    link.href = composer.videoUrl;
    link.download =
      platform === "youtube"
        ? "ai-reels-maker-short.webm"
        : "ai-reels-maker-reel.webm";
    link.click();
    toast.success("Download started.");
  }, [composer.videoUrl, platform]);

  const handleShare = useCallback(async () => {
    if (!composer.videoUrl) return;
    if (navigator.share) {
      await navigator.share({
        title: "AI Reels Maker preview",
        text: "I just generated a reel with AI Reels Maker.",
        url: composer.videoUrl,
      });
      return;
    }
    await navigator.clipboard.writeText(composer.videoUrl);
    toast.success("Preview link copied to clipboard.");
  }, [composer.videoUrl]);

  const handleUpgrade = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "stripe" }),
      });
      if (!res.ok) throw new Error("Unable to start checkout");
      const data = (await res.json()) as { url?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      toast("Premium checkout placeholder. Configure Stripe to continue.");
    } catch (error) {
      console.error(error);
      toast.error("Upgrade unavailable. Check Stripe or Razorpay keys.");
    }
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="border-b border-white/5 bg-black/30 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-neon-pink text-sm font-semibold uppercase text-white shadow-glow">
              AI
            </span>
            <div>
              <p className="text-sm font-semibold text-white">AI Reels Maker</p>
              <p className="text-xs uppercase tracking-[0.32em] text-primary-200">
                Creative Control
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant={tier === "premium" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setTier(tier === "free" ? "premium" : "free")}
            >
              {tier === "free" ? "Preview Premium" : "Back to Free"}
            </Button>
            {configured ? (
              user ? (
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => logout()}
                  disabled={loading}
                >
                  Sign out
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => login()}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in with Google"}
                </Button>
              )
            ) : (
              <Button
                variant="glass"
                size="sm"
                asChild
                className="border border-white/10"
              >
                <Link href="https://firebase.google.com/docs/web/setup" target="_blank">
                  Connect Firebase
                </Link>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-8 md:grid md:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="glass relative rounded-3xl border border-primary-500/20 p-6 shadow-glass">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-primary-200">
                  Script
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Turn prompts into polished voiceovers
                </h2>
              </div>
              <Sparkles className="h-6 w-6 text-neon-blue" />
            </div>
            <textarea
              value={script}
              onChange={(event) => setScript(event.target.value)}
              className="mt-4 h-56 w-full resize-none rounded-2xl border border-white/5 bg-black/30 p-4 text-sm text-primary-100/90 outline-none ring-1 ring-transparent transition focus:ring-primary-400/40"
              placeholder="Paste your script or let AI brainstorm the hook..."
            />
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label className="flex flex-1 flex-col gap-2 text-xs uppercase tracking-[0.32em] text-primary-200">
                Tone prompt
                <input
                  value={tone}
                  onChange={(event) => setTone(event.target.value)}
                  className="rounded-full border border-white/5 bg-white/5 px-4 py-3 text-sm text-primary-100/90 outline-none ring-1 ring-transparent transition focus:ring-primary-400/50"
                  placeholder="Energetic, bold, cinematic..."
                />
              </label>
              <div className="text-right text-xs text-primary-100/60">
                {script.length} characters
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {platforms.map((item) => (
              <button
                key={item.id}
                onClick={() => setPlatform(item.id)}
                className={clsx(
                  "glass flex items-center justify-between rounded-3xl border px-4 py-4 text-left transition",
                  platform === item.id
                    ? "border-primary-400/70 shadow-soft-glow"
                    : "border-white/10 hover:border-primary-400/30"
                )}
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-primary-200">
                    Platform
                  </p>
                  <p className="text-base font-semibold text-white">
                    {item.label}
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-neon-blue" />
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-primary-200">
                Templates
              </h3>
              <Link
                href="/pricing"
                className="text-xs uppercase tracking-[0.3em] text-primary-100/70 hover:text-white"
              >
                Manage brand kits →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => {
                const isActive = template.id === templateId;
                return (
                  <button
                    key={template.id}
                    onClick={() => setTemplateId(template.id)}
                    className={clsx(
                      "relative overflow-hidden rounded-3xl border text-left transition focus:outline-none focus:ring-2 focus:ring-primary-400/50",
                      isActive
                        ? "border-primary-400/70 shadow-soft-glow"
                        : "border-white/10 hover:border-primary-400/30"
                    )}
                  >
                    <Image
                      src={template.coverImage}
                      alt={template.name}
                      width={420}
                      height={520}
                      className="h-48 w-full object-cover opacity-80"
                    />
                    <div className="space-y-1 p-4">
                      <p className="text-sm font-semibold text-white">
                        {template.name}
                      </p>
                      <p className="text-xs text-primary-100/70">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2 text-[10px] uppercase tracking-[0.32em] text-primary-200">
                        {template.platform.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/10 px-3 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 rounded-3xl border-2 border-primary-400/70 shadow-soft-glow" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass space-y-3 rounded-3xl border border-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-primary-200">
                Music
              </p>
              <div className="space-y-2">
                {musicStylesList.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setMusicStyle(style.id)}
                    className={clsx(
                      "flex w-full items-start justify-between rounded-2xl border px-4 py-3 text-left transition",
                      musicStyle === style.id
                        ? "border-primary-400/70 bg-primary-400/20"
                        : "border-white/10 hover:border-primary-400/30"
                    )}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {style.name}
                      </p>
                      <p className="text-xs text-primary-100/70">
                        {style.description}
                      </p>
                    </div>
                    <span className="text-xs text-primary-200">
                      {style.bpm} bpm
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="glass space-y-3 rounded-3xl border border-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-primary-200">
                Voiceover
              </p>
              <div className="space-y-2">
                {voiceStylesList.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setVoiceStyle(style.id)}
                    className={clsx(
                      "flex w-full items-start justify-between rounded-2xl border px-4 py-3 text-left transition",
                      voiceStyle === style.id
                        ? "border-primary-400/70 bg-primary-400/20"
                        : "border-white/10 hover:border-primary-400/30"
                    )}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {style.name}
                      </p>
                      <p className="text-xs text-primary-100/70">
                        {style.description}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-primary-200">
                      {style.pace}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-primary-100/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-neon-green" />
              <p>
                {tier === "free"
                  ? "Free tier adds a subtle watermark and showcases sponsored audio drops."
                  : "Premium exports deliver HD frames, no watermark, and higher bitrate audio."}
              </p>
            </div>
            {tier === "free" && (
              <Button size="sm" variant="primary" onClick={handleUpgrade}>
                Upgrade
              </Button>
            )}
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <div className="glass flex-1 rounded-3xl border border-primary-500/30 p-6 shadow-glass">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-primary-200">
                  Live preview
                </p>
                <h2 className="text-xl font-semibold text-white">
                  {selectedTemplate?.name}
                </h2>
              </div>
              <Camera className="h-5 w-5 text-neon-blue" />
            </div>

            <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-black/40">
              <div className="aspect-[9/16] w-full">
                {composer.videoUrl ? (
                  <video
                    key={composer.videoUrl}
                    src={composer.videoUrl}
                    poster={composer.thumbnail ?? undefined}
                    controls
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-500/20 via-black/60 to-neon-pink/10 text-primary-100/60">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <Play className="h-10 w-10 animate-pulse text-neon-blue" />
                      <p className="max-w-[12rem] text-sm">
                        Your AI reel preview appears here after generation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={composer.isGenerating}
                className="w-full"
              >
                {composer.isGenerating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Rendering your reel...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Generate AI Reel
                  </span>
                )}
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="glass"
                  className="flex-1"
                  onClick={handleDownload}
                  disabled={!composer.videoUrl}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 border border-white/10"
                  onClick={handleShare}
                  disabled={!composer.videoUrl}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
              {tier === "free" && (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-primary-100/70">
                  <p className="font-semibold text-white">Sponsored Spotlight</p>
                  <p className="mt-2">
                    Ads play in the first 3 seconds for free exports. Upgrade to
                    remove ads and unlock HD mastering.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-primary-200">
                  Status
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 via-neon-blue to-neon-pink transition-all"
                    style={{ width: `${Math.round(composer.progress * 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-primary-100/60">
                  {composer.status === "idle" && "Ready to generate"}
                  {composer.status === "planning" && "Mapping timeline & audio"}
                  {composer.status === "rendering" && "Rendering frames & voices"}
                  {composer.status === "uploading" && "Saving to Firebase"}
                  {composer.status === "ready" && "Reel ready for export"}
                  {composer.status === "error" && "Generation failed"}
                </p>
              </div>

              {composer.plan && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-primary-100/80">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary-200">
                    Publishing Checklist
                  </p>
                  <p className="mt-2 text-white">{composer.plan.timeline.callToAction}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.28em] text-primary-200">
                    Hashtags
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {composer.plan.timeline.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-black/40 px-3 py-1 text-xs text-primary-100/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.28em] text-primary-200">
                    Guidance
                  </p>
                  <p className="mt-2 text-xs text-primary-100/70">
                    {composer.plan.guidance.postingTime}
                  </p>
                  <p className="mt-2 text-xs text-primary-100/70">
                    {composer.plan.guidance.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {composer.plan && (
            <div className="glass rounded-3xl border border-white/10 p-6 text-sm text-primary-100/80">
              <p className="text-xs uppercase tracking-[0.32em] text-primary-200">
                Scene breakdown
              </p>
              <div className="mt-4 space-y-3">
                {composer.plan.timeline.scenes.map((scene, index) => (
                  <div
                    key={scene.id}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.28em] text-primary-200">
                        {Math.round(scene.durationMs / 1000)}s beat
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {scene.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
