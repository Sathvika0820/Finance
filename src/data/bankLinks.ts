export interface BankLinkData {
  website: string;
  androidApp: string;
  iosApp: string;
  deepLink?: string;
}

export const bankLinks: Record<string, BankLinkData> = {
  sbi: {
    website: "https://onlinesbi.sbi/",
    androidApp: "https://play.google.com/store/apps/details?id=com.sbi.YONO",
    iosApp: "https://apps.apple.com/in/app/yono-sbi/id1208928012",
    deepLink: "yonosbi://"
  },
  hdfc: {
    website: "https://netbanking.hdfcbank.com/netbanking/",
    androidApp: "https://play.google.com/store/apps/details?id=com.snapwork.hdfc",
    iosApp: "https://apps.apple.com/in/app/hdfc-bank-mobilebanking/id508401344",
    deepLink: "hdfcmbank://"
  },
  icici: {
    website: "https://www.icicibank.com/",
    androidApp: "https://play.google.com/store/apps/details?id=com.csam.icici.bank.imobile",
    iosApp: "https://apps.apple.com/in/app/imobile-by-icici-bank/id375271216",
    deepLink: "icici://"
  },
  axis: {
    website: "https://www.axisbank.com/",
    androidApp: "https://play.google.com/store/apps/details?id=com.axis.mobile",
    iosApp: "https://apps.apple.com/in/app/axis-mobile/id614138258",
    deepLink: "axis://"
  },
  pnb: {
    website: "https://www.pnbindia.in/",
    androidApp: "https://play.google.com/store/apps/details?id=com.roam.pnb",
    iosApp: "https://apps.apple.com/in/app/pnb-one/id1453268595",
    deepLink: "pnbone://"
  },
  canara: {
    website: "https://canarabank.com/",
    androidApp: "https://play.google.com/store/apps/details?id=com.canarabank.mobil",
    iosApp: "https://apps.apple.com/in/app/canara-ai1-mobile-banking/id1612061053",
    deepLink: "canara://"
  },
  union: {
    website: "https://www.unionbankofindia.co.in/",
    androidApp: "https://play.google.com/store/apps/details?id=com.infrasofttech.UBI",
    iosApp: "https://apps.apple.com/in/app/vyom-union-bank-of-india/id1573215201",
    deepLink: "ubimobile://"
  },
  bob: {
    website: "https://www.bankofbaroda.in/",
    androidApp: "https://play.google.com/store/apps/details?id=com.bankofbaroda.mconnect",
    iosApp: "https://apps.apple.com/in/app/bob-world/id981329241",
    deepLink: "bobworld://"
  },
  indian: {
    website: "https://www.indianbank.in/",
    androidApp: "https://play.google.com/store/apps/details?id=com.indianbank.indoasis",
    iosApp: "https://apps.apple.com/in/app/indoasis/id1446738947",
    deepLink: "indoasis://"
  },
  idfc: {
    website: "https://www.idfcfirstbank.com/",
    androidApp: "https://play.google.com/store/apps/details?id=com.idfcfirstbank.mbanking",
    iosApp: "https://apps.apple.com/in/app/idfc-first-mobile-banking/id1407338304",
    deepLink: "idfcbank://"
  },
  kotak: {
    website: "https://www.kotak.com/",
    androidApp: "https://play.google.com/store/apps/details?id=com.msf.kbank.mobile",
    iosApp: "https://apps.apple.com/in/app/kotak-811-mobile-banking/id622323533",
    deepLink: "kotak811://"
  },
  yes: {
    website: "https://www.yesbank.in/",
    androidApp: "https://play.google.com/store/apps/details?id=com.yesbank",
    iosApp: "https://apps.apple.com/in/app/iris-by-yes-bank/id1527787680",
    deepLink: "yesbank://"
  },
  ippb: {
    website: "https://www.ippbonline.com/",
    androidApp: "https://play.google.com/store/apps/details?id=com.ippb.cbs",
    iosApp: "https://apps.apple.com/in/app/ippb-mobile-banking/id1443657997",
    deepLink: "ippb://"
  }
};
