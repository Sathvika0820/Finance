export const serviceUrlMap: Record<string, Record<string, { label: string; url: string }>> = {
  educationLoan: {
    sbi: {
      label: "SBI Education Loan",
      url: "https://sbi.co.in/web/personal-banking/loans/education-loans"
    },
    canara: {
      label: "Canara Bank Education Loan",
      url: "https://canarabank.com/education-loan.aspx"
    },
    union: {
      label: "Union Bank Education Loan",
      url: "https://www.unionbankofindia.co.in/english/personal-education-loan.aspx"
    },
    bob: {
      label: "Bank of Baroda Education Loan",
      url: "https://www.bankofbaroda.in/personal-banking/loans/education-loan"
    }
  },

  homeLoan: {
    sbi: {
      label: "SBI Home Loan",
      url: "https://homeloans.sbi/"
    },
    hdfc: {
      label: "HDFC Bank Home Loan",
      url: "https://www.hdfcbank.com/personal/borrow/popular-loans/home-loan"
    },
    icici: {
      label: "ICICI Bank Home Loan",
      url: "https://www.icicibank.com/personal-banking/loans/home-loan"
    },
    axis: {
      label: "Axis Bank Home Loan",
      url: "https://www.axisbank.com/retail/loans/home-loan"
    }
  },

  fixedDeposit: {
    sbi: {
      label: "SBI FD Rates",
      url: "https://sbi.co.in/web/interest-rates/deposit-rates/retail-domestic-term-deposits"
    },
    hdfc: {
      label: "HDFC Bank FD Rates",
      url: "https://www.hdfcbank.com/personal/save/deposits/fixed-deposit-interest-rate"
    },
    icici: {
      label: "ICICI Bank FD Rates",
      url: "https://www.icicibank.com/personal-banking/deposits/fixed-deposit/fd-interest-rates"
    },
    axis: {
      label: "Axis Bank FD Rates",
      url: "https://www.axisbank.com/interest-rate-on-deposits"
    },
    pnb: {
      label: "PNB FD Rates",
      url: "https://www.pnbindia.in/Interest-Rates-Deposit.html"
    },
    bob: {
      label: "Bank of Baroda FD Rates",
      url: "https://www.bankofbaroda.in/interest-rate-and-service-charges/deposits-interest-rates"
    }
  },

  savingsAccount: {
    sbi: {
      label: "SBI Savings Account",
      url: "https://sbi.co.in/web/personal-banking/accounts/saving-account"
    },
    hdfc: {
      label: "HDFC Bank Savings Account",
      url: "https://www.hdfcbank.com/personal/save/accounts/savings-accounts"
    },
    icici: {
      label: "ICICI Bank Savings Account",
      url: "https://www.icicibank.com/personal-banking/accounts/savings-account"
    },
    bob: {
      label: "Bank of Baroda Savings Account",
      url: "https://www.bankofbaroda.in/personal-banking/accounts/saving-accounts"
    },
    pnb: {
      label: "PNB Savings Account",
      url: "https://www.pnbindia.in/savings-account.html"
    }
  },

  goldLoan: {
    sbi: {
      label: "SBI Gold Loan",
      url: "https://sbi.co.in/web/personal-banking/loans/gold-loan"
    },
    hdfc: {
      label: "HDFC Bank Gold Loan",
      url: "https://www.hdfcbank.com/personal/borrow/popular-loans/gold-loan"
    },
    icici: {
      label: "ICICI Bank Gold Loan",
      url: "https://www.icicibank.com/personal-banking/loans/gold-loan"
    },
    axis: {
      label: "Axis Bank Gold Loan",
      url: "https://www.axisbank.com/retail/loans/gold-loan"
    }
  },

  complaintSupport: {
    rbiComplaintPortal: {
      label: "RBI Complaint Portal",
      url: "https://cms.rbi.org.in/cms/IndexPage.aspx"
    },
    rbiSachet: {
      label: "RBI Sachet Portal",
      url: "https://sachet.rbi.org.in/"
    },
    cyberCrimePortal: {
      label: "National Cyber Crime Portal",
      url: "https://cybercrime.gov.in/"
    }
  }
};
