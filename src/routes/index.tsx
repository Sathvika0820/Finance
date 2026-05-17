import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Landmark, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { OsmaniaLogo } from "../components/OsmaniaLogo";
import { OTBILogo } from "../components/OTBILogo";
import { useTranslation } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/dashboard" }), 2800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="splash-bg min-h-screen min-h-[100dvh] flex flex-col items-center text-white relative overflow-hidden select-none">
      {/* Ambient purple glow orbs */}
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />

      {/* ── Top Branding Row ── */}
      <div className="splash-animate splash-delay-1 flex items-center justify-center gap-4 pt-[max(env(safe-area-inset-top,16px),16px)] mt-6 px-6 w-full max-w-sm">
        <OsmaniaLogo />
        {/* Vertical purple glowing divider */}
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-purple-400/60 to-transparent shadow-[0_0_8px_rgba(147,51,234,0.4)]" />
        <OTBILogo />
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 -mt-4">
        {/* Welcome text with decorative side accents */}
        <div className="splash-animate splash-delay-2 flex items-center gap-3">
          <span className="flex gap-1">
            <span className="w-1 h-1 rounded-full bg-purple-400/60" />
            <span className="w-6 h-px bg-gradient-to-r from-transparent to-purple-400/50 self-center" />
          </span>
          <span className="text-sm tracking-[0.25em] text-white/70 uppercase font-light">
            {t("welcomeTo")}
          </span>
          <span className="flex gap-1">
            <span className="w-6 h-px bg-gradient-to-l from-transparent to-purple-400/50 self-center" />
            <span className="w-1 h-1 rounded-full bg-purple-400/60" />
          </span>
        </div>

        {/* Main Title */}
        <h1 className="splash-animate splash-delay-2 text-center">
          <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            {t("bankHub").split(" ")[0]}{" "}
          </span>
          <span className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(147,51,234,0.5)]">
            {t("bankHub").split(" ")[1] || ""}
          </span>
        </h1>

        {/* Decorative sparkle divider */}
        <div className="splash-animate splash-delay-3 flex items-center gap-3 my-1">
          <span className="w-12 h-px bg-gradient-to-r from-transparent to-purple-400/40" />
          <Sparkles className="w-4 h-4 text-purple-400/80" strokeWidth={1.5} />
          <span className="w-12 h-px bg-gradient-to-l from-transparent to-purple-400/40" />
        </div>

        {/* Premium Icon Card */}
        <div className="splash-animate splash-delay-3 splash-icon-card relative">
          <div className="absolute inset-0 rounded-[22px] border border-purple-400/20 shadow-[0_0_30px_rgba(147,51,234,0.15),inset_0_0_30px_rgba(147,51,234,0.05)]" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[20px] bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] flex items-center justify-center">
            <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-purple-400/30 shadow-[0_0_20px_rgba(147,51,234,0.25)]" />
            <Landmark
              className="w-10 h-10 sm:w-12 sm:h-12 text-white relative z-10"
              strokeWidth={1.4}
            />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-purple-500/20 rounded-full blur-xl" />
        </div>

        {/* Tagline */}
        <div className="splash-animate splash-delay-4 text-center mt-2">
          <p className="text-base sm:text-lg font-medium tracking-wide text-white/90">
            {t("tagline")}
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex flex-col items-center gap-5 pb-[max(env(safe-area-inset-bottom,20px),20px)] mb-2">
        <p className="splash-animate splash-delay-5 text-xs text-white/50 tracking-wide">
          Built by Osmania University{" "}
          <span className="text-purple-400/80 font-medium">(OTBI)</span>
        </p>

        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-purple-400/60 splash-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}