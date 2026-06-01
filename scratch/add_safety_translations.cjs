const fs = require('fs');

const STRINGS = {
  hi: {
    bankingShieldPro: "बैंकिंग शील्ड प्रो",
    premiumProtection: "प्रीमियम सुरक्षा",
    advancedScamAnalyzer: "उन्नत स्कैम विश्लेषक",
    pasteSuspiciousText: "खतरों को स्कैन करने के लिए संदिग्ध एसएमएस, यूआरएल या ईमेल पेस्ट करें",
    pasteMessageHere: "संदिग्ध संदेश या लिंक यहाँ पेस्ट करें...",
    analyzeThreatLevel: "खतरे के स्तर का विश्लेषण करें",
    confidence: "आत्मविश्वास",
    aiRecommendation: "एआई अनुशंसा"
  },
  te: {
    bankingShieldPro: "బ్యాంకింగ్ షీల్డ్ ప్రో",
    premiumProtection: "ప్రీమియం రక్షణ",
    advancedScamAnalyzer: "అధునాతన స్కామ్ ఎనలైజర్",
    pasteSuspiciousText: "ముప్పులను స్కాన్ చేయడానికి అనుమానాస్పద SMS, URLలు లేదా ఇమెయిల్‌లను అతికించండి",
    pasteMessageHere: "అనుమానాస్పద సందేశం లేదా లింక్‌ను ఇక్కడ అతికించండి...",
    analyzeThreatLevel: "ముప్పు స్థాయిని విశ్లేషించండి",
    confidence: "విశ్వాసం",
    aiRecommendation: "AI సిఫార్సు"
  },
  ta: {
    bankingShieldPro: "பேங்கிங் ஷீல்ட் ப்ரோ",
    premiumProtection: "பிரீமியம் பாதுகாப்பு",
    advancedScamAnalyzer: "மேம்பட்ட ஸ்கேம் அனலைசர்",
    pasteSuspiciousText: "அச்சுறுத்தல்களை ஸ்கேன் செய்ய சந்தேகத்திற்குரிய SMS, URLகள் அல்லது மின்னஞ்சல்களை ஒட்டவும்",
    pasteMessageHere: "சந்தேகத்திற்குரிய செய்தி அல்லது இணைப்பை இங்கே ஒட்டவும்...",
    analyzeThreatLevel: "அச்சுறுத்தல் அளவை பகுப்பாய்வு செய்",
    confidence: "நம்பிக்கை",
    aiRecommendation: "AI பரிந்துரை"
  },
  kn: {
    bankingShieldPro: "ಬ್ಯಾಂಕಿಂಗ್ ಶೀಲ್ಡ್ ಪ್ರೊ",
    premiumProtection: "ಪ್ರೀಮಿಯಂ ರಕ್ಷಣೆ",
    advancedScamAnalyzer: "ಸುಧಾರಿತ ಸ್ಕ್ಯಾಮ್ ವಿಶ್ಲೇಷಕ",
    pasteSuspiciousText: "ಬೆದರಿಕೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಅನುಮಾನಾಸ್ಪದ SMS, URL ಗಳು ಅಥವಾ ಇಮೇಲ್‌ಗಳನ್ನು ಅಂಟಿಸಿ",
    pasteMessageHere: "ಅನುಮಾನಾಸ್ಪದ ಸಂದೇಶ ಅಥವಾ ಲಿಂಕ್ ಅನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ...",
    analyzeThreatLevel: "ಬೆದರಿಕೆ ಮಟ್ಟವನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
    confidence: "ವಿಶ್ವಾಸ",
    aiRecommendation: "AI ಶಿಫಾರಸು"
  },
  mr: {
    bankingShieldPro: "बँकिंग शील्ड प्रो",
    premiumProtection: "प्रीमियम संरक्षण",
    advancedScamAnalyzer: "प्रगत स्कॅम विश्लेषक",
    pasteSuspiciousText: "धोके स्कॅन करण्यासाठी संशयास्पद SMS, URL किंवा ईमेल पेस्ट करा",
    pasteMessageHere: "संशयास्पद संदेश किंवा लिंक येथे पेस्ट करा...",
    analyzeThreatLevel: "धोक्याच्या पातळीचे विश्लेषण करा",
    confidence: "खात्री",
    aiRecommendation: "AI शिफारस"
  },
  bn: {
    bankingShieldPro: "ব্যাঙ্কিং শিল্ড প্রো",
    premiumProtection: "প্রিমিয়াম সুরক্ষা",
    advancedScamAnalyzer: "উন্নত স্ক্যাম বিশ্লেষক",
    pasteSuspiciousText: "হুমকি স্ক্যান করতে সন্দেহজনক SMS, URL বা ইমেল পেস্ট করুন",
    pasteMessageHere: "সন্দেহজনক বার্তা বা লিঙ্কটি এখানে পেস্ট করুন...",
    analyzeThreatLevel: "হুমকির স্তর বিশ্লেষণ করুন",
    confidence: "আত্মবিশ্বাস",
    aiRecommendation: "AI সুপারিশ"
  },
  gu: {
    bankingShieldPro: "બેંકિંગ શીલ્ડ પ્રો",
    premiumProtection: "પ્રીમિયમ સુરક્ષા",
    advancedScamAnalyzer: "અદ્યતન સ્કેમ વિશ્લેષક",
    pasteSuspiciousText: "જોખમો સ્કેન કરવા માટે શંકાસ્પદ SMS, URL અથવા ઇમેઇલ પેસ્ટ કરો",
    pasteMessageHere: "શંકાસ્પદ સંદેશ અથવા લિંક અહીં પેસ્ટ કરો...",
    analyzeThreatLevel: "જોખમ સ્તરનું વિશ્લેષણ કરો",
    confidence: "આત્મવિશ્વાસ",
    aiRecommendation: "AI ભલામણ"
  },
  pa: {
    bankingShieldPro: "ਬੈਂਕਿੰਗ ਸ਼ੀਲਡ ਪ੍ਰੋ",
    premiumProtection: "ਪ੍ਰੀਮੀਅਮ ਸੁਰੱਖਿਆ",
    advancedScamAnalyzer: "ਉੱਨਤ ਸਕੈਮ ਵਿਸ਼ਲੇਸ਼ਕ",
    pasteSuspiciousText: "ਖਤਰਿਆਂ ਨੂੰ ਸਕੈਨ ਕਰਨ ਲਈ ਸ਼ੱਕੀ SMS, URL ਜਾਂ ਈਮੇਲਾਂ ਨੂੰ ਪੇਸਟ ਕਰੋ",
    pasteMessageHere: "ਸ਼ੱਕੀ ਸੰਦੇਸ਼ ਜਾਂ ਲਿੰਕ ਇੱਥੇ ਪੇਸਟ ਕਰੋ...",
    analyzeThreatLevel: "ਖਤਰੇ ਦੇ ਪੱਧਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
    confidence: "ਵਿਸ਼ਵਾਸ",
    aiRecommendation: "AI ਸਿਫ਼ਾਰਿਸ਼"
  },
  ur: {
    bankingShieldPro: "بینکنگ شیلڈ پرو",
    premiumProtection: "پریمیم تحفظ",
    advancedScamAnalyzer: "جدید اسکیم تجزیہ کار",
    pasteSuspiciousText: "خطرات کو اسکین کرنے کے لیے مشکوک SMS، URLs، یا ای میلز چسپاں کریں",
    pasteMessageHere: "مشکوک پیغام یا لنک یہاں چسپاں کریں...",
    analyzeThreatLevel: "خطرے کی سطح کا تجزیہ کریں",
    confidence: "اعتماد",
    aiRecommendation: "AI تجویز"
  },
  or: {
    bankingShieldPro: "ବ୍ୟାଙ୍କିଙ୍ଗ୍ ସିଲ୍ଡ ପ୍ରୋ",
    premiumProtection: "ପ୍ରିମିୟମ୍ ସୁରକ୍ଷା",
    advancedScamAnalyzer: "ଉନ୍ନତ ସ୍କାମ୍ ବିଶ୍ଳେଷକ",
    pasteSuspiciousText: "ବିପଦ ସ୍କାନ୍ କରିବାକୁ ସନ୍ଦେହଜନକ SMS, URL, କିମ୍ବା ଇମେଲ୍ ପେଷ୍ଟ୍ କରନ୍ତୁ",
    pasteMessageHere: "ସନ୍ଦେହଜନକ ବାର୍ତ୍ତା କିମ୍ବା ଲିଙ୍କ୍ ଏଠାରେ ପେଷ୍ଟ୍ କରନ୍ତୁ...",
    analyzeThreatLevel: "ବିପଦ ସ୍ତରର ବିଶ୍ଳେଷଣ କରନ୍ତୁ",
    confidence: "ଆତ୍ମବିଶ୍ୱାସ",
    aiRecommendation: "AI ସୁପାରିଶ"
  },
  en: {
    bankingShieldPro: "Banking Shield Pro",
    premiumProtection: "Premium Protection",
    advancedScamAnalyzer: "Advanced Scam Analyzer",
    pasteSuspiciousText: "Paste suspicious SMS, URLs, or emails to scan for threats",
    pasteMessageHere: "Paste the suspicious message or link here...",
    analyzeThreatLevel: "Analyze Threat Level",
    confidence: "Confidence",
    aiRecommendation: "AI Recommendation"
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
console.log("Updated JSON files with Safety Shield translations");
