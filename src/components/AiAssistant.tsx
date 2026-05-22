import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, Mic, MicOff, Volume2, VolumeX, Globe, 
  ArrowRight, ShieldCheck, X, Sparkles, HelpCircle, 
  FileText, Landmark, ShieldAlert, CheckCircle2,
  StopCircle, Play, Info, AlertTriangle
} from "lucide-react";
import { 
  VERIFIED_LOANS, 
  VERIFIED_SCHEMES, 
  VERIFIED_CYBER_SAFETY, 
  getVerifiedBanksForLoan, 
  getSupportedBanksList 
} from "@/data/aiKnowledgeBase";
import { BANKS, getBankDisplayName } from "@/data/banks";
import { SERVICES_DATA } from "@/data/services";
import { VERIFIED_LOAN_COMPARISONS, LoanComparisonEntry } from "@/data/loanData";

// Speech Recognition & Synthesis types
type SpeechRecognitionEvent = {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
};

type SpeechRecognitionType = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

// Types for message
interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  isWarning?: boolean;
  timestamp: Date;
  actionUrl?: string;
  actionLabel?: string;
}

// 7 Languages definition
type Language = "english" | "hindi" | "telugu" | "tamil" | "kannada" | "odia" | "urdu";

const LANGUAGE_LABELS: Record<Language, string> = {
  english: "English",
  hindi: "हिन्दी (Hindi)",
  telugu: "తెలుగు (Telugu)",
  tamil: "தமிழ் (Tamil)",
  kannada: "ಕನ್ನಡ (Kannada)",
  odia: "ଓଡ଼ିଆ (Odia)",
  urdu: "اردو (Urdu)",
};

const LANG_CODES: Record<Language, string> = {
  english: "en-IN",
  hindi: "hi-IN",
  telugu: "te-IN",
  tamil: "ta-IN",
  kannada: "kn-IN",
  odia: "or-IN",
  urdu: "ur-IN",
};

// Multilingual translations for status & error banners
const LOCALIZED_TEXTS = {
  english: {
    welcome: "Hello! I am your BankHub AI Assistant. How can I help you today with bank services, loans, government schemes, or scam safety? Ask me anything!",
    safetyWarning: "For your safety, do not share OTP, PIN, CVV, card numbers, or banking passwords in BankHub.",
    fallback: "I could not verify this from official sources. Please check the official website.",
    micUnsupported: "Voice input is not supported in this browser. Please use text input.",
    micListening: "Listening... Speak now.",
    micProcessing: "Processing speech query...",
    micErrorNoSpeech: "No speech was detected. Please try speaking again.",
    micErrorDenied: "Microphone permission denied. Please allow microphone access in your browser settings.",
    micErrorDefault: "Voice recognition error. Please check your microphone or try text input.",
    ttsUnsupported: "Voice output is not supported on this device.",
    trustBanner: "BankHub does not store banking passwords, OTPs, PINs, or CVV.",
    placeholder: "Ask about schemes, loans, documents...",
    placeholderUnsupported: "Ask me anything... (Voice input unsupported)",
    stopSpeaking: "Stop Speaking",
  },
  hindi: {
    welcome: "नमस्ते! मैं आपका बैंकहब एआई सहायक हूं। आज मैं बैंक सेवाओं, ऋण (लोन), सरकारी योजनाओं या ऑनलाइन धोखाधड़ी से सुरक्षा में आपकी क्या सहायता कर सकता हूं? मुझसे कुछ भी पूछें!",
    safetyWarning: "आपकी सुरक्षा के लिए, बैंकहब में ओटीपी (OTP), पिन (PIN), सीवीवी (CVV), कार्ड नंबर या बैंकिंग पासवर्ड साझा न करें।",
    fallback: "मैं आधिकारिक स्रोतों से इसकी पुष्टि नहीं कर सका। कृपया आधिकारिक बैंक/सरकारी वेबसाइट की जांच करें।",
    micUnsupported: "इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है। कृपया टेक्स्ट इनपुट का उपयोग करें।",
    micListening: "सुन रहा हूँ... अब बोलें।",
    micProcessing: "वॉयस क्वेरी का विश्लेषण किया जा रहा है...",
    micErrorNoSpeech: "कोई आवाज़ नहीं सुनी गई। कृपया दोबारा बोलने का प्रयास करें।",
    micErrorDenied: "माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया अपनी ब्राउज़र सेटिंग्स में माइक्रोफ़ोन एक्सेस की अनुमति दें।",
    micErrorDefault: "आवाज पहचानने में त्रुटि। कृपया अपना माइक जांचें या टेक्स्ट टाइप करें।",
    ttsUnsupported: "इस डिवाइस पर वॉयस आउटपुट समर्थित नहीं है।",
    trustBanner: "बैंकहब बैंकिंग पासवर्ड, ओटीपी, पिन या सीवीवी संग्रहीत नहीं करता है।",
    placeholder: "सरकारी योजनाओं, ऋणों या आवश्यक कागजात के बारे में पूछें...",
    placeholderUnsupported: "मुझसे कुछ भी पूछें... (वॉयस इनपुट असमर्थित)",
    stopSpeaking: "बोलना बंद करें",
  },
  telugu: {
    welcome: "నమస్తే! నేను మీ బ్యాంక్‌హబ్ AI సహాయకుడిని. ఈరోజు నేను మీకు బ్యాంక్ సేవలు, రుణాలు, ప్రభుత్వ పథకాలు లేదా ఆన్‌లైన్ మోసాల నుండి రక్షణ గురించి ఎలా సహాయపడగలను? నన్ను ఏదైనా అడగండి!",
    safetyWarning: "మీ భద్రత కొరకు, బ్యాంక్‌హబ్‌లో ఓటిపి (OTP), పిన్ (PIN), సీవీవీ (CVV), కార్డ్ నంబర్లు లేదా బ్యాంకింగ్ పాస్‌వర్డ్‌లను పంచుకోకండి.",
    fallback: "నేను అధికారిక వనరుల నుండి దీనిని ధృవీకరించలేకపోయాను. దయచేసి అధికారిక బ్యాంక్/ప్రభుత్వ వెబ్‌సైట్‌ను చూడండి.",
    micUnsupported: "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ సపోర్ట్ చేయదు. దयाచేసి టెక్స్ట్ టైప్ చేయండి.",
    micListening: "వింటున్నాను... ఇప్పుడు మాట్లాడండి.",
    micProcessing: "మీ వాయిస్ సమాచారాన్ని విశ్लेషిస్తున్నాను...",
    micErrorNoSpeech: "ఎలాంటి మాటలు గుర్తించబడలేదు. దయచేసి మళ్ళీ మాట్లాడటానికి ప్రయత్నించండి.",
    micErrorDenied: "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేसी బ్రౌజర్ సెట్టింగ్స్‌లో మైక్రోఫోన్ యాక్సెస్ అనుమతించండి.",
    micErrorDefault: "వాయిస్ గుర్తింపు లోపం. దయచేసి మీ మైక్‌ను తనిఖీ చేయండి లేదా టైప్ చేయండి.",
    ttsUnsupported: "ఈ పరికరంలో వాయిస్ అవుట్‌పుట్ సపోర్ट చేయబడదు.",
    trustBanner: "బ్యాంక్‌హబ్ బ్యాంకింగ్ పాస్‌వర్డ్‌లు, ఓటిపిలు, పిన్‌లు లేదా సీవీవీని నిల్వ చేయదు.",
    placeholder: "పథకాలు, రుణాలు, డాక్యుమెంట్ల గురించి అడగండి...",
    placeholderUnsupported: "నన్ను ఏదైనా అడగండి... (వాయిస్ సపోర్ట్ లేదు)",
    stopSpeaking: "మాట్లాడటం ఆపు",
  },
  tamil: {
    welcome: "வணக்கம்! நான் உங்கள் பேங்க்ஹப் AI உதவியாளர். வங்கி சேவைகள், கடன்கள், அரசு திட்டங்கள் या மோசடி பாதுகாப்பு குறித்து உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?",
    safetyWarning: "உங்கள் பாதுகாப்புக்காக, OTP, PIN, CVV, கார்டு எண்கள் அல்லது வங்கி கடவுச்சொற்களை BankHub-இல் பகிர வேண்டாம்.",
    fallback: "அதிகாரப்பூர்வ ஆதாரங்களில் இருந்து இதை என்னால் சரிபார்க்க முடியவில்லை. தயவுசெய்து அதிகாரப்பூர்வ வங்கி/அரசு இணையதளத்தைப் பார்க்கவும்.",
    micUnsupported: "இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. தயவுசெய்து தட்டச்சு செய்யவும்.",
    micListening: "கேட்கிறது... இப்போது பேசுங்கள்.",
    micProcessing: "குரல் வினவலைச் செயலாக்குகிறது...",
    micErrorNoSpeech: "பேச்சு எதுவும் கண்டறியப்படவில்லை. தயவுசெய்து மீண்டும் பேச முயற்சிக்கவும்.",
    micErrorDenied: "மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. தயவுசெய்து அமைப்புகளில் அனுமதிக்கவும்.",
    micErrorDefault: "குரல் அங்கீகார பிழை. தயவுசெய்து மைக்ரோஃபோனைச் சரிபார்க்கவும்.",
    ttsUnsupported: "இந்த சாதனத்தில் குரல் வெளியீடு ஆதரிக்கப்படவில்லை.",
    trustBanner: "BankHub வங்கி கடவுச்சொற்கள், OTP-கள், PIN-கள் அல்லது CVV ஆகியவற்றைச் சேமிக்காது.",
    placeholder: "திட்டங்கள், கடன்கள், ஆவணங்கள் பற்றி கேளுங்கள்...",
    placeholderUnsupported: "எதையும் கேளுங்கள்... (குரல் உள்ளீடு ஆதரிக்கப்படவில்லை)",
    stopSpeaking: "பேசுவதை நிறுத்து",
  },
  kannada: {
    welcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಬ್ಯಾಂಕ್‌ಹಬ್ AI ಸಹಾಯಕ. ಬ್ಯಾಂಕ್ ಸೇವೆಗಳು, ಸಾಲಗಳು, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಅಥವಾ ವಂಚನೆ ತಡೆಗಟ್ಟುವಿಕೆ ಕುರಿತು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    safetyWarning: "ನಿಮ್ಮ ಸುರಕ್ಷತೆಗಾಗಿ, OTP, PIN, CVV, ಕಾರ್ಡ್ ಸಂಖ್ಯೆಗಳು ಅಥವಾ ಬ್ಯಾಂಕಿಂಗ್ ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು BankHub ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
    fallback: "ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ ಇದನ್ನು ಪರಿಶೀಲಿಸಲು ನನಗೆ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಅಧಿಕೃತ ಬ್ಯಾಂಕ್/ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ ಪರಿಶೀಲಿಸಿ.",
    micUnsupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ.",
    micListening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ... ಈಗ ಮಾತನಾಡಿ.",
    micProcessing: "ಧ್ವನಿ ಪ್ರಶ್ನೆಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
    micErrorNoSpeech: "ಯಾವುದೇ ಧ್ವನಿ ಪತ್ತೆಯಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಲು ಪ್ರಯತ್ನಿಸಿ.",
    micErrorDenied: "ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಅನುಮತಿಸಿ.",
    micErrorDefault: "ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ದೋಷ. ದಯವಿಟ್ಟು ಮೈಕ್ರೊಫೋನ್ ಪರಿಶೀಲಿಸಿ.",
    ttsUnsupported: "ಈ ಸಾಧನದಲ್ಲಿ ಧ್ವನಿ ಔಟ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.",
    trustBanner: "ಬ್ಯಾಂಕ್‌ಹಬ್ ಬ್ಯಾಂಕಿಂಗ್ ಪಾಸ್‌ವರ್ಡ್‌ಗಳು, OTP ಗಳು, PIN ಗಳು ಅಥವಾ CVV ಅನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.",
    placeholder: "ಯೋಜನೆಗಳು, ಸಾಲಗಳು, ದಾಖಲೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
    placeholderUnsupported: "ಏನನ್ನಾದರೂ ಕೇಳಿ... (ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ)",
    stopSpeaking: "ಮಾತನಾಡುವುದನ್ನು ನಿಲ್ಲಿಸಿ",
  },
  odia: {
    welcome: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର ବ୍ୟାଙ୍କହବ୍ AI ସହାୟକ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ ବ୍ୟାଙ୍କ ସେବା, ଋଣ, ସରକାରୀ ଯୋଜନା କିମ୍ବା ବ୍ୟାଙ୍କିଙ୍ଗ୍ ଠକେଇରୁ ରକ୍ଷା ପାଇବା ବିଷୟରେ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
    safetyWarning: "ଆପଣଙ୍କ ସୁରକ୍ଷା ପାଇଁ, ବ୍ୟାଙ୍କହବ୍‌ରେ OTP, PIN, CVV, କାର୍ଡ ନମ୍ବର କିମ୍ବା ବ୍ୟାଙ୍କିଙ୍ଗ୍ ପାସୱାର୍ଡ ସେୟାର କରନ୍ତୁ ନାହିଁ।",
    fallback: "ମୁଁ ଅଫିସିଆଲ୍ ଉତ୍ସରୁ ଏହାକୁ ଯାଞ୍ଚ କରିପାରିଲି ନାହିଁ। ଦୟାକରି ଅଫିସିଆଲ୍ ବ୍ୟାଙ୍କ/ସରକାରୀ ୱେବସାଇଟ୍ ଯାଞ୍ଚ କରନ୍ତୁ।",
    micUnsupported: "ଏହି ବ୍ରାଉଜର୍‌ରେ ଭଏସ୍ ଇନପୁଟ୍ ସପୋର୍ଟ କରୁନାହିଁ। ଦୟାକରି ଲେଖନ୍ତୁ।",
    micListening: "ଶୁଣୁଛି... ଏବେ କୁହନ୍ତୁ।",
    micProcessing: "ଭଏସ୍ ପ୍ରଶ୍ନର ପ୍ରକ୍ରିୟାକରଣ ଚାଲିଛି...",
    micErrorNoSpeech: "କୌଣସି ଶବ୍ଦ ଚିହ୍ନଟ ହେଲାନାହିଁ। ଦୟାକରି ପୁଣିଥରେ କହିବାକୁ ଚେଷ୍ଟା କରନ୍ତୁ।",
    micErrorDenied: "ମାଇକ୍ରୋଫୋନ ଅନୁମତି ଅସ୍ୱୀକୃତ। ଦୟାକରି ସେଟିଂସରେ ଅନୁମତି ଦିଅନ୍ତु।",
    micErrorDefault: "ଭଏସ୍ ଚିହ୍ନଟ ଜନିତ ତ୍ରୁଟି। ଦୟାକରି ମାଇକ୍ ଯାଞ୍ಚ କରନ୍ତୁ।",
    ttsUnsupported: "ଏହି ଡିଭାଇସ୍‌ରେ ଭଏସ୍ ଆଉଟପୁଟ୍ ସପୋର୍ଟ କରୁନାହିଁ।",
    trustBanner: "ବ୍ୟାଙ୍କହବ୍ ବ୍ୟାଙ୍କିଙ୍ଗ୍ ପାସୱାର୍ଡ, OTP, PIN କିମ୍ବା CVV ସଂରକ୍ଷିତ ରଖେ ନାହିଁ।",
    placeholder: "ଯୋଜନା, ଋଣ, କାଗଜପତ୍ର ବିଷୟରେ ପଚାରନ୍ତୁ...",
    placeholderUnsupported: "କିଛି ବି ପଚାରନ୍ତୁ... (ଭଏସ୍ ଇନପୁଟ୍ ଅସମର୍ଥ)",
    stopSpeaking: "ଶବ୍ଦ ବନ୍ଦ କରନ୍ତୁ",
  },
  urdu: {
    welcome: "ہیلو! میں آپ کا بینک ہب اے آئی اسسٹنٹ ہوں۔ آج میں بینکنگ سروسز، لون (قرضہ)، سرکاری اسکیموں، یا آن لائن فراڈ سے بچاؤ کے بارے में آپ کی کیا مدد کر سکتا ہوں؟",
    safetyWarning: "آپ کی حفاظت کے لیے، بینک ہب میں OTP، PIN، CVV، کارڈ نمبر یا بینکنگ پاس ورڈ شیئر نہ کریں۔",
    fallback: "میں سرکاری ذرائع سے اس کی تصدیق نہیں کر سکا۔ براہ کرم متعلقہ آفیشل بینک/سرکاری ویب سائٹ دیکھیں۔",
    micUnsupported: "اس براؤزر میں وائس ان پٹ کی سہولت دستیاب نہیں ہے۔ براہ کرم ٹائپ کریں۔",
    micListening: "سن رہا ہوں... اب بولیے۔",
    micProcessing: "آواز کے سوال کا تجزیہ کیا جا رہا ہے...",
    micErrorNoSpeech: "کوئی آواز نہیں سنی گئی۔ براہ کرم دوبارہ بولنے کی کوشش کریں۔",
    micErrorDenied: "مائیکرو فون استعمال کرنے کی اجازت نہیں ہے۔ براؤزر سیٹنگز میں اجازت دیں۔",
    micErrorDefault: "آواز کی شناخت میں خرابی۔ براہ کرم مائیک چیک کریں یا ٹائپ کریں۔",
    ttsUnsupported: "اس ڈیوائس پر آواز کا اخراج (بولنے) کی سہولت دستیاب نہیں ہے۔",
    trustBanner: "بینک ہب بینکنگ پاس ورڈ، OTP، PIN یا CVV محفوظ نہیں کرتا ہے۔",
    placeholder: "اسکیموں، قرضوں یا دستاویزات کے بارے میں پوچھیں...",
    placeholderUnsupported: "مجھ سے کچھ بھی پوچھیں... (وائس ان پٹ دستیاب نہیں)",
    stopSpeaking: "آواز بند کریں",
  }
};

const SUGGESTIONS_DB: Record<Language, { text: string; topic: string }[]> = {
  english: [
    { text: "Which banks provide home loans?", topic: "home_loan" },
    { text: "Show education loan options", topic: "education_loan" },
    { text: "What documents are needed for personal loan?", topic: "personal_docs" },
    { text: "How to report online banking fraud?", topic: "scam_report" },
    { text: "Show student schemes", topic: "student_schemes" },
    { text: "Show post office savings schemes", topic: "post_office_savings" },
    { text: "Which insurance options are available?", topic: "insurance_options" },
    { text: "Which banks are available in BankHub?", topic: "available_banks" }
  ],
  hindi: [
    { text: "कौन से बैंक होम लोन देते हैं?", topic: "home_loan" },
    { text: "शिक्षा ऋण के विकल्प दिखाएं", topic: "education_loan" },
    { text: "पर्सनल लोन के लिए क्या दस्तावेज चाहिए?", topic: "personal_docs" },
    { text: "ऑनलाइन धोखाधड़ी की रिपोर्ट कैसे करें?", topic: "scam_report" },
    { text: "छात्र योजनाएं दिखाएं", topic: "student_schemes" },
    { text: "डाकघर बचत योजनाएं दिखाएं", topic: "post_office_savings" },
    { text: "कौन से बीमा विकल्प उपलब्ध हैं?", topic: "insurance_options" },
    { text: "बैंकहब में कौन से बैंक उपलब्ध हैं?", topic: "available_banks" }
  ],
  telugu: [
    { text: "హోమ్ లోన్ అందించే బ్యాంకులు ఏవి?", topic: "home_loan" },
    { text: "విద్యా రుణాల ఆప్షన్లు చూపించు", topic: "education_loan" },
    { text: "పర్సనల్ లోన్ కోసం ఏ పత్రాలు కావాలి?", topic: "personal_docs" },
    { text: "ఆన్‌లైన్ బ్యాంకింగ్ మోసాలపై ఎలా ఫిర్యాదు చేయాలి?", topic: "scam_report" },
    { text: "విద్యార్థి పథకాలను చూపించు", topic: "student_schemes" },
    { text: "పోస్ట్ ఆఫీస్ పొదుపు పథకాలను చూపించు", topic: "post_office_savings" },
    { text: "ఏ భీమా ఆప్షన్లు అందుబాటులో ఉన్నాయి?", topic: "insurance_options" },
    { text: "బ్యాంక్‌హబ్‌లో ఏ బ్యాంకులు అందుబాటులో ఉన్నాయి?", topic: "available_banks" }
  ],
  tamil: [
    { text: "எந்த வங்கிகள் வீட்டு கடன் வழங்குகின்றன?", topic: "home_loan" },
    { text: "கல்வி கடன் விருப்பங்களைக் காட்டு", topic: "education_loan" },
    { text: "தனிநபர் கடனுக்கு என்ன ஆவணங்கள் தேவை?", topic: "personal_docs" },
    { text: "ஆன்லைன் வங்கி மோசடியை எவ்வாறு புகாரளிப்பது?", topic: "scam_report" },
    { text: "மாணவர் திட்டங்களைக் காட்டு", topic: "student_schemes" },
    { text: "அஞ்சல் அலுவலக சேமிப்பு திட்டங்களைக் காட்டு", topic: "post_office_savings" },
    { text: "என்ன காப்பீட்டு விருப்பங்கள் உள்ளன?", topic: "insurance_options" },
    { text: "பேங்க்ஹப்பில் என்ன வங்கிகள் உள்ளன?", topic: "available_banks" }
  ],
  kannada: [
    { text: "ಯಾವ ಬ್ಯಾಂಕುಗಳು ಗೃಹ ಸಾಲವನ್ನು ನೀಡುತ್ತವೆ?", topic: "home_loan" },
    { text: "ಶಿಕ್ಷಣ ಸಾಲದ ಆಯ್ಕೆಗಳನ್ನು ತೋರಿಸಿ", topic: "education_loan" },
    { text: "ವೈಯಕ್ತಿಕ ಸಾಲಕ್ಕೆ ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?", topic: "personal_docs" },
    { text: "ಆನ್‌ಲೈನ್ ಬ್ಯಾಂಕಿಂಗ್ ವಂಚನೆಯನ್ನು ವರದಿ ಮಾಡುವುದು ಹೇಗೆ?", topic: "scam_report" },
    { text: "ವಿದ್ಯಾರ್ಥಿ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸಿ", topic: "student_schemes" },
    { text: "ಅಂಚೆ ಕಚೇರಿ ಉಳಿತಾಯ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸಿ", topic: "post_office_savings" },
    { text: "ಯಾವ ವಿಮಾ ಆಯ್ಕೆಗಳು ಲಭ್ಯವಿವೆ?", topic: "insurance_options" },
    { text: "ಬ್ಯಾಂಕ್‌ಹಬ್‌ನಲ್ಲಿ ಯಾವ ಬ್ಯಾಂಕುಗಳು ಲಭ್ಯವಿವೆ?", topic: "available_banks" }
  ],
  odia: [
    { text: "କେଉଁ ବ୍ୟାଙ୍କ ଗୃହ ଋଣ ପ୍ରଦାନ କରେ?", topic: "home_loan" },
    { text: "ଶିକ୍ଷା ଋଣ ବିକଳ୍ପ ଦେଖାନ୍ତୁ", topic: "education_loan" },
    { text: "ବ୍ୟକ୍ତିଗତ ଋଣ ପାଇଁ କେଉଁ କାଗଜପତ୍ର ଆବଶ୍ୟକ?", topic: "personal_docs" },
    { text: "ଅନଲାଇନ୍ ବ୍ୟାଙ୍କିଙ୍ଗ୍ ଠକେଇର ଅଭିଯୋଗ କିପରି କରିବେ?", topic: "scam_report" },
    { text: "ଛାତ୍ର ଯୋଜନାଗୁଡ଼ିକ ଦେଖାନ୍ତୁ", topic: "student_schemes" },
    { text: "ଡାକଘର ସଞ୍ಚୟ ଯୋଜନାଗୁଡ଼ିକ ଦେଖାନ୍ତୁ", topic: "post_office_savings" },
    { text: "କେଉଁ ବୀମା ବିକଳ୍ප ଉପଲବ୍ଧ ଅଛି?", topic: "insurance_options" },
    { text: "ବ୍ୟାଙ୍କହବ୍‌ରେ କେଉଁ ବ୍ୟାଙ୍କ ଉପଲବ୍ଧ ଅଛି?", topic: "available_banks" }
  ],
  urdu: [
    { text: "کون سے بینک ہوم لون دیتے ہیں؟", topic: "home_loan" },
    { text: "ایجوکیشن لون کے اختیارات دکھائیں", topic: "education_loan" },
    { text: "پرسنل لون کے لیے کن دستاویزات کی ضرورت ہے؟", topic: "personal_docs" },
    { text: "آن لائن بینکنگ فراڈ کی شکایت کیسے کریں؟", topic: "scam_report" },
    { text: "اسٹوڈنٹ اسکیمیں دکھائیں", topic: "student_schemes" },
    { text: "پوسٹ آفس بچت اسکیمیں دکھائیں", topic: "post_office_savings" },
    { text: "کون سے انشورنس اختیارات دستیاب ہیں؟", topic: "insurance_options" },
    { text: "بینک ہب میں کون سے بینک دستیاب ہیں؟", topic: "available_banks" }
  ]
};

const LOCALIZED_COMPARISON_TEXTS: Record<Language, {
  comparisonHeader: string;
  interestRate: string;
  processingFee: string;
  repaymentPeriod: string;
  notVerified: string;
  checkOfficial: string;
  topApply: string;
  loanDetails: string;
}> = {
  english: {
    comparisonHeader: "🏦 **Verified Loan Comparison** *(Sorted by lowest interest rate first)*:",
    interestRate: "Interest Rate",
    processingFee: "Processing Fee",
    repaymentPeriod: "Repayment Period",
    notVerified: "❌ Official link not verified yet.",
    checkOfficial: "Check official website",
    topApply: "Apply at {bank}",
    loanDetails: "Loan Details & Comparison:"
  },
  hindi: {
    comparisonHeader: "🏦 **सत्यापित ऋण तुलना** *(सबसे कम ब्याज दर पहले के आधार पर वर्गीकृत)*:",
    interestRate: "ब्याज दर",
    processingFee: "प्रसंस्करण शुल्क (Processing Fee)",
    repaymentPeriod: "पुनर्भुगतान अवधि",
    notVerified: "❌ आधिकारिक लिंक अभी सत्यापित नहीं है।",
    checkOfficial: "आधिकारिक वेबसाइट जांचें",
    topApply: "{bank} में आवेदन करें",
    loanDetails: "ऋण विवरण और तुलना:"
  },
  telugu: {
    comparisonHeader: "🏦 **ధృవీకరించబడిన రుణ పోలిక** *(అత్యల్ప వడ్డీ రేటు మొదట క్రమబద్ధీకరించబడింది)*:",
    interestRate: "వడ్డీ రేటు",
    processingFee: "ప్రాసెసింగ్ ఫీజు",
    repaymentPeriod: "తిరిగి చెల్లించే కాలం",
    notVerified: "❌ అధికారಿಕ లింక్ ఇంకా ధృవీకరించబడలేదు.",
    checkOfficial: "అధికారిక వెబ్‌సైట్ చూడండి",
    topApply: "{bank} లో అప్లై చేయండి",
    loanDetails: "రుణ వివరాలు & పోలిక:"
  },
  tamil: {
    comparisonHeader: "🏦 **சரிபார்க்கப்பட்ட கடன் ஒப்பீடு** *(குறைந்த வட்டி விகிதம் முதலில் வரிசைப்படுத்தப்பட்டது)*:",
    interestRate: "வட்டி விகிதம்",
    processingFee: "செயலாக்க கட்டணம் (Processing Fee)",
    repaymentPeriod: "திருப்பிச் செலுத்தும் காலம்",
    notVerified: "❌ அதிகாரப்பூர்வ இணைப்பு இன்னும் சரிபார்க்கப்படவில்லை.",
    checkOfficial: "அதிகாரப்பூர்வ இணையதளத்தைப் பார்க்கவும்",
    topApply: "{bank}-இல் விண்ணப்பிக்கவும்",
    loanDetails: "கடன் விவரங்கள் & ஒப்பீடு:"
  },
  kannada: {
    comparisonHeader: "🏦 **ಪರಿಶೀಲಿಸಿದ ಸಾಲದ ಹೋಲಿಕೆ** *(ಕಡಿಮೆ ಬಡ್ಡಿದರ ಮೊದಲು ವಿಂಗಡಿಸಲಾಗಿದೆ)*:",
    interestRate: "ಬಡ್ಡಿದರ",
    processingFee: "ಸಂಸ್ಕರಣಾ ಶುಲ್ಕ (Processing Fee)",
    repaymentPeriod: "ಮರುಪಾವತಿ ಅವಧಿ",
    notVerified: "❌ ಅಧಿಕೃತ ಲಿಂಕ್ ಇನ್ನೂ ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ.",
    checkOfficial: "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ ಪರಿಶೀಲಿಸಿ",
    topApply: "{bank} ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    loanDetails: "ಸಾಲದ ವಿವರಗಳು & ಹೋಲಿಕೆ:"
  },
  odia: {
    comparisonHeader: "🏦 **ଯାଞ୍ଚ ହୋଇଥିବା ଋଣ ତୁଳନା** *(ସର୍ବନିମ୍ନ ବ୍ୟାଜ ହାର ପ୍ରଥମେ ସଜାଯାଇଛି)*:",
    interestRate: "ବ୍ୟାଜ ହାର",
    processingFee: "ପ୍ରକ୍ରିୟାକରଣ ଶୁଳ୍କ (Processing Fee)",
    repaymentPeriod: "ପୁନର୍ଭୁଗତାନ ଅବଧି",
    notVerified: "❌ ଅଫିସିଆଲ୍ ଲିଙ୍କ୍ ଏପର୍ଯ୍ୟନ୍ତ ଯାଞ୍ଚ ହୋଇନାହିଁ ।",
    checkOfficial: "ଅଫିସିଆଲ୍ ୱେବସାଇଟ୍ ଯାଞ୍ଚ କରନ୍ତು",
    topApply: "{bank} ରେ ଆବେଦନ କରନ୍ତୁ",
    loanDetails: "ଋଣ ବିବରଣୀ & ତୁଳନା:"
  },
  urdu: {
    comparisonHeader: "🏦 **تصدیق شدہ لون موازنہ** *(سب سے کم شرح سود پہلے کی ترتیب سے)*:",
    interestRate: "شرح سود",
    processingFee: "پروسیسنگ فیس",
    repaymentPeriod: "ادائیگی کی مدت",
    notVerified: "❌ آفیشل لنک کی ابھی تصدیق نہیں ہوئی ہے۔",
    checkOfficial: "آفیشل ویب سائٹ چیک کریں",
    topApply: "{bank} میں درخواست دیں",
    loanDetails: "قرض کی تفصیلات اور موازنہ:"
  }
};

const INTENT_TO_LOAN_TYPE: Record<string, string> = {
  homeLoan: "home_loan",
  educationLoan: "education_loan",
  personalLoan: "personal_loan",
  goldLoan: "gold_loan",
  agriLoan: "agriculture_loan",
  vehicleLoan: "vehicle_loan",
  womenEntrepreneurLoan: "women_entrepreneur_loan",
  msmeLoan: "msme_loan",
  businessLoan: "business_loan"
};

const getBankDisplayNameById = (bankId: string, lang: Language): string => {
  const bank = BANKS.find(b => b.id === bankId);
  return bank ? getBankDisplayName(bank, lang) : bankId;
};

const generateLoanComparisonText = (
  detectedIntent: string,
  lang: Language
): { text: string; topBankUrl?: string; topBankLabel?: string } => {
  const loanType = INTENT_TO_LOAN_TYPE[detectedIntent];
  if (!loanType) return { text: "" };

  const entries = VERIFIED_LOAN_COMPARISONS.filter(c => c.loanType === loanType);
  if (entries.length === 0) return { text: "" };

  const sorted = [...entries].sort((a, b) => {
    const rateA = a.interestRate;
    const rateB = b.interestRate;
    if (rateA === 0 && rateB !== 0) return 1;
    if (rateB === 0 && rateA !== 0) return -1;
    return rateA - rateB;
  });

  const texts = LOCALIZED_COMPARISON_TEXTS[lang] || LOCALIZED_COMPARISON_TEXTS.english;
  let markdown = `\n\n${texts.comparisonHeader}\n\n`;

  sorted.forEach((item, index) => {
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    const emojiNum = emojis[index] || "•";
    const bankName = getBankDisplayNameById(item.bankId, lang);
    
    const rateDisplay = item.interestRate === 0
      ? `*${texts.checkOfficial}*`
      : (item.interestRateDisplay[lang] || item.interestRateDisplay["english"] || `${item.interestRate}% p.a.`);
      
    const feeDisplay = item.processingFee[lang] || item.processingFee["english"] || "";
    const tenureDisplay = item.repaymentPeriod[lang] || item.repaymentPeriod["english"] || "";

    markdown += `${emojiNum} **${bankName}**\n`;
    markdown += `   • 📈 **${texts.interestRate}**: ${rateDisplay}\n`;
    if (feeDisplay) {
      markdown += `   • 💳 **${texts.processingFee}**: ${feeDisplay}\n`;
    }
    if (tenureDisplay) {
      markdown += `   • ⏱️ **${texts.repaymentPeriod}**: ${tenureDisplay}\n`;
    }
    
    if (item.officialWebsite) {
      const linkText = lang === "english" ? "Open Portal" :
                       lang === "hindi" ? "पोर्टल खोलें" :
                       lang === "telugu" ? "పోర్టల్ తెరవండి" :
                       lang === "tamil" ? "போர்டல் திறக்கவும்" :
                       lang === "kannada" ? "ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ" :
                       lang === "odia" ? "ପୋର୍ଟାଲ୍ ଖୋଲନ୍ତୁ" :
                       "پورٹل کھولیں";
      markdown += `   • 🔗 **Link**: [${linkText}](${item.officialWebsite})\n`;
    } else {
      markdown += `   • ${texts.notVerified}\n`;
    }
    markdown += `\n`;
  });

  const topVerifiedBank = sorted.find(item => item.officialWebsite !== "");
  let topBankUrl: string | undefined = undefined;
  let topBankLabel: string | undefined = undefined;

  if (topVerifiedBank) {
    topBankUrl = topVerifiedBank.officialWebsite;
    const name = getBankDisplayNameById(topVerifiedBank.bankId, lang);
    topBankLabel = texts.topApply.replace("{bank}", name);
  }

  return { text: markdown, topBankUrl, topBankLabel };
};

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: LOCALIZED_TEXTS.english.welcome,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [activeLang, setActiveLang] = useState<Language>("english");
  const [micState, setMicState] = useState<"idle" | "listening" | "processing" | "error">("idle");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sttSupported, setSttSupported] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const handleSendMessageRef = useRef<(text?: string) => void>(() => {});
  const recognitionRef = useRef<any>(null);

  // Helper to resolve localized dictionary entries
  const getLocalizedValue = (value: Record<string, any> | undefined, lang: Language): string => {
    if (!value) return "";
    return value[lang] || value["english"] || "";
  };

  const exactSensitiveWarning = LOCALIZED_TEXTS.english.safetyWarning;
  const exactFallback = LOCALIZED_TEXTS.english.fallback;

  const isHttpsOfficialUrl = (url?: string) => Boolean(url && /^https:\/\//i.test(url));

  const formatList = (items: string[]) => items.map(item => `- ${item}`).join("\n");

  const localizedServiceName = (service: { name: Record<string, string> }) =>
    service.name[activeLang as keyof typeof service.name] || service.name.english;

  const localizedServiceDescription = (service: { description: Record<string, string> }) =>
    service.description[activeLang as keyof typeof service.description] || service.description.english;

  const containsSensitiveData = (message: string) => {
    const lower = message.toLowerCase();
    const sensitiveKeyword = /\b(otp|one\s*time\s*password|pin|atm\s*pin|upi\s*pin|cvv|cvv2|card\s*(number|no)?|banking\s*password|net\s*banking\s*password|password|passcode)\b/i;
    const aadhaarOrCardLikeNumber = /\b\d{4,16}\b/;
    return sensitiveKeyword.test(lower) || (/(aadhaar|card|upi|pin|otp|password)/i.test(lower) && aadhaarOrCardLikeNumber.test(lower));
  };

  const findBankInMessage = (message: string) => {
    const lower = message.toLowerCase();
    return BANKS.find(bank => {
      const bankNames = [
        bank.id,
        bank.shortName,
        bank.name,
        bank.names.english,
        bank.names.hindi,
        bank.names.telugu
      ].filter(Boolean).map(value => value.toLowerCase());

      return bankNames.some(name => lower.includes(name));
    });
  };

  const findServiceInMessage = (message: string) => {
    const lower = message.toLowerCase();
    return SERVICES_DATA.find(service => {
      const serviceNames = [
        service.id,
        service.name.english,
        service.name.hindi,
        service.name.telugu,
        ...service.keywords
      ].filter(Boolean).map(value => value.toLowerCase());

      return serviceNames.some(name => lower.includes(name));
    });
  };

  const detectVerifiedIntent = (message: string) => {
    const lower = message.toLowerCase();

    if (/\b(official\s*(link|website|url)|website|portal|url|open\s+official|link)\b/.test(lower)) {
      return "officialLink";
    }
    if (/\b(fraud|scam|fake\s*sms|phishing|cyber|cybercrime|upi\s*fraud|spam|fake\s*call|fake\s*message)\b/.test(lower)) {
      return "fraud";
    }
    if (/\b(post\s*office|india\s*post|postal|ippb|speed\s*post|parcel|tracking|savings\s*scheme)\b/.test(lower)) {
      return "postOffice";
    }
    if (/\b(insurance|lic|irdai|policy|premium|claim|health\s*insurance|life\s*insurance|bima)\b/.test(lower)) {
      return "insurance";
    }
    if (/\b(scheme|schemes|student\s*scheme|student\s*schemes|scholarship|vidya\s*lakshmi|vidyalakshmi|yojana)\b/.test(lower)) {
      return "scheme";
    }
    if (/\b(loan|home\s*loan|housing\s*loan|education\s*loan|student\s*loan|personal\s*loan)\b/.test(lower)) {
      return "loan";
    }
    if (/\b(which\s*banks|banks?\s*(are\s*)?available|bank\s*list|supported\s*banks|banks?\s*in\s*bankhub|available\s*banks)\b/.test(lower)) {
      return "bankList";
    }

    return "fallback";
  };

  const getLoanIdFromMessage = (message: string) => {
    const lower = message.toLowerCase();
    if (/\b(home|housing|house)\b/.test(lower)) return "home_loan";
    if (/\b(education|student|study)\b/.test(lower)) return "education_loan";
    if (/\b(personal|unsecured)\b/.test(lower)) return "personal_loan";
    if (/\b(gold|jewel|jewellery|jewelry)\b/.test(lower)) return "gold_loan";
    if (/\b(vehicle|car|auto|two\s*wheeler|bike)\b/.test(lower)) return "vehicle_loan";
    return "";
  };

  const isLoanComparisonRequest = (message: string) => {
    const lower = message.toLowerCase();
    return /\b(compare|comparison|lowest|least|cheapest|best\s*rate|interest\s*rate|rate\s*of\s*interest|roi)\b/.test(lower)
      && /\b(loan|home|housing|education|student|personal|gold|vehicle|car|auto|bike)\b/.test(lower);
  };

  const buildLoanComparisonReply = (message: string): Pick<Message, "text" | "actionUrl" | "actionLabel"> => {
    const loanId = getLoanIdFromMessage(message);
    if (!loanId) {
      return {
        text: "I do not have verified official interest rate data for this yet. Please check the official bank website."
      };
    }

    const comparisonEntries = VERIFIED_LOAN_COMPARISONS
      .filter(entry => entry.loanType === loanId)
      .sort((a, b) => {
        const aHasRate = a.interestRate > 0;
        const bHasRate = b.interestRate > 0;
        if (aHasRate && !bHasRate) return -1;
        if (!aHasRate && bHasRate) return 1;
        if (!aHasRate && !bHasRate) return a.bankName.localeCompare(b.bankName);
        return a.interestRate - b.interestRate;
      });

    if (comparisonEntries.length === 0 || comparisonEntries.every(entry => entry.interestRate <= 0)) {
      return {
        text: "I do not have verified official interest rate data for this yet. Please check the official bank website."
      };
    }

    const labelSource = comparisonEntries[0];
    const loanTypeLabel = labelSource.loanTypeLabel[activeLang] || labelSource.loanTypeLabel.english || loanId.replace(/_/g, " ");
    const rankedLines = comparisonEntries.map((entry, index) => {
      const bank = BANKS.find(item => item.id === entry.bankId);
      const bankName = bank ? getBankDisplayName(bank, activeLang) : entry.bankName;
      const rate = entry.interestRate > 0
        ? (entry.interestRateDisplay[activeLang] || entry.interestRateDisplay.english || `${entry.interestRate}% p.a.`)
        : "Check official website";

      return `${index + 1}. ${bankName} — ${rate}`;
    });

    const lowestVerified = comparisonEntries.find(entry => entry.interestRate > 0);
    const linkedEntry = comparisonEntries.find(entry => isHttpsOfficialUrl(entry.officialWebsite));
    const linkNote = linkedEntry
      ? `\n\nOfficial reference link available for ${BANKS.find(bank => bank.id === linkedEntry.bankId)?.name || linkedEntry.bankName}.`
      : "";

    return {
      text: `Here is the verified ${loanTypeLabel.toLowerCase()} comparison available in BankHub:\n\n${rankedLines.join("\n")}\n\nLowest verified rate is shown first.\nInterest rates may change. Please verify latest details on the official bank website.${linkNote}`,
      actionUrl: linkedEntry?.officialWebsite,
      actionLabel: linkedEntry ? `Open official ${lowestVerified?.bankName || linkedEntry.bankName} loan page` : undefined
    };
  };

  const createVerifiedAssistantReply = (message: string): Pick<Message, "text" | "isWarning" | "actionUrl" | "actionLabel"> => {
    if (containsSensitiveData(message)) {
      return {
        text: exactSensitiveWarning,
        isWarning: true
      };
    }

    if (isLoanComparisonRequest(message)) {
      return buildLoanComparisonReply(message);
    }

    const intent = detectVerifiedIntent(message);

    if (intent === "bankList") {
      const bankNames = BANKS.map(bank => getBankDisplayName(bank, activeLang));
      return {
        text: `BankHub currently has ${bankNames.length} verified bank entries:\n${formatList(bankNames)}\n\nBankHub redirects only to official service websites. No credentials are stored.`
      };
    }

    if (intent === "loan") {
      const loanId = getLoanIdFromMessage(message);
      if (!loanId) {
        const loanNames = VERIFIED_LOANS.map(loan => getLocalizedValue(loan.name, activeLang));
        return {
          text: `Verified loan topics in BankHub data:\n${formatList(loanNames)}\n\nAsk for a specific loan type, such as home loan, education loan, or personal loan.`
        };
      }

      const loan = VERIFIED_LOANS.find(item => item.id === loanId);
      if (!loan) {
        return { text: exactFallback };
      }

      const bankNames = loan.verifiedBanks
        .map(bankId => BANKS.find(bank => bank.id === bankId))
        .filter((bank): bank is NonNullable<typeof bank> => Boolean(bank))
        .map(bank => getBankDisplayName(bank, activeLang));

      return {
        text: `${getLocalizedValue(loan.name, activeLang)} is available in BankHub verified data for these banks:\n${formatList(bankNames)}\n\n${getLocalizedValue(loan.description, activeLang)}\n\nNo interest rate or approval claim is shown here because those must be checked on official bank websites.`,
        actionUrl: isHttpsOfficialUrl(loan.officialInfoPage) ? loan.officialInfoPage : undefined,
        actionLabel: isHttpsOfficialUrl(loan.officialInfoPage) ? "Open official information page" : undefined
      };
    }

    if (intent === "scheme") {
      const studentSchemes = VERIFIED_SCHEMES.filter(scheme => scheme.category === "student");
      const verifiedItems = studentSchemes.length > 0
        ? studentSchemes
        : VERIFIED_LOANS.filter(loan => loan.id === "education_loan").map(loan => ({
            id: loan.id,
            name: loan.name,
            authority: "Vidya Lakshmi / participating official bank portals",
            description: loan.description,
            officialUrl: loan.officialInfoPage
          }));

      if (verifiedItems.length === 0) {
        return { text: exactFallback };
      }

      const lines = verifiedItems.map(item => {
        const name = getLocalizedValue(item.name, activeLang);
        const description = getLocalizedValue(item.description, activeLang);
        return `${name} - ${description} Official source: ${item.authority}.`;
      });

      const firstUrl = verifiedItems.find(item => isHttpsOfficialUrl(item.officialUrl))?.officialUrl;
      return {
        text: `Verified student support found in BankHub local data:\n${formatList(lines)}\n\nPlease verify eligibility, fees, and subsidy rules only on the official website.`,
        actionUrl: firstUrl,
        actionLabel: firstUrl ? "Open official student portal" : undefined
      };
    }

    if (intent === "postOffice") {
      const postServices = SERVICES_DATA.filter(service => service.category === "post_office" && service.isActive && service.sourceAuthority === "official");
      if (postServices.length === 0) {
        return { text: exactFallback };
      }

      const lines = postServices.map(service => `${localizedServiceName(service)} - ${localizedServiceDescription(service)}`);
      const firstUrl = postServices.find(service => isHttpsOfficialUrl(service.officialUrl))?.officialUrl;
      return {
        text: `Official Post Office and India Post services in BankHub:\n${formatList(lines)}\n\nBankHub redirects only to official service websites. No credentials are stored.`,
        actionUrl: firstUrl,
        actionLabel: firstUrl ? "Open official Post Office service" : undefined
      };
    }

    if (intent === "insurance") {
      const insuranceServices = SERVICES_DATA.filter(service => service.category === "insurance" && service.isActive && service.sourceAuthority === "official");
      if (insuranceServices.length === 0) {
        return { text: exactFallback };
      }

      const lines = insuranceServices.map(service => `${localizedServiceName(service)} - ${localizedServiceDescription(service)}`);
      const firstUrl = insuranceServices.find(service => isHttpsOfficialUrl(service.officialUrl))?.officialUrl;
      return {
        text: `Official insurance services in BankHub:\n${formatList(lines)}\n\nUse insurer or regulator websites directly. BankHub does not collect policy numbers, passwords, or payment credentials.`,
        actionUrl: firstUrl,
        actionLabel: firstUrl ? "Open official insurance service" : undefined
      };
    }

    if (intent === "fraud") {
      const safety = VERIFIED_CYBER_SAFETY;
      const steps = safety.recoverySteps[activeLang] || safety.recoverySteps.english || [];
      const tips = safety.tips[activeLang] || safety.tips.english || [];
      return {
        text: `If you received a fake SMS, phishing link, or online banking fraud message, use only official reporting channels.\n\nNational Cyber Crime Helpline: ${safety.helpline}\nOfficial complaint portal: ${safety.complaintPortal}\n\nImmediate steps:\n${formatList(steps)}\n\nSafety reminders:\n${formatList(tips)}\n\nDo not search random helpline numbers. Use official bank or government portals only.`,
        actionUrl: isHttpsOfficialUrl(safety.complaintPortal) ? safety.complaintPortal : undefined,
        actionLabel: "Open official cybercrime portal"
      };
    }

    if (intent === "officialLink") {
      const matchedBank = findBankInMessage(message);
      if (matchedBank && isHttpsOfficialUrl(matchedBank.website)) {
        const bankName = getBankDisplayName(matchedBank, activeLang);
        return {
          text: `${bankName} official website:\n${matchedBank.website}\n\nOpen only HTTPS official bank links. BankHub does not store login credentials.`,
          actionUrl: matchedBank.website,
          actionLabel: `Open ${matchedBank.shortName} official website`
        };
      }

      const matchedService = findServiceInMessage(message);
      if (matchedService && isHttpsOfficialUrl(matchedService.officialUrl)) {
        const serviceName = localizedServiceName(matchedService);
        return {
          text: `${serviceName} official website:\n${matchedService.officialUrl}\n\nBankHub redirects only to official service websites. No credentials are stored.`,
          actionUrl: matchedService.officialUrl,
          actionLabel: `Open ${serviceName}`
        };
      }

      return { text: exactFallback };
    }

    const matchedBank = findBankInMessage(message);
    if (matchedBank) {
      const bankName = getBankDisplayName(matchedBank, activeLang);
      return {
        text: `${bankName} (${matchedBank.shortName}) is a verified BankHub bank entry.\nCategory: ${matchedBank.category}\nServices listed in BankHub: ${matchedBank.services.join(", ")}\nOfficial website: ${matchedBank.website}\n\nDo not enter OTP, PIN, CVV, card number, or banking password in BankHub.`,
        actionUrl: isHttpsOfficialUrl(matchedBank.website) ? matchedBank.website : undefined,
        actionLabel: isHttpsOfficialUrl(matchedBank.website) ? `Open ${matchedBank.shortName} official website` : undefined
      };
    }

    return { text: exactFallback };
  };

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Translate welcome message when language changes if no other message exists
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === "welcome") {
        return [
          {
            id: "welcome",
            sender: "bot",
            text: LOCALIZED_TEXTS[activeLang].welcome,
            timestamp: prev[0].timestamp
          }
        ];
      }
      return prev;
    });
  }, [activeLang]);

  // Clean text of emojis & markdown elements for Speech Synthesis
  const cleanTextForSpeech = (str: string) => {
    let cleaned = str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1FA70}-\u{1FAFF}\u{200D}\u{FE0F}]/gu, '');
    cleaned = cleaned.replace(/\*\*/g, ''); // remove bold markdown
    cleaned = cleaned.replace(/#/g, ''); // remove headers
    cleaned = cleaned.replace(/•/g, ''); // remove bullet points
    cleaned = cleaned.replace(/💬|🏛️|📋|⚠️|🚨|🎁|📮|🛡️/g, ''); // strip specific emoji characters
    return cleaned;
  };

  // Text-To-Speech function
  const speakText = (text: string, lang: Language) => {
    if (!isVoiceEnabled) return;
    if (!("speechSynthesis" in window)) {
      setErrorMessage(LOCALIZED_TEXTS[lang].ttsUnsupported);
      setMicState("error");
      return;
    }

    window.speechSynthesis.cancel(); // cancel any active speech

    const cleaned = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = LANG_CODES[lang];

    // Select browser voice matching target locale
    const voices = window.speechSynthesis.getVoices();
    let matchingVoice = voices.find(v => v.lang === LANG_CODES[lang] || v.lang.startsWith(LANG_CODES[lang].split('-')[0]));

    // Odia / Urdu fallback logic
    if (!matchingVoice) {
      if (lang === "odia" || lang === "urdu") {
        const hindiCode = LANG_CODES["hindi"];
        matchingVoice = voices.find(v => v.lang === hindiCode || v.lang.startsWith("hi"));
        if (matchingVoice) {
          utterance.lang = hindiCode;
        }
      }
    }

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setSttSupported(false);
      return;
    }

    const rec = new SpeechRecognitionClass();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = LANG_CODES[activeLang];

    rec.onstart = () => {
      setIsListening(true);
      setMicState("listening");
      setErrorMessage("");
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputText(transcript);
        // Delay slightly and send
        setTimeout(() => {
          handleSendMessageRef.current(transcript);
        }, 500);
      }
    };

    rec.onerror = (event: any) => {
      console.error("Speech Recognition error", event);
      setIsListening(false);
      setMicState("error");
      if (event.error === "not-allowed") {
        setErrorMessage(LOCALIZED_TEXTS[activeLang].micErrorDenied);
      } else if (event.error === "no-speech") {
        setErrorMessage(LOCALIZED_TEXTS[activeLang].micErrorNoSpeech);
      } else {
        setErrorMessage(LOCALIZED_TEXTS[activeLang].micErrorDefault);
      }
    };

    rec.onend = () => {
      setIsListening(false);
      setMicState(prev => prev === "listening" ? "idle" : prev);
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [activeLang]);

  // Voice toggle trigger
  const toggleListening = () => {
    if (!sttSupported || !recognitionRef.current) {
      setErrorMessage(LOCALIZED_TEXTS[activeLang].micUnsupported);
      setMicState("error");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // Add user message to state
    const userMsgId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userMsgId,
      sender: "user",
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    const verifiedReply = createVerifiedAssistantReply(text);
    setShowWarning(Boolean(verifiedReply.isWarning));
    setMicState(verifiedReply.isWarning ? "idle" : "processing");

    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-reply-${Date.now()}`,
        sender: "bot",
        text: verifiedReply.text,
        isWarning: verifiedReply.isWarning,
        timestamp: new Date(),
        actionUrl: verifiedReply.actionUrl,
        actionLabel: verifiedReply.actionLabel
      };

      setMessages(prev => [...prev, botMsg]);
      setMicState("idle");
      speakText(verifiedReply.text, activeLang);
    }, verifiedReply.isWarning ? 500 : 700);

    return;

    // REAL-TIME CRITICAL SENSITIVE DATA SCANNER
    const sensitiveRegex = /(otp|one time password|pin|atm pin|cvv|cvv2|password|passcode|net banking password|netbanking password|upi pin|card number|card no|aadhaar otp)/i;
    const isSensitive = sensitiveRegex.test(text);

    if (isSensitive) {
      setShowWarning(true);
      setTimeout(() => {
        const warningMsg: Message = {
          id: `bot-warn-${Date.now()}`,
          sender: "bot",
          text: `🚨 ${LOCALIZED_TEXTS[activeLang].safetyWarning}`,
          isWarning: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, warningMsg]);
        speakText(LOCALIZED_TEXTS[activeLang].safetyWarning, activeLang);
      }, 500);
      return;
    }

    setShowWarning(false);
    setMicState("processing");

    // Retrieval matching engine
    setTimeout(() => {
      const query = text.toLowerCase();
      let replyText = "";
      let actionUrl: string | undefined = undefined;
      let actionLabel: string | undefined = undefined;

      // Local language vocabulary mappings for smart fuzzy intent categorization
      const matches = {
        bankList: ["bank list", "banks are available", "banks list", "which bank", "available bank", "banks in bankhub", "సహాయక బ్యాంకులు", "బ్యాంకుల జాబితా", "बैंकों की सूची", "बैंक सूची", "बैंक उपलब्ध", "banks available", "which banks"],
        homeLoan: ["home loan", "housing loan", "గృహ రుణం", "హోమ్ లోన్", "गृह ऋण", "होम लोन", "வீட்டு கடன்", "மனே சாலா", "ଗୃହ ଋଣ", "ہوم لون"],
        educationLoan: ["education loan", "student loan", "study loan", "శిక్షా రుణం", "విద్యా రుణం", "शिक्षा ऋण", "स्टूडेंट लोन", "கல்வி கடன்", "ವಿದ್ಯಾභ್ಯಾಸ ಸಾಲ", "ଶିକ୍ଷା ଋଣ", "تعلیمی قرض"],
        personalLoan: ["personal loan", "unsecured loan", "వ్యక్తిగత రుణం", "పర్సనల్ లోన్", "व्यक्तिगत ऋण", "पर्सनल लोन", "தனிநபர் கடன்", "ವಯಕ್ತಿಕ ಸಾಲ", "ବ୍ୟକ୍ତିଗତ ଋଣ", "پرسنل لون", "personal options"],
        goldLoan: ["gold loan", "jewel loan", "బంగారు రుణం", "గోల్డ్ లోన్", "स्वर्ण ऋण", "தنگ கடன்", "ಚಿನ್ನದ ಸಾಲ", "ସୁନା ଋଣ", "گولڈ لون"],
        agriLoan: ["agriculture loan", "agri loan", "farmer loan", "kisan loan", "kcc", "crop loan", "వ్యవసాయ రుణం", "కిసాన్ క్రెడిట్ కార్డ్", "कृषि ऋण", "किसान क्रेडिट", "விவசாய கடன்", "ಕೃಷಿ ಸಾಲ", "କୃଷି ଋଣ", "زرعی قرض"],
        savingsAccount: ["savings account", "saving account", "savings bank", "बचत खाता", "बचत खाते", "సేవింగ్స్ ఖాతా", "సేవింగ్స్ ఎకౌంట్", "சேமிப்புக் கணக்கு", "ಉಳಿತಾಯ ಖಾತೆ", "ସଞ୍ଚୟ ଆକାଉଣ୍ଟ୍", "بچت کھاتہ"],
        businessLoan: ["business loan", "commercial loan", "msme loan", "sme loan", "व्यापार ऋण", "बिजनेस लोन", "వ్యాపార రుణం", "బిజినెస్ లోన్", "வணிகக் கடன்", "ವ್ಯಾಪಾರ ಸಾಲ", "ବ୍ୟବସାୟ ଋଣ", "تجارتی قرض"],
        pmjdy: ["pmjdy", "jan dhan", "jan-dhan", "zero balance", "overdraft", "प्रधानमंत्री जन धन", "జన్ ధన్"],
        pmsby: ["pmsby", "suraksha bima", "accident insurance", "सुरक्षा बीमा", "సురక్షా బీమా"],
        apy: ["apy", "atal pension", "pension scheme", "अटल पेंशन", "అటల్ పెన్షన్"],
        studentSchemes: ["student scheme", "scholarship", "vidyalakshmi", "विद्यालक्ष्मी", "విద్యా లક્ષమి", "student schemes"],
        postOffice: ["post office", "postal", "india post", "পোস্ট ऑफिस", "పోస్టాఫీస్", "डाकघर"],
        insurance: ["insurance", "lic", "bima", "बीमा", "భీమా", "காப்பீடு", "ವಿಮೆ", "ବୀମା", "انشورنس"],
        scamSafety: ["scam", "fraud", "fake sms", "phishing", "spam", "cyber", "cybercrime", "1930", "helpline", "धोखा", "मोసం", "ஏமாற்று", "ವಂಚನೆ", "ଠକେଇ", "فریب"],
        redirection: ["website", "link", "official", "url", "portal", "verify", "वेबसाइट", "लिंक", "లింక్", "వెబ్‌సైట్"],
        interestRate: ["interest rate", "rate of interest", "roi", "ब्याज दर", "व्याज दर", "వడ్డీ రేటు"]
      };

      // Detect matched intents
      let detectedIntent = "";
      for (const [intent, keywords] of Object.entries(matches)) {
        if (keywords.some(keyword => query.includes(keyword))) {
          detectedIntent = intent;
          break;
        }
      }

      // Check if user is asking specifically about DOCUMENTS for loans
      const isDocQuery = ["document", "documents", "proof", "paper", "papers", "dastavez", "कागजात", "पुल", "పత్రాలు", "ఆధారాలు", "ஆவணங்கள்", "ದಾಖಲೆಗಳು", "ଦସ୍ତାବେଜ", "دستاویزات"].some(w => query.includes(w));

      // Scan query for any short name or name of a bank in the BANKS database
      const matchedBank = BANKS.find(b => {
        const shortNameLower = b.shortName.toLowerCase();
        const fullNameLower = b.name.toLowerCase();
        const regex = new RegExp(`\\b${shortNameLower}\\b|${fullNameLower}`, "i");
        return regex.test(query);
      });

      const hasSpecificIntent = detectedIntent && 
        detectedIntent !== "bankList" && 
        detectedIntent !== "redirection" && 
        detectedIntent !== "interestRate";

      if (hasSpecificIntent) {
        const loanDbId = INTENT_TO_LOAN_TYPE[detectedIntent];
        if (loanDbId) {
          let loanName = "";
          let loanDesc = "";
          let eligibility = "";
          let documents: string[] = [];
          let safetyNote = "";
          let fallbackPortal = "https://www.rbi.org.in";
          let portalName = "RBI Official Portal";

          const kbLoan = VERIFIED_LOANS.find(l => l.id === loanDbId);
          if (kbLoan) {
            loanName = getLocalizedValue(kbLoan.name, activeLang);
            loanDesc = getLocalizedValue(kbLoan.description, activeLang);
            eligibility = kbLoan.eligibility[activeLang] || kbLoan.eligibility["english"] || "";
            documents = kbLoan.documents[activeLang] || kbLoan.documents["english"] || [];
            fallbackPortal = kbLoan.officialInfoPage;
            if (loanDbId === "education_loan") portalName = "Vidya Lakshmi Portal";
            else if (loanDbId === "agri_loan") portalName = "NABARD Portal";
          } else {
            const dbFirst = VERIFIED_LOAN_COMPARISONS.find(c => c.loanType === loanDbId);
            if (dbFirst) {
              loanName = dbFirst.loanTypeLabel[activeLang] || dbFirst.loanTypeLabel["english"] || "";
              eligibility = dbFirst.eligibility[activeLang] || dbFirst.eligibility["english"] || "";
              documents = dbFirst.documentsRequired[activeLang] || dbFirst.documentsRequired["english"] || [];
              safetyNote = dbFirst.safetyNote[activeLang] || dbFirst.safetyNote["english"] || "";
              
              if (loanDbId === "vehicle_loan") {
                fallbackPortal = "https://sbi.co.in/web/personal-banking/loans/auto-loans";
                portalName = "SBI Auto Loan Portal";
              } else if (loanDbId === "women_entrepreneur_loan") {
                fallbackPortal = "https://www.standupmitra.in";
                portalName = "Stand-Up Mitra Portal";
              } else if (loanDbId === "msme_loan" || loanDbId === "business_loan") {
                fallbackPortal = "https://www.udyamregistration.gov.in";
                portalName = "Udyam Registration Portal";
              }
            }
          }

          if (isDocQuery) {
            const docHeader = activeLang === "english" ? "Here are the required verified documents to apply for a" : 
                              activeLang === "hindi" ? "आवेदन करने के लिए आवश्यक सत्यापित दस्तावेज:" : 
                              activeLang === "telugu" ? "అప్లై చేయడానికి కావలసిన ధృవీకరించబడిన పత్రాలు:" : 
                              activeLang === "tamil" ? "விண்ணப்பிக்க தேவையான சரிபார்க்கப்பட்ட ஆவணங்கள்:" :
                              activeLang === "kannada" ? "ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಅಗತ್ಯವಿರುವ ಪರಿಶೀಲಿಸಿದ ದಾಖಲೆಗಳು:" :
                              activeLang === "odia" ? "ଆବେଦନ ପାଇଁ ଆବଶ୍ୟକ ଯାଞ୍ଚ ହୋଇଥିବା ଦସ୍ତାବେଜଗୁଡ଼ିକ:" :
                              "درخواست دینے کے لیے درکار تصدیق شدہ دستاویزات:";
            replyText = `💬 **Direct Answer**: ${docHeader} ${loanName}:\n${documents.map(d => `• ${d}`).join("\n")}\n\n`;
          } else {
            const eligibilityHeader = activeLang === "english" ? "Eligibility" :
                                      activeLang === "hindi" ? "पात्रता" :
                                      activeLang === "telugu" ? "అర్హత" :
                                      activeLang === "tamil" ? "தகுதி" :
                                      activeLang === "kannada" ? "ಅರ್ಹತೆ" :
                                      activeLang === "odia" ? "ଯୋଗ୍ୟତା" :
                                      "اهلیت";
            if (!loanDesc) {
              loanDesc = activeLang === "english" ? `Apply and compare the best ${loanName} options from verified lenders.` :
                         activeLang === "hindi" ? `सत्यापित ऋणदाताओं से सर्वोत्तम ${loanName} विकल्पों की तुलना करें और आवेदन करें।` :
                         activeLang === "telugu" ? `ధృవీకరించబడిన రుణదాతల నుండి ఉత్తమ ${loanName} ఎంపికలను పోల్చండి మరియు అప్లై చేయండి.` :
                         activeLang === "tamil" ? `சரிபார்க்கப்பட்ட கடன் வழங்குநர்களிடமிருந்து சிறந்த ${loanName} விருப்பங்களை ஒப்பிட்டு விண்ணப்பிக்கவும்.` :
                         activeLang === "kannada" ? `ಪರಿಶೀಲಿಸಿದ ಸಾಲದಾತರಿಂದ ಉತ್ತಮ ${loanName} ಆಯ್ಕೆಗಳನ್ನು ಹೋಲಿಸಿ ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.` :
                         activeLang === "odia" ? `ଯାଞ୍ଚ ହୋଇଥିବା ଋଣ ପ୍ରଦାନକାରୀଙ୍କ ଠାରୁ ସର୍ବୋତ୍ତମ ${loanName} ବିକଳ୍ପଗୁଡ଼ିକୁ ତୁଳନା କରନ୍ତୁ ଏବଂ ଆବେଦନ କରନ୍ତୁ ।` :
                         `تصدیق شدہ قرض دہندگان سے بہترین ${loanName} کے اختیارات کا موازنہ کریں اور درخواست دیں۔`;
            }
            replyText = `💬 **Direct Answer**: ${loanDesc}\n\n📋 **${eligibilityHeader}**: ${eligibility}\n\n`;
          }

          const compResult = generateLoanComparisonText(detectedIntent, activeLang);
          replyText += compResult.text;

          if (safetyNote) {
            replyText += `⚠️ **Verification Notice**: ${safetyNote}`;
          } else {
            replyText += activeLang === "english" ? "⚠️ **Verification Notice**: Interest rates are market-linked and set dynamically. Always verify latest rates and eligibility on official bank sites." :
                         activeLang === "hindi" ? "⚠️ **सत्यापन सूचना**: ब्याज दरें बाजार से जुड़ी हैं और गतिशील रूप से निर्धारित होती हैं। हमेशा आधिकारिक बैंक साइटों पर नवीनतम दरों और पात्रता की पुष्टि करें।" :
                         activeLang === "telugu" ? "⚠️ **ధృవీకరణ నోటీసు**: వడ్డీ రేట్లు మార్కెట్-లింక్డ్ మరియు డైనమిక్ గా సెట్ చేయబడతాయి. ఎల్లప్పుడూ అధికారిక బ్యాంక్ సైట్లలో తాజా రేట్లు మరియు అర్హతను ధృవీకరించండి." :
                         activeLang === "tamil" ? "⚠️ **சரிபார்ப்பு அறிவிப்பு**: வட்டி விகிதங்கள் சந்தை சார்ந்தவை மற்றும் மாறும் வகையில் அமைக்கப்பட்டுள்ளன. அதிகாரப்பூர்வ வங்கி தளங்களில் சமீபத்திய கட்டணங்கள் மற்றும் தகுதியை எப்போதும் சரிபார்க்கவும்." :
                         activeLang === "kannada" ? "⚠️ **ಪರಿಶೀಲನೆ ಸೂಚನೆ**: ಬಡ್ಡಿದರಗಳು ಮಾರುಕಟ್ಟೆಗೆ ಲಿಂಕ್ ಆಗಿರುತ್ತವೆ ಮತ್ತು ಕ್ರಿಯಾತ್ಮಕವಾಗಿ ಹೊಂದಿಸಲ್ಪಡುತ್ತವೆ. ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಸೈಟ್‌ಗಳಲ್ಲಿ ಇತ್ತೀಚಿನ ದರಗಳು ಮತ್ತು ಅರ್ಹತೆಯನ್ನು ಯಾವಾಗಲೂ ಪರಿಶೀಲಿಸಿ." :
                         activeLang === "odia" ? "⚠️ **ଯାଞ୍ଚ ସୂଚନା**: ବ୍ୟାଜ ହାର ବଜାର ସହିତ ଜଡିତ ଏବଂ ଗତିଶୀଳ ଭାବରେ ନିର୍ଦ୍ଧାରିତ ହୋଇଥାଏ । ସର୍ବଦା ଅଫିସିଆଲ୍ ବ୍ୟାଙ୍କ ସାଇଟ୍‌ରେ ସର୍ବଶେଷ ହାର ଏବଂ ଯୋગ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ ।" :
                         "⚠️ **تصدیقی نوٹس**: شرح سود مارکیٹ سے منسلک ہے اور متحرک طور پر طے کی جاتی ہے۔ آفیشل بینک سائٹس پر ہمیشہ تازہ ترین شرح سود اور اہلیت کی تصدیق کریں۔";
          }

          if (compResult.topBankUrl && compResult.topBankLabel) {
            actionUrl = compResult.topBankUrl;
            actionLabel = compResult.topBankLabel;
          } else {
            actionUrl = fallbackPortal;
            actionLabel = activeLang === "english" ? `Open ${portalName}` :
                          activeLang === "hindi" ? `आधिकारिक ${portalName} खोलें` :
                          activeLang === "telugu" ? `అధికారిక ${portalName} తెరవండి` :
                          activeLang === "tamil" ? `அதிகாரப்பூர்வ ${portalName} திறக்கவும்` :
                          activeLang === "kannada" ? `ಅಧಿಕೃತ ${portalName} ತೆರೆಯಿರಿ` :
                          activeLang === "odia" ? `ଅଫିସିଆଲ୍ ${portalName} ଖୋଲନ୍ତୁ` :
                          `آفیشل ${portalName} کھولیں`;
          }
        }
        else if (detectedIntent === "pmjdy") {
          const scheme = VERIFIED_SCHEMES.find(s => s.id === "pmjdy")!;
          const desc = getLocalizedValue(scheme.description, activeLang);
          const benefits = scheme.benefits[activeLang] || scheme.benefits["english"] || [];
          replyText = `💬 **Direct Answer**: Pradhan Mantri Jan Dhan Yojana (PMJDY) is India's premier financial inclusion mission:\n${desc}\n\n🎁 **Key Benefits Include**:\n${benefits.map(b => `• ${b}`).join("\n")}\n\n🏛️ **Affiliated Banks**: Available at all public sector and major private sector banks in India.\n\n⚠️ **Important Verification**: PMJDY is a zero-balance account. Do not pay any fees to open it.`;
          actionUrl = scheme.officialUrl;
          actionLabel = "Open PMJDY Official Website";
        }
        else if (detectedIntent === "pmsby") {
          const scheme = VERIFIED_SCHEMES.find(s => s.id === "pmsby")!;
          const desc = getLocalizedValue(scheme.description, activeLang);
          const benefits = scheme.benefits[activeLang] || scheme.benefits["english"] || [];
          replyText = `💬 **Direct Answer**: Pradhan Mantri Suraksha Bima Yojana (PMSBY) accidental cover details:\n${desc}\n\n🎁 **Verified Cover benefits**:\n${benefits.map(b => `• ${b}`).join("\n")}\n\n🏛️ **Providers**: Linked savings bank auto-debit support.\n\n⚠️ **Premium Note**: Standard annual premium is only ₹20. Make sure you keep sufficient funds in your linked savings account before 31st May.`;
          actionUrl = scheme.officialUrl;
          actionLabel = "Open Jan Suraksha Portal";
        }
        else if (detectedIntent === "apy") {
          const scheme = VERIFIED_SCHEMES.find(s => s.id === "apy")!;
          const desc = getLocalizedValue(scheme.description, activeLang);
          const benefits = scheme.benefits[activeLang] || scheme.benefits["english"] || [];
          replyText = `💬 **Direct Answer**: Atal Pension Yojana (APY) social safety retirement details:\n${desc}\n\n🎁 **Pension benefits**:\n${benefits.map(b => `• ${b}`).join("\n")}\n\n🏛️ **Affiliation**: Accessible via all commercial bank branches.\n\n⚠️ **Important Verification**: Premium varies depending on entry age (18-40). Verify the exact charts on the official PFRDA website.`;
          actionUrl = scheme.officialUrl;
          actionLabel = "Open NPS PFRDA Website";
        }
        else if (detectedIntent === "studentSchemes") {
          replyText = `💬 **Direct Answer**: BankHub integrates official government-supported education loan matching portals such as **Vidya Lakshmi** to support financial accessibility for deserving students.\n\n🎁 **Features & Benefits**:\n• Apply to multiple banks with a single Common Education Loan Application Form (CELAF).\n• Check status of your application online.\n• Access interest subsidy schemes (CSIS) directly.\n\n🏛️ **Affiliated Institutions**: State Bank of India, Bank of Baroda, Canara Bank, HDFC, ICICI, etc.\n\n⚠️ **Important note**: Verify tuition structures on institutional portals.`;
          actionUrl = "https://www.vidyalakshmi.co.in";
          actionLabel = "Open Vidya Lakshmi Portal";
        }
        else if (detectedIntent === "postOffice") {
          // Dynamic search in SERVICES_DATA
          const postServices = SERVICES_DATA.filter(s => s.category === "post_office");
          const names = postServices.map(s => getLocalizedValue(s.name as any, activeLang)).join(", ");
          replyText = `💬 **Direct Answer**: India Post offers highly secure savings, deposit, and citizen services directly through its extensive nationwide network.\n\n📮 **Verified Services Available**:\n${names}\n\n⚠️ **Verification Note**: Small savings schemes (PPF, Sukanya Samriddhi, Senior Citizens Schemes) are fully backed by the Central Government. Always check interest rates quarterly on the official site.`;
          actionUrl = "https://www.indiapost.gov.in";
          actionLabel = "Open India Post Portal";
        }
        else if (detectedIntent === "insurance") {
          replyText = `💬 **Direct Answer**: Safe insurance options in India include accidental coverages (PMSBY) and life coverages (PMJJBY), fully backed by government-aligned underwriters.\n\n🛡️ **Verified Providers & Portals**:\n• Life Insurance Corporation (LIC)\n• National Insurance & General Insurance Companies\n• IRDAI Regulatory Complaint Portal\n\n⚠️ **Verification Warning**: IRDAI does not sell policies or declare bonuses. Never fall for fraud phone offers.`;
          actionUrl = "https://www.jansuraksha.gov.in";
          actionLabel = "Open Jan Suraksha Website";
        }
        else if (detectedIntent === "scamSafety") {
          const safety = VERIFIED_CYBER_SAFETY;
          const tips = safety.tips[activeLang] || safety.tips["english"] || [];
          const steps = safety.recoverySteps[activeLang] || safety.recoverySteps["english"] || [];
          replyText = `💬 **Direct Answer**: If you have faced online financial loss, contact the official national hotline immediately.\n\n🚨 **National Cyber Crime Helpline**: 📞 **${safety.helpline}** (Call within 2 hours of transaction!)\n\n📂 **Emergency Recovery Action Steps**:\n${steps.map(s => `• ${s}`).join("\n")}\n\n🛡️ **Daily Safety Guidelines**:\n${tips.map(t => `• ${t}`).join("\n")}\n\n⚠️ **Disclaimer**: Never search for helpline contacts on unverified search engines. Scammers upload fake numbers. Use BankHub verified channels.`;
          actionUrl = safety.complaintPortal;
          actionLabel = "Open Cybercrime Grievance Portal";
        }
      } else if (matchedBank) {
        // Output specific bank details!
        const dispName = getBankDisplayName(matchedBank, activeLang);
        const category = matchedBank.category;
        const website = matchedBank.website;
        const servicesList = matchedBank.services.map(s => `• ${s}`).join("\n");
        const description = matchedBank.description;
        
        replyText = `🏛️ **${dispName} (${matchedBank.shortName})**\n\n💬 **Category**: ${category} Bank\n📝 **About**: ${description}\n\n💼 **Verified Services Offered**:\n${servicesList}\n\n⚠️ **Important Safety Note**: Always access this bank using verified channels. BankHub does not store your credentials. Make sure the URL begins with 'https://' before logging in.`;
        actionUrl = website;
        actionLabel = `Go to Official ${matchedBank.shortName} Website`;
      } else {
        if (detectedIntent === "bankList") {
          // Return active list of BankHub banks
          const bankList = getSupportedBanksList(activeLang);
          replyText = `💬 **Direct Answer**: BankHub integrates and links all major Indian commercial and priority sector institutions securely. You can open and access official banking services directly from the Compare Banking Services page.\n\n🏛️ **Verified Banks in BankHub**:\n${bankList}\n\n⚠️ **Important Security Note**: Please verify all bank addresses and services on the official bank site. BankHub will never ask you for passwords or card credentials.`;
          actionUrl = "https://www.rbi.org.in";
          actionLabel = "Open RBI Official Portal";
        }
        else if (detectedIntent === "interestRate") {
          replyText = `💬 **Direct Answer**: I do not have verified official interest rate data for this yet.\n\n🏛️ **Reason**: Interest rates are updated frequently by the Reserve Bank of India (RBI) and commercial lenders. \n\n⚠️ **Safety Action**: Please visit the official bank portals directly to inspect active rates. Never trust generic online tables or financial blogs.`;
          actionUrl = "https://www.rbi.org.in";
          actionLabel = "Open RBI Official Website";
        }
        else if (detectedIntent === "redirection") {
          replyText = `💬 **Direct Answer**: BankHub redirects you only to safe, secured official banking portals. Always inspect URLs in the browser address bar.\n\n🛡️ **Verified URL Safety check**:\n• Make sure the link starts with 'https://' and has a padlock icon.\n• Official government links end in '.gov.in' or '.nic.in'.\n• Do not enter credentials on third-party blogs or 'http://' pages.\n\n🏛️ **Accessible Banks**: State Bank of India, HDFC Bank, ICICI Bank, Axis, etc.`;
          actionUrl = "https://www.rbi.org.in";
          actionLabel = "Open RBI Official Portal";
        }
        else {
          // Default official fallback
          replyText = LOCALIZED_TEXTS[activeLang].fallback;
          actionUrl = "https://www.rbi.org.in";
          actionLabel = "Open RBI Official Portal";
        }
      }

      // Add bot message
      const botMsg: Message = {
        id: `bot-reply-${Date.now()}`,
        sender: "bot",
        text: replyText,
        timestamp: new Date(),
        actionUrl,
        actionLabel
      };

      setMessages(prev => [...prev, botMsg]);
      setMicState("idle");
      
      // Synthesis speech response
      speakText(replyText, activeLang);
    }, 1000);
  };


  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Suggestion chips parser trigger
  const handleSuggestionClick = (topic: string) => {
    const list = SUGGESTIONS_DB[activeLang];
    const suggestionObj = list.find(s => s.topic === topic);
    const text = suggestionObj ? suggestionObj.text : "";
    if (text) {
      handleSendMessage(text);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white/80 dark:bg-card/70 backdrop-blur-md border border-border/60 rounded-[28px] overflow-hidden shadow-soft transition-all duration-300">
      
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Bot className="w-6 h-6 text-white animate-pulse" />
            </div>
            {/* Online status indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-indigo-600 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <div>
            <h3 className="font-bold text-[15px] leading-tight flex items-center gap-1.5">
              BankHub AI Assistant
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </h3>
            <p className="text-[10px] text-white/80 font-medium">Official Multilingual Banking Guide</p>
          </div>
        </div>

        {/* Header Control Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Stop Speaking Button (Invokes cancellation) */}
          {isSpeaking && (
            <button
              onClick={() => {
                if ("speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
                setIsSpeaking(false);
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-full border border-rose-500/40 text-[10px] font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-md shrink-0"
              title="Stop Speaking Outloud"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>{LOCALIZED_TEXTS[activeLang].stopSpeaking}</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="relative flex items-center bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full px-3 py-1.5 border border-white/20 cursor-pointer">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-white/90" />
            <select
              value={activeLang}
              onChange={(e) => {
                const nextLang = e.target.value as Language;
                setActiveLang(nextLang);
              }}
              className="bg-transparent text-[11px] font-bold text-white outline-none border-none cursor-pointer pr-1"
              style={{ colorScheme: "dark" }}
              aria-label="Select AI Assistant Language"
            >
              {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
                <option key={key} value={key} className="text-foreground bg-white dark:bg-card">
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Output Enable Mute Toggle */}
          <button
            onClick={() => {
              const nextState = !isVoiceEnabled;
              setIsVoiceEnabled(nextState);
              if (!nextState && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }
            }}
            className={`p-2 rounded-full border transition-all active:scale-90 ${
              isVoiceEnabled 
                ? "bg-white/20 border-white/30 text-white hover:bg-white/30" 
                : "bg-black/20 border-white/10 text-white/50 hover:bg-black/30"
            }`}
            title={isVoiceEnabled ? "Mute Voice Output" : "Enable Voice Output"}
          >
            {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Chat Content Response Area ── */}
      <div className="h-[340px] overflow-y-auto p-4 space-y-4 bg-slate-50/40 dark:bg-black/10 no-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`flex w-full ${isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[20px] px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.01)] relative border ${
                    isBot
                      ? msg.isWarning
                        ? "bg-rose-50 border-rose-200 text-rose-950 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-100 rounded-tl-sm"
                        : "bg-white dark:bg-card border-border/40 text-foreground rounded-tl-sm"
                      : "bg-indigo-600 border-indigo-700 text-white rounded-tr-sm"
                  }`}
                >
                  
                  {/* Warning Icon Badge */}
                  {msg.isWarning && (
                    <div className="flex items-center gap-1.5 mb-1.5 text-rose-600 dark:text-rose-400 font-bold text-[12px]">
                      <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
                      <span>Security Intercept Warning</span>
                    </div>
                  )}

                  {/* Message Content */}
                  <p className="text-[12.5px] font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>

                  {/* Redirect button inside message */}
                  {isBot && msg.actionUrl && !msg.isWarning && (
                    <div className="mt-3">
                      <a
                        href={msg.actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10.5px] px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 border border-indigo-500/20"
                      >
                        <span>{msg.actionLabel || "Open Official Portal"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                  
                  {/* Timestamp Footer */}
                  <span className={`block text-[9px] mt-1.5 text-right font-medium ${
                    isBot 
                      ? msg.isWarning 
                        ? "text-rose-500/70" 
                        : "text-muted-foreground/60" 
                      : "text-white/60"
                  }`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Bouncing Dots status indicators */}
        {(micState === "listening" || micState === "processing") && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-card border border-border/40 text-muted-foreground rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex items-center gap-2 text-[11px] font-semibold">
              {micState === "listening" ? (
                <>
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span>{LOCALIZED_TEXTS[activeLang].micListening}</span>
                </>
              ) : (
                <>
                  <span className="flex gap-1 items-center shrink-0">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  <span>{LOCALIZED_TEXTS[activeLang].micProcessing}</span>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Sensitive credentials warning warning banner overlay */}
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 animate-bounce" />
            <p className="text-[11px] font-bold leading-normal">
              Warning: Bank credentials or passwords detected. Grounded security blocks active.
            </p>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Microphone / Speech Synthesis error notices ── */}
      {micState === "error" && errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 my-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <p className="text-[11px] font-bold leading-normal">{errorMessage}</p>
          </div>
          <button 
            onClick={() => { 
              setMicState("idle"); 
              setErrorMessage(""); 
            }} 
            className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 active:scale-95 shrink-0"
            aria-label="Dismiss message banner"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ── Quick Action Suggestion Chips ── */}
      <div className="px-4 py-2 border-t border-border/30 bg-white/40 dark:bg-card/20 flex gap-2 overflow-x-auto no-scrollbar">
        {SUGGESTIONS_DB[activeLang].map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestionClick(suggestion.topic)}
            className="shrink-0 bg-white dark:bg-card border border-border/80 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-[11px] text-muted-foreground px-3.5 py-1.5 rounded-full active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3 h-3 text-muted-foreground/75" />
            <span>{suggestion.text}</span>
          </button>
        ))}
      </div>

      {/* ── Footer Input Controls ── */}
      <div className="p-3 border-t border-border/50 bg-white/70 dark:bg-card/30 flex items-center gap-2.5">
        
        {/* Mic toggle */}
        <div className="relative">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-2xl transition-all relative cursor-pointer ${
              isListening
                ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse"
                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Voice input button"
            title={sttSupported ? (isListening ? "Stop listening" : "Start voice typing") : "Voice typing unsupported"}
          >
            {isListening ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5 opacity-70" />
            )}
          </button>

          {/* Glowing ring pulsing while listening */}
          {isListening && (
            <span className="absolute -inset-1 rounded-2xl border-2 border-rose-400 animate-ping opacity-60 pointer-events-none" />
          )}
        </div>

        {/* Message Input box */}
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              // Active scanner warning trigger
              const sensitiveRegex = /(otp|pin|cvv|password|passcode|upi pin)/i;
              setShowWarning(sensitiveRegex.test(e.target.value));
            }}
            onKeyPress={handleKeyPress}
            placeholder={
              isListening
                ? LOCALIZED_TEXTS[activeLang].micListening
                : sttSupported
                ? LOCALIZED_TEXTS[activeLang].placeholder
                : LOCALIZED_TEXTS[activeLang].placeholderUnsupported
            }
            className="w-full bg-white dark:bg-card border border-border/80 rounded-2xl pl-4 pr-10 py-3 text-[13px] font-semibold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:font-normal"
          />
          
          {/* Send query button inside input box */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all cursor-pointer ${
              inputText.trim()
                ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md"
                : "text-muted-foreground/30 pointer-events-none"
            }`}
            aria-label="Send query button"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Security Trust Notice Banner Footer ── */}
      <div className="px-4 py-2 bg-slate-100 dark:bg-black/30 border-t border-border/30 flex items-center justify-center gap-1.5 select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <p className="text-[10px] font-bold text-muted-foreground tracking-wide text-center">
          {LOCALIZED_TEXTS[activeLang].trustBanner}
        </p>
      </div>

    </div>
  );
}
