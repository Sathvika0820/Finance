import { getOfficialLink } from "./officialLinks";

export const bankingSafetyContent = {
  en: {
    title: "Banking Safety Shield",
    subtitle: "Learn how to stay safe while using online banking.",
    fakeWebsite: {
      title: "Fake Banking Website Awareness",
      desc: "Always verify official bank domains before entering credentials.",
      warning: "Warn against lookalike URLs and fake login pages."
    },
    phishing: {
      title: "Phishing / SMS / WhatsApp Scam Awareness",
      desc: "Do not click suspicious links received through SMS, WhatsApp, email, or social media.",
      warning: "Banks never ask for OTP, PIN, CVV, password, or full card details."
    },
    cyberGuidance: {
      title: "RBI / Cyber Safety Guidance",
      desc: "Follow safety guidance from official sources like RBI, CERT-In, and NPCI.",
      points: [
        "Use the RBI Sachet portal for fraud awareness resources.",
        "Report cybercrimes at the National Cyber Crime Portal.",
        "Call the 1930 cyber fraud helpline if you are a victim.",
        "Follow NPCI/UPI safety guidelines."
      ]
    },
    checklist: {
      title: "Safe Banking Checklist",
      items: [
        "Check HTTPS and correct domain",
        "Never share OTP/PIN/CVV/password",
        "Avoid public Wi-Fi for banking",
        "Use official bank app/website only",
        "Report fraud immediately",
        "Keep bank app/browser updated",
        "Enable SMS/email alerts"
      ]
    },
    officialSources: {
      title: "Official safety sources",
      openButton: "Open official source",
      links: [
        { name: "Reserve Bank of India (RBI)", url: getOfficialLink("regulators", "rbi") || "" },
        { name: "National Cyber Crime Portal", url: getOfficialLink("cyberSafety", "cyber-complaint") || "" },
        { name: "CERT-In", url: getOfficialLink("cyberSafety", "cert-in") || "" },
        { name: "NPCI", url: getOfficialLink("cyberSafety", "npci") || "" }
      ]
    }
  },
  hi: {
    title: "बैंकिंग सुरक्षा कवच",
    subtitle: "ऑनलाइन बैंकिंग का उपयोग करते समय सुरक्षित रहना सीखें।",
    fakeWebsite: {
      title: "फर्जी बैंकिंग वेबसाइट जागरूकता",
      desc: "क्रेडेंशियल दर्ज करने से पहले हमेशा आधिकारिक बैंक डोमेन की पुष्टि करें।",
      warning: "मिलते-जुलते URL और नकली लॉगिन पृष्ठों से सावधान रहें।"
    },
    phishing: {
      title: "फ़िशिंग / SMS / WhatsApp स्कैम जागरूकता",
      desc: "SMS, WhatsApp, ईमेल या सोशल मीडिया के माध्यम से प्राप्त संदिग्ध लिंक पर क्लिक न करें।",
      warning: "बैंक कभी भी OTP, PIN, CVV, पासवर्ड या पूर्ण कार्ड विवरण नहीं मांगते हैं।"
    },
    cyberGuidance: {
      title: "RBI / साइबर सुरक्षा मार्गदर्शन",
      desc: "RBI, CERT-In और NPCI जैसे आधिकारिक स्रोतों से सुरक्षा मार्गदर्शन का पालन करें।",
      points: [
        "धोखाधड़ी जागरूकता के लिए RBI सचेत पोर्टल का उपयोग करें।",
        "राष्ट्रीय साइबर अपराध पोर्टल पर साइबर अपराधों की रिपोर्ट करें।",
        "यदि आप शिकार हैं तो 1930 साइबर धोखाधड़ी हेल्पलाइन पर कॉल करें।",
        "NPCI/UPI सुरक्षा दिशानिर्देशों का पालन करें।"
      ]
    },
    checklist: {
      title: "सुरक्षित बैंकिंग चेकलिस्ट",
      items: [
        "HTTPS और सही डोमेन जांचें",
        "OTP/PIN/CVV/पासवर्ड कभी साझा न करें",
        "बैंकिंग के लिए सार्वजनिक वाई-फाई से बचें",
        "केवल आधिकारिक बैंक ऐप/वेबसाइट का उपयोग करें",
        "धोखाधड़ी की तुरंत रिपोर्ट करें",
        "बैंक ऐप/ब्राउज़र को अपडेट रखें",
        "SMS/ईमेल अलर्ट सक्षम करें"
      ]
    },
    officialSources: {
      title: "आधिकारिक सुरक्षा स्रोत",
      openButton: "आधिकारिक स्रोत खोलें",
      links: [
        { name: "भारतीय रिजर्व बैंक (RBI)", url: getOfficialLink("regulators", "rbi") || "" },
        { name: "राष्ट्रीय साइबर अपराध पोर्टल", url: getOfficialLink("cyberSafety", "cyber-complaint") || "" },
        { name: "CERT-In", url: getOfficialLink("cyberSafety", "cert-in") || "" },
        { name: "NPCI", url: getOfficialLink("cyberSafety", "npci") || "" }
      ]
    }
  },
  te: {
    title: "బ్యాంకింగ్ సేఫ్టీ షీల్డ్",
    subtitle: "ఆన్‌లైన్ బ్యాంకింగ్ ఉపయోగిస్తున్నప్పుడు ఎలా సురక్షితంగా ఉండాలో తెలుసుకోండి.",
    fakeWebsite: {
      title: "నకిలీ బ్యాంకింగ్ వెబ్‌సైట్ అవగాహన",
      desc: "వివరాలను నమోదు చేయడానికి ముందు ఎల్లప్పుడూ అధికారిక బ్యాంక్ డొమైన్‌ను ధృవీకరించండి.",
      warning: "పోలిక ఉన్న URLలు మరియు నకిలీ లాగిన్ పేజీల పట్ల జాగ్రత్త వహించండి."
    },
    phishing: {
      title: "ఫిషింగ్ / SMS / WhatsApp స్కామ్ అవగాహన",
      desc: "SMS, WhatsApp, ఇమెయిల్ లేదా సోషల్ మీడియా ద్వారా వచ్చిన అనుమానాస్పద లింక్‌లపై క్లిక్ చేయవద్దు.",
      warning: "బ్యాంకులు ఎప్పుడూ OTP, PIN, CVV, పాస్‌వర్డ్ లేదా పూర్తి కార్డ్ వివరాలను అడగవు."
    },
    cyberGuidance: {
      title: "RBI / సైబర్ భద్రతా మార్గదర్శకత్వం",
      desc: "RBI, CERT-In మరియు NPCI వంటి అధికారిక వనరుల భద్రతా మార్గదర్శకాలను పాటించండి.",
      points: [
        "మోసం అవగాహన కోసం RBI సాచెట్ పోర్టల్‌ను ఉపయోగించండి.",
        "నేషనల్ సైబర్ క్రైమ్ పోర్టల్‌లో సైబర్ నేరాలను నివేదించండి.",
        "మీరు బాధితులైతే 1930 సైబర్ మోసం హెల్ప్‌లైన్‌కు కాల్ చేయండి.",
        "NPCI/UPI భద్రతా మార్గదర్శకాలను పాటించండి."
      ]
    },
    checklist: {
      title: "సురక్షిత బ్యాంకింగ్ చెక్‌లిస్ట్",
      items: [
        "HTTPS మరియు సరైన డొమైన్‌ను తనిఖీ చేయండి",
        "OTP/PIN/CVV/పాస్‌వర్డ్‌ను ఎప్పుడూ పంచుకోకండి",
        "బ్యాంకింగ్ కోసం పబ్లిక్ వై-ఫైని నివారించండి",
        "అధికారిక బ్యాంక్ యాప్/వెబ్‌సైట్‌ను మాత్రమే ఉపయోగించండి",
        "మోసాన్ని వెంటనే నివేదించండి",
        "బ్యాంక్ యాప్/బ్రౌజర్‌ను అప్‌డేట్ చేసి ఉంచండి",
        "SMS/ఇమెయిల్ అలర్ట్‌లను ప్రారంభించండి"
      ]
    },
    officialSources: {
      title: "అధికారిక భద్రతా వనరులు",
      openButton: "అధికారిక వనరును తెరవండి",
      links: [
        { name: "రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా (RBI)", url: getOfficialLink("regulators", "rbi") || "" },
        { name: "నేషనల్ సైబర్ క్రైమ్ పోర్టల్", url: getOfficialLink("cyberSafety", "cyber-complaint") || "" },
        { name: "CERT-In", url: getOfficialLink("cyberSafety", "cert-in") || "" },
        { name: "NPCI", url: getOfficialLink("cyberSafety", "npci") || "" }
      ]
    }
  }
};
