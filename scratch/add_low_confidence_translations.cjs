const fs = require('fs');
const path = require('path');

const NEW_STRINGS = {
  hi: { lowConfidenceDetection: "हमने कुछ संभावित फॉर्म फ़ील्ड का पता लगाया है। कृपया जारी रखने से पहले समीक्षा करें।" },
  te: { lowConfidenceDetection: "మేము కొన్ని సాధ్యమయ్యే ఫారమ్ ఫీల్డ్‌లను కనుగొన్నాము. దయచేసి కొనసాగే ముందు సమీక్షించండి." },
  ta: { lowConfidenceDetection: "சில சாத்தியமான படிவப் புலங்களைக் கண்டறிந்துள்ளோம். தொடர்வதற்கு முன் மதிப்பாய்வு செய்யவும்." },
  kn: { lowConfidenceDetection: "ನಾವು ಕೆಲವು ಸಂಭವನೀಯ ಫಾರ್ಮ್ ಫೀಲ್ಡ್‌ಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿದ್ದೇವೆ. ದಯವಿಟ್ಟು ಮುಂದುವರಿಯುವ ಮೊದಲು ಪರಿಶೀಲಿಸಿ." },
  mr: { lowConfidenceDetection: "आम्ही काही संभाव्य फॉर्म फील्ड शोधले आहेत. कृपया पुढे जाण्यापूर्वी पुनरावलोकन करा." },
  bn: { lowConfidenceDetection: "আমরা কিছু সম্ভাব্য ফর্ম ফিল্ড সনাক্ত করেছি। চালিয়ে যাওয়ার আগে দয়া করে পর্যালোচনা করুন।" },
  gu: { lowConfidenceDetection: "અમને કેટલાક સંભવિત ફોર્મ ફીલ્ડ્સ મળ્યા છે. કૃપા કરીને ચાલુ રાખતા પહેલા સમીક્ષા કરો." },
  pa: { lowConfidenceDetection: "ਅਸੀਂ ਕੁਝ ਸੰਭਾਵਿਤ ਫਾਰਮ ਖੇਤਰਾਂ ਦਾ ਪਤਾ ਲਗਾਇਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਜਾਰੀ ਰੱਖਣ ਤੋਂ ਪਹਿਲਾਂ ਸਮੀਖਿਆ ਕਰੋ।" },
  ur: { lowConfidenceDetection: "ہم نے کچھ ممکنہ فارم فیلڈز کا پتہ لگایا ہے۔ براہ کرم جاری رکھنے سے پہلے جائزہ لیں۔" },
  or: { lowConfidenceDetection: "ଆମେ କିଛି ସମ୍ଭାବ୍ୟ ଫର୍ମ ଫିଲ୍ଡ ଚିହ୍ନଟ କରିଛୁ। ଆଗକୁ ବଢିବା ପୂର୍ବରୁ ଦୟାକରି ସମୀକ୍ଷା କରନ୍ତୁ।" },
  en: { lowConfidenceDetection: "We detected some possible form fields. Please review before continuing." }
};

const translationsDir = path.join(__dirname, '..', 'src', 'translations');

Object.keys(NEW_STRINGS).forEach(lang => {
  const filePath = path.join(translationsDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    Object.assign(data, NEW_STRINGS[lang]);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
});

console.log("lowConfidenceDetection translation added successfully!");
