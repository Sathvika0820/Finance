import { useEffect, useState } from "react";

export const ACCENTS = [
  { id: "mono", label: "Mono", value: "oklch(0.18 0 0)" },
  { id: "ocean", label: "Ocean", value: "oklch(0.45 0.15 240)" },
  { id: "forest", label: "Forest", value: "oklch(0.45 0.13 155)" },
  { id: "sunset", label: "Sunset", value: "oklch(0.55 0.18 35)" },
  { id: "berry", label: "Berry", value: "oklch(0.45 0.18 350)" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];

const KEY = "bankhub:accent";

export function applyAccent(id: AccentId) {
  const accent = ACCENTS.find((a) => a.id === id) ?? ACCENTS[0];
  document.documentElement.style.setProperty("--primary", accent.value);
  document.documentElement.style.setProperty("--ring", accent.value);
}

export function useAccent() {
  const [accent, setAccent] = useState<AccentId>("mono");

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as AccentId | null) ?? "mono";
    setAccent(stored);
    applyAccent(stored);
  }, []);

  const update = (id: AccentId) => {
    setAccent(id);
    applyAccent(id);
    localStorage.setItem(KEY, id);
  };

  return { accent, setAccent: update };
}