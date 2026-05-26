import { isVerifiedOfficialUrl } from "./officialLinks";

export type LoanComparisonLoanType =
  | "home_loan"
  | "personal_loan"
  | "education_loan"
  | "vehicle_loan"
  | "gold_loan"
  | "business_loan"
  | "msme_loan"
  | "agriculture_loan";

type LocalizedText = Record<string, string>;
type LocalizedList = Record<string, string[]>;

export interface LoanComparisonItem {
  bankName: string;
  loanType: LoanComparisonLoanType;
  interestRateText: string;
  numericRate: number | null;
  processingFee: string | null;
  officialLoanPage: string | null;
  verified: boolean;
  lastUpdated: string;
}

interface MaintainedLoanComparisonItem extends LoanComparisonItem {
  bankId: string;
  bankCategory: string;
  loanTypeLabel: LocalizedText;
  repaymentPeriod?: string | null;
}

export interface NormalizedLoanComparisonEntry extends LoanComparisonItem {
  bankId: string;
  bankCategory: string;
  loanTypeLabel: LocalizedText;
  officialApplyLink: string | null;
  officialReferenceLink: string | null;
  documentsRequired: string[];
  eligibility: string[];
  howToApply: string[];
  benefits: string[];
  repaymentPeriod: string | null;
  interestRateDisplay: LocalizedText;
  processingFeeByLang: LocalizedText;
  repaymentPeriodByLang: LocalizedText;
  documentsRequiredByLang: LocalizedList;
  eligibilityByLang: LocalizedText;
  howToApplyByLang: LocalizedText;
  benefitsByLang: LocalizedList;
  safetyNote: string;
  safetyNoteByLang: LocalizedText;
}

const CHECK_OFFICIAL_WEBSITE = "Check official website";
const REVIEWED_ON = "2026-05-25";

const LABELS: Record<LoanComparisonLoanType, LocalizedText> = {
  home_loan: { english: "Home Loan", hindi: "Home Loan" },
  personal_loan: { english: "Personal Loan", hindi: "Personal Loan" },
  education_loan: { english: "Education Loan", hindi: "Education Loan" },
  vehicle_loan: { english: "Vehicle Loan", hindi: "Vehicle Loan" },
  gold_loan: { english: "Gold Loan", hindi: "Gold Loan" },
  business_loan: { english: "Business Loan", hindi: "Business Loan" },
  msme_loan: { english: "MSME Loan", hindi: "MSME Loan" },
  agriculture_loan: { english: "Agriculture Loan", hindi: "Agriculture Loan" },
};

function officialItem(
  bankId: string,
  bankName: string,
  bankCategory: string,
  loanType: LoanComparisonLoanType,
  officialLoanPage: string,
  data: {
    interestRateText?: string;
    numericRate?: number;
    processingFee?: string;
    repaymentPeriod?: string;
    lastUpdated?: string;
  } = {},
): MaintainedLoanComparisonItem {
  return {
    bankId,
    bankName,
    bankCategory,
    loanType,
    loanTypeLabel: LABELS[loanType],
    interestRateText: data.interestRateText || CHECK_OFFICIAL_WEBSITE,
    numericRate: data.numericRate ?? null,
    processingFee: data.processingFee || null,
    officialLoanPage,
    verified: isVerifiedOfficialUrl(officialLoanPage),
    lastUpdated: data.lastUpdated || REVIEWED_ON,
    repaymentPeriod: data.repaymentPeriod || null,
  };
}

/*
 * Numeric values below are maintained only when displayed by the linked
 * official bank page. Pages reviewed on 2026-05-25; source-published dates
 * are retained where the bank exposes one.
 */
export const VERIFIED_LOAN_COMPARISONS: MaintainedLoanComparisonItem[] = [
  officialItem(
    "sbi",
    "State Bank of India",
    "Public Sector",
    "home_loan",
    "https://sbi.co.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/home-loans-interest-rates-current",
    {
      lastUpdated: "2025-08-01",
    },
  ),
  officialItem(
    "axis",
    "Axis Bank",
    "Private Sector",
    "home_loan",
    "https://www.axisbank.com/retail/loans/home-loan",
    {
      interestRateText: "8.35% - 9.10% p.a. (CIBIL 751 and above)",
      numericRate: 8.35,
      processingFee: "Up to 1% of loan amount + GST (minimum INR 10,000)",
      repaymentPeriod: "Up to 30 years",
    },
  ),
  officialItem(
    "sbi",
    "State Bank of India",
    "Public Sector",
    "personal_loan",
    "https://sbi.co.in/web/personal-banking/loans/personal-loans/sbi-personal-loan",
    {
      interestRateText: "10.05% - 15.05% p.a.",
      numericRate: 10.05,
      lastUpdated: "2025-08-28",
    },
  ),
  officialItem(
    "sbi",
    "State Bank of India",
    "Public Sector",
    "education_loan",
    "https://sbi.co.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/education-loan-scheme",
    {
      interestRateText: "7.15% p.a. onwards (specified SBI schemes)",
      numericRate: 7.15,
      lastUpdated: "2025-08-20",
    },
  ),
  officialItem(
    "sbi",
    "State Bank of India",
    "Public Sector",
    "vehicle_loan",
    "https://sbi.co.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/auto-loans",
    {
      interestRateText: "8.85% p.a. onwards (SBI Green Car Loan)",
      numericRate: 8.85,
      lastUpdated: REVIEWED_ON,
    },
  ),
  officialItem(
    "sbi",
    "State Bank of India",
    "Public Sector",
    "gold_loan",
    "https://sbi.co.in/web/personal-banking/loans/gold-loan/personal-gold-loans",
    {
      interestRateText: "8.75% p.a. onwards (3-month bullet repayment)",
      numericRate: 8.75,
      lastUpdated: "2025-08-15",
    },
  ),
  officialItem(
    "sbi",
    "State Bank of India",
    "Public Sector",
    "business_loan",
    "https://sbi.co.in/web/business/sme/sme-loans/sme-credit-card",
  ),
  officialItem(
    "sbi",
    "State Bank of India",
    "Public Sector",
    "msme_loan",
    "https://sbi.co.in/web/business/sme/sme-loans/sme-credit-card",
    {
      processingFee: "Unified processing fee: INR 1,000 + GST",
      repaymentPeriod: "Term loan: up to 7 years, subject to product conditions",
      lastUpdated: "2024-02-09",
    },
  ),
  officialItem(
    "sbi",
    "State Bank of India",
    "Public Sector",
    "agriculture_loan",
    "https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card",
    {
      interestRateText:
        "7.00% p.a. up to INR 3 lakh for prompt-payee farmers, subject to interest subvention",
      numericRate: 7,
      processingFee: "Nil for KCC limits up to INR 3 lakh",
      repaymentPeriod: "Crop period and marketing period; product tenure up to 5 years",
      lastUpdated: "2025-04-01",
    },
  ),
];

const LOAN_TYPE_ALIASES: Record<string, LoanComparisonLoanType> = {
  personal: "personal_loan",
  personal_loan: "personal_loan",
  home: "home_loan",
  house: "home_loan",
  housing: "home_loan",
  home_loan: "home_loan",
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
  business_loan: "business_loan",
  agriculture: "agriculture_loan",
  agricultural: "agriculture_loan",
  farmer: "agriculture_loan",
  crop: "agriculture_loan",
  agriculture_loan: "agriculture_loan",
  msme: "msme_loan",
  sme: "msme_loan",
  msme_loan: "msme_loan",
};

function normalizeLoanType(loanType: string): string {
  const normalized = loanType
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_");
  return LOAN_TYPE_ALIASES[normalized] || normalized;
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
  if (/\b(agriculture|agricultural|farmer|crop|kisan)\b/.test(normalizedQuery)) {
    return "agriculture_loan";
  }

  return null;
}

export const LOAN_COMPARISON_DATA: NormalizedLoanComparisonEntry[] = VERIFIED_LOAN_COMPARISONS.map(
  (entry) => {
    const officialLink = entry.verified ? entry.officialLoanPage : null;
    const interestRateText =
      entry.verified && entry.numericRate !== null
        ? entry.interestRateText
        : CHECK_OFFICIAL_WEBSITE;
    const numericRate = entry.verified ? entry.numericRate : null;
    const processingFee = entry.verified ? entry.processingFee : null;
    const repaymentPeriod = entry.verified ? entry.repaymentPeriod || null : null;
    const text = { english: interestRateText };
    const fee = { english: processingFee || CHECK_OFFICIAL_WEBSITE };
    const repayment = { english: repaymentPeriod || CHECK_OFFICIAL_WEBSITE };

    return {
      ...entry,
      interestRateText,
      numericRate,
      processingFee,
      officialLoanPage: officialLink,
      officialApplyLink: officialLink,
      officialReferenceLink: officialLink,
      documentsRequired: [],
      eligibility: [],
      howToApply: ["Review eligibility and apply on the official bank loan page."],
      benefits: [],
      repaymentPeriod,
      interestRateDisplay: text,
      processingFeeByLang: fee,
      repaymentPeriodByLang: repayment,
      documentsRequiredByLang: { english: [] },
      eligibilityByLang: { english: CHECK_OFFICIAL_WEBSITE },
      howToApplyByLang: { english: "Review eligibility and apply on the official bank loan page." },
      benefitsByLang: { english: [] },
      safetyNote:
        "Confirm current rates, fees, eligibility and application terms on the official bank page before applying.",
      safetyNoteByLang: {
        english:
          "Confirm current rates, fees, eligibility and application terms on the official bank page before applying.",
      },
    };
  },
);

export function getSortedLoanComparison(loanType: string): NormalizedLoanComparisonEntry[] {
  const selectedLoanType = normalizeLoanType(loanType);
  const uniqueResults = new Map<string, NormalizedLoanComparisonEntry>();

  LOAN_COMPARISON_DATA.filter((item) => item.loanType === selectedLoanType).forEach((item) =>
    uniqueResults.set(`${item.bankId}:${item.loanType}`, item),
  );

  return Array.from(uniqueResults.values()).sort((a, b) => {
    if (a.numericRate === null && b.numericRate === null) {
      return a.bankName.localeCompare(b.bankName);
    }
    if (a.numericRate === null) return 1;
    if (b.numericRate === null) return -1;
    return a.numericRate - b.numericRate || a.bankName.localeCompare(b.bankName);
  });
}
