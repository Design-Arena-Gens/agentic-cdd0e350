"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { Template } from "@/data/templates";
import type { MusicStyle } from "@/data/music";
import type { VoiceStyle } from "@/data/voices";
import { persistGeneration } from "@/lib/firebase";

type TimelineScene = {
  id: string;
  caption: string;
  highlight: string;
  visual: string;
  durationMs: number;
  beat: number;
};

type GenerationResponse = {
  template: Template;
  timeline: {
    scenes: TimelineScene[];
    hashtags: string[];
    hook: string;
    callToAction: string;
  };
  voiceover: {
    audio: string; // base64 encoded mp3
    transcript: string[];
    format: string;
  };
  music: {
    style: MusicStyle;
    energy: number;
  };
  watermark: {
    required: boolean;
    text: string;
  };
  guidance: {
    postingTime: string;
    caption: string;
    description: string;
  };
};

type ComposerStatus =
  | "idle"
  | "planning"
  | "rendering"
  | "uploading"
  | "ready"
  | "error";

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 1280;

function decodeBase64Audio(
  audioCtx: AudioContext,
  input: { audio: string; format: string }
) {
  const base64 = input.audio.includes(",")
    ? input.audio.split(",")[1]!
    : input.audio;
  const binary = typeof atob !== "undefined" ? atob(base64) : "";
  const len = binary.length;
  const buffer = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    buffer[i] = binary.charCodeAt(i);
  }
  return audioCtx.decodeAudioData(buffer.buffer);
}

function generateMusicBuffer(
  audioCtx: AudioContext,
  style: MusicStyle,
  duration: number
) {
  const sampleRate = audioCtx.sampleRate;
  const totalSamples = Math.ceil(duration * sampleRate);
  const buffer = audioCtx.createBuffer(2, totalSamples, sampleRate);

  const baseFreqByStyle: Record<MusicStyle, number> = {
    "cyber-groove": 90,
    "ambient-rise": 48,
    hyperwave: 140,
    "future-chill": 70,
    "uplift-pop": 110,
    "minimal-drift": 55,
  };

  const noiseLevelByStyle: Record<MusicStyle, number> = {
    "cyber-groove": 0.25,
    "ambient-rise": 0.05,
    hyperwave: 0.35,
    "future-chill": 0.12,
    "uplift-pop": 0.18,
    "minimal-drift": 0.08,
  };

  const bpm = baseFreqByStyle[style];
  const noiseLevel = noiseLevelByStyle[style];

  for (let channel = 0; channel < 2; channel += 1) {
    const output = buffer.getChannelData(channel);
    let phase = Math.random() * Math.PI * 2;
    for (let i = 0; i < totalSamples; i += 1) {
      const t = i / sampleRate;
      const envelope =
        Math.sin((Math.PI * t) / duration) * 0.8 +
        0.2 * Math.sin((Math.PI * t * 3) / duration);
      const beat =
        Math.sin((2 * Math.PI * bpm * t) / 60 + phase) * (0.6 + envelope * 0.4);
      const airy =
        Math.sin((2 * Math.PI * (bpm / 2) * t) / 60 + phase * 0.5) *
        (0.4 + envelope * 0.3);
      const noise = (Math.random() * 2 - 1) * noiseLevel;
      output[i] = (beat + airy) * 0.25 + noise * 0.5;
      phase += 0.00005;
    }
  }

  return buffer;
}

async function drawScene(
  ctx: CanvasRenderingContext2D,
  scene: TimelineScene,
  template: Template,
  { watermark, tier }: { watermark: string; tier: "free" | "premium" },
  onProgress: (value: number) => void
) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = scene.visual;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

  const duration = scene.durationMs;
  const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  gradient.addColorStop(0, "rgba(5,5,14,0.72)");
  gradient.addColorStop(1, "rgba(15,15,35,0.6)");

  return new Promise<void>((resolve) => {
    const start = performance.now();
    const draw = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      ctx.save();
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const scale = Math.max(
        CANVAS_WIDTH / image.width,
        CANVAS_HEIGHT / image.height
      );
      const dw = image.width * scale;
      const dh = image.height * scale;
      const dx = (CANVAS_WIDTH - dw) / 2;
      const dy = (CANVAS_HEIGHT - dh) / 2;
      ctx.globalAlpha = 0.9;
      ctx.drawImage(image, dx, dy, dw, dh);
      ctx.globalAlpha = 1;

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const glassWidth = CANVAS_WIDTH * 0.84;
      const glassHeight = CANVAS_HEIGHT * 0.28;
      const glassX = CANVAS_WIDTH * 0.08;
      const glassY = CANVAS_HEIGHT * 0.58;

      ctx.fillStyle = "rgba(12,12,24,0.45)";
      ctx.strokeStyle = template.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const radius = 22;
      ctx.moveTo(glassX + radius, glassY);
      ctx.arcTo(
        glassX + glassWidth,
        glassY,
        glassX + glassWidth,
        glassY + radius,
        radius
      );
      ctx.arcTo(
        glassX + glassWidth,
        glassY + glassHeight,
        glassX + glassWidth - radius,
        glassY + glassHeight,
        radius
      );
      ctx.arcTo(
        glassX,
        glassY + glassHeight,
        glassX,
        glassY + glassHeight - radius,
        radius
      );
      ctx.arcTo(glassX, glassY, glassX + radius, glassY, radius);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.font = `700 54px "${template.fontFamily}", "Space Grotesk", sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.textBaseline = "top";
      const caption = scene.caption.toUpperCase();

      const words = caption.split(" ");
      const lines: string[] = [];
      let currentLine = "";
      words.forEach((word) => {
        const metrics = ctx.measureText(`${currentLine} ${word}`.trim());
        if (metrics.width > glassWidth - 48) {
          if (currentLine) lines.push(currentLine.trim());
          currentLine = word;
        } else {
          currentLine = `${currentLine} ${word}`.trim();
        }
      });
      if (currentLine) lines.push(currentLine.trim());

      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i]!;
        ctx.fillText(line, glassX + 24, glassY + 24 + i * 64);
      }

      ctx.fillStyle = template.accent;
      ctx.font = `500 28px "${template.fontFamily}", "Inter", sans-serif`;
      ctx.fillText(
        scene.highlight,
        glassX + 24,
        glassY + glassHeight - 58
      );

      if (tier === "free") {
        const watermarkText = watermark.toUpperCase();
        ctx.font = '600 28px "Geist", sans-serif';
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        const padding = 32;

        const position = {
          "bottom-left": [padding, CANVAS_HEIGHT - 54] as [number, number],
          "bottom-right": [
            CANVAS_WIDTH - ctx.measureText(watermarkText).width - padding,
            CANVAS_HEIGHT - 54,
          ] as [number, number],
          "top-left": [padding, padding] as [number, number],
          "top-right": [
            CANVAS_WIDTH - ctx.measureText(watermarkText).width - padding,
            padding,
          ] as [number, number],
        }[template.watermarkPosition];

        ctx.fillText(watermarkText, position[0], position[1]);
      }

      ctx.restore();
      onProgress(progress);
      if (progress < 1) {
        requestAnimationFrame(draw);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(draw);
  });
}

async function renderTimelines(
  canvas: HTMLCanvasElement,
  plan: GenerationResponse,
  tier: "free" | "premium",
  onProgress: (value: number) => void
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const totalScenes = plan.timeline.scenes.length;
  for (let index = 0; index < totalScenes; index += 1) {
    const scene = plan.timeline.scenes[index]!;
    await drawScene(
      ctx,
      scene,
      plan.template,
      { watermark: plan.watermark.text, tier },
      (p) => {
        const base = index / totalScenes;
        const value = base + p / totalScenes;
        onProgress(value);
      }
    );
  }
  onProgress(1);
  return canvas.toDataURL("image/webp", 0.92);
}

export function useVideoComposer({
  tier,
  script,
  userId,
}: {
  tier: "free" | "premium";
  script: string;
  userId?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<ComposerStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [plan, setPlan] = useState<GenerationResponse | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const isGenerating = useMemo(
    () => status === "planning" || status === "rendering" || status === "uploading",
    [status]
  );

  const generate = useCallback(
    async ({
      platform,
      templateId,
      musicStyle,
      voiceStyle,
      tone,
    }: {
      platform: string;
      templateId: string;
      musicStyle: MusicStyle;
      voiceStyle: VoiceStyle;
      tone: string;
    }) => {
      if (!script.trim()) {
        toast.error("Add a script or topic first.");
        return;
      }

      if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
        toast.error("MediaRecorder is not supported in this environment.");
        return;
      }

      try {
        setStatus("planning");
        setProgress(0.05);
        const response = await fetch("/api/generate-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            script,
            platform,
            templateId,
            musicStyle,
            voiceStyle,
            tone,
            tier,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to build generation plan");
        }

        const payload: GenerationResponse = await response.json();
        setPlan(payload);
        setProgress(0.2);
        setStatus("rendering");

        const canvas =
          canvasRef.current ??
          (() => {
            const node = document.createElement("canvas");
            node.width = CANVAS_WIDTH;
            node.height = CANVAS_HEIGHT;
            canvasRef.current = node;
            return node;
          })();
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        const videoStream = canvas.captureStream(30);
        const audioCtx = new AudioContext();
        await audioCtx.resume();
        const destination = audioCtx.createMediaStreamDestination();

        const voiceBuffer = await decodeBase64Audio(audioCtx, payload.voiceover);
        const voiceSource = audioCtx.createBufferSource();
        voiceSource.buffer = voiceBuffer;
        voiceSource.connect(destination);

        const musicBuffer = generateMusicBuffer(
          audioCtx,
          payload.music.style,
          Math.max(voiceBuffer.duration + 1.5, 18)
        );
        const musicSource = audioCtx.createBufferSource();
        musicSource.buffer = musicBuffer;
        const musicGain = audioCtx.createGain();
        musicGain.gain.value = tier === "premium" ? 0.32 : 0.22;
        musicSource.connect(musicGain);
        musicGain.connect(destination);

        const masterStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...destination.stream.getAudioTracks(),
        ]);

        const recorder = new MediaRecorder(masterStream, {
          mimeType: "video/webm;codecs=vp9,opus",
          videoBitsPerSecond: tier === "premium" ? 6_000_000 : 2_500_000,
        });

        const outputChunks: Blob[] = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) outputChunks.push(event.data);
        };

        const stopPromise = new Promise<Blob>((resolve) => {
          recorder.onstop = () => {
            resolve(new Blob(outputChunks, { type: "video/webm" }));
          };
        });

        recorder.start(750);
        musicSource.start();
        voiceSource.start();

        const previewPoster = await Promise.all([
          renderTimelines(canvas, payload, tier, (v) =>
            setProgress(0.2 + v * 0.6)
          ),
          new Promise<void>((resolve) => {
            voiceSource.onended = () => resolve();
          }),
        ]);

        setThumbnail(previewPoster[0]);

        musicSource.stop();
        recorder.stop();

        const blob = await stopPromise;
        const url = URL.createObjectURL(blob);
        setVideoUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setProgress(0.95);

        if (userId) {
          setStatus("uploading");
          await persistGeneration({
            uid: userId,
            script,
            platform,
            templateId,
            musicStyle,
            voiceStyle,
            tier,
            videoUrl: url,
          });
        }

        setStatus("ready");
        setProgress(1);
        toast.success("Your AI reel is ready! ✨");

        return {
          url,
          blob,
          payload,
          thumbnail: previewPoster[0],
        };
      } catch (error) {
        console.error(error);
        setStatus("error");
        toast.error("We could not generate this reel. Try adjusting the prompt.");
        throw error;
      }
    },
    [script, tier, userId]
  );

  const reset = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setPlan(null);
    setVideoUrl(null);
    setThumbnail(null);
    setStatus("idle");
    setProgress(0);
  }, [videoUrl]);

  return {
    canvasRef,
    status,
    isGenerating,
    progress,
    plan,
    videoUrl,
    thumbnail,
    generate,
    reset,
  };
}
