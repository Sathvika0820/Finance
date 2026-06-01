import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { FileText, Download, Building2, ChevronRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { FORM_TEMPLATES, FormTemplate, FormFieldDefinition } from "@/data/formTemplates";
import { BANKS } from "@/data/banks";

export function FormAssistantEngine() {
  const { t } = useTranslation();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter banks that actually have templates
  const supportedBankIds = Array.from(new Set(FORM_TEMPLATES.map(t => t.bankId)));
  const supportedBanks = BANKS.filter(b => supportedBankIds.includes(b.id));

  const handleBankSelect = (bankId: string) => {
    setSelectedBankId(bankId);
    setStep(2);
  };

  const handleTemplateSelect = (template: FormTemplate) => {
    setSelectedTemplate(template);
    
    // Initialize form data
    const initialData: Record<string, any> = {};
    template.fields.forEach(f => {
      if (f.type === 'table') {
        initialData[f.id] = Array.from({ length: f.maxRows || 1 }).map(() => Array(f.columns?.length || 0).fill(""));
      } else {
        initialData[f.id] = "";
      }
    });
    setFormData(initialData);
    setStep(3);
  };

  const handleTextChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleTableChange = (id: string, rowIndex: number, colIndex: number, value: string) => {
    setFormData(prev => {
      const tableData = [...(prev[id] || [])];
      if (!tableData[rowIndex]) tableData[rowIndex] = [];
      tableData[rowIndex][colIndex] = value;
      return { ...prev, [id]: tableData };
    });
  };

  const generateFilledPdf = async () => {
    if (!selectedTemplate) return;
    try {
      setIsProcessing(true);
      setError(null);
      
      // Fetch the blank PDF asset
      const response = await fetch(selectedTemplate.pdfAssetUrl);
      if (!response.ok) throw new Error("Could not load PDF template asset.");
      const arrayBuffer = await response.arrayBuffer();
      
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (const field of selectedTemplate.fields) {
        const page = pages[field.pageIndex];
        if (!page) continue;

        const value = formData[field.id];

        if (field.type === 'text' || field.type === 'date') {
          if (typeof value === 'string' && value.trim()) {
            page.drawText(value, {
              x: field.x,
              y: field.y + 2,
              size: 11,
              font: fontBold,
              color: rgb(0.1, 0.2, 0.6)
            });
          }
        } 
        else if (field.type === 'boxed') {
          if (typeof value === 'string' && value.trim()) {
            const str = value.trim().substring(0, field.maxLength || 99);
            const boxW = field.boxWidth || 20;
            for (let i = 0; i < str.length; i++) {
              page.drawText(str[i], {
                x: field.x + (i * boxW) + (boxW / 2) - 3,
                y: field.y + 6,
                size: 11,
                font: fontBold,
                color: rgb(0.1, 0.2, 0.6)
              });
            }
          }
        }
        else if (field.type === 'table') {
          if (Array.isArray(value)) {
            let currentY = field.y;
            const rowH = field.rowHeight || 30;
            for (let r = 0; r < Math.min(value.length, field.maxRows || 99); r++) {
              const row = value[r];
              for (let c = 0; c < (field.columns?.length || 0); c++) {
                const cellValue = row[c] || "";
                if (cellValue.trim()) {
                  page.drawText(cellValue, {
                    x: field.x + (c * 120) + 5,
                    y: currentY + 10,
                    size: 10,
                    font,
                    color: rgb(0.1, 0.2, 0.6)
                  });
                }
              }
              currentY -= rowH;
            }
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `Completed_${selectedTemplate.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to generate PDF. Make sure the PDF assets are available in /public/forms/.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Header */}
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
        <button onClick={() => { setStep(1); setSelectedBankId(null); setSelectedTemplate(null); }} className={`hover:text-amber-600 transition-colors ${step === 1 ? 'text-amber-600 font-bold' : ''}`}>
          1. Select Bank
        </button>
        <ChevronRight className="w-4 h-4" />
        <button onClick={() => { if(selectedBankId) setStep(2); setSelectedTemplate(null); }} className={`hover:text-amber-600 transition-colors ${step === 2 ? 'text-amber-600 font-bold' : ''} ${!selectedBankId ? 'opacity-50 cursor-not-allowed' : ''}`}>
          2. Choose Form
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className={`${step === 3 ? 'text-amber-600 font-bold' : 'opacity-50'}`}>
          3. Fill Details
        </span>
      </div>

      {/* STEP 1: Select Bank */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {supportedBanks.map(bank => (
            <button
              key={bank.id}
              onClick={() => handleBankSelect(bank.id)}
              className="bg-white p-6 rounded-2xl border border-border/60 hover:border-amber-400 hover:shadow-md transition-all text-left group flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-amber-50 group-hover:scale-110 transition-all shrink-0">
                <Building2 className="w-6 h-6 text-slate-400 group-hover:text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{bank.name}</h3>
                <p className="text-xs text-slate-500">{FORM_TEMPLATES.filter(t => t.bankId === bank.id).length} forms available</p>
              </div>
            </button>
          ))}
          {supportedBanks.length === 0 && (
            <div className="col-span-full p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">No form templates configured yet.</p>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Select Form */}
      {step === 2 && selectedBankId && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep(1)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-bold text-slate-800">Select Form Type</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FORM_TEMPLATES.filter(t => t.bankId === selectedBankId).map(template => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="bg-white p-5 rounded-2xl border border-border/60 hover:border-amber-400 hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[140px] group"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 leading-tight mb-1">{template.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{template.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-amber-600 transition-colors">
                  <span>{template.fields.length} fields</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Fill Details */}
      {step === 3 && selectedTemplate && (
        <div className="bg-white rounded-[24px] border border-border/60 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep(2)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="font-bold text-slate-900">{selectedTemplate.name}</h3>
                <p className="text-sm text-slate-500 font-medium">Please fill in the details precisely.</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-200 mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {selectedTemplate.fields.map(field => {
                
                if (field.type === 'text' || field.type === 'date' || field.type === 'boxed') {
                  return (
                    <div key={field.id} className="space-y-1.5">
                      <label className="text-[13px] font-bold text-slate-700 flex items-center justify-between">
                        {field.label}
                        {field.type === 'boxed' && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                            Max {field.maxLength} chars
                          </span>
                        )}
                      </label>
                      <input
                        type={field.type === 'date' ? 'date' : 'text'}
                        value={formData[field.id] || ""}
                        onChange={(e) => handleTextChange(field.id, e.target.value)}
                        autoComplete={field.autocomplete || 'off'}
                        maxLength={field.type === 'boxed' ? field.maxLength : undefined}
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all text-sm font-medium"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
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

                return null;
              })}
            </div>
          </div>

          <div className="p-6 border-t border-border/50 bg-slate-50/50">
            <button
              onClick={generateFilledPdf}
              disabled={isProcessing}
              className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
            >
              {isProcessing ? (
                "Generating Document..."
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Generate Finished PDF
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
