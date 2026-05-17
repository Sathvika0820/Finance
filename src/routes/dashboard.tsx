import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronDown, Search, ExternalLink, ArrowDownUp, Settings, Landmark, Building2, Wallet, CreditCard, Home, Users, X } from "lucide-react";
import { BANKS, CATEGORIES, getBankDisplayName, Bank } from "@/data/banks";
import { BankLogo } from "@/components/BankLogo";
import { useFavorites, pushRecent } from "@/lib/favorites";
import { AppShell } from "@/components/AppShell";
import { SettingsModal } from "@/components/SettingsModal";
import { CrestLogo } from "@/components/CrestLogo";
import { useVoiceAssistant } from "@/lib/voice";
import { useTranslation } from "@/lib/i18n";

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

const CATEGORY_ICONS: Record<string, { icon: any, color: string, bg: string }> = {
  "Public Sector": { icon: Landmark, color: "text-blue-500", bg: "bg-blue-100/50" },
  "Private Sector": { icon: Building2, color: "text-green-500", bg: "bg-green-100/50" },
  "Small Finance": { icon: Wallet, color: "text-amber-500", bg: "bg-amber-100/50" },
  "Payments": { icon: CreditCard, color: "text-purple-500", bg: "bg-purple-100/50" },
  "Regional Rural": { icon: Home, color: "text-rose-500", bg: "bg-rose-100/50" },
  "Co-operative": { icon: Users, color: "text-cyan-500", bg: "bg-cyan-100/50" },
};

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

function SelectedBankTile({ bank, openBankSafely, speakVoice, t, lang }: { bank: Bank, openBankSafely: (b: Bank, source?: string, event?: any) => void, speakVoice: any, t: any, lang: any }) {
  const { toggle } = useFavorites();
  const displayName = getBankDisplayName(bank, lang);
  
  return (
    <div className="bg-white border border-border/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[18px] p-4 flex flex-col items-center gap-3 min-w-[125px] relative">
      <button 
        onClick={(e) => {
          pushRecent(bank.id);
          openBankSafely(bank, "selected_bank", e);
        }} 
        className="flex flex-col items-center gap-2 w-full pt-1" 
        aria-label={`Open ${displayName}`}
      >
        <BankLogo bank={bank} size="md" />
        <div className="text-center mt-1">
          <p className="font-bold text-[12px] text-foreground leading-tight line-clamp-1">{displayName}</p>
          <p className="text-[9px] font-medium text-muted-foreground mt-0.5">{t(getCatKey(bank.category))}</p>
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          speakVoice("bankRemoved", { bank });
          toggle(bank.id);
        }}
        aria-label="Remove from favorites"
        className="absolute top-2.5 right-2.5"
      >
        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
      </button>
    </div>
  );
}

function PopularBankRow({ bank, openBankSafely, t, lang }: { bank: Bank, openBankSafely: (b: Bank, source?: string, event?: any) => void, t: any, lang: any }) {
  const displayName = getBankDisplayName(bank, lang);
  return (
    <button 
      onClick={(e) => {
        pushRecent(bank.id);
        openBankSafely(bank, "popular_bank", e);
      }}
      className="w-full flex items-center justify-between p-3 active:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <BankLogo bank={bank} size="sm" />
        <div className="text-left min-w-0">
          <p className="font-bold text-[13px] text-foreground truncate">{displayName}</p>
          <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{t(getCatKey(bank.category))}</p>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />
    </button>
  );
}

function Dashboard() {
  const { t, lang } = useTranslation();
  const { ids, toggle, isFavorite } = useFavorites();
  const { speakVoice, openBankSafely } = useVoiceAssistant();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [addQuery, setAddQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const allBanksSorted = useMemo(() => {
    return [...BANKS].sort((a, b) => {
      const nameA = getBankDisplayName(a, lang).toLowerCase();
      const nameB = getBankDisplayName(b, lang).toLowerCase();
      if (sortDirection === 'asc') return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });
  }, [sortDirection, lang]);

  const favBanks = useMemo(
    () => ids.map((id) => BANKS.find((b) => b.id === id)).filter(Boolean) as Bank[],
    [ids]
  );
  
  const popular = useMemo(
    () => ["bob", "boi", "canara", "pnb", "union"].map((id) => BANKS.find((b) => b.id === id)!),
    []
  );

  const addResults = useMemo(() => {
    const q = addQuery.trim().toLowerCase();
    if (!q) return allBanksSorted;
    return allBanksSorted.filter(
      (b) => {
        const catKey = getCatKey(b.category);
        const catLabel = t(catKey).toLowerCase();
        return (
          b.name.toLowerCase().includes(q) || 
          b.shortName.toLowerCase().includes(q) ||
          b.names.english.toLowerCase().includes(q) ||
          b.names.hindi.toLowerCase().includes(q) ||
          b.names.telugu.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          catLabel.includes(q)
        );
      }
    );
  }, [addQuery, allBanksSorted, t]);

  return (
    <div className="space-y-8 pb-6 pt-2">
      <header className="flex items-start justify-between -mt-2">
        <div className="flex-1 pr-4">
          <p className="text-[14px] uppercase tracking-[0.1em] text-muted-foreground font-bold leading-tight">{t("welcomeTo")}</p>
          <h1 className="text-[34px] font-bold tracking-tighter text-foreground leading-none mt-2">{t("bankHub")}</h1>
          <p className="text-[15px] font-bold text-muted-foreground mt-3 leading-[1.3] max-w-[200px] sm:max-w-none">
            {t("tagline")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1 -mr-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div className="h-20 w-auto opacity-95 -mr-1 flex items-center justify-end">
             <CrestLogo className="h-full w-auto" />
          </div>
        </div>
      </header>

      {/* Selected Banks */}
      <section>
        <div className="flex items-baseline justify-between mb-4 mt-2">
          <h3 className="font-bold text-[15px] text-foreground">{t("selectedBanks")} ({favBanks.length})</h3>
          <Link to="/favorites" className="text-[13px] font-semibold text-blue-500 hover:underline">
            {t("seeAll")}
          </Link>
        </div>
        
        {favBanks.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
            {favBanks.map((b) => b && (
              <SelectedBankTile key={b.id} bank={b} openBankSafely={openBankSafely} speakVoice={speakVoice} t={t} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="bg-white border rounded-[20px] p-6 text-center text-muted-foreground text-sm shadow-sm">
            {t("noBanksSelected")}
          </div>
        )}

        {/* Inline Favourites Adder */}
        <div className="mt-4 bg-white border border-border/60 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => setIsAdding((a) => !a)}
            className="w-full flex items-center justify-between p-4 bg-transparent outline-none focus:bg-muted/10 transition-colors"
          >
            <span className="text-[14px] font-semibold text-foreground flex items-center gap-2">
              <span className="text-xl leading-none font-light -mt-0.5">+</span> {t("addYourBanks")}
            </span>
            <div className="flex items-center gap-3">
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                 }}
                 className={`p-1.5 rounded-md transition-colors ${sortDirection === 'desc' ? 'bg-blue-50 text-blue-600' : 'text-muted-foreground/60'}`}
                 title={sortDirection === 'asc' ? "Sort A-Z" : "Sort Z-A"}
               >
                 <ArrowDownUp className={`w-4 h-4 stroke-[2.5] transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
               </button>
               <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isAdding ? "rotate-180" : ""}`} />
            </div>
          </button>

          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-border/50"
              >
                <div className="p-3 flex flex-col h-[60vh] bg-background/20">
                  <div className="relative mb-3 shrink-0">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[2.5]" />
                    <input
                      type="text"
                      placeholder={t("searchBanks")}
                      value={addQuery}
                      onChange={(e) => setAddQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-[13px] font-medium bg-white border border-border/80 rounded-xl outline-none focus:border-foreground/30 transition-colors placeholder:font-normal"
                    />
                  </div>
                  <div className="overflow-y-auto pr-1 flex-1 relative bg-white rounded-xl border border-border/50 divide-y divide-border/30">
                    {addResults.map((b) => {
                      const fav = isFavorite(b.id);
                      const displayName = getBankDisplayName(b, lang);
                      return (
                        <div key={b.id} className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
                          <BankLogo bank={b} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[13px] truncate text-foreground leading-snug">{displayName}</p>
                            <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{t(getCatKey(b.category))}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (!fav) {
                                speakVoice("bankSelected", { bank: b });
                              } else {
                                speakVoice("bankRemoved", { bank: b });
                              }
                              toggle(b.id);
                            }}
                            className="p-2 -mr-1 rounded-lg transition-colors focus:outline-none shrink-0"
                          >
                            <Heart className={`w-4 h-4 ${fav ? "fill-red-500 text-red-500" : "text-border/80"}`} />
                          </button>
                        </div>
                      );
                    })}
                    {addResults.length === 0 && (
                      <p className="text-center text-[13px] font-medium text-muted-foreground py-8">{t("noBanksFound")}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Popular Banks */}
      <section>
         <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-bold text-[15px] text-foreground">{t("popularBanks")}</h3>
          <div className="flex items-center gap-3">
            <Link to="/favorites" className="text-[13px] font-semibold text-blue-500 hover:underline">
              {t("seeAll")}
            </Link>
          </div>
        </div>
        <div className="bg-white border border-border/50 rounded-[20px] p-1 shadow-[0_2px_12px_rgba(0,0,0,0.03)] divide-y divide-border/40">
          {popular.map((b) => b && <PopularBankRow key={b.id} bank={b} openBankSafely={openBankSafely} t={t} lang={lang} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="relative">
        <h3 className="font-bold text-[15px] text-foreground mb-4">{t("categories")}</h3>
        <div className="grid grid-cols-2 gap-3 relative">
          {CATEGORIES.map((cat) => {
            const banksInCat = BANKS.filter((b) => b.category === cat);
            const ui = CATEGORY_ICONS[cat];
            const Icon = ui?.icon || Landmark;
            const isActive = activeCategory === cat;
            
            return (
              <div key={cat} className="relative">
                <button
                  onClick={() => {
                    setActiveCategory(isActive ? null : cat);
                  }}
                  className={`w-full text-left border rounded-[20px] p-3.5 flex items-center justify-between active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${isActive ? 'bg-muted/50 border-input' : 'bg-white border-border/50'}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-[9px] ${ui?.bg || "bg-muted"} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 ${ui?.color || "text-foreground"}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-foreground truncate">{t(getCatKey(cat))}</p>
                      <p className="text-[9px] text-muted-foreground font-semibold mt-0.5">{banksInCat.length} {t("banks")}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground shrink-0 ml-1 transition-transform ${isActive ? 'rotate-180' : 'opacity-70'}`} />
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute left-0 right-0 top-full mt-2 z-[50] bg-white border border-border shadow-xl rounded-2xl p-3 min-w-[280px]"
                      style={{ width: "calc(200% + 12px)", left: CATEGORIES.indexOf(cat) % 2 === 0 ? 0 : "auto", right: CATEGORIES.indexOf(cat) % 2 === 0 ? "auto" : 0 }}
                    >
                      <div className="flex items-center justify-between mb-3 px-1">
                        <h4 className="font-bold text-[13px] text-foreground">{t(getCatKey(cat))}</h4>
                        <button onClick={() => setActiveCategory(null)} className="p-1 hover:bg-muted rounded-full">
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
                        {banksInCat.map(b => {
                          const catDisplayName = getBankDisplayName(b, lang);
                          return (
                            <button
                              key={b.id}
                              onClick={(e) => {
                                pushRecent(b.id);
                                openBankSafely(b, "category_bank", e);
                              }}
                              className="flex flex-col items-center justify-start gap-1.5 p-1 focus:outline-none hover:bg-muted/30 rounded-xl transition-colors active:scale-95"
                            >
                              <BankLogo bank={b} size="sm" />
                              <p className="text-[8px] font-bold text-foreground text-center line-clamp-2 leading-tight">
                                {catDisplayName}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security Notice Footer */}
      <div className="pt-4 pb-2">
        <div className="mx-auto block text-center">
          <p className="text-[12px] font-medium text-foreground/60">
            {t("credentialsNote")}
          </p>
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}