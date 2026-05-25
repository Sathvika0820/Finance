import * as React from "react";
import { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "value"> {
  value: string;
  onValueChange: (value: string) => void;
  containerClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  clearButtonClassName?: string;
  clearable?: boolean;
}

export function SearchInput({
  value,
  onValueChange,
  containerClassName = "relative",
  inputClassName,
  iconClassName = "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
  clearButtonClassName = "absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
  clearable = false,
  autoComplete = "off",
  spellCheck = false,
  ...inputProps
}: SearchInputProps) {
  const composing = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;
    if (!composing.current) {
      onValueChange(nextValue);
    }
  };

  const handleCompositionStart = () => {
    composing.current = true;
  };

  const handleCompositionEnd = (event: React.CompositionEvent<HTMLInputElement>) => {
    composing.current = false;
    onValueChange(event.currentTarget.value);
  };

  useEffect(() => {
    if (!composing.current && inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  }, [value]);

  return (
    <div className={containerClassName}>
      <Search className={iconClassName} />
      <input
        ref={inputRef}
        {...inputProps}
        type="text"
        value={value}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        autoComplete={autoComplete}
        autoCorrect="off"
        spellCheck={spellCheck}
        enterKeyHint="search"
        className={inputClassName}
      />
      {clearable && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          className={`${clearButtonClassName} ${value.length === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
