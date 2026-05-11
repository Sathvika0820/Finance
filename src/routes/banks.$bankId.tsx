import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronLeft, ExternalLink, Heart, Smartphone, Globe, Check } from "lucide-react";
import { useEffect } from "react";
import { getBankById } from "@/data/banks";
import { BankLogo } from "@/components/BankLogo";
import { useFavorites, pushRecent } from "@/lib/favorites";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/banks/$bankId")({
  loader: ({ params }) => {
    const bank = getBankById(params.bankId);
    if (!bank) throw notFound();
    return { bank };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.bank.name} — Bank Hub` },
          { name: "description", content: loaderData.bank.description },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">Bank not found</h1>
      <Link to="/banks" className="text-sm underline">Back to all banks</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p>{error.message}</p>
      <button onClick={reset} className="text-sm underline">Try again</button>
    </div>
  ),
  component: BankDetail,
});

function BankDetail() {
  const { bank } = Route.useLoaderData();
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(bank.id);

  useEffect(() => {
    pushRecent(bank.id);
  }, [bank.id]);

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className={`bg-gradient-to-br ${bank.accent} text-white px-5 pt-6 pb-20 rounded-b-[2.5rem] relative overflow-hidden`}>
        <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <header className="flex items-center justify-between relative">
          <Link to="/banks" className="p-2 -ml-2 rounded-xl bg-white/10 backdrop-blur">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <button
            onClick={() => toggle(bank.id)}
            aria-label="Favorite"
            className="p-2.5 rounded-xl bg-white/10 backdrop-blur"
          >
            <Heart className={`w-5 h-5 ${fav ? "fill-white" : ""}`} />
          </button>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex flex-col items-center text-center"
        >
          <BankLogo bank={bank} size="xl" />
          <h1 className="mt-5 text-2xl font-bold leading-tight">{bank.name}</h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/70">
            {bank.category}
          </p>
        </motion.div>
      </div>

      <div className="-mt-12 mx-5 space-y-4 relative">
        <div className="glass shadow-glow rounded-3xl p-5">
          <p className="text-sm text-foreground/80 leading-relaxed">{bank.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <a
            href={bank.website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-foreground text-background rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform shadow-soft"
          >
            <span className="flex items-center gap-3">
              <Globe className="w-5 h-5" />
              <span className="font-semibold text-sm">Open Website</span>
            </span>
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
          {bank.appLink && (
            <a
              href={bank.appLink}
              target="_blank"
              rel="noopener noreferrer"
              className="glass shadow-soft rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform"
            >
              <span className="flex items-center gap-3">
                <Smartphone className="w-5 h-5" />
                <span className="font-semibold text-sm">Open Banking App</span>
              </span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
          )}
        </div>

        <section className="glass shadow-soft rounded-3xl p-5">
          <h2 className="font-semibold mb-3">Services offered</h2>
          <ul className="space-y-2">
            {bank.services.map((s: string) => (
              <li key={s} className="flex items-center gap-3 text-sm text-foreground/80">
                <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
                {s}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <BottomNav />
    </div>
  );
}