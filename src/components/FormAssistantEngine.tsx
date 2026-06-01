import React, { useState, useRef } from "react";
import { PDFDocument, PDFTextField, rgb, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { Upload, FileText, Download, AlertCircle, HelpCircle, Bot, Info, Plus, Trash2, Edit3, Settings } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface FormField {
  id: string;
  label: string;
  type: 'interactive' | 'static' | 'custom';
  pageIndex?: number;
  x?: number;
  y?: number;
}

export function FormAssistantEngine() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isLowConfidence, setIsLowConfidence] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getGuidanceText = (fieldName: string) => {
    const lowerName = fieldName.toLowerCase();
    if (lowerName.includes("nominee")) return t("guidanceNominee");
    if (lowerName.includes("occupation") || lowerName.includes("profession")) return t("guidanceOccupation");
    if (lowerName.includes("income") || lowerName.includes("salary")) return t("guidanceIncome");
    if (lowerName.includes("account") && lowerName.includes("type")) return t("guidanceAccountType");
    return null;
  };

  const getAutocompleteAttr = (fieldName: string) => {
    const lowerName = fieldName.toLowerCase();
    if (lowerName.includes("name") && !lowerName.includes("nominee")) return "name";
    if (lowerName.includes("email")) return "email";
    if (lowerName.includes("phone") || lowerName.includes("mobile") || lowerName.includes("contact")) return "tel";
    if (lowerName.includes("address")) return "street-address";
    if (lowerName.includes("dob") || lowerName.includes("date of birth")) return "bday";
    return "off";
  };

  const regexDetectors = [
    { regex: /name of customer|customer name|applicant name|full name|name/i, label: "Name of Customer" },
    { regex: /e-?mail|email address/i, label: "Email" },
    { regex: /mobile( number)?|phone|contact number/i, label: "Mobile Number" },
    { regex: /date of birth|dob/i, label: "Date of Birth" },
    { regex: /residential address|address/i, label: "Address" },
    { regex: /occupation|profession/i, label: "Occupation" },
    { regex: /nominee name|nominee/i, label: "Nominee" },
    { regex: /account number|a\/c no|account no/i, label: "Account Number" },
    { regex: /pan( number)?/i, label: "PAN" },
    { regex: /aadhaar( number)?|aadhar/i, label: "Aadhaar" },
    { regex: /single\/joint account|account type/i, label: "Account Type" },
    { regex: /transaction rights/i, label: "Transaction Rights" },
    { regex: /customer signature|signature/i, label: "Customer Signature" },
    { regex: /date/i, label: "Date" }
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError(t("unsupportedPdf") || "Unsupported PDF.");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsProcessing(true);
    setFormData({});
    setIsLowConfidence(false);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();
      const extractedFields = form.getFields();

      const interactiveFields = extractedFields
        .filter((field) => field instanceof PDFTextField)
        .map((field) => ({
          id: field.getName(),
          label: field.getName(),
          type: 'interactive' as const
        }));

      if (interactiveFields.length > 0) {
        setFields(interactiveFields);
        const initData: Record<string, string[]> = {};
        interactiveFields.forEach(f => initData[f.id] = [""]);
        setFormData(initData);
        setIsProcessing(false);
        return;
      }

      const detectedFields: FormField[] = [];
      const pdfjsDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      
      const foundLabels = new Set<string>();

      for (let i = 1; i <= pdfjsDoc.numPages; i++) {
        const page = await pdfjsDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        for (const item of textContent.items) {
          if (!('str' in item)) continue;
          
          const text = item.str.trim();
          if (text.length < 2) continue;

          for (const detector of regexDetectors) {
            if (detector.regex.test(text)) {
              if (!foundLabels.has(detector.label)) {
                foundLabels.add(detector.label);
                const x = item.transform[4];
                const y = item.transform[5];
                
                detectedFields.push({
                  id: `static_${i}_${Math.floor(x)}_${Math.floor(y)}_${detector.label.replace(/\s+/g, '')}`,
                  label: detector.label,
                  type: 'static',
                  pageIndex: i - 1,
                  x: x,
                  y: y
                });
              }
            }
          }
        }
      }

      setFields(detectedFields);
      setIsLowConfidence(true);
      const initData: Record<string, string[]> = {};
      detectedFields.forEach(f => initData[f.id] = [""]);
      setFormData(initData);

    } catch (err) {
      console.error(err);
      setError("An error occurred while analyzing the PDF structure.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFieldChange = (id: string, index: number, value: string) => {
    setFormData((prev) => {
      const arr = [...(prev[id] || [""])];
      arr[index] = value;
      return { ...prev, [id]: arr };
    });
  };

  const addRow = (id: string) => {
    setFormData((prev) => ({ ...prev, [id]: [...(prev[id] || [""]), ""] }));
  };

  const removeRow = (id: string, index: number) => {
    setFormData((prev) => {
      const arr = [...(prev[id] || [""])];
      if (arr.length > 1) {
        arr.splice(index, 1);
      }
      return { ...prev, [id]: arr };
    });
  };

  const addCustomField = () => {
    if (!newFieldName.trim()) return;
    const id = `custom_${Date.now()}`;
    setFields([...fields, { id, label: newFieldName.trim(), type: 'custom' }]);
    setFormData((prev) => ({ ...prev, [id]: [""] }));
    setNewFieldName("");
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    setFormData(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const generateFilledPdf = async () => {
    if (!file) return;
    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      let hasCustomFields = false;
      const customData: { label: string, values: string[] }[] = [];

      for (const field of fields) {
        const values = formData[field.id] || [];
        const validValues = values.filter(v => v.trim());
        
        if (validValues.length === 0) continue;

        if (field.type === 'interactive') {
          try {
            const pdfField = form.getTextField(field.id);
            if (pdfField) {
              pdfField.setText(validValues.join(", "));
            }
          } catch (e) {
            console.warn(`Could not set interactive field ${field.id}`, e);
          }
        } else if (field.type === 'static' && field.pageIndex !== undefined && field.x !== undefined && field.y !== undefined) {
          const page = pages[field.pageIndex];
          // Draw values slightly to the right of label. If array, draw vertically stacked or comma separated.
          page.drawText(validValues.join(", "), {
            x: field.x + 120,
            y: field.y,
            size: 11,
            color: rgb(0.1, 0.2, 0.6),
            font
          });
        } else if (field.type === 'custom') {
          hasCustomFields = true;
          customData.push({ label: field.label, values: validValues });
        }
      }

      // If array values overflowed or custom fields were added, append a new page
      if (hasCustomFields || fields.some(f => (formData[f.id] || []).length > 1 && f.type !== 'custom')) {
        const newPage = pdfDoc.addPage();
        let yCursor = newPage.getHeight() - 50;
        
        newPage.drawText("Additional Form Details", { x: 50, y: yCursor, size: 16, font, color: rgb(0,0,0) });
        yCursor -= 30;

        for (const field of fields) {
          const values = formData[field.id] || [];
          const validValues = values.filter(v => v.trim());
          if (validValues.length > 0) {
            // Include custom fields or array values
            if (field.type === 'custom' || validValues.length > 1) {
              newPage.drawText(`${field.label}:`, { x: 50, y: yCursor, size: 12, font, color: rgb(0.3,0.3,0.3) });
              yCursor -= 20;
              validValues.forEach(val => {
                newPage.drawText(`- ${val}`, { x: 70, y: yCursor, size: 12, font, color: rgb(0.1,0.2,0.6) });
                yCursor -= 20;
              });
              yCursor -= 10;
            }
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `Completed_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to generate PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {!file && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-amber-300 bg-amber-50 hover:bg-amber-100/50 transition-colors rounded-[24px] p-10 flex flex-col items-center justify-center cursor-pointer text-center group"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-amber-900 mb-2">{t("uploadPdfForm")}</h3>
          <p className="text-sm text-amber-700/80 max-w-sm mx-auto">
            {t("formAssistantDesc")}
          </p>
          <input 
            type="file" 
            accept="application/pdf"
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {file && (
        <div className="bg-white rounded-[24px] border border-border/60 shadow-sm overflow-hidden flex flex-col">
          {/* Header Summary */}
          <div className="p-6 border-b border-border/50 bg-slate-50/50">
            <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200/50">
                  <Settings className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 line-clamp-1">Detection Summary</h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Found <strong className="text-amber-600">{fields.length}</strong> fields in <span className="truncate">{file.name}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setFile(null);
                  setFields([]);
                  setFormData({});
                  setError(null);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-xl shrink-0"
              >
                Change PDF
              </button>
            </div>
            
            {isLowConfidence && (
              <div className="mt-4 bg-orange-50 text-orange-800 px-4 py-3 rounded-xl flex items-start gap-3 border border-orange-200/60">
                <Info className="w-5 h-5 shrink-0 text-orange-600" />
                <p className="text-[13px] font-medium leading-relaxed">
                  {t("lowConfidenceDetection") || "We detected some possible form fields. Please review before continuing. You can add missing fields manually below."}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 space-y-8">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-3 rounded-xl border border-blue-100/60">
              <Bot className="w-5 h-5 shrink-0 text-blue-600" />
              <p className="text-[13px] font-medium">{t("autofillCommonDetails")} is active. Tap fields to use browser autofill.</p>
            </div>

            <div className="space-y-6">
              {fields.map((field) => {
                const guidance = getGuidanceText(field.label);
                const values = formData[field.id] || [""];
                
                return (
                  <div key={field.id} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <label className="text-[14px] font-bold text-slate-700 capitalize">
                          {field.label.replace(/[^a-zA-Z0-9\s/]/g, ' ')}
                        </label>
                        {guidance && (
                          <div className="relative group">
                            <button className="text-amber-500 hover:text-amber-600">
                              <HelpCircle className="w-4 h-4" />
                            </button>
                            <div className="absolute z-10 bottom-full left-0 mb-2 w-64 bg-slate-800 text-white text-xs p-3 rounded-xl shadow-xl font-medium hidden group-hover:block">
                              {guidance}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button onClick={() => addRow(field.id)} className="text-[11px] font-bold text-slate-500 hover:text-amber-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors">
                          <Plus className="w-3 h-3" /> Add Row
                        </button>
                        {field.type === 'custom' && (
                          <button onClick={() => removeField(field.id)} className="text-[11px] font-bold text-red-500 hover:text-red-700 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg transition-colors">
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {values.map((val, idx) => (
                        <div key={idx} className="flex items-center gap-2 relative">
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleFieldChange(field.id, idx, e.target.value)}
                            autoComplete={getAutocompleteAttr(field.label)}
                            name={getAutocompleteAttr(field.label) !== 'off' ? `${getAutocompleteAttr(field.label)}_${idx}` : `${field.id}_${idx}`}
                            className="w-full h-11 px-4 bg-white border border-slate-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium"
                            placeholder={values.length > 1 ? `Row ${idx + 1}` : `Enter ${field.label}`}
                          />
                          {values.length > 1 && (
                            <button onClick={() => removeRow(field.id, idx)} className="shrink-0 p-2 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {fields.length === 0 && !isProcessing && (
                <div className="text-center py-8 text-slate-500 text-sm font-medium">
                  No fields detected. Add custom fields below.
                </div>
              )}
            </div>

            {/* Manual Field Addition */}
            <div className="border-t border-dashed border-slate-200 pt-6 mt-8">
              <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-slate-400" />
                Missing a field?
              </h4>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={newFieldName}
                  onChange={e => setNewFieldName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomField()}
                  placeholder="e.g. Branch Code"
                  className="flex-1 h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm font-medium"
                />
                <button 
                  onClick={addCustomField}
                  disabled={!newFieldName.trim()}
                  className="h-11 px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  Add Field
                </button>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-2">
                Manually added fields will be safely appended to a new "Additional Details" page in the final PDF.
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-border/50 bg-slate-50/50">
            <button
              onClick={generateFilledPdf}
              disabled={isProcessing || fields.length === 0}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
            >
              <Download className="w-5 h-5" />
              {isProcessing ? "Processing..." : t("downloadFilledPdf")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
