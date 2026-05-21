import React from "react";
import { ExternalLink, ShieldAlert } from "lucide-react";

interface OfficialLinkButtonProps {
  url: string;
  label: string;
  className?: string;
  disabledLabel?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const OfficialLinkButton: React.FC<OfficialLinkButtonProps> = ({
  url,
  label,
  className = "",
  disabledLabel = "Official loan link not verified yet.",
  onClick,
}) => {
  const isVerified = typeof url === "string" && url.trim().length > 0;

  if (isVerified) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-foreground text-background text-[12px] font-bold rounded-xl active:scale-[0.98] transition-all whitespace-nowrap shadow-sm hover:opacity-90 ${className}`}
      >
        {label}
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled
      title={disabledLabel}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-muted text-muted-foreground text-[12px] font-bold rounded-xl opacity-50 cursor-not-allowed border border-border/50 whitespace-nowrap ${className}`}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      <span className="truncate max-w-[200px]">{disabledLabel}</span>
    </button>
  );
};
