import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { BANKS, CATEGORIES } from "@/data/banks";
import { SearchBar } from "@/components/SearchBar";
import { BankCard, BankTile } from "@/components/BankCard";
import { useRecent } from "@/lib/favorites";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Bank Hub" },
      { name: "description", content: "Your one-tap home for Indian banking access." },
    ],
  }),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function Dashboard() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const recentIds = useRecent();
  const recent = useMemo(
    () => recentIds.map((id) => BANKS.find((b) => b.id === id)).filter(Boolean),
    [recentIds],
  );
  const featured = useMemo(
    () => ["sbi", "hdfc", "icici", "axis", "kotak", "bob"].map((id) => BANKS.find((b) => b.id === id)!),
    [],
  );
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return BANKS.filter(
      (b) => b.name.toLowerCase().includes(q) || b.shortName.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [query]);

  return (
    <div className="space-y-7">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Welcome to</p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">Bank Hub</h1>
        </div>
        <motion.div
          whileTap={{ scale: 0.92 }}
          className="w-11 h-11 rounded-2xl gradient-dark flex items-center justify-center text-white"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </header>

      <SearchBar value={query} onChange={setQuery} />

      {results.length > 0 && (
        <section className="space-y-2">
          {results.map((b, i) => (
            <BankCard key={b.id} bank={b} index={i} />
          ))}
        </section>
      )}

      {results.length === 0 && (
        <>
          {/* Hero card */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate({ to: "/banks" })}
            className="w-full text-left rounded-3xl gradient-dark p-6 text-white shadow-glow relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <p className="text-xs uppercase tracking-widest text-white/60">Discover</p>
            <h2 className="text-xl font-semibold mt-2 leading-tight">
              Browse {BANKS.length}+ Indian banks in one place
            </h2>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
              Explore now <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>

          {/* Featured */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-semibold">Featured banks</h3>
              <Link to="/banks" className="text-xs text-muted-foreground">
                See all
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
              {featured.map((b) => (
                <BankTile key={b.id} bank={b} />
              ))}
            </div>
          </section>

          {/* Recent */}
          {recent.length > 0 && (
            <section>
              <h3 className="font-semibold mb-3">Recently viewed</h3>
              <div className="space-y-2">
                {recent.map((b, i) => b && <BankCard key={b.id} bank={b} index={i} />)}
              </div>
            </section>
          )}

          {/* Categories */}
          <section>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const count = BANKS.filter((b) => b.category === cat).length;
                return (
                  <Link
                    key={cat}
                    to="/banks"
                    search={{ category: cat }}
                    className="glass shadow-soft rounded-2xl p-4 active:scale-95 transition-transform"
                  >
                    <p className="text-sm font-semibold text-foreground">{cat}</p>
                    <p className="text-xs text-muted-foreground mt-1">{count} banks</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      )}
    {/* Security Notice */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Bank Hub does not store any banking credentials.
        </p>
      </div>
    </div>
  );
}