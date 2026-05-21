import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeftRight,
  Search,
  SlidersHorizontal,
  Coins,
  Home,
  BookOpen,
  Car,
  Sparkles,
  Briefcase,
  Sprout,
  HeartHandshake,
  Landmark,
  Info,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { useState, useMemo } from "react";
import { VERIFIED_LOAN_COMPARISONS, LoanComparisonEntry } from "@/data/loanData";
import { BANKS, Bank, getBankDisplayName } from "@/data/banks";
import { BankLogo } from "@/components/BankLogo";
import { OfficialLinkButton } from "@/components/OfficialLinkButton";
import { LoanInfoModal } from "@/components/LoanInfoModal";

interface CompareBankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  lang: string;
  openBankSafely: (b: Bank, source?: string, event?: any) => void;
  speakVoice: (eventKey: string, payload?: any) => void;
}

const LOAN_TYPES = [
  { id: "personal_loan", labelEn: "Personal Loan", labelHi: "व्यक्तिगत ऋण", icon: Coins },
  { id: "home_loan", labelEn: "Home Loan", labelHi: "गृह ऋण", icon: Home },
  { id: "education_loan", labelEn: "Education Loan", labelHi: "शिक्षा ऋण", icon: BookOpen },
  { id: "vehicle_loan", labelEn: "Vehicle Loan", labelHi: "वाहन ऋण", icon: Car },
  { id: "gold_loan", labelEn: "Gold Loan", labelHi: "स्वर्ण ऋण", icon: Sparkles },
  { id: "business_loan", labelEn: "Business Loan", labelHi: "व्यापार ऋण", icon: Briefcase },
  { id: "agriculture_loan", labelEn: "Agriculture Loan", labelHi: "कृषि ऋण", icon: Sprout },
  { id: "women_entrepreneur_loan", labelEn: "Women Entrepreneur Loan", labelHi: "महिला उद्यमी ऋण", icon: HeartHandshake },
  { id: "msme_loan", labelEn: "MSME Loan", labelHi: "एमएसएमई ऋण", icon: Landmark },
] as const;

export function CompareBankingModal({
  isOpen,
  onClose,
  t,
  lang,
  openBankSafely,
  speakVoice,
}: CompareBankingModalProps) {
  // State for selections & filters
  const [selectedLoanType, setSelectedLoanType] = useState<string>("personal_loan");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCompared, setIsCompared] = useState<boolean>(false);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  
  // Selected Loan entry for the details modal
  const [selectedLoanForModal, setSelectedLoanForModal] = useState<LoanComparisonEntry | null>(null);

  if (!isOpen) return null;

  // Localized string helper
  const l = (obj: Record<string, string>) => obj[lang] || obj["english"] || "";

  // Perform filtering and sorting of loan data
  const comparisonResults = useMemo(() => {
    const rawResults = VERIFIED_LOAN_COMPARISONS.filter((entry) => {
      // 1. Filter by Loan Type
      if (entry.loanType !== selectedLoanType) return false;

      // Find the corresponding bank in the system
      const bank = BANKS.find((b) => b.id === entry.bankId);
      if (!bank) return false;

      // 2. Filter by Bank Category
      if (selectedCategory !== "All") {
        if (bank.category !== selectedCategory) return false;
      }

      // 3. Filter by Search Query (Bank Name)
      if (searchQuery.trim().length > 0) {
        const bankNameText = getBankDisplayName(bank, lang).toLowerCase();
        const searchVal = searchQuery.toLowerCase();
        if (!bankNameText.includes(searchVal)) return false;
      }

      return true;
    });

    // 4. Sort results: lowest interest rate first, unverified rates (0) strictly at the bottom
    return rawResults.sort((a, b) => {
      const aRate = a.interestRate;
      const bRate = b.interestRate;

      const aHasRate = aRate > 0;
      const bHasRate = bRate > 0;

      if (aHasRate && bHasRate) {
        return aRate - bRate; // Ascending order
      }
      if (aHasRate && !bHasRate) {
        return -1; // Numeric rates go first
      }
      if (!aHasRate && bHasRate) {
        return 1; // Unverified rates go after
      }
      return 0; // Both are unverified/0
    });
  }, [selectedLoanType, selectedCategory, searchQuery]);

  const handleCompareClick = () => {
    setIsComparing(true);
    speakVoice("comparingLoans", {
      loanType: LOAN_TYPES.find((t) => t.id === selectedLoanType)?.labelEn || "Loans",
    });

    setTimeout(() => {
      setIsComparing(false);
      setIsCompared(true);
    }, 600);
  };

  const activeLoanTypeLabel =
    LOAN_TYPES.find((t) => t.id === selectedLoanType)?.[lang === "hindi" ? "labelHi" : "labelEn"] || "Loans";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 pb-0 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full sm:max-w-[460px] h-[92vh] sm:h-[85vh] bg-white rounded-t-[32px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden border border-border/15"
        >
          {/* Header */}
          <div className="shrink-0 p-5 pb-3 border-b border-border/40 flex items-center justify-between bg-white relative z-10">
            <div>
              <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-purple-500" />
                {lang === "hindi" ? "बैंकिंग सेवाओं की तुलना" : "Compare Banking Services"}
              </h2>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                {lang === "hindi"
                  ? "ऋण ब्याज दरों और शुल्कों की तुरंत तुलना करें"
                  : "Compare loan interest rates and fees instantly"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-muted/50 hover:bg-muted rounded-full transition-colors active:scale-95"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Interactive Workspace */}
          <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50/30">
            {/* Step 1: Select Loan Type (Horizontal Picker) */}
            <div className="shrink-0 p-4 pb-2 bg-white border-b border-border/30">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                {lang === "hindi" ? "1. ऋण का प्रकार चुनें" : "1. Select Loan Type"}
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x -mx-4 px-4">
                {LOAN_TYPES.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selectedLoanType === type.id;
                  const label = lang === "hindi" ? type.labelHi : type.labelEn;

                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedLoanType(type.id);
                        setIsCompared(false); // Reset comparison to enforce user clicking compare
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap snap-center active:scale-95 transition-all border shrink-0 ${
                        isSelected
                          ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                          : "bg-white border-border/80 text-foreground hover:bg-slate-50"
                      }`}
                    >
                      <IconComponent className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-purple-500"}`} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Set Filters & Search */}
            <div className="shrink-0 p-4 pb-3 bg-white border-b border-border/40 space-y-3">
              {/* Category selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-slate-500" />
                  {lang === "hindi" ? "2. बैंक श्रेणी" : "2. Bank Category"}
                </label>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {["All", "Public Sector", "Private Sector", "Small Finance"].map((cat) => {
                    const isSelected = selectedCategory === cat;
                    const displayLabel =
                      cat === "All"
                        ? lang === "hindi"
                          ? "सभी"
                          : "All Banks"
                        : cat === "Public Sector"
                        ? lang === "hindi"
                          ? "सरकारी"
                          : "Public Sector"
                        : cat === "Private Sector"
                        ? lang === "hindi"
                          ? "निजी"
                          : "Private Sector"
                        : cat === "Small Finance"
                        ? lang === "hindi"
                          ? "स्मॉल फाइनेंस"
                          : "Small Finance"
                        : cat;

                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                          isSelected
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-border/60 text-muted-foreground hover:bg-slate-50"
                        }`}
                      >
                        {displayLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={lang === "hindi" ? "बैंक का नाम खोजें..." : "Search bank by name..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-border/80 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white transition-all placeholder:text-muted-foreground/60 text-foreground"
                />
                {searchQuery.length > 0 && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Action Trigger */}
              <button
                onClick={handleCompareClick}
                disabled={isComparing}
                className="w-full py-3 bg-purple-600 text-white rounded-2xl font-bold text-xs shadow-md shadow-purple-600/10 hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeftRight className={`w-4 h-4 ${isComparing ? "animate-spin" : ""}`} />
                {isComparing
                  ? lang === "hindi"
                    ? "तुलना की जा रही है..."
                    : "Comparing..."
                  : lang === "hindi"
                  ? `${activeLoanTypeLabel} की तुलना करें`
                  : `Compare ${activeLoanTypeLabel}`}
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {isComparing ? (
                // Elegant skeleton loader while comparing
                <div className="space-y-3 pt-4">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="bg-white border border-border/40 p-4 rounded-3xl animate-pulse space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full" />
                        <div className="space-y-1.5 flex-1">
                          <div className="w-24 h-3.5 bg-slate-200 rounded" />
                          <div className="w-16 h-2.5 bg-slate-200 rounded" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        <div className="h-4 bg-slate-100 rounded w-16" />
                        <div className="h-4 bg-slate-100 rounded w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isCompared ? (
                comparisonResults.length > 0 ? (
                  <>
                    {/* Disclaimer Banner at the top of results */}
                    <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-3 flex items-start gap-2 shrink-0">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] font-semibold text-amber-900/80 leading-snug">
                        {lang === "hindi"
                          ? "ब्याज दरें बदल सकती हैं। आवेदन करने से पहले आधिकारिक बैंक वेबसाइट पर नवीनतम दर की पुष्टि अवश्य करें।"
                          : "Interest rates may change. Please verify the latest rate on the official bank website before applying."}
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      {comparisonResults.map((entry, index) => {
                        const bankEntity = BANKS.find((b) => b.id === entry.bankId);
                        if (!bankEntity) return null;

                        const isLowestRate = index === 0 && entry.interestRate > 0;
                        const hasRate = entry.interestRate > 0;

                        return (
                          <motion.div
                            key={entry.bankId + "_" + entry.loanType}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-white border p-4 rounded-3xl shadow-sm relative overflow-hidden transition-all ${
                              isLowestRate
                                ? "border-emerald-300 ring-1 ring-emerald-300/30 bg-emerald-50/5"
                                : "border-border/40 hover:border-border"
                            }`}
                          >
                            {/* Best Rate Badge */}
                            {isLowestRate && (
                              <div className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1 text-[8.5px] font-extrabold rounded-bl-2xl uppercase tracking-wider flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                {lang === "hindi" ? "न्यूनतम दर" : "Lowest Rate"}
                              </div>
                            )}

                            {/* Bank details & logo */}
                            <div className="flex items-center gap-3">
                              <BankLogo bank={bankEntity} size="md" />
                              <div>
                                <h4 className="font-bold text-[14px] text-foreground leading-tight">
                                  {getBankDisplayName(bankEntity, lang)}
                                </h4>
                                <span className="text-[10px] font-bold text-muted-foreground">
                                  {l(entry.loanTypeLabel)}
                                </span>
                              </div>
                            </div>

                            {/* Parameters Grid */}
                            <div className="grid grid-cols-2 gap-3.5 mt-4 pt-3.5 border-t border-slate-100">
                              <div>
                                <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider leading-none">
                                  Interest Rate
                                </p>
                                {hasRate ? (
                                  <p className="text-[13px] font-extrabold text-slate-800 mt-1">
                                    {l(entry.interestRateDisplay)}
                                  </p>
                                ) : (
                                  <span className="inline-block mt-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                    {lang === "hindi" ? "आधिकारिक जांचें" : "Check official website"}
                                  </span>
                                )}
                              </div>

                              <div>
                                <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider leading-none">
                                  Processing Fee
                                </p>
                                <p className="text-[12px] font-bold text-slate-600 mt-1 line-clamp-1 truncate" title={l(entry.processingFee)}>
                                  {l(entry.processingFee)}
                                </p>
                              </div>
                            </div>

                            {/* Actions bar */}
                            <div className="flex items-center justify-between gap-2.5 mt-4 pt-3 border-t border-slate-100/50">
                              <button
                                onClick={() => setSelectedLoanForModal(entry)}
                                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-foreground text-[11.5px] font-bold rounded-2xl active:scale-95 transition-all shrink-0"
                              >
                                <Info className="w-3.5 h-3.5 text-slate-600" />
                                {lang === "hindi" ? "जानकारी" : "Info"}
                              </button>

                              <OfficialLinkButton
                                url={entry.officialWebsite}
                                label={lang === "hindi" ? "आवेदन करें" : "Apply"}
                                className="flex-1 py-2.5 text-[11.5px]"
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  // No results state
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <SlidersHorizontal className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-extrabold text-foreground">
                      {lang === "hindi" ? "कोई मिलान नहीं मिला" : "No banks matching filters"}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground mt-1.5 max-w-[280px]">
                      {lang === "hindi"
                        ? "चयनित ऋण प्रकार या बैंक नाम खोज के लिए कोई प्रविष्टि नहीं मिली। कृपया अपने फ़िल्टर रीसेट करें।"
                        : "No entries found for the selected loan type or bank category. Try adjusting your search query."}
                    </p>
                  </div>
                )
              ) : (
                // Initial prompt state
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                  <div className="w-16 h-16 rounded-[24px] bg-purple-50 flex items-center justify-center mb-4 shadow-inner">
                    <ArrowLeftRight className="w-8 h-8 text-purple-500 animate-pulse" />
                  </div>
                  <h3 className="text-[15px] font-extrabold text-foreground">
                    {lang === "hindi" ? "ऋण विकल्पों की तुलना करें" : "Compare Loan Options"}
                  </h3>
                  <p className="text-[12px] font-semibold text-muted-foreground mt-2 max-w-[280px] leading-relaxed">
                    {lang === "hindi"
                      ? "ऋण प्रकार चुनें, फ़िल्टर जोड़ें और भारत के सर्वश्रेष्ठ बैंकों की ब्याज दरों की तुलना करने के लिए 'तुलना करें' बटन दबाएं।"
                      : "Select a loan type above, refine your bank criteria, and tap 'Compare' to inspect rates side-by-side!"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Security notice footer */}
          <div className="shrink-0 p-4 text-center bg-white border-t border-border/40">
            <p className="text-[11px] font-medium text-muted-foreground/80">
              {t("credentialsNote")}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Details slider modal overlay */}
      <LoanInfoModal
        isOpen={selectedLoanForModal !== null}
        onClose={() => setSelectedLoanForModal(null)}
        entry={selectedLoanForModal}
        lang={lang}
      />
    </AnimatePresence>
  );
}
