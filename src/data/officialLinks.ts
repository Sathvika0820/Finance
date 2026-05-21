/**
 * Centralized, verified official links for all Banks, Post Office Services, and Insurance Services.
 * Use only official HTTPS portals. No Google searches, third-party blogs, or fake links.
 * Set to an empty string ("") if the official link is not verified or unavailable.
 */
export const OFFICIAL_LINKS = {
  banks: {
    sbi: "https://sbi.co.in",
    pnb: "https://www.pnbindia.in",
    bob: "https://www.bankofbaroda.in",
    canara: "https://canarabank.com",
    union: "https://www.unionbankofindia.co.in",
    indianbank: "https://www.indianbank.in",
    boi: "https://www.bankofindia.co.in",
    cbi: "https://www.centralbankofindia.co.in",
    iob: "https://www.iob.in",
    uco: "https://www.ucobank.com",
    bom: "https://bankofmaharashtra.in",
    psb: "https://punjabandsindbank.co.in",

    hdfc: "https://www.hdfcbank.com",
    icici: "https://www.icicibank.com",
    axis: "https://www.axisbank.com",
    kotak: "https://www.kotak.com",
    idfc: "https://www.idfcfirstbank.com",
    indusind: "https://www.indusind.com",
    federal: "https://www.federalbank.co.in",
    sib: "https://www.southindianbank.com",
    rbl: "https://www.rblbank.com",
    yes: "https://www.yesbank.in",
    bandhan: "https://www.bandhanbank.com",
    dcb: "https://www.dcbbank.com",

    ausfb: "https://www.aubank.in",
    ujjivan: "https://www.ujjivansfb.in",
    equitas: "https://www.equitasbank.com",
    jana: "https://www.janabank.com",
    suryoday: "https://www.suryodaybank.com",
    esaf: "https://www.esafbank.com",

    airtel: "https://www.airtel.in/bank",
    ippb: "https://www.ippbonline.com",
    fino: "https://www.finobank.com",
    jiopb: "https://www.jiopaymentsbank.com",
  } as Record<string, string>,

  postOffice: {
    "india-post": "https://www.indiapost.gov.in",
    "ippb": "https://www.ippbonline.com",
    "post-office-savings-account": "https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx",
    "recurring-deposit": "https://www.indiapost.gov.in/Financial/Pages/Content/RD.aspx",
    "monthly-income-scheme": "https://www.indiapost.gov.in/Financial/Pages/Content/MIS.aspx",
    "senior-citizen-savings-scheme": "https://www.indiapost.gov.in/Financial/Pages/Content/SCSS.aspx",
    "public-provident-fund": "https://www.indiapost.gov.in/Financial/Pages/Content/PPF.aspx",
    "sukanya-samriddhi-yojana": "https://www.indiapost.gov.in/Financial/Pages/Content/SSY.aspx",
    "national-savings-certificate": "https://www.indiapost.gov.in/Financial/Pages/Content/NSC.aspx",
    "kisan-vikas-patra": "https://www.indiapost.gov.in/Financial/Pages/Content/KVP.aspx",
    "speed-post-tracking": "https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx",
    "postal-life-insurance": "https://pli.indiapost.gov.in",
    "rural-postal-life-insurance": "https://pli.indiapost.gov.in",
  } as Record<string, string>,

  insurance: {
    "lic": "https://licindia.in",
    "sbi-life": "https://www.sbilife.co.in",
    "hdfc-life": "https://www.hdfclife.com",
    "icici-prudential-life": "https://www.iciciprulife.com",
    "max-life": "https://www.maxlifeinsurance.com",
    "bajaj-allianz-life": "https://www.bajajallianzlife.com",
    "tata-aia-life": "https://www.tataaia.com",
    "star-health": "https://www.starhealth.in",
    "niva-bupa-health": "https://www.nivabupa.com",
    "care-health": "https://www.careinsurance.com",
    "new-india-assurance": "https://www.newindia.co.in",
    "oriental-insurance": "https://orientalinsurance.org.in",
    "united-india-insurance": "https://uiic.co.in",
    "national-insurance": "https://nationalinsurance.nic.co.in",
  } as Record<string, string>,
};

/**
 * Retrieves the centralized, verified official link for a specific category and key.
 * Returns the URL if verified, or undefined if it is unverified or empty.
 */
export function getOfficialLink(
  category: keyof typeof OFFICIAL_LINKS,
  id: string
): string | undefined {
  const url = OFFICIAL_LINKS[category]?.[id];
  return url && url.trim() !== "" ? url : undefined;
}
