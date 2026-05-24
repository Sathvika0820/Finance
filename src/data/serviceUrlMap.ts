import { getOfficialLink } from "@/data/officialLinks";

const smartUrl = (id: string) => getOfficialLink("smartServices", id) || "";

export const serviceUrlMap: Record<string, Record<string, { label: string; url: string }>> = {
  educationLoan: {
    sbi: {
      label: "SBI Education Loan",
      url: smartUrl("educationLoan:sbi")
    },
    canara: {
      label: "Canara Bank Education Loan",
      url: smartUrl("educationLoan:canara")
    },
    union: {
      label: "Union Bank Education Loan",
      url: smartUrl("educationLoan:union")
    },
    bob: {
      label: "Bank of Baroda Education Loan",
      url: smartUrl("educationLoan:bob")
    }
  },

  homeLoan: {
    sbi: {
      label: "SBI Home Loan",
      url: smartUrl("homeLoan:sbi")
    },
    hdfc: {
      label: "HDFC Bank Home Loan",
      url: smartUrl("homeLoan:hdfc")
    },
    icici: {
      label: "ICICI Bank Home Loan",
      url: smartUrl("homeLoan:icici")
    },
    axis: {
      label: "Axis Bank Home Loan",
      url: smartUrl("homeLoan:axis")
    }
  },

  fixedDeposit: {
    sbi: {
      label: "SBI FD Rates",
      url: smartUrl("fixedDeposit:sbi")
    },
    hdfc: {
      label: "HDFC Bank FD Rates",
      url: smartUrl("fixedDeposit:hdfc")
    },
    icici: {
      label: "ICICI Bank FD Rates",
      url: smartUrl("fixedDeposit:icici")
    },
    axis: {
      label: "Axis Bank FD Rates",
      url: smartUrl("fixedDeposit:axis")
    },
    pnb: {
      label: "PNB FD Rates",
      url: smartUrl("fixedDeposit:pnb")
    },
    bob: {
      label: "Bank of Baroda FD Rates",
      url: smartUrl("fixedDeposit:bob")
    }
  },

  savingsAccount: {
    sbi: {
      label: "SBI Savings Account",
      url: smartUrl("savingsAccount:sbi")
    },
    hdfc: {
      label: "HDFC Bank Savings Account",
      url: smartUrl("savingsAccount:hdfc")
    },
    icici: {
      label: "ICICI Bank Savings Account",
      url: smartUrl("savingsAccount:icici")
    },
    bob: {
      label: "Bank of Baroda Savings Account",
      url: smartUrl("savingsAccount:bob")
    },
    pnb: {
      label: "PNB Savings Account",
      url: smartUrl("savingsAccount:pnb")
    }
  },

  goldLoan: {
    sbi: {
      label: "SBI Gold Loan",
      url: smartUrl("goldLoan:sbi")
    },
    hdfc: {
      label: "HDFC Bank Gold Loan",
      url: smartUrl("goldLoan:hdfc")
    },
    icici: {
      label: "ICICI Bank Gold Loan",
      url: smartUrl("goldLoan:icici")
    },
    axis: {
      label: "Axis Bank Gold Loan",
      url: smartUrl("goldLoan:axis")
    }
  },

  complaintSupport: {
    rbiComplaintPortal: {
      label: "RBI Complaint Portal",
      url: smartUrl("complaintSupport:rbiComplaintPortal")
    },
    rbiSachet: {
      label: "RBI Sachet Portal",
      url: smartUrl("complaintSupport:rbiSachet")
    },
    cyberCrimePortal: {
      label: "National Cyber Crime Portal",
      url: smartUrl("complaintSupport:cyberCrimePortal")
    }
  }
};
