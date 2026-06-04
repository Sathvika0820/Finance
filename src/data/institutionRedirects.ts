export type InstitutionKind = "bank" | "insurance" | "post_office" | "government";

export interface InstitutionRedirectConfig {
  id: string;
  kind: InstitutionKind;
  name: string;
  website: string;
  androidPackage?: string;
  iosAppId?: string;
  appName?: string;
  deepLink?: string;
  universalLink?: string;
}

const appStore = (id: string) => `https://apps.apple.com/in/app/id${id}`;
const playStore = (pkg: string) => `https://play.google.com/store/apps/details?id=${pkg}`;

export const INSTITUTION_REDIRECTS: Record<string, InstitutionRedirectConfig> = {
  // Banks
  "bank:sbi": {
    id: "sbi",
    kind: "bank",
    name: "State Bank of India",
    website: "https://onlinesbi.sbi",
    androidPackage: "com.sbi.lotusintouch",
    iosAppId: "1208928012",
    appName: "YONO SBI",
    deepLink: "yonosbi://",
    universalLink: "https://yonosbi.sbi",
  },
  "bank:icici": {
    id: "icici",
    kind: "bank",
    name: "ICICI Bank",
    website: "https://www.icicibank.com",
    androidPackage: "com.csam.icici.bank.imobile",
    iosAppId: "375271216",
    appName: "iMobile Pay",
    deepLink: "imobile://",
    universalLink: "https://www.icicibank.com/mobile-banking/imobile-pay.page",
  },
  "bank:hdfc": {
    id: "hdfc",
    kind: "bank",
    name: "HDFC Bank",
    website: "https://www.hdfcbank.com",
    androidPackage: "com.snapwork.hdfc",
    iosAppId: "508401344",
    appName: "HDFC Bank MobileBanking",
    deepLink: "hdfcbank://",
  },
  "bank:axis": {
    id: "axis",
    kind: "bank",
    name: "Axis Bank",
    website: "https://www.axisbank.com",
    androidPackage: "com.axis.mobile",
    iosAppId: "614138258",
    appName: "Axis Mobile",
    deepLink: "axisbank://",
  },
  "bank:pnb": {
    id: "pnb",
    kind: "bank",
    name: "Punjab National Bank",
    website: "https://www.pnbindia.in",
    androidPackage: "com.Version1.pnb",
    iosAppId: "1453268595",
    appName: "PNB ONE",
    deepLink: "pnbone://",
  },
  "bank:bob": {
    id: "bob",
    kind: "bank",
    name: "Bank of Baroda",
    website: "https://www.bankofbaroda.in",
    androidPackage: "com.bankofbaroda.mconnect",
    iosAppId: "981329241",
    appName: "bob World",
    deepLink: "bobworld://",
  },
  "bank:canara": {
    id: "canara",
    kind: "bank",
    name: "Canara Bank",
    website: "https://canarabank.com",
    androidPackage: "com.canarabank.mobil",
    iosAppId: "1612061053",
    appName: "Canara ai1",
    deepLink: "canaraai1://",
  },
  "bank:union": {
    id: "union",
    kind: "bank",
    name: "Union Bank of India",
    website: "https://www.unionbankofindia.co.in",
    androidPackage: "com.infrasofttech.UBI",
    iosAppId: "1573215201",
    appName: "Vyom Union Bank",
    deepLink: "vyomunionbank://",
  },
  "bank:indianbank": {
    id: "indianbank",
    kind: "bank",
    name: "Indian Bank",
    website: "https://www.indianbank.in",
    androidPackage: "com.indianbank.indoasis",
    iosAppId: "1446738947",
    appName: "IndOASIS",
    deepLink: "indoasis://",
  },
  "bank:ippb": {
    id: "ippb",
    kind: "bank",
    name: "India Post Payments Bank",
    website: "https://www.ippbonline.com",
    androidPackage: "com.ippb.cbs",
    iosAppId: "1443657997",
    appName: "IPPB Mobile Banking",
    deepLink: "ippb://",
  },

  // Insurance providers
  "insurance:lic": {
    id: "lic",
    kind: "insurance",
    name: "Life Insurance Corporation of India",
    website: "https://licindia.in",
    androidPackage: "com.lic.liccustomer",
    appName: "LIC Customer",
    deepLink: "liccustomer://",
  },
  "insurance:sbi-life": {
    id: "sbi-life",
    kind: "insurance",
    name: "SBI Life Insurance",
    website: "https://www.sbilife.co.in",
    androidPackage: "com.sbilife.customer",
    appName: "SBI Life Easy Access",
  },
  "insurance:hdfc-life": {
    id: "hdfc-life",
    kind: "insurance",
    name: "HDFC Life Insurance",
    website: "https://www.hdfclife.com",
    androidPackage: "com.hdfclife.instaserv",
    appName: "HDFC Life",
  },
  "insurance:star-health": {
    id: "star-health",
    kind: "insurance",
    name: "Star Health Insurance",
    website: "https://www.starhealth.in",
    androidPackage: "com.starhealth.customer",
    appName: "Star Health",
  },

  // Post office and government financial portals
  "post_office:india-post": {
    id: "india-post",
    kind: "post_office",
    name: "India Post",
    website: "https://www.indiapost.gov.in",
    androidPackage: "info.indiapost",
    appName: "Postinfo",
  },
  "government:digilocker": {
    id: "digilocker",
    kind: "government",
    name: "DigiLocker",
    website: "https://www.digilocker.gov.in",
    androidPackage: "com.digilocker.android",
    iosAppId: "1320618078",
    appName: "DigiLocker",
    deepLink: "digilocker://",
  },
  "government:umang": {
    id: "umang",
    kind: "government",
    name: "UMANG",
    website: "https://web.umang.gov.in",
    androidPackage: "in.gov.umang.negd.g2c",
    iosAppId: "1236448857",
    appName: "UMANG",
    deepLink: "umang://",
  },
  "government:uidai": {
    id: "uidai",
    kind: "government",
    name: "UIDAI",
    website: "https://uidai.gov.in",
    androidPackage: "in.gov.uidai.mAadhaarPlus",
    appName: "mAadhaar",
  },
};

export function getInstitutionRedirect(kind: InstitutionKind, id: string) {
  return INSTITUTION_REDIRECTS[`${kind}:${id}`] ?? null;
}

export function getAndroidStoreUrl(config: InstitutionRedirectConfig) {
  return config.androidPackage ? playStore(config.androidPackage) : "";
}

export function getIosStoreUrl(config: InstitutionRedirectConfig) {
  return config.iosAppId ? appStore(config.iosAppId) : "";
}
