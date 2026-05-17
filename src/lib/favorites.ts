import { useEffect, useState, useCallback } from "react";

const KEY = "bankhub:favorites";
const RECENT_KEY = "bankhub:recent";

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as string[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(`bankhub:${key}`));
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read(KEY));
    const handler = () => setIds(read(KEY));
    window.addEventListener(`bankhub:${KEY}`, handler);
    return () => window.removeEventListener(`bankhub:${KEY}`, handler);
  }, []);

  const toggle = useCallback((id: string) => {
    const cur = read(KEY);
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    write(KEY, next);
  }, []);

  const remove = useCallback((id: string) => {
    write(KEY, read(KEY).filter((x) => x !== id));
  }, []);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, remove, isFavorite };
}

export function pushRecent(id: string) {
  if (typeof window === "undefined") return;
  const cur = read(RECENT_KEY).filter((x) => x !== id);
  const next = [id, ...cur].slice(0, 6);
  write(RECENT_KEY, next);
}

export function useRecent() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    setIds(read(RECENT_KEY));
    const handler = () => setIds(read(RECENT_KEY));
    window.addEventListener(`bankhub:${RECENT_KEY}`, handler);
    return () => window.removeEventListener(`bankhub:${RECENT_KEY}`, handler);
  }, []);
  return ids;
}