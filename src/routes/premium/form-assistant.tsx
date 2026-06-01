import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FileSignature, Upload, CheckCircle2, ChevronRight, AlertCircle, Building2, FileText, Download } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { AppShell } from '@/components/AppShell';
import { FORM_TEMPLATES, FormTemplate } from "@/data/formTemplates";
import { BANKS } from "@/data/banks";
import { generateFilledPdf } from "@/lib/pdfReconstructor";

export const Route = createFileRoute('/premium/form-assistant')({
  component: () => (
    <AppShell>
      <PremiumFormAssistant />
    </AppShell>
  ),
});

function PremiumFormAssistant() {
  const { t } = useTranslation();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const supportedBankIds = Array.from(new Set(FORM_TEMPLATES.map(t => t.bankId)));
  const supportedBanks = BANKS.filter(b => supportedBankIds.includes(b.id));

  const handleBankSelect = (bankId: string) => {
    setSelectedBankId(bankId);
    setStep(2);
  };

  const handleTemplateSelect = (template: FormTemplate) => {
    setSelectedTemplate(template);
    const initialData: Record<string, any> = {};
    template.fields.forEach(f => {
      if (f.type === 'table') {
        initialData[f.id] = Array.from({ length: f.maxRows || 1 }).map(() => Array(f.columns?.length || 0).fill(""));
      } else if (f.type === 'checkbox') {
        initialData[f.id] = false;
      } else {
        initialData[f.id] = "";
      }
    });
    setFormData(initialData);
    setValidationErrors([]);
    setStep(3);
  };

  const handleTextChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [id]: checked }));
  };

  const handleTableChange = (id: string, rowIndex: number, colIndex: number, value: string) => {
    setFormData(prev => {
      const tableData = [...(prev[id] || [])];
      if (!tableData[rowIndex]) tableData[rowIndex] = [];
      tableData[rowIndex][colIndex] = value;
      return { ...prev, [id]: tableData };
    });
  };

  const handleSignatureUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [id]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!selectedTemplate) return false;
    const errors: string[] = [];
    
    for (const field of selectedTemplate.fields) {
      const val = formData[field.id];
      if (field.required) {
        if (field.type === 'signature' && !val) {
          errors.push(`${field.label} is required (Upload signature)`);
        }
        else if (field.type === 'date_boxed' && (!val || val.length !== 10)) {
           errors.push(`${field.label} is required (Complete date)`);
        }
        else if (field.type === 'boxed' && !val) {
          errors.push(`${field.label} is required`);
        }
        else if (field.type === 'text' && !val) {
          errors.push(`${field.label} is required`);
        }
      }
      
      if (val && field.type === 'boxed' && field.boxCount) {
        const charCount = val.replace(/\s/g, '').length;
        if (charCount > field.boxCount) {
          errors.push(`${field.label} exceeds maximum allowed boxes (${field.boxCount})`);
        }
      }
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const generatePreview = async () => {
    if (!validateForm() || !selectedTemplate) return;
    
    setIsProcessing(true);
    try {
      const url = await generateFilledPdf(selectedTemplate, formData);
      setPdfPreviewUrl(url);
      setStep(4);
    } catch (err) {
      console.error(err);
      setValidationErrors(["Failed to generate PDF. Make sure the PDF asset exists."]);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfPreviewUrl || !selectedTemplate) return;
    const link = document.createElement("a");
    link.href = pdfPreviewUrl;
    link.download = `Completed_${selectedTemplate.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-amber-50/30 pb-24">
      {/* Header Bar */}
      <div className="bg-white border-b border-amber-200 px-4 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-amber-100 transition-colors text-amber-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-amber-900 leading-tight">AI Form Assistant Pro</h1>
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1">
              Production Reconstruction
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6 bg-white p-4 rounded-[18px] border border-amber-100 shadow-sm overflow-x-auto whitespace-nowrap">
          <button onClick={() => { setStep(1); setSelectedBankId(null); setSelectedTemplate(null); setPdfPreviewUrl(null); }} className={`hover:text-amber-600 transition-colors ${step === 1 ? 'text-amber-600 font-bold' : ''}`}>
            1. Select Bank
          </button>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <button onClick={() => { if(selectedBankId) { setStep(2); setSelectedTemplate(null); setPdfPreviewUrl(null); } }} className={`hover:text-amber-600 transition-colors ${step === 2 ? 'text-amber-600 font-bold' : ''} ${!selectedBankId ? 'opacity-50 cursor-not-allowed' : ''}`}>
            2. Choose Form
          </button>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <button onClick={() => { if(selectedTemplate) { setStep(3); setPdfPreviewUrl(null); } }} className={`hover:text-amber-600 transition-colors ${step === 3 ? 'text-amber-600 font-bold' : ''} ${!selectedTemplate ? 'opacity-50 cursor-not-allowed' : ''}`}>
            3. Fill & Validate
          </button>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className={`${step === 4 ? 'text-amber-600 font-bold' : 'opacity-50'}`}>
            4. Preview & Download
          </span>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportedBanks.map(bank => (
              <button
                key={bank.id}
                onClick={() => handleBankSelect(bank.id)}
                className="bg-white p-6 rounded-2xl border border-amber-200/50 hover:border-amber-400 hover:shadow-md transition-all text-left group flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 group-hover:scale-110 transition-all shrink-0">
                  <Building2 className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{bank.name}</h3>
                  <p className="text-xs text-slate-500">{FORM_TEMPLATES.filter(t => t.bankId === bank.id).length} forms available</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && selectedBankId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FORM_TEMPLATES.filter(t => t.bankId === selectedBankId).map(template => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="bg-white p-5 rounded-2xl border border-amber-200/50 hover:border-amber-400 hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[140px] group"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 leading-tight mb-1">{template.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{template.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-600">
                  <span>{template.fields.length} dynamic fields</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && selectedTemplate && (
          <div className="bg-white rounded-[24px] border border-amber-200/50 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-amber-50/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <FileSignature className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{selectedTemplate.name}</h3>
                <p className="text-sm text-slate-500 font-medium">Data will be perfectly aligned to boxes.</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {validationErrors.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm font-medium text-rose-700">
                  <div className="flex items-center gap-2 mb-2 font-bold text-rose-800">
                    <AlertCircle className="w-5 h-5" /> Validation Errors
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    {validationErrors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                {selectedTemplate.fields.map(field => {
                  
                  if (field.type === 'text' || field.type === 'boxed') {
                    return (
                      <div key={field.id} className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-700 flex items-center justify-between">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                          {field.type === 'boxed' && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider border border-amber-200">
                              {field.boxCount} Boxes
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={formData[field.id] || ""}
                          onChange={(e) => handleTextChange(field.id, e.target.value)}
                          maxLength={field.type === 'boxed' ? field.boxCount : field.maxLength}
                          className={`w-full h-11 px-4 bg-slate-50 border border-slate-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all text-sm font-medium ${field.type === 'boxed' ? 'tracking-[4px] font-mono' : ''}`}
                          placeholder={field.type === 'boxed' ? 'ENTER VALUE' : `Enter ${field.label.toLowerCase()}`}
                        />
                      </div>
                    );
                  }

                  if (field.type === 'date_boxed') {
                    return (
                      <div key={field.id} className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="date"
                          value={formData[field.id] || ""}
                          onChange={(e) => handleTextChange(field.id, e.target.value)}
                          className="w-full h-11 px-4 bg-slate-50 border border-slate-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all text-sm font-medium uppercase tracking-wider"
                        />
                      </div>
                    );
                  }

                  if (field.type === 'checkbox') {
                    return (
                      <div key={field.id} className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <input
                          type="checkbox"
                          id={field.id}
                          checked={formData[field.id] || false}
                          onChange={(e) => handleCheckboxChange(field.id, e.target.checked)}
                          className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor={field.id} className="text-[14px] font-bold text-slate-700 cursor-pointer">
                          {field.label}
                        </label>
                      </div>
                    );
                  }

                  if (field.type === 'table') {
                    const maxRows = field.maxRows || 1;
                    const tableData = formData[field.id] || [];
                    return (
                      <div key={field.id} className="col-span-1 md:col-span-2 space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <label className="text-[14px] font-bold text-slate-700">
                          {field.label}
                        </label>
                        <div className="overflow-x-auto pb-2">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr>
                                {field.columns?.map((col, idx) => (
                                  <th key={idx} className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from({ length: maxRows }).map((_, rIdx) => (
                                <tr key={rIdx}>
                                  {field.columns?.map((_, cIdx) => (
                                    <td key={cIdx} className="p-2 border-b border-slate-100">
                                      <input
                                        type="text"
                                        value={tableData[rIdx]?.[cIdx] || ""}
                                        onChange={(e) => handleTableChange(field.id, rIdx, cIdx, e.target.value)}
                                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm font-medium"
                                        placeholder={`Row ${rIdx+1}`}
                                      />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }

                  if (field.type === 'signature') {
                    return (
                      <div key={field.id} className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50 flex flex-col items-center justify-center text-center">
                          {formData[field.id] ? (
                            <div className="space-y-4 w-full">
                              <img src={formData[field.id]} alt="Signature" className="max-h-24 mx-auto border bg-white p-2" />
                              <button
                                onClick={() => handleTextChange(field.id, "")}
                                className="text-sm font-bold text-rose-600 hover:underline"
                              >
                                Remove Signature
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-slate-400 mb-2" />
                              <p className="text-sm font-medium text-slate-600 mb-4">Upload an image of your signature</p>
                              <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
                                Browse Image (PNG/JPG)
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg"
                                  className="hidden"
                                  onChange={(e) => handleSignatureUpload(field.id, e)}
                                />
                              </label>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-amber-50/30">
              <button
                onClick={generatePreview}
                disabled={isProcessing}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[15px] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm active:scale-[0.98]"
              >
                {isProcessing ? "Reconstructing PDF..." : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Verify & Preview Document
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Preview */}
        {step === 4 && pdfPreviewUrl && selectedTemplate && (
          <div className="space-y-6">
            <div className="bg-white rounded-[24px] border border-amber-200/50 shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-amber-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Document Preview
                </h3>
                <button
                  onClick={downloadPdf}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
              <div className="bg-slate-200 h-[65vh] w-full p-4 overflow-hidden relative">
                <iframe
                  src={pdfPreviewUrl}
                  className="w-full h-full rounded-xl bg-white shadow-sm border border-slate-300"
                  title="PDF Preview"
                />
              </div>
            </div>
            
            <button
              onClick={() => setStep(3)}
              className="mx-auto block text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              ← Edit Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
