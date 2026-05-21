import { useState, useCallback, useEffect } from "react";
import { Bank } from "@/data/banks";
import { getSafeBankUrl } from "@/lib/urlHealth";

export type SupportedLanguage = "english" | "hindi" | "telugu";

let globalHasInteracted = false;
let welcomeSpoken = false;

function normalizeLanguage(value: string | null) {
  const v = String(value || "").toLowerCase();

  if (v === "hi" || v === "hi-in" || v.includes("à¤¹à¤¿à¤¨à¥�à¤¦à¥€") || v.includes("hindi")) {
    return "hindi";
  }

  if (v === "te" || v === "te-in" || v.includes("à°¤à±†à°²à±�à°—à±�") || v.includes("telugu")) {
    return "telugu";
  }

  return "english";
}

export function openBank(bank: Bank, source = "unknown", event?: any) {
  if (event?.stopPropagation) event.stopPropagation();
  if (event?.preventDefault) event.preventDefault();
  
  if (typeof window !== "undefined") {
    const now = Date.now();
    const lastOpen = (window as any).__lastBankOpenTime || 0;
    
    if (now - lastOpen < 1500) {
      console.warn("Duplicate bank open blocked globally:", bank?.name, source);
      return;
    }
    (window as any).__lastBankOpenTime = now;
  }

  const url = getSafeBankUrl(bank);
  if (!url || url.trim() === "") {
    console.warn("Blocked attempt to open unverified bank website for:", bank?.name);
    return;
  }

  console.count("OPEN_BANK_CALLED");
  console.log("OPEN_BANK_SOURCE:", source, bank?.name);
  console.count("WINDOW_OPEN_EXECUTED");
  console.log("Opening bank URL:", bank?.name, url, source);

  window.open(url, "_blank", "noopener,noreferrer");

  try {
    speakVoice("openingBank", { bank });
  } catch (error) {
    console.warn("Voice failed but bank opened:", error);
  }
}

if (typeof window !== "undefined") {
  const unlock = () => {
    globalHasInteracted = true;
    window.removeEventListener("click", unlock, true);
    window.removeEventListener("touchstart", unlock, true);
    speakWelcomeOnce();
  };
  window.addEventListener("click", unlock, true);
  window.addEventListener("touchstart", unlock, true);

  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

function getBestVoice(language: string) {
  const voices = window.speechSynthesis.getVoices();
  
  if (language === "telugu") {
    return voices.find(v => v.lang === "te-IN") ||
           voices.find(v => v.lang.toLowerCase().startsWith("te")) ||
           voices.find(v => v.name.includes("Telugu")) ||
           voices.find(v => v.name.includes("à°¤à±†à°²à±�à°—à±�")) ||
           null;
  }
  
  if (language === "hindi") {
    return voices.find(v => v.lang === "hi-IN") ||
           voices.find(v => v.lang.toLowerCase().startsWith("hi")) ||
           voices.find(v => v.name.includes("Hindi")) ||
           null;
  }
  
  // english
  return voices.find(v => v.lang === "en-IN") ||
         voices.find(v => v.lang.toLowerCase().startsWith("en-in")) ||
         voices.find(v => v.lang.toLowerCase().startsWith("en")) ||
         null;
}

export function speakVoice(eventKey: string, payload: any = {}) {
  if (typeof window === "undefined") return;

  const isMuted = localStorage.getItem("bankHubVoiceMuted") === "true";
  if (isMuted && eventKey !== "muted" && eventKey !== "unmuted") {
    console.log("Voice skipped because muted");
    return;
  }

  const selectedLanguage = normalizeLanguage(localStorage.getItem("bankHubLanguage"));
  const safeLanguage = selectedLanguage;

  const bank = payload.bank;
  const bankName =
    bank?.names?.[safeLanguage] ||
    bank?.name ||
    payload.bankName ||
    "";
    
  const serviceName = payload.serviceName || "";

  const voiceLines: Record<string, Record<string, string>> = {
    english: {
      welcome: "Welcome to Bank Hub. Please select your preferred banks.",
      bankSelected: `${bankName} selected.`,
      bankRemoved: `${bankName} removed from favourites.`,
      openingBank: `Opening ${bankName} website.`,
      muted: "Voice assistant muted.",
      unmuted: "Voice assistant enabled.",
      showingGuidance: "Showing smart banking guidance.",
      showingGuidanceOption: `Showing guidance for ${serviceName}.`,
      showingSafety: "Showing banking safety shield.",
      showingFinancialHelp: "Showing financial inclusion help.",
      showingTopic: `Showing ${serviceName}.`,
      showingComparison: "Showing banking service comparison.",
      showingRuralSupport: "Showing rural banking support.",
      openingService: `Opening ${serviceName} official website.`
    },
    hindi: {
      welcome: "बैंक हब में आपका स्वागत है। कृपया अपने पसंदीदा बैंक चुनें।",
      bankSelected: `${bankName} चुना गया।`,
      bankRemoved: `${bankName} पसंदीदा सूची से हटा दिया गया।`,
      openingBank: `${bankName} की वेबसाइट खोली जा रही है।`,
      muted: "वॉइस असिस्टेंट म्यूट कर दिया गया है।",
      unmuted: "वॉइस असिस्टेंट चालू कर दिया गया है।",
      showingGuidance: "स्मार्ट बैंकिंग मार्गदर्शन दिखाया जा रहा है।",
      showingGuidanceOption: `${serviceName} के लिए मार्गदर्शन दिखाया जा रहा है।`,
      showingSafety: "बैंकिंग सुरक्षा कवच दिखाया जा रहा है।",
      showingFinancialHelp: "वित्तीय समावेशन सहायता दिखाया जा रहा है।",
      showingTopic: `${serviceName} दिखाया जा रहा है।`,
      showingComparison: "बैंकिंग सेवा तुलना दिखाया जा रहा है।",
      showingRuralSupport: "ग्रामीण बैंकिंग सहायता दिखाया जा रहा है।",
      openingService: `${serviceName} की आधिकारिक वेबसाइट खोली जा रही है।`
    },
    telugu: {
      welcome: "బ్యాంక్ హబ్‌కు స్వాగతం. దయచేసి మీకు కావలసిన బ్యాంకులను ఎంచుకోండి.",
      bankSelected: `${bankName} ఎంపిక చేయబడింది.`,
      bankRemoved: `${bankName} ఫేవరెట్ల నుండి తీసివేయబడింది.`,
      openingBank: `${bankName} వెబ్‌సైట్ తెరవబడుతోంది.`,
      muted: "వాయిస్ అసిస్టెంట్ మ్యూట్ చేయబడింది.",
      unmuted: "వాయిస్ అసిస్టెంట్ ఆన్ చేయబడింది.",
      showingGuidance: "స్మార్ట్ బ్యాంకింగ్ మార్గదర్శనం చూపబడుతోంది.",
      showingGuidanceOption: `${serviceName} కోసం మార్గదర్శనం చూపబడుతోంది.`,
      showingSafety: "బ్యాంకింగ్ సేఫ్టీ షీల్డ్ చూపబడుతోంది.",
      showingFinancialHelp: "ఆర్థిక చేర్పు సహాయం చూపబడుతోంది.",
      showingTopic: `${serviceName} చూపబడుతోంది.`,
      showingComparison: "బ్యాంకింగ్ సేవల పోలిక చూపబడుతోంది.",
      showingRuralSupport: "గ్రామీణ బ్యాంకింగ్ సహాయం చూపబడుతోంది.",
      openingService: `${serviceName} అధికారిక వెబ్‌సైట్ తెరవబడుతోంది.`
    }
  };

  let text = voiceLines[safeLanguage]?.[eventKey];

  if (eventKey === "openingService") {
    text = {
      english: `Opening ${serviceName} official website.`,
      hindi: `${serviceName} की आधिकारिक वेबसाइट खोली जा रही है।`,
      telugu: `${serviceName} అధికారిక వెబ్‌సైట్ తెరవబడుతోంది.`,
    }[safeLanguage];
  }

  if (eventKey === "showingServiceDetails") {
    text = {
      english: `Showing ${serviceName} services.`,
      hindi: `${serviceName} सेवाएं दिखाई जा रही हैं।`,
      telugu: `${serviceName} సేవలు చూపబడుతున్నాయి.`,
    }[safeLanguage];
  }

  if (eventKey === "openingServiceAction") {
    const actionName = payload.actionName || "";
    text = {
      english: `Opening ${actionName}.`,
      hindi: `${actionName} खोला जा रहा है।`,
      telugu: `${actionName} తెరవబడుతోంది.`,
    }[safeLanguage];
  }

  console.log("VOICE_EVENT:", eventKey);
  console.log("VOICE_LANGUAGE:", selectedLanguage);
  console.log("VOICE_TEXT:", text);
  console.log("VOICE_LANG_CODE:", safeLanguage === "hindi" ? "hi-IN" : safeLanguage === "telugu" ? "te-IN" : "en-IN");
  console.log("VOICE_MUTED:", isMuted);

  if (!text) {
    console.warn("No voice text found for event:", eventKey);
    return;
  }

  if (!("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported in this browser");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang =
    safeLanguage === "hindi"
      ? "hi-IN"
      : safeLanguage === "telugu"
      ? "te-IN"
      : "en-IN";

  const bestVoice = getBestVoice(safeLanguage);

  if (bestVoice) {
    utterance.voice = bestVoice;
  } else if (safeLanguage === "telugu") {
    console.warn("No native Telugu voice found. Browser/device is using fallback voice.");
  } else if (safeLanguage === "hindi") {
    console.warn("No native Hindi voice found. Browser/device is using fallback voice.");
  } else {
    console.warn("No native English voice found. Browser/device is using fallback voice.");
  }

  console.log("Using voice:", bestVoice?.name, bestVoice?.lang);

  utterance.onstart = () => console.log("Voice started");
  utterance.onend = () => console.log("Voice ended");
  utterance.onerror = (e) => console.warn("Voice error:", e);

  window.speechSynthesis.cancel();

  setTimeout(() => {
    console.log("SPEAK_CALLED_NOW");
    window.speechSynthesis.speak(utterance);
  }, 50);
}

export function speakWelcomeOnce() {
  if (typeof window === "undefined") return;
  
  const isMuted = localStorage.getItem("bankHubVoiceMuted") === "true";
  if (isMuted) return;

  if (welcomeSpoken) return;
  if (sessionStorage.getItem("bankHubWelcomeSpoken") === "true") return;
  
  if (!globalHasInteracted) {
    return; 
  }

  welcomeSpoken = true;
  sessionStorage.setItem("bankHubWelcomeSpoken", "true");
  speakVoice("welcome");
}

export function useVoiceAssistant() {
  const [voiceLang, setVoiceLangState] = useState<SupportedLanguage>("english");
  const [isMuted, setIsMutedState] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleSync = () => {
        const storedLang = normalizeLanguage(localStorage.getItem("bankHubLanguage"));
        setVoiceLangState(storedLang as SupportedLanguage);
        
        const muted = localStorage.getItem("bankHubVoiceMuted") === "true";
        setIsMutedState(muted);
      };

      handleSync();
      window.addEventListener("storage", handleSync);
      window.addEventListener("bankHubLanguageSync", handleSync);
      window.addEventListener("bankHubVoiceSync", handleSync);
      
      setTimeout(() => speakWelcomeOnce(), 100);
      
      return () => {
        window.removeEventListener("storage", handleSync);
        window.removeEventListener("bankHubLanguageSync", handleSync);
        window.removeEventListener("bankHubVoiceSync", handleSync);
      };
    }
  }, []);

  const toggleMute = useCallback(() => {
    const currentState = localStorage.getItem("bankHubVoiceMuted") === "true";
    const newState = !currentState;
    
    if (newState) {
      speakVoice("muted");
      setTimeout(() => {
        setIsMutedState(true);
        localStorage.setItem("bankHubVoiceMuted", "true");
        window.dispatchEvent(new Event("bankHubVoiceSync"));
      }, 100);
    } else {
      setIsMutedState(false);
      localStorage.setItem("bankHubVoiceMuted", "false");
      window.dispatchEvent(new Event("bankHubVoiceSync"));
      speakVoice("unmuted");
    }
  }, []);

  const openBankSafely = useCallback((bank: Bank, source?: string, event?: any) => {
    openBank(bank, source, event);
  }, []);

  return {
    voiceLang,
    isMuted,
    toggleMute,
    speakVoice,
    openBankSafely
  };
}
