import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, GraduationCap, Info, Landmark, SearchCheck, Users, UserRound, Wheat, X, FileText, ExternalLink, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { OfficialLinkButton } from "@/components/OfficialLinkButton";
import { SearchInput } from "@/components/SearchInput";
import { getOfficialLinkEntry } from "@/data/officialLinks";
import {
  FINANCIAL_INCLUSION_CATEGORIES,
  type FinancialInclusionCategory,
  type FinancialInclusionCategoryId,
  type FinancialInclusionScheme,
  getSchemesByCategory,
} from "@/data/schemeData";

interface FinancialInclusionModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
  speakVoice: (eventKey: string, payload?: any) => void;
}

const categoryIconMap: Record<FinancialInclusionCategoryId, typeof Users> = {
  student: GraduationCap,
  employee: UserRound,
  farmer: Wheat,
  "self-employed": Landmark,
  women: Users,
  "senior-citizen": UserRound,
  citizen: FileText,
  others: SearchCheck,
};

function SchemeCard({
  scheme,
  t,
  onInfo,
}: {
  scheme: FinancialInclusionScheme;
  t: (key: string, values?: Record<string, string | number>) => string;
  onInfo: (scheme: FinancialInclusionScheme) => void;
}) {
  const officialEntry = getOfficialLinkEntry("governmentSchemes", scheme.id);
  return (
    <article className="flex items-center justify-between gap-3 rounded-[16px] border border-border/60 bg-white/95 px-3 py-2.5 shadow-sm">
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <h4 className="min-w-0 text-[13px] font-bold leading-snug text-foreground">
            {scheme.name}
          </h4>
        </div>
        <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">{t("officialSchemeDescription")}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onInfo(scheme)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100"
          aria-label={t("viewBankDetails", { bank: scheme.name })}
        >
          <Info className="h-4 w-4" />
        </button>
        <OfficialLinkButton
          item={{
            name: scheme.name,
            officialWebsite: officialEntry?.officialLink || "",
            verified: Boolean(officialEntry?.verified),
          }}
          iconOnly
          unverifiedLabel={t("officialLinkNotVerifiedYet")}
          className="h-9 w-9 rounded-xl border border-border/70 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100"
        />
      </div>
    </article>
  );
}

function SchemeInfoModal({
  scheme,
  t,
  onClose,
}: {
  scheme: FinancialInclusionScheme | null;
  t: (key: string, values?: Record<string, string | number>) => string;
  onClose: () => void;
}) {
  if (!scheme) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/35 px-3 py-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-[24px] border border-border/70 bg-white p-5 shadow-2xl sm:rounded-[24px]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase text-slate-500">{t("information")}</p>
            <h3 className="mt-1 text-[17px] font-bold leading-tight text-foreground">{scheme.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={t("close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <section className="rounded-[16px] bg-slate-50 p-3">
            <h4 className="text-[11px] font-bold uppercase text-slate-600">{t("information")}</h4>
            <p className="mt-1 text-[12px] font-medium leading-relaxed text-muted-foreground">{t("officialSchemeDescription")}</p>
          </section>
          <section className="rounded-[16px] bg-slate-50 p-3">
            <h4 className="text-[11px] font-bold uppercase text-slate-600">{t("eligibility")}</h4>
            <p className="mt-1 text-[12px] font-medium leading-relaxed text-muted-foreground">{t("checkOfficialDetails")}</p>
          </section>
          <section className="rounded-[16px] bg-slate-50 p-3">
            <h4 className="text-[11px] font-bold uppercase text-slate-600">{t("benefits")}</h4>
            <p className="mt-1 text-[12px] font-medium leading-relaxed text-muted-foreground">{t("checkOfficialDetails")}</p>
          </section>
          {scheme.importantNotes && (
            <section className="rounded-[16px] border border-amber-200 bg-amber-50 p-3">
              <h4 className="text-[11px] font-bold uppercase text-amber-800">{t("importantNotes")}</h4>
              <p className="mt-1 text-[12px] font-medium leading-relaxed text-amber-900/80">{scheme.importantNotes === "Please select your state to access the appropriate MeeSeva portal." ? t("selectStateMeeSeva") || scheme.importantNotes : t("checkOfficialDetails")}</p>
            </section>
          )}
          <div className="pt-2 flex flex-col gap-2">
            <a 
              href={scheme.officialWebsite || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-full rounded-[14px] py-3 text-[13px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                scheme.officialWebsite ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]" : "bg-slate-100 text-slate-400 pointer-events-none"
              }`}
            >
              <ExternalLink className="h-4 w-4" />
              {t("openOfficialPortal") || "Open Official Portal"}
            </a>
            {scheme.customAction && (
              <a
                href={scheme.customAction.onClickUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-[14px] py-3 text-[13px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 active:scale-[0.98]"
              >
                <MapPin className="h-4 w-4" />
                {t(scheme.customAction.labelKey) || "Find Nearby Center"}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  selected,
  onClick,
  t,
}: {
  category: FinancialInclusionCategory;
  selected: boolean;
  onClick: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const Icon = categoryIconMap[category.id];
  const translate = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };
  const categoryName = translate(`financialCategory.${category.id}.name`, category.name);
  const categoryDescription = t("officialSchemeDescription");

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[126px] rounded-[18px] border p-4 text-left shadow-sm transition-all active:scale-[0.99] ${
        selected
          ? "border-slate-300 bg-slate-100/80 shadow-soft"
          : "border-border/60 bg-white/95 hover:border-slate-300 hover:bg-slate-50/80"
      }`}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-3 text-[14px] font-bold text-foreground break-words">{categoryName}</h3>
      <p className="mt-1 text-[11px] font-semibold leading-snug text-muted-foreground break-words">{categoryDescription}</p>
    </button>
  );
}

export function FinancialInclusionModal({ isOpen, onClose, t, speakVoice }: FinancialInclusionModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<FinancialInclusionCategoryId | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [selectedSchemeInfo, setSelectedSchemeInfo] = useState<FinancialInclusionScheme | null>(null);

  const selectedCategory = useMemo(
    () => FINANCIAL_INCLUSION_CATEGORIES.find((category) => category.id === selectedCategoryId),
    [selectedCategoryId]
  );

  const categorySchemes = useMemo(() => {
    if (!selectedCategoryId) return [];
    return getSchemesByCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  const subcategories = useMemo(() => {
    return ["All", ...Array.from(new Set(categorySchemes.map((scheme) => scheme.subcategory)))];
  }, [categorySchemes]);

  const selectedSchemes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return categorySchemes.filter((scheme) => {
      if (activeSubcategory !== "All" && scheme.subcategory !== activeSubcategory) return false;
      if (!normalizedQuery) return true;

      const searchableText = [
        scheme.name,
        scheme.subcategory,
        scheme.type,
        scheme.shortDescription,
        scheme.eligibility,
        scheme.benefits,
        scheme.importantNotes,
        ...scheme.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [activeSubcategory, categorySchemes, searchQuery]);

  if (!isOpen) return null;

  const handleCategorySelect = (category: FinancialInclusionCategory) => {
    setSelectedCategoryId(category.id);
    setSearchQuery("");
    setActiveSubcategory("All");
    speakVoice("showingTopic", { serviceName: category.name });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 pb-0 sm:items-center sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white/95 shadow-2xl sm:max-w-[460px] sm:rounded-[24px] border border-border/70 backdrop-blur-xl"
        >
          <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-border/50 bg-white/90 p-5 pb-3">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                <Users className="h-5 w-5 fill-sky-500/20 text-sky-700" />
                {t("financialInclusionHelp")}
              </h2>
              <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                {t("categoryBasedOfficialSchemeGuidance")}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 tap-target rounded-full bg-muted/50 p-2 transition-colors hover:bg-muted"
              aria-label={t("close")}
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-4">
            {selectedCategory ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setSearchQuery("");
                    setActiveSubcategory("All");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white px-3 py-2 text-[12px] font-bold text-foreground shadow-sm hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("allCategories")}
                </button>

                <section className="rounded-[20px] border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-600">{t("selectedCategory")}</p>
                  <h3 className="mt-1 text-lg font-bold text-foreground">
                    {(() => {
                      const value = t(`financialCategory.${selectedCategory.id}.name`);
                      return value === `financialCategory.${selectedCategory.id}.name` ? selectedCategory.name : value;
                    })()}
                  </h3>
                  <p className="mt-1 text-[12px] font-semibold leading-relaxed text-muted-foreground">
                    {t("officialSchemeDescription")}
                  </p>
                </section>

                <SearchInput
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  placeholder={t("searchSchemesInCategory")}
                  containerClassName="relative rounded-[16px] border border-border/70 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-slate-200"
                  iconClassName="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 text-muted-foreground pointer-events-none"
                  inputClassName="min-w-0 w-full bg-transparent pl-6 text-[13px] font-semibold text-foreground outline-none placeholder:text-muted-foreground"
                />

                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {subcategories.map((subcategory) => {
                    const active = activeSubcategory === subcategory;
                    return (
                      <button
                        key={subcategory}
                        type="button"
                        onClick={() => setActiveSubcategory(subcategory)}
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                          active
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-border/70 bg-white text-muted-foreground hover:bg-slate-50"
                        }`}
                      >
                        {subcategory === "All" ? t("all") : t("selectedCategory")}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {selectedSchemes.length > 0 ? (
                    selectedSchemes.map((scheme) => (
                      <SchemeCard
                        key={scheme.id}
                        scheme={scheme}
                        t={t}
                        onInfo={setSelectedSchemeInfo}
                      />
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-amber-200 bg-amber-50 p-4 text-[13px] font-bold text-amber-800">
                      {t("officialLinkNotVerifiedYet")}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="rounded-[18px] border border-border/60 bg-white/95 p-4 shadow-sm">
                  <h3 className="text-[15px] font-bold text-foreground">{t("chooseWhoNeedsHelp")}</h3>
                  <p className="mt-1 text-[12px] font-medium leading-relaxed text-muted-foreground">
                    {t("selectCategoryOfficialSchemes")}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {FINANCIAL_INCLUSION_CATEGORIES.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      selected={selectedCategoryId === category.id}
                      onClick={() => handleCategorySelect(category)}
                      t={t}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="shrink-0 border-t border-border/50 bg-white p-4 text-center">
            <p className="text-[11px] font-medium text-muted-foreground/80">
              {t("bankHubOfficialRedirectTrust")}
            </p>
          </div>
        </motion.div>
        <SchemeInfoModal
          scheme={selectedSchemeInfo}
          t={t}
          onClose={() => setSelectedSchemeInfo(null)}
        />
      </div>
    </AnimatePresence>
  );
}
