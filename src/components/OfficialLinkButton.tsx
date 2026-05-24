import { ExternalLink, ShieldCheck } from "lucide-react";
import type { MouseEvent } from "react";
import { isVerifiedOfficialUrl } from "@/data/officialLinks";

type OfficialLinkButtonProps = {
  item: {
    name: string;
    officialWebsite: string;
    verified: boolean;
  };
  label?: string;
  unverifiedLabel?: string;
  compact?: boolean;
  iconOnly?: boolean;
  className?: string;
  onVerifiedClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const UNVERIFIED_LABEL = "Official link not verified yet.";

export function OfficialLinkButton({
  item,
  label = "Official Website",
  unverifiedLabel = UNVERIFIED_LABEL,
  compact = false,
  iconOnly = false,
  className = "",
  onVerifiedClick,
}: OfficialLinkButtonProps) {
  const url = item.verified && isVerifiedOfficialUrl(item.officialWebsite) ? item.officialWebsite : "";

  if (!url) {
    const disabledClass = iconOnly
      ? `inline-flex items-center justify-center p-1 bg-transparent text-amber-800 opacity-90 cursor-not-allowed ${className}`
      : `inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-800 opacity-90 cursor-not-allowed ${className}`;

    return (
      <button
        type="button"
        disabled
        title={unverifiedLabel}
        aria-label={unverifiedLabel}
        className={disabledClass}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        {!iconOnly && <span>{unverifiedLabel}</span>}
      </button>
    );
  }

  const btnClass = iconOnly
    ? `inline-flex items-center justify-center p-1 bg-transparent hover:opacity-95 ${className}`
    : `inline-flex items-center justify-center gap-1.5 rounded-xl fintech-button px-3 py-2 text-[11px] font-bold active:scale-[0.98] transition-all hover:opacity-95 ${className}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onVerifiedClick}
      aria-label={`Open ${item.name} official website`}
      className={btnClass}
    >
      {iconOnly ? (
        <ExternalLink className="w-4 h-4 text-muted-foreground" />
      ) : (
        <>
          <span>{compact ? "Open" : label}</span>
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
        </>
      )}
    </a>
  );
}

export { UNVERIFIED_LABEL };
