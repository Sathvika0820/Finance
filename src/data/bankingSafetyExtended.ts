import { getOfficialLink } from "./officialLinks";

export const bankingSafetyExtended = {
  en: {
    scamCategories: [
      { id: "fake-website", title: "Fake Banking Website", description: "Beware of look‑alike URLs and fake login pages." },
      { id: "fake-sms", title: "Fake SMS/WhatsApp", description: "Scammers send suspicious messages asking for personal data." },
      { id: "fake-call", title: "Fake Calls", description: "Impersonators claim to be bank officials requesting OTP or credentials." },
      { id: "upi-fraud", title: "UPI Fraud", description: "Unauthorized UPI requests or duplicate transaction alerts." },
      { id: "loan-app-scam", title: "Loan App Scam", description: "Fake loan offers that ask for upfront fees or personal info." },
      { id: "otp-scam", title: "OTP Scam", description: "Requests to share OTPs for verification." },
      { id: "kyc-scam", title: "KYC Update Scam", description: "Fake requests to update KYC details via insecure links." },
      { id: "phishing-link", title: "Phishing Links", description: "Links that mimic official bank URLs to harvest credentials." },
      { id: "fake-customer-care", title: "Fake Customer Care Number", description: "Numbers that claim to be bank helplines but aim to steal info." }
    ],
    emergencyInfo: {
      helpline: "1930",
      complaintUrl: getOfficialLink("cyberSafety", "cyber-complaint") || ""
    },
    checkerPlaceholder: "Paste suspicious text, URL or message here…",
    basicGuidance: [
      "Never share OTP, PIN, CVV, password or full card details.",
      "Verify the website domain (look for https and official bank URL).",
      "Do not click unknown links received via SMS, WhatsApp or email.",
      "If you suspect a scam, contact the 1930 cyber fraud helpline immediately."
    ],
    disclaimer: "This is basic safety guidance, not guaranteed scam detection."
  },
  hi: {
    scamCategories: [
      { id: "fake-website", title: "फ़र्जी बैंकिंग वेबसाइट", description: "समान URL और नकली लॉगिन पेज़ से सावधान रहें।" },
      { id: "fake-sms", title: "फ़र्जी SMS/WhatsApp", description: "धोखेबाज़ व्यक्तिगत डेटा माँगते हैं।" },
      { id: "fake-call", title: "फ़र्जी कॉल", description: "धोखेबाज़ बैंक अधिकारी बनकर OTP या क्रेडेंशियल्स माँगते हैं।" },
      { id: "upi-fraud", title: "UPI धोखा", description: "अनधिकृत UPI अनुरोध या डुप्लिकेट लेनदेन अलर्ट।" },
      { id: "loan-app-scam", title: "लोन ऐप स्कैम", description: "अमान्य लोन ऑफ़र जो अग्रिम शुल्क या निजी जानकारी माँगते हैं।" },
      { id: "otp-scam", title: "OTP स्कैम", description: "OTP साझा करने का अनुरोध।" },
      { id: "kyc-scam", title: "KYC अपडेट स्कैम", description: "असुरक्षित लिंक के माध्यम से नकली KYC अपडेट।" },
      { id: "phishing-link", title: "फ़िशिंग लिंक", description: "ऐसे लिंक जो आधिकारिक बैंक URL की नकल करते हैं।" },
      { id: "fake-customer-care", title: "फ़र्जी कस्टमर केयर नंबर", description: "धोखेबाज़ नंबर जो बैंक हेल्पलाइन होने का दावा करते हैं।" }
    ],
    emergencyInfo: {
      helpline: "1930",
      complaintUrl: getOfficialLink("cyberSafety", "cyber-complaint") || ""
    },
    checkerPlaceholder: "यहाँ संदिग्ध टेक्स्ट, URL या संदेश पेस्ट करें…",
    basicGuidance: [
      "कभी भी OTP, PIN, CVV, पासवर्ड या पूर्ण कार्ड विवरण साझा न करें।",
      "वेबसाइट डोमेन सत्यापित करें (https और आधिकारिक बैंक URL देखें)।",
      "अज्ञात लिंक पर क्लिक न करें, चाहे वह SMS, WhatsApp या ईमेल में हो।",
      "यदि आपको धोखा संदेह है तो तुरंत 1930 साइबर फ़्रॉड हेल्पलाइन पर कॉल करें।"
    ],
    disclaimer: "यह मूल सुरक्षा मार्गदर्शन है, यह धोखा पहचान की गारंटी नहीं देता।"
  }
};
