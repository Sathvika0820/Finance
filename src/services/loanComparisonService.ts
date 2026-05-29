import { 
  VERIFIED_LOAN_COMPARISONS, 
  LoanComparisonLoanType,
  NormalizedLoanComparisonEntry
} from "@/data/loanData";

const LOAN_TYPE_ALIASES: Record<string, LoanComparisonLoanType> = {
  home: "home_loan",
  house: "home_loan",
  housing: "home_loan",
  home_loan: "home_loan",
  personal: "personal_loan",
  personal_loan: "personal_loan",
  education: "education_loan",
  student: "education_loan",
  study: "education_loan",
  education_loan: "education_loan",
  vehicle: "vehicle_loan",
  car: "vehicle_loan",
  auto: "vehicle_loan",
  bike: "vehicle_loan",
  vehicle_loan: "vehicle_loan",
  gold: "gold_loan",
  jewel: "gold_loan",
  jewellery: "gold_loan",
  jewelry: "gold_loan",
  gold_loan: "gold_loan",
  business: "business_loan",
  enterprise: "business_loan",
  commercial: "business_loan",
  business_loan: "business_loan",
  msme: "msme_loan",
  sme: "msme_loan",
  msme_loan: "msme_loan",
  agriculture: "agriculture_loan",
  agricultural: "agriculture_loan",
  farmer: "agriculture_loan",
  crop: "agriculture_loan",
  kisan: "agriculture_loan",
  agriculture_loan: "agriculture_loan",
};

export function normalizeLoanComparisonType(loanType: string): LoanComparisonLoanType | null {
  const normalized = loanType
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_");
  const matched = LOAN_TYPE_ALIASES[normalized] || normalized;

  if (Object.values(LOAN_TYPE_ALIASES).includes(matched as LoanComparisonLoanType)) {
    return matched as LoanComparisonLoanType;
  }
  return null;
}

export function getLoanComparisonTypeFromQuery(query: string): LoanComparisonLoanType | null {
  const normalizedQuery = query.toLowerCase();
  const requestsComparison =
    /\b(compare|comparison|lowest|least|cheapest|best\s*rate|interest\s*rate|rate\s*of\s*interest|roi)\b/.test(
      normalizedQuery,
    );

  if (!requestsComparison) return null;
  if (/\b(home|housing|house)\b/.test(normalizedQuery)) return "home_loan";
  if (/\b(education|student|study)\b/.test(normalizedQuery)) return "education_loan";
  if (/\b(personal|unsecured)\b/.test(normalizedQuery)) return "personal_loan";
  if (/\b(gold|jewel|jewellery|jewelry)\b/.test(normalizedQuery)) return "gold_loan";
  if (/\b(vehicle|car|auto|two\s*wheeler|bike)\b/.test(normalizedQuery)) return "vehicle_loan";
  if (/\b(msme|sme|micro\s+small|micro,\s*small)\b/.test(normalizedQuery)) return "msme_loan";
  if (/\b(business|enterprise|commercial)\b/.test(normalizedQuery)) return "business_loan";
  if (/\b(agriculture|agricultural|farmer|crop|kisan)\b/.test(normalizedQuery)) return "agriculture_loan";

  return null;
}

/**
 * Client-side fetcher bypassing CORS using AllOrigins proxy to scrape bank sites dynamically.
 */
async function fetchDynamicRate(url: string | null): Promise<number | null> {
  if (!url) return null;
  
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); 
    
    const response = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) return null;
    
    const text = await response.text();
    const rateRegex = /(?:interest rate|rate of interest|starting from|starts at)?.*?([6-9]\.\d{1,2}|1[0-9]\.\d{1,2}|2[0-5]\.\d{1,2})\s*%/gi;
    
    let match;
    let lowestRate = 999;
    
    while ((match = rateRegex.exec(text)) !== null) {
      const rate = parseFloat(match[1]);
      if (!isNaN(rate) && rate > 5 && rate < 25) {
        if (rate < lowestRate) lowestRate = rate;
      }
    }
    
    return lowestRate !== 999 ? lowestRate : null;
  } catch (error) {
    console.error("Scraping failed for:", url);
    return null;
  }
}

/**
 * Dynamically fetches and parses official bank websites for real-time rates.
 */
export async function getSortedLoanComparison(loanType: string): Promise<NormalizedLoanComparisonEntry[]> {
  const normalizedLoanType = normalizeLoanComparisonType(loanType);
  if (!normalizedLoanType) return [];

  const baseItems = VERIFIED_LOAN_COMPARISONS.filter(item => item.loanType === normalizedLoanType);
  
  const dynamicResults = await Promise.all(
    baseItems.map(async (item) => {
      const dynamicRate = await fetchDynamicRate(item.officialLoanPage);
      
      const finalRate = dynamicRate; 
      const CHECK_OFFICIAL = "Check official website";
      const rateText = finalRate !== null ? `${finalRate.toFixed(2)}% p.a.` : CHECK_OFFICIAL;
      
      const text = { english: rateText };
      const fee = { english: item.processingFee || CHECK_OFFICIAL };
      const repayment = { english: item.repaymentPeriod || CHECK_OFFICIAL };
      
      return {
        ...item,
        numericRate: finalRate,
        interestRateText: rateText,
        officialApplyLink: item.officialLoanPage,
        officialReferenceLink: item.officialLoanPage,
        documentsRequired: [],
        eligibility: [],
        howToApply: ["Review eligibility and apply on the official bank loan page."],
        benefits: [],
        repaymentPeriod: item.repaymentPeriod || null,
        interestRateDisplay: text,
        processingFeeByLang: fee,
        repaymentPeriodByLang: repayment,
        documentsRequiredByLang: { english: [] },
        eligibilityByLang: { english: CHECK_OFFICIAL },
        howToApplyByLang: { english: "Review eligibility and apply on the official bank loan page." },
        benefitsByLang: { english: [] },
        safetyNote: "Confirm current rates, fees, eligibility and application terms on the official bank page before applying.",
        safetyNoteByLang: { english: "Confirm current rates, fees, eligibility and application terms on the official bank page before applying." }
      } as NormalizedLoanComparisonEntry;
    })
  );
  
  dynamicResults.sort((a, b) => {
    if (a.numericRate === null && b.numericRate === null) {
      return a.bankName.localeCompare(b.bankName);
    }
    if (a.numericRate === null) return 1;
    if (b.numericRate === null) return -1;
    return a.numericRate - b.numericRate;
  });

  return dynamicResults;
}
