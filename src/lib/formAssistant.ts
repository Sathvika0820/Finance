import type { AppLanguage } from "@/lib/i18n";

export type FieldKind = "text" | "mobile" | "email" | "pan" | "aadhaar" | "date" | "account" | "image" | "boxed" | "yesno" | "singlejoint";

export interface AssistantField {
  key: string;
  label: string;
  question: string;
  type: FieldKind;
}

const LABEL_OVERRIDES: Record<string, string> = {
  applicant1_name: "First applicant name",
  applicant2_name: "Second applicant name",
  account_number: "Account number",
  account_number_boxes: "Account number",
  customer_name: "Customer name",
  customer_name_boxes: "Customer name",
  primary_holder_name: "Primary account holder name",
  primary_mobile_number_boxes: "Primary mobile number",
  primary_pan_boxes: "Primary PAN number",
  primary_gender: "Primary holder gender",
  primary_occupation: "Primary holder occupation",
  primary_marital_status: "Primary holder marital status",
  primary_category: "Primary holder category",
  primary_nationality: "Primary holder nationality",
  primary_gross_annual_income: "Primary gross annual income",
  joint_holder_name: "Joint account holder name",
  joint_mobile_number_boxes: "Joint holder mobile number",
  joint_pan_boxes: "Joint holder PAN number",
  joint_gender: "Joint holder gender",
  joint_occupation: "Joint holder occupation",
  joint_marital_status: "Joint holder marital status",
  joint_category: "Joint holder category",
  joint_nationality: "Joint holder nationality",
  joint_gross_annual_income: "Joint gross annual income",
  house_building_name: "House no / building name",
  street_name: "Street name",
  locality: "Locality",
  city: "City",
  state: "State",
  country: "Country",
  pin_code_boxes: "PIN code",
  primary_holder_photo: "Primary holder photo",
  joint_holder_photo: "Joint holder photo",
  primary_signature: "Primary holder signature",
  joint_signature: "Joint holder signature",
  has_joint_holder: "Joint account holder",
  mobile_number: "Mobile number",
  mobile_number_boxes: "Mobile number",
  new_mobile_number: "New mobile number",
  dob_dd_boxes: "Date of birth day",
  dob_mm_boxes: "Date of birth month",
  dob_yy_boxes: "Date of birth year",
  email_id: "Email ID",
  pan_number: "PAN number",
  aadhaar_number: "Aadhaar number",
  aadhaar_number_update: "Aadhaar number to update",
  aadhaar_number_delete: "Aadhaar number to delete",
  kyc_document_number: "KYC document number",
  correspondence_address_line1: "Correspondence address line 1",
  correspondence_address_line2: "Correspondence address line 2",
  correspondence_address_line3: "Correspondence address line 3",
  permanent_address_line1: "Permanent address line 1",
  permanent_address_line2: "Permanent address line 2",
  permanent_address_line3: "Permanent address line 3",
  father_mother_spouse_name: "Father, mother, or spouse name",
  request_date: "Request date",
  issue_date: "Issue date",
  valid_till_date: "Valid till date",
  transfer_branch_code: "Transfer branch code",
  transfer_cif_to_branch_name: "Transfer CIF to branch name",
  branch_name: "Branch name",
  bank_name: "Bank name",
  place_of_issue: "Place of issue",
  new_title: "New title",
  new_name: "New name",
  cheque_name: "Name to print on cheque book",
  number_of_leaflets: "Number of cheque leaflets",
  nominee_name: "Nominee name",
  nominee_relation: "Nominee relationship",
  nominee_address: "Nominee address",
  signature: "Signature",
  customer_signature: "Customer signature",
  passport_photo: "Passport photo",
};

function titleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const QUESTION_TRANSLATIONS: Partial<Record<AppLanguage, Record<string, string>>> = {
  hindi: {
    customer_name_boxes: "आपका पूरा नाम क्या है?",
    mobile_number_boxes: "आपका मोबाइल नंबर क्या है?",
    primary_mobile_number_boxes: "प्राथमिक खाताधारक का मोबाइल नंबर क्या है?",
    joint_mobile_number_boxes: "संयुक्त खाताधारक का मोबाइल नंबर क्या है?",
    primary_pan_boxes: "प्राथमिक खाताधारक का PAN नंबर क्या है?",
    joint_pan_boxes: "संयुक्त खाताधारक का PAN नंबर क्या है?",
    pin_code_boxes: "PIN कोड क्या है?",
    account_number_boxes: "आपका खाता नंबर क्या है?",
    branch_name: "शाखा का नाम क्या है?",
    request_date: "अनुरोध की तारीख क्या है?",
    primary_holder_name: "प्राथमिक खाताधारक का नाम क्या है?",
    has_joint_holder: "क्या संयुक्त खाताधारक है? Yes या No लिखें।",
    joint_holder_name: "संयुक्त खाताधारक का नाम क्या है?",
    email_id: "आपका ईमेल पता क्या है?",
    customer_signature: "कृपया अपना हस्ताक्षर अपलोड करें।",
    primary_signature: "कृपया प्राथमिक खाताधारक का हस्ताक्षर अपलोड करें।",
    joint_signature: "कृपया संयुक्त खाताधारक का हस्ताक्षर अपलोड करें।",
    primary_holder_photo: "कृपया प्राथमिक खाताधारक की फोटो अपलोड करें।",
    joint_holder_photo: "कृपया संयुक्त खाताधारक की फोटो अपलोड करें।",
  },
  telugu: {
    customer_name_boxes: "మీ పూర్తి పేరు ఏమిటి?",
    mobile_number_boxes: "మీ మొబైల్ నంబర్ ఏమిటి?",
    primary_mobile_number_boxes: "ప్రాథమిక ఖాతాదారుడి మొబైల్ నంబర్ ఏమిటి?",
    joint_mobile_number_boxes: "జాయింట్ ఖాతాదారుడి మొబైల్ నంబర్ ఏమిటి?",
    primary_pan_boxes: "ప్రాథమిక ఖాతాదారుడి PAN నంబర్ ఏమిటి?",
    joint_pan_boxes: "జాయింట్ ఖాతాదారుడి PAN నంబర్ ఏమిటి?",
    pin_code_boxes: "PIN కోడ్ ఏమిటి?",
    account_number_boxes: "మీ ఖాతా నంబర్ ఏమిటి?",
    branch_name: "బ్రాంచ్ పేరు ఏమిటి?",
    request_date: "అభ్యర్థన తేదీ ఏమిటి?",
    primary_holder_name: "ప్రాథమిక ఖాతాదారుడి పేరు ఏమిటి?",
    has_joint_holder: "జాయింట్ ఖాతాదారు ఉన్నారా? Yes లేదా No టైప్ చేయండి.",
    joint_holder_name: "జాయింట్ ఖాతాదారుడి పేరు ఏమిటి?",
    email_id: "మీ ఇమెయిల్ చిరునామా ఏమిటి?",
    customer_signature: "దయచేసి మీ సంతకాన్ని అప్లోడ్ చేయండి.",
    primary_signature: "దయచేసి ప్రాథమిక ఖాతాదారుడి సంతకాన్ని అప్లోడ్ చేయండి.",
    joint_signature: "దయచేసి జాయింట్ ఖాతాదారుడి సంతకాన్ని అప్లోడ్ చేయండి.",
    primary_holder_photo: "దయచేసి ప్రాథమిక ఖాతాదారుడి ఫోటో అప్లోడ్ చేయండి.",
    joint_holder_photo: "దయచేసి జాయింట్ ఖాతాదారుడి ఫోటో అప్లోడ్ చేయండి.",
  },
  tamil: {
    mobile_number_boxes: "உங்கள் மொபைல் எண் என்ன?",
    account_number_boxes: "உங்கள் கணக்கு எண் என்ன?",
    branch_name: "கிளையின் பெயர் என்ன?",
    request_date: "கோரிக்கை தேதி என்ன?",
    primary_holder_name: "முதன்மை கணக்குதாரரின் பெயர் என்ன?",
    has_joint_holder: "கூட்டு கணக்குதாரர் உள்ளாரா? Yes அல்லது No என உள்ளிடவும்.",
    email_id: "உங்கள் மின்னஞ்சல் முகவரி என்ன?",
  },
  kannada: {
    mobile_number_boxes: "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಏನು?",
    account_number_boxes: "ನಿಮ್ಮ ಖಾತೆ ಸಂಖ್ಯೆ ಏನು?",
    branch_name: "ಶಾಖೆಯ ಹೆಸರು ಏನು?",
    request_date: "ವಿನಂತಿಯ ದಿನಾಂಕ ಏನು?",
    primary_holder_name: "ಪ್ರಾಥಮಿಕ ಖಾತೆದಾರರ ಹೆಸರು ಏನು?",
    has_joint_holder: "ಜಂಟಿ ಖಾತೆದಾರರಿದ್ದಾರೆಯೇ? Yes ಅಥವಾ No ಎಂದು ನಮೂದಿಸಿ.",
    email_id: "ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸ ಏನು?",
  },
  malayalam: {
    mobile_number_boxes: "നിങ്ങളുടെ മൊബൈൽ നമ്പർ എന്താണ്?",
    account_number_boxes: "നിങ്ങളുടെ അക്കൗണ്ട് നമ്പർ എന്താണ്?",
    branch_name: "ശാഖയുടെ പേര് എന്താണ്?",
    request_date: "അഭ്യർത്ഥന തീയതി എന്താണ്?",
    primary_holder_name: "പ്രാഥമിക അക്കൗണ്ട് ഉടമയുടെ പേര് എന്താണ്?",
    has_joint_holder: "ജോയിന്റ് അക്കൗണ്ട് ഉടമ ഉണ്ടോ? Yes അല്ലെങ്കിൽ No നൽകുക.",
    email_id: "നിങ്ങളുടെ ഇമെയിൽ വിലാസം എന്താണ്?",
  },
  marathi: {
    mobile_number_boxes: "तुमचा मोबाईल नंबर काय आहे?",
    account_number_boxes: "तुमचा खाते क्रमांक काय आहे?",
    branch_name: "शाखेचे नाव काय आहे?",
    request_date: "विनंतीची तारीख काय आहे?",
    primary_holder_name: "प्राथमिक खातेदाराचे नाव काय आहे?",
    has_joint_holder: "संयुक्त खातेदार आहे का? Yes किंवा No लिहा.",
    email_id: "तुमचा ईमेल पत्ता काय आहे?",
  },
  gujarati: {
    mobile_number_boxes: "તમારો મોબાઇલ નંબર શું છે?",
    account_number_boxes: "તમારો એકાઉન્ટ નંબર શું છે?",
    branch_name: "શાખાનું નામ શું છે?",
    request_date: "વિનંતીની તારીખ શું છે?",
    primary_holder_name: "પ્રાથમિક ખાતાધારકનું નામ શું છે?",
    has_joint_holder: "શું સંયુક્ત ખાતાધારક છે? Yes અથવા No લખો.",
    email_id: "તમારું ઇમેઇલ સરનામું શું છે?",
  },
  bengali: {
    mobile_number_boxes: "আপনার মোবাইল নম্বর কী?",
    account_number_boxes: "আপনার অ্যাকাউন্ট নম্বর কী?",
    branch_name: "শাখার নাম কী?",
    request_date: "অনুরোধের তারিখ কী?",
    primary_holder_name: "প্রাথমিক অ্যাকাউন্টধারীর নাম কী?",
    has_joint_holder: "যৌথ অ্যাকাউন্টধারী আছে কি? Yes বা No লিখুন।",
    email_id: "আপনার ইমেল ঠিকানা কী?",
  },
  punjabi: {
    mobile_number_boxes: "ਤੁਹਾਡਾ ਮੋਬਾਈਲ ਨੰਬਰ ਕੀ ਹੈ?",
    account_number_boxes: "ਤੁਹਾਡਾ ਖਾਤਾ ਨੰਬਰ ਕੀ ਹੈ?",
    branch_name: "ਸ਼ਾਖਾ ਦਾ ਨਾਮ ਕੀ ਹੈ?",
    request_date: "ਬੇਨਤੀ ਦੀ ਤਾਰੀਖ ਕੀ ਹੈ?",
    primary_holder_name: "ਪ੍ਰਾਇਮਰੀ ਖਾਤਾਧਾਰਕ ਦਾ ਨਾਮ ਕੀ ਹੈ?",
    has_joint_holder: "ਕੀ ਜੋਇੰਟ ਖਾਤਾਧਾਰਕ ਹੈ? Yes ਜਾਂ No ਲਿਖੋ।",
    email_id: "ਤੁਹਾਡਾ ਈਮੇਲ ਪਤਾ ਕੀ ਹੈ?",
  },
};

function localizedQuestion(key: string, language: AppLanguage, fallback: string) {
  return QUESTION_TRANSLATIONS[language]?.[key] || fallback;
}

export function getFieldLabel(key: string) {
  const accountBoxMatch = key.match(/^account_number_(\d+)_boxes$/);
  if (accountBoxMatch) return `Account number ${accountBoxMatch[1]}`;
  const singleJointMatch = key.match(/^account_(\d+)_single_joint$/);
  if (singleJointMatch) return `Account ${singleJointMatch[1]} single/joint`;
  const transactionMatch = key.match(/^account_(\d+)_transaction_rights$/);
  if (transactionMatch) return `Account ${transactionMatch[1]} transaction rights`;
  const limitedMatch = key.match(/^account_(\d+)_limited_transaction_rights$/);
  if (limitedMatch) return `Account ${limitedMatch[1]} limited transaction rights`;
  return LABEL_OVERRIDES[key] || titleCase(key);
}

export function getFieldType(key: string): FieldKind {
  const lower = key.toLowerCase();
  if (lower === "has_joint_holder") return "yesno";
  if (lower.endsWith("_boxes")) return "boxed";
  if (lower.includes("signature") || lower.includes("photo")) return "image";
  if (lower.includes("single_joint")) return "singlejoint";
  if (lower.includes("transaction_rights")) return "yesno";
  if (lower.includes("mobile") || lower.includes("phone")) return "mobile";
  if (lower.includes("email")) return "email";
  if (lower.includes("pan")) return "pan";
  if (lower.includes("aadhaar") || lower.includes("aadhar")) return "aadhaar";
  if (lower.includes("date") || lower.includes("dob")) return "date";
  if (lower.includes("account")) return "account";
  return "text";
}

export function getQuestionForPlaceholder(key: string, language: AppLanguage = "english") {
  const label = getFieldLabel(key);
  if (key === "customer_name_boxes") return localizedQuestion(key, language, "What is your full name?");
  if (key === "mobile_number_boxes") return localizedQuestion(key, language, "What is your mobile number?");
  if (key === "primary_mobile_number_boxes") return localizedQuestion(key, language, "What is the primary holder mobile number?");
  if (key === "joint_mobile_number_boxes") return localizedQuestion(key, language, "What is the joint holder mobile number?");
  if (key === "primary_pan_boxes") return localizedQuestion(key, language, "What is the primary holder PAN number?");
  if (key === "joint_pan_boxes") return localizedQuestion(key, language, "What is the joint holder PAN number?");
  if (key === "pin_code_boxes") return localizedQuestion(key, language, "What is the PIN code?");
  if (key === "account_number_boxes") return localizedQuestion(key, language, "What is your Account Number?");
  const accountBoxMatch = key.match(/^account_number_(\d+)_boxes$/);
  if (accountBoxMatch) return `What is account number ${accountBoxMatch[1]}?`;
  const singleJointMatch = key.match(/^account_(\d+)_single_joint$/);
  if (singleJointMatch) return `Is Account ${singleJointMatch[1]} Single or Joint?`;
  const transactionMatch = key.match(/^account_(\d+)_transaction_rights$/);
  if (transactionMatch) return `Enable Transaction Rights for Account ${transactionMatch[1]}? Type Yes or No.`;
  const limitedMatch = key.match(/^account_(\d+)_limited_transaction_rights$/);
  if (limitedMatch) return `Enable Limited Transaction Rights for Account ${limitedMatch[1]}? Type Yes or No.`;
  if (key === "dob_dd_boxes") return "What is your date of birth day? For example, 20.";
  if (key === "dob_mm_boxes") return "What is your date of birth month? For example, 08.";
  if (key === "dob_yy_boxes") return "What is your date of birth year? For example, 05.";
  if (key === "applicant1_name") return "What is the first applicant's name?";
  if (key === "branch_name") return localizedQuestion(key, language, "What is the branch name?");
  if (key === "request_date") return localizedQuestion(key, language, "What is the request date?");
  if (key === "primary_holder_name") return localizedQuestion(key, language, "What is the primary account holder name?");
  if (key === "has_joint_holder") return localizedQuestion(key, language, "Is there a Joint Account Holder? Type Yes or No.");
  if (key === "joint_holder_name") return localizedQuestion(key, language, "What is the joint account holder name?");
  if (key.endsWith("_gender")) return `What is the ${label.toLowerCase()}? Type Male, Female, or Other.`;
  if (key.endsWith("_marital_status")) return `What is the ${label.toLowerCase()}? Type Single, Married, or Other.`;
  if (key.endsWith("_category")) return `What is the ${label.toLowerCase()}? Type OBC, SC, ST, or OTH.`;
  if (key.endsWith("_occupation")) return `What is the ${label.toLowerCase()}?`;
  if (key.endsWith("_nationality")) return `What is the ${label.toLowerCase()}?`;
  if (key.endsWith("_gross_annual_income")) return `What is the ${label.toLowerCase()}?`;
  if (key === "customer_name") return "What is your full name?";
  if (key === "mobile_number") return "What is your mobile number?";
  if (key === "new_mobile_number") return "What is the new mobile number?";
  if (key === "account_number") return "What is your account number?";
  if (key === "pan_number") return "What is your PAN number?";
  if (key.includes("aadhaar")) return `What is the ${label.toLowerCase()}?`;
  if (key === "email_id") return localizedQuestion(key, language, "What is your email address?");
  if (key.includes("address")) return `Please enter ${label.toLowerCase()}.`;
  if (key.includes("date")) return `What is the ${label.toLowerCase()}?`;
  if (key === "primary_holder_photo") return localizedQuestion(key, language, "Please upload Primary Holder Photo.");
  if (key === "joint_holder_photo") return localizedQuestion(key, language, "Please upload Joint Holder Photo.");
  if (key === "primary_signature") return localizedQuestion(key, language, "Please upload Primary Holder Signature.");
  if (key === "joint_signature") return localizedQuestion(key, language, "Please upload Joint Holder Signature.");
  if (key.includes("signature")) return localizedQuestion(key, language, "Please upload your signature.");
  if (key === "passport_photo") return "Please upload your passport photo.";
  return `What is the ${label.toLowerCase()}?`;
}

export function buildAssistantFields(keys: string[], language: AppLanguage = "english"): AssistantField[] {
  return keys.map((key) => ({
    key,
    label: getFieldLabel(key),
    question: getQuestionForPlaceholder(key, language),
    type: getFieldType(key),
  }));
}

export function validateFieldValue(type: FieldKind, value: string, key = "") {
  const trimmed = value.trim();
  if (!trimmed) return "This field is required.";
  if (key === "account_number_boxes" && !/^\d{9,18}$/.test(trimmed.replace(/\s/g, ""))) {
    return "Account Number must contain digits only and be 9 to 18 digits long.";
  }
  if (type === "mobile" && !/^[6-9]\d{9}$/.test(trimmed)) return "Enter a valid 10-digit Indian mobile number.";
  if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address.";
  if (type === "pan" && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(trimmed.toUpperCase())) return "Enter a valid PAN, for example ABCDE1234F.";
  if (type === "aadhaar" && !/^\d{12}$/.test(trimmed.replace(/\s/g, ""))) return "Enter a valid 12-digit Aadhaar number.";
  if (type === "date" && Number.isNaN(Date.parse(trimmed))) return "Enter a valid date.";
  if (type === "account" && !/^\d{6,18}$/.test(trimmed.replace(/\s/g, ""))) return "Enter a valid account number.";
  if (type === "boxed" && !trimmed) return "Enter the value to place into boxes.";
  if (type === "yesno" && !/^(y|yes|n|no)$/i.test(trimmed)) return "Enter Yes or No.";
  if (type === "singlejoint" && !/^(single|joint)$/i.test(trimmed)) return "Enter Single or Joint.";
  return "";
}

export function normalizeAnswer(type: FieldKind, value: string) {
  if (type === "pan") return value.trim().toUpperCase();
  if (type === "aadhaar" || type === "mobile" || type === "account") return value.trim().replace(/\s/g, "");
  if (type === "boxed") return value.trim().toUpperCase();
  if (type === "yesno") return /^(y|yes)$/i.test(value.trim()) ? "Y" : "N";
  if (type === "singlejoint") return /^single$/i.test(value.trim()) ? "Single" : "Joint";
  return value.trim();
}
