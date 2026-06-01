const fs = require('fs');

const STRINGS = {
  hi: {
    settings: "सेटिंग्स",
    closeSettings: "सेटिंग्स बंद करें",
    language: "भाषा",
    chooseAppLanguage: "अपनी पसंदीदा ऐप और वॉइस भाषा चुनें।",
    voiceAssistantMuted: "वॉइस असिस्टेंट म्यूट है",
    mute: "म्यूट",
    voiceAssistantActive: "वॉइस असिस्टेंट सक्रिय है"
  },
  te: {
    settings: "సెట్టింగ్‌లు",
    closeSettings: "సెట్టింగ్‌లు మూసివేయండి",
    language: "భాష",
    chooseAppLanguage: "మీకు ఇష్టమైన యాప్ మరియు వాయిస్ భాషను ఎంచుకోండి.",
    voiceAssistantMuted: "వాయిస్ అసిస్టెంట్ మ్యూట్ చేయబడింది",
    mute: "మ్యూట్",
    voiceAssistantActive: "వాయిస్ అసిస్టెంట్ సక్రియంగా ఉంది"
  },
  ta: {
    settings: "அமைப்புகள்",
    closeSettings: "அமைப்புகளை மூடு",
    language: "மொழி",
    chooseAppLanguage: "உங்களுக்கு விருப்பமான ஆப்ஸ் மற்றும் குரல் மொழியைத் தேர்வுசெய்யவும்.",
    voiceAssistantMuted: "குரல் உதவியாளர் முடக்கப்பட்டுள்ளது",
    mute: "முடக்கு",
    voiceAssistantActive: "குரல் உதவியாளர் செயலில் உள்ளது"
  },
  kn: {
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    closeSettings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಮುಚ್ಚಿ",
    language: "ಭಾಷೆ",
    chooseAppLanguage: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಅಪ್ಲಿಕೇಶನ್ ಮತ್ತು ಧ್ವನಿ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    voiceAssistantMuted: "ಧ್ವನಿ ಸಹಾಯಕರನ್ನು ಮ್ಯೂಟ್ ಮಾಡಲಾಗಿದೆ",
    mute: "ಮ್ಯೂಟ್",
    voiceAssistantActive: "ಧ್ವನಿ ಸಹಾಯಕ ಸಕ್ರಿಯವಾಗಿದೆ"
  },
  mr: {
    settings: "सेटिंग्ज",
    closeSettings: "सेटिंग्ज बंद करा",
    language: "भाषा",
    chooseAppLanguage: "आपली पसंतीची अॅप आणि आवाज भाषा निवडा.",
    voiceAssistantMuted: "व्हॉइस असिस्टंट म्यूट केले आहे",
    mute: "म्यूट",
    voiceAssistantActive: "व्हॉइस असिस्टंट सक्रिय आहे"
  },
  bn: {
    settings: "সেটিংস",
    closeSettings: "সেটিংস বন্ধ করুন",
    language: "ভাষা",
    chooseAppLanguage: "আপনার পছন্দের অ্যাপ এবং ভয়েস ভাষা চয়ন করুন।",
    voiceAssistantMuted: "ভয়েস সহকারী মিউট করা আছে",
    mute: "মিউট",
    voiceAssistantActive: "ভয়েস সহকারী সক্রিয় আছে"
  },
  gu: {
    settings: "સેટિંગ્સ",
    closeSettings: "સેટિંગ્સ બંધ કરો",
    language: "ભાષા",
    chooseAppLanguage: "તમારી પસંદીદા એપ અને વોઇસ ભાષા પસંદ કરો.",
    voiceAssistantMuted: "વોઇસ આસિસ્ટન્ટ મ્યૂટ છે",
    mute: "મ્યૂટ",
    voiceAssistantActive: "વોઇસ આસિસ્ટન્ટ સક્રિય છે"
  },
  pa: {
    settings: "ਸੈਟਿੰਗਾਂ",
    closeSettings: "ਸੈਟਿੰਗਾਂ ਬੰਦ ਕਰੋ",
    language: "ਭਾਸ਼ਾ",
    chooseAppLanguage: "ਆਪਣੀ ਪਸੰਦੀਦਾ ਐਪ ਅਤੇ ਵੌਇਸ ਭਾਸ਼ਾ ਚੁਣੋ।",
    voiceAssistantMuted: "ਵੌਇਸ ਅਸਿਸਟੈਂਟ ਮਿਊਟ ਹੈ",
    mute: "ਮਿਊਟ",
    voiceAssistantActive: "ਵੌਇਸ ਅਸਿਸਟੈਂਟ ਸਰਗਰਮ ਹੈ"
  },
  ur: {
    settings: "ترتیبات",
    closeSettings: "ترتیبات بند کریں",
    language: "زبان",
    chooseAppLanguage: "اپنی پسندیدہ ایپ اور صوتی زبان کا انتخاب کریں۔",
    voiceAssistantMuted: "صوتی معاون خاموش ہے",
    mute: "خاموش کریں",
    voiceAssistantActive: "صوتی معاون فعال ہے"
  },
  or: {
    settings: "ସେଟିଙ୍ଗ୍ସ",
    closeSettings: "ସେଟିଙ୍ଗ୍ସ ବନ୍ଦ କରନ୍ତୁ",
    language: "ଭାଷା",
    chooseAppLanguage: "ଆପଣଙ୍କ ପସନ୍ଦର ଆପ୍ ଏବଂ ଭଏସ୍ ଭାଷା ବାଛନ୍ତୁ।",
    voiceAssistantMuted: "ଭଏସ୍ ଆସିଷ୍ଟାଣ୍ଟ ମ୍ୟୁଟ୍ ଅଛି",
    mute: "ମ୍ୟୁଟ୍",
    voiceAssistantActive: "ଭଏସ୍ ଆସିଷ୍ଟାଣ୍ଟ ସକ୍ରିୟ ଅଛି"
  },
  en: {
    settings: "Settings",
    closeSettings: "Close settings",
    language: "Language",
    chooseAppLanguage: "Choose your preferred app and voice language.",
    voiceAssistantMuted: "Voice assistant is muted",
    mute: "Mute",
    voiceAssistantActive: "Voice assistant is active"
  }
};

for (const [lang, translations] of Object.entries(STRINGS)) {
  const jsonPath = 'src/translations/' + lang + '.json';
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    for (const [key, value] of Object.entries(translations)) {
      data[key] = value;
    }
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  }
}
console.log("Updated JSON files with Language Settings translations");
