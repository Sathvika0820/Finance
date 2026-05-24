import { getOfficialLink } from "./officialLinks";

export type LoanComparisonLoanType =
  | "personal_loan"
  | "home_loan"
  | "education_loan"
  | "vehicle_loan"
  | "gold_loan"
  | "business_loan"
  | "agriculture_loan"
  | "women_entrepreneur_loan"
  | "msme_loan"
  | "savings_account"
  | "credit_card";

export interface LoanComparisonEntry {
  bankId: string;
  bankName: string;
  loanType: LoanComparisonLoanType;
  loanTypeLabel: Record<string, string>;
  interestRate: number; // Numeric rate for sorting (ascending). Use 0 for unverified/unavailable rates.
  interestRateDisplay: Record<string, string>;
  processingFee: Record<string, string>;
  repaymentPeriod: Record<string, string>;
  officialWebsite: string; // Set to empty string "" for unverified/unavailable official links
  howToApply: Record<string, string>;
  documentsRequired: Record<string, string[]>;
  eligibility: Record<string, string>;
  benefits: Record<string, string[]>;
  safetyNote: Record<string, string>;
}

export interface NormalizedLoanComparisonEntry {
  bankId: string;
  bankCategory: string;
  bankName: string;
  loanType: LoanComparisonLoanType;
  loanTypeLabel: Record<string, string>;
  interestRateText: string;
  numericRate: number | null;
  processingFee: string | null;
  officialApplyLink: string | null;
  officialReferenceLink: string | null;
  verified: boolean;
  documentsRequired: string[];
  eligibility: string[];
  howToApply: string[];
  benefits: string[];
  repaymentPeriod: string | null;
  interestRateDisplay: Record<string, string>;
  processingFeeByLang: Record<string, string>;
  repaymentPeriodByLang: Record<string, string>;
  documentsRequiredByLang: Record<string, string[]>;
  eligibilityByLang: Record<string, string>;
  howToApplyByLang: Record<string, string>;
  benefitsByLang: Record<string, string[]>;
  safetyNote: string;
  safetyNoteByLang: Record<string, string>;
}

export const VERIFIED_LOAN_COMPARISONS: LoanComparisonEntry[] = [
  // ──── PERSONAL LOANS ────
  {
    bankId: "sbi",
    bankName: "State Bank of India",
    loanType: "personal_loan",
    loanTypeLabel: { english: "Personal Loan", hindi: "व्यक्तिगत ऋण" },
    interestRate: 10.30,
    interestRateDisplay: { english: "10.30% - 15.10% p.a.", hindi: "10.30% - 15.10% प्रति वर्ष" },
    processingFee: { english: "1.00% of loan amount + GST (Min ₹1,000, Max ₹10,000)", hindi: "ऋण राशि का 1.00% + जीएसटी (न्यूनतम ₹1,000, अधिकतम ₹10,000)" },
    repaymentPeriod: { english: "12 to 72 months", hindi: "12 से 72 महीने" },
    officialWebsite: "https://sbi.co.in/web/personal-banking/loans/personal-loans",
    howToApply: {
      english: "Apply instantly through the YONO app or visit the nearest SBI branch with your salary statements.",
      hindi: "योनो (YONO) ऐप के माध्यम से तुरंत आवेदन करें या अपने वेतन विवरण के साथ नजदीकी एसबीआई शाखा में जाएं।"
    },
    documentsRequired: {
      english: [
        "Aadhaar Card, PAN Card, or Passport",
        "Last 3 months' salary slips and 2 years' Form 16",
        "Last 6 months' bank statements showing active salary deposits",
        "Employment Identity Card issued by the company"
      ],
      hindi: [
        "आधार कार्ड, पैन कार्ड, या पासपोर्ट",
        "पिछले 3 महीनों की सैलरी स्लिप और 2 साल का फॉर्म 16",
        "सक्रिय वेतन जमा दिखाने वाला पिछले 6 महीनों का बैंक स्टेटमेंट",
        "कंपनी द्वारा जारी रोजगार पहचान पत्र"
      ]
    },
    eligibility: {
      english: "Age: 21 to 58 years. Stable employment with government, public sector, or elite corporates. Minimum monthly salary: ₹25,000.",
      hindi: "आयु: 21 से 58 वर्ष। सरकारी, सार्वजनिक क्षेत्र या विशिष्ट कॉरपोरेट्स के साथ स्थिर रोजगार। न्यूनतम मासिक वेतन: ₹25,000।"
    },
    benefits: {
      english: [
        "Lowest personal loan interest rates among public sector banks.",
        "Completely digital loan processing with no manual intervention.",
        "Zero hidden administration charges."
      ],
      hindi: [
        "सार्वजनिक क्षेत्र के बैंकों में सबसे कम व्यक्तिगत ऋण ब्याज दरें।",
        "बिना किसी मानवीय हस्तक्षेप के पूरी तरह से डिजिटल ऋण प्रसंस्करण (Processing)।",
        "शून्य छिपे हुए प्रशासनिक शुल्क।"
      ]
    },
    safetyNote: {
      english: "Always verify your SBI personal loan account details on the official portal. Never share your NetBanking password with bank agents.",
      hindi: "हमेशा आधिकारिक पोर्टल पर अपने एसबीआई व्यक्तिगत ऋण खाते के विवरण को सत्यापित करें। कभी भी बैंक एजेंटों के साथ अपना नेटबैंकिंग पासवर्ड साझा न करें।"
    }
  },
  {
    bankId: "hdfc",
    bankName: "HDFC Bank",
    loanType: "personal_loan",
    loanTypeLabel: { english: "Personal Loan", hindi: "व्यक्तिगत ऋण" },
    interestRate: 10.50,
    interestRateDisplay: { english: "10.50% - 25.00% p.a.", hindi: "10.50% - 25.00% प्रति वर्ष" },
    processingFee: { english: "Up to 2.50% of the loan amount (Min ₹999, Max ₹25,000) + GST", hindi: "ऋण राशि का 2.50% तक (न्यूनतम ₹999, अधिकतम ₹25,000) + जीएसटी" },
    repaymentPeriod: { english: "12 to 60 months", hindi: "12 से 60 महीने" },
    officialWebsite: "https://www.hdfcbank.com/personal/borrow/loans/personal-loan",
    howToApply: {
      english: "Apply online through NetBanking, the official HDFC portal, or walk into any HDFC loan center with salary slips.",
      hindi: "नेटबैंकिंग, आधिकारिक एचडीएफसी पोर्टल के माध्यम से ऑनलाइन आवेदन करें, या सैलरी स्लिप के साथ किसी भी एचडीएफसी ऋण केंद्र में जाएं।"
    },
    documentsRequired: {
      english: [
        "Identity Proof (Aadhaar Card, PAN Card, or Driving License)",
        "Salary slips for the last 3 months",
        "Bank statements for the last 6 months showing salary credits",
        "Employment proof (Offer letter or company ID card)"
      ],
      hindi: [
        "पहचान प्रमाण (आधार कार्ड, पैन कार्ड, या ड्राइविंग लाइसेंस)",
        "पिछले 3 महीनों की सैलरी स्लिप",
        "सैलरी क्रेडिट दिखाने वाला पिछले 6 महीनों का बैंक स्टेटमेंट",
        "रोजगार का प्रमाण (ऑफर लेटर या कंपनी आईडी कार्ड)"
      ]
    },
    eligibility: {
      english: "Age: 21 to 60 years. Employed with a registered private or government employer. Minimum net monthly salary of ₹25,000.",
      hindi: "आयु: 21 से 60 वर्ष। पंजीकृत निजी या सरकारी नियोक्ता के साथ नियोजित। न्यूनतम शुद्ध मासिक वेतन ₹25,000।"
    },
    benefits: {
      english: [
        "Disbursal of funds in just 10 seconds for pre-approved salary account holders.",
        "No security or collateral required.",
        "Fixed monthly EMI payments for stable budgeting."
      ],
      hindi: [
        "पूर्व-स्वीकृत वेतन खाताधारकों के लिए मात्र 10 सेकंड में धन का वितरण (disbursal)।",
        "किसी सुरक्षा या गारंटी (collateral) की आवश्यकता नहीं है।",
        "स्थिर बजट के लिए निश्चित मासिक ईएमआई भुगतान।"
      ]
    },
    safetyNote: {
      english: "HDFC personal loans have high interest rates. Do not take dynamic personal credits unless you can comfortably service the EMIs.",
      hindi: "एचडीएफसी व्यक्तिगत ऋण पर ब्याज दरें अधिक होती हैं। जब तक आप आसानी से ईएमआई का भुगतान करने में सक्षम न हों, तब तक ऋण न लें।"
    }
  },
  {
    bankId: "icici",
    bankName: "ICICI Bank",
    loanType: "personal_loan",
    loanTypeLabel: { english: "Personal Loan", hindi: "व्यक्तिगत ऋण" },
    interestRate: 10.80,
    interestRateDisplay: { english: "10.80% - 16.25% p.a.", hindi: "10.80% - 16.25% प्रति वर्ष" },
    processingFee: { english: "Up to 2.50% of the loan amount + GST", hindi: "ऋण राशि का 2.50% तक + जीएसटी" },
    repaymentPeriod: { english: "12 to 72 months", hindi: "12 से 72 महीने" },
    officialWebsite: "https://www.icicibank.com/personal-banking/loans/personal-loan",
    howToApply: {
      english: "Apply instantly using the ICICI iMobile Pay app, the official ICICI portal, or walk into any ICICI Bank asset branch.",
      hindi: "आईसीआईसीआई आईमोबाइल पे (iMobile Pay) ऐप, आधिकारिक पोर्टल के माध्यम से तुरंत आवेदन करें, या किसी भी आईसीआईसीआई बैंक शाखा में जाएं।"
    },
    documentsRequired: {
      english: [
        "Identity Proof (Aadhaar, PAN Card, Passport)",
        "Last 3 months' salary slips and Form 16",
        "Last 6 months' bank statements showing active salary deposits"
      ],
      hindi: [
        "पहचान प्रमाण (आधार, पैन कार्ड, पासपोर्ट)",
        "पिछले 3 महीनों की सैलरी स्लिप और फॉर्म 16",
        "सक्रिय वेतन जमा दिखाने वाला पिछले 6 महीनों का बैंक स्टेटमेंट"
      ]
    },
    eligibility: {
      english: "Resident Indian. Age: 21 to 58 years. Minimum monthly income of ₹30,000 (higher limits apply for Tier-1 cities).",
      hindi: "निवासी भारतीय। आयु: 21 से 58 वर्ष। न्यूनतम मासिक आय ₹30,000 (टियर-1 शहरों के लिए उच्च सीमाएं लागू)।"
    },
    benefits: {
      english: [
        "Instant credit in your ICICI savings account within 3 seconds for select customers.",
        "Repayment periods stretching up to 6 full years.",
        "Completely digital online processing."
      ],
      hindi: [
        "चुनिंदा ग्राहकों के लिए 3 सेकंड के भीतर आईसीआईसीआई बचत खाते में तुरंत ऋण जमा।",
        "पुनर्भुगतान की अवधि 6 पूर्ण वर्षों तक बढ़ सकती है।",
        "पूरी तरह से डिजिटल ऑनलाइन प्रसंस्करण (Online processing)।"
      ]
    },
    safetyNote: {
      english: "Never share your ICICI corporate banking passwords or OTP with anyone claiming to help you secure a fast personal loan.",
      hindi: "त्वरित व्यक्तिगत ऋण दिलाने का दावा करने वाले किसी भी व्यक्ति के साथ कभी भी अपने आईसीआईसीआई पासवर्ड या ओटीपी साझा न करें।"
    }
  },

  // ──── HOME LOANS ────
  {
    bankId: "bob",
    bankName: "Bank of Baroda",
    loanType: "home_loan",
    loanTypeLabel: { english: "Home Loan", hindi: "गृह ऋण" },
    interestRate: 8.40,
    interestRateDisplay: { english: "8.40% - 10.60% p.a.", hindi: "8.40% - 10.60% प्रति वर्ष" },
    processingFee: { english: "0.25% to 0.50% (Min ₹8,500, Max ₹25,000)", hindi: "0.25% से 0.50% (न्यूनतम ₹8,500, अधिकतम ₹25,000)" },
    repaymentPeriod: { english: "Up to 30 years", hindi: "30 वर्ष तक" },
    officialWebsite: "https://www.bankofbaroda.in/personal-banking/loans/home-loan",
    howToApply: {
      english: "Apply online on the Bank of Baroda retail portal or visit the nearest Baroda branch with your property and income documents.",
      hindi: "बैंक ऑफ बड़ौदा रिटेल पोर्टल पर ऑनलाइन आवेदन करें या अपने संपत्ति और आय के दस्तावेजों के साथ नजदीकी बड़ौदा शाखा में जाएं।"
    },
    documentsRequired: {
      english: [
        "PAN Card, Aadhaar Card, or Passport",
        "Last 3 months' salary slips and 2 years' Form 16 (for salaried)",
        "Last 2 years' IT returns and audited balance sheet (for self-employed)",
        "Allotment letter, sale deed, and approved builder construction plans"
      ],
      hindi: [
        "पैन कार्ड, आधार कार्ड, या पासपोर्ट",
        "पिछले 3 महीनों की सैलरी स्लिप और 2 साल का फॉर्म 16 (वेतनभोगी के लिए)",
        "पिछले 2 साल का आईटीआर और ऑडिटेड बैलेंस शीट (स्व-नियोजित के लिए)",
        "आवंटन पत्र (अलॉटमेंट लेटर), सेल डीड, और स्वीकृत बिल्डर निर्माण योजनाएं"
      ]
    },
    eligibility: {
      english: "Age: 21 to 70 years. Stable employment/business income. Minimum credit score of 700 is preferred.",
      hindi: "आयु: 21 से 70 वर्ष। स्थिर रोजगार/व्यवसाय आय। 700 या अधिक का क्रेडिट स्कोर होना आवश्यक है।"
    },
    benefits: {
      english: [
        "Lowest home loan interest rates in the public sector.",
        "Free accident insurance coverage for the primary borrower.",
        "Zero prepayment charges on floating-rate home loans."
      ],
      hindi: [
        "सार्वजनिक क्षेत्र में सबसे कम गृह ऋण ब्याज दरें।",
        "प्राथमिक उधारकर्ता के लिए मुफ्त दुर्घटना बीमा कवरेज।",
        "फ्लोटिंग-रेट होम लोन पर शून्य प्रीपेमेंट शुल्क।"
      ]
    },
    safetyNote: {
      english: "Always pay your EMIs on time. Defaulting on a home loan can lead to the bank seizing the mortgaged property.",
      hindi: "हमेशा अपनी ईएमआई (EMI) समय पर चुकाएं। गृह ऋण में चूक करने पर बैंक गिरवी रखी गई संपत्ति को जब्त कर सकता है।"
    }
  },
  {
    bankId: "sbi",
    bankName: "State Bank of India",
    loanType: "home_loan",
    loanTypeLabel: { english: "Home Loan", hindi: "गृह ऋण" },
    interestRate: 8.50,
    interestRateDisplay: { english: "8.50% - 9.65% p.a.", hindi: "8.50% - 9.65% प्रति वर्ष" },
    processingFee: { english: "0.35% of loan amount (Min ₹2,000, Max ₹10,000) + GST", hindi: "ऋण राशि का 0.35% (न्यूनतम ₹2,000, अधिकतम ₹10,000) + जीएसटी" },
    repaymentPeriod: { english: "Up to 30 years", hindi: "30 वर्ष तक" },
    officialWebsite: "https://sbi.co.in/web/personal-banking/loans/home-loans",
    howToApply: {
      english: "Apply instantly through the YONO app, official SBI portal, or visit any SBI branch or specialized home loan hub.",
      hindi: "योनो (YONO) ऐप, आधिकारिक एसबीआई पोर्टल के माध्यम से तुरंत आवेदन करें, या किसी भी एसबीआई शाखा या होम लोन हब पर जाएं।"
    },
    documentsRequired: {
      english: [
        "Completed application form with 3 passport-sized photographs",
        "Aadhaar Card, PAN Card, and utility bills for address verification",
        "Salaried: Form 16, last 3 months' salary slips, and last 6 months' bank statements",
        "Self-employed: Business address proof, ITR for last 2 years, Balance Sheet",
        "Property tax receipts, approved construction map, and mother deed"
      ],
      hindi: [
        "3 पासपोर्ट आकार के फोटो के साथ भरा हुआ आवेदन पत्र",
        "सत्यापन के लिए आधार कार्ड, पैन कार्ड और उपयोगिता बिल",
        "वेतनभोगी: फॉर्म 16, पिछले 3 महीनों की सैलरी स्लिप और 6 महीनों का बैंक स्टेटमेंट",
        "स्व-नियोजित: व्यावसायिक पते का प्रमाण, पिछले 2 वर्षों का आईटीआर, बैलेंस शीट",
        "संपत्ति कर रसीदें, स्वीकृत निर्माण मानचित्र, और मदर डीड"
      ]
    },
    eligibility: {
      english: "Resident Indian or NRI. Age: 18 to 75 years. Steady monthly income from salary or business.",
      hindi: "निवासी भारतीय या एनआरआई। आयु: 18 से 75 वर्ष। वेतन या व्यवसाय से स्थिर मासिक आय।"
    },
    benefits: {
      english: [
        "Highly transparent charges with zero hidden fees.",
        "Special interest concessions for women borrowers (0.05% concession).",
        "Daily reducing balance interest calculations."
      ],
      hindi: [
        "शून्य छिपे हुए शुल्कों के साथ अत्यधिक पारदर्शी प्रक्रिया।",
        "महिला उधारकर्ताओं के लिए विशेष ब्याज रियायत (0.05% रियायत)।",
        "दैनिक घटती शेष राशि पर ब्याज की गणना।"
      ]
    },
    safetyNote: {
      english: "Verify your loan account balance regularly on official YONO SBI portal. Never share YONO login PIN with anyone.",
      hindi: "आधिकारिक योनो एसबीआई पोर्टल पर नियमित रूप से अपने ऋण खाते की शेष राशि की जांच करें। कभी भी अपना योनो पिन साझा न करें।"
    }
  },
  {
    bankId: "hdfc",
    bankName: "HDFC Bank",
    loanType: "home_loan",
    loanTypeLabel: { english: "Home Loan", hindi: "गृह ऋण" },
    interestRate: 8.75,
    interestRateDisplay: { english: "8.75% onwards p.a.", hindi: "8.75% प्रति वर्ष से शुरू" },
    processingFee: { english: "Up to 0.50% of the loan amount or ₹3,000 (whichever is higher)", hindi: "ऋण राशि का 0.50% तक या ₹3,000 (जो भी अधिक हो)" },
    repaymentPeriod: { english: "Up to 30 years", hindi: "30 वर्ष तक" },
    officialWebsite: "https://www.hdfcbank.com/personal/borrow/loans/home-loan",
    howToApply: {
      english: "Apply online via the HDFC Bank portal, HDFC home loan portal, or visit the nearest HDFC branch or sales office.",
      hindi: "एचडीएफसी बैंक पोर्टल, एचडीएफसी होम लोन पोर्टल के माध्यम से ऑनलाइन आवेदन करें, या नजदीकी शाखा या बिक्री कार्यालय पर जाएं।"
    },
    documentsRequired: {
      english: [
        "Proof of Identity & Residence (Aadhaar, Passport, Driving License)",
        "Salaried: Salary slips for last 3 months, Form 16, bank statements for 6 months showing salary credits",
        "Self-employed: ITR with income computation for last 2 years, CA-audited financials",
        "Property papers: Occupancy certificate, approved map, copy of builder agreement"
      ],
      hindi: [
        "पहचान और निवास का प्रमाण (आधार, पासपोर्ट, ड्राइविंग लाइसेंस)",
        "वेतनभोगी: पिछले 3 महीनों की सैलरी स्लिप, फॉर्म 16, सैलरी क्रेडिट दिखाने वाला 6 महीने का बैंक स्टेटमेंट",
        "स्व-नियोजित: पिछले 2 वर्षों की आय गणना के साथ आईटीआर, सीए द्वारा ऑडिटेड वित्तीय रिपोर्ट",
        "संपत्ति के कागजात: ऑक्यूपेंसी सर्टिफिकेट, स्वीकृत नक्शा, बिल्डर समझौते की प्रति"
      ]
    },
    eligibility: {
      english: "Age: 21 to 65 years. Salaried professionals or self-employed individuals with active income history.",
      hindi: "आयु: 21 से 65 वर्ष। सक्रिय आय इतिहास वाले वेतनभोगी पेशेवर या स्व-नियोजित व्यक्ति।"
    },
    benefits: {
      english: [
        "Quick online approval with minimal documentation requirements.",
        "Customized home loan schemes like HDFC Reach for micro-entrepreneurs.",
        "Flexible repayment options tailored to your professional career path."
      ],
      hindi: [
        "न्यूनतम दस्तावेजों के साथ त्वरित ऑनलाइन स्वीकृति।",
        "सूक्ष्म उद्यमियों के लिए विशेष कस्टमाइज्ड होम लोन योजनाएं (जैसे एचडीएफसी रीच)।",
        "आपके पेशेवर करियर के अनुसार लचीले पुनर्भुगतान के विकल्प।"
      ]
    },
    safetyNote: {
      english: "Make sure you receive an official Sanction Letter from HDFC Bank. Do not pay processing fees in cash to third-party agents.",
      hindi: "सुनिश्चित करें कि आपको एचडीएफसी बैंक से एक आधिकारिक स्वीकृति पत्र (Sanction Letter) प्राप्त हो। किसी भी तीसरे पक्ष के एजेंट को नकद में शुल्क न दें।"
    }
  },

  // ──── EDUCATION LOANS ────
  {
    bankId: "bob",
    bankName: "Bank of Baroda",
    loanType: "education_loan",
    loanTypeLabel: { english: "Education Loan", hindi: "शिक्षा ऋण" },
    interestRate: 8.55,
    interestRateDisplay: { english: "8.55% onwards p.a.", hindi: "8.55% प्रति वर्ष से शुरू" },
    processingFee: { english: "Nil for studies in India. 1% (refundable) for studies abroad.", hindi: "भारत में अध्ययन के लिए शून्य। विदेशों में अध्ययन के लिए 1% (वापसी योग्य)।" },
    repaymentPeriod: { english: "Up to 15 years (including moratorium)", hindi: "15 वर्ष तक (मोरेटोरियम सहित)" },
    officialWebsite: "https://www.bankofbaroda.in/personal-banking/loans/education-loan",
    howToApply: {
      english: "Apply on the Vidya Lakshmi Portal (www.vidyalakshmi.co.in) and select Bank of Baroda, or apply directly on the Baroda portal.",
      hindi: "विद्या लक्ष्मी पोर्टल (www.vidyalakshmi.co.in) पर आवेदन करें और बैंक ऑफ बड़ौदा का चयन करें, या सीधे बड़ौदा पोर्टल पर आवेदन करें।"
    },
    documentsRequired: {
      english: [
        "Admission Letter from the recognized institution",
        "Fee structure break-up certified by the college/university",
        "10th, 12th, and graduation mark sheets",
        "Co-applicant PAN, Aadhaar, last 6 months' bank statements, and 2 years' ITR"
      ],
      hindi: [
        "प्रवेश पत्र (Admission Letter)",
        "कॉलेज/विश्वविद्यालय द्वारा प्रमाणित शुल्क संरचना (Fee structure)",
        "10वीं, 12वीं और स्नातक की मार्कशीट",
        "सह-आवेदक का पैन, आधार, पिछले 6 महीनों का बैंक स्टेटमेंट, और 2 साल का आईटीआर"
      ]
    },
    eligibility: {
      english: "Indian citizen. Secured admission in a professional course in India or abroad via entrance exam or merit selection.",
      hindi: "भारतीय नागरिक। प्रवेश परीक्षा या योग्यता के आधार पर भारत या विदेश में व्यावसायिक पाठ्यक्रम में प्रवेश प्राप्त किया हो।"
    },
    benefits: {
      english: [
        "Low interest rates with attractive concessions for female students (0.50% concession).",
        "Collateral-free loans up to ₹7.5 Lakhs.",
        "Moratorium period of Course Duration + 1 Year."
      ],
      hindi: [
        "महिला छात्रों के लिए आकर्षक रियायतों (0.50% रियायत) के साथ कम ब्याज दरें।",
        "₹7.5 लाख तक के ऋण बिना किसी गारंटी (collateral-free) के उपलब्ध।",
        "पाठ्यक्रम की अवधि + 1 वर्ष की मोरेटोरियम अवधि (ऋण चुकाने से छूट)।"
      ]
    },
    safetyNote: {
      english: "Ensure your course is approved under government guidelines so that you remain eligible for the Central Sector Interest Subsidy Scheme (CSIS).",
      hindi: "सुनिश्चित करें कि आपका पाठ्यक्रम सरकारी दिशानिर्देशों के तहत अनुमोदित है ताकि आप केंद्रीय क्षेत्र ब्याज सब्सिडी योजना (CSIS) के पात्र रहें।"
    }
  },
  {
    bankId: "canara",
    bankName: "Canara Bank",
    loanType: "education_loan",
    loanTypeLabel: { english: "Education Loan", hindi: "शिक्षा ऋण" },
    interestRate: 8.60,
    interestRateDisplay: { english: "8.60% onwards p.a.", hindi: "8.60% प्रति वर्ष से शुरू" },
    processingFee: { english: "Nil for studies in India. Up to ₹5,000 for studies abroad.", hindi: "भारत में अध्ययन के लिए शून्य। विदेशों में अध्ययन के लिए ₹5,000 तक।" },
    repaymentPeriod: { english: "Up to 15 years", hindi: "15 वर्ष तक" },
    officialWebsite: "https://canarabank.com/personal-banking/loans/education-loan",
    howToApply: {
      english: "Apply through Vidya Lakshmi scheme website or walk into any Canara Bank branch with your parent/guardian as co-borrower.",
      hindi: "विद्या लक्ष्मी योजना वेबसाइट के माध्यम से आवेदन करें या अपने माता-पिता/अभिभावक को सह-उधारकर्ता के रूप में लेकर किसी भी केनरा बैंक शाखा में जाएं।"
    },
    documentsRequired: {
      english: [
        "Mark sheets of last qualifying exam (10th/12th/Graduation)",
        "Proof of admission (Admission letter, ID card, or fee bill)",
        "Schedule of expenses of the course",
        "PAN Card and Aadhaar Card of both student and parent"
      ],
      hindi: [
        "अंतिम योग्यता परीक्षा की मार्कशीट (10वीं/12वीं/स्नातक)",
        "प्रवेश का प्रमाण (प्रवेश पत्र, आईडी कार्ड, या शुल्क रसीद)",
        "पाठ्यक्रम के खर्चों का विवरण (Schedule of expenses)",
        "छात्र और माता-पिता दोनों का पैन कार्ड और आधार कार्ड"
      ]
    },
    eligibility: {
      english: "Indian National. Secured admission in a recognized university or professional course.",
      hindi: "भारतीय नागरिक। एक मान्यता प्राप्त विश्वविद्यालय या व्यावसायिक पाठ्यक्रम में प्रवेश सुरक्षित किया हो।"
    },
    benefits: {
      english: [
        "Covers up to 100% of study expenses including laptop and travel tickets.",
        "Concessions for prompt interest payment during the moratorium period.",
        "Collateral-free loans under CGFSEL scheme up to ₹7.5 Lakhs."
      ],
      hindi: [
        "लैपटॉप और यात्रा टिकट सहित पढ़ाई के 100% खर्चों को कवर करता है।",
        "मोरेटोरियम अवधि के दौरान समय पर ब्याज भुगतान के लिए विशेष रियायतें।",
        "CGFSEL योजना के तहत ₹7.5 लाख तक के बिना गारंटी के ऋण।"
      ]
    },
    safetyNote: {
      english: "Do not fall for third-party agents claiming to guarantee Canara education loans. Apply strictly through Vidya Lakshmi.",
      hindi: "केनरा शिक्षा ऋण की गारंटी देने का दावा करने वाले तीसरे पक्ष के एजेंटों के झांसे में न आएं। केवल विद्या लक्ष्मी के माध्यम से आवेदन करें।"
    }
  },

  // ──── VEHICLE LOANS ────
  {
    bankId: "sbi",
    bankName: "State Bank of India",
    loanType: "vehicle_loan",
    loanTypeLabel: { english: "Vehicle Loan", hindi: "वाहन ऋण" },
    interestRate: 8.75,
    interestRateDisplay: { english: "8.75% - 9.45% p.a.", hindi: "8.75% - 9.45% प्रति वर्ष" },
    processingFee: { english: "0.50% of loan amount (Min ₹1,000, Max ₹10,000) + GST", hindi: "ऋण राशि का 0.50% (न्यूनतम ₹1,000, अधिकतम ₹10,000) + जीएसटी" },
    repaymentPeriod: { english: "Up to 7 years", hindi: "7 वर्ष तक" },
    officialWebsite: "https://sbi.co.in/web/personal-banking/loans/auto-loans",
    howToApply: {
      english: "Apply through SBI YONO app, official SBI car loan portal, or visit any nearest SBI branch.",
      hindi: "एसबीआई योनो ऐप, आधिकारिक कार लोन पोर्टल के माध्यम से आवेदन करें, या नजदीकी शाखा में जाएं।"
    },
    documentsRequired: {
      english: [
        "Identity Proof & Address Proof (Aadhaar, PAN, Passport)",
        "Last 3 months' salary slips or 2 years' ITR/Form 16",
        "Last 6 months' bank account statement",
        "Vehicle proforma invoice from authorized dealer"
      ],
      hindi: [
        "पहचान और निवास का प्रमाण (आधार, पैन, पासपोर्ट)",
        "पिछले 3 महीनों की सैलरी स्लिप या 2 साल का आईटीआर/फॉर्म 16",
        "पिछले 6 महीनों का बैंक स्टेटमेंट",
        "अधिकृत डीलर से वाहन का प्रोफार्मा चालान (Proforma invoice)"
      ]
    },
    eligibility: {
      english: "Age: 21 to 67 years. Salaried or self-employed individuals with minimum annual income of ₹3 Lakhs.",
      hindi: "आयु: 21 से 67 वर्ष। वेतनभोगी या स्व-नियोजित व्यक्ति जिनकी न्यूनतम वार्षिक आय ₹3 लाख हो।"
    },
    benefits: {
      english: [
        "Financing up to 90% of the on-road price of the vehicle.",
        "Daily reducing balance interest calculations.",
        "Zero prepayment charges on closing the loan early."
      ],
      hindi: [
        "वाहन की ऑन-रोड कीमत के 90% तक का वित्तपोषण (Financing)।",
        "दैनिक घटती शेष राशि पर ब्याज की गणना।",
        "ऋण समय से पहले बंद करने पर शून्य प्रीपेमेंट शुल्क।"
      ]
    },
    safetyNote: {
      english: "Make sure you receive the official hypothecation letter once the loan is fully repaid, and register it with the RTO.",
      hindi: "ऋण पूरी तरह चुकाने के बाद आधिकारिक हाइपोथेकेशन पत्र प्राप्त करना सुनिश्चित करें और इसे आरटीओ (RTO) में दर्ज कराएं।"
    }
  },
  {
    bankId: "bob",
    bankName: "Bank of Baroda",
    loanType: "vehicle_loan",
    loanTypeLabel: { english: "Vehicle Loan", hindi: "वाहन ऋण" },
    interestRate: 8.85,
    interestRateDisplay: { english: "8.85% - 11.20% p.a.", hindi: "8.85% - 11.20% प्रति वर्ष" },
    processingFee: { english: "Nil processing fees currently (Promotional Offer) + GST", hindi: "वर्तमान में शून्य प्रोसेसिंग शुल्क (प्रमोशनल ऑफर) + जीएसटी" },
    repaymentPeriod: { english: "Up to 84 months", hindi: "84 महीने तक" },
    officialWebsite: "https://www.bankofbaroda.in/personal-banking/loans/car-loan",
    howToApply: {
      english: "Apply online on the Baroda digital car loan portal or submit your invoice at the nearest Baroda branch.",
      hindi: "बड़ौदा डिजिटल कार लोन पोर्टल पर ऑनलाइन आवेदन करें या नजदीकी बड़ौदा शाखा में अपना इनवॉइस जमा करें।"
    },
    documentsRequired: {
      english: [
        "PAN Card, Aadhaar Card, or Voter ID",
        "Income Statements: Salary slips or audited balance sheet",
        "Proforma invoice of the vehicle, RC copy (for used cars)"
      ],
      hindi: [
        "पैन कार्ड, आधार कार्ड, या मतदाता पहचान पत्र",
        "आय विवरण: वेतन पर्ची (Salary slips) या ऑडिटेड बैलेंस शीट",
        "वाहन का प्रोफार्मा चालान, आरसी कॉपी (पुरानी कारों के लिए)"
      ]
    },
    eligibility: {
      english: "Age: 21 to 70 years. Resident Indian, salaried, self-employed, or agriculturalists.",
      hindi: "आयु: 21 से 70 वर्ष। निवासी भारतीय, वेतनभोगी, स्व-नियोजित, या कृषक (Farmers)।"
    },
    benefits: {
      english: [
        "Attractive financing options for electric vehicles with lower interest rates.",
        "High loan amount eligibility based on income.",
        "Quick approval within 24 hours digitally."
      ],
      hindi: [
        "कम ब्याज दरों के साथ इलेक्ट्रिक वाहनों (EV) के लिए आकर्षक वित्तपोषण विकल्प।",
        "आय के आधार पर उच्च ऋण राशि की पात्रता।",
        "डिजिटल रूप से 24 घंटे के भीतर त्वरित स्वीकृति।"
      ]
    },
    safetyNote: {
      english: "Verify dealer bank accounts directly before disbursing the car loan amount. Do not transfer funds to agents.",
      hindi: "कार ऋण राशि वितरित करने से पहले सीधे डीलर के बैंक खातों की पुष्टि करें। एजेंटों को धन हस्तांतरित न करें।"
    }
  },
  {
    bankId: "hdfc",
    bankName: "HDFC Bank",
    loanType: "vehicle_loan",
    loanTypeLabel: { english: "Vehicle Loan", hindi: "वाहन ऋण" },
    interestRate: 9.10,
    interestRateDisplay: { english: "9.10% onwards p.a.", hindi: "9.10% प्रति वर्ष से शुरू" },
    processingFee: { english: "0.50% of the loan amount or ₹3,500 + GST", hindi: "ऋण राशि का 0.50% या ₹3,500 + जीएसटी" },
    repaymentPeriod: { english: "12 to 84 months", hindi: "12 से 84 महीने" },
    officialWebsite: "https://www.hdfcbank.com/personal/borrow/loans/car-loan",
    howToApply: {
      english: "Apply instantly via HDFC NetBanking (ZipDrive) or visit HDFC bank retail asset center.",
      hindi: "एचडीएफसी नेटबैंकिंग (ZipDrive) के माध्यम से तुरंत आवेदन करें या एचडीएफसी बैंक रिटेल एसेट सेंटर पर जाएं।"
    },
    documentsRequired: {
      english: [
        "Aadhaar, Passport, PAN Card",
        "Form 16 or latest 2 years' ITR",
        "Vehicle proforma invoice and dealership bank details"
      ],
      hindi: [
        "आधार, पासपोर्ट, पैन कार्ड",
        "फॉर्म 16 या नवीनतम 2 वर्षों का आईटीआर",
        "वाहन का प्रोफार्मा चालान और डीलरशिप बैंक विवरण"
      ]
    },
    eligibility: {
      english: "Resident Indian. Age: 21 to 60 years. Minimum annual income: ₹3 Lakhs.",
      hindi: "निवासी भारतीय। आयु: 21 से 60 वर्ष। न्यूनतम वार्षिक आय: ₹3 लाख।"
    },
    benefits: {
      english: [
        "100% on-road financing available on select vehicle models.",
        "ZipDrive instant car loans for existing creditworthy salary account holders.",
        "Flexible EMI options including Step-up repayment."
      ],
      hindi: [
        "चुनिंदा वाहन मॉडलों पर 100% ऑन-रोड वित्तपोषण उपलब्ध।",
        "विद्यमान साख वाले वेतन खाताधारकों के लिए ज़िपड्राइव (ZipDrive) तत्काल कार लोन।",
        "स्टेप-अप पुनर्भुगतान सहित लचीले ईएमआई विकल्प।"
      ]
    },
    safetyNote: {
      english: "Never pay additional 'processing commission' to showroom brokers. HDFC processes fees directly.",
      hindi: "शोरूम दलालों को अतिरिक्त 'प्रोसेसिंग कमीशन' का भुगतान कभी न करें। एचडीएफसी सीधे शुल्क संसाधित करता है।"
    }
  },

  // ──── GOLD LOANS ────
  {
    bankId: "sbi",
    bankName: "State Bank of India",
    loanType: "gold_loan",
    loanTypeLabel: { english: "Gold Loan", hindi: "स्वर्ण ऋण" },
    interestRate: 8.70,
    interestRateDisplay: { english: "8.70% onwards p.a.", hindi: "8.70% प्रति वर्ष से शुरू" },
    processingFee: { english: "0.25% of loan amount (Min ₹250, Max ₹2,500) + valuation charges", hindi: "ऋण राशि का 0.25% (न्यूनतम ₹250, अधिकतम ₹2,500) + मूल्यांकन शुल्क" },
    repaymentPeriod: { english: "Up to 36 months", hindi: "36 महीने तक" },
    officialWebsite: "https://sbi.co.in/web/personal-banking/loans/gold-loan",
    howToApply: {
      english: "Walk into any SBI branch with your gold ornaments, Aadhaar card, and two photos. The bank will evaluate the gold on the spot.",
      hindi: "अपने सोने के गहने, आधार कार्ड और दो फोटो के साथ किसी भी एसबीआई शाखा में जाएं। बैंक मौके पर ही सोने का मूल्यांकन करेगा।"
    },
    documentsRequired: {
      english: [
        "Aadhaar Card, PAN Card, or Voter ID Card",
        "Gold Loan Application Form",
        "Gold appraiser's certificate (issued directly inside bank branch)"
      ],
      hindi: [
        "आधार कार्ड, पैन कार्ड, या मतदाता पहचान पत्र",
        "स्वर्ण ऋण आवेदन पत्र (Gold Loan Application Form)",
        "स्वर्ण मूल्यांकनकर्ता का प्रमाण पत्र (बैंक शाखा के भीतर सीधे जारी किया जाता है)"
      ]
    },
    eligibility: {
      english: "Resident Indian, aged 18 years and above. Must possess gold ornaments of 18 to 22 carat purity.",
      hindi: "निवासी भारतीय, आयु 18 वर्ष और उससे अधिक। 18 से 22 कैरेट शुद्धता के सोने के आभूषण होने चाहिए।"
    },
    benefits: {
      english: [
        "Extremely low interest rate compared to private gold loan firms.",
        "Bullet repayment option available (pay principal and interest at the end of the year).",
        "No income proof required for loans up to ₹2 Lakhs."
      ],
      hindi: [
        "निजी स्वर्ण ऋण कंपनियों की तुलना में अत्यधिक कम ब्याज दर।",
        "बुलेट पुनर्भुगतान (Bullet repayment) विकल्प उपलब्ध (वर्ष के अंत में मूलधन और ब्याज का भुगतान करें)।",
        "₹2 लाख तक के ऋण के लिए कोई आय प्रमाण आवश्यक नहीं है।"
      ]
    },
    safetyNote: {
      english: "Gold ornaments will be locked in secure bank vaults. If the loan is not paid, the bank has the right to auction your gold ornaments.",
      hindi: "सोने के आभूषण सुरक्षित बैंक वाल्टों में बंद रहेंगे। यदि ऋण का भुगतान नहीं किया जाता है, तो बैंक को आपके सोने के गहनों की नीलामी करने का अधिकार है।"
    }
  },
  {
    bankId: "bob",
    bankName: "Bank of Baroda",
    loanType: "gold_loan",
    loanTypeLabel: { english: "Gold Loan", hindi: "स्वर्ण ऋण" },
    interestRate: 8.80,
    interestRateDisplay: { english: "8.80% onwards p.a.", hindi: "8.80% प्रति वर्ष से शुरू" },
    processingFee: { english: "Nil up to ₹3 Lakhs. ₹500 + GST above ₹3 Lakhs.", hindi: "₹3 लाख तक शून्य। ₹3 लाख से ऊपर ₹500 + जीएसटी।" },
    repaymentPeriod: { english: "Up to 12 months", hindi: "12 महीने तक" },
    officialWebsite: "https://www.bankofbaroda.in/personal-banking/loans/gold-loan",
    howToApply: {
      english: "Visit the nearest Bank of Baroda branch with your gold jewelry. Spot valuation and sanction are done within 30-45 minutes.",
      hindi: "अपने सोने के गहनों के साथ नजदीकी बैंक ऑफ बड़ौदा शाखा में जाएं। 30-45 मिनट के भीतर मौके पर मूल्यांकन और स्वीकृति की जाती है।"
    },
    documentsRequired: {
      english: [
        "Aadhaar Card, PAN Card, or Passport",
        "2 passport sized photographs",
        "Utility bill for address verification (if different from Aadhaar)"
      ],
      hindi: [
        "आधार कार्ड, पैन कार्ड, या पासपोर्ट",
        "2 पासपोर्ट आकार के फोटो",
        "पते के सत्यापन के लिए उपयोगिता बिल (यदि आधार से अलग हो)"
      ]
    },
    eligibility: {
      english: "Any individual aged 18+ who owns gold jewelry or coins. Purity must be between 18-22 carats.",
      hindi: "18+ वर्ष का कोई भी व्यक्ति जिसके पास सोने के गहने या सिक्के हैं। शुद्धता 18-22 कैरेट के बीच होनी चाहिए।"
    },
    benefits: {
      english: [
        "Zero processing fees up to ₹3 Lakhs.",
        "Overdraft facility available for farmers and business entities against gold.",
        "Highly secure storage with absolute transparency."
      ],
      hindi: [
        "₹3 लाख तक शून्य प्रोसेसिंग शुल्क।",
        "सोने के बदले किसानों और व्यावसायिक संस्थाओं के लिए ओवरड्राफ्ट (OD) की सुविधा उपलब्ध।",
        "पूर्ण पारदर्शिता के साथ अत्यधिक सुरक्षित तिजोरी भंडारण।"
      ]
    },
    safetyNote: {
      english: "Ensure you collect the official gold receipt listing the weight and quantity of ornaments deposited in Bank of Baroda.",
      hindi: "सुनिश्चित करें कि आप बैंक ऑफ बड़ौदा में जमा किए गए गहनों के वजन और मात्रा को सूचीबद्ध करने वाली आधिकारिक स्वर्ण रसीद प्राप्त करें।"
    }
  },

  // ──── BUSINESS LOANS ────
  {
    bankId: "sbi",
    bankName: "State Bank of India",
    loanType: "business_loan",
    loanTypeLabel: { english: "Business Loan", hindi: "व्यापार ऋण" },
    interestRate: 9.50,
    interestRateDisplay: { english: "9.50% onwards p.a.", hindi: "9.50% प्रति वर्ष से शुरू" },
    processingFee: { english: "Up to 1.00% of the loan amount + GST", hindi: "ऋण राशि का 1.00% तक + जीएसटी" },
    repaymentPeriod: { english: "Up to 7 years", hindi: "7 वर्ष तक" },
    officialWebsite: "https://sbi.co.in/web/business/sme/msme-loans",
    howToApply: {
      english: "Apply online via SBI SME portal, the government Mudra loan portal, or visit any SBI Commercial or SME branch.",
      hindi: "एसबीआई एसएमई (SME) पोर्टल, सरकारी मुद्रा ऋण पोर्टल के माध्यम से ऑनलाइन आवेदन करें, या किसी भी एसबीआई वाणिज्यिक या एसएमई शाखा में जाएं।"
    },
    documentsRequired: {
      english: [
        "Business Registration Proof (GST Certificate, MSME Udyam Registration)",
        "ITR of the business along with Balance Sheet of last 2-3 years",
        "Last 12 months' business bank account statement",
        "KYC of the promoters or partners (Aadhaar, PAN)"
      ],
      hindi: [
        "व्यापार पंजीकरण प्रमाण (जीएसटी प्रमाण पत्र, एमएसएमई उद्यम पंजीकरण)",
        "पिछले 2-3 वर्षों की बैलेंस शीट के साथ व्यापार का आईटीआर",
        "पिछले 12 महीनों का व्यावसायिक बैंक खाता विवरण",
        "प्रवर्तकों या भागीदारों का केवाईसी (आधार, पैन)"
      ]
    },
    eligibility: {
      english: "Micro, Small, and Medium Enterprises (MSMEs), sole proprietors, partnership firms, and private companies.",
      hindi: "सूक्ष्म, लघु और मध्यम उद्यम (MSME), एकल मालिक, साझेदारी फर्में और निजी कंपनियां।"
    },
    benefits: {
      english: [
        "Low interest rates backed by government CGTMSE guarantee schemes.",
        "Mudra loans up to ₹10 Lakhs under Shishu, Kishor, and Tarun schemes.",
        "Flexible collateral requirements based on business size."
      ],
      hindi: [
        "सरकारी CGTMSE गारंटी योजनाओं द्वारा समर्थित कम ब्याज दरें।",
        "शिशु, किशोर और तरुण योजनाओं के तहत ₹10 लाख तक के मुद्रा ऋण (Mudra loans)।",
        "व्यवसाय के आकार के आधार पर लचीली संपार्श्विक (collateral) आवश्यकताएं।"
      ]
    },
    safetyNote: {
      english: "Ensure you submit genuine business GST reports. Falsifying sales statements will lead to rejection and legal actions.",
      hindi: "सुनिश्चित करें कि आप वास्तविक व्यापार जीएसटी रिपोर्ट जमा करें। फर्जी बिक्री विवरण जमा करने पर कानूनी कार्रवाई हो सकती है।"
    }
  },
  {
    bankId: "hdfc",
    bankName: "HDFC Bank",
    loanType: "business_loan",
    loanTypeLabel: { english: "Business Loan", hindi: "व्यापार ऋण" },
    interestRate: 11.25,
    interestRateDisplay: { english: "11.25% - 17.50% p.a.", hindi: "11.25% - 17.50% प्रति वर्ष" },
    processingFee: { english: "0.99% to 2.00% of the loan amount + GST", hindi: "ऋण राशि का 0.99% से 2.00% + जीएसटी" },
    repaymentPeriod: { english: "Up to 5 years", hindi: "5 वर्ष तक" },
    officialWebsite: "https://www.hdfcbank.com/personal/borrow/loans/business-loan",
    howToApply: {
      english: "Apply digitally via HDFC MyBusiness portal or visit the nearest HDFC enterprise asset branch.",
      hindi: "एचडीएफसी मायबिजनेस (MyBusiness) पोर्टल के माध्यम से डिजिटल रूप से आवेदन करें या नजदीकी शाखा में जाएं।"
    },
    documentsRequired: {
      english: [
        "PAN Card (Individual & Entity), Aadhaar Card",
        "GST Returns for last 12 months & audited financial records",
        "Bank statements of the main operating account for 12 months",
        "Udyam registration or partnership deed"
      ],
      hindi: [
        "पैन कार्ड (व्यक्तिगत और इकाई), आधार कार्ड",
        "पिछले 12 महीनों का जीएसटी रिटर्न और ऑडिटेड वित्तीय रिकॉर्ड",
        "12 महीनों का मुख्य परिचालन खाता विवरण (Bank Statement)",
        "उद्यम पंजीकरण (Udyam Registration) या साझेदारी विलेख (Partnership Deed)"
      ]
    },
    eligibility: {
      english: "Self-employed individuals, proprietors, partnership firms, and private companies with operational history of at least 3 years.",
      hindi: "स्व-नियोजित व्यक्ति, मालिक, साझेदारी फर्में और निजी कंपनियां जिनका परिचालन इतिहास कम से कम 3 वर्ष का हो।"
    },
    benefits: {
      english: [
        "Completely collateral-free business funding up to ₹50 Lakhs.",
        "Overdraft facility options available to manage working capital demands.",
        "Simplified digital documentation process."
      ],
      hindi: [
        "₹50 लाख तक का पूरी तरह से बिना गारंटी (collateral-free) का व्यापार वित्तपोषण।",
        "कार्यशील पूंजी की मांगों को प्रबंधित करने के लिए ओवरड्राफ्ट (OD) की सुविधा।",
        "सरलीकृत डिजिटल दस्तावेज प्रक्रिया।"
      ]
    },
    safetyNote: {
      english: "HDFC will never ask you to pay any cash fees to direct sales agents. Pay processing fees strictly through bank account transfers.",
      hindi: "एचडीएफसी कभी भी आपसे प्रत्यक्ष बिक्री एजेंटों को नकद शुल्क देने के लिए नहीं कहेगा। प्रोसेसिंग शुल्क का भुगतान केवल बैंक ट्रांसफर से करें।"
    }
  },

  // ──── AGRICULTURE LOANS ────
  {
    bankId: "sbi",
    bankName: "State Bank of India",
    loanType: "agriculture_loan",
    loanTypeLabel: { english: "Agriculture Loan", hindi: "कृषि ऋण" },
    interestRate: 7.00,
    interestRateDisplay: { english: "7.00% p.a. (with government interest subvention)", hindi: "7.00% प्रति वर्ष (सरकारी ब्याज रियायत के साथ)" },
    processingFee: { english: "Nil for loans up to ₹3 Lakhs. 0.50% above ₹3 Lakhs.", hindi: "₹3 लाख तक के ऋणों के लिए शून्य। ₹3 लाख से ऊपर 0.50%।" },
    repaymentPeriod: { english: "Up to 5 years (repayment aligned to harvest periods)", hindi: "5 वर्ष तक (फसल कटाई अवधि के अनुसार पुनर्भुगतान)" },
    officialWebsite: "https://sbi.co.in/web/agricultural-banking/crop-loans",
    howToApply: {
      english: "Apply on the SBI YONO Krishi portal or visit the nearest rural or semi-urban SBI branch with your land records (Khasra/Khatauni).",
      hindi: "एसबीआई योनो कृषि पोर्टल पर आवेदन करें या अपने भूमि रिकॉर्ड (खसरा/खतौनी) के साथ नजदीकी ग्रामीण या अर्ध-शहरी एसबीआई शाखा में जाएं।"
    },
    documentsRequired: {
      english: [
        "Aadhaar Card, PAN Card, or Voter ID",
        "Land holding documents certified by revenue authority (Pattadar Passbook, Khasra, Khatauni)",
        "Crop cultivation declaration certified by local agricultural authority"
      ],
      hindi: [
        "आधार कार्ड, पैन कार्ड, या मतदाता पहचान पत्र",
        "राजस्व अधिकारी द्वारा प्रमाणित भूमि के दस्तावेज (पट्टादार पासबुक, खसरा, खतौनी)",
        "स्थानीय कृषि अधिकारी द्वारा प्रमाणित फसल खेती घोषणा पत्र"
      ]
    },
    eligibility: {
      english: "All farmers - owner cultivators, tenant farmers, sharecroppers, or joint liability groups.",
      hindi: "सभी किसान - मालिक किसान, किरायेदार किसान, बटाईदार या संयुक्त देयता समूह (JLG)।"
    },
    benefits: {
      english: [
        "Highly subsidized interest rates from central/state governments (subventions up to 3%).",
        "Flexible repayment cycles matching crop harvest and sale seasons.",
        "Includes RuPay Kisan Credit Card (KCC) for easy ATM withdrawals."
      ],
      hindi: [
        "केंद्र/राज्य सरकारों से अत्यधिक रियायती ब्याज दरें (3% तक की रियायत)।",
        "फसल कटाई और बिक्री के मौसम के अनुसार लचीले पुनर्भुगतान चक्र।",
        "आसान एटीएम निकासी के लिए रुपे किसान क्रेडिट कार्ड (KCC) शामिल है।"
      ]
    },
    safetyNote: {
      english: "Never hand over your land passbooks or KCC card with PIN to local brokers. Perform all transactions at the official branch.",
      hindi: "स्थानीय दलालों को कभी भी अपने भूमि पासबुक या पिन के साथ केसीसी (KCC) कार्ड न सौंपें। सभी लेनदेन केवल आधिकारिक शाखा में करें।"
    }
  },
  {
    bankId: "canara",
    bankName: "Canara Bank",
    loanType: "agriculture_loan",
    loanTypeLabel: { english: "Agriculture Loan", hindi: "कृषि ऋण" },
    interestRate: 7.00,
    interestRateDisplay: { english: "7.00% onwards p.a.", hindi: "7.00% प्रति वर्ष से शुरू" },
    processingFee: { english: "Nil processing fee up to ₹1.60 Lakhs", hindi: "₹1.60 लाख तक शून्य प्रोसेसिंग शुल्क" },
    repaymentPeriod: { english: "Up to 5 years", hindi: "5 वर्ष तक" },
    officialWebsite: "https://canarabank.com/personal-banking/loans/agricultural-loan",
    howToApply: {
      english: "Apply online or walk into any rural/semi-urban Canara Bank branch with your farming land documents.",
      hindi: "ऑनलाइन आवेदन करें या अपने कृषि भूमि के दस्तावेजों के साथ किसी भी ग्रामीण/अर्ध-शहरी केनरा बैंक शाखा में जाएं।"
    },
    documentsRequired: {
      english: [
        "Identity & Address Proof (Aadhaar, Voter ID, PAN)",
        "Certified land map & ownership proofs from local revenue authorities",
        "Kisan Credit Card application details"
      ],
      hindi: [
        "पहचान और निवास का प्रमाण (आधार, मतदाता पहचान पत्र, पैन)",
        "स्थानीय राजस्व अधिकारियों से प्रमाणित भूमि का नक्शा और स्वामित्व प्रमाण",
        "किसान क्रेडिट कार्ड (KCC) आवेदन विवरण"
      ]
    },
    eligibility: {
      english: "Farmers engaged in agriculture and allied activities (dairy, poultry, fisheries). Own land or lease agreement is required.",
      hindi: "कृषि और संबद्ध गतिविधियों (डेयरी, पोल्ट्री, मत्स्य पालन) में लगे किसान। अपनी जमीन या लीज समझौता आवश्यक है।"
    },
    benefits: {
      english: [
        "Quick appraisal and disbursement for urgent sowing seasons.",
        "Zero valuation and inspection charges for credit limits up to ₹1.6 Lakhs.",
        "Accidental insurance coverage of ₹50,000 for KCC cardholders."
      ],
      hindi: [
        "बुआई के आवश्यक मौसमों के लिए त्वरित मूल्यांकन और वितरण।",
        "₹1.6 लाख तक की क्रेडिट सीमा के लिए शून्य मूल्यांकन और निरीक्षण शुल्क।",
        "केसीसी (KCC) कार्डधारकों के लिए ₹50,000 का दुर्घटना बीमा कवरेज।"
      ]
    },
    safetyNote: {
      english: "Beware of fake Krishi scheme websites. Use only the official Canara Bank website for schemes.",
      hindi: "नकली कृषि योजना वेबसाइटों से सावधान रहें। योजनाओं के लिए केवल आधिकारिक केनरा बैंक वेबसाइट का उपयोग करें।"
    }
  },
  {
    bankId: "bob",
    bankName: "Bank of Baroda",
    loanType: "agriculture_loan",
    loanTypeLabel: { english: "Agriculture Loan", hindi: "कृषि ऋण" },
    interestRate: 7.20,
    interestRateDisplay: { english: "7.20% onwards p.a.", hindi: "7.20% प्रति वर्ष से शुरू" },
    processingFee: { english: "Nil processing fee up to ₹3 Lakhs", hindi: "₹3 लाख तक शून्य प्रोसेसिंग शुल्क" },
    repaymentPeriod: { english: "Up to 5 years", hindi: "5 वर्ष तक" },
    officialWebsite: "https://www.bankofbaroda.in/agricultural-banking/loans/crop-loan",
    howToApply: {
      english: "Visit the nearest specialized Baroda agricultural banking branch or apply digitally through Baroda Kisan portal.",
      hindi: "नजदीकी विशिष्ट बड़ौदा कृषि बैंकिंग शाखा में जाएं या बड़ौदा किसान पोर्टल के माध्यम से डिजिटल रूप से आवेदन करें।"
    },
    documentsRequired: {
      english: [
        "Identity Proof (Aadhaar, PAN Card)",
        "Land holding details (Pattadar Passbook or Khatauni copy)",
        "Agricultural crop calendar & credit report"
      ],
      hindi: [
        "पहचान प्रमाण (आधार, पैन कार्ड)",
        "भूमि स्वामित्व का विवरण (पट्टादार पासबुक या खतौनी प्रति)",
        "कृषि फसल कैलेंडर और क्रेडिट रिपोर्ट"
      ]
    },
    eligibility: {
      english: "Resident Indian farmers engaged in cultivation, plantation, or horticulture. Minimum credit history preferrence applies.",
      hindi: "खेती, वृक्षारोपण या बागवानी में लगे निवासी भारतीय किसान। न्यूनतम क्रेडिट इतिहास को प्राथमिकता दी जाती है।"
    },
    benefits: {
      english: [
        "Flexible credit limit based on scale of finance mapped to crop types.",
        "Hassle-free card activation for online purchases of seeds and fertilizers.",
        "Very low administrative charges."
      ],
      hindi: [
        "फसल के प्रकारों के अनुसार वित्त के पैमाने के आधार पर लचीली क्रेडिट सीमा।",
        "बीज और उर्वरकों की ऑनलाइन खरीद के लिए परेशानी मुक्त कार्ड सक्रियण।",
        "अत्यधिक कम प्रशासनिक शुल्क।"
      ]
    },
    safetyNote: {
      english: "Only pay the official valuation charges inside the branch. Do not pay any commissions to land surveyors.",
      hindi: "शाखा के भीतर केवल आधिकारिक मूल्यांकन शुल्क का भुगतान करें। भूमि सर्वेक्षकों को कोई कमीशन न दें।"
    }
  },
  {
    bankId: "uco",
    bankName: "UCO Bank",
    loanType: "agriculture_loan",
    loanTypeLabel: { english: "Agriculture Loan", hindi: "कृषि ऋण" },
    interestRate: 0, // Unverified rate!
    interestRateDisplay: { english: "Check official website", hindi: "आधिकारिक वेबसाइट पर जांचें" },
    processingFee: { english: "Check official website", hindi: "आधिकारिक वेबसाइट पर जांचें" },
    repaymentPeriod: { english: "Up to 5 years", hindi: "5 वर्ष तक" },
    officialWebsite: "", // Unverified official website!
    howToApply: {
      english: "Please visit the nearest UCO Bank branch directly for verified agricultural credit lines and applications.",
      hindi: "सत्यापित कृषि क्रेडिट लाइनों और आवेदनों के लिए कृपया सीधे नजदीकी यूको बैंक शाखा में जाएं।"
    },
    documentsRequired: {
      english: [
        "Identity & Address Proof (Aadhaar Card, Voter ID)",
        "Land revenue receipts and Khasra/Khatauni certified copies"
      ],
      hindi: [
        "पहचान और निवास का प्रमाण (आधार कार्ड, मतदाता पहचान पत्र)",
        "भूमि राजस्व रसीदें और खसरा/खतौनी की प्रमाणित प्रतियां"
      ]
    },
    eligibility: {
      english: "Resident farmers owning cultivable lands or carrying certified lease agreements.",
      hindi: "खेती योग्य भूमि के मालिक या प्रमाणित पट्टेदार (lease) समझौते वाले निवासी किसान।"
    },
    benefits: {
      english: [
        "Aligned with national crop lending priorities.",
        "Simplified verification processes for marginal farmers."
      ],
      hindi: [
        "राष्ट्रीय फसल ऋण प्राथमिकताओं के साथ गठबंधन।",
        "सीमांत किसानों (Marginal farmers) के लिए सरलीकृत सत्यापन प्रक्रियाएं।"
      ]
    },
    safetyNote: {
      english: "Since the official link for UCO crop loans is not verified yet, do not trust unofficial online links. Verify directly at the branch.",
      hindi: "चूंकि यूको फसल ऋण के लिए आधिकारिक लिंक अभी सत्यापित नहीं है, इसलिए अनौपचारिक ऑनलाइन लिंक पर भरोसा न करें। सीधे शाखा में पुष्टि करें।"
    }
  },

  // ──── WOMEN ENTREPRENEUR LOANS ────
  {
    bankId: "sbi",
    bankName: "State Bank of India",
    loanType: "women_entrepreneur_loan",
    loanTypeLabel: { english: "Women Entrepreneur Loan", hindi: "महिला उद्यमी ऋण" },
    interestRate: 8.25,
    interestRateDisplay: { english: "8.25% p.a. (includes Stree Shakti concession)", hindi: "8.25% प्रति वर्ष (स्त्री शक्ति रियायत शामिल है)" },
    processingFee: { english: "Nil processing fee for loans up to ₹5 Lakhs", hindi: "₹5 लाख तक के ऋणों के लिए शून्य प्रोसेसिंग शुल्क" },
    repaymentPeriod: { english: "Up to 5 years", hindi: "5 वर्ष तक" },
    officialWebsite: "https://sbi.co.in/web/business/sme/women-entrepreneurs",
    howToApply: {
      english: "Apply under the 'Stree Shakti Scheme' at any SBI Commercial/SME Branch. Submit your business proposal along with ownership proof.",
      hindi: "किसी भी एसबीआई वाणिज्यिक/एसएमई शाखा में 'स्त्री शक्ति योजना' के तहत आवेदन करें। स्वामित्व प्रमाण के साथ अपना व्यावसायिक प्रस्ताव जमा करें।"
    },
    documentsRequired: {
      english: [
        "Identity Proof & Business Address Proof (GST, Trade License)",
        "Proof of majority ownership by a woman entrepreneur (51% or more shareholding)",
        "ITR and Balance Sheet for loans above ₹2 Lakhs",
        "Detailed business expansion plan or project report"
      ],
      hindi: [
        "पहचान प्रमाण और व्यावसायिक पते का प्रमाण (जीएसटी, ट्रेड लाइसेंस)",
        "महिला उद्यमी द्वारा बहुसंख्यक स्वामित्व का प्रमाण (51% या अधिक शेयरहोल्डिंग)",
        "₹2 लाख से अधिक के ऋणों के लिए आईटीआर और बैलेंस शीट",
        "विस्तृत व्यवसाय विस्तार योजना या परियोजना रिपोर्ट"
      ]
    },
    eligibility: {
      english: "Women entrepreneurs running a manufacturing, trading, or service enterprise with a minimum shareholding of 51% in the business.",
      hindi: "महिला उद्यमी जो विनिर्माण (manufacturing), व्यापार, या सेवा उद्यम चला रही हैं और व्यवसाय में न्यूनतम 51% शेयरहोल्डिंग रखती हैं।"
    },
    benefits: {
      english: [
        "Lower interest rates with concessions of up to 0.50% over base rates.",
        "Collateral-free loans up to ₹5 Lakhs (backed by SBI security guarantees).",
        "Special business mentoring and guidance programs offered by SBI."
      ],
      hindi: [
        "आधार दरों पर 0.50% तक की रियायत के साथ कम ब्याज दरें।",
        "₹5 लाख तक के बिना गारंटी (collateral-free) के ऋण (एसबीआई प्रतिभूति गारंटी द्वारा समर्थित)।",
        "एसबीआई द्वारा पेश विशेष व्यावसायिक परामर्श (mentoring) और मार्गदर्शन कार्यक्रम।"
      ]
    },
    safetyNote: {
      english: "Ensure that your ownership shareholding remains above 51% to qualify for the Stree Shakti concessions during the entire loan term.",
      hindi: "सुनिश्चित करें कि पूरे ऋण अवधि के दौरान स्त्री शक्ति रियायतों के लिए आपकी स्वामित्व हिस्सेदारी 51% से ऊपर बनी रहे।"
    }
  },
  {
    bankId: "pnb",
    bankName: "Punjab National Bank",
    loanType: "women_entrepreneur_loan",
    loanTypeLabel: { english: "Women Entrepreneur Loan", hindi: "महिला उद्यमी ऋण" },
    interestRate: 8.35,
    interestRateDisplay: { english: "8.35% onwards p.a.", hindi: "8.35% प्रति वर्ष से शुरू" },
    processingFee: { english: "Up to 0.50% of the loan amount + GST", hindi: "ऋण राशि का 0.50% तक + जीएसटी" },
    repaymentPeriod: { english: "Up to 7 years", hindi: "7 वर्ष तक" },
    officialWebsite: "https://www.pnbindia.in/pnb-mahila-udyam-nidhi-scheme.html",
    howToApply: {
      english: "Apply under the 'PNB Mahila Udyam Nidhi Scheme' online via PNB corporate portal or at the nearest branch.",
      hindi: "पीएनबी कॉर्पोरेट पोर्टल के माध्यम से ऑनलाइन या नजदीकी शाखा में 'पीएनबी महिला उद्यम निधि योजना' के तहत आवेदन करें।"
    },
    documentsRequired: {
      english: [
        "Identity Proof (PAN, Aadhaar) & Entity KYC",
        "Proof of MSME Udyam Registration mapped to female promoter",
        "ITR with financials for last 2 years (if applicable)"
      ],
      hindi: [
        "पहचान प्रमाण (पैन, आधार) और इकाई केवाईसी",
        "महिला प्रमोटर से जुड़े एमएसएमई उद्यम पंजीकरण (Udyam Registration) का प्रमाण",
        "पिछले 2 वर्षों के आईटीआर और वित्तीय विवरण (यदि लागू हो)"
      ]
    },
    eligibility: {
      english: "Women-led enterprises set up for tiny or small-scale industries. Woman's stake must be at least 51%.",
      hindi: "महिला नेतृत्व वाले उद्यम जो छोटे या लघु उद्योगों के लिए स्थापित किए गए हैं। महिला की हिस्सेदारी कम से कम 51% होनी चाहिए।"
    },
    benefits: {
      english: [
        "Highly competitive interest rates to foster women empowerment.",
        "Repayment periods stretching up to 7 years with initial moratorium.",
        "Helps women-led tiny units upgrade their manufacturing technology."
      ],
      hindi: [
        "महिला सशक्तिकरण को बढ़ावा देने के लिए अत्यधिक प्रतिस्पर्धी ब्याज दरें।",
        "शुरुआती मोरेटोरियम (छूट अवधि) के साथ 7 साल तक की पुनर्भुगतान अवधि।",
        "महिला नेतृत्व वाली छोटी इकाइयों को अपनी विनिर्माण तकनीक को अपग्रेड करने में मदद करता है।"
      ]
    },
    safetyNote: {
      english: "Always verify your PNB Mahila scheme status through PNB official corporate login. Never communicate through unofficial email accounts.",
      hindi: "हमेशा पीएनबी आधिकारिक कॉर्पोरेट लॉगिन के माध्यम से अपनी पीएनबी महिला योजना स्थिति की पुष्टि करें। अनौपचारिक ईमेल खातों से संवाद न करें।"
    }
  },
  {
    bankId: "hdfc",
    bankName: "HDFC Bank",
    loanType: "women_entrepreneur_loan",
    loanTypeLabel: { english: "Women Entrepreneur Loan", hindi: "महिला उद्यमी ऋण" },
    interestRate: 9.50,
    interestRateDisplay: { english: "9.50% onwards p.a.", hindi: "9.50% प्रति वर्ष से शुरू" },
    processingFee: { english: "0.50% of the loan amount + GST", hindi: "ऋण राशि का 0.50% + जीएसटी" },
    repaymentPeriod: { english: "Up to 5 years", hindi: "5 वर्ष तक" },
    officialWebsite: "https://www.hdfcbank.com/personal/borrow/loans/business-loan-for-women",
    howToApply: {
      english: "Apply online under the HDFC 'SmartUp for Women' enterprise program or submit details on the MyBusiness portal.",
      hindi: "एचडीएफसी 'स्मार्टअप फॉर वीमेन' उद्यम कार्यक्रम के तहत ऑनलाइन आवेदन करें या माईबिजनेस पोर्टल पर विवरण जमा करें।"
    },
    documentsRequired: {
      english: [
        "PAN Card, Aadhaar Card, or Passport",
        "GST certificate, business registration proof",
        "Last 12 months' business bank statements",
        "Audited financials for loans above ₹10 Lakhs"
      ],
      hindi: [
        "पैन कार्ड, आधार कार्ड, या पासपोर्ट",
        "जीएसटी प्रमाण पत्र, व्यापार पंजीकरण का प्रमाण",
        "पिछले 12 महीनों का व्यावसायिक बैंक स्टेटमेंट",
        "₹10 लाख से अधिक के ऋणों के लिए ऑडिटेड वित्तीय विवरण"
      ]
    },
    eligibility: {
      english: "Women entrepreneurs running self-employed businesses, sole proprietorships, or private companies with 51%+ female equity.",
      hindi: "महिला उद्यमी जो स्व-नियोजित व्यवसाय, एकल स्वामित्व या निजी कंपनियां चला रही हैं जिनमें 51% से अधिक महिला इक्विटी (हिस्सेदारी) हो।"
    },
    benefits: {
      english: [
        "Includes access to SmartUp mentoring workshops led by leading female entrepreneurs.",
        "Collateral-free credit limits to scale enterprise capabilities.",
        "Zero prepayment charges on floating-rate loans after 12 EMIs."
      ],
      hindi: [
        "अग्रणी महिला उद्यमियों के नेतृत्व में स्मार्टअप परामर्श कार्यशालाओं तक पहुंच शामिल है।",
        "उद्यम क्षमताओं को बढ़ाने के लिए बिना गारंटी के क्रेडिट सीमा।",
        "12 ईएमआई के बाद फ्लोटिंग-रेट ऋणों पर शून्य प्रीपेमेंट शुल्क।"
      ]
    },
    safetyNote: {
      english: "Ensure you sign business loan agreements digitally on verified HDFC platforms only. Keep your OTP codes confidential.",
      hindi: "सुनिश्चित करें कि आप केवल सत्यापित एचडीएफसी प्लेटफार्मों पर ही व्यापार ऋण समझौतों पर डिजिटल रूप से हस्ताक्षर करें। अपने ओटीपी कोड गोपनीय रखें।"
    }
  },
  {
    bankId: "ausfb",
    bankName: "AU Small Finance Bank",
    loanType: "women_entrepreneur_loan",
    loanTypeLabel: { english: "Women Entrepreneur Loan", hindi: "महिला उद्यमी ऋण" },
    interestRate: 12.00,
    interestRateDisplay: { english: "12.00% - 16.00% p.a.", hindi: "12.00% - 16.00% प्रति वर्ष" },
    processingFee: { english: "1.50% of the loan amount + GST", hindi: "ऋण राशि का 1.50% + जीएसटी" },
    repaymentPeriod: { english: "Up to 5 years", hindi: "5 वर्ष तक" },
    officialWebsite: "", // Unverified!
    howToApply: {
      english: "Please visit the nearest AU Small Finance Bank branch for details, as the online link for AU Mahila Udyami is not verified yet.",
      hindi: "विवरण के लिए कृपया नजदीकी एयू स्मॉल फाइनेंस बैंक शाखा में जाएं, क्योंकि एयू महिला उद्यमी के लिए ऑनलाइन लिंक अभी सत्यापित नहीं है।"
    },
    documentsRequired: {
      english: [
        "KYC documents (Aadhaar, PAN Card)",
        "Proof of business running (Municipal certificate, Udyam Registration)",
        "6 months' bank statements of operational business account"
      ],
      hindi: [
        "केवाईसी दस्तावेज (आधार, पैन कार्ड)",
        "व्यापार चलने का प्रमाण (नगर पालिका प्रमाण पत्र, उद्यम पंजीकरण)",
        "सक्रिय व्यावसायिक खाते का 6 महीने का बैंक स्टेटमेंट"
      ]
    },
    eligibility: {
      english: "Female micro-entrepreneurs running small retail or manufacturing units in rural or semi-urban markets.",
      hindi: "महिला सूक्ष्म उद्यमी जो ग्रामीण या अर्ध-शहरी बाजारों में छोटी खुदरा या विनिर्माण इकाइयां चला रही हैं।"
    },
    benefits: {
      english: [
        "Tailored for rural and semi-urban women micro-entrepreneurs.",
        "Doorstep documentation services.",
        "Simplified income criteria."
      ],
      hindi: [
        "ग्रामीण और अर्ध-शहरी महिला सूक्ष्म उद्यमियों के लिए विशेष रूप से तैयार।",
        "दरवाजे पर दस्तावेज संग्रह सेवाएं (Doorstep documentation)।",
        "सरलीकृत आय मानदंड (Income criteria)।"
      ]
    },
    safetyNote: {
      english: "Since the official application page for AU Mahila Udyami is not verified, apply only by physically walking into a verified AU branch.",
      hindi: "चूंकि एयू महिला उद्यमी के लिए आधिकारिक आवेदन पृष्ठ सत्यापित नहीं है, इसलिए केवल भौतिक रूप से एयू शाखा में जाकर ही आवेदन करें।"
    }
  },

  // ──── MSME LOANS ────
  {
    bankId: "sbi",
    bankName: "State Bank of India",
    loanType: "msme_loan",
    loanTypeLabel: { english: "MSME Loan", hindi: "एमएसएमई ऋण" },
    interestRate: 9.20,
    interestRateDisplay: { english: "9.20% onwards p.a.", hindi: "9.20% प्रति वर्ष से शुरू" },
    processingFee: { english: "0.50% of the loan amount + GST", hindi: "ऋण राशि का 0.50% + जीएसटी" },
    repaymentPeriod: { english: "Up to 5 years", hindi: "5 वर्ष तक" },
    officialWebsite: "https://sbi.co.in/web/business/sme/msme-loans",
    howToApply: {
      english: "Apply online through SBI SME portal or submit Udyam details at any SBI specialized SME branch.",
      hindi: "एसबीआई एसएमई (SME) पोर्टल के माध्यम से ऑनलाइन आवेदन करें या किसी भी एसबीआई एसएमई शाखा में उद्यम विवरण जमा करें।"
    },
    documentsRequired: {
      english: [
        "Udyam Registration Certificate & GST registration proofs",
        "ITR and audited Balance Sheets of the business for past 2 years",
        "Past 12 months' business operating bank statements",
        "Promoter KYC (Aadhaar, PAN)"
      ],
      hindi: [
        "उद्यम पंजीकरण प्रमाण पत्र (Udyam Registration) और जीएसटी पंजीकरण प्रमाण",
        "पिछले 2 वर्षों के व्यवसाय के आईटीआर और ऑडिटेड बैलेंस शीट",
        "पिछले 12 महीनों का व्यावसायिक बैंक स्टेटमेंट",
        "प्रमोटर का केवाईसी (आधार, पैन)"
      ]
    },
    eligibility: {
      english: "Registered Micro, Small, and Medium Enterprises (MSMEs) with active Udyam registration numbers.",
      hindi: "सक्रिय उद्यम पंजीकरण संख्या वाले पंजीकृत सूक्ष्म, लघु और मध्यम उद्यम (MSME)।"
    },
    benefits: {
      english: [
        "Access to low-interest, government-guaranteed working capital loans.",
        "CGTMSE security collateral-free options available for eligible MSMEs.",
        "Flexible credit limits."
      ],
      hindi: [
        "कम ब्याज वाले, सरकार द्वारा गारंटीकृत कार्यशील पूंजी ऋण (Working capital loans) तक पहुंच।",
        "पात्र एमएसएमई के लिए सीजीटीएमएसई (CGTMSE) सुरक्षा गारंटी के तहत बिना गारंटी के विकल्प।",
        "लचीली क्रेडिट सीमाएं।"
      ]
    },
    safetyNote: {
      english: "Submit only genuine GST returns. Falsified turnover reporting will result in immediate loan rejection and legal blacklist.",
      hindi: "केवल वास्तविक जीएसटी रिटर्न जमा करें। झूठी टर्नओवर रिपोर्टिंग के कारण ऋण तुरंत अस्वीकार और कानूनी ब्लैकलिस्ट हो सकती है।"
    }
  },
  {
    bankId: "bob",
    bankName: "Bank of Baroda",
    loanType: "msme_loan",
    loanTypeLabel: { english: "MSME Loan", hindi: "एमएसएमई ऋण" },
    interestRate: 9.30,
    interestRateDisplay: { english: "9.30% - 12.50% p.a.", hindi: "9.30% - 12.50% प्रति वर्ष" },
    processingFee: { english: "0.50% of the loan amount + GST", hindi: "ऋण राशि का 0.50% + जीएसटी" },
    repaymentPeriod: { english: "Up to 7 years", hindi: "7 वर्ष तक" },
    officialWebsite: "https://www.bankofbaroda.in/business-banking/loans/msme-loans",
    howToApply: {
      english: "Apply digitally on the Baroda MSME loan builder portal or submit your registration papers at the nearest branch.",
      hindi: "बड़ौदा एमएसएमई लोन बिल्डर पोर्टल पर डिजिटल रूप से आवेदन करें या नजदीकी शाखा में अपने पंजीकरण कागजात जमा करें।"
    },
    documentsRequired: {
      english: [
        "GST certificate, Business registration proof (Udyam or partnership deed)",
        "KYC of directors/partners, PAN Card of business entity",
        "12 months' bank statement and ITR files"
      ],
      hindi: [
        "जीएसटी प्रमाण पत्र, व्यवसाय पंजीकरण प्रमाण (उद्यम या साझेदारी विलेख)",
        "निदेशकों/भागीदारों का केवाईसी, व्यावसायिक इकाई का पैन कार्ड",
        "12 महीनों का बैंक स्टेटमेंट और आईटीआर फाइलें"
      ]
    },
    eligibility: {
      english: "MSMEs running active manufacturing or service enterprises with positive cash flows for the last 2 years.",
      hindi: "एमएसएमई जो सक्रिय विनिर्माण या सेवा उद्यम चला रहे हैं और पिछले 2 वर्षों से सकारात्मक नकदी प्रवाह (positive cash flow) दिखा रहे हैं।"
    },
    benefits: {
      english: [
        "Highly competitive rates linked to CIBIL MSME rank.",
        "Repayment periods stretching up to 7 full years to reduce EMI burdens.",
        "Fast digital appraisal and processing."
      ],
      hindi: [
        "सिबिल एमएसएमई रैंक (CIBIL MSME rank) से जुड़ी अत्यधिक प्रतिस्पर्धी दरें।",
        "ईएमआई के बोझ को कम करने के लिए पुनर्भुगतान की अवधि 7 पूर्ण वर्षों तक बढ़ाई जा सकती है।",
        "त्वरित डिजिटल मूल्यांकन और प्रसंस्करण।"
      ]
    },
    safetyNote: {
      english: "Verify your CIBIL MSME rank directly on TransUnion CIBIL portal before submitting. Do not share credentials with brokers.",
      hindi: "जमा करने से पहले सीधे ट्रांसयूनियन सिबिल पोर्टल पर अपने सिबिल एमएसएमई रैंक की पुष्टि करें। दलालों के साथ क्रेडेंशियल साझा न करें।"
    }
  },
  {
    bankId: "hdfc",
    bankName: "HDFC Bank",
    loanType: "msme_loan",
    loanTypeLabel: { english: "MSME Loan", hindi: "एमएसएमई ऋण" },
    interestRate: 10.25,
    interestRateDisplay: { english: "10.25% onwards p.a.", hindi: "10.25% प्रति वर्ष से शुरू" },
    processingFee: { english: "0.99% of loan amount + GST", hindi: "ऋण राशि का 0.99% + जीएसटी" },
    repaymentPeriod: { english: "Up to 5 years", hindi: "5 वर्ष तक" },
    officialWebsite: "https://www.hdfcbank.com/personal/borrow/loans/business-loan",
    howToApply: {
      english: "Apply digitally via HDFC MyBusiness portal or visit the nearest HDFC SME asset office.",
      hindi: "एचडीएफसी माईबिजनेस (MyBusiness) पोर्टल के माध्यम से डिजिटल रूप से आवेदन करें या नजदीकी एसएमई कार्यालय पर जाएं।"
    },
    documentsRequired: {
      english: [
        "PAN Card of the firm and promoters, Aadhaar Cards",
        "GST registration and last 12 months' GST 3B returns",
        "Last 12 months' statements of active business account",
        "KYC & Udyam registration papers"
      ],
      hindi: [
        "फर्म और प्रमोटरों का पैन कार्ड, आधार कार्ड",
        "जीएसटी पंजीकरण और पिछले 12 महीनों का जीएसटी 3बी रिटर्न",
        "सक्रिय व्यावसायिक खाते का पिछले 12 महीनों का विवरण (Statement)",
        "केवाईसी और उद्यम पंजीकरण दस्तावेज"
      ]
    },
    eligibility: {
      english: "Sole proprietorships, partnerships, or private companies with stable active operational history of 3+ years.",
      hindi: "एकल स्वामित्व, साझेदारी या निजी कंपनियां जिनका स्थिर सक्रिय परिचालन इतिहास 3+ वर्ष का हो।"
    },
    benefits: {
      english: [
        "Unsecured capital limits up to ₹75 Lakhs digitally.",
        "Flexible overdraft accounts linked to business current accounts.",
        "Attractive rates for businesses showing clean GST credit parameters."
      ],
      hindi: [
        "डिजिटल रूप से ₹75 लाख तक की असुरक्षित (unsecured) पूंजी सीमा।",
        "बिजनेस करंट अकाउंट से जुड़े लचीले ओवरड्राफ्ट खाते।",
        "स्वच्छ जीएसटी क्रेडिट मापदंड दिखाने वाले व्यवसायों के लिए आकर्षक दरें।"
      ]
    },
    safetyNote: {
      english: "Sign agreements electronically only on secured, official HDFC digital portals. Never share bank statements with third-party agents.",
      hindi: "केवल सुरक्षित, आधिकारिक एचडीएफसी डिजिटल पोर्टल्स पर ही इलेक्ट्रॉनिक रूप से समझौतों पर हस्ताक्षर करें। तीसरे पक्ष के एजेंटों के साथ कभी भी बैंक स्टेटमेंट साझा न करें।"
    }
  },
  {
    bankId: "axis",
    bankName: "Axis Bank",
    loanType: "msme_loan",
    loanTypeLabel: { english: "MSME Loan", hindi: "एमएसएमई ऋण" },
    interestRate: 0, // Unverified rate!
    interestRateDisplay: { english: "Check official website", hindi: "आधिकारिक वेबसाइट पर जांचें" },
    processingFee: { english: "Up to 1.50% of the loan amount + GST", hindi: "ऋण राशि का 1.50% तक + जीएसटी" },
    repaymentPeriod: { english: "Up to 5 years", hindi: "5 वर्ष तक" },
    officialWebsite: "https://www.axisbank.com/business-banking/loans/msme-loans",
    howToApply: {
      english: "Apply online through Axis Bank MSME services page or submit papers at the nearest Axis corporate branch.",
      hindi: "एक्सिस बैंक एमएसएमई सेवा पृष्ठ के माध्यम से ऑनलाइन आवेदन करें या नजदीकी एक्सिस कॉर्पोरेट शाखा में दस्तावेज जमा करें।"
    },
    documentsRequired: {
      english: [
        "KYC of promoters and partnership deed or certificate of incorporation",
        "GST certificate and business operating account statements for last 12 months",
        "Udyam registration proof"
      ],
      hindi: [
        "प्रमोटरों का केवाईसी और साझेदारी विलेख (deed) या निगमन प्रमाण पत्र",
        "पिछले 12 महीनों का जीएसटी प्रमाण पत्र और व्यावसायिक खाता विवरण",
        "उद्यम पंजीकरण (Udyam Registration) प्रमाण"
      ]
    },
    eligibility: {
      english: "Registered MSMEs operating in manufacturing or trading with steady cash flow histories.",
      hindi: "विनिर्माण या व्यापार में काम करने वाले पंजीकृत एमएसएमई जिनका स्थिर नकदी प्रवाह (cash flow) इतिहास हो।"
    },
    benefits: {
      english: [
        "Government-backed loan facilities available.",
        "Overdraft limits tailored for SME traders."
      ],
      hindi: [
        "सरकार द्वारा समर्थित ऋण सुविधाएं उपलब्ध।",
        "एसएमई (SME) व्यापारियों के लिए विशेष रूप से तैयार ओवरड्राफ्ट सीमाएं।"
      ]
    },
    safetyNote: {
      english: "Make sure you receive the official sanction letter with a verified digital signature from Axis Bank. Do not pay commissions.",
      hindi: "सुनिश्चित करें कि आपको एक्सिस बैंक से सत्यापित डिजिटल हस्ताक्षर के साथ आधिकारिक स्वीकृति पत्र प्राप्त हो। कोई कमीशन न दें।"
    }
  }
];

const BANK_CATEGORY_BY_ID: Record<string, string> = {
  sbi: "Public Sector",
  pnb: "Public Sector",
  bob: "Public Sector",
  canara: "Public Sector",
  union: "Public Sector",
  indianbank: "Public Sector",
  boi: "Public Sector",
  cbi: "Public Sector",
  iob: "Public Sector",
  uco: "Public Sector",
  bom: "Public Sector",
  psb: "Public Sector",
  hdfc: "Private Sector",
  icici: "Private Sector",
  axis: "Private Sector",
  kotak: "Private Sector",
  idfc: "Private Sector",
  indusind: "Private Sector",
  federal: "Private Sector",
  sib: "Private Sector",
  rbl: "Private Sector",
  yes: "Private Sector",
  bandhan: "Private Sector",
  dcb: "Private Sector",
  ausfb: "Small Finance",
  ujjivan: "Small Finance",
  equitas: "Small Finance",
  jana: "Small Finance",
  suryoday: "Small Finance",
  esaf: "Small Finance",
};

const LOAN_TYPE_ALIASES: Record<string, LoanComparisonLoanType> = {
  personal: "personal_loan",
  "personal loan": "personal_loan",
  personal_loan: "personal_loan",
  home: "home_loan",
  house: "home_loan",
  housing: "home_loan",
  "home loan": "home_loan",
  "housing loan": "home_loan",
  home_loan: "home_loan",
  education: "education_loan",
  student: "education_loan",
  study: "education_loan",
  "education loan": "education_loan",
  "student loan": "education_loan",
  education_loan: "education_loan",
  vehicle: "vehicle_loan",
  car: "vehicle_loan",
  auto: "vehicle_loan",
  bike: "vehicle_loan",
  "vehicle loan": "vehicle_loan",
  "car loan": "vehicle_loan",
  vehicle_loan: "vehicle_loan",
  gold: "gold_loan",
  jewel: "gold_loan",
  jewellery: "gold_loan",
  jewelry: "gold_loan",
  "gold loan": "gold_loan",
  gold_loan: "gold_loan",
  business: "business_loan",
  "business loan": "business_loan",
  business_loan: "business_loan",
  agriculture: "agriculture_loan",
  agricultural: "agriculture_loan",
  farmer: "agriculture_loan",
  crop: "agriculture_loan",
  "agriculture loan": "agriculture_loan",
  agriculture_loan: "agriculture_loan",
  women: "women_entrepreneur_loan",
  "women entrepreneur": "women_entrepreneur_loan",
  "women entrepreneur loan": "women_entrepreneur_loan",
  women_entrepreneur_loan: "women_entrepreneur_loan",
  msme: "msme_loan",
  "msme loan": "msme_loan",
  sme: "msme_loan",
  msme_loan: "msme_loan",
};

function getComparableHost(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isVerifiedOfficialLoanUrl(entry: LoanComparisonEntry): boolean {
  if (!entry.officialWebsite.startsWith("https://")) return false;

  const officialBankLink = getOfficialLink("banks", entry.bankId);
  if (!officialBankLink) return false;

  const loanHost = getComparableHost(entry.officialWebsite);
  const bankHost = getComparableHost(officialBankLink);
  if (!loanHost || !bankHost) return false;

  return loanHost === bankHost || loanHost.endsWith(`.${bankHost}`);
}

function normalizeLoanType(loanType: string): string {
  const normalized = loanType.trim().toLowerCase().replace(/[-\s]+/g, "_");
  const aliasKey = loanType.trim().toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ");
  return LOAN_TYPE_ALIASES[normalized] || LOAN_TYPE_ALIASES[aliasKey] || normalized;
}

export const LOAN_COMPARISON_DATA: NormalizedLoanComparisonEntry[] =
  VERIFIED_LOAN_COMPARISONS.map((entry) => {
    const verified = isVerifiedOfficialLoanUrl(entry);
    const interestRateText = entry.interestRate > 0
      ? entry.interestRateDisplay.english
      : "Check official website";
    const processingFee = verified && !/check official website/i.test(entry.processingFee.english)
      ? entry.processingFee.english
      : null;

    return {
      bankId: entry.bankId,
      bankName: entry.bankName,
      bankCategory: BANK_CATEGORY_BY_ID[entry.bankId] || "Unknown",
      loanType: entry.loanType,
      loanTypeLabel: entry.loanTypeLabel,
      interestRateText,
      numericRate: entry.interestRate > 0 ? entry.interestRate : null,
      processingFee,
      officialApplyLink: verified ? entry.officialWebsite : null,
      officialReferenceLink: verified ? entry.officialWebsite : null,
      verified,
      documentsRequired: entry.documentsRequired.english || [],
      eligibility: entry.eligibility.english ? [entry.eligibility.english] : [],
      howToApply: entry.howToApply.english ? [entry.howToApply.english] : [],
      benefits: entry.benefits.english || [],
      repaymentPeriod: verified ? entry.repaymentPeriod.english || null : null,
      interestRateDisplay: entry.interestRateDisplay,
      processingFeeByLang: entry.processingFee,
      repaymentPeriodByLang: entry.repaymentPeriod,
      documentsRequiredByLang: entry.documentsRequired,
      eligibilityByLang: entry.eligibility,
      howToApplyByLang: entry.howToApply,
      benefitsByLang: entry.benefits,
      safetyNote: entry.safetyNote.english || "",
      safetyNoteByLang: entry.safetyNote,
    };
  });

export function getSortedLoanComparison(loanType: string): NormalizedLoanComparisonEntry[] {
  const selectedLoanType = normalizeLoanType(loanType);
  const filteredResults = LOAN_COMPARISON_DATA.filter(
    (item) => item.loanType.toLowerCase() === selectedLoanType
  );
  return [...filteredResults].sort((a, b) => {
    if (a.numericRate === null && b.numericRate === null) return 0;
    if (a.numericRate === null) return 1;
    if (b.numericRate === null) return -1;
    return a.numericRate - b.numericRate;
  });
}
