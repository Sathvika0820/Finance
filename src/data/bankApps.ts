// Official banking app data — package names and Play Store URLs verified.
// Add more banks by adding entries to BANK_APPS below.

export interface BankAppInfo {
  appName: string;
  androidPackage: string;
  playStoreUrl: string;
  // Optional: URI scheme for attempting deep link launch (e.g. "yonosbi://")
  uriScheme?: string;
}

export const BANK_APPS: Record<string, BankAppInfo> = {
  sbi: {
    appName: 'YONO SBI',
    androidPackage: 'com.sbi.lotusintouch',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.sbi.lotusintouch',
    uriScheme: 'yonosbi://',
  },
  icici: {
    appName: 'iMobile Pay',
    androidPackage: 'com.csam.icici.bank.imobile',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.csam.icici.bank.imobile',
    uriScheme: 'imobile://',
  },
  hdfc: {
    appName: 'HDFC Mobile Banking',
    androidPackage: 'com.snapwork.hdfc',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.snapwork.hdfc',
  },
  axis: {
    appName: 'Axis Mobile',
    androidPackage: 'com.axis.mobile',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.axis.mobile',
  },
  pnb: {
    appName: 'PNB One',
    androidPackage: 'com.Version1.pnb',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.Version1.pnb',
  },
  bob: {
    appName: 'bob World',
    androidPackage: 'com.baroda.mpassbook',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.baroda.mpassbook',
  },
  canara: {
    appName: 'Canara ai1',
    androidPackage: 'com.fss.canmobile',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.fss.canmobile',
  },
  union: {
    appName: 'Union Bank Mobile Banking',
    androidPackage: 'com.infrasoft.uboi',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.infrasoft.uboi',
  },
  boi: {
    appName: 'Bank of India Mobile Banking',
    androidPackage: 'com.infrasoft.boi',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.infrasoft.boi',
  },
  bom: {
    appName: 'Maha Mobile',
    androidPackage: 'com.mahabank.mconnect',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mahabank.mconnect',
  },
  indianbank: {
    appName: 'IndOASIS',
    androidPackage: 'com.IndianBank.mobilebanking',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.IndianBank.mobilebanking',
  },
  iob: {
    appName: 'IOB Mobile',
    androidPackage: 'com.iob.iobmobile',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.iob.iobmobile',
  },
  cbi: {
    appName: 'Cent Mobile',
    androidPackage: 'com.CentralBankOfIndia.mobilebanking',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.CentralBankOfIndia.mobilebanking',
  },
  uco: {
    appName: 'UCO mBanking Plus',
    androidPackage: 'com.ucobank.mobileapp',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ucobank.mobileapp',
  },
  federal: {
    appName: 'FedMobile',
    androidPackage: 'com.fedmobile',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.fedmobile',
  },
  indusind: {
    appName: 'IndusMobile',
    androidPackage: 'com.snapwork.indusnet',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.snapwork.indusnet',
  },
  idbi: {
    appName: 'IDBI Bank GO Mobile+',
    androidPackage: 'com.idbi.mobilebanking',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.idbi.mobilebanking',
  },
  idfc: {
    appName: 'IDFC FIRST Bank Mobile Banking',
    androidPackage: 'com.idfcfirstbank.mobileapp',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.idfcfirstbank.mobileapp',
  },
  kotak: {
    appName: 'Kotak Mobile Banking App',
    androidPackage: 'com.msf.kbank.mobile',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.msf.kbank.mobile',
  },
  yesbank: {
    appName: 'YES BANK Mobile Banking App',
    androidPackage: 'com.mobileapp.yesbank',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mobileapp.yesbank',
  },
  rbl: {
    appName: 'RBL MoBank+',
    androidPackage: 'com.rblbank.mobank',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.rblbank.mobank',
  },
  bandhan: {
    appName: 'Bandhan Bank mBandhan',
    androidPackage: 'com.bandhan.mobilebanking',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.bandhan.mobilebanking',
  },
  psb: {
    appName: 'PSB UnIC Mobile Banking',
    androidPackage: 'com.psb.mobilebanking',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.psb.mobilebanking',
  },
};

export function getBankApp(bankId: string): BankAppInfo | null {
  return BANK_APPS[bankId] ?? null;
}
