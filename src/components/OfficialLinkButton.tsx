import { ExternalLink, ShieldCheck } from "lucide-react";
import type { MouseEvent } from "react";

type OfficialLinkButtonProps = {
  item: {
    name: string;
    officialWebsite: string;
    verified: boolean;
  };
  label?: string;
  unverifiedLabel?: string;
  compact?: boolean;
  className?: string;
  onVerifiedClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const UNVERIFIED_LABEL = "Official link not verified yet.";

export function OfficialLinkButton({
  item,
  label = "Official Website",
  unverifiedLabel = UNVERIFIED_LABEL,
  compact = false,
  className = "",
  onVerifiedClick,
}: OfficialLinkButtonProps) {
  const url = item.verified && item.officialWebsite.startsWith("https://") ? item.officialWebsite : "";

  if (!url) {
    return (
      <button
        type="button"
        disabled
        title={unverifiedLabel}
        aria-label={unverifiedLabel}
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-700 opacity-80 cursor-not-allowed ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>{unverifiedLabel}</span>
      </button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onVerifiedClick}
      aria-label={`Open ${item.name} official website`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-foreground px-3 py-2 text-[11px] font-bold text-background shadow-soft active:scale-[0.98] transition-all hover:opacity-95 ${className}`}
    >
      <span>{compact ? "Open" : label}</span>
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

export { UNVERIFIED_LABEL };
