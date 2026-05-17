import { useState, useCallback, useEffect } from "react";

export type AppLanguage = "english" | "hindi" | "telugu";

const translations: Record<AppLanguage, Record<string, string>> = {
  english: {
    settings: "Settings",
    appLanguage: "App Language",
    chooseAppLanguage: "Choose your preferred app language.",
    voiceAssistanceLanguage: "Voice Assistance Language",
    chooseVoiceLanguage: "Choose the language for Voice Assistant.",
    mute: "Mute",
    voiceAssistantActive: "Voice assistant active",
    voiceAssistantMuted: "Voice assistant muted",
    welcomeTo: "WELCOME TO",
    bankHub: "Bank Hub",
    tagline: "One Platform For All Your Banks (OTBI)",
    selectedBanks: "Selected Banks",
    seeAll: "See all",
    addYourBanks: "Add your banks",
    searchBanks: "Search banks...",
    popularBanks: "Popular Banks",
    categories: "Categories",
    publicSector: "Public Sector",
    privateSector: "Private Sector",
    smallFinance: "Small Finance",
    payments: "Payments",
    regionalRural: "Regional Rural",
    cooperative: "Co-operative",
    credentialsNote: "Bank Hub doesn’t store any banking credentials.",
    openWebsite: "Open Website",
    openBankingApp: "Open Banking App",
    servicesOffered: "Services offered",
    bankNotFound: "Bank not found",
    backToAllBanks: "Back to all banks",
    banks: "Banks",
    noBanksSelected: "No banks selected. Add some from the list above!",
    noBanksFound: "No banks found matching your search."
  },
  hindi: {
    settings: "सेटिंग्स",
    appLanguage: "ऐप भाषा",
    chooseAppLanguage: "अपनी पसंदीदा ऐप भाषा चुनें।",
    voiceAssistanceLanguage: "वॉइस असिस्टेंस भाषा",
    chooseVoiceLanguage: "वॉइस असिस्टेंट के लिए भाषा चुनें।",
    mute: "म्यूट",
    voiceAssistantActive: "वॉइस असिस्टेंट चालू है",
    voiceAssistantMuted: "वॉइस असिस्टेंट म्यूट है",
    welcomeTo: "स्वागत है",
    bankHub: "बैंक हब",
    tagline: "आपके सभी बैंकों के लिए एक प्लेटफ़ॉर्म (OTBI)",
    selectedBanks: "चयनित बैंक",
    seeAll: "सभी देखें",
    addYourBanks: "अपने बैंक जोड़ें",
    searchBanks: "बैंक खोजें...",
    popularBanks: "लोकप्रिय बैंक",
    categories: "श्रेणियाँ",
    publicSector: "सार्वजनिक क्षेत्र",
    privateSector: "निजी क्षेत्र",
    smallFinance: "स्मॉल फाइनेंस",
    payments: "पेमेंट्स",
    regionalRural: "क्षेत्रीय ग्रामीण",
    cooperative: "सहकारी",
    credentialsNote: "बैंक हब कोई बैंकिंग क्रेडेंशियल स्टोर नहीं करता।",
    openWebsite: "वेबसाइट खोलें",
    openBankingApp: "बैंकिंग ऐप खोलें",
    servicesOffered: "दी जाने वाली सेवाएँ",
    bankNotFound: "बैंक नहीं मिला",
    backToAllBanks: "सभी बैंकों पर वापस जाएँ",
    banks: "बैंक",
    noBanksSelected: "कोई बैंक चयनित नहीं है। ऊपर दी गई सूची से जोड़ें!",
    noBanksFound: "आपकी खोज से मेल खाने वाला कोई बैंक नहीं मिला।"
  },
  telugu: {
    settings: "సెట్టింగ్స్",
    appLanguage: "యాప్ భాష",
    chooseAppLanguage: "మీకు ఇష్టమైన యాప్ భాషను ఎంచుకోండి.",
    voiceAssistanceLanguage: "వాయిస్ అసిస్టెన్స్ భాష",
    chooseVoiceLanguage: "వాయిస్ అసిస్టెంట్ కోసం భాషను ఎంచుకోండి.",
    mute: "మ్యూట్",
    voiceAssistantActive: "వాయిస్ అసిస్టెంట్ ఆన్లో ఉంది",
    voiceAssistantMuted: "వాయిస్ అసిస్టెంట్ మ్యూట్లో ఉంది",
    welcomeTo: "స్వాగతం",
    bankHub: "బ్యాంక్ హబ్",
    tagline: "మీ అన్ని బ్యాంకుల కోసం ఒకే ప్లాట్ఫారమ్ (OTBI)",
    selectedBanks: "ఎంచుకున్న బ్యాంకులు",
    seeAll: "అన్నీ చూడండి",
    addYourBanks: "మీ బ్యాంకులను జోడించండి",
    searchBanks: "బ్యాంకులను వెతకండి...",
    popularBanks: "ప్రసిద్ధ బ్యాంకులు",
    categories: "వర్గాలు",
    publicSector: "ప్రభుత్వ రంగం",
    privateSector: "ప్రైవేట్ రంగం",
    smallFinance: "స్మాల్ ఫైనాన్స్",
    payments: "పేమెంట్స్",
    regionalRural: "ప్రాంతీయ గ్రామీణ",
    cooperative: "కో-ఆపరేటివ్",
    credentialsNote: "బ్యాంక్ హబ్ ఎలాంటి బ్యాంకింగ్ క్రెడెన్షియల్స్ను నిల్వ చేయదు.",
    openWebsite: "వెబ్సైట్ తెరవండి",
    openBankingApp: "బ్యాంకింగ్ యాప్ తెరవండి",
    servicesOffered: "అందించే సేవలు",
    bankNotFound: "బ్యాంక్ కనుగొనబడలేదు",
    backToAllBanks: "అన్ని బ్యాంకుల జాబితాకు తిరిగి వెళ్ళండి",
    banks: "బ్యాంకులు",
    noBanksSelected: "ఏ బ్యాంకులను ఎంచుకోలేదు. పై జాబితా నుండి జోడించండి!",
    noBanksFound: "మీ శోధనకు సరిపోలే బ్యాంకులు ఏవీ లేవు."
  }
};

export function useTranslation() {
  const [lang, setLangState] = useState<AppLanguage>("english");

  useEffect(() => {
    const stored = localStorage.getItem("bankHubLanguage");
    if (stored === "english" || stored === "hindi" || stored === "telugu") {
      setLangState(stored as AppLanguage);
    }
  }, []);

  const setLang = useCallback((newLang: AppLanguage) => {
    setLangState(newLang);
    localStorage.setItem("bankHubLanguage", newLang);
    window.dispatchEvent(new Event("bankHubLanguageSync"));
  }, []);

  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem("bankHubLanguage");
      if (stored === "english" || stored === "hindi" || stored === "telugu") {
        setLangState(stored as AppLanguage);
      }
    };
    window.addEventListener("bankHubLanguageSync", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("bankHubLanguageSync", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const t = useCallback((key: string) => {
    return translations[lang][key] || translations["english"][key] || key;
  }, [lang]);

  return { t, lang, setLang };
}
