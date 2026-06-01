import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, FileSignature, Upload, CheckCircle2, ChevronRight, AlertCircle, Sparkles, Loader2, Plus, Trash2, Settings2, Download, FileText } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { AppShell } from '@/components/AppShell';
import { analyzePdf, ExtractedField } from "@/lib/pdfAnalyzer";
import { generateSmartPdf } from "@/lib/smartReconstructor";

export const Route = createFileRoute('/premium/smart-form')({
  component: () => (
    <AppShell>
      <SmartFormPro />
    </AppShell>
  ),
});

function SmartFormPro() {
  const { t } = useTranslation();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  
  const [fields, setFields] = useState<ExtractedField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    const buffer = await file.arrayBuffer();
    setFileBuffer(buffer);
    
    // Start Analysis Step
    setStep(2);
    setIsAnalyzing(true);
    setAnalyzeProgress(0);
    
    // Simulate complex local analysis loading
    const interval = setInterval(() => {
      setAnalyzeProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 10;
      });
    }, 200);

    try {
      const { fields: detected } = await analyzePdf(buffer);
      
      setTimeout(() => {
        clearInterval(interval);
        setAnalyzeProgress(100);
        setFields(detected);
        
        // Initialize form data
        const initialData: Record<string, any> = {};
        detected.forEach(f => {
          if (f.type === 'checkbox') initialData[f.id] = false;
          else if (f.type === 'table') initialData[f.id] = Array.from({ length: f.maxRows || 1 }).map(() => Array(f.columns?.length || 0).fill(""));
          else initialData[f.id] = "";
        });
        setFormData(initialData);
        
        setTimeout(() => {
          setIsAnalyzing(false);
          setStep(3);
        }, 600);
      }, 2000);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setIsAnalyzing(false);
      // Handle error gracefully
    }
  };

  const handleTextChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [id]: checked }));
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

  const updateField = (id: string, updates: Partial<ExtractedField>) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    setFormData(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const addField = () => {
    const newField: ExtractedField = {
      id: `custom_${Date.now()}`,
      label: "New Custom Field",
      type: "text",
      pageIndex: 0,
      x: 100,
      y: 700,
      width: 150,
      height: 20
    };
    setFields(prev => [...prev, newField]);
    setFormData(prev => ({ ...prev, [newField.id]: "" }));
  };

  const generatePreview = async () => {
    if (!fileBuffer) return;
    setIsProcessing(true);
    try {
      const url = await generateSmartPdf(fileBuffer.slice(0), fields, formData);
      setPdfPreviewUrl(url);
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50/30 pb-24">
      {/* Header Bar */}
      <div className="bg-white border-b border-indigo-200 px-4 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-indigo-100 transition-colors text-indigo-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-indigo-900 leading-tight">Smart Form Assistant Pro</h1>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Auto PDF Extraction Engine
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6 bg-white p-4 rounded-[18px] border border-indigo-100 shadow-sm overflow-x-auto whitespace-nowrap">
          <button onClick={() => { setStep(1); setFileBuffer(null); }} className={`hover:text-indigo-600 transition-colors ${step === 1 ? 'text-indigo-600 font-bold' : ''}`}>
            1. Upload PDF
          </button>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className={`${step === 2 ? 'text-indigo-600 font-bold' : ''} ${step < 2 ? 'opacity-50' : ''}`}>
            2. AI Extraction
          </span>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <button onClick={() => { if(step >= 3) { setStep(3); setPdfPreviewUrl(null); } }} className={`hover:text-indigo-600 transition-colors ${step === 3 ? 'text-indigo-600 font-bold' : ''} ${step < 3 ? 'opacity-50' : ''}`}>
            3. Review & Map
          </button>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className={`${step === 4 ? 'text-indigo-600 font-bold' : 'opacity-50'}`}>
            4. Preview
          </span>
        </div>

        {/* STEP 1: Upload */}
        {step === 1 && (
          <div className="bg-white rounded-[24px] border-2 border-dashed border-indigo-200 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload any Application PDF</h2>
            <p className="text-slate-500 font-medium mb-8 max-w-md">Our Smart Engine will locally analyze the PDF to extract fields, labels, and boxes without sending your data to any cloud.</p>
            <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg cursor-pointer transition-all shadow-md active:scale-95">
              Browse PDF File
              <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        )}

        {/* STEP 2: Analyzing */}
        {step === 2 && isAnalyzing && (
          <div className="bg-white rounded-[24px] border border-indigo-100 p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-6" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Analyzing {fileName}...</h2>
            <p className="text-slate-500 font-medium mb-8">Locally extracting labels, signature areas, and boxed fields using heuristic mapping.</p>
            
            <div className="w-full max-w-md bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300 ease-out" 
                style={{ width: `${analyzeProgress}%` }} 
              />
            </div>
            <span className="text-sm font-bold text-indigo-700 mt-3">{analyzeProgress}% Complete</span>
          </div>
        )}

        {/* STEP 3: Review & Map */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Left: Dynamic Form */}
            <div className="bg-white rounded-[24px] border border-indigo-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 bg-indigo-50/50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Extracted Fields</h3>
                  <p className="text-xs font-medium text-slate-500">Fill your data or adjust extraction.</p>
                </div>
                <button onClick={addField} className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors">
                  <Plus className="w-4 h-4" /> Add Field
                </button>
              </div>

              <div className="p-5 space-y-6 max-h-[60vh] overflow-y-auto">
                {fields.length === 0 && (
                  <div className="text-center p-8 text-slate-500">
                    No fields automatically detected. Please add them manually.
                  </div>
                )}
                {fields.map(field => (
                  <div key={field.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group">
                    <button onClick={() => deleteField(field.id)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="pr-8 mb-3">
                      <input 
                        type="text" 
                        value={field.label} 
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="font-bold text-sm text-slate-900 bg-transparent border-none p-0 focus:ring-0 outline-none w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      {/* Input based on type */}
                      {field.type === 'text' || field.type === 'boxed' ? (
                        <input
                          type="text"
                          value={formData[field.id] || ""}
                          onChange={(e) => handleTextChange(field.id, e.target.value)}
                          maxLength={field.type === 'boxed' ? field.boxCount : undefined}
                          className={`w-full h-10 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm ${field.type === 'boxed' ? 'tracking-[4px] font-mono' : ''}`}
                          placeholder={`Enter ${field.label}`}
                        />
                      ) : field.type === 'date_boxed' ? (
                        <input
                          type="date"
                          value={formData[field.id] || ""}
                          onChange={(e) => handleTextChange(field.id, e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                      ) : field.type === 'checkbox' ? (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData[field.id] || false}
                            onChange={(e) => handleCheckboxChange(field.id, e.target.checked)}
                            className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm font-medium">Check Box</span>
                        </label>
                      ) : field.type === 'signature' ? (
                        <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-white text-center">
                          {formData[field.id] ? (
                            <img src={formData[field.id]} alt="Sig" className="max-h-16 mx-auto" />
                          ) : (
                            <label className="cursor-pointer text-sm font-bold text-indigo-600 hover:underline">
                              Upload Signature Image
                              <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={(e) => handleSignatureUpload(field.id, e)} />
                            </label>
                          )}
                        </div>
                      ) : null}

                      <button onClick={() => setShowAdvanced(showAdvanced === field.id ? null : field.id)} className="text-[11px] font-bold text-slate-500 flex items-center gap-1 hover:text-indigo-600">
                        <Settings2 className="w-3 h-3" /> {showAdvanced === field.id ? "Hide Mapping" : "Advanced Box Mapping"}
                      </button>

                      {showAdvanced === field.id && (
                        <div className="bg-white p-3 rounded-lg border border-indigo-100 grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">TYPE</label>
                            <select value={field.type} onChange={(e) => updateField(field.id, { type: e.target.value as any })} className="w-full border-slate-200 rounded p-1">
                              <option value="text">Text</option>
                              <option value="boxed">Boxed Characters</option>
                              <option value="date_boxed">Date Boxed</option>
                              <option value="checkbox">Checkbox</option>
                              <option value="signature">Signature</option>
                            </select>
                          </div>
                          {field.type === 'boxed' && (
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1">BOX COUNT</label>
                              <input type="number" value={field.boxCount || 10} onChange={(e) => updateField(field.id, { boxCount: parseInt(e.target.value) })} className="w-full border-slate-200 rounded p-1" />
                            </div>
                          )}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">X Pos (Left-Right)</label>
                            <input type="number" value={field.x} onChange={(e) => updateField(field.id, { x: parseInt(e.target.value) })} className="w-full border-slate-200 rounded p-1" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Y Pos (Bottom-Up)</label>
                            <input type="number" value={field.y} onChange={(e) => updateField(field.id, { y: parseInt(e.target.value) })} className="w-full border-slate-200 rounded p-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 border-t border-slate-100 bg-white">
                <button
                  onClick={generatePreview}
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
                >
                  {isProcessing ? "Reconstructing PDF..." : (
                    <>
                      <FileText className="w-4 h-4" /> Verify & Preview Render
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Information / Instructions (Because iframe preview before rendering requires complex blob handling for just a base view) */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm sticky top-24 hidden lg:block">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Mapping Instructions</h3>
              <ul className="text-sm text-slate-600 space-y-3 font-medium">
                <li>• <strong className="text-slate-800">Review Labels:</strong> The AI has extracted text labels from your document. Correct any misnamed labels.</li>
                <li>• <strong className="text-slate-800">Boxed Fields:</strong> If your form requires one character per box (like PAN or Aadhaar), ensure the Type is set to "Boxed Characters" and verify the Box Count.</li>
                <li>• <strong className="text-slate-800">Alignment:</strong> If generated text is slightly misaligned with the physical boxes on the PDF, click "Advanced Box Mapping" to tweak the X and Y coordinates. Y=0 is the bottom of the page.</li>
              </ul>
            </div>
          </div>
        )}

        {/* STEP 4: Preview */}
        {step === 4 && pdfPreviewUrl && (
          <div className="bg-white rounded-[24px] border border-indigo-200 shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-indigo-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                Document Generated Successfully
              </h3>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = pdfPreviewUrl;
                  link.download = `Completed_${fileName}`;
                  link.click();
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
            <div className="bg-slate-200 h-[70vh] w-full p-4 overflow-hidden relative">
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-full rounded-xl bg-white shadow-sm border border-slate-300"
                title="PDF Preview"
              />
            </div>
            <div className="p-4 bg-white border-t border-slate-100">
               <button onClick={() => setStep(3)} className="text-sm font-bold text-indigo-600 hover:underline">
                 ← Back to Edit Fields & Realignment
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
