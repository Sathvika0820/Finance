import { useState } from "react";
import { type Bank, logoUrl } from "@/data/banks";

interface Props {
  bank?: Bank;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "w-10 h-10 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-base",
  xl: "w-24 h-24 text-2xl",
};

export function BankLogo({ bank, size = "md" }: Props) {
  const [errored, setErrored] = useState(false);
  const logoSrc = bank ? logoUrl(bank.logoDomain) : "";
  const initials = (bank?.shortName || "BH")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();
  if (!bank) {
    return (
      <div
        className={`${sizes[size]} rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center shadow-soft shrink-0`}
        aria-hidden
      >
        {initials}
      </div>
    );
  }

  if (errored || !logoSrc) {
    return (
      <div
        className={`${sizes[size]} rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center shadow-soft shrink-0`}
        aria-hidden
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-2xl bg-white shadow-soft shrink-0 overflow-hidden flex items-center justify-center border border-border/60`}
    >
      <img
        src={logoSrc}
        alt={`${bank.name} logo`}
        loading="lazy"
        onError={() => setErrored(true)}
        className="w-full h-full object-contain p-1.5"
      />
    </div>
  );
}
