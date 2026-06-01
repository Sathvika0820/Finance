import { useState, useCallback, useEffect } from "react";
import enLocale from "@/translations/en.json";
import hiLocale from "@/translations/hi.json";
import teLocale from "@/translations/te.json";
import taLocale from "@/translations/ta.json";
import knLocale from "@/translations/kn.json";
import orLocale from "@/translations/or.json";
import urLocale from "@/translations/ur.json";
import mrLocale from "@/translations/mr.json";
import bnLocale from "@/translations/bn.json";
import guLocale from "@/translations/gu.json";
import paLocale from "@/translations/pa.json";

export type AppLanguage =
  | "english"
  | "hindi"
  | "telugu"
  | "tamil"
  | "kannada"
  | "odia"
  | "urdu"
  | "marathi"
  | "bengali"
  | "gujarati"
  | "punjabi";

export const LANGUAGE_OPTIONS: { id: AppLanguage; code: string; label: string; nativeLabel: string; dir?: "ltr" | "rtl" }[] = [
  { id: "english", code: "en", label: "English", nativeLabel: "English" },
  { id: "hindi", code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { id: "telugu", code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { id: "tamil", code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { id: "kannada", code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
  { id: "odia", code: "or", label: "Odia", nativeLabel: "ଓଡ଼ିଆ" },
  { id: "urdu", code: "ur", label: "Urdu", nativeLabel: "اردو", dir: "rtl" },
  { id: "marathi", code: "mr", label: "Marathi", nativeLabel: "मराठी" },
  { id: "bengali", code: "bn", label: "Bengali", nativeLabel: "বাংলা" },
  { id: "gujarati", code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી" },
  { id: "punjabi", code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ" },
];

export const SPEECH_LOCALE_BY_LANGUAGE: Record<AppLanguage, string> = {
  english: "en-IN",
  hindi: "hi-IN",
  telugu: "te-IN",
  tamil: "ta-IN",
  kannada: "kn-IN",
  odia: "or-IN",
  urdu: "ur-IN",
  marathi: "mr-IN",
  bengali: "bn-IN",
  gujarati: "gu-IN",
  punjabi: "pa-IN",
};

export const LEGACY_LANGUAGE_KEYS: Partial<Record<AppLanguage, "english" | "hindi" | "telugu">> = {
  english: "english",
  hindi: "hindi",
  telugu: "telugu",
};

const LANGUAGE_STORAGE_KEY = "bankHubLanguage";

const localeResources: Record<AppLanguage, Record<string, string>> = {
  english: enLocale,
  hindi: hiLocale,
  telugu: teLocale,
  tamil: taLocale,
  kannada: knLocale,
  odia: orLocale,
  urdu: urLocale,
  marathi: mrLocale,
  bengali: bnLocale,
  gujarati: guLocale,
  punjabi: paLocale,
};

const languageByCode = new Map(LANGUAGE_OPTIONS.map((lang) => [lang.code, lang.id]));
const languageIds = new Set(LANGUAGE_OPTIONS.map((lang) => lang.id));

export function normalizeLanguage(value: string | null | undefined): AppLanguage {
  const normalized = String(value || "").trim().toLowerCase();
  if (languageIds.has(normalized as AppLanguage)) return normalized as AppLanguage;
  
  if (normalized.length === 2) {
    return languageByCode.get(normalized) || "english";
  }

  // Handle cases where the stored value is "en-IN" etc.
  if (normalized.includes("-")) {
     const code = normalized.split("-")[0];
     return languageByCode.get(code) || "english";
  }

  return "english";
}

export function getLanguageCode(language: AppLanguage): string {
  return LANGUAGE_OPTIONS.find((item) => item.id === language)?.code || "en";
}

export function getLanguageNativeLabel(language: AppLanguage): string {
  return LANGUAGE_OPTIONS.find((item) => item.id === language)?.nativeLabel || "English";
}

export function isRtlLanguage(language: AppLanguage | string): boolean {
  return normalizeLanguage(language).includes("urdu");
}

export function getCurrentStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return "english";
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored ? normalizeLanguage(stored) : "english";
  } catch {
    return "english";
  }
}

type TranslationValues = Record<string, string | number>;

export function translate(language: AppLanguage, key: string, values?: TranslationValues): string {
  if (!key) return "";

  // 1. Try language locale
  const langResources = localeResources[language];
  let text = langResources?.[key];

  // 2. Fallback to English locale
  if (text === undefined) {
    text = localeResources["english"]?.[key];
  }
  
  // 3. Fallback to readable key format
  if (text === undefined) {
    // If the key is 'scheme.foo.name', returning the original scheme name which was passed?
    // Wait, let's just return the key, so the caller can fallback.
    return key;
  }

  // 4. Inject values
  if (values && text) {
    Object.entries(values).forEach(([k, v]) => {
      text = (text as string).replaceAll(`{${k}}`, String(v));
    });
  }

  return text;
}

export function useTranslation() {
  const [lang, setLangState] = useState<AppLanguage>("english");

  useEffect(() => {
    const storedLang = getCurrentStoredLanguage();
    setLangState(storedLang);
    document.documentElement.lang = getLanguageCode(storedLang);
    document.documentElement.dir = isRtlLanguage(storedLang) ? "rtl" : "ltr";
  }, []);

  const setLang = useCallback((newLang: AppLanguage | string) => {
    const normalized = normalizeLanguage(newLang);
    setLangState(normalized);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, getLanguageCode(normalized));
    document.documentElement.lang = getLanguageCode(normalized);
    document.documentElement.dir = isRtlLanguage(normalized) ? "rtl" : "ltr";
    window.dispatchEvent(new Event("bankHubLanguageSync"));
  }, []);

  useEffect(() => {
    const sync = () => {
      const storedLang = getCurrentStoredLanguage();
      setLangState(storedLang);
      document.documentElement.lang = getLanguageCode(storedLang);
      document.documentElement.dir = isRtlLanguage(storedLang) ? "rtl" : "ltr";
    };
    window.addEventListener("bankHubLanguageSync", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("bankHubLanguageSync", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const t = useCallback(
    (key: string, values?: TranslationValues) => translate(lang, key, values),
    [lang],
  );

  return { t, lang, setLang, languageCode: getLanguageCode(lang), dir: isRtlLanguage(lang) ? "rtl" : "ltr" };
}
