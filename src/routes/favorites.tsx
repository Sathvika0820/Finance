import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ExternalLink } from "lucide-react";
import { BANKS } from "@/data/banks";
import { BankLogo } from "@/components/BankLogo";
import { useFavorites, pushRecent } from "@/lib/favorites";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — Bank Hub" },
      { name: "description", content: "Your saved banks for quick access." },
    ],
  }),
  component: () => (
    <AppShell>
      <FavoritesPage />
    </AppShell>
  ),
});

function FavoritesPage() {
  const { ids, remove } = useFavorites();
  const favs = ids.map((id) => BANKS.find((b) => b.id === id)).filter(Boolean);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your saved banks, ready in one tap.
        </p>
      </header>

      {favs.length === 0 ? (
        <div className="glass shadow-soft rounded-3xl p-10 flex flex-col items-center text-center mt-10">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <Heart className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="font-semibold mt-4">No favorites yet</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-[16rem]">
            Tap the heart on any bank to save it here for quick access.
          </p>
          <Link
            to="/banks"
            className="mt-6 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium"
          >
            Browse banks
          </Link>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div layout className="space-y-2">
            {favs.map((b, i) =>
              b ? (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass shadow-soft rounded-2xl p-4 flex items-center gap-3"
                >
                  <button
                    onClick={() => {
                      pushRecent(b.id);
                      window.open(b.website, "_blank", "noopener,noreferrer");
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <BankLogo bank={b} />
                    <div className="min-w-0">
                      <p className="font-semibold truncate text-[15px]">{b.name}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <ExternalLink className="w-3 h-3" /> {b.category}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => remove(b.id)}
                    aria-label="Remove favorite"
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : null,
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}