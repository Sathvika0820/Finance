import { BANKS, Bank } from "./banks";
import { SERVICES_DATA, FinanceService } from "./services";
import { getOfficialLink } from "./officialLinks";

// Define structured content for the AI Assistant's official-data-only retrieval logic
export interface VerifiedLoanType {
  id: string;
  name: Record<string, string>;
  category: string;
  verifiedBanks: string[]; // Bank IDs from BANKS
  description: Record<string, string>;
  documents: Record<string, string[]>;
  eligibility: Record<string, string>;
  officialInfoPage: string;
}

export interface VerifiedScheme {
  id: string;
  name: Record<string, string>;
  authority: string;
  category: "citizen" | "student" | "farmer" | "rural" | "general";
  description: Record<string, string>;
  benefits: Record<string, string[]>;
  officialUrl: string;
}

export interface VerifiedCyberSafety {
  id: string;
  title: Record<string, string>;
  helpline: string;
  complaintPortal: string;
  tips: Record<string, string[]>;
  recoverySteps: Record<string, string[]>;
}

// 1. VERIFIED LOAN DATA (strictly grounded on Indian commercial banking standards)
export const VERIFIED_LOANS: VerifiedLoanType[] = [
  {
    id: "home_loan",
    name: {
      english: "Home Loan (Housing Loan)",
      hindi: "गृह ऋण (होम लोन)",
      telugu: "ఇంటి రుణం (హోమ్ లోన్)",
      tamil: "வீட்டுக் கடன் (ஹோம் லோன்)",
      kannada: "ಗೃಹ ಸಾಲ (ಹೋಮ್ ಲೋನ್)",
      odia: "ଗୃହ ଋଣ (ହୋମ୍ ଲୋନ୍)",
      urdu: "ہوم لون (مکان کا قرضہ)"
    },
    category: "Retail Loan",
    verifiedBanks: ["sbi", "hdfc", "icici", "axis", "bob", "canara", "pnb", "union"],
    description: {
      english: "Long-term funding for purchasing, constructing, or renovating residential properties.",
      hindi: "आवासीय संपत्ति खरीदने, बनाने या नवीनीकरण के लिए दीर्घकालिक वित्तपोषण।",
      telugu: "నివాస స్థలాలు, ఇళ్లు కొనడానికి, నిర్మించడానికి లేదా పునర్నిర్మించడానికి ఇచ్చే దీర్ఘకాలిక రుణాలు.",
      tamil: "குடியிருப்பு சொத்துக்களை வாங்க, கட்ட அல்லது புதுப்பிக்க வழங்கப்படும் நீண்ட கால கடன்.",
      kannada: "ವಸತಿ ಆಸ್ತಿಗಳನ್ನು ಖರೀದಿಸಲು, ನಿರ್ಮಿಸಲು ಅಥವಾ ನವೀಕರಿಸಲು ದೀರ್ಘಾವಧಿಯ ಹಣಕಾಸು ನೆರವು.",
      odia: "ଆବାସିକ ସମ୍ପତ୍ତି କିଣିବା, ତିଆରି କରିବା କିମ୍ବା ମରାମତି ପାଇଁ ଦୀର୍ଘକାଳୀନ ଆର୍ଥିକ ସହାୟତା।",
      urdu: "رہائشی پراپرٹی خریدنے، تعمیر کرنے یا مرمت کرنے کے لیے طویل مدتی قرضہ۔"
    },
    documents: {
      english: [
        "Identity Proof: Aadhaar Card, PAN Card, Voter ID, or Passport.",
        "Address Proof: Aadhaar Card, Utility Bills, or Registered Rent Agreement.",
        "Income Proof for Salaried: Salary slips (last 3 months), ITR or Form 16 (last 2 years), Bank statements (last 6 months).",
        "Income Proof for Self-Employed: Business proof, audited balance sheets, profit & loss statement, ITR (last 2-3 years).",
        "Property Documents: Sale deed, builder NOC, approved construction plan, property tax receipts."
      ],
      hindi: [
        "पहचान प्रमाण: आधार कार्ड, पैन कार्ड, मतदाता पहचान पत्र या पासपोर्ट।",
        "पते का प्रमाण: आधार कार्ड, उपयोगिता बिल (बिजली/पानी), या पंजीकृत किराया समझौता।",
        "वेतनभोगी के लिए आय प्रमाण: पिछले 3 महीनों की सैलरी स्लिप, पिछले 2 वर्षों का आईटीआर या फॉर्म 16, पिछले 6 महीनों का बैंक स्टेटमेंट।",
        "स्व-नियोजित के लिए आय प्रमाण: व्यवसाय का प्रमाण, ऑडिट की गई बैलेंस शीट, लाभ-हानि विवरण, पिछले 2-3 वर्षों का आईटीआर।",
        "संपत्ति के दस्तावेज: बिक्री विलेख (सेल डीड), बिल्डर से एनओसी, स्वीकृत भवन योजना, संपत्ति कर रसीदें।"
      ]
    },
    eligibility: {
      english: "Age between 21 to 70 years. Indian citizenship or NRI status. Stable employment or business history with a minimum credit score of 700+ preferred.",
      hindi: "उम्र 21 से 70 वर्ष के बीच। भारतीय नागरिकता या एनआरआई दर्जा। स्थिर रोजगार या व्यवसाय का इतिहास, अधिमानतः 700+ क्रेडिट स्कोर।"
    },
    officialInfoPage: getOfficialLink("regulators", "rbi") || ""
  },
  {
    id: "education_loan",
    name: {
      english: "Education Loan (Student Loan)",
      hindi: "शिक्षा ऋण (स्टूडेंट लोन)",
      telugu: "విద్యా రుణం (స్టూడెంట్ లోన్)",
      tamil: "கல்விக் கடன் (மாணவர் கடன்)",
      kannada: "ಶಿಕ್ಷಣ ಸಾಲ (ವಿದ್ಯಾರ್ಥಿ ಸಾಲ)",
      odia: "ଶିକ୍ଷା ଋଣ (ଷ୍ଟୁଡେଣ୍ଟ୍ ଲୋନ୍)",
      urdu: "تعلیمی قرض (اسٹوڈنٹ لون)"
    },
    category: "Retail Loan",
    verifiedBanks: ["sbi", "bob", "canara", "pnb", "hdfc", "icici", "axis"],
    description: {
      english: "Financial support for higher education in India or abroad, covering tuition fees, hostel expenses, and study equipment.",
      hindi: "भारत या विदेश में उच्च शिक्षा के लिए वित्तीय सहायता, जिसमें ट्यूशन फीस, हॉस्टल का खर्च और अध्ययन सामग्री शामिल है।",
      telugu: "భారతదేశం లేదా విదేశాలలో ఉన్నత చదువుల కోసం ఇచ్చే రుణం. ఇది ట్యూషన్ ఫీజులు, హాస్టల్ ఖర్చులు మరియు ఇతర విద್ಯಾ పరికరాలను కవర్ చేస్తుంది.",
      tamil: "இந்தியா அல்லது வெளிநாட்டில் உயர்கல்வி கற்பதற்கான நிதி உதவி, கல்வி கட்டணம், தங்குமிட கட்டணம் மற்றும் படிப்பு உபகரணங்களை உள்ளடக்கியது.",
      kannada: "ಭಾರತ ಅಥವಾ ವಿದೇಶದಲ್ಲಿ ಉನ್ನತ ಶಿಕ್ಷಣಕ್ಕಾಗಿ ಹಣಕಾಸಿನ ನೆರವು, ಬೋಧನಾ ಶುಲ್ಕಗಳು, ಹಾಸ್ಟೆಲ್ ವೆಚ್ಚಗಳು ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಸಲಕರಣೆಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.",
      odia: "ଭାରତ କିମ୍ବା ବିଦେଶରେ ଉଚ୍ଚଶିକ୍ଷା ପାଇଁ ଆର୍ଥିକ ସହାୟତା, ଯେଉଁଥିରେ କଲେଜ ଫିସ୍, ହଷ୍ଟେଲ ଖର୍ଚ୍ଚ ଏବଂ ପାଠପଢ଼ା ସାମଗ୍ରୀ ସାମିଲ୍।",
      urdu: "ہندوستان یا بیرون ملک اعلیٰ تعلیم کے لیے مالی امداد، جس میں ٹیوشن فیس، ہاسٹل کے اخراجات اور تعلیمی سامان شامل ہے۔"
    },
    documents: {
      english: [
        "Identity Proof: Aadhaar Card, PAN Card, Voter ID, or Passport.",
        "Academic Records: 10th/12th/Graduation mark sheets and passing certificates.",
        "Admission Proof: Official admission letter or offer letter from the recognized college/university.",
        "Schedule of Expenses: Official fee structure document signed by the institution.",
        "Financial Co-borrower Documents: Income tax returns, salary slips, and bank statements of the parent or guardian (co-applicant)."
      ],
      hindi: [
        "पहचान प्रमाण: आधार कार्ड, पैन कार्ड, मतदाता पहचान पत्र या पासपोर्ट।",
        "शैक्षणिक रिकॉर्ड: 10वीं/12वीं/स्नातक की अंक तालिकाएं और पासिंग सर्टिफिकेट।",
        "प्रवेश का प्रमाण: मान्यता प्राप्त कॉलेज/विश्वविद्यालय से आधिकारिक प्रवेश पत्र या प्रस्ताव पत्र।",
        "खर्चों की सूची: संस्थान द्वारा हस्ताक्षरित आधिकारिक शुल्क संरचना दस्तावेज।",
        "वित्तीय सह-उधारकर्ता दस्तावेज: माता-पिता या अभिभावक (सह-आवेदक) के आयकर रिटर्न, वेतन पर्ची और बैंक विवरण।"
      ]
    },
    eligibility: {
      english: "Indian National. Secured admission in a recognized professional or technical course in India or abroad through an entrance exam or merit-based selection.",
      hindi: "भारतीय नागरिक होना चाहिए। प्रवेश परीक्षा या योग्यता के आधार पर भारत या विदेश में मान्यता प्राप्त व्यावसायिक या तकनीकी पाठ्यक्रम में प्रवेश प्राप्त किया हो।"
    },
    officialInfoPage: getOfficialLink("governmentSchemes", "vidyalakshmi") || ""
  },
  {
    id: "personal_loan",
    name: {
      english: "Personal Loan (Unsecured Credit)",
      hindi: "व्यक्तिगत ऋण (पर्सनल लोन)",
      telugu: "వ్యక్తిగత రుణం (పర్సనల్ లోన్)",
      tamil: "தனிநபர் கடன் (பர்சனல் லோன்)",
      kannada: "ವಯಕ್ತಿಕ ಸಾಲ (ಪರ್ಸನಲ್ ಲೋನ್)",
      odia: "ବ୍ୟକ୍ତିଗତ ଋଣ (ପର୍ସନାଲ୍ ଲୋନ୍)",
      urdu: "پرسنل لون (ذاتی قرضہ)"
    },
    category: "Unsecured Loan",
    verifiedBanks: ["sbi", "hdfc", "icici", "axis", "kotak", "federal"],
    description: {
      english: "Multi-purpose loan for medical emergencies, travel, weddings, or personal requirements without pledging collateral.",
      hindi: "बिना किसी जमानत (गारंटी) के चिकित्सा आपात स्थिति, यात्रा, विवाह, या व्यक्तिगत आवश्यकताओं के लिए बहुउद्देश्यीय ऋण।",
      telugu: "ఎలాంటి పూచీకత్తు (శ్యూరిటీ) లేకుండా వైద్య అత్యవసరాలు, వివాహం, ప్రయాణం లేదా వ్యక్తిగత అవసరాల కోసం ఇచ్చే బహుళార్ధసాధక రుణం.",
      tamil: "மருத்துவ அவசரநிலைகள், பயணம், திருமணங்கள் அல்லது தனிப்பட்ட தேவைகளுக்காக எந்தவொரு அடமானமும் இன்றி வழங்கப்படும் பல்நோக்கு கடன்.",
      kannada: "ಯಾವುದೇ ಅಡಮಾನವಿಲ್ಲದೆ ವೈದ್ಯಕೀಯ ತುರ್ತುಸ್ಥಿತಿ, ಪ್ರವಾಸ, ಮದುವೆ ಅಥವಾ ವೈಯಕ್ತಿಕ ಅವಶ್ಯಕತೆಗಳಿಗಾಗಿ ನೀಡಲಾಗುವ ಸಾಲ.",
      odia: "କୌଣସି ଜମି କିମ୍ବା ସୁନା ବନ୍ଧକ ନରଖି ଚିକିତ୍ସା ଜରୁରୀକାଳୀନ ପରିସ୍ଥିତି, ବିବାହ, ଯାତ୍ରା କିମ୍ବା ବ୍ୟକ୍ତିଗତ ଆବଶ୍ୟକତା ପାଇଁ ମିଳୁଥିବା ଋଣ।",
      urdu: "طبی ہنگامی حالات، شادی، سفر یا ذاتی ضروریات کے لیے بغیر کسی ضمانت کے حاصل ہونے والا کثیر المقاصد قرضہ۔"
    },
    documents: {
      english: [
        "PAN Card (mandatory in India).",
        "Aadhaar Card or Passport for identity and address verification.",
        "Salary Slips for the last 3-6 months showing stable employment.",
        "Bank Account Statement for the last 6 months showing salary credits."
      ],
      hindi: [
        "पैन कार्ड (भारत में अनिवार्य)।",
        "पहचान और पते के सत्यापन के लिए आधार कार्ड या पासपोर्ट।",
        "स्थिर रोजगार दर्शाने वाली पिछले 3-6 महीनों की सैलरी स्लिप।",
        "वेतन जमा दर्शाने वाला पिछले 6 महीनों का बैंक स्टेटमेंट।"
      ]
    },
    eligibility: {
      english: "Age between 21 to 60 years. Minimum monthly income of ₹15,000 (higher limits apply for metropolitan cities). Minimum credit score of 720+ preferred.",
      hindi: "उम्र 21 से 60 वर्ष के बीच। न्यूनतम मासिक आय ₹15,000 (महानगरों के लिए उच्च सीमाएं लागू)। 720+ क्रेडिट स्कोर होना आवश्यक है।"
    },
    officialInfoPage: getOfficialLink("regulators", "rbi") || ""
  },
  {
    id: "gold_loan",
    name: {
      english: "Gold Loan (Secured Jewelry Credit)",
      hindi: "स्वर्ण ऋण (गोल्ड लोन)",
      telugu: "బంగారు రుణం (గోల్డ్ లోన్)",
      tamil: "தங்கக் கடன் (கோல்ட் லோன்)",
      kannada: "ಚಿನ್ನದ ಸಾಲ (ಗೋಲ್ಡ್ ಲೋನ್)",
      odia: "ସୁନା ଋଣ (ଗୋଲ୍ଡ ଲୋନ୍)",
      urdu: "گولڈ لون (سونے پر قرضہ)"
    },
    category: "Secured Loan",
    verifiedBanks: ["sbi", "canara", "federal", "kvb", "sib"],
    description: {
      english: "Instant short-term credit backed by pledging gold ornaments (18 to 24 carat purity). Requires very fast processing and minimal documentation.",
      hindi: "सोने के गहनों (18 से 24 कैरेट शुद्धता) को गिरवी रखकर त्वरित अल्पकालिक ऋण। बहुत तेज स्वीकृति और न्यूनतम दस्तावेजों की आवश्यकता।",
      telugu: "మీ బంగారు ఆభరణాలను (18 నుండి 24 క్యారెట్ల స్వచ్ఛత) బ్యాంకులో ఉంచి అత్యంత తక్కువ పత్రాలతో వేగంగా పొందే రుణం.",
      tamil: "தங்க நகைகளை (18 முதல் 24 காரட் தூய்மை) அடகு வைத்து விரைவாகப் பெறப்படும் குறுகிய கால கடன். மிகக் குறைந்த ஆவணங்கள் மட்டுமே தேவைப்படும்.",
      kannada: "ಚಿನ್ನದ ಆಭరణಗಳನ್ನು (18 ರಿಂದ 24 ಕ್ಯಾರೆಟ್) ಅಡವಿಟ್ಟು ಕಡಿಮೆ ದಾಖಲೆಗಳೊಂದಿಗೆ ವೇಗವಾಗಿ ಪಡೆಯುವ ಸಾಲ.",
      odia: "ସୁନା ଅଳଙ୍କାର (୧୮ ରୁ ୨୪ କ୍ୟାରେଟ୍) ବନ୍ଧକ ରଖି ସ୍ୱଳ୍ପ କାଗଜପତ୍ର ସହିତ ଶୀଘ୍ର ମିଳୁଥିବା ଋଣ।",
      urdu: "سونے کے زیورات (18 سے 24 کیریٹ خالص) کو گروی رکھ کر فوری اور مختصر مدت کے لیے ملنے والا قرضہ۔"
    },
    documents: {
      english: [
        "Aadhaar Card, PAN Card, or Voter ID.",
        "Address proof if current address differs from Aadhaar.",
        "Gold evaluation certificate (arranged by the lending bank branch)."
      ],
      hindi: [
        "आधार कार्ड, पैन कार्ड, या मतदाता पहचान पत्र।",
        "यदि वर्तमान पता आधार कार्ड से अलग है तो पते का प्रमाण।",
        "स्वर्ण मूल्यांकन प्रमाणपत्र (ऋणदाता बैंक शाखा द्वारा ही व्यवस्थित किया जाता है)।"
      ]
    },
    eligibility: {
      english: "Age 18+ years. Must own gold ornaments/coins with a purity of 18-24 carats. The Loan-to-Value (LTV) ratio is capped strictly at 75% of the appraised value by RBI regulations.",
      hindi: "उम्र 18+ वर्ष। गिरवी रखने के लिए 18-24 कैरेट शुद्धता के सोने के आभूषण/सिक्के होने चाहिए। आरबीआई के नियमों के अनुसार लोन राशि सोने के मूल्य के अधिकतम 75% तक सीमित है।"
    },
    officialInfoPage: getOfficialLink("regulators", "rbi") || ""
  },
  {
    id: "agri_loan",
    name: {
      english: "Agriculture Loan (Kisan Credit Card)",
      hindi: "कृषि ऋण (किसान क्रेडिट कार्ड - KCC)",
      telugu: "వ్యవసాయ రుణం (కిసాన్ క్రెడిట్ కార్డ్)",
      tamil: "விவசாயக் கடன் (கிசான் கிரெடிட் கார்டு)",
      kannada: "ಕೃಷಿ ಸಾಲ (ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್)",
      odia: "କୃଷି ଋଣ (କିଷାନ୍ କ୍ରେଡିଟ୍ କାର୍ଡ୍)",
      urdu: "زرعی قرض (کسان کریڈٹ کارڈ)"
    },
    category: "Priority Sector Loan",
    verifiedBanks: ["sbi", "bob", "canara", "apgvb", "tgb"],
    description: {
      english: "Subsidized, low-interest farming loans to support crop cultivation, fertilizers, machinery, and allied activities.",
      hindi: "फसल उत्पादन, बीज, खाद, कृषि उपकरण और संबद्ध गतिविधियों की खरीद के लिए रियायती, कम ब्याज वाले कृषि ऋण।",
      telugu: "వ్యవసాయ సాగు, విత్తనాలు, ఎరువులు, యంత్రాల కొనుగోలు మరియు ఇతర వ్యవసాయ పనుల కోసం ఇచ్చే తక్కువ వడ్డీ రుణాలు.",
      tamil: "பயிர் சாகுபடி, விதைகள், உரங்கள், இயந்திரங்கள் வாங்க விவசாயிகளுக்கு வழங்கப்படும் குறைந்த வட்டி கடன்.",
      kannada: "ಬೆಳೆ ಬೇಸಾಯ, ರಸಗೊಬ್ಬರ, ಕೃಷಿ ಯಂತ್ರೋಪಕರಣಗಳ ಖರೀದಿಗೆ ಕೃಷಿಕರಿಗೆ ಒದಗಿಸುವ ರಿಯಾಯಿತಿ ದರದ ಕಡಿಮೆ ಬಡ್ಡಿಯ ಸಾಲ.",
      odia: "ଫସଲ ଚାଷ, ସାର, କୃଷି ଯନ୍ତ୍ରପାତି କିଣିବା ଏବଂ ଚାଷୀଙ୍କ ଘରୋଇ ଆବଶ୍ୟକତା ପାଇଁ ଅତି କମ୍ ସୁଧରେ ମିଳୁଥିବା ଋଣ।",
      urdu: "فصل کی کاشت، کھاد، بیج، زرعی آلات کی خریداری کے لیے کسانوں کو دیا جانے والا کم سود کا قرضہ۔"
    },
    documents: {
      english: [
        "Land Ownership Records: Pattadar Passbook, Khatauni, or land tax receipts.",
        "Aadhaar Card or Voter ID.",
        "Crop cultivation details signed by local revenue officers."
      ],
      hindi: [
        "भूमि स्वामित्व रिकॉर्ड: पट्टादार पासबुक, खतौनी, या भूमि कर की रसीदें।",
        "आधार कार्ड या मतदाता पहचान पत्र।",
        "स्थानीय राजस्व अधिकारियों द्वारा हस्ताक्षरित फसल की बुवाई का विवरण।"
      ]
    },
    eligibility: {
      english: "Farmers (owner-cultivators, tenant farmers, sharecroppers, or self-help groups). Land holding documents are mandatory.",
      hindi: "किसान (भूमि मालिक, बटाईदार या स्वयं सहायता समूह)। भूमि स्वामित्व के दस्तावेज अनिवार्य हैं।"
    },
    officialInfoPage: getOfficialLink("governmentSchemes", "nabard") || ""
  }
];

// 2. VERIFIED GOVERNMENT SCHEMES DATA
export const VERIFIED_SCHEMES: VerifiedScheme[] = [
  {
    id: "pmjdy",
    name: {
      english: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
      hindi: "प्रधानमंत्री जन धन योजना (PMJDY)",
      telugu: "ప్రధాన మంత్రి జన్ ధన్ యోజന (PMJDY)",
      tamil: "பிரதான் மந்திரி ஜன் தன் யோஜனா (PMJDY)",
      kannada: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಜನ್ ಧನ್ ಯೋಜನೆ (PMJDY)",
      odia: "ପ୍ରଧାନମନ୍ତ୍ରୀ ଜନ ଧନ ଯୋଜନା (PMJDY)",
      urdu: "وزیر اعظم جن دھن یوجنا (PMJDY)"
    },
    authority: "Ministry of Finance, Government of India",
    category: "rural",
    description: {
      english: "National Mission for Financial Inclusion in India, providing access to basic financial services like savings accounts, remittances, credit, insurance, and pensions.",
      hindi: "वित्तीय समावेशन का राष्ट्रीय मिशन, जो बुनियादी बचत खातों, धन प्रेषण, ऋण, बीमा और पेंशन जैसी बुनियादी वित्तीय सेवाएं प्रदान करता है।",
      telugu: "ఆర్థిక చేర్పుల జాతీయ మిషన్. ఇది జీరో బ్యాలెన్స్ సేవింగ్స్ ఖాతా, ఉచిత డెబిట్ కార్డు మరియు ప్రమాద భీమా సౌకర్యం కల్పిస్తుంది.",
      tamil: "அடிப்படை சேமிப்பு கணக்கு, காப்பீடு மற்றும் ஓய்வூதியம் போன்ற நிதிச் சேவைகளை அனைவருக்கும் வழங்கும் தேசிய திட்டம்.",
      kannada: "ಮೂಲಭೂತ ಆರ್ಥಿಕ ಸೇವೆಗಳು ಎಲ್ಲರಿಗೂ ಸಿಗುವಂತೆ ಮಾಡಲು ಆರಂಭಿಸಿದ ರಾಷ್ಟ್ರೀಯ ಯೋಜನೆಯಾಗಿದೆ.",
      odia: "ଆର୍ଥିକ ଅନ୍ତର୍ଭୁକ୍ତୀକରଣର ଏକ ଜାତୀୟ ମିଶନ, ଯାହା ଶୂନ୍ୟ ସଞ୍ଚୟ ଆକାଉଣ୍ଟ୍, ବୀମା ଏବଂ ପେନସନ୍ ସୁବିଧା ଦେଇଥାଏ।",
      urdu: "قومی مشن برائے مالی شمولیت جس کے تحت غریب ترین لوگوں کو بنیادی بچت کھاتہ فراہم کیا جاتا ہے۔"
    },
    benefits: {
      english: [
        "Basic savings bank account with zero minimum balance requirement.",
        "Free RuPay Debit Card with built-in ₹2 Lakh accidental insurance coverage.",
        "Overdraft (OD) facility up to ₹10,000 for eligible account holders.",
        "Compatibility with Direct Benefit Transfer (DBT) to receive government subsidies directly."
      ],
      hindi: [
        "शून्य न्यूनतम शेष आवश्यकता वाला बुनियादी बचत बैंक खाता।",
        "₹2 लाख के इन-बिल्ट दुर्घटना बीमा कवरेज के साथ मुफ्त रुपे डेबिट कार्ड।",
        "पात्र खाताधारकों के लिए ₹10,000 तक की ओवरड्राफ्ट (ओडी) सुविधा।",
        "सरकारी सब्सिडी सीधे खाते में प्राप्त करने के लिए प्रत्यक्ष लाभ हस्तांतरण (डीबीटी) की सुविधा।"
      ]
    },
    officialUrl: getOfficialLink("governmentSchemes", "pmjdy") || ""
  },
  {
    id: "pmsby",
    name: {
      english: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
      hindi: "प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)",
      telugu: "ప్రధాన మంత్రి సురక్షా బీమా యోజన (PMSBY)",
      tamil: "பிரதான் மந்திரி ಸುರಕ್ಷா பீமா யோஜனா (PMSBY)",
      kannada: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಸುರಕ್ಷಾ ಬಿಮಾ ಯೋಜನೆ (PMSBY)",
      odia: "ପ୍ରଧାନମନ୍ତ୍ରୀ ସୁରକ୍ଷା ବୀମା ଯୋଜନା (PMSBY)",
      urdu: "وزیر اعظم سرکشا بیما یوجنا (PMSBY)"
    },
    authority: "Ministry of Finance, Government of India",
    category: "general",
    description: {
      english: "An affordable government-backed accidental death and disability insurance scheme in India.",
      hindi: "भारत में एक सस्ती सरकार समर्थित आकस्मिक मृत्यु और विकलांगता बीमा योजना।",
      telugu: "అత్యంత తక్కువ ప్రీమియంతో లభించే కేంద్ర ప్రభుత్వ ప్రమాద మరియు అంగవైకల్య బీమా పథకం.",
      tamil: "குறைந்த பிரீமியத்தில் வழங்கப்படும் விபத்து காப்பீட்டுத் திட்டம்.",
      kannada: "ಕಡಿಮೆ ಪ್ರೀಮಿಯಂ ದರದಲ್ಲಿ ಸಿಗುವ ಅಪಘಾತ ಮರಣ ಮತ್ತು ವಿಕಲಚೇತನ ವಿಮಾ ಯೋಜನೆಯಾಗಿದೆ.",
      odia: "ଏକ ସ୍ୱଳ୍ਪ ମୂଲ୍ୟର ସରକାରୀ ଦୁର୍ଘଟଣା ଜନିତ ମୃତ୍ୟୁ ଏବଂ ଅକ୍ଷମତା ବୀମା ଯୋଜନା।",
      urdu: "انتہائی کم پریمیم پر حادثاتی موت اور معذوری کا احاطہ کرنے والی انشورنس اسکیم۔"
    },
    benefits: {
      english: [
        "₹2 Lakh coverage for accidental death.",
        "₹2 Lakh coverage for total and irrecoverable loss of both eyes or loss of use of both hands or feet.",
        "₹1 Lakh coverage for partial loss of eyesight or loss of one hand or foot.",
        "Ultra-low annual premium of ₹20 auto-debited from the linked savings account."
      ],
      hindi: [
        "दुर्घटना में मृत्यु होने पर ₹2 लाख का कवरेज।",
        "दोनों आंखों या दोनों हाथों-पैरों की पूर्ण क्षति होने पर ₹2 लाख का कवरेज।",
        "एक आंख या एक हाथ-पैर की आंशिक क्षति होने पर ₹1 लाख का कवरेज।",
        "संबद्ध बचत खाते से ₹20 का न्यूनतम वार्षिक प्रीमियम स्वतः कट जाता है।"
      ]
    },
    officialUrl: getOfficialLink("governmentSchemes", "jan-suraksha") || ""
  },
  {
    id: "apy",
    name: {
      english: "Atal Pension Yojana (APY)",
      hindi: "अटल पेंशन योजना (APY)",
      telugu: "అటల్ పెన్షన్ యోజన (APY)",
      tamil: "அடல் பென்ஷன் யோஜனா (APY)",
      kannada: "ಅಟಲ್ ಪೆನ್ಷನ್ ಯೋಜನೆ (APY)",
      odia: "ଅଟଳ ପେନସନ୍ ଯୋଜନା (APY)",
      urdu: "اٹل پنشن یوجنا (APY)"
    },
    authority: "PFRDA, Government of India",
    category: "citizen",
    description: {
      english: "A government-backed pension scheme in India targeted primarily at the unorganized sector workers.",
      hindi: "मुख्य रूप से असंगठित क्षेत्र के कामगारों के लिए सरकार समर्थित मासिक सामाजिक सुरक्षा पेंशन योजना।",
      telugu: "అసంఘటిత రంగ కార్మికుల కోసం ఉద్దేశించిన కేంద్ర ప్రభుత్వ పింఛను పథకం.",
      tamil: "அமைப்புசாரா துறை தொழிலாளர்களுக்காக தொடங்கப்பட்ட அரசு ஓய்வூதியத் திட்டம்.",
      kannada: "ಅಸಂಘಟಿತ ವಲಯದ ಕಾರ್ಮಿಕರಿಗಾಗಿ ಮೀಸಲಾದ ಮಾಸಿಕ ಪಿಂಚಣಿ ಯೋಜನೆಯಾಗಿದೆ.",
      odia: "ଅଣସଂଗଠିତ କ୍ଷେତ୍ରର ଶ୍ରମିକମାନଙ୍କ ପାଇଁ ସରକାରୀ ପେନସନ୍ ଯୋଜନା।",
      urdu: "غیر منظم شعبے کے مزدوروں کے لیے حکومت ہند کی ماہانہ پنشن اسکیم۔"
    },
    benefits: {
      english: [
        "Guaranteed minimum monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 after attaining 60 years of age.",
        "Pension amount depends on age of entry and monthly contribution.",
        "Pension continues to spouse after subscriber's death.",
        "Return of complete accumulated corpus to the nominee in case of death of both subscriber and spouse."
      ],
      hindi: [
        "60 वर्ष की आयु प्राप्त करने के बाद ₹1,000, ₹2,000, ₹3,000, ₹4,000 या ₹5,000 की गारंटीकृत न्यूनतम मासिक पेंशन।",
        "पेंशन की राशि प्रवेश के समय आयु और मासिक योगदान पर निर्भर करती है।",
        "अंशदाता की मृत्यु के बाद पेंशन उसके जीवनसाथी को जारी रहती है।",
        "अंशदाता और जीवनसाथी दोनों की मृत्यु के मामले में नामांकित व्यक्ति को पूरी संचित राशि वापस मिल जाती है।"
      ]
    },
    officialUrl: getOfficialLink("governmentSchemes", "pfrda") || ""
  }
];

// 3. VERIFIED CYBER SECURITY DATA (grounded strictly on official guidelines)
export const VERIFIED_CYBER_SAFETY: VerifiedCyberSafety = {
  id: "cyber_safety",
  title: {
    english: "Cyber Fraud & Online Banking Scam Safety Guide",
    hindi: "साइबर धोखाधड़ी और ऑनलाइन बैंकिंग धोखाधड़ी सुरक्षा गाइड",
    telugu: "సైబర్ మోసాలు మరియు ఆన్‌లైన్ బ్యాంకింగ్ మోసాల నివారణ మార్గదర్శకం"
  },
  helpline: "1930",
  complaintPortal: getOfficialLink("cyberSafety", "cyber-complaint") || "",
  tips: {
    english: [
      "Never share OTP, PIN, CVV, passwords, net banking, or UPI PIN with bank employees, customer care representatives, or anyone.",
      "Check browser address bar URLs carefully. Official government bank URLs end with 'https://' and have a secure padlock icon.",
      "Never click links inside SMS alerts claiming your account is blocked, KYC is pending, or electricity bills are unpaid.",
      "Do not search for bank customer care numbers on Google. Fake numbers are uploaded by scammers. Fetch helpline contacts directly from passbooks, official bank mobile apps, or the official portal."
    ],
    hindi: [
      "कभी भी बैंक कर्मचारियों, ग्राहक सेवा प्रतिनिधियों या किसी के साथ भी ओटीपी, पिन, सीवीवी, पासवर्ड या यूपीआई पिन साझा न करें।",
      "ब्राउज़र एड्रेस बार यूआरएल की सावधानीपूर्वक जांच करें। आधिकारिक सरकारी बैंक यूआरएल 'https://' से शुरू होते हैं और ताले के निशान वाले होते हैं।",
      "केवाईसी (KYC) पेंडिंग होने या खाता ब्लॉक होने का दावा करने वाले एसएमएस के लिंक पर कभी भी क्लिक न करें।",
      "गूगल पर बैंक कस्टमर केयर के नंबर न खोजें। पासबुक या बैंक के आधिकारिक ऐप पर दिए नंबर ही सुरक्षित हैं।"
    ]
  },
  recoverySteps: {
    english: [
      "Call the National Cyber Crime Helpline at 📞 1930 immediately (within the golden hour, preferably under 2 hours).",
      "File a formal online cyber complaint at www.cybercrime.gov.in.",
      "Report the incident immediately to your bank's grievance department to freeze the account/debit card to prevent further losses.",
      "Under RBI zero-liability rules, if you report unauthorized transaction within 3 days, the bank is liable for refunds (depending on the type of transaction)."
    ],
    hindi: [
      "तुरंत राष्ट्रीय साइबर अपराध हेल्पलाइन नंबर 📞 1930 पर कॉल करें (स्वर्णिम घंटे के भीतर)।",
      "www.cybercrime.gov.in पर ऑनलाइन साइबर शिकायत दर्ज करें।",
      "अपने बैंक को सूचित करें और पैसे के आगे हस्तांतरण को रोकने के लिए तुरंत अपना खाता/डेबिट कार्ड ब्लॉक कराएं।"
    ]
  }
};

// Help helper to get verified bank list names dynamically
export function getVerifiedBanksForLoan(loanId: string, lang: string): string {
  const loan = VERIFIED_LOANS.find(l => l.id === loanId);
  if (!loan) return "";
  
  const bankNames = loan.verifiedBanks.map(id => {
    const bankObj = BANKS.find(b => b.id === id);
    if (!bankObj) return "";
    const names = bankObj.names;
    const langKey = lang as keyof typeof names;
    return names[langKey] || names.english || bankObj.name;
  }).filter(Boolean);

  return bankNames.join(", ");
}

// Help helper to get all bank names in BankHub
export function getSupportedBanksList(lang: string): string {
  const bankNames = BANKS.map(b => {
    const names = b.names;
    const langKey = lang as keyof typeof names;
    return names[langKey] || names.english || b.name;
  });
  return bankNames.join(", ");
}
