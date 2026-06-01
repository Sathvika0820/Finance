/**
 * Centralized verified official links for BankHub.
 * Only add HTTPS links that belong to the named bank, insurer, post office,
 * government, regulator, or official scheme authority.
 */

export type OfficialLinkCategory =
  | "banks"
  | "loanApply"
  | "postOffice"
  | "insurance"
  | "governmentSchemes"
  | "cyberSafety"
  | "regulators"
  | "smartServices";

export interface OfficialLinkEntry {
  id: string;
  name: string;
  officialLink: string;
  verified: boolean;
  category: OfficialLinkCategory;
  type: string;
}

const bankLinks = {
  sbi: ["State Bank of India", "https://sbi.co.in"],
  pnb: ["Punjab National Bank", "https://www.pnbindia.in"],
  bob: ["Bank of Baroda", "https://www.bankofbaroda.in"],
  canara: ["Canara Bank", "https://canarabank.com"],
  union: ["Union Bank of India", "https://www.unionbankofindia.co.in"],
  indianbank: ["Indian Bank", "https://www.indianbank.in"],
  boi: ["Bank of India", "https://www.bankofindia.co.in"],
  cbi: ["Central Bank of India", "https://www.centralbankofindia.co.in"],
  iob: ["Indian Overseas Bank", "https://www.iob.in"],
  uco: ["UCO Bank", "https://www.ucobank.com"],
  bom: ["Bank of Maharashtra", "https://bankofmaharashtra.in"],
  psb: ["Punjab & Sind Bank", "https://punjabandsindbank.co.in"],
  hdfc: ["HDFC Bank", "https://www.hdfcbank.com"],
  icici: ["ICICI Bank", "https://www.icicibank.com"],
  axis: ["Axis Bank", "https://www.axisbank.com"],
  kotak: ["Kotak Mahindra Bank", "https://www.kotak.com"],
  idfc: ["IDFC FIRST Bank", "https://www.idfcfirstbank.com"],
  indusind: ["IndusInd Bank", "https://www.indusind.com"],
  federal: ["Federal Bank", "https://www.federalbank.co.in"],
  sib: ["South Indian Bank", "https://www.southindianbank.com"],
  rbl: ["RBL Bank", "https://www.rblbank.com"],
  yes: ["YES Bank", "https://www.yesbank.in"],
  bandhan: ["Bandhan Bank", "https://www.bandhanbank.com"],
  dcb: ["DCB Bank", "https://www.dcbbank.com"],
  csb: ["CSB Bank", "https://www.csb.co.in"],
  dhanlaxmi: ["Dhanlaxmi Bank", "https://www.dhanbank.com"],
  idbi: ["IDBI Bank", "https://www.idbibank.in"],
  jk: ["Jammu & Kashmir Bank", "https://www.jkbank.com"],
  karnataka: ["Karnataka Bank", "https://karnatakabank.com"],
  kvb: ["Karur Vysya Bank", "https://www.kvb.co.in"],
  lvb: ["Lakshmi Vilas Bank", "https://www.lvbank.com"],
  nainital: ["Nainital Bank", "https://www.nainitalbank.co.in"],
  tmb: ["Tamilnad Mercantile Bank", "https://www.tmb.in"],
  ausfb: ["AU Small Finance Bank", "https://www.aubank.in"],
  ujjivan: ["Ujjivan Small Finance Bank", "https://www.ujjivansfb.in"],
  equitas: ["Equitas Small Finance Bank", "https://www.equitasbank.com"],
  jana: ["Jana Small Finance Bank", "https://www.janabank.com"],
  suryoday: ["Suryoday Small Finance Bank", "https://www.suryodaybank.com"],
  esaf: ["ESAF Small Finance Bank", "https://www.esafbank.com"],
  capital: ["Capital Small Finance Bank", "https://www.capitalbank.co.in"],
  fincare: ["Fincare Small Finance Bank", "https://www.fincarebank.com"],
  nesfb: ["North East Small Finance Bank", "https://www.nesfb.com"],
  utkarsh: ["Utkarsh Small Finance Bank", "https://www.utkarsh.bank"],
  airtel: ["Airtel Payments Bank", "https://www.airtel.in/bank"],
  ippb: ["India Post Payments Bank", "https://www.ippbonline.com"],
  fino: ["Fino Payments Bank", "https://www.finobank.com"],
  jiopb: ["Jio Payments Bank", "https://www.jiopaymentsbank.com"],
  nsdl: ["NSDL Payments Bank", "https://www.nsdlbank.com"],
  paytmpb: ["Paytm Payments Bank", "https://www.paytmbank.com"],
  apgvb: ["Andhra Pradesh Grameena Vikas Bank", "https://www.apgvbank.in"],
  tgb: ["Telangana Grameena Bank", "https://www.tgbhyd.in"],
  saraswat: ["Saraswat Bank", "https://www.saraswatbank.com"],
  cosmos: ["Cosmos Bank", "https://www.cosmosbank.com"],
  svc: ["SVC Co-operative Bank", "https://www.svcbank.com"],
  abhyudaya: ["Abhyudaya Co-operative Bank", "https://www.abhyudayabank.co.in"],
} as const;

const postOfficeLinks = {
  "india-post": ["India Post", "https://www.indiapost.gov.in"],
  ippb: ["India Post Payments Bank", "https://www.ippbonline.com"],
  "post-office-savings-account": ["Post Office Savings Schemes", "https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx"],
  "recurring-deposit": ["Post Office Recurring Deposit", "https://www.indiapost.gov.in/Financial/Pages/Content/RD.aspx"],
  "monthly-income-scheme": ["Post Office Monthly Income Scheme", "https://www.indiapost.gov.in/Financial/Pages/Content/MIS.aspx"],
  "senior-citizen-savings-scheme": ["Senior Citizen Savings Scheme", "https://www.indiapost.gov.in/Financial/Pages/Content/SCSS.aspx"],
  "public-provident-fund": ["Public Provident Fund", "https://www.indiapost.gov.in/Financial/Pages/Content/PPF.aspx"],
  "sukanya-samriddhi-yojana": ["Sukanya Samriddhi Yojana", "https://www.indiapost.gov.in/Financial/Pages/Content/SSY.aspx"],
  "national-savings-certificate": ["National Savings Certificate", "https://www.indiapost.gov.in/Financial/Pages/Content/NSC.aspx"],
  "kisan-vikas-patra": ["Kisan Vikas Patra", "https://www.indiapost.gov.in/Financial/Pages/Content/KVP.aspx"],
  "speed-post-tracking": ["Speed Post Tracking", "https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx"],
  "postal-life-insurance": ["Postal Life Insurance", "https://pli.indiapost.gov.in"],
  "rural-postal-life-insurance": ["Rural Postal Life Insurance", "https://pli.indiapost.gov.in"],
} as const;

const insuranceLinks = {
  lic: ["Life Insurance Corporation of India", "https://licindia.in"],
  "sbi-life": ["SBI Life Insurance", "https://www.sbilife.co.in"],
  "hdfc-life": ["HDFC Life Insurance", "https://www.hdfclife.com"],
  "icici-prudential-life": ["ICICI Prudential Life Insurance", "https://www.iciciprulife.com"],
  "max-life": ["Max Life Insurance", "https://www.maxlifeinsurance.com"],
  "bajaj-allianz-life": ["Bajaj Allianz Life Insurance", "https://www.bajajallianzlife.com"],
  "tata-aia-life": ["Tata AIA Life Insurance", "https://www.tataaia.com"],
  "star-health": ["Star Health Insurance", "https://www.starhealth.in"],
  "niva-bupa-health": ["Niva Bupa Health Insurance", "https://www.nivabupa.com"],
  "care-health": ["Care Health Insurance", "https://www.careinsurance.com"],
  "new-india-assurance": ["New India Assurance", "https://www.newindia.co.in"],
  "oriental-insurance": ["Oriental Insurance", "https://orientalinsurance.org.in"],
  "united-india-insurance": ["United India Insurance", "https://uiic.co.in"],
  "national-insurance": ["National Insurance Company", "https://nationalinsurance.nic.co.in"],
  policyholder: ["IRDAI Policyholder Portal", "https://policyholder.gov.in"],
} as const;

const governmentSchemeLinks = {
  vidyalakshmi: ["Vidya Lakshmi Education Loan Portal", "https://www.vidyalakshmi.co.in"],
  "vidya-lakshmi": ["Vidya Lakshmi Education Loan Portal", "https://www.vidyalakshmi.co.in/Students"],
  "education-loan-schemes": ["Vidya Lakshmi Education Loan Portal", "https://www.vidyalakshmi.co.in/Students"],
  scholarships: ["National Scholarship Portal", "https://scholarships.gov.in"],
  "national-scholarship-portal": ["National Scholarship Portal", "https://scholarships.gov.in"],
  "skill-india": ["Skill India Digital", "https://www.skillindiadigital.gov.in"],
  "skill-india-digital": ["Skill India Digital", "https://www.skillindiadigital.gov.in"],
  "pm-internship": ["PM Internship Scheme", "https://pminternship.mca.gov.in"],
  "aicte-scholarships": ["AICTE Student Development Schemes", "https://www.aicte-india.org/schemes/students-development-schemes"],
  "central-sector-scholarship": ["National Scholarship Portal", "https://scholarships.gov.in"],
  "pragati-scholarship": ["AICTE Pragati Scholarship", "https://www.aicte-pragati-saksham-gov.in"],
  "saksham-scholarship": ["AICTE Saksham Scholarship", "https://www.aicte-pragati-saksham-gov.in"],
  swayam: ["SWAYAM", "https://swayam.gov.in"],
  nptel: ["NPTEL", "https://nptel.ac.in"],
  "pm-evidya": ["PM eVIDYA", "https://www.education.gov.in/pm-evidya"],
  "startup-india-students": ["Startup India", "https://www.startupindia.gov.in"],
  "atal-innovation-mission": ["Atal Innovation Mission", "https://aim.gov.in"],
  "apprenticeship-india": ["Apprenticeship India", "https://www.apprenticeshipindia.gov.in"],
  ndli: ["National Digital Library of India", "https://www.ndl.gov.in"],
  epfo: ["Employees' Provident Fund Organisation", "https://www.epfindia.gov.in"],
  "employees-pension-scheme": ["Employees' Provident Fund Organisation", "https://www.epfindia.gov.in"],
  pfrda: ["PFRDA", "https://www.pfrda.org.in"],
  "national-pension-system": ["National Pension System", "https://www.pfrda.org.in"],
  "pension-portals": ["PFRDA Pension Portals", "https://www.pfrda.org.in"],
  "pension-schemes": ["PFRDA Pension Schemes", "https://www.pfrda.org.in"],
  apy: ["Atal Pension Yojana", "https://www.pfrda.org.in/web/pfrda/schemes/atal-pension-yojana-apy"],
  "atal-pension-yojana-employee": ["Atal Pension Yojana", "https://www.pfrda.org.in/web/pfrda/schemes/atal-pension-yojana-apy"],
  "atal-pension-yojana-senior": ["Atal Pension Yojana", "https://www.pfrda.org.in/web/pfrda/schemes/atal-pension-yojana-apy"],
  "jan-suraksha": ["Jan Suraksha Portal", "https://jansuraksha.gov.in"],
  "pm-jeevan-jyoti-bima": ["Jan Suraksha Portal", "https://jansuraksha.gov.in"],
  "pm-suraksha-bima": ["Jan Suraksha Portal", "https://jansuraksha.gov.in"],
  "insurance-schemes": ["Jan Suraksha Portal", "https://jansuraksha.gov.in"],
  esic: ["Employees' State Insurance Corporation", "https://www.esic.gov.in"],
  "gratuity-information": ["Ministry of Labour and Employment", "https://labour.gov.in"],
  "e-shram": ["e-Shram", "https://eshram.gov.in"],
  "skill-upgradation": ["Skill India Digital", "https://www.skillindiadigital.gov.in"],
  "income-tax-efiling": ["Income Tax e-Filing", "https://www.incometax.gov.in/iec/foportal"],
  "national-career-service": ["National Career Service", "https://www.ncs.gov.in"],
  edli: ["Employees' Provident Fund Organisation", "https://www.epfindia.gov.in"],
  "labour-welfare": ["Ministry of Labour and Employment", "https://labour.gov.in"],
  pmkisan: ["PM-KISAN", "https://pmkisan.gov.in"],
  "pm-kisan": ["PM-KISAN", "https://pmkisan.gov.in"],
  nabard: ["NABARD", "https://www.nabard.org"],
  "kisan-credit-card": ["NABARD", "https://www.nabard.org"],
  pmfby: ["Pradhan Mantri Fasal Bima Yojana", "https://pmfby.gov.in"],
  "pm-fasal-bima": ["Pradhan Mantri Fasal Bima Yojana", "https://pmfby.gov.in"],
  "agri-infra": ["Agriculture Infrastructure Fund", "https://agriinfra.dac.gov.in"],
  "agriculture-infrastructure-fund": ["Agriculture Infrastructure Fund", "https://agriinfra.dac.gov.in"],
  "soil-health": ["Soil Health Card", "https://soilhealth.dac.gov.in"],
  "soil-health-card": ["Soil Health Card", "https://soilhealth.dac.gov.in"],
  enam: ["National Agriculture Market", "https://www.enam.gov.in"],
  "pm-krishi-sinchai": ["Pradhan Mantri Krishi Sinchayee Yojana", "https://pmksy.nic.in"],
  "national-horticulture-mission": ["Mission for Integrated Development of Horticulture", "https://midh.gov.in"],
  pmmsy: ["Pradhan Mantri Matsya Sampada Yojana", "https://pmmsy.dof.gov.in"],
  "animal-husbandry-dairy": ["Department of Animal Husbandry and Dairying", "https://dahd.nic.in"],
  "paramparagat-krishi-vikas": ["PGS India", "https://pgsindia-ncof.gov.in"],
  "pm-kusum": ["PM-KUSUM", "https://pmkusum.mnre.gov.in/index.html"],
  "agri-machinery": ["Agricultural Mechanization", "https://agrimachinery.nic.in"],
  "nabard-support": ["NABARD", "https://www.nabard.org"],
  "agri-startup-support": ["Startup India", "https://www.startupindia.gov.in"],
  mudra: ["MUDRA", "https://www.mudra.org.in"],
  "pm-mudra": ["MUDRA", "https://www.mudra.org.in"],
  "stand-up-mitra": ["Stand-Up Mitra", "https://www.standupmitra.in"],
  "stand-up-india-self-employed": ["Stand-Up Mitra", "https://www.standupmitra.in"],
  "stand-up-india-women": ["Stand-Up Mitra", "https://www.standupmitra.in"],
  pmegp: ["PMEGP", "https://www.kviconline.gov.in/pmegp/pmegpweb/"],
  udyam: ["Udyam Registration", "https://udyamregistration.gov.in"],
  "udyam-msme-registration": ["Udyam Registration", "https://udyamregistration.gov.in"],
  "startup-india": ["Startup India", "https://www.startupindia.gov.in"],
  cgtmse: ["CGTMSE", "https://www.cgtmse.in"],
  "msme-schemes": ["MyMSME", "https://my.msme.gov.in/mymsme/Reg/home.aspx"],
  "pm-vishwakarma": ["PM Vishwakarma", "https://pmvishwakarma.gov.in"],
  "pm-svanidhi": ["PM SVANidhi", "https://pmsvanidhi.mohua.gov.in"],
  gem: ["Government e-Marketplace", "https://gem.gov.in"],
  sidbi: ["SIDBI", "https://www.sidbi.in"],
  "startup-india-seed-fund": ["Startup India Seed Fund", "https://www.startupindia.gov.in/content/sih/en/startup-scheme.html"],
  wep: ["Women Entrepreneurship Platform", "https://wep.gov.in"],
  "women-entrepreneurship-platform": ["Women Entrepreneurship Platform", "https://wep.gov.in"],
  "day-nrlm": ["DAY-NRLM", "https://nrlm.gov.in"],
  pmmvy: ["PM Matru Vandana Yojana", "https://pmmvy.wcd.gov.in"],
  "women-helpline": ["Women Helpline Scheme", "https://wcd.nic.in/schemes/women-helpline-scheme-2"],
  "beti-bachao-beti-padhao": ["Ministry of Women and Child Development", "https://wcd.nic.in"],
  "mahila-samman-savings": ["Mahila Samman Savings Certificate", "https://www.indiapost.gov.in/Financial/Pages/Content/MSSC.aspx"],
  "women-msme-support": ["MyMSME", "https://my.msme.gov.in/mymsme/Reg/home.aspx"],
  "sukanya-samriddhi": ["Sukanya Samriddhi Yojana", "https://www.indiapost.gov.in/Financial/Pages/Content/SSY.aspx"],
  "senior-citizen-savings-scheme": ["Senior Citizen Savings Scheme", "https://www.indiapost.gov.in/Financial/Pages/Content/SCSS.aspx"],
  "health-insurance-support": ["IRDAI Policyholder Portal", "https://policyholder.gov.in"],
  "pm-vaya-vandana": ["Life Insurance Corporation of India", "https://licindia.in/pradhan-mantri-vaya-vandana-yojana"],
  "national-social-assistance": ["National Social Assistance Programme", "https://nsap.nic.in"],
  "jeevan-pramaan": ["Jeevan Pramaan", "https://jeevanpramaan.gov.in"],
  "pensioners-portal": ["Pensioners' Portal", "https://pensionersportal.gov.in"],
  "ayushman-bharat": ["Ayushman Bharat PM-JAY", "https://beneficiary.nha.gov.in"],
  "reverse-mortgage-awareness": ["Reserve Bank of India", "https://rbi.org.in"],
  pmjdy: ["Pradhan Mantri Jan Dhan Yojana", "https://pmjdy.gov.in"],
  "jan-dhan-yojana": ["Pradhan Mantri Jan Dhan Yojana", "https://pmjdy.gov.in"],
  uidai: ["UIDAI", "https://uidai.gov.in"],
  "aadhaar-services": ["UIDAI", "https://uidai.gov.in"],
  digilocker: ["DigiLocker", "https://www.digilocker.gov.in"],
  umang: ["UMANG", "https://web.umang.gov.in"],
  dbtbharat: ["DBT Bharat", "https://dbtbharat.gov.in"],
  "dbt-schemes": ["DBT Bharat", "https://dbtbharat.gov.in"],
  myscheme: ["myScheme", "https://www.myscheme.gov.in"],
  "india-gov": ["National Portal of India", "https://www.india.gov.in"],
  abha: ["ABHA", "https://abha.abdm.gov.in"],
  "sanchar-saathi": ["Sanchar Saathi", "https://sancharsaathi.gov.in"],
  maadhaar: ["UIDAI", "https://uidai.gov.in"],
  "instant-epan": ["Income Tax e-Filing", "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/instant-e-pan/instant-UM"],
  "csc-services": ["Common Service Centres", "https://www.csc.gov.in"],
  "digital-india": ["Digital India", "https://www.digitalindia.gov.in"],
  "pan-services": ["Income Tax e-Filing", "https://www.incometax.gov.in/iec/foportal/"],
  "voter-id-services": ["Voter Portal", "https://voters.eci.gov.in/"],
  "ration-card-services": ["NFSA Portal", "https://nfsa.gov.in/"],
  "birth-certificate": ["Civil Registration System", "https://dc.crsorgi.gov.in/"],
  "death-certificate": ["Civil Registration System", "https://dc.crsorgi.gov.in/"],
  "income-certificate": ["State Portals", "https://services.india.gov.in/"],
  "caste-certificate": ["State Portals", "https://services.india.gov.in/"],
  "residence-certificate": ["State Portals", "https://services.india.gov.in/"],
  "land-records": ["State Portals", "https://dolr.gov.in/"],
  "government-certificates": ["State Portals", "https://services.india.gov.in/"],
  "meeseva": ["MeeSeva", "https://services.india.gov.in/"], // Fallback link since it requires state portal
} as const;

const cyberSafetyLinks = {
  "cyber-complaint": ["National Cyber Crime Reporting Portal", "https://cybercrime.gov.in/"],
  "cert-in": ["CERT-In", "https://www.cert-in.org.in/"],
  npci: ["NPCI", "https://www.npci.org.in/"],
} as const;

const regulatorLinks = {
  rbi: ["Reserve Bank of India", "https://rbi.org.in/"],
  "rbi-cms": ["RBI Complaint Management System", "https://cms.rbi.org.in/cms/IndexPage.aspx"],
  "rbi-sachet": ["RBI Sachet Portal", "https://sachet.rbi.org.in/"],
} as const;

const loanApplyLinks = {
  "educationLoan:sbi": ["SBI Education Loan", "https://sbi.co.in/web/personal-banking/loans/education-loans"],
  "educationLoan:canara": ["Canara Bank Education Loan", "https://canarabank.com/education-loan.aspx"],
  "educationLoan:union": ["Union Bank Education Loan", "https://www.unionbankofindia.co.in/english/personal-education-loan.aspx"],
  "educationLoan:bob": ["Bank of Baroda Education Loan", "https://www.bankofbaroda.in/personal-banking/loans/education-loan"],
  "homeLoan:sbi": ["SBI Home Loan", "https://homeloans.sbi/"],
  "homeLoan:hdfc": ["HDFC Bank Home Loan", "https://www.hdfcbank.com/personal/borrow/popular-loans/home-loan"],
  "homeLoan:icici": ["ICICI Bank Home Loan", "https://www.icicibank.com/personal-banking/loans/home-loan"],
  "homeLoan:axis": ["Axis Bank Home Loan", "https://www.axisbank.com/retail/loans/home-loan"],
  "fixedDeposit:sbi": ["SBI FD Rates", "https://sbi.co.in/web/interest-rates/deposit-rates/retail-domestic-term-deposits"],
  "fixedDeposit:hdfc": ["HDFC Bank FD Rates", "https://www.hdfcbank.com/personal/save/deposits/fixed-deposit-interest-rate"],
  "fixedDeposit:icici": ["ICICI Bank FD Rates", "https://www.icicibank.com/personal-banking/deposits/fixed-deposit/fd-interest-rates"],
  "fixedDeposit:axis": ["Axis Bank FD Rates", "https://www.axisbank.com/interest-rate-on-deposits"],
  "fixedDeposit:pnb": ["PNB FD Rates", "https://www.pnbindia.in/Interest-Rates-Deposit.html"],
  "fixedDeposit:bob": ["Bank of Baroda FD Rates", "https://www.bankofbaroda.in/interest-rate-and-service-charges/deposits-interest-rates"],
  "savingsAccount:sbi": ["SBI Savings Account", "https://sbi.co.in/web/personal-banking/accounts/saving-account"],
  "savingsAccount:hdfc": ["HDFC Bank Savings Account", "https://www.hdfcbank.com/personal/save/accounts/savings-accounts"],
  "savingsAccount:icici": ["ICICI Bank Savings Account", "https://www.icicibank.com/personal-banking/accounts/savings-account"],
  "savingsAccount:bob": ["Bank of Baroda Savings Account", "https://www.bankofbaroda.in/personal-banking/accounts/saving-accounts"],
  "savingsAccount:pnb": ["PNB Savings Account", "https://www.pnbindia.in/savings-account.html"],
  "goldLoan:sbi": ["SBI Gold Loan", "https://sbi.co.in/web/personal-banking/loans/gold-loan"],
  "goldLoan:hdfc": ["HDFC Bank Gold Loan", "https://www.hdfcbank.com/personal/borrow/popular-loans/gold-loan"],
  "goldLoan:icici": ["ICICI Bank Gold Loan", "https://www.icicibank.com/personal-banking/loans/gold-loan"],
  "goldLoan:axis": ["Axis Bank Gold Loan", "https://www.axisbank.com/retail/loans/gold-loan"],
} as const;

const smartServiceLinks = {
  ...loanApplyLinks,
  "complaintSupport:rbiComplaintPortal": regulatorLinks["rbi-cms"],
  "complaintSupport:rbiSachet": regulatorLinks["rbi-sachet"],
  "complaintSupport:cyberCrimePortal": cyberSafetyLinks["cyber-complaint"],
} as const;

function createEntries<T extends Record<string, readonly [string, string]>>(
  source: T,
  category: OfficialLinkCategory,
  type: string,
): Record<keyof T & string, OfficialLinkEntry> {
  return Object.fromEntries(
    Object.entries(source).map(([id, [name, officialLink]]) => [
      id,
      {
        id,
        name,
        officialLink,
        verified: officialLink.startsWith("https://"),
        category,
        type,
      },
    ]),
  ) as Record<keyof T & string, OfficialLinkEntry>;
}

export const OFFICIAL_LINK_REGISTRY = {
  banks: createEntries(bankLinks, "banks", "bank"),
  loanApply: createEntries(loanApplyLinks, "loanApply", "loan"),
  postOffice: createEntries(postOfficeLinks, "postOffice", "post_office"),
  insurance: createEntries(insuranceLinks, "insurance", "insurance"),
  governmentSchemes: createEntries(governmentSchemeLinks, "governmentSchemes", "scheme"),
  cyberSafety: createEntries(cyberSafetyLinks, "cyberSafety", "cyber_safety"),
  regulators: createEntries(regulatorLinks, "regulators", "regulator"),
  smartServices: createEntries(smartServiceLinks, "smartServices", "smart_service"),
} satisfies Record<OfficialLinkCategory, Record<string, OfficialLinkEntry>>;

export const OFFICIAL_LINKS = Object.fromEntries(
  Object.entries(OFFICIAL_LINK_REGISTRY).map(([category, entries]) => [
    category,
    Object.fromEntries(
      Object.entries(entries).map(([id, entry]) => [
        id,
        entry.verified ? entry.officialLink : "",
      ]),
    ),
  ]),
) as Record<OfficialLinkCategory, Record<string, string>>;

export const OFFICIAL_LINK_NOT_VERIFIED_LABEL = "Official link not verified yet.";

export function getOfficialLinkEntry(
  category: OfficialLinkCategory,
  id: string,
): OfficialLinkEntry | undefined {
  const registry = OFFICIAL_LINK_REGISTRY as any;
  const entry = registry[category]?.[id];
  return entry?.verified && entry.officialLink.startsWith("https://") ? entry : undefined;
}

export function getOfficialLink(
  category: OfficialLinkCategory,
  id: string,
): string | undefined {
  return getOfficialLinkEntry(category, id)?.officialLink;
}

export function getSmartServiceOfficialLink(serviceType: string, key: string): OfficialLinkEntry | undefined {
  return getOfficialLinkEntry("smartServices", `${serviceType}:${key}`);
}

export function getComparableOfficialHost(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function isVerifiedOfficialUrl(url: string | null | undefined): boolean {
  if (!url?.startsWith("https://")) return false;
  const inputHost = getComparableOfficialHost(url);
  if (!inputHost) return false;

  return Object.values(OFFICIAL_LINK_REGISTRY).some((entries) =>
    Object.values(entries).some((entry) => {
      if (!entry.verified) return false;
      const officialHost = getComparableOfficialHost(entry.officialLink);
      return inputHost === officialHost || inputHost.endsWith(`.${officialHost}`);
    }),
  );
}
