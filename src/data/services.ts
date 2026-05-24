import type { AppLanguage } from "@/lib/i18n";
import { getOfficialLink, isVerifiedOfficialUrl } from "./officialLinks";

export type ServiceCategory = "post_office" | "insurance";

export type LocalizedText = Partial<Record<AppLanguage, string>> & { english: string };

export interface ServiceAction {
  id: string;
  label: LocalizedText;
  url: string;
}

export interface FinanceService {
  id: string;
  name: LocalizedText;
  category: ServiceCategory;
  description: LocalizedText;
  officialUrl: string;
  officialWebsite: string;
  verified: boolean;
  verifiedFallbackUrl?: string;
  keywords: string[];
  icon: string;
  logoDomain?: string;
  iconName: string;
  accent: string;
  isFavorite: boolean;
  isActive: boolean;
  sourceAuthority: "official";
  trustedDomains: string[];
  actions: ServiceAction[];
}

export function getServiceName(service: FinanceService, lang: AppLanguage | string) {
  return service.name[lang as AppLanguage] || service.name.english;
}

export function getServiceDescription(service: FinanceService, lang: AppLanguage | string) {
  return service.description[lang as AppLanguage] || service.description.english;
}

// Dynamically fetch URLs from officialLinks.ts
const postOfficeUrl = (id: string) => getOfficialLink("postOffice", id) || "";
const insuranceUrl = (id: string) => getOfficialLink("insurance", id) || "";

const RAW_SERVICES_DATA: Omit<FinanceService, "officialWebsite" | "verified">[] = [
  // ==================== POST OFFICE SERVICES (13 Services) ====================
  {
    id: "india-post",
    name: {
      english: "India Post",
      hindi: "इंडिया पोस्ट",
      telugu: "ఇండియా పోస్ట్",
    },
    category: "post_office",
    description: {
      english: "Official postal services, booking, and citizen amenities.",
      hindi: "आधिकारिक डाक सेवाएं, बुकिंग और नागरिक सुविधाएं।",
      telugu: "అధికారిక పోస్టల్ సేవలు, బుకింగ్ మరియు పౌర సేవలు.",
    },
    officialUrl: postOfficeUrl("india-post"),
    keywords: ["post", "postal", "speed post", "tracking", "booking", "citizen services"],
    icon: "post-office",
    logoDomain: "indiapost.gov.in",
    iconName: "Mail",
    accent: "from-red-600 to-amber-600",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["indiapost.gov.in"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open India Post Official Website",
          hindi: "इंडिया पोस्ट आधिकारिक वेबसाइट खोलें",
          telugu: "ఇండియా పోస్ట్ అధికారిక వెబ్సైట్ తెరవండి",
        },
        url: postOfficeUrl("india-post"),
      },
    ],
  },
  {
    id: "ippb",
    name: {
      english: "India Post Payments Bank",
      hindi: "इंडिया पोस्ट पेमेंट्स बैंक",
      telugu: "ఇండియా పోస్ట్ పేమెంట్స్ బ్యాంక్",
    },
    category: "post_office",
    description: {
      english: "Digital banking services with seamless post office integration.",
      hindi: "निर्बाध डाकघर एकीकरण के साथ डिजिटल बैंकिंग सेवाएं।",
      telugu: "పోస్టాఫీస్ అనుసంధానంతో డిజిటల్ బ్యాంకింగ్ సేవలు.",
    },
    officialUrl: postOfficeUrl("ippb"),
    keywords: ["ippb", "payments bank", "digital banking", "post bank"],
    icon: "payments-bank",
    logoDomain: "ippbonline.com",
    iconName: "CreditCard",
    accent: "from-blue-600 to-indigo-800",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["ippbonline.com"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open IPPB Official Website",
          hindi: "आईपीपीबी आधिकारिक वेबसाइट खोलें",
          telugu: "IPPB అధికారిక వెబ్సైట్ తెరవండి",
        },
        url: postOfficeUrl("ippb"),
      },
    ],
  },
  {
    id: "post-office-savings-account",
    name: {
      english: "Post Office Savings Account",
      hindi: "डाकघर बचत खाता",
      telugu: "పోస్టాఫీస్ సేవింగ్స్ అకౌంట్",
    },
    category: "post_office",
    description: {
      english: "Secure and trusted savings account with decent interest rates.",
      hindi: "अच्छी ब्याज दरों के साथ सुरक्षित और भरोसेमंद बचत खाता।",
      telugu: "మంచి వడ్డీ రేట్లతో సురక్షితమైన మరియు నమ్మకమైన పొదుపు ఖాతా.",
    },
    officialUrl: postOfficeUrl("post-office-savings-account"),
    keywords: ["savings", "savings account", "posa", "deposit"],
    icon: "savings",
    logoDomain: "indiapost.gov.in",
    iconName: "PiggyBank",
    accent: "from-teal-600 to-emerald-800",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["indiapost.gov.in"],
    actions: [
      {
        id: "savings-schemes",
        label: {
          english: "View Savings Account Details",
          hindi: "बचत खाता विवरण देखें",
          telugu: "సేవింగ్స్ అకౌంట్ వివరాలు చూడండి",
        },
        url: postOfficeUrl("post-office-savings-account"),
      },
    ],
  },
  {
    id: "recurring-deposit",
    name: {
      english: "Recurring Deposit",
      hindi: "आवर्ती जमा (आरडी)",
      telugu: "రికరింగ్ డిపాజిట్",
    },
    category: "post_office",
    description: {
      english: "5-Year Post Office Recurring Deposit (RD) for disciplined savings.",
      hindi: "अनुशासित बचत के लिए 5-वर्षीय डाकघर आवर्ती जमा (आरडी) योजना।",
      telugu: "క్రమశిక్షణతో కూడిన పొదుపు కోసం 5 సంవత్సరాల రికరింగ్ డిపాజిట్.",
    },
    officialUrl: postOfficeUrl("recurring-deposit"),
    keywords: ["rd", "recurring deposit", "savings", "small savings"],
    icon: "rd",
    logoDomain: "indiapost.gov.in",
    iconName: "PiggyBank",
    accent: "from-orange-600 to-red-800",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["indiapost.gov.in"],
    actions: [
      {
        id: "rd-info",
        label: {
          english: "View RD Scheme Details",
          hindi: "आरडी योजना विवरण देखें",
          telugu: "RD పథకం వివరాలు చూడండి",
        },
        url: postOfficeUrl("recurring-deposit"),
      },
    ],
  },
  {
    id: "monthly-income-scheme",
    name: {
      english: "Monthly Income Scheme",
      hindi: "मासिक आय योजना (एमआईएस)",
      telugu: "మంత్లీ ఇన్కమ్ స్కీమ్",
    },
    category: "post_office",
    description: {
      english: "Get guaranteed monthly interest payouts on your one-time investment.",
      hindi: "एकमुश्त निवेश पर गारंटीकृत मासिक ब्याज भुगतान प्राप्त करें।",
      telugu: "మీ ఒకే ఒక పెట్టుబడిపై గ్యారెంటీ నెలవారీ వడ్డీ చెల్లింపులను పొందండి.",
    },
    officialUrl: postOfficeUrl("monthly-income-scheme"),
    keywords: ["mis", "monthly income", "scheme", "investment"],
    icon: "mis",
    logoDomain: "indiapost.gov.in",
    iconName: "Wallet",
    accent: "from-sky-600 to-blue-800",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["indiapost.gov.in"],
    actions: [
      {
        id: "mis-info",
        label: {
          english: "View MIS Scheme Details",
          hindi: "एमआईएस योजना विवरण देखें",
          telugu: "MIS పథకం వివరాలు చూడండి",
        },
        url: postOfficeUrl("monthly-income-scheme"),
      },
    ],
  },
  {
    id: "senior-citizen-savings-scheme",
    name: {
      english: "Senior Citizen Savings Scheme",
      hindi: "वरिष्ठ नागरिक बचत योजना (एससीएसएस)",
      telugu: "సీనియర్ సిటిజన్ సేవింగ్స్ స్కీమ్",
    },
    category: "post_office",
    description: {
      english: "Secure and high-yielding investment scheme for senior citizens.",
      hindi: "वरिष्ठ नागरिकों के लिए सुरक्षित और उच्च रिटर्न वाली निवेश योजना।",
      telugu: "సీనియర్ సిటిజన్ల కోసం సురక్షితమైన మరియు ఎక్కువ లాభదాయకమైన పొదుపు పథకం.",
    },
    officialUrl: postOfficeUrl("senior-citizen-savings-scheme"),
    keywords: ["scss", "senior citizen", "savings", "retirement"],
    icon: "scss",
    logoDomain: "indiapost.gov.in",
    iconName: "Globe",
    accent: "from-emerald-600 to-teal-900",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["indiapost.gov.in"],
    actions: [
      {
        id: "scss-info",
        label: {
          english: "View SCSS Details",
          hindi: "एससीएसएस विवरण देखें",
          telugu: "SCSS వివరాలు చూడండి",
        },
        url: postOfficeUrl("senior-citizen-savings-scheme"),
      },
    ],
  },
  {
    id: "public-provident-fund",
    name: {
      english: "Public Provident Fund",
      hindi: "सार्वजनिक भविष्य निधि (पीपीएफ)",
      telugu: "పబ్లిక్ ప్రావిడెంట్ ఫండ్",
    },
    category: "post_office",
    description: {
      english: "Tax-free interest and excellent long-term savings security.",
      hindi: "कर-मुक्त ब्याज और उत्कृष्ट दीर्घकालिक बचत सुरक्षा।",
      telugu: "పన్ను రహిత వడ్డీ మరియు అద్భుతమైన దీర్ఘకాలిక పొదుపు భద్రత.",
    },
    officialUrl: postOfficeUrl("public-provident-fund"),
    keywords: ["ppf", "provident fund", "tax savings", "investment"],
    icon: "ppf",
    logoDomain: "indiapost.gov.in",
    iconName: "MapPin",
    accent: "from-indigo-600 to-purple-800",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["indiapost.gov.in"],
    actions: [
      {
        id: "ppf-info",
        label: {
          english: "View PPF Scheme Details",
          hindi: "पीपीएफ योजना विवरण देखें",
          telugu: "PPF పథకం వివరాలు చూడండి",
        },
        url: postOfficeUrl("public-provident-fund"),
      },
    ],
  },
  {
    id: "sukanya-samriddhi-yojana",
    name: {
      english: "Sukanya Samriddhi Yojana",
      hindi: "सुकन्या समृद्धि योजना (एसएसवाई)",
      telugu: "సుకన్య సమృద్ధి యోజన",
    },
    category: "post_office",
    description: {
      english: "A high-interest savings scheme dedicated to the empowerment of girl children.",
      hindi: "बालिकाओं के सशक्तीकरण के लिए समर्पित उच्च ब्याज बचत योजना।",
      telugu: "బాలికల సాధికారత కోసం ఉద్దేశించిన అధిక వడ్డీ పొదుపు పథకం.",
    },
    officialUrl: postOfficeUrl("sukanya-samriddhi-yojana"),
    keywords: ["ssy", "sukanya samriddhi", "girl child", "savings"],
    icon: "ssy",
    logoDomain: "indiapost.gov.in",
    iconName: "HeartHandshake",
    accent: "from-fuchsia-600 to-pink-800",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["indiapost.gov.in"],
    actions: [
      {
        id: "ssy-info",
        label: {
          english: "View SSY Scheme Details",
          hindi: "एसएसवाई योजना विवरण देखें",
          telugu: "SSY పథకం వివరాలు చూడండి",
        },
        url: postOfficeUrl("sukanya-samriddhi-yojana"),
      },
    ],
  },
  {
    id: "national-savings-certificate",
    name: {
      english: "National Savings Certificate",
      hindi: "राष्ट्रीय बचत प्रमाणपत्र (एनएससी)",
      telugu: "నేషనల్ సేవింగ్స్ సర్టిఫికేట్",
    },
    category: "post_office",
    description: {
      english: "Guaranteed tax-saving investment instrument for mid-term needs.",
      hindi: "मध्यम अवधि की जरूरतों के लिए गारंटीकृत कर-बचत निवेश साधन।",
      telugu: "మధ్యకాలిక అవసరాల కోసం హామీ ఇవ్వబడిన పన్ను ఆదా పెట్టుబడి సాధనం.",
    },
    officialUrl: postOfficeUrl("national-savings-certificate"),
    keywords: ["nsc", "national savings certificate", "tax savings", "investment"],
    icon: "nsc",
    logoDomain: "indiapost.gov.in",
    iconName: "Award",
    accent: "from-cyan-600 to-teal-800",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["indiapost.gov.in"],
    actions: [
      {
        id: "nsc-info",
        label: {
          english: "View NSC Details",
          hindi: "एनएससी विवरण देखें",
          telugu: "NSC వివరాలు చూడండి",
        },
        url: postOfficeUrl("national-savings-certificate"),
      },
    ],
  },
  {
    id: "kisan-vikas-patra",
    name: {
      english: "Kisan Vikas Patra",
      hindi: "किसान विकास पत्र (केवीपी)",
      telugu: "కిసాన్ వికాస్ పత్ర",
    },
    category: "post_office",
    description: {
      english: "A risk-free investment scheme that doubles your capital over a fixed period.",
      hindi: "एक जोखिम-मुक्त निवेश योजना जो निश्चित अवधि में आपकी पूंजी को दोगुना करती है।",
      telugu: "ఒక నిర్ణీత కాలంలో మీ పెట్టుబడిని రెట్టింపు చేసే సురక్షితమైన పొదుపు పథకం.",
    },
    officialUrl: postOfficeUrl("kisan-vikas-patra"),
    keywords: ["kvp", "kisan vikas patra", "double investment", "savings"],
    icon: "kvp",
    logoDomain: "indiapost.gov.in",
    iconName: "Activity",
    accent: "from-green-600 to-emerald-800",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["indiapost.gov.in"],
    actions: [
      {
        id: "kvp-info",
        label: {
          english: "View KVP Details",
          hindi: "केवीपी विवरण देखें",
          telugu: "KVP వివరాలు చూడండి",
        },
        url: postOfficeUrl("kisan-vikas-patra"),
      },
    ],
  },
  {
    id: "speed-post-tracking",
    name: {
      english: "Speed Post Tracking",
      hindi: "स्पीड पोस्ट ट्रैकिंग",
      telugu: "స్పీడ్ పోస్ట్ ట్రాకింగ్",
    },
    category: "post_office",
    description: {
      english: "Official consignment tracking for letters, parcels, and posts.",
      hindi: "पत्रों, पार्सल और पोस्ट के लिए आधिकारिक कंसाइनमेंट ट्रैकिंग।",
      telugu: "లేఖలు, పార్సెల్స్ మరియు పోస్ట్‌ల కోసం అధికారిక ట్రాకింగ్ సేవ.",
    },
    officialUrl: postOfficeUrl("speed-post-tracking"),
    keywords: ["tracking", "speed post", "registered post", "consignment"],
    icon: "tracking",
    logoDomain: "indiapost.gov.in",
    iconName: "MapPin",
    accent: "from-orange-500 to-red-700",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["indiapost.gov.in"],
    actions: [
      {
        id: "track-consignment",
        label: {
          english: "Track Consignment Now",
          hindi: "अभी कंसाइनमेंट ट्रैक करें",
          telugu: "ఇప్పుడే కన్సైన్మెంట్ ట్రాక్ చేయండి",
        },
        url: postOfficeUrl("speed-post-tracking"),
      },
    ],
  },
  {
    id: "postal-life-insurance",
    name: {
      english: "Postal Life Insurance",
      hindi: "डाक जीवन बीमा (पीएलआई)",
      telugu: "పోస్టల్ లైఫ్ ఇన్సూరెన్స్",
    },
    category: "post_office",
    description: {
      english: "High bonus rates and low premiums for government and semi-government employees.",
      hindi: "सरकारी और अर्ध-सरकारी कर्मचारियों के लिए उच्च बोनस दरें और कम प्रीमियम।",
      telugu: "ప్రభుత్వ మరియు ప్రభుత్వ రంగ సంస్థల ఉద్యోగుల కోసం తక్కువ ప్రీమియం, ఎక్కువ బోనస్ భీమా పథకం.",
    },
    officialUrl: postOfficeUrl("postal-life-insurance"),
    keywords: ["pli", "postal life", "insurance", "life insurance"],
    icon: "pli",
    logoDomain: "pli.indiapost.gov.in",
    iconName: "Shield",
    accent: "from-purple-700 to-indigo-900",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["pli.indiapost.gov.in"],
    actions: [
      {
        id: "pli-portal",
        label: {
          english: "Open PLI Portal",
          hindi: "पीएलआई पोर्टल खोलें",
          telugu: "PLI పోర్టల్ తెరవండి",
        },
        url: postOfficeUrl("postal-life-insurance"),
      },
    ],
  },
  {
    id: "rural-postal-life-insurance",
    name: {
      english: "Rural Postal Life Insurance",
      hindi: "ग्रामीण डाक जीवन बीमा (आरपीएलआई)",
      telugu: "రూరల్ పోస్టల్ లైఫ్ ఇన్సూరెన్స్",
    },
    category: "post_office",
    description: {
      english: "Affordable life insurance coverage for citizens residing in rural India.",
      hindi: "ग्रामीण भारत में रहने वाले नागरिकों के लिए वहनीय जीवन बीमा कवरेज।",
      telugu: "గ్రామీణ ప్రాంతాల పౌరుల కోసం అందుబాటు ధరలో ఉండే లైఫ్ ఇన్సూరెన్స్ పథకం.",
    },
    officialUrl: postOfficeUrl("rural-postal-life-insurance"),
    keywords: ["rpli", "rural postal", "insurance", "rural insurance"],
    icon: "rpli",
    logoDomain: "pli.indiapost.gov.in",
    iconName: "Home",
    accent: "from-lime-600 to-green-800",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["pli.indiapost.gov.in"],
    actions: [
      {
        id: "rpli-portal",
        label: {
          english: "Open RPLI Portal",
          hindi: "आरपीएलआई पोर्टल खोलें",
          telugu: "RPLI పోర్టల్ తెరవండి",
        },
        url: postOfficeUrl("rural-postal-life-insurance"),
      },
    ],
  },

  // ==================== INSURANCE SERVICES (14 Services) ====================
  {
    id: "lic",
    name: {
      english: "LIC",
      hindi: "एलआईसी (भारतीय जीवन बीमा निगम)",
      telugu: "ఎల్ ఐ సి",
    },
    category: "insurance",
    description: {
      english: "Life Insurance Corporation of India - India's premier life insurer.",
      hindi: "भारतीय जीवन बीमा निगम - भारत का प्रमुख जीवन बीमा प्रदाता।",
      telugu: "లైఫ్ ఇన్సూరెన్స్ కార్పొరేషన్ ఆఫ్ ఇండియా - దేశంలోనే అతిపెద్ద ప్రభుత్వ రంగ భీమా సంస్థ.",
    },
    officialUrl: insuranceUrl("lic"),
    keywords: ["lic", "life insurance", "policy", "premium", "claim"],
    icon: "insurance-shield",
    logoDomain: "licindia.in",
    iconName: "Shield",
    accent: "from-yellow-500 to-amber-700",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["licindia.in"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open LIC Official Website",
          hindi: "एलआईसी आधिकारिक वेबसाइट खोलें",
          telugu: "ఎల్ ఐ సి అధికారిక వెబ్సైట్ తెరవండి",
        },
        url: insuranceUrl("lic"),
      },
    ],
  },
  {
    id: "sbi-life",
    name: {
      english: "SBI Life Insurance",
      hindi: "एसबीआई लाइफ इंश्योरेंस",
      telugu: "SBI లైఫ్ ఇన్సూరెన్స్",
    },
    category: "insurance",
    description: {
      english: "A leading private life insurance company backed by SBI.",
      hindi: "एसबीआई द्वारा समर्थित एक प्रमुख निजी जीवन बीमा कंपनी।",
      telugu: "SBI గ్రూప్ భాగస్వామ్యంతో కూడిన ఒక ప్రముఖ ప్రైవేట్ లైఫ్ ఇన్సూరెన్స్ సంస్థ.",
    },
    officialUrl: insuranceUrl("sbi-life"),
    keywords: ["sbi life", "life insurance", "term plan", "sbi group"],
    icon: "insurance",
    logoDomain: "sbilife.co.in",
    iconName: "Activity",
    accent: "from-blue-600 to-sky-700",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["sbilife.co.in"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open SBI Life Website",
          hindi: "एसबीआई लाइफ वेबसाइट खोलें",
          telugu: "SBI లైఫ్ వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("sbi-life"),
      },
    ],
  },
  {
    id: "hdfc-life",
    name: {
      english: "HDFC Life",
      hindi: "एचडीएफसी लाइफ",
      telugu: "HDFC లైఫ్",
    },
    category: "insurance",
    description: {
      english: "Award-winning long-term life insurance solutions provider.",
      hindi: "पुरस्कार विजेता दीर्घकालिक जीवन बीमा समाधान प्रदाता।",
      telugu: "అత్యుత్తమ దీర్ఘకాలిక లైఫ్ ఇన్సూరెన్స్ పరిష్కారాల ప్రదాత.",
    },
    officialUrl: insuranceUrl("hdfc-life"),
    keywords: ["hdfc life", "life insurance", "savings", "term plan"],
    icon: "insurance",
    logoDomain: "hdfclife.com",
    iconName: "Shield",
    accent: "from-red-600 to-rose-800",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["hdfclife.com"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open HDFC Life Website",
          hindi: "एचडीएफसी लाइफ वेबसाइट खोलें",
          telugu: "HDFC లైఫ్ వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("hdfc-life"),
      },
    ],
  },
  {
    id: "icici-prudential-life",
    name: {
      english: "ICICI Prudential Life",
      hindi: "आईसीआईसीआई प्रूडेंशियल लाइफ",
      telugu: "ICICI ప్రుడెన్షియల్ లైఫ్",
    },
    category: "insurance",
    description: {
      english: "Excellent term insurance, savings, and retirement investment plans.",
      hindi: "उत्कृष्ट टर्म इंश्योरेंस, बचत और सेवानिवृत्ति निवेश योजनाएं।",
      telugu: "అద్భుతమైన టర్మ్ ఇన్సూరెన్స్, పొదుపు మరియు రిటైర్మెంట్ పెట్టుబడి పథకాలు.",
    },
    officialUrl: insuranceUrl("icici-prudential-life"),
    keywords: ["icici prudential", "pru life", "term insurance", "pension"],
    icon: "insurance",
    logoDomain: "iciciprulife.com",
    iconName: "Globe",
    accent: "from-orange-500 to-amber-700",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["iciciprulife.com"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open ICICI Pru Website",
          hindi: "आईसीआईसीआई प्रू वेबसाइट खोलें",
          telugu: "ICICI ప్రు వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("icici-prudential-life"),
      },
    ],
  },
  {
    id: "max-life",
    name: {
      english: "Max Life Insurance",
      hindi: "मैक्स लाइफ इंश्योरेंस",
      telugu: "మాక్స్ లైఫ్ ఇన్సూరెన్స్",
    },
    category: "insurance",
    description: {
      english: "One of India's most trusted private life insurance companies.",
      hindi: "भारत की सबसे भरोसेमंद निजी जीवन बीमा कंपनियों में से एक।",
      telugu: "భారతదేశంలో అత్యంత విశ్వసనీయమైన ప్రైవేట్ లైఫ్ ఇన్సూరెన్స్ కంపెనీలలో ఒకటి.",
    },
    officialUrl: insuranceUrl("max-life"),
    keywords: ["max life", "life insurance", "claims", "term life"],
    icon: "insurance",
    logoDomain: "maxlifeinsurance.com",
    iconName: "Award",
    accent: "from-sky-700 to-blue-900",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["maxlifeinsurance.com"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open Max Life Website",
          hindi: "मैक्स लाइफ वेबसाइट खोलें",
          telugu: "మాక్స్ లైఫ్ వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("max-life"),
      },
    ],
  },
  {
    id: "bajaj-allianz-life",
    name: {
      english: "Bajaj Allianz Life",
      hindi: "बजाज आलियांज लाइफ",
      telugu: "బజాజ్ అలయన్స్ లైఫ్",
    },
    category: "insurance",
    description: {
      english: "Innovative investment plans and high-performance life insurance schemes.",
      hindi: "अभिनव निवेश योजनाएं और उच्च प्रदर्शन वाली जीवन बीमा योजनाएं।",
      telugu: "నూతన ఇన్వెస్ట్‌మెంట్ ప్లాన్లు మరియు అత్యుత్తమ లైఫ్ ఇన్సూరెన్స్ పథకాలు.",
    },
    officialUrl: insuranceUrl("bajaj-allianz-life"),
    keywords: ["bajaj allianz", "life insurance", "investments", "ulip"],
    icon: "insurance",
    logoDomain: "bajajallianzlife.com",
    iconName: "Activity",
    accent: "from-blue-700 to-indigo-900",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["bajajallianzlife.com"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open Bajaj Allianz Website",
          hindi: "बजाज आलियांज वेबसाइट खोलें",
          telugu: "బజాజ్ అలయన్స్ వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("bajaj-allianz-life"),
      },
    ],
  },
  {
    id: "tata-aia-life",
    name: {
      english: "Tata AIA Life",
      hindi: "टाटा एआईए लाइफ",
      telugu: "టాటా ఏఐఏ లైఫ్",
    },
    category: "insurance",
    description: {
      english: "Robust and values-driven life insurance coverage from the House of Tata.",
      hindi: "टाटा समूह से मजबूत और मूल्यों पर आधारित जीवन बीमा कवरेज।",
      telugu: "టాటా సంస్థ నుండి విలువలతో కూడిన అత్యంత నమ్మకమైన లైఫ్ ఇన్సూరెన్స్ రక్షణ.",
    },
    officialUrl: insuranceUrl("tata-aia-life"),
    keywords: ["tata aia", "life insurance", "wealth", "term protection"],
    icon: "insurance",
    logoDomain: "tataaia.com",
    iconName: "Shield",
    accent: "from-red-700 to-slate-900",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["tataaia.com"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open Tata AIA Website",
          hindi: "टाटा एआईए वेबसाइट खोलें",
          telugu: "టాటా ఏఐఏ వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("tata-aia-life"),
      },
    ],
  },
  {
    id: "star-health",
    name: {
      english: "Star Health Insurance",
      hindi: "स्टार हेल्थ इंश्योरेंस",
      telugu: "స్టార్ హెల్త్ ఇన్సూరెన్స్",
    },
    category: "insurance",
    description: {
      english: "India's first standalone health insurance provider with excellent claim settlements.",
      hindi: "उत्कृष्ट दावा निपटान के साथ भारत का पहला स्टैंडअलोन स्वास्थ्य बीमा प्रदाता।",
      telugu: "అత్యుత్తమ క్లెయిమ్ సెటిల్‌మెంట్లతో కూడిన దేశంలోనే మొట్టమొదటి హెల్త్ ఇన్సూరెన్స్ సంస్థ.",
    },
    officialUrl: insuranceUrl("star-health"),
    keywords: ["star health", "health insurance", "medical", "hospitalization"],
    icon: "health-shield",
    logoDomain: "starhealth.in",
    iconName: "Shield",
    accent: "from-blue-500 to-cyan-700",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["starhealth.in"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open Star Health Website",
          hindi: "स्टार हेल्थ वेबसाइट खोलें",
          telugu: "స్టార్ హెల్త్ వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("star-health"),
      },
    ],
  },
  {
    id: "niva-bupa-health",
    name: {
      english: "Niva Bupa Health Insurance",
      hindi: "निवा बूपा हेल्थ इंश्योरेंस",
      telugu: "నివా బూపా హెల్త్ ఇన్సూరెన్స్",
    },
    category: "insurance",
    description: {
      english: "Comprehensive medical cover, health plans, and digital support.",
      hindi: "व्यापक चिकित्सा कवर, स्वास्थ्य योजनाएं और डिजिटल सहायता।",
      telugu: "సమగ్ర వైద్య రక్షణ, ఆరోగ్య ప్రణాళికలు మరియు డిజిటల్ సపోర్ట్.",
    },
    officialUrl: insuranceUrl("niva-bupa-health"),
    keywords: ["niva bupa", "health insurance", "max bupa", "mediclaim"],
    icon: "health-shield",
    logoDomain: "nivabupa.com",
    iconName: "Activity",
    accent: "from-cyan-600 to-indigo-800",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["nivabupa.com"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open Niva Bupa Website",
          hindi: "निवा बूपा वेबसाइट खोलें",
          telugu: "నివా బూపా వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("niva-bupa-health"),
      },
    ],
  },
  {
    id: "care-health",
    name: {
      english: "Care Health Insurance",
      hindi: "केयर हेल्थ इंश्योरेंस",
      telugu: "కేర్ హెల్త్ ఇన్సూరెన్స్",
    },
    category: "insurance",
    description: {
      english: "Customer-centric health insurance with seamless cashless treatment features.",
      hindi: "निर्बाध कैशलेस उपचार सुविधाओं के साथ ग्राहक-केंद्रित स्वास्थ्य बीमा।",
      telugu: "క్యాష్‌లెస్ వైద్య చికిత్సలతో కూడిన వినియోగదారులకు అనుకూలమైన హెల్త్ ఇన్సూరెన్స్.",
    },
    officialUrl: insuranceUrl("care-health"),
    keywords: ["care health", "relicare", "cashless health", "medical cover"],
    icon: "health-shield",
    logoDomain: "careinsurance.com",
    iconName: "HeartHandshake",
    accent: "from-teal-600 to-green-800",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["careinsurance.com"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open Care Health Website",
          hindi: "केयर हेल्थ वेबसाइट खोलें",
          telugu: "కేర్ హెల్త్ వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("care-health"),
      },
    ],
  },
  {
    id: "new-india-assurance",
    name: {
      english: "New India Assurance",
      hindi: "न्यू इंडिया एश्योरेंस",
      telugu: "న్యూ ఇండియా అస్యూరెన్స్",
    },
    category: "insurance",
    description: {
      english: "Multinational general insurance company owned by the Government of India.",
      hindi: "भारत सरकार के स्वामित्व वाली बहुराष्ट्रीय सामान्य बीमा कंपनी।",
      telugu: "భారత ప్రభుత్వ యాజమాన్యంలో నడిచే అతిపెద్ద జనరల్ ఇన్సూరెన్స్ సంస్థ.",
    },
    officialUrl: insuranceUrl("new-india-assurance"),
    keywords: ["new india", "nia", "general insurance", "government insurance"],
    icon: "general-insurance",
    logoDomain: "newindia.co.in",
    iconName: "Award",
    accent: "from-sky-700 to-indigo-900",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["newindia.co.in"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open New India Website",
          hindi: "न्यू इंडिया वेबसाइट खोलें",
          telugu: "న్యూ ఇండియా వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("new-india-assurance"),
      },
    ],
  },
  {
    id: "oriental-insurance",
    name: {
      english: "Oriental Insurance",
      hindi: "ओरिएंटल इंश्योरेंस",
      telugu: "ఓరియంటల్ ఇన్సూరెన్స్",
    },
    category: "insurance",
    description: {
      english: "Highly reliable public sector general insurance enterprise.",
      hindi: "अत्यधिक विश्वसनीय सार्वजनिक क्षेत्र का सामान्य बीमा उद्यम।",
      telugu: "అత్యంత విశ్వసనీయమైన ప్రభుత్వ రంగ జనరल ఇన్సూరెన్స్ సంస్థ.",
    },
    officialUrl: insuranceUrl("oriental-insurance"),
    keywords: ["oriental insurance", "oic", "general insurance", "public sector"],
    icon: "general-insurance",
    logoDomain: "orientalinsurance.org.in",
    iconName: "Shield",
    accent: "from-amber-600 to-orange-850",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["orientalinsurance.org.in"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open Oriental Insurance Website",
          hindi: "ओरिएंटल इंश्योरेंस वेबसाइट खोलें",
          telugu: "ఓరియంటల్ ఇన్సూరెన్స్ వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("oriental-insurance"),
      },
    ],
  },
  {
    id: "united-india-insurance",
    name: {
      english: "United India Insurance",
      hindi: "यूनाइटेड इंडिया इंश्योरेंस",
      telugu: "యునైటెడ్ ఇండియా ఇన్సూరెన్స్",
    },
    category: "insurance",
    description: {
      english: "Leading public sector non-life insurer serving millions of customers.",
      hindi: "लाखों ग्राहकों की सेवा करने वाला अग्रणी सार्वजनिक क्षेत्र का गैर-जीवन बीमाकर्ता।",
      telugu: "కోట్లాది వినియోగదారులకు సేవలందిస్తోన్న ప్రముఖ ప్రభుత్వ రంగ జనరల్ ఇన్సూరెన్స్ సంస్థ.",
    },
    officialUrl: insuranceUrl("united-india-insurance"),
    keywords: ["united india", "uiic", "non life insurance", "general insurance"],
    icon: "general-insurance",
    logoDomain: "uiic.co.in",
    iconName: "Home",
    accent: "from-violet-700 to-purple-900",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["uiic.co.in"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open United India Website",
          hindi: "यूनाइटेड इंडिया वेबसाइट खोलें",
          telugu: "యునైటెడ్ ఇండియా వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("united-india-insurance"),
      },
    ],
  },
  {
    id: "national-insurance",
    name: {
      english: "National Insurance Company",
      hindi: "नेशनल इंश्योरेंस कंपनी",
      telugu: "నేషనల్ ఇన్సూరెన్స్ కంపెనీ",
    },
    category: "insurance",
    description: {
      english: "India's oldest public sector general insurance giant.",
      hindi: "भारत की सबसे पुरानी सार्वजनिक क्षेत्र की सामान्य बीमा दिग्गज कंपनी।",
      telugu: "భారతదేశంలోనే అత్యంత పురాతన ప్రభుత్వ రంగ జనరల్ ఇన్సూరెన్స్ సంస్థ.",
    },
    officialUrl: insuranceUrl("national-insurance"),
    keywords: ["national insurance", "nic", "general insurance", "oldest insurer"],
    icon: "general-insurance",
    logoDomain: "nationalinsurance.nic.co.in",
    iconName: "Globe",
    accent: "from-emerald-700 to-teal-900",
    isFavorite: false,
    isActive: true,
    sourceAuthority: "official",
    trustedDomains: ["nationalinsurance.nic.co.in"],
    actions: [
      {
        id: "official-website",
        label: {
          english: "Open National Insurance Website",
          hindi: "नेशनल इंश्योरेंस वेबसाइट खोलें",
          telugu: "నేషనల్ ఇన్సూరెన్స్ వెబ్‌సైట్ తెరవండి",
        },
        url: insuranceUrl("national-insurance"),
      },
    ],
  },
];

export const SERVICES_DATA: FinanceService[] = RAW_SERVICES_DATA.map((service) => {
  const officialWebsite = service.officialUrl || "";
  const verified = isVerifiedOfficialUrl(officialWebsite);

  return {
    ...service,
    officialWebsite,
    verified,
  };
});
