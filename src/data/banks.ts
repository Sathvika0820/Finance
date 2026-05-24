import { getOfficialLink } from "./officialLinks";

export type BankCategory =
  | "Public Sector"
  | "Private Sector"
  | "Small Finance"
  | "Payments"
  | "Regional Rural"
  | "Co-operative";

export interface Bank {
  id: string;
  name: string;
  shortName: string;
  names: {
    english: string;
    hindi: string;
    telugu: string;
  };
  category: BankCategory;
  website: string;
  officialWebsite: string;
  officialWebsiteUrl: string;
  fallbackSearchUrl: string;
  appLink: string;
  verified: boolean;
  description: string;
  services: string[];
  accent: string;
  /** Domain used to fetch the official logo via clearbit */
  logoDomain: string;
}

export const CATEGORIES: BankCategory[] = [
  "Public Sector",
  "Private Sector",
  "Small Finance",
  "Payments",
  "Regional Rural",
  "Co-operative",
];

const accents = [
  "from-slate-700 to-slate-900",
  "from-blue-700 to-indigo-900",
  "from-rose-700 to-rose-900",
  "from-amber-700 to-orange-900",
  "from-emerald-700 to-teal-900",
  "from-violet-700 to-purple-900",
  "from-red-700 to-red-900",
  "from-cyan-700 to-sky-900",
  "from-fuchsia-700 to-pink-900",
];

function bank(
  id: string,
  name: string,
  shortName: string,
  category: BankCategory,
  website: string,
  logoDomain: string,
  description: string,
  names: Partial<{ english: string; hindi: string; telugu: string }> = {},
  services: string[] = ["Savings", "Loans", "Cards", "Mobile Banking"],
): Bank {
  const idx = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % accents.length;
  const officialWebsite = getOfficialLink("banks", id) || "";
  const verified = officialWebsite.startsWith("https://");
  return {
    id,
    name,
    shortName,
    names: {
      english: names.english || name,
      hindi: names.hindi || name,
      telugu: names.telugu || name,
    },
    category,
    website: officialWebsite,
    officialWebsite,
    officialWebsiteUrl: officialWebsite,
    fallbackSearchUrl: "",
    appLink: officialWebsite,
    verified,
    description,
    services,
    accent: accents[idx],
    logoDomain,
  };
}

export const BANKS: Bank[] = [
  // Public Sector
  bank("sbi", "State Bank of India", "SBI", "Public Sector", "https://sbi.co.in", "sbi.co.in", "India's largest public sector bank.", { hindi: "एसबीआई", telugu: "ఎస్ బీ ఐ" }),
  bank("bob", "Bank of Baroda", "BoB", "Public Sector", "https://www.bankofbaroda.in", "bankofbaroda.in", "Leading public sector bank.", { hindi: "बैंक ऑफ बड़ौदा", telugu: "బ్యాంక్ ఆఫ్ బరోడా" }),
  bank("boi", "Bank of India", "BoI", "Public Sector", "https://www.bankofindia.co.in", "bankofindia.co.in", "Major public sector bank.", { hindi: "बैंक ऑफ इंडिया", telugu: "బ్యాంక్ ఆఫ్ ఇండియా" }),
  bank("bom", "Bank of Maharashtra", "BoM", "Public Sector", "https://bankofmaharashtra.in", "bankofmaharashtra.in", "Public sector bank.", { hindi: "बैंक ऑफ महाराष्ट्र", telugu: "బ్యాంక్ ఆఫ్ మహారాష్ట్ర" }),
  bank("canara", "Canara Bank", "Canara", "Public Sector", "https://canarabank.com", "canarabank.com", "Leading public sector bank.", { hindi: "केनरा बैंक", telugu: "కెనరా బ్యాంక్" }),
  bank("cbi", "Central Bank of India", "CBI", "Public Sector", "https://www.centralbankofindia.co.in", "centralbankofindia.co.in", "Public sector bank.", { hindi: "सेंट्रल बैंक ऑफ इंडिया", telugu: "సెంట్రల్ బ్యాంక్ ఆఫ్ ఇండియా" }),
  bank("indianbank", "Indian Bank", "Indian Bank", "Public Sector", "https://www.indianbank.in", "indianbank.in", "Trusted public sector bank.", { hindi: "इंडियन बैंक", telugu: "ఇండియన్ బ్యాంక్" }),
  bank("iob", "Indian Overseas Bank", "IOB", "Public Sector", "https://www.iob.in", "iob.in", "Public sector bank.", { hindi: "इंडियन ओवरसीज बैंक", telugu: "ఇండియన్ ఓవర్సీస్ బ్యాంక్" }),
  bank("psb", "Punjab & Sind Bank", "P&SB", "Public Sector", "https://punjabandsindbank.co.in", "punjabandsindbank.co.in", "Public sector bank.", { hindi: "पंजाब एंड सिंध बैंक", telugu: "పంజాబ్ అండ్ సింధ్ బ్యాంక్" }),
  bank("pnb", "Punjab National Bank", "PNB", "Public Sector", "https://www.pnbindia.in", "pnbindia.in", "Premier nationalised bank.", { hindi: "पंजाब नेशनल बैंक", telugu: "పంజాబ్ నేషనల్ బ్యాంక్" }),
  bank("uco", "UCO Bank", "UCO", "Public Sector", "https://www.ucobank.com", "ucobank.com", "Public sector bank.", { hindi: "यूको बैंक", telugu: "యూ సీ ఓ బ్యాంక్" }),
  bank("union", "Union Bank of India", "Union", "Public Sector", "https://www.unionbankofindia.co.in", "unionbankofindia.co.in", "Pan-India public sector bank.", { hindi: "यूनियन बैंक ऑफ इंडिया", telugu: "యూనియన్ బ్యాంక్ ఆఫ్ ఇండియా" }),

  // Private Sector
  bank("axis", "Axis Bank", "Axis", "Private Sector", "https://www.axisbank.com", "axisbank.com", "Leading private bank.", { hindi: "एक्सिस बैंक", telugu: "యాక్సిస్ బ్యాంక్" }),
  bank("bandhan", "Bandhan Bank", "Bandhan", "Private Sector", "https://www.bandhanbank.com", "bandhanbank.com", "Universal bank.", { hindi: "बंधन बैंक", telugu: "బంధన్ బ్యాంక్" }),
  bank("csb", "CSB Bank", "CSB Bank", "Private Sector", "https://www.csb.co.in", "csb.co.in", "Private bank.", { hindi: "सीएसबी बैंक", telugu: "సీ ఎస్ బీ బ్యాంక్" }),
  bank("dcb", "DCB Bank", "DCB", "Private Sector", "https://www.dcbbank.com", "dcbbank.com", "Private sector bank.", { hindi: "डीसीबी बैंक", telugu: "డీ సీ బీ బ్యాంక్" }),
  bank("dhanlaxmi", "Dhanlaxmi Bank", "Dhanlaxmi", "Private Sector", "https://www.dhanbank.com", "dhanbank.com", "Private sector bank.", { hindi: "धनलक्ष्मी बैंक", telugu: "ధనలక్ష్మి బ్యాంక్" }),
  bank("federal", "Federal Bank", "Federal", "Private Sector", "https://www.federalbank.co.in", "federalbank.co.in", "Major private bank.", { hindi: "फेडरल बैंक", telugu: "ఫెడరల్ బ్యాంక్" }),
  bank("hdfc", "HDFC Bank", "HDFC", "Private Sector", "https://www.hdfcbank.com", "hdfcbank.com", "India's largest private bank.", { hindi: "एचडीएफसी बैंक", telugu: "హెచ్ డీ ఎఫ్ సీ బ్యాంక్" }),
  bank("icici", "ICICI Bank", "ICICI", "Private Sector", "https://www.icicibank.com", "icicibank.com", "Leading private bank.", { hindi: "आईसीआईसीआई बैंक", telugu: "ఐ సీ ఐ సీ ఐ బ్యాంక్" }),
  bank("idbi", "IDBI Bank", "IDBI", "Private Sector", "https://www.idbibank.in", "idbibank.in", "Private sector bank.", { hindi: "आईडीबीआई बैंक", telugu: "ఐ డీ బీ ఐ బ్యాంక్" }),
  bank("idfc", "IDFC FIRST Bank", "IDFC", "Private Sector", "https://www.idfcfirstbank.com", "idfcfirstbank.com", "Private bank.", { hindi: "आईडीएफसी फर्स्ट बैंक", telugu: "ఐ డీ ఎఫ్ సీ ఫస్ట్ బ్యాంక్" }),
  bank("indusind", "IndusInd Bank", "IndusInd", "Private Sector", "https://www.indusind.com", "indusind.com", "Private sector banking.", { hindi: "इंडसइंड बैंक", telugu: "ఇండస్ఇండ్ బ్యాంక్" }),
  bank("jk", "Jammu & Kashmir Bank", "J&K Bank", "Private Sector", "https://www.jkbank.com", "jkbank.com", "Premier bank of J&K.", { hindi: "जम्मू और कश्मीर बैंक", telugu: "జమ్మూ & కాశ్మీర్ బ్యాంక్" }),
  bank("karnataka", "Karnataka Bank", "Karnataka Bank", "Private Sector", "https://karnatakabank.com", "karnatakabank.com", "Private sector bank.", { hindi: "कर्नाटक बैंक", telugu: "కర్ణాటక బ్యాంక్" }),
  bank("kvb", "Karur Vysya Bank", "KVB", "Private Sector", "https://www.kvb.co.in", "kvb.co.in", "Scheduled commercial bank.", { hindi: "करूर वैश्य बैंक", telugu: "కరూర్ వైశ్య బ్యాంక్" }),
  bank("kotak", "Kotak Mahindra Bank", "Kotak", "Private Sector", "https://www.kotak.com", "kotak.com", "New-age digital bank.", { hindi: "कोटक महिंद्रा बैंक", telugu: "కోటక్ మహీంద్రా బ్యాంక్" }),
  bank("lvb", "Lakshmi Vilas Bank", "LVB", "Private Sector", "https://www.lvbank.com", "lvbank.com", "Private sector bank.", { hindi: "लक्ष्मी विलास बैंक", telugu: "లక్ష్మీ విలాస్ బ్యాంక్" }),
  bank("nainital", "Nainital Bank", "Nainital", "Private Sector", "https://www.nainitalbank.co.in", "nainitalbank.co.in", "Scheduled commercial bank.", { hindi: "नैनीताल बैंक", telugu: "नైనిటాల్ బ్యాంక్" }),
  bank("rbl", "RBL Bank", "RBL", "Private Sector", "https://www.rblbank.com", "rblbank.com", "Modern private sector bank.", { hindi: "आरबीएल बैंक", telugu: "ఆర్ బీ ఎల్ బ్యాంక్" }),
  bank("sib", "South Indian Bank", "SIB", "Private Sector", "https://www.southindianbank.com", "southindianbank.com", "Kerala-based bank.", { hindi: "साउथ इंडियन बैंक", telugu: "సౌత్ ఇండియన్ బ్యాంక్" }),
  bank("tmb", "Tamilnad Mercantile Bank", "TMB", "Private Sector", "https://www.tmb.in", "tmb.in", "Tamil Nadu-based bank.", { hindi: "तमिलनाड मर्केंटाइल बैंक", telugu: "తమిళనాడ్ మర్కంటైల్ బ్యాంక్" }),
  bank("yes", "YES Bank", "YES", "Private Sector", "https://www.yesbank.in", "yesbank.in", "Commercial bank.", { hindi: "यस बैंक", telugu: "యెస్ బ్యాంక్" }),

  // Small Finance Banks
  bank("ausfb", "AU Small Finance Bank", "AU SFB", "Small Finance", "https://www.aubank.in", "aubank.in", "Leading SFB.", { hindi: "एयू स्मॉल फाइनेंस बैंक", telugu: "ఏయూ స్మాల్ ఫైనాన్స్ బ్యాంక్" }),
  bank("capital", "Capital Small Finance Bank", "Capital SFB", "Small Finance", "https://www.capitalbank.co.in", "capitalbank.co.in", "First SFB.", { hindi: "कैपिटल स्मॉल फाइनेंस बैंक", telugu: "క్యాపిటల్ స్మాల్ ఫైనాన్స్ బ్యాంక్" }),
  bank("equitas", "Equitas Small Finance Bank", "Equitas", "Small Finance", "https://www.equitasbank.com", "equitasbank.com", "Inclusive growth.", { hindi: "इक्विटास स्मॉल फाइनेंस बैंक", telugu: "ఈక్విటాస్ స్మాల్ ఫైనాన్స్ బ్యాంక్" }),
  bank("esaf", "ESAF Small Finance Bank", "ESAF", "Small Finance", "https://www.esafbank.com", "esafbank.com", "Social banking.", { hindi: "ईएसएएफ स्मॉल फाइनेंस बैंक", telugu: "ఈఎస్ఏఎఫ్ స్మాల్ ఫైనాన్స్ బ్యాంక్" }),
  bank("fincare", "Fincare Small Finance Bank", "Fincare", "Small Finance", "https://www.fincarebank.com", "fincarebank.com", "Digital-first SFB.", { hindi: "फिनकेयर स्मॉल फाइनेंस बैंक", telugu: "ఫిన్కేర్ స్మాల్ ఫైనాన్స్ బ్యాంక్" }),
  bank("jana", "Jana Small Finance Bank", "Jana", "Small Finance", "https://www.janabank.com", "janabank.com", "Digital-first SFB.", { hindi: "जना स्मॉल फाइनेंस बैंक", telugu: "జన స్మాల్ ఫైనాన్స్ బ్యాంక్" }),
  bank("nesfb", "North East Small Finance Bank", "NESFB", "Small Finance", "https://www.nesfb.com", "nesfb.com", "SFB in North East.", { hindi: "नॉर्थ ईस्ट स्मॉल फाइनेंस बैंक", telugu: "నార్త్ ఈస్ట్ స్మాల్ ఫైనాన్స్ బ్యాంక్" }),
  bank("suryoday", "Suryoday Small Finance Bank", "Suryoday", "Small Finance", "https://www.suryodaybank.com", "suryodaybank.com", "Small Finance Bank.", { hindi: "सूर्योदय स्मॉल फाइनेंस बैंक", telugu: "సూర్యోదయ్ స్మాల్ ఫైనాన్స్ బ్యాంక్" }),
  bank("ujjivan", "Ujjivan Small Finance Bank", "Ujjivan", "Small Finance", "https://www.ujjivansfb.in", "ujjivansfb.in", "Small Finance Bank.", { hindi: "उज्जीवन स्मॉल फाइनेंस बैंक", telugu: "ఉజ్జీవన్ స్మాల్ ఫైనాన్స్ బ్యాంక్" }),
  bank("utkarsh", "Utkarsh Small Finance Bank", "Utkarsh", "Small Finance", "https://www.utkarsh.bank", "utkarsh.bank", "Small Finance Bank.", { hindi: "उत्कर्ष स्मॉल फाइनेंस बैंक", telugu: "ఉత్కర్ష్ స్మాల్ ఫైనాన్స్ బ్యాంక్" }),

  // Payments Banks
  bank("airtel", "Airtel Payments Bank", "Airtel PB", "Payments", "https://www.airtel.in/bank", "airtel.in", "Digital bank.", { hindi: "एयरटेल पेमेंट्स बैंक", telugu: "ఎయిర్టెల్ పేమెంట్స్ బ్యాంక్" }),
  bank("ippb", "India Post Payments Bank", "IPPB", "Payments", "https://www.ippbonline.com", "ippbonline.com", "IPPB.", { hindi: "इंडिया पोस्ट पेमेंट्स बैंक", telugu: "ఇండియా పోస్ట్ पेमेंट्स బ్యాంక్" }),
  bank("fino", "Fino Payments Bank", "Fino", "Payments", "https://www.finobank.com", "finobank.com", "Fino.", { hindi: "फिनो पेमेंट्स बैंक", telugu: "ఫినో పేమెంట్స్ బ్యాంక్" }),
  bank("jiopb", "Jio Payments Bank", "Jio PB", "Payments", "https://www.jiopaymentsbank.com", "jiopaymentsbank.com", "Jio PB.", { hindi: "जियो पेमेंट्स बैंक", telugu: "జియో పేమెంట్స్ బ్యాంక్" }),
  bank("nsdl", "NSDL Payments Bank", "NSDL PB", "Payments", "https://www.nsdlbank.com", "nsdlbank.com", "NSDL PB.", { hindi: "एनएसडीएल पेमेंट्स बैंक", telugu: "ఎన్ ఎస్ డీ ఎల్ పేమెంట్స్ బ్యాంక్" }),
  bank("paytmpb", "Paytm Payments Bank", "Paytm PB", "Payments", "https://www.paytmbank.com", "paytmbank.com", "Paytm PB.", { hindi: "पेटीएम पेमेंट्स बैंक", telugu: "पेटीएम పేమెంట్స్ बैंक" }),

  // Regional Rural Banks
  bank("apgvb", "Andhra Pradesh Grameena Vikas Bank", "APGVB", "Regional Rural", "https://www.apgvbank.in", "apgvbank.in", "RRB.", { hindi: "आंध्र प्रदेश ग्रामीण विकास बैंक", telugu: "ఆంధ్రప్రదేశ్ గ్రామీణ వికాస్ బ్యాంక్" }),
  bank("tgb", "Telangana Grameena Bank", "Telangana Gramin", "Regional Rural", "https://www.tgbhyd.in", "tgbhyd.in", "RRB for Telangana.", { hindi: "तेलंगाना ग्रामीण बैंक", telugu: "తెలంగాణ గ్రామీణ బ్యాంక్" }),

  // Co-operative
  bank("saraswat", "Saraswat Bank", "Saraswat", "Co-operative", "https://www.saraswatbank.com", "saraswatbank.com", "Co-operative bank.", { hindi: "सारस्वत बैंक", telugu: "సారస్వత్ బ్యాంక్" }),
  bank("cosmos", "Cosmos Bank", "Cosmos", "Co-operative", "https://www.cosmosbank.com", "cosmosbank.com", "Co-operative bank.", { hindi: "कॉसमॉस बैंक", telugu: "కాస్మోస్ బ్యాంక్" }),
  bank("svc", "Shamrao Vithal Co-operative Bank", "SVC Bank", "Co-operative", "https://www.svcbank.com", "svcbank.com", "Co-operative bank.", { hindi: "शामराव विठ्ठल सहकारी बैंक", telugu: "శామ్రావ్ విఠల్ కో-ఆపరేటివ్ బ్యాంక్" }),
  bank("abhyudaya", "Abhyudaya Co-operative Bank", "Abhyudaya", "Co-operative", "https://www.abhyudayabank.co.in", "abhyudayabank.co.in", "Co-operative bank.", { hindi: "अभ्युदय सहकारी बैंक", telugu: "అభ్యుదయ కో-ఆపరేటివ్ బ్యాంక్" }),
];

export function getBankDisplayName(bank: Bank | undefined, language: string): string {
  if (!bank) return "";
  const names = bank.names;
  const langKey = language as keyof typeof names;
  return names[langKey] || names.english || bank.name || "";
}

export function normalizeBankSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

export function bankMatchesSearch(
  bank: Bank,
  query: string,
  language: string = "english",
  extraTerms: string[] = []
): boolean {
  const normalizedQuery = normalizeBankSearchText(query);
  if (!normalizedQuery) return true;

  const searchableText = normalizeBankSearchText([
    bank.id,
    bank.name,
    bank.shortName,
    getBankDisplayName(bank, language),
    bank.names.english,
    bank.names.hindi,
    bank.names.telugu,
    bank.category,
    bank.website,
    bank.officialWebsite,
    bank.officialWebsiteUrl,
    bank.logoDomain,
    bank.description,
    ...bank.services,
    ...extraTerms,
  ].filter(Boolean).join(" "));

  return searchableText.includes(normalizedQuery);
}

export function getBankById(id: string): Bank | undefined {
  return BANKS.find((b) => b.id === id);
}

export function logoUrl(domain: string): string {
  const domainToFileMap: Record<string, string> = {
    "sbi.co.in": "sbi.png",
    "bankofbaroda.in": "bank_of_baroda.png",
    "bankofindia.co.in": "bank_of_india.png",
    "bankofmaharashtra.in": "bank_of_maharashtra.png",
    "canarabank.com": "canara_bank.png",
    "centralbankofindia.co.in": "central_bank.png",
    "indianbank.in": "indian_bank.png",
    "iob.in": "indian_overseas_bank.png",
    "punjabandsindbank.co.in": "punjab_sind_bank.png",
    "pnbindia.in": "pnb.png",
    "ucobank.com": "uco_bank.png",
    "unionbankofindia.co.in": "union_bank.png",
    "lvbank.com": "Lakshmi Vilas Bank.png",
    "axisbank.com": "axis_bank.png",
    "bandhanbank.com": "bandhan_bank.png",
    "csb.co.in": "csb_bank.png",
    "cityunionbank.com": "city_union_bank.png",
    "dcbbank.com": "dcb_bank.png",
    "dhanbank.com": "dhanlaxmi_bank.png",
    "federalbank.co.in": "federal_bank.png",
    "hdfcbank.com": "hdfc_bank.png",
    "icicibank.com": "icici_bank.png",
    "idbibank.in": "idbi_bank.png",
    "idfcfirstbank.com": "idfc_first_bank.png",
    "indusind.com": "indusind_bank.png",
    "jkbank.com": "jk_bank.png",
    "karnatakabank.com": "karnataka_bank.png",
    "kotak.com": "kotak_bank.png",
    "kvb.co.in": "kvb_bank.png",
    "nainitalbank.co.in": "nainital_bank.png",
    "rblbank.com": "rbl_bank.png",
    "southindianbank.com": "south_indian_bank.png",
    "tmb.in": "tmb_bank.png",
    "yesbank.in": "yes_bank.png",
    "aubank.in": "AU Small Finance Bank.png",
    "capitalbank.co.in": "Capital Small Finance Bank.png",
    "equitasbank.com": "Equitas Small Finance Bank.png",
    "esafbank.com": "ESAF Small Finance Bank.png",
    "fincarebank.com": "Fincare Small Finance Bank.png",
    "janabank.com": "Jana Small Finance Bank.png",
    "nesfb.com": "North East Small Finance Bank.png",
    "shivalikbank.com": "Shivalik Small Finance Bank.png",
    "suryodaybank.com": "Suryoday Small Finance Bank.png",
    "ujjivansfb.in": "Ujjivan Small Finance Bank.png",
    "theunitybank.com": "Unity Small Finance Bank.png",
    "utkarsh.bank": "Utkarsh Small Finance Bank.png",
    "airtel.in": "airtel_symbol.png",
    "ippbonline.com": "India Post Payments Bank.png",
    "finobank.com": "Fino Payments Bank.png",
    "jiopaymentsbank.com": "jio_payments.png",
    "nsdlbank.com": "NSDL Payments Bank.png",
    "paytmbank.com": "Paytm.png",
    "indiapost.gov.in": "India Post.png",
    "apgvbank.in": "Andhra Pradesh Grameena Vikas Bank.png",
    "karnatakagraminbank.com": "Karnataka Gramin Bank.png",
    "keralagbank.com": "Kerala Gramin Bank.png",
    "prathamaupbank.com": "Prathama UP Gramin Bank.png",
    "pgbho.com": "Punjab Gramin Bank.png",
    "tgbhyd.in": "Telangana Grameena Bank.png",
    "saraswatbank.com": "saraswat bank.png",
    "cosmosbank.com": "cosmos bank.png",
    "svcbank.com": "Svc bank.png",
    "tjsbbank.co.in": "tjsb.png",
    "abhyudayabank.co.in": "Abhyudaya Co-operative Bank.png"
  };

  const fileName = domainToFileMap[domain];
  if (fileName) {
    return `/logos/${fileName}`;
  }

  return "";
}
