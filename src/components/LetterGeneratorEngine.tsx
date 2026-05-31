import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Copy, Printer, CheckCircle2, ChevronDown, FileText, Download, Edit3, Save } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const LETTER_TYPES = [
  { id: "atm", label: "ATM Card Request", subject: "Request for issuance of new ATM/Debit Card", body: "I hold a savings account in your branch. I would like to request a new ATM/Debit card for my account as I need it for daily transactions. Please issue the card at your earliest convenience and link it to my account." },
  { id: "passbook", label: "Passbook Request", subject: "Request for issuance of new Passbook", body: "I am writing to request a new passbook for my savings account. My current passbook is fully utilized/lost. Please issue a new one so I can keep track of my transactions." },
  { id: "cheque", label: "Cheque Book Request", subject: "Request for new Cheque Book", body: "I request you to kindly issue a new cheque book of 50 leaves for my account. Please deliver it to my registered address or keep it ready for collection at the branch." },
  { id: "address", label: "Address Change Request", subject: "Application for updating registered Address", body: "I have recently relocated. I request you to update my new residential address in my account records. I have attached the necessary self-attested address proof documents for your reference." },
  { id: "mobile", label: "Mobile Number Update Request", subject: "Request to update registered Mobile Number", body: "I would like to update my registered mobile number linked to my account. Please update my new mobile number for all future SMS alerts and OTPs. Attached is my ID proof for verification." },
  { id: "email", label: "Email Update Request", subject: "Request to update registered Email Address", body: "Please update my registered email address in your records for my account. Kindly send all future e-statements and bank communications to this new email ID." },
  { id: "kyc", label: "KYC Update Request", subject: "Submission of KYC Documents for Account Update", body: "As per the bank's mandate, I am submitting my updated KYC documents (Aadhaar and PAN card copies). Kindly update my KYC status to ensure uninterrupted banking services." },
  { id: "closure", label: "Account Closure Request", subject: "Request for closure of Savings Account", body: "Due to personal reasons, I wish to close my savings account with your branch. I request you to transfer the remaining balance to the account details provided separately and proceed with the account closure." },
  { id: "nominee_add", label: "Nominee Addition Request", subject: "Request to add Nominee to Account", body: "I would like to register a nominee for my savings account. I have enclosed the completely filled nomination form along with the required identification documents of the nominee." },
  { id: "nominee_change", label: "Nominee Change Request", subject: "Request for change of registered Nominee", body: "I request you to cancel the existing nomination for my account and register the new nominee details as per the attached nomination form." },
  { id: "loan_foreclose", label: "Loan Foreclosure Request", subject: "Request for foreclosure of Loan Account", body: "I wish to foreclose my loan account with your branch. Please provide me with the total outstanding foreclosure amount along with the procedure to settle the dues immediately." },
  { id: "loan_close", label: "Loan Closure Request", subject: "Request for Loan Closure and NOC Issuance", body: "I have successfully paid all EMIs for my loan account. I request you to officially close the loan account and issue the No Objection Certificate (NOC) at the earliest." },
];

export function LetterGeneratorEngine() {
  const { t } = useTranslation();
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedType, setSelectedType] = useState(LETTER_TYPES[0]);
  const [isCopied, setIsCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLetter, setEditedLetter] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const generatedLetter = useMemo(() => {
    return `To
The Branch Manager
${bankName || "[Bank Name]"}
${branchName || "[Branch Name]"}

Subject: ${selectedType.subject}

Respected Sir/Madam,

I, ${customerName || "[Customer Name]"}, holding an account (${accountNumber || "[Account Number]"}) in your branch, am writing this letter to you.

${selectedType.body}

Kindly process this request at the earliest.

Thanking You,

Yours Faithfully,
${customerName || "[Customer Name]"}`;
  }, [bankName, branchName, customerName, accountNumber, selectedType]);

  const handleGenerate = () => {
    setEditedLetter(generatedLetter);
    setShowPreview(true);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedLetter || generatedLetter);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      // In a real application, you might use a library like react-to-print or jsPDF
      // For this implementation, we use the browser print functionality
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 sm:pb-8 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold">Back to Dashboard</span>
        </Link>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center border border-border/40 shadow-sm">
            <FileText className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{t("letterGeneratorPro") || "Letter Generator Pro"}</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base font-medium">{t("generateLetterDesc") || "Generate professional banking request letters instantly."}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          
          {/* Form Panel (40%) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-border/40">
              <h2 className="text-lg font-bold text-foreground mb-6">Letter Details</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{t("letterType") || "Letter Type"}</label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-slate-50 border border-border/60 text-foreground text-[14px] rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                      value={selectedType.id}
                      onChange={(e) => {
                        setSelectedType(LETTER_TYPES.find(t => t.id === e.target.value) || LETTER_TYPES[0]);
                        setShowPreview(false);
                      }}
                    >
                      {LETTER_TYPES.map(type => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{t("bankName") || "Bank Name"}</label>
                  <input
                    type="text"
                    placeholder="e.g. State Bank of India"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-slate-50 border border-border/60 text-foreground text-[14px] rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{t("branchName") || "Branch Name"}</label>
                  <input
                    type="text"
                    placeholder="e.g. MG Road Branch"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full bg-slate-50 border border-border/60 text-foreground text-[14px] rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{t("yourFullName") || "Your Full Name"}</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-border/60 text-foreground text-[14px] rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">{t("accountNumber") || "Account Number"}</label>
                  <input
                    type="text"
                    placeholder="e.g. 31245678901"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-border/60 text-foreground text-[14px] rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white rounded-[14px] py-3.5 font-bold text-[14px] transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {t("generateLetter") || "Generate Letter"}
              </button>
            </div>
          </div>

          {/* Preview Panel (60%) */}
          <div className="lg:col-span-3 flex flex-col">
            <div className={`bg-white rounded-[24px] shadow-sm border border-border/40 overflow-hidden flex flex-col h-full transition-all duration-300 ${showPreview ? "opacity-100 translate-y-0" : "opacity-50 translate-y-4 pointer-events-none"}`}>
              
              {/* Action Bar */}
              <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-slate-50/50 flex-wrap gap-4">
                <h2 className="text-[15px] font-extrabold text-foreground">{t("livePreview") || "Live Preview"}</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={toggleEdit}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-[12px] transition-colors ${
                      isEditing ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                    {isEditing ? t("saveChanges") || "Save Changes" : t("editLetter") || "Edit Letter"}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-[12px] transition-colors"
                  >
                    {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {isCopied ? t("copied") || "Copied" : t("copy") || "Copy"}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-[12px] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {t("downloadPdf") || "Download PDF"}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-[12px] transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    {t("print") || "Print"}
                  </button>
                </div>
              </div>
              
              {/* Document Area */}
              <div className="p-4 sm:p-8 bg-slate-100 overflow-y-auto flex-1 flex justify-center items-start min-h-[600px]">
                <div 
                  ref={printRef}
                  className="bg-white p-8 sm:p-12 w-full max-w-[21cm] shadow-sm border border-slate-200 text-left relative"
                  style={{ minHeight: "29.7cm" }}
                >
                  {isEditing ? (
                    <textarea
                      value={editedLetter}
                      onChange={(e) => setEditedLetter(e.target.value)}
                      className="font-serif text-[15px] sm:text-[16px] text-slate-900 leading-[1.8] w-full min-h-[25cm] resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-md p-2 -m-2 bg-slate-50 border border-slate-200"
                    />
                  ) : (
                    <div className="font-serif text-[15px] sm:text-[16px] text-slate-900 leading-[1.8] whitespace-pre-line text-justify">
                      {editedLetter || generatedLetter}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
