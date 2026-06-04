import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import { AppShell } from "@/components/AppShell";
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  Download,
  FileText,
  MousePointer2,
  Printer,
  Save,
  Upload,
} from "lucide-react";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type BankId = "SBI" | "ICICI";
type FieldType = "text" | "date" | "dropdown" | "checkbox" | "radio" | "signature" | "photo";
type MapperMode = "admin" | "fill";

type PdfFieldMapping = {
  id: string;
  label: string;
  fieldType: FieldType;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  options?: string[];
};

type StoredMappedPdf = {
  id: string;
  bank: BankId;
  formName: string;
  fileName: string;
  pdfBytes: Uint8Array;
  mappings: PdfFieldMapping[];
  createdAt: string;
  updatedAt: string;
};

type FormValues = Record<string, string>;

const DB_NAME = "bankhub-pdf-coordinate-mapper";
const STORE_NAME = "mapped-pdfs";
const DEFAULT_FIELD_NAMES = ["Full Name", "Mobile Number", "DOB", "PAN", "Aadhaar", "Address", "Account Number", "Signature"];
const FIELD_DEFAULTS: Record<FieldType, { width: number; height: number }> = {
  text: { width: 170, height: 20 },
  date: { width: 100, height: 20 },
  dropdown: { width: 140, height: 20 },
  checkbox: { width: 14, height: 14 },
  radio: { width: 14, height: 14 },
  signature: { width: 150, height: 48 },
  photo: { width: 86, height: 104 },
};

export const Route = createFileRoute("/premium/pdf-coordinate-mapper")({
  component: () => (
    <AppShell>
      <PdfCoordinateMapper />
    </AppShell>
  ),
});

function PdfCoordinateMapper() {
  const [mode, setMode] = useState<MapperMode>("admin");
  const [savedForms, setSavedForms] = useState<StoredMappedPdf[]>([]);
  const [activeFormId, setActiveFormId] = useState("");
  const [bank, setBank] = useState<BankId>("SBI");
  const [formName, setFormName] = useState("SBI KYC Update");
  const [fileName, setFileName] = useState("");
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState({ width: 595, height: 842 });
  const [scale, setScale] = useState(1.18);
  const [mappings, setMappings] = useState<PdfFieldMapping[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [fieldLabel, setFieldLabel] = useState("Full Name");
  const [fieldType, setFieldType] = useState<FieldType>("text");
  const [fieldOptions, setFieldOptions] = useState("Savings, Current");
  const [values, setValues] = useState<FormValues>({});
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [status, setStatus] = useState("Upload an official bank PDF or load a saved mapping.");
  const [error, setError] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeFields = useMemo(() => mappings.filter((field) => field.pageNumber === pageNumber), [mappings, pageNumber]);
  const selectedField = mappings.find((field) => field.id === selectedFieldId) || null;

  useEffect(() => {
    void refreshSavedForms();
  }, []);

  useEffect(() => {
    if (!pdfDoc) return;
    void renderPage();
  }, [pdfDoc, pageNumber, scale]);

  useEffect(() => {
    return () => {
      if (generatedUrl) URL.revokeObjectURL(generatedUrl);
    };
  }, [generatedUrl]);

  const refreshSavedForms = async () => {
    const forms = await mappingDb.getAll();
    setSavedForms(forms);
  };

  const uploadPdf = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload an official PDF file.");
      return;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    await loadPdf(bytes, file.name);
    setMappings([]);
    setActiveFormId("");
    setGeneratedUrl("");
    setStatus(`${file.name} loaded. Click on the PDF to place fields.`);
    setError("");
  };

  const loadPdf = async (bytes: Uint8Array, name: string) => {
    const pdfjsLib = await getPdfJs();
    const task = pdfjsLib.getDocument({ data: bytes.slice() });
    const doc = await task.promise;
    const firstPage = await doc.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1 });
    setPdfBytes(bytes);
    setPdfDoc(doc);
    setFileName(name);
    setPageCount(doc.numPages);
    setPageNumber(1);
    setPageSize({ width: viewport.width, height: viewport.height });
  };

  const renderPage = async () => {
    if (!pdfDoc || !canvasRef.current) return;
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const naturalViewport = page.getViewport({ scale: 1 });
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    setPageSize({ width: naturalViewport.width, height: naturalViewport.height });
    await page.render({ canvasContext: context, viewport }).promise;
  };

  const loadSavedForm = async (id: string) => {
    const saved = await mappingDb.get(id);
    if (!saved) return;
    setActiveFormId(saved.id);
    setBank(saved.bank);
    setFormName(saved.formName);
    setMappings(saved.mappings);
    setValues({});
    setGeneratedUrl("");
    await loadPdf(new Uint8Array(saved.pdfBytes), saved.fileName);
    setStatus(`${saved.bank} ${saved.formName} mapping loaded from database.`);
  };

  const addFieldAtClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!pdfDoc || mode !== "admin") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(pageSize.width, (event.clientX - rect.left) / scale));
    const y = Math.max(0, Math.min(pageSize.height, (event.clientY - rect.top) / scale));
    const defaults = FIELD_DEFAULTS[fieldType];
    const field: PdfFieldMapping = {
      id: `field_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      label: fieldLabel.trim() || "Custom Field",
      fieldType,
      pageNumber,
      x,
      y,
      width: defaults.width,
      height: defaults.height,
      options: fieldType === "dropdown" || fieldType === "radio" ? fieldOptions.split(",").map((option) => option.trim()).filter(Boolean) : undefined,
    };
    setMappings((current) => [...current, field]);
    setSelectedFieldId(field.id);
    setStatus(`${field.label} mapped on page ${pageNumber} at X ${x.toFixed(1)}, Y ${y.toFixed(1)}.`);
  };

  const updateField = (id: string, patch: Partial<PdfFieldMapping>) => {
    setMappings((current) => current.map((field) => (field.id === id ? { ...field, ...patch } : field)));
  };

  const deleteSelectedField = () => {
    if (!selectedFieldId) return;
    setMappings((current) => current.filter((field) => field.id !== selectedFieldId));
    setSelectedFieldId("");
  };

  const saveMapping = async () => {
    if (!pdfBytes) {
      setError("Upload a PDF before saving mappings.");
      return;
    }
    if (!formName.trim()) {
      setError("Enter a form name before saving.");
      return;
    }
    const now = new Date().toISOString();
    const record: StoredMappedPdf = {
      id: activeFormId || `mapped_pdf_${Date.now()}`,
      bank,
      formName: formName.trim(),
      fileName,
      pdfBytes,
      mappings,
      createdAt: savedForms.find((form) => form.id === activeFormId)?.createdAt || now,
      updatedAt: now,
    };
    await mappingDb.put(record);
    setActiveFormId(record.id);
    await refreshSavedForms();
    setStatus("Mapping saved into the local BankHub mapping database.");
    setError("");
  };

  const updateValue = (field: PdfFieldMapping, value: string) => {
    setValues((current) => ({ ...current, [field.id]: value }));
  };

  const uploadImageValue = (field: PdfFieldMapping, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => updateValue(field, String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const generatePdf = async () => {
    if (!pdfBytes) {
      setError("Load a mapped PDF before generating.");
      return;
    }
    try {
      const doc = await PDFDocument.load(pdfBytes.slice());
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();

      for (const field of mappings) {
        const value = values[field.id];
        if (!value) continue;
        const page = pages[field.pageNumber - 1];
        if (!page) continue;
        const { height } = page.getSize();
        const drawX = field.x;
        const drawY = height - field.y - field.height;

        if (field.fieldType === "checkbox" || field.fieldType === "radio") {
          if (value === "yes") {
            page.drawText(field.fieldType === "checkbox" ? "X" : "o", {
              x: drawX + 2,
              y: drawY + 1,
              size: 12,
              font: bold,
              color: rgb(0.03, 0.16, 0.36),
            });
          }
          continue;
        }

        if (field.fieldType === "signature" || field.fieldType === "photo") {
          if (value.startsWith("data:image")) {
            const bytes = Uint8Array.from(atob(value.split(",")[1]), (char) => char.charCodeAt(0));
            const image = value.includes("image/png") ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
            const fit = image.scaleToFit(field.width, field.height);
            page.drawImage(image, { x: drawX, y: drawY, width: fit.width, height: fit.height });
          }
          continue;
        }

        page.drawText(value, {
          x: drawX,
          y: drawY + 4,
          size: field.fieldType === "date" ? 9 : 10,
          font,
          color: rgb(0.03, 0.16, 0.36),
          maxWidth: field.width,
        });
      }

      const output = await doc.save();
      if (generatedUrl) URL.revokeObjectURL(generatedUrl);
      const url = URL.createObjectURL(new Blob([output], { type: "application/pdf" }));
      setGeneratedUrl(url);
      setStatus("Final filled PDF generated while preserving the original PDF design.");
      setError("");
    } catch {
      setError("Unable to generate the filled PDF. Please check image uploads and field mappings.");
    }
  };

  const printPdf = () => {
    if (!generatedUrl) return;
    const preview = window.open(generatedUrl, "_blank", "noopener,noreferrer");
    if (!preview) {
      setError("Allow pop-ups to print the generated PDF.");
      return;
    }
    const triggerPrint = () => {
      preview.focus();
      preview.print();
    };
    preview.onload = triggerPrint;
    setTimeout(triggerPrint, 800);
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] pb-24 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-[#d8e0ec] bg-[#071b3a] px-4 py-4 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-base font-black leading-tight">PDF Coordinate Mapping System</h1>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#f1c86b]">Reusable mappings for SBI and ICICI official forms</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[#f1c86b]/40 bg-white/10 px-3 py-1.5 text-xs font-black text-[#f1c86b] sm:flex">
            <Database className="h-4 w-4" />
            IndexedDB mapping database
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 xl:grid-cols-[320px_1fr_340px]">
        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button onClick={() => setMode("admin")} className={`rounded-md px-3 py-2 text-sm font-black ${mode === "admin" ? "bg-[#071b3a] text-white" : "bg-slate-100 text-slate-700"}`}>
                Admin Map
              </button>
              <button onClick={() => setMode("fill")} className={`rounded-md px-3 py-2 text-sm font-black ${mode === "fill" ? "bg-[#071b3a] text-white" : "bg-slate-100 text-slate-700"}`}>
                Fill Form
              </button>
            </div>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#c7a14d] bg-[#fff8e6] px-3 py-3 text-sm font-black text-[#7a5a12]">
              <Upload className="h-4 w-4" />
              Upload Official PDF
              <input type="file" accept="application/pdf" className="hidden" onChange={uploadPdf} />
            </label>
            <p className="mt-2 text-xs font-semibold text-slate-500">{fileName || "No PDF loaded"}</p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-black text-slate-950">Saved Mapping Database</h2>
            <select value={activeFormId} onChange={(event) => void loadSavedForm(event.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold outline-none focus:border-[#c7a14d]">
              <option value="">Select saved mapping</option>
              {savedForms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.bank} - {form.formName}
                </option>
              ))}
            </select>
            <div className="mt-3 rounded-md bg-slate-50 p-3 text-[11px] font-semibold leading-relaxed text-slate-600">
              Saves page number, X coordinate, Y coordinate, field type, field size, and original PDF bytes.
            </div>
          </section>

          {mode === "admin" && (
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-black text-slate-950">Admin Mapping Controls</h2>
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-600">
                  Bank
                  <select value={bank} onChange={(event) => setBank(event.target.value as BankId)} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold">
                    <option>SBI</option>
                    <option>ICICI</option>
                  </select>
                </label>
                <label className="block text-xs font-bold text-slate-600">
                  Form Name
                  <input value={formName} onChange={(event) => setFormName(event.target.value)} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold" />
                </label>
                <label className="block text-xs font-bold text-slate-600">
                  Field Name
                  <input list="field-name-presets" value={fieldLabel} onChange={(event) => setFieldLabel(event.target.value)} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold" />
                  <datalist id="field-name-presets">
                    {DEFAULT_FIELD_NAMES.map((name) => <option key={name} value={name} />)}
                  </datalist>
                </label>
                <label className="block text-xs font-bold text-slate-600">
                  Field Type
                  <select value={fieldType} onChange={(event) => setFieldType(event.target.value as FieldType)} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold">
                    <option value="text">Text Input</option>
                    <option value="date">Date Input</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio Button</option>
                    <option value="signature">Signature Upload</option>
                    <option value="photo">Photo Upload</option>
                  </select>
                </label>
                {(fieldType === "dropdown" || fieldType === "radio") && (
                  <label className="block text-xs font-bold text-slate-600">
                    Options
                    <input value={fieldOptions} onChange={(event) => setFieldOptions(event.target.value)} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold" />
                  </label>
                )}
                <button onClick={saveMapping} className="flex w-full items-center justify-center gap-2 rounded-md bg-[#071b3a] px-3 py-2.5 text-sm font-black text-white">
                  <Save className="h-4 w-4" />
                  Save Mapping
                </button>
              </div>
            </section>
          )}

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-black text-slate-950">PDF Actions</h2>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={generatePdf} disabled={!pdfBytes || mappings.length === 0} className="rounded-md bg-[#c7a14d] px-3 py-2.5 text-sm font-black text-[#071b3a] disabled:cursor-not-allowed disabled:opacity-45">
                Generate Filled PDF
              </button>
              <a href={generatedUrl || undefined} download={`${bank}_${formName.replace(/\s+/g, "_")}_filled.pdf`} className={`flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2.5 text-sm font-black ${generatedUrl ? "text-slate-900" : "pointer-events-none opacity-45"}`}>
                <Download className="h-4 w-4" />
                Download PDF
              </a>
              <button onClick={printPdf} disabled={!generatedUrl} className="flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2.5 text-sm font-black text-slate-900 disabled:cursor-not-allowed disabled:opacity-45">
                <Printer className="h-4 w-4" />
                Print PDF
              </button>
            </div>
            <p className="mt-3 text-[11px] font-semibold leading-relaxed text-slate-500">{status}</p>
            {error && <p className="mt-2 text-[11px] font-bold leading-relaxed text-rose-700">{error}</p>}
          </section>
        </aside>

        <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-slate-950">{bank} {formName}</h2>
              <p className="text-[11px] font-semibold text-slate-500">
                {mode === "admin" ? "Click anywhere on the PDF to assign the selected field." : "Fill values using the saved coordinate mappings."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPageNumber((current) => Math.max(1, current - 1))} className="rounded-md border px-2 py-1 text-xs font-black">Prev</button>
              <span className="text-xs font-black">Page {pageNumber} / {pageCount || 1}</span>
              <button onClick={() => setPageNumber((current) => Math.min(pageCount || 1, current + 1))} className="rounded-md border px-2 py-1 text-xs font-black">Next</button>
              <button onClick={() => setScale((current) => Math.max(0.65, current - 0.1))} className="rounded-md border px-2 py-1 text-xs font-black">-</button>
              <span className="text-xs font-black">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale((current) => Math.min(2.2, current + 0.1))} className="rounded-md border px-2 py-1 text-xs font-black">+</button>
            </div>
          </div>

          <div className="overflow-auto rounded-md bg-slate-100 p-3">
            {pdfDoc ? (
              <div
                className={`relative inline-block bg-white shadow-sm ${mode === "admin" ? "cursor-crosshair" : ""}`}
                style={{ width: pageSize.width * scale, height: pageSize.height * scale }}
                onClick={addFieldAtClick}
              >
                <canvas ref={canvasRef} className="block" />
                {activeFields.map((field) => (
                  <button
                    key={field.id}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedFieldId(field.id);
                    }}
                    className={`absolute border-2 bg-[#f1c86b]/20 text-left text-[10px] font-black text-[#071b3a] ${selectedFieldId === field.id ? "border-[#071b3a]" : "border-[#c7a14d]"}`}
                    style={{
                      left: field.x * scale,
                      top: field.y * scale,
                      width: field.width * scale,
                      height: field.height * scale,
                    }}
                    title={`${field.label} (${field.fieldType})`}
                  >
                    <span className="truncate px-1">{field.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[520px] flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white text-center">
                <MousePointer2 className="h-10 w-10 text-slate-300" />
                <h3 className="mt-3 text-sm font-black text-slate-700">Upload or load an official bank PDF</h3>
                <p className="mt-1 max-w-sm text-xs font-semibold leading-relaxed text-slate-500">
                  The mapper stores reusable coordinates so new SBI or ICICI forms can be configured without writing code.
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          {mode === "admin" ? (
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-black text-slate-950">Mapped Fields</h2>
              <div className="max-h-[360px] space-y-2 overflow-auto pr-1">
                {mappings.length === 0 && <p className="text-xs font-semibold text-slate-500">No fields mapped yet.</p>}
                {mappings.map((field) => (
                  <button key={field.id} onClick={() => setSelectedFieldId(field.id)} className={`w-full rounded-md border p-3 text-left ${selectedFieldId === field.id ? "border-[#c7a14d] bg-[#fff8e6]" : "border-slate-200"}`}>
                    <span className="block text-xs font-black text-slate-900">{field.label}</span>
                    <span className="mt-1 block text-[11px] font-semibold text-slate-500">
                      Page {field.pageNumber} | X {field.x.toFixed(1)} | Y {field.y.toFixed(1)} | {field.fieldType}
                    </span>
                  </button>
                ))}
              </div>
              {selectedField && (
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  <h3 className="text-xs font-black uppercase tracking-wide text-slate-500">Selected Field</h3>
                  <input value={selectedField.label} onChange={(event) => updateField(selectedField.id, { label: event.target.value })} className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs font-bold" />
                  <div className="grid grid-cols-2 gap-2">
                    <NumberEditor label="X" value={selectedField.x} onChange={(value) => updateField(selectedField.id, { x: value })} />
                    <NumberEditor label="Y" value={selectedField.y} onChange={(value) => updateField(selectedField.id, { y: value })} />
                    <NumberEditor label="Width" value={selectedField.width} onChange={(value) => updateField(selectedField.id, { width: value })} />
                    <NumberEditor label="Height" value={selectedField.height} onChange={(value) => updateField(selectedField.id, { height: value })} />
                  </div>
                  <button onClick={deleteSelectedField} className="w-full rounded-md border border-rose-200 px-3 py-2 text-xs font-black text-rose-700">Delete Field</button>
                </div>
              )}
            </section>
          ) : (
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-black text-slate-950">Fill Mapped Fields</h2>
              <div className="max-h-[560px] space-y-3 overflow-auto pr-1">
                {mappings.length === 0 && <p className="text-xs font-semibold text-slate-500">Load a saved mapping first.</p>}
                {mappings.map((field) => (
                  <FillField key={field.id} field={field} value={values[field.id] || ""} onChange={(value) => updateValue(field, value)} onImageUpload={(event) => uploadImageValue(field, event)} />
                ))}
              </div>
            </section>
          )}

          {generatedUrl && (
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Generated Preview
              </div>
              <iframe title="Generated filled PDF" src={generatedUrl} className="h-[420px] w-full rounded-md border border-slate-200 bg-white" />
            </section>
          )}
        </aside>
      </main>
    </div>
  );
}

function NumberEditor({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-[11px] font-bold text-slate-600">
      {label}
      <input type="number" value={Math.round(value)} onChange={(event) => onChange(Number(event.target.value) || 0)} className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold" />
    </label>
  );
}

function FillField({
  field,
  value,
  onChange,
  onImageUpload,
}: {
  field: PdfFieldMapping;
  value: string;
  onChange: (value: string) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const label = (
    <span className="mb-1 block text-xs font-black text-slate-700">
      {field.label}
      <span className="ml-1 font-semibold text-slate-400">P{field.pageNumber}</span>
    </span>
  );

  if (field.fieldType === "checkbox" || field.fieldType === "radio") {
    return (
      <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
        {label}
        <span className="flex items-center gap-2 text-sm font-bold">
          <input type={field.fieldType} checked={value === "yes"} onChange={(event) => onChange(event.target.checked ? "yes" : "")} />
          Mark selected
        </span>
      </label>
    );
  }

  if (field.fieldType === "signature" || field.fieldType === "photo") {
    return (
      <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
        {label}
        <span className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#071b3a] px-3 py-2 text-xs font-black text-white">
          <Upload className="h-4 w-4" />
          Upload {field.fieldType}
          <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={onImageUpload} />
        </span>
        {value && <img src={value} alt={field.label} className="mt-2 max-h-24 rounded border bg-white object-contain p-2" />}
      </label>
    );
  }

  if (field.fieldType === "dropdown") {
    return (
      <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
        {label}
        <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold">
          <option value="">Select</option>
          {(field.options || []).map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  return (
    <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
      {label}
      <input type={field.fieldType === "date" ? "date" : "text"} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold" />
    </label>
  );
}

const mappingDb = {
  async open() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  async getAll(): Promise<StoredMappedPdf[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve((request.result as StoredMappedPdf[]).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
      request.onerror = () => reject(request.error);
    });
  },
  async get(id: string): Promise<StoredMappedPdf | undefined> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
      request.onsuccess = () => resolve(request.result as StoredMappedPdf | undefined);
      request.onerror = () => reject(request.error);
    });
  },
  async put(record: StoredMappedPdf) {
    const db = await this.open();
    return new Promise<void>((resolve, reject) => {
      const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};

let pdfjsModulePromise: Promise<any> | null = null;

function getPdfJs() {
  if (!pdfjsModulePromise) {
    pdfjsModulePromise = import("pdfjs-dist").then((module) => {
      (module as any).GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
      return module;
    });
  }
  return pdfjsModulePromise;
}
