export const CYBER_FRAUD_HELPLINE = "1930";

export const CYBER_COMPLAINT_PORTAL = {
  name: "National Cyber Crime Reporting Portal",
  officialWebsite: "https://cybercrime.gov.in/",
  verified: true,
};

export const CYBER_FRAUD_WARNING =
  "If money is lost in online fraud, immediately call 1930 and file a complaint on the official cyber crime portal.";

export interface CyberScamCategory {
  id: string;
  title: string;
  description: string;
  icon: "globe" | "message" | "phone" | "qr" | "smartphone" | "key" | "userx" | "link" | "phone-call";
  color: string;
  bg: string;
  steps: string[];
}

export const CYBER_SCAM_CATEGORIES: CyberScamCategory[] = [
  {
    id: "fake-banking-website",
    title: "Fake Banking Website",
    description: "Lookalike URLs that mimic official bank login pages to steal credentials.",
    icon: "globe",
    color: "text-red-500",
    bg: "bg-red-50",
    steps: [
      "Close the suspicious website immediately.",
      "Check the URL carefully. Official bank sites use HTTPS and the exact registered domain.",
      "Never enter OTP, PIN, CVV, UPI PIN, or banking password on an unverified website.",
      "Open your bank website by typing the official address yourself or using the official app.",
      "If credentials were entered, change your password immediately and contact your bank.",
    ],
  },
  {
    id: "fake-sms",
    title: "Fake SMS",
    description: "Fraudulent messages claiming to be from your bank and asking for personal data.",
    icon: "message",
    color: "text-orange-500",
    bg: "bg-orange-50",
    steps: [
      "Do not click links in suspicious SMS messages.",
      "Do not call phone numbers mentioned in suspicious messages.",
      "Banks never ask for OTP, PIN, CVV, UPI PIN, or passwords by SMS.",
      "Block and report the sender.",
      "Contact your bank only through the official website, official app, branch, or card/passbook number.",
    ],
  },
  {
    id: "fake-call",
    title: "Fake Call",
    description: "Callers impersonating bank officials and requesting OTP or account details.",
    icon: "phone",
    color: "text-rose-500",
    bg: "bg-rose-50",
    steps: [
      "Hang up immediately if the caller asks for OTP, PIN, CVV, UPI PIN, or password.",
      "Do not press IVR keys or install apps as instructed by unknown callers.",
      "Do not share card, account, Aadhaar, or PAN details over the call.",
      "Note the phone number and report it to your bank.",
      "If money is lost, call 1930 immediately.",
    ],
  },
  {
    id: "upi-fraud",
    title: "UPI Fraud",
    description: "Fake UPI collect requests, payment reversal scams, and QR code traps.",
    icon: "qr",
    color: "text-purple-500",
    bg: "bg-purple-50",
    steps: [
      "Entering UPI PIN sends money. It is never required to receive money.",
      "Decline unknown collect requests immediately.",
      "Do not scan QR codes to receive refunds, prizes, or support payments.",
      "Report fraudulent UPI IDs in your UPI app and to your bank.",
      "If money is debited, call 1930 and file a cyber complaint.",
    ],
  },
  {
    id: "loan-app-scam",
    title: "Loan App Scam",
    description: "Unofficial apps offering instant loans, charging upfront fees, or harassing borrowers.",
    icon: "smartphone",
    color: "text-amber-500",
    bg: "bg-amber-50",
    steps: [
      "Do not install loan apps from links sent by unknown people.",
      "Do not pay upfront processing fees to unverified lenders.",
      "Check whether the lender is a regulated bank or RBI-regulated financial institution.",
      "Do not grant unnecessary contacts, photos, SMS, or file permissions.",
      "Report abusive or fraudulent loan apps on the official cyber crime portal.",
    ],
  },
  {
    id: "otp-scam",
    title: "OTP Scam",
    description: "Fraudsters trick users into sharing OTPs for unauthorized transactions.",
    icon: "key",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    steps: [
      "Never share OTP with anyone, including people claiming to be bank staff.",
      "Read OTP messages carefully to see the transaction purpose and amount.",
      "Do not approve any transaction you did not start.",
      "Block the contact and inform your bank immediately.",
      "If an unauthorized transaction occurred, call 1930 immediately.",
    ],
  },
  {
    id: "kyc-update-scam",
    title: "KYC Update Scam",
    description: "Messages demanding KYC updates through insecure links, calls, or screen-sharing apps.",
    icon: "userx",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    steps: [
      "Do not click KYC update links received by SMS, WhatsApp, email, or social media.",
      "Do not install screen-sharing or remote-access apps for KYC help.",
      "Visit the official bank website, app, or branch for genuine KYC updates.",
      "Never share OTP, PIN, CVV, Aadhaar OTP, or banking passwords.",
      "Report suspicious KYC requests to your bank and call 1930 if money is lost.",
    ],
  },
  {
    id: "phishing-link",
    title: "Phishing Link",
    description: "Links that imitate official portals to harvest banking credentials.",
    icon: "link",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    steps: [
      "Do not open banking links sent by unknown senders.",
      "Check for misspellings, extra words, and unusual domains.",
      "Never enter credentials after clicking links from email, SMS, or social media.",
      "Use bookmarked official bank websites or official apps.",
      "Report the phishing link to the official cyber crime portal.",
    ],
  },
  {
    id: "fake-customer-care-number",
    title: "Fake Customer Care Number",
    description: "Numbers on unofficial sites or ads claiming to be bank helplines.",
    icon: "phone-call",
    color: "text-teal-600",
    bg: "bg-teal-50",
    steps: [
      "Use customer care numbers only from the official bank website, official app, card, or passbook.",
      "Do not trust numbers shown in search ads, social posts, or forwarded messages.",
      "Official support will never ask for OTP, PIN, CVV, UPI PIN, or banking password.",
      "Do not install remote-access apps when asked by a support caller.",
      "Report fake numbers to your bank and file a complaint if money is lost.",
    ],
  },
];
