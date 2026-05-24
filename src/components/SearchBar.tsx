import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search banks…" }: Props) {
  const [local, setLocal] = useState(value || "");
  const composing = useRef(false);
  const lastProp = useRef(value);

  // Keep local in sync when parent value changes (but avoid clobbering while composing)
  useEffect(() => {
    if (!composing.current && value !== lastProp.current) {
      setLocal(value ?? "");
    }
    lastProp.current = value;
  }, [value]);

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={local}
        onChange={(e) => {
          const v = e.target.value;
          setLocal(v);
          if (!composing.current) onChange(v);
        }}
        onCompositionStart={() => (composing.current = true)}
        onCompositionEnd={(e) => {
          composing.current = false;
          const v = (e.target as HTMLInputElement).value;
          setLocal(v);
          onChange(v);
        }}
        placeholder={placeholder}
        className="w-full glass shadow-soft rounded-2xl pl-12 pr-12 py-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40 transition"
      />
      {local && (
        <button
          onClick={() => {
            setLocal("");
            onChange("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted text-muted-foreground"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
