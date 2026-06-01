const fs = require('fs');
const path = require('path');

const NEW_STRINGS = {
  hi: {
    formAssistantPro: "एआई फॉर्म असिस्टेंट प्रो",
    formAssistantDesc: "आधिकारिक फॉर्म अपलोड करें, उन्हें आसानी से भरें, एआई मार्गदर्शन प्राप्त करें, और पूर्ण किए गए पीडीएफ डाउनलोड करें।",
    uploadPdfForm: "पीडीएफ फॉर्म अपलोड करें",
    unsupportedPdf: "यह पीडीएफ प्रारूप वर्तमान में स्वचालित फ़ील्ड निष्कर्षण के लिए असमर्थित है।",
    fillForm: "फॉर्म डेटा भरें",
    downloadFilledPdf: "भरा हुआ पीडीएफ डाउनलोड करें",
    autofillCommonDetails: "सामान्य विवरण स्वतः भरें",
    generateFilledPdf: "भरा हुआ पीडीएफ जनरेट करें",
    guidanceNominee: "नॉमिनी वह व्यक्ति है जो आपके दुर्भाग्यपूर्ण निधन के मामले में लाभ प्राप्त करेगा। जैसे, आपका जीवनसाथी या बच्चा।",
    guidanceOccupation: "आपका वर्तमान पेशा या नौकरी का प्रकार। जैसे, वेतनभोगी, स्व-नियोजित, छात्र।",
    guidanceIncome: "करों से पहले एक वर्ष में आपकी कुल कमाई। जैसे, 500000",
    guidanceAccountType: "आप जिस प्रकार का बैंक खाता खोलना चाहते हैं। जैसे, बचत, चालू।"
  },
  te: {
    formAssistantPro: "ఏఐ ఫారమ్ అసిస్టెంట్ ప్రో",
    formAssistantDesc: "అధికారిక ఫారమ్‌లను అప్‌లోడ్ చేయండి, వాటిని సులభంగా పూరించండి, ఏఐ మార్గదర్శకత్వం పొందండి మరియు పూర్తి చేసిన పీడీఎఫ్‌లను డౌన్‌లోడ్ చేయండి.",
    uploadPdfForm: "పీడీఎఫ్ ఫారమ్ అప్‌లోడ్ చేయండి",
    unsupportedPdf: "స్వయంచాలక ఫీల్డ్ వెలికితీత కోసం ఈ పీడీఎఫ్ ఫార్మాట్ ప్రస్తుతం మద్దతు ఇవ్వబడలేదు.",
    fillForm: "ఫారమ్ డేటా పూరించండి",
    downloadFilledPdf: "పూరించిన పీడీఎఫ్ డౌన్‌లోడ్ చేయండి",
    autofillCommonDetails: "సాధారణ వివరాలను స్వయంచాలకంగా పూరించండి",
    generateFilledPdf: "పూరించిన పీడీఎఫ్ సృష్టించండి",
    guidanceNominee: "మీ దురదృష్టవశాత్తూ మరణిస్తే ప్రయోజనాలను పొందే వ్యక్తి నామినీ. ఉదా., మీ జీవిత భాగస్వామి లేదా బిడ్డ.",
    guidanceOccupation: "మీ ప్రస్తుత వృత్తి లేదా ఉద్యోగ రకం. ఉదా., జీతం పొందేవాడు, స్వయం ఉపాధి, విద్యార్థి.",
    guidanceIncome: "పన్నులకు ముందు ఒక సంవత్సరంలో మీ మొత్తం ఆదాయం. ఉదా., 500000",
    guidanceAccountType: "మీరు తెరవాలనుకుంటున్న బ్యాంకు ఖాతా రకం. ఉదా., పొదుపు, కరెంట్."
  },
  ta: {
    formAssistantPro: "ஏஐ படிவ உதவியாளர் புரோ",
    formAssistantDesc: "அதிகாரப்பூர்வ படிவங்களை பதிவேற்றவும், அவற்றை எளிதாக நிரப்பவும், ஏஐ வழிகாட்டுதலைப் பெறவும், முழுமையான பிடிஎஃப்களை பதிவிறக்கவும்.",
    uploadPdfForm: "பிடிஎஃப் படிவத்தை பதிவேற்றவும்",
    unsupportedPdf: "தானியங்கி புல பிரித்தெடுத்தலுக்கு இந்த பிடிஎஃப் வடிவம் தற்போது ஆதரிக்கப்படவில்லை.",
    fillForm: "படிவ தரவை நிரப்பவும்",
    downloadFilledPdf: "நிரப்பப்பட்ட பிடிஎஃபை பதிவிறக்கவும்",
    autofillCommonDetails: "பொதுவான விவரங்களை தானாக நிரப்பவும்",
    generateFilledPdf: "நிரப்பப்பட்ட பிடிஎஃபை உருவாக்கவும்",
    guidanceNominee: "நீங்கள் துரதிர்ஷ்டவசமாக இறக்க நேரிட்டால் பலன்களைப் பெறும் நபர் நாமினி ஆவார். எ.கா., உங்கள் மனைவி அல்லது குழந்தை.",
    guidanceOccupation: "உங்கள் தற்போதைய தொழில் அல்லது வேலை வகை. எ.கா., சம்பளம் பெறுபவர், சுயதொழில், மாணவர்.",
    guidanceIncome: "வரிகளுக்கு முன்பு ஒரு வருடத்தில் உங்கள் மொத்த வருமானம். எ.கா., 500000",
    guidanceAccountType: "நீங்கள் திறக்க விரும்பும் வங்கி கணக்கு வகை. எ.கா., சேமிப்பு, நடப்பு."
  },
  kn: {
    formAssistantPro: "ಎಐ ಫಾರ್ಮ್ ಅಸಿಸ್ಟೆಂಟ್ ಪ್ರೊ",
    formAssistantDesc: "ಅಧಿಕೃತ ಫಾರ್ಮ್‌ಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, ಅವುಗಳನ್ನು ಸುಲಭವಾಗಿ ಭರ್ತಿ ಮಾಡಿ, ಎಐ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ ಮತ್ತು ಪೂರ್ಣಗೊಂಡ ಪಿಡಿಎಫ್‌ಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.",
    uploadPdfForm: "ಪಿಡಿಎಫ್ ಫಾರ್ಮ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    unsupportedPdf: "ಸ್ವಯಂಚಾಲಿತ ಫೀಲ್ಡ್ ಹೊರತೆಗೆಯುವಿಕೆಗಾಗಿ ಈ ಪಿಡಿಎಫ್ ಸ್ವರೂಪವು ಪ್ರಸ್ತುತ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.",
    fillForm: "ಫಾರ್ಮ್ ಡೇಟಾ ಭರ್ತಿ ಮಾಡಿ",
    downloadFilledPdf: "ಭರ್ತಿ ಮಾಡಿದ ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    autofillCommonDetails: "ಸಾಮಾನ್ಯ ವಿವರಗಳನ್ನು ಸ್ವಯಂ ಭರ್ತಿ ಮಾಡಿ",
    generateFilledPdf: "ಭರ್ತಿ ಮಾಡಿದ ಪಿಡಿಎಫ್ ರಚಿಸಿ",
    guidanceNominee: "ನಿಮ್ಮ ದುರದೃಷ್ಟವಶಾತ್ ನಿಧನದ ಸಂದರ್ಭದಲ್ಲಿ ಪ್ರಯೋಜನಗಳನ್ನು ಪಡೆಯುವ ವ್ಯಕ್ತಿಯೇ ನಾಮಿನಿ. ಉದಾ., ನಿಮ್ಮ ಸಂಗಾತಿ ಅಥವಾ ಮಗು.",
    guidanceOccupation: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ವೃತ್ತಿ ಅಥವಾ ಕೆಲಸದ ಪ್ರಕಾರ. ಉದಾ., ವೇತನ ಪಡೆಯುವವರು, ಸ್ವಯಂ ಉದ್ಯೋಗಿ, ವಿದ್ಯಾರ್ಥಿ.",
    guidanceIncome: "ತೆರಿಗೆಗಳಿಗಿಂತ ಮೊದಲು ಒಂದು ವರ್ಷದಲ್ಲಿ ನಿಮ್ಮ ಒಟ್ಟು ಗಳಿಕೆ. ಉದಾ., 500000",
    guidanceAccountType: "ನೀವು ತೆರೆಯಲು ಬಯಸುವ ಬ್ಯಾಂಕ್ ಖಾತೆ ಪ್ರಕಾರ. ಉದಾ., ಉಳಿತಾಯ, ಚಾಲ್ತಿ."
  },
  mr: {
    formAssistantPro: "एआय फॉर्म असिस्टंट प्रो",
    formAssistantDesc: "अधिकृत फॉर्म अपलोड करा, ते सहज भरा, एआय मार्गदर्शन मिळवा आणि पूर्ण झालेले पीडीएफ डाउनलोड करा.",
    uploadPdfForm: "पीडीएफ फॉर्म अपलोड करा",
    unsupportedPdf: "हे पीडीएफ स्वरूप सध्या स्वयंचलित फील्ड काढण्यासाठी असमर्थित आहे.",
    fillForm: "फॉर्म डेटा भरा",
    downloadFilledPdf: "भरलेले पीडीएफ डाउनलोड करा",
    autofillCommonDetails: "सामान्य तपशील आपोआप भरा",
    generateFilledPdf: "भरलेले पीडीएफ तयार करा",
    guidanceNominee: "तुमच्या दुर्दैवी निधनाच्या बाबतीत ज्याला लाभ मिळेल ती व्यक्ती नॉमिनी आहे. उदा., तुमचा जोडीदार किंवा मूल.",
    guidanceOccupation: "तुमचा सध्याचा व्यवसाय किंवा नोकरीचा प्रकार. उदा., पगारदार, स्वयंरोजगार, विद्यार्थी.",
    guidanceIncome: "करापूर्वी एका वर्षातील तुमची एकूण कमाई. उदा., ५०००००",
    guidanceAccountType: "तुम्हाला उघडायचा असलेला बँक खाते प्रकार. उदा., बचत, चालू."
  },
  bn: {
    formAssistantPro: "এআই ফর্ম অ্যাসিস্ট্যান্ট প্রো",
    formAssistantDesc: "অফিসিয়াল ফর্ম আপলোড করুন, সহজে পূরণ করুন, এআই গাইডেন্স পান এবং সম্পূর্ণ পিডিএফ ডাউনলোড করুন।",
    uploadPdfForm: "পিডিএফ ফর্ম আপলোড করুন",
    unsupportedPdf: "এই পিডিএফ ফর্ম্যাটটি বর্তমানে স্বয়ংক্রিয় ফিল্ড নিষ্কাশনের জন্য অসমর্থিত।",
    fillForm: "ফর্ম ডেটা পূরণ করুন",
    downloadFilledPdf: "পূরণ করা পিডিএফ ডাউনলোড করুন",
    autofillCommonDetails: "সাধারণ বিবরণ স্বয়ংক্রিয়ভাবে পূরণ করুন",
    generateFilledPdf: "পূরণ করা পিডিএফ তৈরি করুন",
    guidanceNominee: "আপনার দুর্ভাগ্যজনক মৃত্যুর ক্ষেত্রে যে ব্যক্তি সুবিধা পাবেন তিনি হলেন নমিনি। উদাঃ, আপনার স্বামী/স্ত্রী বা সন্তান।",
    guidanceOccupation: "আপনার বর্তমান পেশা বা চাকরির ধরন। উদাঃ, বেতনভোগী, স্বনিযুক্ত, ছাত্র।",
    guidanceIncome: "করের আগে এক বছরে আপনার মোট উপার্জন। উদাঃ, 500000",
    guidanceAccountType: "আপনি যে ধরনের ব্যাঙ্ক অ্যাকাউন্ট খুলতে চান। উদাঃ, সঞ্চয়, চলতি।"
  },
  gu: {
    formAssistantPro: "એઆઈ ફોર્મ આસિસ્ટન્ટ પ્રો",
    formAssistantDesc: "સત્તાવાર ફોર્મ અપલોડ કરો, તેમને સરળતાથી ભરો, એઆઈ માર્ગદર્શન મેળવો અને પૂર્ણ કરેલા પીડીએફ ડાઉનલોડ કરો.",
    uploadPdfForm: "પીડીએફ ફોર્મ અપલોડ કરો",
    unsupportedPdf: "આ પીડીએફ ફોર્મેટ હાલમાં સ્વચાલિત ફીલ્ડ નિષ્કર્ષણ માટે અસમર્થિત છે.",
    fillForm: "ફોર્મ ડેટા ભરો",
    downloadFilledPdf: "ભરેલું પીડીએફ ડાઉનલોડ કરો",
    autofillCommonDetails: "સામાન્ય વિગતો આપમેળે ભરો",
    generateFilledPdf: "ભરેલું પીડીએફ બનાવો",
    guidanceNominee: "તમારા દુર્ભાગ્યપૂર્ણ અવસાનના કિસ્સામાં લાભ મેળવનાર વ્યક્તિ નોમિની છે. દા.ત., તમારા જીવનસાથી અથવા બાળક.",
    guidanceOccupation: "તમારો વર્તમાન વ્યવસાય અથવા નોકરીનો પ્રકાર. દા.ત., પગારદાર, સ્વ-રોજગાર, વિદ્યાર્થી.",
    guidanceIncome: "કરવેરા પહેલાં એક વર્ષમાં તમારી કુલ કમાણી. દા.ત., 500000",
    guidanceAccountType: "તમે જે પ્રકારનું બેંક ખાતું ખોલવા માંગો છો. દા.ત., બચત, ચાલુ."
  },
  pa: {
    formAssistantPro: "ਏਆਈ ਫਾਰਮ ਅਸਿਸਟੈਂਟ ਪ੍ਰੋ",
    formAssistantDesc: "ਅਧਿਕਾਰਤ ਫਾਰਮ ਅਪਲੋਡ ਕਰੋ, ਉਨ੍ਹਾਂ ਨੂੰ ਆਸਾਨੀ ਨਾਲ ਭਰੋ, ਏਆਈ ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਾਪਤ ਕਰੋ, ਅਤੇ ਪੂਰੇ ਕੀਤੇ ਪੀਡੀਐਫ ਡਾਊਨਲੋਡ ਕਰੋ।",
    uploadPdfForm: "ਪੀਡੀਐਫ ਫਾਰਮ ਅਪਲੋਡ ਕਰੋ",
    unsupportedPdf: "ਇਹ ਪੀਡੀਐਫ ਫਾਰਮੈਟ ਵਰਤਮਾਨ ਵਿੱਚ ਆਟੋਮੈਟਿਕ ਫੀਲਡ ਐਕਸਟਰੈਕਸ਼ਨ ਲਈ ਅਸਮਰਥਿਤ ਹੈ।",
    fillForm: "ਫਾਰਮ ਡੇਟਾ ਭਰੋ",
    downloadFilledPdf: "ਭਰਿਆ ਪੀਡੀਐਫ ਡਾਊਨਲੋਡ ਕਰੋ",
    autofillCommonDetails: "ਆਮ ਵੇਰਵੇ ਆਟੋ ਫਿਲ ਕਰੋ",
    generateFilledPdf: "ਭਰਿਆ ਪੀਡੀਐਫ ਬਣਾਓ",
    guidanceNominee: "ਨਾਮਜ਼ਦ ਵਿਅਕਤੀ ਉਹ ਹੈ ਜੋ ਤੁਹਾਡੀ ਬਦਕਿਸਮਤ ਮੌਤ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਲਾਭ ਪ੍ਰਾਪਤ ਕਰੇਗਾ। ਜਿਵੇਂ, ਤੁਹਾਡਾ ਜੀਵਨ ਸਾਥੀ ਜਾਂ ਬੱਚਾ।",
    guidanceOccupation: "ਤੁਹਾਡਾ ਮੌਜੂਦਾ ਪੇਸ਼ਾ ਜਾਂ ਨੌਕਰੀ ਦੀ ਕਿਸਮ। ਜਿਵੇਂ, ਤਨਖਾਹਦਾਰ, ਸਵੈ-ਰੁਜ਼ਗਾਰ, ਵਿਦਿਆਰਥੀ।",
    guidanceIncome: "ਟੈਕਸਾਂ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਸਾਲ ਵਿੱਚ ਤੁਹਾਡੀ ਕੁੱਲ ਕਮਾਈ। ਜਿਵੇਂ, 500000",
    guidanceAccountType: "ਬੈਂਕ ਖਾਤੇ ਦੀ ਕਿਸਮ ਜੋ ਤੁਸੀਂ ਖੋਲ੍ਹਣਾ ਚਾਹੁੰਦੇ ਹੋ। ਜਿਵੇਂ, ਬਚਤ, ਚਾਲੂ।"
  },
  ur: {
    formAssistantPro: "اے آئی فارم اسسٹنٹ پرو",
    formAssistantDesc: "سرکاری فارم اپ لوڈ کریں، انہیں آسانی سے پُر کریں، اے آئی کی رہنمائی حاصل کریں، اور مکمل شدہ پی ڈی ایف ڈاؤن لوڈ کریں۔",
    uploadPdfForm: "پی ڈی ایف فارم اپ لوڈ کریں",
    unsupportedPdf: "یہ پی ڈی ایف فارمیٹ فی الحال خودکار فیلڈ نکالنے کے لیے غیر تعاون یافتہ ہے۔",
    fillForm: "فارم کا ڈیٹا پُر کریں",
    downloadFilledPdf: "بھرا ہوا پی ڈی ایف ڈاؤن لوڈ کریں",
    autofillCommonDetails: "عام تفصیلات خودکار پُر کریں",
    generateFilledPdf: "بھرا ہوا پی ڈی ایف بنائیں",
    guidanceNominee: "نامزد شخص وہ ہے جو آپ کی بدقسمت موت کی صورت میں فوائد حاصل کرے گا۔ مثلاً، آپ کا شریک حیات یا بچہ۔",
    guidanceOccupation: "آپ کا موجودہ پیشہ یا نوکری کی قسم۔ مثلاً، تنخواہ دار، خود روزگار، طالب علم۔",
    guidanceIncome: "ٹیکس سے پہلے ایک سال میں آپ کی کل کمائی۔ مثلاً، 500000",
    guidanceAccountType: "وہ بینک اکاؤنٹ جس کی قسم آپ کھولنا چاہتے ہیں۔ مثلاً، بچت، کرنٹ۔"
  },
  or: {
    formAssistantPro: "ଏଆଇ ଫର୍ମ ଆସିଷ୍ଟାଣ୍ଟ ପ୍ରୋ",
    formAssistantDesc: "ଆଧିକାରିକ ଫର୍ମ ଅପଲୋଡ୍ କରନ୍ତୁ, ସହଜରେ ପୂରଣ କରନ୍ତୁ, ଏଆଇ ମାର୍ଗଦର୍ଶନ ପ୍ରାପ୍ତ କରନ୍ତୁ ଏବଂ ପୂର୍ଣ୍ଣ ପିଡିଏଫ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ।",
    uploadPdfForm: "ପିଡିଏଫ୍ ଫର୍ମ ଅପଲୋଡ୍ କରନ୍ତୁ",
    unsupportedPdf: "ଏହି ପିଡିଏଫ୍ ଫର୍ମାଟ୍ ବର୍ତ୍ତମାନ ସ୍ୱୟଂଚାଳିତ ଫିଲ୍ଡ ଏକ୍ସଟ୍ରାକସନ୍ ପାଇଁ ଅସମର୍ଥିତ।",
    fillForm: "ଫର୍ମ ଡାଟା ପୂରଣ କରନ୍ତୁ",
    downloadFilledPdf: "ପୂରଣ ହୋଇଥିବା ପିଡିଏଫ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ",
    autofillCommonDetails: "ସାଧାରଣ ବିବରଣୀ ଅଟୋଫିଲ୍ କରନ୍ତୁ",
    generateFilledPdf: "ପୂରଣ ହୋଇଥିବା ପିଡିଏଫ୍ ପ୍ରସ୍ତୁତ କରନ୍ତୁ",
    guidanceNominee: "ଆପଣଙ୍କର ଦୁର୍ଭାଗ୍ୟବଶତଃ ମୃତ୍ୟୁ ଘଟିଲେ ଯେଉଁ ବ୍ୟକ୍ତି ଲାଭ ପାଇବେ ସେ ହେଉଛନ୍ତି ନୋମିନୀ। ଉଦାହରଣ ସ୍ୱରୂପ, ଆପଣଙ୍କର ସ୍ୱାମୀ/ସ୍ତ୍ରୀ କିମ୍ବା ପିଲା।",
    guidanceOccupation: "ଆପଣଙ୍କର ବର୍ତ୍ତମାନର ପେଶା କିମ୍ବା ଚାକିରିର ପ୍ରକାର। ଉଦାହରଣ ସ୍ୱରୂପ, ଦରମାପ୍ରାପ୍ତ, ସ୍ୱ-ନିଯୁକ୍ତ, ଛାତ୍ର।",
    guidanceIncome: "ଟିକସ ପୂର୍ବରୁ ଗୋଟିଏ ବର୍ଷରେ ଆପଣଙ୍କର ମୋଟ ରୋଜଗାର। ଉଦାହରଣ ସ୍ୱରୂପ, 500000",
    guidanceAccountType: "ଆପଣ ଖୋଲିବାକୁ ଚାହୁଁଥିବା ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟର ପ୍ରକାର। ଉଦାହରଣ ସ୍ୱରୂପ, ସେଭିଙ୍ଗ୍ସ, କରେଣ୍ଟ।"
  },
  en: {
    formAssistantPro: "AI Form Assistant Pro",
    formAssistantDesc: "Upload official forms, fill them easily, get AI guidance, and download completed PDFs.",
    uploadPdfForm: "Upload PDF Form",
    unsupportedPdf: "This PDF format is currently unsupported for automatic field extraction.",
    fillForm: "Fill Form Data",
    downloadFilledPdf: "Download Filled PDF",
    autofillCommonDetails: "Auto Fill Common Details",
    generateFilledPdf: "Generate Filled PDF",
    guidanceNominee: "A nominee is the person who will receive the benefits in case of your unfortunate demise. E.g., Your spouse or child.",
    guidanceOccupation: "Your current profession or job type. E.g., Salaried, Self-employed, Student.",
    guidanceIncome: "Your total earnings in a year before taxes. E.g., 500000",
    guidanceAccountType: "The type of bank account you want to open. E.g., Savings, Current."
  }
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

console.log("Translations added successfully!");
