import { useState } from "react";
import { type Bank, logoUrl } from "@/data/banks";

interface Props {
  bank: Bank;
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
  const initials = bank.shortName
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();

  if (errored) {
    return (
      <div
        className={`${sizes[size]} rounded-2xl bg-gradient-to-br ${bank.accent} text-white font-bold flex items-center justify-center shadow-soft shrink-0`}
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
        src={logoUrl(bank.logoDomain)}
        alt={`${bank.name} logo`}
        loading="lazy"
        onError={() => setErrored(true)}
        className="w-full h-full object-contain p-1.5"
      />
    </div>
  );
}