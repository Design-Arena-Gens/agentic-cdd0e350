import { NextResponse } from "next/server";
import gTTS from "gtts";
import { templates, getTrendingTemplates } from "@/data/templates";
import type { MusicStyle } from "@/data/music";
import type { VoiceStyle } from "@/data/voices";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GeneratePayload = {
  script: string;
  platform: string;
  templateId: string;
  musicStyle: MusicStyle;
  voiceStyle: VoiceStyle;
  tone: string;
  tier: "free" | "premium";
};

const FALLBACK_VISUALS = [
  "/assets/neon-city.jpg",
  "/assets/workflow.jpg",
  "/assets/futuristic-lights.jpg",
  "/assets/creative-team.jpg",
];

function sanitizeScript(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

function splitIntoScenes(script: string, templateBeat: number) {
  const sentences = script
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!sentences.length) return [];

  const scenes: {
    id: string;
    caption: string;
    highlight: string;
    durationMs: number;
  }[] = [];

  const targetScenes = Math.min(5, Math.max(3, Math.ceil(script.length / 160)));
  const chunkSize = Math.ceil(sentences.length / targetScenes);

  for (let i = 0; i < sentences.length; i += chunkSize) {
    const chunk = sentences.slice(i, i + chunkSize).join(" ");
    const words = chunk.split(/\s+/);
    const durationMs = Math.max(2600, words.length * 180 * templateBeat);
    const highlight = words.slice(0, 4).join(" ");
    scenes.push({
      id: crypto.randomUUID(),
      caption: chunk,
      highlight,
      durationMs,
    });
  }

  return scenes;
}

function pickVisuals(templateBackdrop: string, total: number) {
  const pool = [templateBackdrop, ...FALLBACK_VISUALS].filter(Boolean);
  return Array.from({ length: total }).map(
    (_, index) => pool[index % pool.length]!
  );
}

async function buildVoiceover(script: string, voiceStyle: VoiceStyle) {
  const trimmed = script.slice(0, 4000);
  const slowVoices: VoiceStyle[] = ["astra"];
  const useSlow = slowVoices.includes(voiceStyle);
  const gtts = new gTTS(trimmed, "en", useSlow);

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const stream = gtts.stream();
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk as Buffer));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return `data:audio/mpeg;base64,${buffer.toString("base64")}`;
}

function craftHashtags(platform: string, tone: string) {
  const base = ["#AIReelsMaker", "#shortform", "#aivideo", "#viralvideo"];
  const platformTags: Record<string, string[]> = {
    instagram: ["#reels", "#InstagramGrowth"],
    tiktok: ["#tiktokmademebuyit", "#fyp"],
    youtube: ["#youtubeshorts", "#creatorcommunity"],
  };

  if (platformTags[platform]) base.push(...platformTags[platform]!);

  if (/motivation|inspire|mindset/i.test(tone)) {
    base.push("#motivationdaily", "#levelup");
  }
  if (/tech|product|launch/i.test(tone)) {
    base.push("#buildinpublic", "#futureofcontent");
  }

  return Array.from(new Set(base)).slice(0, 6);
}

function craftCallToAction(platform: string, tier: "free" | "premium") {
  if (platform === "tiktok") return "Follow for the next drop in this series.";
  if (platform === "instagram")
    return tier === "premium"
      ? "Add this to your story and tag us for a repost."
      : "Save & remix this sound for your audience.";
  return "Pin this Short to your featured playlist to boost discoverability.";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as GeneratePayload;
    const script = sanitizeScript(payload.script);
    if (!script) {
      return NextResponse.json(
        { error: "Script is required" },
        { status: 422 }
      );
    }

    const template =
      templates.find((item) => item.id === payload.templateId) ??
      getTrendingTemplates(1)[0];

    if (!template) {
      return NextResponse.json(
        { error: "No template available" },
        { status: 404 }
      );
    }

    const scenes = splitIntoScenes(script, template.beatTiming || 1.6);
    if (!scenes.length) {
      return NextResponse.json(
        { error: "Unable to understand the provided script" },
        { status: 422 }
      );
    }

    const visuals = pickVisuals(template.backdrop, scenes.length);
    const timeline = scenes.map((scene, index) => ({
      ...scene,
      caption: scene.caption,
      highlight: scene.highlight,
      visual: visuals[index] ?? template.backdrop,
      beat: template.beatTiming,
    }));

    const voiceover = await buildVoiceover(script, payload.voiceStyle);

    const hashtags = craftHashtags(payload.platform, payload.tone);
    const callToAction = craftCallToAction(payload.platform, payload.tier);
    const guidance = {
      postingTime:
        payload.platform === "tiktok"
          ? "Post between 4-7pm local time when FYP scroll spikes."
          : "Post within 90 minutes of trending audio updates for maximum push.",
      caption: `${timeline[0]!.caption} ${hashtags.join(" ")}`,
      description:
        "Reuse the hook in your comment to double the keyword density. Pin the comment for retention.",
    };

    return NextResponse.json({
      template,
      timeline: {
        scenes: timeline,
        hashtags,
        callToAction,
        hook: timeline[0]?.caption ?? "",
      },
      voiceover: {
        audio: voiceover,
        format: "audio/mpeg",
        transcript: timeline.map((scene) => scene.caption),
      },
      music: {
        style: payload.musicStyle,
        energy: timeline.length > 4 ? 0.8 : 0.6,
      },
      watermark: {
        required: payload.tier === "free",
        text: payload.tier === "free" ? "AI Reels Maker" : "",
      },
      guidance,
    });
  } catch (error) {
    console.error("Generation error", error);
    return NextResponse.json(
      { error: "Unable to generate video at the moment." },
      { status: 500 }
    );
  }
}
