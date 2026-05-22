import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, GraduationCap, Landmark, Search, SearchCheck, Users, UserRound, Wheat, X } from "lucide-react";
import { useMemo, useState } from "react";
import { OfficialLinkButton } from "@/components/OfficialLinkButton";
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
  t: (key: string) => string;
  speakVoice: (eventKey: string, payload?: any) => void;
}

const categoryIconMap: Record<FinancialInclusionCategoryId, typeof Users> = {
  student: GraduationCap,
  employee: UserRound,
  farmer: Wheat,
  "self-employed": Landmark,
  women: Users,
  "senior-citizen": UserRound,
  others: SearchCheck,
};

function SchemeCard({ scheme }: { scheme: FinancialInclusionScheme }) {
  return (
    <article className="rounded-[18px] border border-border/60 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-blue-600">{scheme.type}</p>
          <h4 className="mt-1 text-[15px] font-bold leading-tight text-foreground">{scheme.name}</h4>
          <p className="mt-2 text-[12px] font-medium leading-relaxed text-muted-foreground">{scheme.description}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-2">
        <div className="rounded-[14px] bg-muted/40 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Eligibility
          </p>
          <p className="mt-1 text-[12px] font-medium leading-relaxed text-muted-foreground">{scheme.eligibility}</p>
        </div>
        <div className="rounded-[14px] bg-blue-50 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-blue-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Benefits
          </p>
          <p className="mt-1 text-[12px] font-medium leading-relaxed text-muted-foreground">{scheme.benefits}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <OfficialLinkButton
          item={{ name: scheme.name, officialWebsite: scheme.officialWebsite, verified: scheme.verified }}
          label="Know More"
          unverifiedLabel="Official link not verified yet."
        />
      </div>
    </article>
  );
}

function CategoryCard({
  category,
  selected,
  onClick,
}: {
  category: FinancialInclusionCategory;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = categoryIconMap[category.id];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[126px] rounded-[18px] border p-4 text-left shadow-sm transition-all active:scale-[0.99] ${
        selected
          ? "border-blue-300 bg-blue-50 shadow-blue-100"
          : "border-border/60 bg-white hover:border-blue-200 hover:bg-blue-50/40"
      }`}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-3 text-[14px] font-bold text-foreground">{category.name}</h3>
      <p className="mt-1 text-[11px] font-semibold leading-snug text-muted-foreground">{category.description}</p>
    </button>
  );
}

export function FinancialInclusionModal({ isOpen, onClose, t, speakVoice }: FinancialInclusionModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<FinancialInclusionCategoryId | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCategory = useMemo(
    () => FINANCIAL_INCLUSION_CATEGORIES.find((category) => category.id === selectedCategoryId),
    [selectedCategoryId]
  );

  const selectedSchemes = useMemo(() => {
    if (!selectedCategoryId) return [];
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const categorySchemes = getSchemesByCategory(selectedCategoryId);

    if (!normalizedQuery) return categorySchemes;

    return categorySchemes.filter((scheme) => {
      const searchableText = [
        scheme.name,
        scheme.type,
        scheme.description,
        scheme.eligibility,
        scheme.benefits,
        ...scheme.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [searchQuery, selectedCategoryId]);

  if (!isOpen) return null;

  const handleCategorySelect = (category: FinancialInclusionCategory) => {
    setSelectedCategoryId(category.id);
    setSearchQuery("");
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
          className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-[32px] bg-white shadow-2xl sm:max-w-[460px] sm:rounded-[32px]"
        >
          <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-border/50 bg-white p-5 pb-3">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                <Users className="h-5 w-5 fill-blue-500/20 text-blue-500" />
                {t("financialInclusionHelp")}
              </h2>
              <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                Category-based official scheme guidance.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 rounded-full bg-muted/50 p-2 transition-colors hover:bg-muted"
              aria-label="Close financial inclusion help"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-muted/10 p-4">
            {selectedCategory ? (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId(null)}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white px-3 py-2 text-[12px] font-bold text-foreground shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All categories
                </button>

                <section className="rounded-[20px] border border-blue-100 bg-blue-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-blue-700">Selected category</p>
                  <h3 className="mt-1 text-lg font-bold text-foreground">{selectedCategory.name}</h3>
                  <p className="mt-1 text-[12px] font-semibold leading-relaxed text-muted-foreground">
                    {selectedCategory.description}
                  </p>
                </section>

                <label className="flex items-center gap-2 rounded-[16px] border border-border/70 bg-white px-3 py-2 shadow-sm">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search schemes in this category"
                    className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </label>

                <div className="space-y-3">
                  {selectedSchemes.length > 0 ? (
                    selectedSchemes.map((scheme) => <SchemeCard key={scheme.id} scheme={scheme} />)
                  ) : (
                    <div className="rounded-[18px] border border-amber-200 bg-amber-50 p-4 text-[13px] font-bold text-amber-800">
                      Official link not verified yet.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="rounded-[18px] border border-border/60 bg-white p-4 shadow-sm">
                  <h3 className="text-[15px] font-bold text-foreground">Choose who needs help</h3>
                  <p className="mt-1 text-[12px] font-medium leading-relaxed text-muted-foreground">
                    Select a category to see schemes with official government, bank, or institution links only.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {FINANCIAL_INCLUSION_CATEGORIES.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      selected={selectedCategoryId === category.id}
                      onClick={() => handleCategorySelect(category)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="shrink-0 border-t border-border/50 bg-white p-4 text-center">
            <p className="text-[11px] font-medium text-muted-foreground/80">
              Bank Hub redirects only to official service websites. No credentials are stored.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
