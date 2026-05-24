import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "value"> {
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
  const [draft, setDraft] = useState(value);
  const isComposingRef = useRef(false);

  useEffect(() => {
    if (!isComposingRef.current && value !== draft) {
      setDraft(value);
    }
  }, [draft, value]);

  const commitValue = (nextValue: string) => {
    setDraft(nextValue);
    if (!isComposingRef.current) {
      onValueChange(nextValue);
    }
  };

  return (
    <div className={containerClassName}>
      <Search className={iconClassName} />
      <input
        {...inputProps}
        type="text"
        value={draft}
        onChange={(event) => commitValue(event.currentTarget.value)}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={(event) => {
          isComposingRef.current = false;
          const nextValue = event.currentTarget.value;
          setDraft(nextValue);
          onValueChange(nextValue);
        }}
        autoComplete={autoComplete}
        autoCorrect="off"
        spellCheck={spellCheck}
        enterKeyHint="search"
        className={inputClassName}
      />
      {clearable && draft.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setDraft("");
            onValueChange("");
          }}
          className={clearButtonClassName}
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
