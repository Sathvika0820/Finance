import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, Mic, MicOff, Volume2, VolumeX, Globe, 
  ArrowRight, ShieldCheck, X, Sparkles, HelpCircle, 
  FileText, Landmark, ShieldAlert, CheckCircle2,
  StopCircle, Play, Info, AlertTriangle, Minimize2, MessageCircle
} from "lucide-react";
import { 
  VERIFIED_LOANS, 
  VERIFIED_SCHEMES, 
  VERIFIED_CYBER_SAFETY, 
  getSupportedBanksList 
} from "@/data/aiKnowledgeBase";
import { BANKS, getBankDisplayName } from "@/data/banks";
import { SERVICES_DATA } from "@/data/services";
import { getLoanComparisonTypeFromQuery, getSortedLoanComparison } from "@/data/loanData";
import { isVerifiedOfficialUrl } from "@/data/officialLinks";
import {
  LANGUAGE_OPTIONS,
  SPEECH_LOCALE_BY_LANGUAGE,
  useTranslation,
  type AppLanguage,
} from "@/lib/i18n";
import { containsSensitiveBankingData } from "@/lib/security";

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
type Language = AppLanguage;

const LANGUAGE_LABELS: Record<Language, string> = Object.fromEntries(
  LANGUAGE_OPTIONS.map((language) => [language.id, `${language.nativeLabel} (${language.label})`])
) as Record<Language, string>;

const LEGACY_LANGUAGE_LABELS: Partial<Record<Language, string>> = {
  english: "English",
  hindi: "हिन्दी (Hindi)",
  telugu: "తెలుగు (Telugu)",
  tamil: "தமிழ் (Tamil)",
  kannada: "ಕನ್ನಡ (Kannada)",
  odia: "ଓଡ଼ିଆ (Odia)",
  urdu: "اردو (Urdu)",
};

const LANG_CODES: Record<Language, string> = SPEECH_LOCALE_BY_LANGUAGE;

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
    welcome: "வணக்கம்! நான் உங்கள் பேங்க்ஹப் AI உதவியாளர். வங்கி சேவைகள், கடன்கள், அரசு திட்டங்கள் அல்லது மோசடி பாதுகாப்பு குறித்து உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?",
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
    welcome: "ہیلو! میں آپ کا بینک ہب اے آئی اسسٹنٹ ہوں۔ آج میں بینکنگ خدمات، قرض، سرکاری اسکیموں یا آن لائن فراڈ سے بچاؤ کے بارے میں آپ کی کیا مدد کر سکتا ہوں؟",
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
  },
  marathi: {
    welcome: "नमस्कार! मी तुमचा BankHub AI सहाय्यक आहे. बँक सेवा, कर्ज, योजना किंवा सुरक्षिततेबद्दल विचारा.",
    safetyWarning: "सुरक्षेसाठी OTP, PIN, CVV, कार्ड नंबर किंवा बँकिंग पासवर्ड शेअर करू नका.",
    fallback: "मी हे अधिकृत स्रोतांमधून पडताळू शकलो नाही. कृपया अधिकृत वेबसाइट तपासा.",
    micUnsupported: "या ब्राउझरमध्ये व्हॉइस इनपुट समर्थित नाही. कृपया मजकूर वापरा.",
    micListening: "ऐकत आहे... आता बोला.", micProcessing: "व्हॉइस प्रश्न प्रक्रिया होत आहे...",
    micErrorNoSpeech: "आवाज आढळला नाही. कृपया पुन्हा प्रयत्न करा.", micErrorDenied: "मायक्रोफोन परवानगी नाकारली.",
    micErrorDefault: "व्हॉइस ओळख त्रुटी.", ttsUnsupported: "या डिव्हाइसवर आवाज आउटपुट समर्थित नाही.",
    trustBanner: "BankHub बँकिंग पासवर्ड, OTP, PIN किंवा CVV साठवत नाही.",
    placeholder: "योजना, कर्ज, कागदपत्रांबद्दल विचारा...", placeholderUnsupported: "काहीही विचारा... (व्हॉइस इनपुट नाही)", stopSpeaking: "बोलणे थांबवा",
  },
  bengali: {
    welcome: "নমস্কার! আমি আপনার BankHub AI সহায়ক। ব্যাঙ্ক পরিষেবা, ঋণ, প্রকল্প বা নিরাপত্তা নিয়ে জিজ্ঞাসা করুন।",
    safetyWarning: "নিরাপত্তার জন্য OTP, PIN, CVV, কার্ড নম্বর বা ব্যাঙ্কিং পাসওয়ার্ড শেয়ার করবেন না।",
    fallback: "আমি এটি অফিসিয়াল উৎস থেকে যাচাই করতে পারিনি। অনুগ্রহ করে অফিসিয়াল ওয়েবসাইট দেখুন।",
    micUnsupported: "এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়।", micListening: "শুনছি... এখন বলুন.", micProcessing: "ভয়েস প্রশ্ন প্রক্রিয়া হচ্ছে...",
    micErrorNoSpeech: "কোনো কথা শনাক্ত হয়নি।", micErrorDenied: "মাইক্রোফোন অনুমতি অস্বীকার করা হয়েছে।", micErrorDefault: "ভয়েস শনাক্তকরণ ত্রুটি।",
    ttsUnsupported: "এই ডিভাইসে ভয়েস আউটপুট সমর্থিত নয়।", trustBanner: "BankHub ব্যাঙ্কিং পাসওয়ার্ড, OTP, PIN বা CVV সংরক্ষণ করে না।",
    placeholder: "প্রকল্প, ঋণ, নথি সম্পর্কে জিজ্ঞাসা করুন...", placeholderUnsupported: "কিছু জিজ্ঞাসা করুন... (ভয়েস ইনপুট নেই)", stopSpeaking: "বলা বন্ধ করুন",
  },
  gujarati: {
    welcome: "નમસ્તે! હું તમારો BankHub AI સહાયક છું. બેંક સેવા, લોન, યોજના અથવા સલામતી વિશે પૂછો.",
    safetyWarning: "સલામતી માટે OTP, PIN, CVV, કાર્ડ નંબર અથવા બેંકિંગ પાસવર્ડ શેર ન કરો.",
    fallback: "હું આને સત્તાવાર સ્ત્રોતોથી ચકાસી શક્યો નથી. કૃપા કરીને સત્તાવાર વેબસાઇટ જુઓ.",
    micUnsupported: "આ બ્રાઉઝરમાં વોઇસ ઇનપુટ સપોર્ટેડ નથી.", micListening: "સાંભળી રહ્યું છે... હવે બોલો.", micProcessing: "વોઇસ પ્રશ્ન પ્રક્રિયામાં છે...",
    micErrorNoSpeech: "કોઈ અવાજ મળ્યો નથી.", micErrorDenied: "માઇક્રોફોન પરવાનગી નકારી.", micErrorDefault: "વોઇસ ઓળખ ભૂલ.",
    ttsUnsupported: "આ ડિવાઇસ પર વોઇસ આઉટપુટ સપોર્ટેડ નથી.", trustBanner: "BankHub બેંકિંગ પાસવર્ડ, OTP, PIN અથવા CVV સંગ્રહતું નથી.",
    placeholder: "યોજનાઓ, લોન, દસ્તાવેજો વિશે પૂછો...", placeholderUnsupported: "કંઈપણ પૂછો... (વોઇસ ઇનપુટ નથી)", stopSpeaking: "બોલવું બંધ કરો",
  },
  punjabi: {
    welcome: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ BankHub AI ਸਹਾਇਕ ਹਾਂ। ਬੈਂਕ ਸੇਵਾਵਾਂ, ਕਰਜ਼ੇ, ਸਕੀਮਾਂ ਜਾਂ ਸੁਰੱਖਿਆ ਬਾਰੇ ਪੁੱਛੋ।",
    safetyWarning: "ਸੁਰੱਖਿਆ ਲਈ OTP, PIN, CVV, ਕਾਰਡ ਨੰਬਰ ਜਾਂ ਬੈਂਕਿੰਗ ਪਾਸਵਰਡ ਸਾਂਝੇ ਨਾ ਕਰੋ।",
    fallback: "ਮੈਂ ਇਸਨੂੰ ਅਧਿਕਾਰਕ ਸਰੋਤਾਂ ਤੋਂ ਪੱਕਾ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਕਾਰਕ ਵੈਬਸਾਈਟ ਵੇਖੋ।",
    micUnsupported: "ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਵੌਇਸ ਇਨਪੁਟ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।", micListening: "ਸੁਣ ਰਿਹਾ ਹਾਂ... ਹੁਣ ਬੋਲੋ।", micProcessing: "ਵੌਇਸ ਸਵਾਲ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਹੈ...",
    micErrorNoSpeech: "ਕੋਈ ਆਵਾਜ਼ ਨਹੀਂ ਮਿਲੀ।", micErrorDenied: "ਮਾਈਕ੍ਰੋਫੋਨ ਇਜਾਜ਼ਤ ਰੱਦ ਕੀਤੀ ਗਈ।", micErrorDefault: "ਵੌਇਸ ਪਛਾਣ ਗਲਤੀ।",
    ttsUnsupported: "ਇਸ ਡਿਵਾਈਸ 'ਤੇ ਵੌਇਸ ਆਉਟਪੁੱਟ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।", trustBanner: "BankHub ਬੈਂਕਿੰਗ ਪਾਸਵਰਡ, OTP, PIN ਜਾਂ CVV ਸਟੋਰ ਨਹੀਂ ਕਰਦਾ।",
    placeholder: "ਸਕੀਮਾਂ, ਕਰਜ਼ਿਆਂ, ਦਸਤਾਵੇਜ਼ਾਂ ਬਾਰੇ ਪੁੱਛੋ...", placeholderUnsupported: "ਕੁਝ ਵੀ ਪੁੱਛੋ... (ਵੌਇਸ ਇਨਪੁਟ ਨਹੀਂ)", stopSpeaking: "ਬੋਲਣਾ ਬੰਦ ਕਰੋ",
  }
};

const SUGGESTIONS_DB: Partial<Record<Language, { text: string; topic: string }[]>> & {
  english: { text: string; topic: string }[];
} = {
  english: [
    { text: "Compare home loans", topic: "home_loan" },
    { text: "Compare education loans", topic: "education_loan" },
    { text: "Which banks are available?", topic: "available_banks" },
    { text: "Show student schemes", topic: "student_schemes" },
    { text: "Report online fraud", topic: "scam_report" },
    { text: "Post office schemes", topic: "post_office_savings" }
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
  ],
  marathi: [
    { text: "गृह कर्जांची तुलना करा", topic: "home_loan" },
    { text: "शैक्षणिक कर्जांची तुलना करा", topic: "education_loan" },
    { text: "कोणत्या बँका उपलब्ध आहेत?", topic: "available_banks" },
    { text: "विद्यार्थी योजना दाखवा", topic: "student_schemes" },
    { text: "ऑनलाइन फसवणुकीची तक्रार करा", topic: "scam_report" },
    { text: "टपाल बचत योजना दाखवा", topic: "post_office_savings" }
  ],
  bengali: [
    { text: "গৃহঋণ তুলনা করুন", topic: "home_loan" },
    { text: "শিক্ষাঋণ তুলনা করুন", topic: "education_loan" },
    { text: "কোন কোন ব্যাঙ্ক উপলব্ধ?", topic: "available_banks" },
    { text: "ছাত্রদের প্রকল্প দেখান", topic: "student_schemes" },
    { text: "অনলাইন জালিয়াতির অভিযোগ করুন", topic: "scam_report" },
    { text: "ডাকঘর সঞ্চয় প্রকল্প দেখান", topic: "post_office_savings" }
  ],
  gujarati: [
    { text: "ગૃહ લોનની તુલના કરો", topic: "home_loan" },
    { text: "શૈક્ષણિક લોનની તુલના કરો", topic: "education_loan" },
    { text: "કઈ બેંકો ઉપલબ્ધ છે?", topic: "available_banks" },
    { text: "વિદ્યાર્થી યોજનાઓ બતાવો", topic: "student_schemes" },
    { text: "ઑનલાઇન છેતરપિંડીની ફરિયાદ કરો", topic: "scam_report" },
    { text: "ટપાલ બચત યોજનાઓ બતાવો", topic: "post_office_savings" }
  ],
  punjabi: [
    { text: "ਘਰ ਦੇ ਕਰਜ਼ਿਆਂ ਦੀ ਤੁਲਨਾ ਕਰੋ", topic: "home_loan" },
    { text: "ਸਿੱਖਿਆ ਕਰਜ਼ਿਆਂ ਦੀ ਤੁਲਨਾ ਕਰੋ", topic: "education_loan" },
    { text: "ਕਿਹੜੇ ਬੈਂਕ ਉਪਲਬਧ ਹਨ?", topic: "available_banks" },
    { text: "ਵਿਦਿਆਰਥੀ ਸਕੀਮਾਂ ਵੇਖਾਓ", topic: "student_schemes" },
    { text: "ਆਨਲਾਈਨ ਧੋਖਾਧੜੀ ਦੀ ਸ਼ਿਕਾਇਤ ਕਰੋ", topic: "scam_report" },
    { text: "ਡਾਕ ਬਚਤ ਸਕੀਮਾਂ ਵੇਖਾਓ", topic: "post_office_savings" }
  ]
};

const QUICK_ACTION_TOPICS = [
  "home_loan",
  "education_loan",
  "available_banks",
  "student_schemes",
  "scam_report",
  "post_office_savings",
];

const LOCALIZED_COMPARISON_TEXTS: Partial<Record<Language, {
  comparisonHeader: string;
  interestRate: string;
  processingFee: string;
  repaymentPeriod: string;
  notVerified: string;
  checkOfficial: string;
  topApply: string;
  loanDetails: string;
}>> & {
  english: {
    comparisonHeader: string;
    interestRate: string;
    processingFee: string;
    repaymentPeriod: string;
    notVerified: string;
    checkOfficial: string;
    topApply: string;
    loanDetails: string;
  };
} = {
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
  msmeLoan: "msme_loan",
  businessLoan: "business_loan"
};

const BANK_BY_ID = new Map(BANKS.map((bank) => [bank.id, bank]));

const getBankDisplayNameById = (bankId: string, lang: Language): string => {
  const bank = BANK_BY_ID.get(bankId);
  return bank ? getBankDisplayName(bank, lang) : bankId;
};

const generateLoanComparisonText = (
  detectedIntent: string,
  lang: Language
): { text: string; topBankUrl?: string; topBankLabel?: string } => {
  const loanType = INTENT_TO_LOAN_TYPE[detectedIntent];
  if (!loanType) return { text: "" };

  const entries = getSortedLoanComparison(loanType);
  if (entries.length === 0) return { text: "" };

  const texts = LOCALIZED_COMPARISON_TEXTS[lang] || LOCALIZED_COMPARISON_TEXTS.english;
  let markdown = `\n\n${texts.comparisonHeader}\n\n`;

  entries.forEach((item, index) => {
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    const emojiNum = emojis[index] || "•";
    const bankName = getBankDisplayNameById(item.bankId, lang);
    
    const rateDisplay = item.numericRate === null
      ? `*${texts.checkOfficial}*`
      : (item.interestRateDisplay[lang] || item.interestRateDisplay["english"] || item.interestRateText);
      
    const feeDisplay = item.processingFeeByLang[lang] || item.processingFeeByLang["english"] || "";
    const tenureDisplay = item.repaymentPeriodByLang[lang] || item.repaymentPeriodByLang["english"] || "";

    markdown += `${emojiNum} **${bankName}**\n`;
    markdown += `   • 📈 **${texts.interestRate}**: ${rateDisplay}\n`;
    if (feeDisplay) {
      markdown += `   • 💳 **${texts.processingFee}**: ${feeDisplay}\n`;
    }
    if (tenureDisplay) {
      markdown += `   • ⏱️ **${texts.repaymentPeriod}**: ${tenureDisplay}\n`;
    }
    
    if (item.verified && item.officialReferenceLink) {
      const linkText = lang === "english" ? "Open Portal" :
                       lang === "hindi" ? "पोर्टल खोलें" :
                       lang === "telugu" ? "పోర్టల్ తెరవండి" :
                       lang === "tamil" ? "போர்டல் திறக்கவும்" :
                       lang === "kannada" ? "ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ" :
                       lang === "odia" ? "ପୋର୍ଟାଲ୍ ଖୋଲନ୍ତୁ" :
                       "پورٹل کھولیں";
      markdown += `   • 🔗 **Link**: [${linkText}](${item.officialReferenceLink})\n`;
    } else {
      markdown += `   • ${texts.notVerified}\n`;
    }
    markdown += `\n`;
  });

  const topVerifiedBank = entries.find(item => item.verified && item.officialApplyLink);
  let topBankUrl: string | undefined = undefined;
  let topBankLabel: string | undefined = undefined;

  if (topVerifiedBank) {
    topBankUrl = topVerifiedBank.officialApplyLink || undefined;
    const name = getBankDisplayNameById(topVerifiedBank.bankId, lang);
    topBankLabel = texts.topApply.replace("{bank}", name);
  }

  return { text: markdown, topBankUrl, topBankLabel };
};

export function AiAssistant() {
  const { t, lang: appLang, setLang: setAppLang, dir } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: LOCALIZED_TEXTS.english.welcome,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [activeLang, setActiveLang] = useState<Language>(appLang);
  const [isOpen, setIsOpen] = useState(false);
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
  const replyTimeoutRef = useRef<number | null>(null);
  const transcriptTimeoutRef = useRef<number | null>(null);

  const clearAssistantTimers = useCallback(() => {
    if (replyTimeoutRef.current !== null) {
      window.clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
    if (transcriptTimeoutRef.current !== null) {
      window.clearTimeout(transcriptTimeoutRef.current);
      transcriptTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearAssistantTimers, [clearAssistantTimers]);

  useEffect(() => {
    setActiveLang(appLang);
  }, [appLang]);

  // Helper to resolve localized dictionary entries
  const getLocalizedValue = (value: Record<string, any> | undefined, lang: Language): string => {
    if (!value) return "";
    return value[lang] || value["english"] || "";
  };

  const exactSensitiveWarning = LOCALIZED_TEXTS[activeLang].safetyWarning;
  const exactFallback = LOCALIZED_TEXTS[activeLang].fallback;

  const isHttpsOfficialUrl = (url?: string) => isVerifiedOfficialUrl(url);

  const formatList = (items: string[]) => items.map(item => `- ${item}`).join("\n");

  const localizedServiceName = (service: { name: Record<string, string> }) =>
    service.name[activeLang as keyof typeof service.name] || service.name.english;

  const localizedServiceDescription = (service: { description: Record<string, string> }) =>
    service.description[activeLang as keyof typeof service.description] || service.description.english;

  const containsSensitiveData = containsSensitiveBankingData;

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
    if (/\b(msme|sme|micro\s+small|micro,\s*small)\b/.test(lower)) return "msme_loan";
    if (/\b(business|enterprise|commercial)\b/.test(lower)) return "business_loan";
    if (/\b(agriculture|agricultural|farmer|crop|kisan)\b/.test(lower)) return "agriculture_loan";
    return "";
  };

  const buildLoanComparisonReply = (loanId: string): Pick<Message, "text" | "actionUrl" | "actionLabel"> => {
    const comparisonEntries = getSortedLoanComparison(loanId);

    if (comparisonEntries.length === 0) {
      return {
        text: "I do not have verified official interest rate data for this yet. Please check the official bank website."
      };
    }

    const labelSource = comparisonEntries[0];
    const loanTypeLabel = labelSource.loanTypeLabel[activeLang] || labelSource.loanTypeLabel.english || loanId.replace(/_/g, " ");
    const rankedLines = comparisonEntries.map((entry, index) => {
      const bank = BANK_BY_ID.get(entry.bankId);
      const bankName = bank ? getBankDisplayName(bank, activeLang) : entry.bankName;
      const rate = entry.numericRate !== null
        ? (entry.interestRateDisplay[activeLang] || entry.interestRateDisplay.english || entry.interestRateText)
        : "Check official website";

      return `${index + 1}. ${bankName} — ${rate}`;
    });

    const lowestVerified = comparisonEntries.find(entry => entry.numericRate !== null);
    const linkedEntry = comparisonEntries.find(entry => entry.verified && entry.officialReferenceLink);
    const linkNote = linkedEntry
      ? `\n\nOfficial reference link available for ${BANK_BY_ID.get(linkedEntry.bankId)?.name || linkedEntry.bankName}.`
      : "";

    return {
      text: `Here is the verified ${loanTypeLabel.toLowerCase()} comparison available in BankHub:\n\n${rankedLines.join("\n")}\n\nLowest verified rate is shown first.${linkNote}`,
      actionUrl: linkedEntry?.officialReferenceLink || undefined,
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

    if (activeLang !== "english") {
      const localizedIntent = detectVerifiedIntent(message);
      if (localizedIntent === "fraud") {
        return {
          text: `${LOCALIZED_TEXTS[activeLang].safetyWarning}\n\n${t("cyberFraudWarning")}`,
          actionUrl: VERIFIED_CYBER_SAFETY.complaintPortal,
          actionLabel: t("openOfficialPortal"),
        };
      }

      return { text: exactFallback };
    }

    const comparisonLoanType = getLoanComparisonTypeFromQuery(message);
    if (comparisonLoanType) {
      return buildLoanComparisonReply(comparisonLoanType);
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
        .map(bankId => BANK_BY_ID.get(bankId))
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
    let matchingVoice = voices.find(v => v.lang === LANG_CODES[lang] || v.lang.toLowerCase().startsWith(LANG_CODES[lang].split('-')[0].toLowerCase()));

    // Fallback to Hindi first for Indian-language voice gaps, then English.
    if (!matchingVoice) {
      const hindiCode = LANG_CODES.hindi;
      matchingVoice = voices.find(v => v.lang === hindiCode || v.lang.toLowerCase().startsWith("hi"));
      if (matchingVoice) {
        utterance.lang = hindiCode;
      }
    }

    if (!matchingVoice) {
      const englishCode = LANG_CODES.english;
      matchingVoice = voices.find(v => v.lang === englishCode || v.lang.toLowerCase().startsWith("en"));
      utterance.lang = englishCode;
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
        if (transcriptTimeoutRef.current !== null) {
          window.clearTimeout(transcriptTimeoutRef.current);
        }
        transcriptTimeoutRef.current = window.setTimeout(() => {
          handleSendMessageRef.current(transcript);
        }, 500);
      }
    };

    rec.onerror = (event: any) => {
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
        setErrorMessage(LOCALIZED_TEXTS[activeLang].micErrorDefault);
        setMicState("error");
      }
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (containsSensitiveBankingData(text)) {
      setInputText("");
      setShowWarning(true);
      setMicState("idle");

      const warningMsg: Message = {
        id: `bot-sensitive-${Date.now()}`,
        sender: "bot",
        text: exactSensitiveWarning,
        isWarning: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, warningMsg]);
      speakText(exactSensitiveWarning, activeLang);
      return;
    }

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

    if (replyTimeoutRef.current !== null) {
      window.clearTimeout(replyTimeoutRef.current);
    }
    replyTimeoutRef.current = window.setTimeout(() => {
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
      replyTimeoutRef.current = null;
    }, verifiedReply.isWarning ? 500 : 700);

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
    const list = SUGGESTIONS_DB[activeLang] || SUGGESTIONS_DB.english;
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
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-950 text-white shadow-[0_16px_40px_rgba(15,23,42,0.28)] ring-1 ring-white/20 transition-all hover:-translate-y-0.5 hover:bg-slate-900 active:scale-95 sm:bottom-6 sm:right-6"
            aria-label={t("aiAssistantTitle")}
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 z-[90] mx-auto flex h-[calc(100vh-24px)] max-h-[680px] w-auto max-w-[420px] flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.24)] ring-1 ring-white/80 backdrop-blur-xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[640px] sm:w-[400px]"
            dir={dir}
            role="dialog"
            aria-label={t("aiAssistantTitle")}
          >
      
      {/* ── Header ── */}
      <div className="border-b border-slate-200/80 bg-white/90 px-4 py-3.5 text-slate-950 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            {/* Online status indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-[14px] leading-tight flex items-center gap-1.5 text-slate-950">
              {t("aiAssistantTitle")}
            </h3>
            <p className="text-[10.5px] text-slate-500 font-semibold leading-snug">{t("aiAssistantSubtitle")}</p>
          </div>
        </div>

        {/* Header Control Buttons */}
        <div className="flex items-center gap-1.5">
          
          {/* Stop Speaking Button (Invokes cancellation) */}
          {isSpeaking && (
            <button
              onClick={() => {
                if ("speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
                setIsSpeaking(false);
              }}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1.5 rounded-xl border border-rose-100 text-[10px] font-bold flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
              title={t("stopSpeaking")}
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>{LOCALIZED_TEXTS[activeLang].stopSpeaking}</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all rounded-xl px-2.5 py-1.5 border border-slate-200 cursor-pointer">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            <select
              value={activeLang}
              onChange={(e) => {
                const nextLang = e.target.value as Language;
                setAppLang(nextLang);
              }}
              className="max-w-[86px] sm:max-w-[118px] bg-transparent text-[11px] font-bold text-slate-700 outline-none border-none cursor-pointer pr-1"
              aria-label={t("selectAiAssistantLanguage")}
            >
              {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
                <option key={key} value={key} className="text-foreground bg-white">
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
                ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100" 
                : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200"
            }`}
            title={isVoiceEnabled ? t("muteVoiceOutput") : t("enableVoiceOutput")}
          >
            {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 active:scale-90"
            aria-label={t("minimizeAssistant")}
            title={t("minimizeAssistant")}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if ("speechSynthesis" in window) window.speechSynthesis.cancel();
              setIsSpeaking(false);
              setIsOpen(false);
            }}
            className="p-2 rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 active:scale-90"
            aria-label={t("close")}
            title={t("close")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        </div>
      </div>

      {/* ── Chat Content Response Area ── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-slate-50/70 no-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            const safeActionUrl = isVerifiedOfficialUrl(msg.actionUrl) ? msg.actionUrl : undefined;
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
                        : "bg-white border-slate-200/70 text-foreground rounded-tl-sm"
                      : "bg-slate-950 border-slate-900 text-white rounded-tr-sm"
                  }`}
                >
                  
                  {/* Warning Icon Badge */}
                  {msg.isWarning && (
                    <div className="flex items-center gap-1.5 mb-1.5 text-rose-600 dark:text-rose-400 font-bold text-[12px]">
                      <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
                      <span>{t("securityInterceptWarning")}</span>
                    </div>
                  )}

                  {/* Message Content */}
                  <p className="text-[12.5px] font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>

                  {/* Redirect button inside message */}
                  {isBot && safeActionUrl && !msg.isWarning && (
                    <div className="mt-3">
                      <a
                        href={safeActionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 fintech-button font-bold text-[10.5px] px-3.5 py-2 rounded-xl transition-all active:scale-95"
                      >
                        <span>{msg.actionLabel || t("openOfficialPortal")}</span>
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
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
              {t("credentialsDetectedWarning")}
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
            aria-label={t("dismissMessage")}
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ── Quick Action Suggestion Chips ── */}
      <div className="px-4 py-2.5 border-t border-slate-200/70 bg-white/80 flex gap-2 overflow-x-auto no-scrollbar">
        {QUICK_ACTION_TOPICS.map((topic, idx) => {
          const suggestion = (SUGGESTIONS_DB[activeLang] || SUGGESTIONS_DB.english).find(
            (item) => item.topic === topic,
          );
          if (!suggestion) return null;
          return (
          <button
            key={idx}
            onClick={() => handleSuggestionClick(suggestion.topic)}
            className="shrink-0 bg-white border border-slate-200 hover:border-slate-400 hover:text-slate-950 font-bold text-[11px] text-slate-600 px-3.5 py-1.5 rounded-full active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3 h-3 text-muted-foreground/75" />
            <span>{suggestion.text}</span>
          </button>
          );
        })}
      </div>

      {/* ── Footer Input Controls ── */}
      <div className="p-3 border-t border-slate-200/70 bg-white/90 flex items-center gap-2.5">
        
        {/* Mic toggle */}
        <div className="relative">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-2xl transition-all relative cursor-pointer ${
              isListening
                ? "bg-rose-600 text-white shadow-[0_0_0_4px_rgba(225,29,72,0.12)]"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950"
            }`}
            aria-label={t("voiceInputButton")}
            title={sttSupported ? (isListening ? t("stopListening") : t("startVoiceTyping")) : t("voiceTypingUnsupported")}
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
              setShowWarning(containsSensitiveBankingData(e.target.value));
            }}
            onKeyPress={handleKeyPress}
            placeholder={
              isListening
                ? LOCALIZED_TEXTS[activeLang].micListening
                : sttSupported
                ? LOCALIZED_TEXTS[activeLang].placeholder
                : LOCALIZED_TEXTS[activeLang].placeholderUnsupported
            }
            className="w-full bg-white border border-slate-200 rounded-2xl pl-4 pr-10 py-3 text-[13px] font-semibold outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all placeholder:font-normal"
          />
          
          {/* Send query button inside input box */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all cursor-pointer ${
              inputText.trim()
                ? "bg-slate-950 text-white hover:bg-slate-800 active:scale-95 shadow-md"
                : "text-muted-foreground/30 pointer-events-none"
            }`}
            aria-label={t("sendQuery")}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Security Trust Notice Banner Footer ── */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/70 flex items-center justify-center gap-1.5 select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <p className="text-[10px] font-bold text-muted-foreground tracking-wide text-center leading-snug">
          {LOCALIZED_TEXTS[activeLang].trustBanner}
          <span className="block mt-1 font-semibold normal-case tracking-normal">
            {t("voiceCompatibilityNotice")}
          </span>
        </p>
      </div>

          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
