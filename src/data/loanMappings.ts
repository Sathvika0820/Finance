// src/data/loanMappings.ts

const BANK_ALIASES: Record<string, string> = {
  "sbi": "State Bank of India",
  "pnb": "Punjab National Bank",
  "bob": "Bank of Baroda",
  "ippb": "India Post Payments Bank",
  "hdfc": "HDFC Bank",
  "icici": "ICICI Bank",
  "axis": "Axis Bank",
};

const LOAN_TYPE_ALIASES: Record<string, string> = {
  "home": "Home Loan",
  "home_loan": "Home Loan",
  "personal": "Personal Loan",
  "personal_loan": "Personal Loan",
  "education": "Education Loan",
  "education_loan": "Education Loan",
  "vehicle": "Vehicle Loan",
  "vehicle_loan": "Vehicle Loan",
  "business": "Business Loan",
  "business_loan": "Business Loan",
  "gold": "Gold Loan",
  "gold_loan": "Gold Loan",
  "msme": "MSME Loan",
  "msme_loan": "MSME Loan",
  "agriculture": "Agriculture Loan",
  "agriculture_loan": "Agriculture Loan"
};

export function normalizeBankName(bankInput: string): string {
  const normalized = bankInput.trim().toLowerCase();
  return BANK_ALIASES[normalized] || bankInput;
}

export function normalizeLoanTypeName(loanInput: string): string {
  const normalized = loanInput.trim().toLowerCase().replace(/\s+/g, '_');
  return LOAN_TYPE_ALIASES[normalized] || loanInput;
}
