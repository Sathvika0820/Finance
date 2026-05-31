export type FinancialInclusionCategoryId =
  | "student"
  | "employee"
  | "farmer"
  | "self-employed"
  | "women"
  | "senior-citizen"
  | "citizen"
  | "others";

export interface FinancialInclusionCategory {
  id: FinancialInclusionCategoryId;
  name: string;
  description: string;
}

export interface FinancialInclusionScheme {
  id: string;
  category: FinancialInclusionCategoryId;
  subcategory: string;
  name: string;
  shortDescription: string;
  type: string;
  description: string;
  eligibility: string;
  benefits: string;
  importantNotes?: string;
  officialWebsite: string;
  verified: boolean;
  sourceAuthority: "official";
  tags: string[];
  keywords: string[];
  badge?: "Most Popular" | "Recommended" | "Recently Added";
  customAction?: {
    labelKey: string;
    onClickUrl: string;
    icon?: string;
  };
}

export const FINANCIAL_INCLUSION_CATEGORIES: FinancialInclusionCategory[] = [
  {
    id: "student",
    name: "Student",
    description: "Scholarships, education loans, skills, and study support.",
  },
  {
    id: "employee",
    name: "Employee",
    description: "Provident fund, pension, and low-cost insurance support.",
  },
  {
    id: "farmer",
    name: "Farmer",
    description: "Farmer income support, crop insurance, and agriculture credit.",
  },
  {
    id: "self-employed",
    name: "Self-employed",
    description: "Micro enterprise, MSME, and livelihood finance portals.",
  },
  {
    id: "women",
    name: "Women",
    description: "Savings, entrepreneurship, and women-focused support.",
  },
  {
    id: "senior-citizen",
    name: "Senior Citizen",
    description: "Savings, pensions, and health insurance awareness.",
  },
  {
    id: "citizen",
    name: "Government & Citizen Services",
    description: "Access government certificates, identity services, revenue services, and citizen assistance.",
  },
  {
    id: "others",
    name: "Others",
    description: "Identity, documents, DBT, insurance, and scheme discovery.",
  },
];

function scheme(
  id: string,
  category: FinancialInclusionCategoryId,
  name: string,
  type: string,
  description: string,
  eligibility: string,
  benefits: string,
  officialWebsite: string,
  keywords: string[] = [],
  verified = true,
  badge?: FinancialInclusionScheme["badge"],
  importantNotes?: string,
  customAction?: FinancialInclusionScheme["customAction"]
): FinancialInclusionScheme {
  const subcategory = inferSubcategory(category, id, type, keywords);
  const tags = [category, subcategory, type, name, ...keywords];
  return {
    id,
    category,
    subcategory,
    name,
    shortDescription: description,
    type,
    description,
    eligibility,
    benefits,
    importantNotes,
    officialWebsite,
    verified,
    sourceAuthority: "official",
    tags,
    keywords: tags,
    badge,
    customAction,
  };
}

function inferSubcategory(
  category: FinancialInclusionCategoryId,
  id: string,
  type: string,
  keywords: string[],
): string {
  const text = [id, type, ...keywords].join(" ").toLowerCase();

  if (category === "student") {
    if (/scholar|pragati|saksham|central/.test(text)) return "Scholarships";
    if (/loan|vidya/.test(text)) return "Education Loans";
    if (/skill|apprentice/.test(text)) return "Skills & Training";
    if (/swayam|nptel|evidya|library|ndli|digital/.test(text)) return "Online Learning";
    if (/intern|career/.test(text)) return "Internships & Career";
    return "Startup & Innovation";
  }

  if (category === "employee") {
    if (/epf|provident|edli/.test(text)) return "Provident Fund";
    if (/pension|nps|apy|eps/.test(text)) return "Pension";
    if (/insurance|bima|esic|esi/.test(text)) return "Insurance";
    if (/skill|career/.test(text)) return "Skill Upgradation";
    return "Welfare & Protection";
  }

  if (category === "farmer") {
    if (/kisan|income/.test(text)) return "Farmer Income Support";
    if (/insurance|fasal|crop/.test(text)) return "Crop Insurance";
    if (/credit|kcc|nabard/.test(text)) return "Agriculture Credit";
    if (/subsidy|kusum|solar|machinery/.test(text)) return "Subsidies";
    if (/irrigation|infra|sinchai|market|enam/.test(text)) return "Irrigation & Infrastructure";
    if (/dairy|fish|matsya|animal/.test(text)) return "Dairy/Fisheries";
    return "Sustainable Farming";
  }

  if (category === "self-employed") {
    if (/udyam|msme|cgtmse|sidbi/.test(text)) return "MSME Support";
    if (/loan|mudra|stand-up|svanidhi/.test(text)) return "Business Loans";
    if (/startup|seed|vishwakarma/.test(text)) return "Startup Support";
    if (/gem|marketplace|digital/.test(text)) return "Government Marketplaces";
    return "Entrepreneurship";
  }

  if (category === "women") {
    if (/sukanya|samman|savings/.test(text)) return "Savings";
    if (/entrepreneur|stand-up|msme|wep/.test(text)) return "Entrepreneurship";
    if (/shg|nrlm/.test(text)) return "Self-help Groups";
    return "Welfare & Support";
  }

  if (category === "senior-citizen") {
    if (/saving|scss/.test(text)) return "Savings";
    if (/pension|apy|vaya|jeevan|pramaan/.test(text)) return "Pension";
    if (/health|insurance|ayushman/.test(text)) return "Insurance & Healthcare";
    return "Elderly Financial Support";
  }

  if (category === "citizen") {
    if (/meeseva|csc/.test(text)) return "Citizen Assistance";
    if (/aadhaar|pan|voter|ration|document|identity/.test(text)) return "Identity & Documents";
    if (/certificate|income|caste|residence|birth|death/.test(text)) return "Certificates";
    if (/land|record|bhoomi|dharani/.test(text)) return "Land Records";
    if (/digital|umang|digilocker/.test(text)) return "Digital Services";
    if (/dbt|transfer|subsidy/.test(text)) return "DBT Services";
    return "Government Services";
  }

  if (/jan dhan|banking|insurance|pension/.test(text)) return "Banking Inclusion";
  if (/scheme|myscheme|dbt/.test(text)) return "Scheme Discovery";
  return "Government Services";
}

export const FINANCIAL_INCLUSION_SCHEMES: FinancialInclusionScheme[] = [
  scheme("vidya-lakshmi", "student", "Vidya Lakshmi Portal", "Education Loan", "Single official portal for student education loan applications to participating banks.", "Students seeking education loans as per participating bank rules.", "Compare and apply for education loans from one official portal.", "https://www.vidyalakshmi.co.in/Students", ["college", "bank loan"]),
  scheme("national-scholarship-portal", "student", "National Scholarship Portal", "Scholarship", "Government portal for central and state scholarship applications.", "Students who match scheme-specific income, merit, category, course, or state rules.", "Apply, renew, and track eligible scholarships from one official portal.", "https://scholarships.gov.in", ["nsp"]),
  scheme("skill-india", "student", "Skill India Digital", "Skill Development", "Official platform for skilling, reskilling, digital credentials, and job-linked learning.", "Learners and youth looking for government-linked skill courses.", "Access training, credentials, and skill development resources.", "https://www.skillindiadigital.gov.in", ["training"]),
  scheme("pm-internship", "student", "PM Internship Scheme", "Internship", "Ministry of Corporate Affairs portal for PM Internship Scheme opportunities.", "Eligible youth as notified on the official PM Internship portal.", "Find official internship opportunities and apply through the government portal.", "https://pminternship.mca.gov.in", ["internship", "mca"]),
  scheme("aicte-scholarships", "student", "AICTE Scholarships", "Scholarship", "AICTE student development and scholarship scheme information.", "Students in AICTE-approved institutions subject to scheme rules.", "Find AICTE scholarship and student support scheme details.", "https://www.aicte-india.org/schemes/students-development-schemes", ["technical education"]),
  scheme("central-sector-scholarship", "student", "Central Sector Scholarship", "Scholarship", "Central Sector scholarship access through the National Scholarship Portal.", "Eligible meritorious students as per Ministry and NSP rules.", "Apply for central scholarship support through the official scholarship system.", "https://scholarships.gov.in", ["central sector"]),
  scheme("pragati-scholarship", "student", "Pragati Scholarship", "Scholarship", "AICTE scholarship support for eligible girl students in technical education.", "Eligible girl students in AICTE-approved technical institutions.", "Financial support for technical education as per AICTE/NSP rules.", "https://www.aicte-pragati-saksham-gov.in", ["girls", "aicte"]),
  scheme("saksham-scholarship", "student", "Saksham Scholarship", "Scholarship", "AICTE scholarship support for eligible specially-abled students in technical education.", "Eligible specially-abled students in AICTE-approved technical institutions.", "Financial support for technical education as per AICTE/NSP rules.", "https://www.aicte-pragati-saksham-gov.in", ["disability", "aicte"]),
  scheme("education-loan-schemes", "student", "Education Loan Schemes", "Education Loan", "Official route to review and apply for bank education loan options.", "Students admitted to eligible courses as per bank rules.", "Apply safely through the official education loan portal.", "https://www.vidyalakshmi.co.in/Students", ["loan"]),
  scheme("swayam", "student", "SWAYAM", "Digital Learning", "Government online learning platform for school, college, and lifelong learners.", "Learners who want official online courses and certifications.", "Access free/low-cost online courses from official institutions.", "https://swayam.gov.in", ["online courses"]),
  scheme("nptel", "student", "NPTEL", "Digital Learning", "IIT/IISc-led official online course platform under SWAYAM.", "Students and learners seeking technical and professional courses.", "Learn from IIT/IISc course content and certification pathways.", "https://nptel.ac.in", ["iit", "courses"]),
  scheme("pm-evidya", "student", "PM eVIDYA", "Digital Education", "Government digital education initiative for multi-mode learning access.", "Students, teachers, and learners using official school education resources.", "Access TV, radio, digital, and online education initiatives.", "https://www.education.gov.in/pm-evidya", ["digital india", "school"]),
  scheme("startup-india-students", "student", "Startup India", "Startup Support", "Official Startup India portal for startup learning, recognition, and support.", "Students and innovators building eligible startups or learning entrepreneurship.", "Access startup recognition, learning, and ecosystem resources.", "https://www.startupindia.gov.in", ["innovation"]),
  scheme("atal-innovation-mission", "student", "Atal Innovation Mission", "Innovation Support", "Official innovation mission supporting tinkering, incubation, and entrepreneurship.", "Students, schools, innovators, and incubation ecosystem participants as per program rules.", "Find official innovation programs and startup ecosystem support.", "https://aim.gov.in", ["innovation", "startup"]),
  scheme("apprenticeship-india", "student", "Apprenticeship India", "Skills & Training", "Official apprenticeship portal for candidates, establishments, and training partners.", "Eligible candidates and establishments as per apprenticeship rules.", "Find and apply for official apprenticeship opportunities.", "https://www.apprenticeshipindia.gov.in", ["apprenticeship", "career"], true, "Recommended"),
  scheme("ndli", "student", "National Digital Library of India", "Online Learning", "Official digital learning library supported by the Ministry of Education.", "Students, teachers, researchers, and lifelong learners.", "Access learning resources through an official national digital library.", "https://www.ndl.gov.in", ["library", "ndli"], true, "Recommended"),

  scheme("epfo", "employee", "EPFO", "Provident Fund", "Official Employees' Provident Fund Organisation services.", "Employees and employers covered under EPF rules.", "Access PF, pension, nomination, passbook, and member services.", "https://www.epfindia.gov.in", ["pf"]),
  scheme("employees-pension-scheme", "employee", "Employees Pension Scheme", "Pension", "EPFO information and services linked to employee pension benefits.", "EPF members eligible under EPS rules.", "Access official employee pension information and services.", "https://www.epfindia.gov.in", ["eps"]),
  scheme("national-pension-system", "employee", "National Pension System", "Pension", "Official PFRDA portal for NPS information.", "Eligible citizens and employees as per NPS rules.", "Retirement savings and regulated pension account information.", "https://www.pfrda.org.in", ["nps"]),
  scheme("atal-pension-yojana-employee", "employee", "Atal Pension Yojana", "Pension", "Official PFRDA page for Atal Pension Yojana.", "Eligible subscribers as per APY rules.", "Government-backed pension scheme information and guidance.", "https://www.pfrda.org.in/web/pfrda/schemes/atal-pension-yojana-apy", ["apy"]),
  scheme("pm-jeevan-jyoti-bima", "employee", "PM Jeevan Jyoti Bima Yojana", "Life Insurance", "Official Jan Suraksha portal for government life insurance.", "Eligible bank account holders as per PMJJBY rules.", "Low-cost life insurance cover through participating banks.", "https://jansuraksha.gov.in", ["pmjjby"]),
  scheme("pm-suraksha-bima", "employee", "PM Suraksha Bima Yojana", "Accident Insurance", "Official Jan Suraksha portal for accident insurance.", "Eligible bank account holders as per PMSBY rules.", "Low-cost accident insurance cover through participating banks.", "https://jansuraksha.gov.in", ["pmsby"]),
  scheme("esic", "employee", "ESIC", "Social Security", "Official Employees' State Insurance Corporation portal.", "Eligible employees and employers covered under ESI rules.", "Access medical, insurance, contribution, and beneficiary services.", "https://www.esic.gov.in", ["esi"]),
  scheme("gratuity-information", "employee", "Gratuity Information", "Employee Welfare", "Ministry of Labour and Employment information for labour laws and worker benefits.", "Employees covered under applicable gratuity and labour law rules.", "Understand official worker benefit and gratuity-related information.", "https://labour.gov.in", ["gratuity"]),
  scheme("e-shram", "employee", "e-Shram", "Worker Registration", "Official national database portal for unorganised workers.", "Eligible unorganised workers as per e-Shram rules.", "Access worker registration and linked social security information.", "https://eshram.gov.in", ["worker"]),
  scheme("skill-upgradation", "employee", "Skill Upgradation Programs", "Skill Development", "Official Skill India platform for job and career skill development.", "Employees and job seekers looking for upskilling or reskilling.", "Access official skill courses and digital credentials.", "https://www.skillindiadigital.gov.in", ["upskill"]),
  scheme("income-tax-efiling", "employee", "Income Tax e-Filing", "Tax Services", "Official Income Tax Department portal for filing and tax services.", "Taxpayers and employees with income tax filing or PAN-linked services.", "File returns and access official taxpayer services.", "https://www.incometax.gov.in/iec/foportal", ["tax"]),
  scheme("national-career-service", "employee", "National Career Service", "Career Support", "Official career services portal of the Ministry of Labour and Employment.", "Job seekers, employees, employers, and career service users.", "Access job search, career guidance, and employment services.", "https://www.ncs.gov.in", ["jobs"]),
  scheme("edli", "employee", "Employees Deposit Linked Insurance", "Insurance", "EPFO-linked insurance benefit information for eligible members.", "Eligible EPF members as per EDLI rules.", "Understand official insurance benefit coverage linked to EPF membership.", "https://www.epfindia.gov.in", ["edli", "insurance"], true, "Recommended"),
  scheme("labour-welfare", "employee", "Labour Welfare Schemes", "Welfare & Protection", "Official Ministry of Labour and Employment portal for worker welfare information.", "Workers and employees covered under relevant labour welfare rules.", "Access official worker welfare, labour law, and protection information.", "https://labour.gov.in", ["welfare", "labour"]),

  scheme("pm-kisan", "farmer", "PM-KISAN", "Income Support", "Official Pradhan Mantri Kisan Samman Nidhi portal.", "Eligible farmer families as per PM-KISAN rules.", "Check beneficiary status and income support services.", "https://pmkisan.gov.in", ["income"]),
  scheme("kisan-credit-card", "farmer", "Kisan Credit Card", "Agriculture Credit", "Official agriculture credit guidance through NABARD.", "Eligible farmers and allied activity borrowers as per bank/KCC rules.", "Credit support information for crop and allied agriculture needs.", "https://www.nabard.org", ["kcc"]),
  scheme("pm-fasal-bima", "farmer", "PM Fasal Bima Yojana", "Crop Insurance", "Official crop insurance portal.", "Farmers covered under notified crops, areas, and PMFBY rules.", "Access crop insurance enrollment and claim-related information.", "https://pmfby.gov.in", ["crop insurance"]),
  scheme("soil-health-card", "farmer", "Soil Health Card", "Farm Advisory", "Official soil health card portal.", "Farmers seeking soil testing and nutrient guidance.", "Get soil health and crop nutrient recommendations.", "https://soilhealth.dac.gov.in", ["soil"]),
  scheme("agriculture-infrastructure-fund", "farmer", "Agriculture Infrastructure Fund", "Agriculture Finance", "Official portal for agriculture infrastructure financing support.", "Eligible agri entrepreneurs, FPOs, cooperatives, and institutions.", "Access financing support information for agriculture infrastructure.", "https://agriinfra.dac.gov.in", ["fpo"]),
  scheme("enam", "farmer", "eNAM", "Market Access", "Official National Agriculture Market portal.", "Farmers, traders, and mandis using eNAM services.", "Access online agricultural market information and services.", "https://www.enam.gov.in", ["market"]),
  scheme("pm-krishi-sinchai", "farmer", "PM Krishi Sinchai Yojana", "Irrigation", "Official PMKSY portal for irrigation and water-use support.", "Farmers and institutions covered under scheme components.", "Find official irrigation and water management support details.", "https://pmksy.nic.in", ["irrigation"]),
  scheme("national-horticulture-mission", "farmer", "National Horticulture Mission", "Horticulture", "Official MIDH portal for horticulture mission information.", "Eligible farmers and institutions under horticulture mission guidelines.", "Access horticulture development and support information.", "https://midh.gov.in", ["horticulture"]),
  scheme("pmmsy", "farmer", "PM Matsya Sampada Yojana", "Fisheries", "Official fisheries scheme portal.", "Fishers, fish farmers, and eligible fisheries stakeholders.", "Find fisheries infrastructure, livelihood, and support scheme details.", "https://pmmsy.dof.gov.in", ["fisheries"]),
  scheme("animal-husbandry-dairy", "farmer", "Dairy & Animal Husbandry Schemes", "Dairy Support", "Official Department of Animal Husbandry and Dairying portal.", "Eligible dairy farmers, livestock owners, and sector stakeholders.", "Access official dairy, livestock, and animal husbandry scheme information.", "https://dahd.nic.in", ["dairy"]),
  scheme("paramparagat-krishi-vikas", "farmer", "Organic Farming Schemes", "Organic Farming", "Official PGS India portal for organic certification and PKVY-linked information.", "Farmers and groups participating in organic farming systems.", "Access official organic farming and certification resources.", "https://pgsindia-ncof.gov.in", ["organic"]),
  scheme("pm-kusum", "farmer", "PM-KUSUM", "Solar Pump Support", "Official PM-KUSUM portal for solar agriculture pump support.", "Eligible farmers and institutions as per PM-KUSUM component rules.", "Access solar pump and farm energy support information.", "https://pmkusum.mnre.gov.in/index.html", ["solar pump"]),
  scheme("agri-machinery", "farmer", "Agricultural Mechanization", "Subsidy Support", "Official agriculture machinery portal for mechanization support.", "Farmers and custom hiring centres as per state and scheme rules.", "Find official machinery, subsidy, and custom hiring information.", "https://agrimachinery.nic.in", ["subsidy", "machinery"]),
  scheme("nabard-support", "farmer", "NABARD Support Schemes", "Agriculture Credit", "Official NABARD portal for agriculture and rural development support information.", "Farmers, FPOs, cooperatives, and rural institutions as per program rules.", "Discover official refinance, development, and rural credit support.", "https://www.nabard.org", ["nabard", "credit"], true, "Recommended"),
  scheme("agri-startup-support", "farmer", "Agri Startup Support", "Startup & Innovation", "Official Startup India route for agriculture and rural innovation support discovery.", "Eligible agri startups and innovators as per program rules.", "Find startup recognition, learning, and support resources for agri innovation.", "https://www.startupindia.gov.in", ["agri startup", "innovation"]),

  scheme("pm-mudra", "self-employed", "PM Mudra Yojana", "Micro Enterprise Loan", "Official MUDRA portal for micro and small enterprise loan information.", "Eligible non-corporate, non-farm micro or small business borrowers.", "Understand Shishu, Kishor, and Tarun loan categories.", "https://www.mudra.org.in", ["business loan"]),
  scheme("stand-up-india-self-employed", "self-employed", "Stand-Up India", "Enterprise Loan", "Official bank loan support portal for eligible entrepreneurs.", "Eligible SC/ST and women entrepreneurs as per scheme rules.", "Access guidance and bank loan support for greenfield enterprises.", "https://www.standupmitra.in", ["enterprise"]),
  scheme("pmegp", "self-employed", "PMEGP", "Enterprise Support", "Official KVIC PMEGP portal for micro-enterprise support.", "Eligible entrepreneurs and institutions as per PMEGP/KVIC rules.", "Apply for official PMEGP-supported enterprise assistance.", "https://www.kviconline.gov.in/pmegp/pmegpweb/", ["kvic"]),
  scheme("udyam-msme-registration", "self-employed", "Udyam/MSME Registration", "MSME Registration", "Official Government of India portal for MSME Udyam registration.", "Eligible micro, small, and medium enterprises.", "Register for MSME recognition and linked support access.", "https://udyamregistration.gov.in", ["msme"]),
  scheme("startup-india", "self-employed", "Startup India", "Startup Support", "Official Startup India portal for recognition and ecosystem support.", "Eligible startups, founders, and aspiring entrepreneurs.", "Access recognition, learning, programs, and startup support.", "https://www.startupindia.gov.in", ["startup"]),
  scheme("cgtmse", "self-employed", "CGTMSE", "Credit Guarantee", "Official credit guarantee trust for micro and small enterprises.", "Eligible MSE borrowers through member lending institutions.", "Collateral-free credit guarantee support information.", "https://www.cgtmse.in", ["credit guarantee"]),
  scheme("msme-schemes", "self-employed", "MSME Schemes", "MSME Support", "Official MyMSME portal for MSME scheme discovery.", "Eligible MSMEs and entrepreneurs as per individual scheme rules.", "Find MSME scheme, subsidy, and support links.", "https://my.msme.gov.in/mymsme/Reg/home.aspx", ["msme loans"]),
  scheme("pm-vishwakarma", "self-employed", "PM Vishwakarma", "Artisan Support", "Official portal for artisan recognition, skilling, toolkit, and credit support.", "Eligible traditional artisans and craftspeople as per scheme rules.", "Access official Vishwakarma benefits and application services.", "https://pmvishwakarma.gov.in", ["artisan"]),
  scheme("pm-svanidhi", "self-employed", "PM SVANidhi", "Street Vendor Loan", "Official portal for street vendor working capital loan support.", "Eligible street vendors as per PM SVANidhi rules.", "Access working capital loan and digital incentive information.", "https://pmsvanidhi.mohua.gov.in", ["street vendor"]),
  scheme("gem", "self-employed", "Government e-Marketplace", "Digital Business", "Official public procurement marketplace.", "Eligible sellers and service providers onboarding to GeM.", "Sell goods or services to government buyers through the official marketplace.", "https://gem.gov.in", ["digital business"]),
  scheme("sidbi", "self-employed", "SIDBI MSME Support", "MSME Support", "Official SIDBI portal for MSME promotion, financing, and development support.", "MSMEs and entrepreneurs eligible under SIDBI products or linked programs.", "Access official MSME finance and development support information.", "https://www.sidbi.in", ["sidbi", "msme"], true, "Recommended"),
  scheme("startup-india-seed-fund", "self-employed", "Startup India Seed Fund", "Startup Support", "Official seed fund information under Startup India.", "Eligible DPIIT-recognised startups as per scheme rules.", "Find seed-stage support information through the official Startup India platform.", "https://www.startupindia.gov.in/content/sih/en/startup-scheme.html", ["seed fund", "startup"], true, "Recently Added"),

  scheme("sukanya-samriddhi", "women", "Sukanya Samriddhi Yojana", "Savings Scheme", "Official India Post information for girl child savings scheme.", "Eligible girl child accounts opened by guardians as per SSY rules.", "Long-term savings support for education and future needs.", "https://www.indiapost.gov.in/Financial/Pages/Content/SSY.aspx", ["girl child"]),
  scheme("stand-up-india-women", "women", "Stand-Up India for Women", "Enterprise Loan", "Official portal for bank loans supporting women entrepreneurs.", "Eligible women entrepreneurs as per scheme rules.", "Bank loan guidance for eligible greenfield enterprise projects.", "https://www.standupmitra.in", ["women entrepreneur"]),
  scheme("women-entrepreneurship-platform", "women", "Women Entrepreneurship Platform", "Entrepreneurship Support", "Official WEP portal for women entrepreneurship resources.", "Women entrepreneurs and aspiring entrepreneurs.", "Access mentorship, resources, and ecosystem support.", "https://wep.gov.in", ["wep"]),
  scheme("day-nrlm", "women", "DAY-NRLM / SHG Support", "Self-Help Group Support", "Official rural livelihoods mission supporting SHGs and financial inclusion.", "Eligible rural households and self-help groups under NRLM rules.", "Access SHG, livelihood, and financial inclusion support information.", "https://nrlm.gov.in", ["shg"]),
  scheme("pmmvy", "women", "PM Matru Vandana Yojana", "Maternity Benefit", "Official maternity benefit scheme portal.", "Eligible pregnant women and lactating mothers as per PMMVY rules.", "Access maternity benefit information and services.", "https://pmmvy.wcd.gov.in", ["maternity"]),
  scheme("women-helpline", "women", "Women Helpline Scheme", "Safety & Welfare", "Official Ministry of Women and Child Development information on women helpline support.", "Women seeking emergency or welfare-related support as per helpline rules.", "Find official helpline and support information.", "https://wcd.nic.in/schemes/women-helpline-scheme-2", ["safety"]),
  scheme("beti-bachao-beti-padhao", "women", "Beti Bachao Beti Padhao", "Girl Child Welfare", "Official women and child development program information.", "Citizens and stakeholders covered under girl child welfare initiatives.", "Access official awareness and girl child support information.", "https://wcd.nic.in", ["girl child"]),
  scheme("mahila-samman-savings", "women", "Mahila Samman Savings Certificate", "Savings Scheme", "Official India Post information for Mahila Samman Savings Certificate.", "Eligible women and girl child account holders as per scheme rules.", "Access official women-focused savings scheme information.", "https://www.indiapost.gov.in/Financial/Pages/Content/MSSC.aspx", ["savings", "mahila"], true, "Recommended"),
  scheme("women-msme-support", "women", "Women MSME Support", "MSME Support", "Official MSME scheme discovery for women-led enterprises.", "Women entrepreneurs and MSMEs as per individual scheme rules.", "Find official MSME support and scheme information for enterprises.", "https://my.msme.gov.in/mymsme/Reg/home.aspx", ["women msme", "enterprise"]),

  scheme("senior-citizen-savings-scheme", "senior-citizen", "Senior Citizen Savings Scheme", "Savings Scheme", "Official India Post page for SCSS.", "Eligible senior citizens as per SCSS rules.", "Government-backed savings scheme information.", "https://www.indiapost.gov.in/Financial/Pages/Content/SCSS.aspx", ["scss"]),
  scheme("pension-portals", "senior-citizen", "Pension Portals", "Pension", "Official PFRDA pension information portal.", "Citizens and subscribers eligible under pension scheme rules.", "Access NPS, APY, and pension-related information.", "https://www.pfrda.org.in", ["pfrda"]),
  scheme("atal-pension-yojana-senior", "senior-citizen", "Atal Pension Yojana", "Pension", "Official PFRDA page for APY.", "Eligible subscribers as per APY rules.", "Pension scheme information for retirement planning.", "https://www.pfrda.org.in/web/pfrda/schemes/atal-pension-yojana-apy", ["apy"]),
  scheme("health-insurance-support", "senior-citizen", "Health Insurance Support", "Insurance Awareness", "Official IRDAI policyholder portal.", "Citizens and policyholders seeking official insurance information.", "Learn about health insurance, policyholder rights, and safe insurance practices.", "https://policyholder.gov.in", ["irdai"]),
  scheme("pm-vaya-vandana", "senior-citizen", "PM Vaya Vandana Yojana", "Pension", "LIC official information for PM Vaya Vandana Yojana.", "Senior citizens as per LIC and scheme terms. Check current availability on the official page.", "Official pension scheme information and status from LIC.", "https://licindia.in/pradhan-mantri-vaya-vandana-yojana", ["lic"]),
  scheme("national-social-assistance", "senior-citizen", "National Social Assistance Programme", "Social Pension", "Official NSAP portal for social assistance pension schemes.", "Eligible elderly, widows, and persons with disabilities as per NSAP rules.", "Access official social pension and assistance information.", "https://nsap.nic.in", ["social pension"]),
  scheme("jeevan-pramaan", "senior-citizen", "Jeevan Pramaan", "Digital Life Certificate", "Official digital life certificate service for pensioners.", "Pensioners who need to submit life certificates.", "Generate and manage digital life certificate services.", "https://jeevanpramaan.gov.in", ["life certificate"]),
  scheme("pensioners-portal", "senior-citizen", "Pensioners' Portal", "Pension Services", "Official Department of Pension and Pensioners' Welfare portal.", "Government pensioners and family pensioners seeking official services.", "Access pensioner services, grievances, and official pension information.", "https://pensionersportal.gov.in", ["pensioner"]),
  scheme("ayushman-bharat", "senior-citizen", "Ayushman Bharat PM-JAY", "Health Support", "Official beneficiary portal for PM-JAY health coverage services.", "Eligible beneficiaries as per PM-JAY rules.", "Check eligibility and access official health benefit services.", "https://beneficiary.nha.gov.in", ["health"]),
  scheme("reverse-mortgage-awareness", "senior-citizen", "Reverse Mortgage Awareness", "Elderly Financial Support", "Official RBI public awareness route for safe banking and regulated financial products.", "Senior citizens exploring regulated bank-linked financial products.", "Use official regulator information before considering reverse mortgage or similar products.", "https://rbi.org.in", ["reverse mortgage", "rbi"], true, undefined, "Check terms only with regulated banks and official RBI or bank sources."),

  scheme("jan-dhan-yojana", "others", "Jan Dhan Yojana", "Financial Inclusion", "Official PMJDY portal for basic banking access.", "Eligible citizens seeking basic banking access.", "Information on basic savings accounts, RuPay card, insurance, and inclusion services.", "https://pmjdy.gov.in", ["pmjdy"]),
  
  // New and moved Citizen Schemes
  scheme("meeseva", "citizen", "MeeSeva Services", "Citizen Assistance", "Access government certificates, identity services, revenue services, and citizen assistance through official MeeSeva channels.", "All citizens looking for government service delivery.", "Single window for citizen services and certificates.", "", ["meeseva", "csc"], true, "Recommended", "Please select your state to access the appropriate MeeSeva portal.", {
    labelKey: "findNearbyMeeSeva",
    onClickUrl: "https://www.google.com/maps/search/Nearby+MeeSeva+Centers"
  }),
  scheme("digilocker", "citizen", "DigiLocker", "Digital Documents", "Official Digital India document wallet.", "Citizens needing issued digital documents and certificates.", "Store, access, and share official digital documents securely.", "https://www.digilocker.gov.in", ["documents"]),
  scheme("aadhaar-services", "citizen", "Aadhaar Services", "Identity Services", "Official UIDAI portal for Aadhaar services.", "Residents using Aadhaar enrollment, update, or download services.", "Access official Aadhaar information and resident services.", "https://uidai.gov.in", ["uidai"]),
  scheme("maadhaar", "citizen", "mAadhaar", "Identity Services", "Official UIDAI mobile Aadhaar service information.", "Residents using official Aadhaar mobile services.", "Access official mobile Aadhaar service information and links.", "https://uidai.gov.in", ["aadhaar", "mobile"]),
  scheme("pan-services", "citizen", "PAN Services", "Identity & Documents", "Official NSDL/UTIITSL or Income Tax portal for PAN applications and updates.", "Individuals and entities required to have a Permanent Account Number.", "Apply for a new PAN, correct details, or link PAN with Aadhaar.", "https://www.incometax.gov.in/iec/foportal/", ["pan card", "nsdl", "utiitsl"]),
  scheme("voter-id-services", "citizen", "Voter ID Services", "Identity & Documents", "Official Election Commission of India portal for Voter ID.", "Eligible citizens above 18 years of age.", "Apply for a new Voter ID, correct details, or search electoral roll.", "https://voters.eci.gov.in/", ["epic", "election", "voter id"]),
  scheme("ration-card-services", "citizen", "Ration Card Services", "Identity & Documents", "Official National Food Security Portal or state civil supplies portal.", "Eligible households under NFSA or state schemes.", "Apply for a new ration card or manage details through the One Nation One Ration Card system.", "https://nfsa.gov.in/", ["nfsa", "food security", "ration"]),
  scheme("umang", "citizen", "UMANG", "Government Services", "Official unified platform for government services.", "Citizens looking for services through one official app or web platform.", "Access multiple government services from one official platform.", "https://web.umang.gov.in", ["services"]),
  scheme("dbt-schemes", "citizen", "DBT Services", "Direct Benefit Transfer", "Official DBT Bharat portal.", "Citizens eligible for DBT-linked schemes as per scheme rules.", "Understand official benefit transfer information.", "https://dbtbharat.gov.in", ["benefit transfer"]),
  scheme("income-certificate", "citizen", "Income Certificate", "Certificates", "Official portal to apply for an Income Certificate.", "Citizens requiring proof of income for scholarships or schemes.", "Provides certified proof of annual income.", "", ["income proof", "certificate"]),
  scheme("caste-certificate", "citizen", "Caste Certificate", "Certificates", "Official portal to apply for a Caste/Community Certificate.", "Citizens belonging to reserved categories needing proof for benefits.", "Provides certified proof of community/caste.", "", ["community certificate", "reservation"]),
  scheme("residence-certificate", "citizen", "Residence Certificate", "Certificates", "Official portal to apply for Domicile or Residence Certificate.", "Citizens needing proof of residence for local benefits or admissions.", "Provides certified proof of state/district residence.", "", ["domicile", "nativity"]),
  scheme("birth-certificate", "citizen", "Birth Certificate", "Certificates", "Official portal or municipal service for Birth Certificate.", "Parents or individuals registering a birth.", "Provides official proof of birth and age.", "https://crsorgi.gov.in/", ["birth registration"]),
  scheme("death-certificate", "citizen", "Death Certificate", "Certificates", "Official portal or municipal service for Death Certificate.", "Relatives registering a death.", "Provides official proof of death for legal and financial settlements.", "https://crsorgi.gov.in/", ["death registration"]),
  scheme("land-records", "citizen", "Land Records", "Land Records", "Official state portals for land records (e.g., Bhoomi, Dharani, Bhulekh).", "Landowners needing official land documents.", "View EC, pattadar passbooks, and property records digitally.", "", ["bhoomi", "dharani", "bhulekh", "ec"]),
  scheme("government-certificates", "citizen", "Government Certificates", "Certificates", "General gateway to apply for state and central certificates.", "Citizens requiring various official certificates.", "Single window for certificate applications.", "", ["certificates"]),

  // Remaining Others
  scheme("insurance-schemes", "others", "Insurance Schemes", "Insurance", "Official Jan Suraksha portal for government-linked insurance.", "Eligible bank account holders as per PMJJBY/PMSBY rules.", "Access official life and accident insurance scheme information.", "https://jansuraksha.gov.in", ["pmjjby", "pmsby"]),
  scheme("pension-schemes", "others", "Pension Schemes", "Pension", "Official PFRDA portal for pension scheme information.", "Citizens and subscribers eligible under pension scheme rules.", "Official pension scheme and retirement planning resources.", "https://www.pfrda.org.in", ["nps", "apy"]),
  scheme("myscheme", "others", "myScheme", "Scheme Discovery", "Official government platform for discovering citizen schemes.", "Citizens looking for schemes based on profile and eligibility.", "Find government schemes through an official guided platform.", "https://www.myscheme.gov.in", ["scheme finder"]),
  scheme("india-gov", "others", "National Portal of India", "Citizen Services", "Official national portal for government information and services.", "Citizens seeking official government information and service links.", "Access official central and state government service information.", "https://www.india.gov.in", ["citizen"]),
  scheme("abha", "others", "ABHA Health Account", "Digital Health", "Official Ayushman Bharat Digital Mission ABHA service.", "Citizens who want a digital health account as per ABDM rules.", "Create or manage official digital health identity services.", "https://abha.abdm.gov.in", ["health id"]),
  scheme("sanchar-saathi", "others", "Sanchar Saathi", "Telecom Safety", "Official citizen-centric telecom safety portal.", "Citizens checking mobile connections or reporting lost/stolen devices.", "Access official telecom safety and mobile connection services.", "https://sancharsaathi.gov.in", ["telecom"]),
  scheme("instant-epan", "others", "Instant e-PAN", "Identity & Documents", "Official Income Tax e-Filing service for instant e-PAN.", "Eligible individuals with Aadhaar and linked mobile as per Income Tax portal rules.", "Generate or download e-PAN through the official e-Filing portal.", "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/instant-e-pan/instant-UM", ["pan", "epan"]),
  scheme("csc-services", "others", "Common Service Centres", "Government Services", "Official CSC portal for assisted digital government and citizen services.", "Citizens using CSC access points and eligible village-level entrepreneurs.", "Find official CSC service and access information.", "https://www.csc.gov.in", ["csc", "digital services"]),
  scheme("digital-india", "others", "Digital India", "Digital Services", "Official Digital India programme portal.", "Citizens and institutions using official digital governance initiatives.", "Discover official Digital India services and program information.", "https://www.digitalindia.gov.in", ["digital india"]),
];

export function getSchemesByCategory(categoryId: FinancialInclusionCategoryId) {
  return FINANCIAL_INCLUSION_SCHEMES.filter((scheme) => scheme.category === categoryId);
}
