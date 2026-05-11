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
  category: BankCategory;
  website: string;
  appLink: string;
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
  services: string[] = ["Savings", "Loans", "Cards", "Mobile Banking"],
): Bank {
  const idx = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % accents.length;
  return {
    id,
    name,
    shortName,
    category,
    website,
    appLink: website,
    description,
    services,
    accent: accents[idx],
    logoDomain,
  };
}

export const BANKS: Bank[] = [
  // Public Sector
  bank("sbi", "State Bank of India", "SBI", "Public Sector", "https://sbi.co.in", "sbi.co.in", "India's largest public sector bank with the broadest network in the country.", ["YONO", "Savings", "Loans", "Cards", "Investments"]),
  bank("bob", "Bank of Baroda", "BoB", "Public Sector", "https://www.bankofbaroda.in", "bankofbaroda.in", "A leading public sector bank with global presence."),
  bank("boi", "Bank of India", "BoI", "Public Sector", "https://www.bankofindia.co.in", "bankofindia.co.in", "Major public sector bank with strong international reach."),
  bank("bom", "Bank of Maharashtra", "BoM", "Public Sector", "https://bankofmaharashtra.in", "bankofmaharashtra.in", "Public sector bank headquartered in Pune."),
  bank("canara", "Canara Bank", "Canara", "Public Sector", "https://canarabank.com", "canarabank.com", "Leading public sector bank with nationwide footprint."),
  bank("cbi", "Central Bank of India", "CBI", "Public Sector", "https://www.centralbankofindia.co.in", "centralbankofindia.co.in", "One of the oldest commercial banks in India."),
  bank("indianbank", "Indian Bank", "Indian Bank", "Public Sector", "https://www.indianbank.in", "indianbank.in", "Trusted public sector bank with century-old heritage."),
  bank("iob", "Indian Overseas Bank", "IOB", "Public Sector", "https://www.iob.in", "iob.in", "Public sector bank with focus on overseas trade."),
  bank("psb", "Punjab & Sind Bank", "P&SB", "Public Sector", "https://punjabandsindbank.co.in", "punjabandsindbank.co.in", "Public sector bank serving customers since 1908."),
  bank("pnb", "Punjab National Bank", "PNB", "Public Sector", "https://www.pnbindia.in", "pnbindia.in", "Premier nationalised bank serving millions across India."),
  bank("uco", "UCO Bank", "UCO", "Public Sector", "https://www.ucobank.com", "ucobank.com", "Public sector commercial bank headquartered in Kolkata."),
  bank("union", "Union Bank of India", "Union", "Public Sector", "https://www.unionbankofindia.co.in", "unionbankofindia.co.in", "Pan-India public sector bank with modern digital banking."),

  // Private Sector
  bank("axis", "Axis Bank", "Axis", "Private Sector", "https://www.axisbank.com", "axisbank.com", "Leading private bank with personalised digital solutions."),
  bank("bandhan", "Bandhan Bank", "Bandhan", "Private Sector", "https://www.bandhanbank.com", "bandhanbank.com", "Universal bank with a strong micro-banking heritage."),
  bank("csb", "CSB Bank", "CSB Bank", "Private Sector", "https://www.csb.co.in", "csb.co.in", "Modern private bank serving retail and SME customers."),
  bank("dcb", "DCB Bank", "DCB", "Private Sector", "https://www.dcbbank.com", "dcbbank.com", "New-generation private sector bank with branches across India."),
  bank("dhanlaxmi", "Dhanlaxmi Bank", "Dhanlaxmi", "Private Sector", "https://www.dhanbank.com", "dhanbank.com", "Kerala-headquartered private sector bank."),
  bank("federal", "Federal Bank", "Federal", "Private Sector", "https://www.federalbank.co.in", "federalbank.co.in", "Major private bank with strong NRI services."),
  bank("hdfc", "HDFC Bank", "HDFC", "Private Sector", "https://www.hdfcbank.com", "hdfcbank.com", "India's largest private sector bank.", ["MobileBanking", "Cards", "Loans", "Investments"]),
  bank("icici", "ICICI Bank", "ICICI", "Private Sector", "https://www.icicibank.com", "icicibank.com", "Leading private bank with full-stack digital banking."),
  bank("idbi", "IDBI Bank", "IDBI", "Private Sector", "https://www.idbibank.in", "idbibank.in", "Private sector bank with industrial banking heritage."),
  bank("idfc", "IDFC FIRST Bank", "IDFC", "Private Sector", "https://www.idfcfirstbank.com", "idfcfirstbank.com", "Customer-first private bank with zero-fee banking."),
  bank("indusind", "IndusInd Bank", "IndusInd", "Private Sector", "https://www.indusind.com", "indusind.com", "Premium private sector banking experience."),
  bank("jk", "Jammu & Kashmir Bank", "J&K Bank", "Private Sector", "https://www.jkbank.com", "jkbank.com", "Premier bank of the Jammu & Kashmir region."),
  bank("karnataka", "Karnataka Bank", "Karnataka Bank", "Private Sector", "https://karnatakabank.com", "karnatakabank.com", "Mangaluru-headquartered private sector bank."),
  bank("kvb", "Karur Vysya Bank", "KVB", "Private Sector", "https://www.kvb.co.in", "kvb.co.in", "Tamil Nadu-based scheduled commercial bank."),
  bank("kotak", "Kotak Mahindra Bank", "Kotak", "Private Sector", "https://www.kotak.com", "kotak.com", "New-age bank with seamless digital onboarding."),
  bank("lvb", "Lakshmi Vilas Bank", "LVB", "Private Sector", "https://www.lvbank.com", "lvbank.com", "Private sector bank serving since 1926."),
  bank("nainital", "Nainital Bank", "Nainital", "Private Sector", "https://www.nainitalbank.co.in", "nainitalbank.co.in", "Scheduled commercial bank with focus on Uttarakhand."),
  bank("rbl", "RBL Bank", "RBL", "Private Sector", "https://www.rblbank.com", "rblbank.com", "Modern private sector bank with digital innovations."),
  bank("sib", "South Indian Bank", "SIB", "Private Sector", "https://www.southindianbank.com", "southindianbank.com", "Kerala-based private sector bank."),
  bank("tmb", "Tamilnad Mercantile Bank", "TMB", "Private Sector", "https://www.tmb.in", "tmb.in", "Tamil Nadu-based private sector bank with century-old legacy."),
  bank("yes", "YES Bank", "YES", "Private Sector", "https://www.yesbank.in", "yesbank.in", "Full-service commercial bank with strong digital offerings."),

  // Small Finance Banks
  bank("ausfb", "AU Small Finance Bank", "AU SFB", "Small Finance", "https://www.aubank.in", "aubank.in", "Leading SFB serving emerging India."),
  bank("capital", "Capital Small Finance Bank", "Capital SFB", "Small Finance", "https://www.capitalbank.co.in", "capitalbank.co.in", "India's first small finance bank."),
  bank("equitas", "Equitas Small Finance Bank", "Equitas", "Small Finance", "https://www.equitasbank.com", "equitasbank.com", "Banking for inclusive growth."),
  bank("esaf", "ESAF Small Finance Bank", "ESAF", "Small Finance", "https://www.esafbank.com", "esafbank.com", "Small finance bank focused on social banking."),
  bank("fincare", "Fincare Small Finance Bank", "Fincare", "Small Finance", "https://www.fincarebank.com", "fincarebank.com", "Digital-first SFB now part of AU SFB."),
  bank("jana", "Jana Small Finance Bank", "Jana", "Small Finance", "https://www.janabank.com", "janabank.com", "Digital-first small finance bank."),
  bank("nesfb", "North East Small Finance Bank", "NESFB", "Small Finance", "https://www.nesfb.com", "nesfb.com", "SFB serving the north-east of India."),

  // Payments Banks
  bank("airtel", "Airtel Payments Bank", "Airtel PB", "Payments", "https://www.airtel.in/bank", "airtel.in", "Digital payments bank by Airtel.", ["Wallet", "UPI", "Bills"]),
  bank("ippb", "India Post Payments Bank", "IPPB", "Payments", "https://www.ippbonline.com", "ippbonline.com", "Payments bank operated by India Post."),
  bank("fino", "Fino Payments Bank", "Fino", "Payments", "https://www.finobank.com", "finobank.com", "Payments bank for digital India."),
  bank("jiopb", "Jio Payments Bank", "Jio PB", "Payments", "https://www.jiopaymentsbank.com", "jiopaymentsbank.com", "Digital payments bank by Reliance Jio."),
  bank("nsdl", "NSDL Payments Bank", "NSDL PB", "Payments", "https://www.nsdlbank.com", "nsdlbank.com", "Payments bank by NSDL."),
  bank("paytmpb", "Paytm Payments Bank", "Paytm PB", "Payments", "https://www.paytmbank.com", "paytmbank.com", "Mobile-first payments bank."),

  // Regional Rural Banks
  bank("apgvb", "Andhra Pradesh Grameena Vikas Bank", "APGVB", "Regional Rural", "https://www.apgvbank.in", "apgvbank.in", "Regional rural bank serving Andhra Pradesh."),
    bank("tgb", "Telangana Grameena Bank", "Telangana Gramin", "Regional Rural", "https://www.tgbhyd.in", "tgbhyd.in", "Regional rural bank for Telangana."),

  // Co-operative
  bank("saraswat", "Saraswat Bank", "Saraswat", "Co-operative", "https://www.saraswatbank.com", "saraswatbank.com", "India's largest urban co-operative bank."),
  bank("cosmos", "Cosmos Bank", "Cosmos", "Co-operative", "https://www.cosmosbank.com", "cosmosbank.com", "Leading co-operative bank with pan-India presence."),
  bank("tjsb", "TJSB Sahakari Bank", "TJSB", "Co-operative", "https://www.tjsbbank.co.in", "tjsbbank.co.in", "Multi-state scheduled co-operative bank."),
  bank("abhyudaya", "Abhyudaya Co-operative Bank", "Abhyudaya", "Co-operative", "https://www.abhyudayabank.co.in", "abhyudayabank.co.in", "Multi-state scheduled urban co-operative bank."),
];

export function getBankById(id: string): Bank | undefined {
  return BANKS.find((b) => b.id === id);
}

export function logoUrl(domain: string): string {
  // Map domain to local PNG file names
  const domainToFileMap: Record<string, string> = {
    // Public Sector Banks
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

    // Private Sector Banks
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

    // Small Finance Banks
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

    // Payments Banks
    "airtel.in": "airtel_symbol.png",
    "ippbonline.com": "India Post Payments Bank.png",
    "finobank.com": "Fino Payments Bank.png",
    "jiopaymentsbank.com": "jio_payments.png",
    "nsdlbank.com": "NSDL Payments Bank.png",
    "paytmbank.com": "Paytm.png",

    // Regional Rural Banks
    "apgvbank.in": "Andhra Pradesh Grameena Vikas Bank.png",
    "karnatakagraminbank.com": "Karnataka Gramin Bank.png",
    "keralagbank.com": "Kerala Gramin Bank.png",
    "prathamaupbank.com": "Prathama UP Gramin Bank.png",
    "pgbho.com": "Punjab Gramin Bank.png",
    "tgbhyd.in": "Telangana Grameena Bank.png",

    // Co-operative Banks
    "saraswatbank.com": "saraswat bank.png",
    "cosmosbank.com": "cosmos bank.png",
    "tjsbbank.co.in": "tjsb.png",
    "abhyudayabank.co.in": "Abhyudaya Co-operative Bank.png"
  };

  const fileName = domainToFileMap[domain];
  if (fileName) {
    return `/logos/${fileName}`;
  }

  // Fallback to Clearbit if no local PNG is available
  return `https://logo.clearbit.com/${domain}`;
}