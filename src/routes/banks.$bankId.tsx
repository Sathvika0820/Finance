import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronLeft, Heart, Smartphone, Check } from "lucide-react";
import { useEffect } from "react";
import { getBankById, getBankDisplayName } from "@/data/banks";
import { BankLogo } from "@/components/BankLogo";
import { OfficialLinkButton } from "@/components/OfficialLinkButton";
import { useFavorites, pushRecent } from "@/lib/favorites";
import { BottomNav } from "@/components/BottomNav";
import { useTranslation } from "@/lib/i18n";
import { speakVoice } from "@/lib/voice";

export const Route = createFileRoute("/banks/$bankId")({
  loader: ({ params }) => {
    const bank = getBankById(params.bankId);
    if (!bank) throw notFound();
    return { bank };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.bank.name} — BankHub` },
          { name: "description", content: loaderData.bank.description },
        ]
      : [],
  }),
  notFoundComponent: () => {
    const { t } = useTranslation();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold">{t("bankNotFound")}</h1>
        <Link to="/dashboard" className="text-sm underline">{t("backToAllBanks")}</Link>
      </div>
    );
  },
  errorComponent: ({ reset }) => <BankDetailError reset={reset} />,
  component: BankDetail,
});

function BankDetailError({ reset }: { reset: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p>{t("pageLoadErrorDescription")}</p>
      <button onClick={reset} className="text-sm underline">{t("tryAgain")}</button>
    </div>
  );
}

function getCatKey(cat: string) {
  const map: Record<string, string> = {
    "Public Sector": "publicSector",
    "Private Sector": "privateSector",
    "Small Finance": "smallFinance",
    "Payments": "payments",
    "Regional Rural": "regionalRural",
    "Co-operative": "cooperative"
  };
  return map[cat] || cat;
}

function BankDetail() {
  const { bank } = Route.useLoaderData();
  const { t, lang } = useTranslation();
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(bank.id);
  const displayName = getBankDisplayName(bank, lang);

  useEffect(() => {
    pushRecent(bank.id);
  }, [bank.id]);

  return (
    <div className="min-h-screen fintech-shell bg-background pb-32">
      <div className="gradient-dark text-white px-5 pt-6 pb-20 rounded-b-[2rem] relative overflow-hidden">
        <header className="flex items-center justify-between relative">
          <Link to="/dashboard" className="p-2 -ml-2 rounded-xl bg-white/10 backdrop-blur">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <button
            onClick={() => toggle(bank.id)}
            aria-label={t(fav ? "removeFromFavorites" : "addToFavorites")}
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
          <h1 className="mt-5 text-2xl font-bold leading-tight">{displayName}</h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/70">
            {t(getCatKey(bank.category))}
          </p>
        </motion.div>
      </div>

      <div className="-mt-12 mx-5 space-y-4 relative">
        <div className="fintech-card rounded-[22px] p-5">
          <p className="text-sm text-foreground/80 leading-relaxed">{t("bankInformation")}</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <OfficialLinkButton
            item={bank}
            label={t("openWebsite")}
            className="w-full rounded-2xl p-4 text-sm"
            onVerifiedClick={() => {
              pushRecent(bank.id);
              speakVoice("openingBank", { bank });
            }}
          />
          {bank.appLink && bank.verified && (
            <a
              href={bank.appLink}
              target="_blank"
              rel="noopener noreferrer"
              className="fintech-card-interactive rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform"
            >
              <span className="flex items-center gap-3">
                <Smartphone className="w-5 h-5" />
                <span className="font-semibold text-sm">{t("openBankingApp")}</span>
              </span>
              <span className="text-xs font-bold text-muted-foreground">{t("open")}</span>
            </a>
          )}
        </div>

        <section className="fintech-card rounded-[22px] p-5">
          <h2 className="font-semibold mb-3">{t("servicesOffered")}</h2>
          <ul className="space-y-2">
            {[t("checkOfficialDetails")].map((service) => (
              <li key={service} className="flex items-center gap-3 text-sm text-foreground/80">
                <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
                {service}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <BottomNav />
    </div>
  );
}
