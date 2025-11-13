"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonStar, Sun } from "lucide-react";
import clsx from "clsx";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const activeTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(activeTheme === "dark" ? "light" : "dark")}
      className={clsx(
        "flex h-11 w-11 items-center justify-center rounded-full border border-border/70 transition-all duration-300 hover:border-primary-400/70 hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50",
        "bg-surface/40 backdrop-blur"
      )}
    >
      {mounted && activeTheme === "dark" ? (
        <Sun className="h-5 w-5 text-neon-green" />
      ) : (
        <MoonStar className="h-5 w-5 text-neon-blue" />
      )}
    </button>
  );
}
