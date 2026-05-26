import * as React from "react";
import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: Props) {
  const { t } = useTranslation();
  const composing = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;
    if (!composing.current) {
      onChange(nextValue);
    }
  };

  const handleCompositionStart = () => {
    composing.current = true;
  };

  const handleCompositionEnd = (event: React.CompositionEvent<HTMLInputElement>) => {
    composing.current = false;
    onChange(event.currentTarget.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder || t("searchBanks")}
        className="w-full glass shadow-soft rounded-2xl pl-12 pr-12 py-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40 transition"
      />
      <button
        type="button"
        onClick={() => onChange("")}
        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted text-muted-foreground transition ${
          value ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label={t("clearSearch")}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
