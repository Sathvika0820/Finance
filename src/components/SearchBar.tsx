import { SearchInput } from "@/components/SearchInput";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search banks..." }: Props) {
  return (
    <SearchInput
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      clearable
      iconClassName="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
      clearButtonClassName="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted text-muted-foreground"
      inputClassName="w-full glass shadow-soft rounded-2xl pl-12 pr-12 py-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40 transition"
    />
  );
}
