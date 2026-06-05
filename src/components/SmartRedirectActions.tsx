import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, ExternalLink, Globe, Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import {
  getAndroidStoreUrl,
  getIosStoreUrl,
  type InstitutionRedirectConfig,
} from "@/data/institutionRedirects";
import { isVerifiedOfficialUrl } from "@/data/officialLinks";

type Platform = "android" | "ios" | "desktop";
type RedirectStatus = "unknown" | "checking" | "installed" | "not_installed" | "opening_website";

interface SmartRedirectActionsProps {
  institution: InstitutionRedirectConfig;
  logo?: ReactNode;
  onWebsiteOpened?: () => void;
  onAppResolved?: () => void;
  className?: string;
}

function getPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

function isStoreUrl(url: string) {
  return /^https:\/\/(play\.google\.com|apps\.apple\.com)\//.test(url);
}

function openExternal(url: string) {
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) window.location.assign(url);
}

function buildAndroidIntent(config: InstitutionRedirectConfig, fallbackUrl: string) {
  if (!config.androidPackage) return "";
  const scheme = config.deepLink?.split(":")[0] || "https";
  return `intent://open#Intent;scheme=${scheme};package=${config.androidPackage};S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`;
}

function getLaunchUrl(config: InstitutionRedirectConfig, platform: Platform, fallbackUrl: string) {
  if (platform === "android") {
    return buildAndroidIntent(config, fallbackUrl) || config.deepLink || "";
  }

  if (platform === "ios") {
    return config.universalLink || config.deepLink || "";
  }

  return config.deepLink || "";
}

export function SmartRedirectActions({
  institution,
  logo,
  onWebsiteOpened,
  onAppResolved,
  className = "",
}: SmartRedirectActionsProps) {
  const [status, setStatus] = useState<RedirectStatus>("unknown");
  const [busyAction, setBusyAction] = useState<"website" | "app" | null>(null);
  const redirectGuard = useRef({ key: "", time: 0 });

  const platform = useMemo(getPlatform, []);
  const androidStore = getAndroidStoreUrl(institution);
  const iosStore = getIosStoreUrl(institution);
  const storeUrl = platform === "ios" ? iosStore || androidStore : androidStore || iosStore;
  const appName = institution.appName || `${institution.name} app`;
  const canOpenApp = !!(institution.androidPackage || institution.iosAppId || institution.deepLink || institution.universalLink);
  const websiteVerified = institution.website.startsWith("https://") && (isVerifiedOfficialUrl(institution.website) || !!institution.website);

  const openWebsite = () => {
    const now = Date.now();
    if (redirectGuard.current.key === `website:${institution.id}` && now - redirectGuard.current.time < 1200) return;
    redirectGuard.current = { key: `website:${institution.id}`, time: now };

    if (!websiteVerified) {
      toast.error("Official website is not verified.");
      return;
    }

    setBusyAction("website");
    setStatus("opening_website");
    window.setTimeout(() => {
      openExternal(institution.website);
      setBusyAction(null);
      setStatus("unknown");
      onWebsiteOpened?.();
    }, 180);
  };

  const redirectToStore = () => {
    setStatus("not_installed");
    setBusyAction(null);
    toast.info("App not found on this device. Redirecting to official store.");
    if (storeUrl && isStoreUrl(storeUrl)) {
      window.setTimeout(() => openExternal(storeUrl), 350);
    }
  };

  const openApp = () => {
    const now = Date.now();
    if (redirectGuard.current.key === `app:${institution.id}` && now - redirectGuard.current.time < 1800) return;
    redirectGuard.current = { key: `app:${institution.id}`, time: now };

    if (!canOpenApp || !storeUrl) {
      redirectToStore();
      return;
    }

    setBusyAction("app");
    setStatus("checking");

    let launched = false;
    const markLaunched = () => {
      launched = true;
      setStatus("installed");
      setBusyAction(null);
      onAppResolved?.();
    };

    const cleanup = () => {
      window.removeEventListener("pagehide", markLaunched);
      window.removeEventListener("blur", markLaunched);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };

    const onVisibilityChange = () => {
      if (document.hidden) markLaunched();
    };

    window.addEventListener("pagehide", markLaunched, { once: true });
    window.addEventListener("blur", markLaunched, { once: true });
    document.addEventListener("visibilitychange", onVisibilityChange, { once: true });

    const launchUrl = getLaunchUrl(institution, platform, storeUrl);
    if (!launchUrl) {
      cleanup();
      redirectToStore();
      return;
    }

    window.location.href = launchUrl;

    window.setTimeout(() => {
      cleanup();
      if (!launched && !document.hidden) redirectToStore();
    }, 500);
  };

  const statusCopy = {
    unknown: canOpenApp ? "Tap to check installed app" : "App link unavailable",
    checking: `Checking ${appName}...`,
    installed: "Installed",
    not_installed: "Not Installed",
    opening_website: "Opening secure website...",
  }[status];

  return (
    <div className={`rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-200/60 ${className}`}>
      <div className="flex items-center gap-3">
        {logo}
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-black leading-tight text-slate-950">{institution.name}</p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Official Redirects
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-2">
        <div className="flex items-center justify-between gap-3 text-[12px] font-bold">
          <span className="text-slate-500">App Status</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
            status === "installed"
              ? "bg-emerald-100 text-emerald-700"
              : status === "not_installed"
                ? "bg-amber-100 text-amber-800"
                : status === "checking"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-200 text-slate-700"
          }`}>
            {status === "checking" && <Loader2 className="h-3 w-3 animate-spin" />}
            {status === "installed" && <CheckCircle2 className="h-3 w-3" />}
            {status === "not_installed" && <AlertCircle className="h-3 w-3" />}
            {statusCopy}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={openWebsite}
          disabled={busyAction !== null}
          className="group flex min-h-14 w-full items-center justify-between rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950 px-4 py-3 text-left text-white shadow-lg shadow-blue-950/20 transition-all disabled:opacity-70"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/12">
              {busyAction === "website" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Globe className="h-5 w-5" />}
            </span>
            <span>
              <span className="block text-sm font-black">Open Website</span>
              <span className="block text-[11px] font-semibold text-blue-100">{new URL(institution.website).hostname}</span>
            </span>
          </span>
          <ExternalLink className="h-4 w-4 text-blue-100 transition-transform group-hover:translate-x-0.5" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={openApp}
          disabled={busyAction !== null}
          className="group flex min-h-14 w-full items-center justify-between rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-300 to-yellow-500 px-4 py-3 text-left text-slate-950 shadow-lg shadow-amber-300/30 transition-all disabled:opacity-70"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/10">
              {busyAction === "app" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Smartphone className="h-5 w-5" />}
            </span>
            <span>
              <span className="block text-sm font-black">Open App</span>
              <span className="block text-[11px] font-bold text-slate-700">{appName}</span>
            </span>
          </span>
          <ExternalLink className="h-4 w-4 text-slate-700 transition-transform group-hover:translate-x-0.5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {status === "not_installed" && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] font-semibold leading-relaxed text-amber-900"
          >
            App not found on this device. Redirecting to official store.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
