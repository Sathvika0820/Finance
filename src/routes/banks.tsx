import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ChevronLeft } from "lucide-react";
import { BANKS, CATEGORIES, type BankCategory } from "@/data/banks";
import { SearchBar } from "@/components/SearchBar";
import { BankCard } from "@/components/BankCard";
import { AppShell } from "@/components/AppShell";

type BanksSearch = { category?: BankCategory };

export const Route = createFileRoute("/banks")({
  head: () => ({
    meta: [
      { title: "All Banks — Bank Hub" },
      { name: "description", content: "Browse and search all supported Indian banks." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): BanksSearch => {
    const c = search.category;
    if (typeof c === "string" && (CATEGORIES as readonly string[]).includes(c)) {
      return { category: c as BankCategory };
    }
    return {};
  },
  component: () => (
    <AppShell>
      <BanksPage />
    </AppShell>
  ),
});

function BanksPage() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = BANKS.filter((b) => {
      const matchesQ = !q || b.name.toLowerCase().includes(q) || b.shortName.toLowerCase().includes(q);
      const matchesCat = !category || b.category === category;
      return matchesQ && matchesCat;
    });
    list = [...list].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    );
    return list;
  }, [query, category, sortAsc]);

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <Link to="/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">All Banks</h1>
        <button
          onClick={() => setSortAsc((s) => !s)}
          className="p-2 rounded-xl hover:bg-muted"
          aria-label="Sort"
        >
          <ArrowUpDown className="w-5 h-5" />
        </button>
      </header>

      <SearchBar value={query} onChange={setQuery} />

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
        <FilterChip
          active={!category}
          onClick={() => navigate({ search: {} })}
          label="All"
        />
        {CATEGORIES.map((cat) => (
          <FilterChip
            key={cat}
            active={category === cat}
            onClick={() => navigate({ search: { category: cat } })}
            label={cat}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} bank{filtered.length === 1 ? "" : "s"}
      </p>

      <AnimatePresence mode="popLayout">
        <motion.div layout className="space-y-2">
          {filtered.map((b, i) => (
            <BankCard key={b.id} bank={b} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-12">
              No banks match your search.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
        active
          ? "bg-foreground text-background shadow-soft"
          : "glass text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}