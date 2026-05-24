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
