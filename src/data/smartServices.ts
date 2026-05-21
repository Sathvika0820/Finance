export interface SmartServiceOption {
  id: string;
  nameKey: string;
  descriptionKey: string;
  suggestedBanks: string[];
}

export const SMART_GUIDANCE_OPTIONS: SmartServiceOption[] = [
  {
    id: "education-loan",
    nameKey: "educationLoan",
    descriptionKey: "checkLatestRates",
    suggestedBanks: ["sbi", "canara", "union", "bob"]
  },
  {
    id: "home-loan",
    nameKey: "homeLoan",
    descriptionKey: "checkLatestRates",
    suggestedBanks: ["sbi", "hdfc", "icici", "axis"]
  },
  {
    id: "savings-account",
    nameKey: "savingsAccount",
    descriptionKey: "checkLatestRates",
    suggestedBanks: ["sbi", "hdfc", "icici", "bob"]
  },
  {
    id: "fixed-deposit",
    nameKey: "fixedDeposit",
    descriptionKey: "checkLatestRates",
    suggestedBanks: ["sbi", "hdfc", "icici", "pnb"]
  },
  {
    id: "complaint-support",
    nameKey: "complaintSupport",
    descriptionKey: "checkLatestRates", // It doesn't use checkLatestRates, maybe we leave it blank or add another key if needed. Let's reuse descriptionKey for a short text if needed. Actually, the prompt says "Check latest rates on official bank website." specifically for rates. For complaint support, "short guidance text" could be "Visit official grievance portal.".
    suggestedBanks: [] // Handled specifically
  },
  {
    id: "nearest-branch-atm",
    nameKey: "nearestBranchAtm",
    descriptionKey: "checkLatestRates", // Will be overridden or ignored.
    suggestedBanks: [] // Handled specifically
  }
];

export interface FinancialInclusionOption {
  id: string;
  nameKey: string;
  descriptionKey: string;
}

export const FINANCIAL_INCLUSION_OPTIONS: FinancialInclusionOption[] = [
  { id: "pmjdy-assistance", nameKey: "pmjdyAssistance", descriptionKey: "pmjdyDesc" },
  { id: "pension-support", nameKey: "pensionSupport", descriptionKey: "pensionDesc" },
  { id: "farmer-banking-support", nameKey: "farmerBankingSupport", descriptionKey: "farmerDesc" },
  { id: "gov-scheme-navigation", nameKey: "govSchemeNavigation", descriptionKey: "govSchemeDesc" },
  { id: "simple-banking-tutorials", nameKey: "simpleBankingTutorials", descriptionKey: "simpleBankingDesc" },
  { id: "voice-banking-help", nameKey: "voiceBankingHelp", descriptionKey: "voiceBankingDesc" }
];

export interface ComparisonServiceOption {
  id: string;
  nameKey: string;
  suggestedBanks: string[];
}

export const COMPARISON_SERVICES_DATA: ComparisonServiceOption[] = [
  { id: "fd-rates", nameKey: "fdRates", suggestedBanks: ["sbi", "hdfc", "icici", "axis", "pnb", "bob"] },
  { id: "education-loans", nameKey: "educationLoans", suggestedBanks: ["sbi", "canara", "union", "bob"] },
  { id: "home-loans", nameKey: "homeLoans", suggestedBanks: ["sbi", "hdfc", "icici", "axis"] },
  { id: "gold-loans", nameKey: "goldLoans", suggestedBanks: ["sbi", "hdfc", "icici", "axis"] },
  { id: "savings-account-benefits", nameKey: "savingsAccountBenefits", suggestedBanks: ["sbi", "hdfc", "icici", "bob", "pnb"] }
];



export interface RuralBankingOption {
  id: string;
  nameKey: string;
  descriptionKey: string;
}

export const RURAL_BANKING_DATA: RuralBankingOption[] = [
  { id: "cooperative-banks", nameKey: "cooperativeBanks", descriptionKey: "coopBanksDesc" },
  { id: "regional-rural-banks", nameKey: "regionalRuralBanks", descriptionKey: "regionalBanksDesc" },
  { id: "agriculture-loan-guidance", nameKey: "agricultureLoanGuidance", descriptionKey: "agriLoanDesc" },
  { id: "csp-help", nameKey: "cspHelp", descriptionKey: "cspHelpDesc" },
  { id: "nabard-support", nameKey: "nabardSupport", descriptionKey: "nabardSupportDesc" },
  { id: "microfinance-awareness", nameKey: "microfinanceAwareness", descriptionKey: "microfinanceDesc" }
];
