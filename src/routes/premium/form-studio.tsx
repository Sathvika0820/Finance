import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, Upload, ZoomIn, ZoomOut, Download, Printer } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

if (typeof window !== "undefined") {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

type FieldType =
  | "text"
  | "multiline"
  | "number"
  | "date"
  | "checkbox"
  | "radio"
  | "dropdown"
  | "signature"
  | "char_boxes";

type StudioField = {
  id: string;
  type: FieldType;
  label: string;
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
  value?: string;
  placeholder?: string;
  required?: boolean;
  fontSize?: number;
  checked?: boolean;
  group?: string;
  boxCount?: number;
  signatureData?: string;
  options?: string[];
};

const STORAGE_KEY = "bankhub:form-studio-pro:v1";

export const Route = createFileRoute("/premium/form-studio")({
  component: () => (
    <AppShell>
      <FormStudioPro />
    </AppShell>
  ),
});

function FormStudioPro() {
  const [fileName, setFileName] = useState("");
  const [sourceBytes, setSourceBytes] = useState<Uint8Array | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1.2);
  const [fitWidth, setFitWidth] = useState(false);
  const [sizes, setSizes] = useState<Record<number, { w: number; h: number }>>({});
  const [fields, setFields] = useState<StudioField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState("");
  const [status, setStatus] = useState("Upload PDF to start.");
  const [error, setError] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [generatedBytes, setGeneratedBytes] = useState<Uint8Array | null>(null);

  const pageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfWrapRef = useRef<HTMLDivElement | null>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const dragRef = useRef<{
    id: string;
    mode: "move" | "resize";
    sx: number;
    sy: number;
    ox: number;
    oy: number;
    ow: number;
    oh: number;
  } | null>(null);
  const [drawing, setDrawing] = useState(false);

  const activeSize = sizes[page];
  const rw = activeSize ? activeSize.w * zoom : 0;
  const rh = activeSize ? activeSize.h * zoom : 0;
  const pageFields = fields.filter((f) => f.page === page);
  const selectedField = fields.find((f) => f.id === selectedId) || null;

  const presets = useMemo(
    () => ["Customer Name", "Mobile Number", "Email ID", "PAN Number", "Aadhaar Number", "Account Number", "IFSC Code", "Date of Birth", "Nominee Name", "Address"],
    []
  );

  useEffect(() => {
    if (!pdfDoc) return;
    void renderPage();
  }, [pdfDoc, page, zoom]);

  useEffect(() => {
    if (!fitWidth || !activeSize || !pdfWrapRef.current) return;
    const width = pdfWrapRef.current.clientWidth - 24;
    if (width > 0) setZoom(width / activeSize.w);
  }, [fitWidth, activeSize]);

  useEffect(() => {
    if (!fileName) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ fileName, page, zoom, fields, signatureData })
    );
  }, [fileName, page, zoom, fields, signatureData]);

  useEffect(() => {
    return () => {
      if (generatedUrl) URL.revokeObjectURL(generatedUrl);
    };
  }, [generatedUrl]);

  const uploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        throw new Error("unsupported");
      }
      const originalBuffer = await file.arrayBuffer();
      const workingBuffer = originalBuffer.slice(0);
      const bytes = new Uint8Array(workingBuffer);
      const previewBytes = bytes.slice();
      const task = pdfjsLib.getDocument({ data: previewBytes });
      const doc = await task.promise;
      const dims: Record<number, { w: number; h: number }> = {};
      for (let p = 1; p <= doc.numPages; p++) {
        const pg = await doc.getPage(p);
        const vp = pg.getViewport({ scale: 1 });
        dims[p] = { w: vp.width, h: vp.height };
      }
      setFileName(file.name);
      setSourceBytes(bytes.slice());
      setPdfDoc(doc);
      setPages(doc.numPages);
      setSizes(dims);
      setPage(1);
      setGeneratedUrl(null);
      setGeneratedBytes(null);
      setStatus(`Loaded ${file.name}. Add fields manually.`);
      restoreSession(file.name);
    } catch {
      setError("Unable to process this PDF. Please try another document.");
    }
  };

  const restoreSession = (incomingName: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.fileName !== incomingName) return;
      if (Array.isArray(parsed.fields)) setFields(parsed.fields);
      if (typeof parsed.page === "number") setPage(parsed.page);
      if (typeof parsed.zoom === "number") setZoom(parsed.zoom);
      if (typeof parsed.signatureData === "string") setSignatureData(parsed.signatureData);
      setStatus("Restored local autosave.");
    } catch {
      // ignore
    }
  };

  const renderPage = async () => {
    if (!pdfDoc || !pageCanvasRef.current) return;
    const p = await pdfDoc.getPage(page);
    const vp = p.getViewport({ scale: zoom });
    const canvas = pageCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = vp.width;
    canvas.height = vp.height;
    await p.render({ canvasContext: ctx, viewport: vp }).promise;
  };

  const addField = (type: FieldType, label?: string, boxCount?: number) => {
    const id = `f_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const f: StudioField = {
      id,
      type,
      label: label || type.toUpperCase(),
      page,
      x: 0.10,
      y: 0.10,
      w: type === "checkbox" || type === "radio" ? 0.06 : 0.25,
      h: type === "multiline" ? 0.12 : 0.05,
      value: "",
      placeholder: "",
      required: false,
      fontSize: type === "multiline" ? 10 : 11,
      checked: false,
      group: type === "radio" ? "radio-group-1" : undefined,
      boxCount: boxCount || 10,
      options: type === "dropdown" ? ["Option 1", "Option 2", "Option 3"] : undefined,
    };
    setFields((prev) => [...prev, f]);
    setSelectedId(id);
  };

  const updateField = (id: string, patch: Partial<StudioField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const removeField = (id: string) => setFields((prev) => prev.filter((f) => f.id !== id));

  const startDrag = (e: React.MouseEvent, id: string, mode: "move" | "resize") => {
    e.preventDefault();
    e.stopPropagation();
    const f = fields.find((x) => x.id === id);
    if (!f) return;
    dragRef.current = { id, mode, sx: e.clientX, sy: e.clientY, ox: f.x, oy: f.y, ow: f.w, oh: f.h };
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (!dragRef.current || !rw || !rh) return;
    const d = dragRef.current;
    const dx = (e.clientX - d.sx) / rw;
    const dy = (e.clientY - d.sy) / rh;
    if (d.mode === "move") {
      updateField(d.id, { x: Math.max(0, Math.min(0.95, d.ox + dx)), y: Math.max(0, Math.min(0.95, d.oy + dy)) });
    } else {
      updateField(d.id, { w: Math.max(0.04, Math.min(0.9, d.ow + dx)), h: Math.max(0.03, Math.min(0.7, d.oh + dy)) });
    }
  };
  const endDrag = () => {
    dragRef.current = null;
  };

  const addFieldAtPoint = (type: FieldType, label: string | undefined, ratioX: number, ratioY: number, boxCount?: number) => {
    const id = `f_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const f: StudioField = {
      id,
      type,
      label: label || type.toUpperCase(),
      page,
      x: Math.max(0, Math.min(0.94, ratioX)),
      y: Math.max(0, Math.min(0.94, ratioY)),
      w: type === "checkbox" || type === "radio" ? 0.06 : 0.25,
      h: type === "multiline" ? 0.12 : 0.05,
      value: "",
      placeholder: "",
      required: false,
      fontSize: type === "multiline" ? 10 : 11,
      checked: false,
      group: type === "radio" ? "radio-group-1" : undefined,
      boxCount: boxCount || 10,
      options: type === "dropdown" ? ["Option 1", "Option 2", "Option 3"] : undefined,
    };
    setFields((prev) => [...prev, f]);
    setSelectedId(id);
  };

  const onSigUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignatureData(reader.result as string);
      setStatus("Signature uploaded.");
    };
    reader.readAsDataURL(file);
  };

  const sigDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const c = sigCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const rect = c.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    setDrawing(true);
  };
  const sigMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const c = sigCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const rect = c.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const sigUp = () => setDrawing(false);

  const saveDrawnSignature = () => {
    const c = sigCanvasRef.current;
    if (!c) return;
    setSignatureData(c.toDataURL("image/png"));
    setStatus("Drawn signature saved.");
  };
  const clearSignature = () => {
    const c = sigCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
  };

  const generatePdf = async () => {
    if (!sourceBytes) {
      setError("Unable to process this PDF. Please try another document.");
      return;
    }
    setError(null);
    setStatus("Generating completed PDF...");
    try {
      const bytesForGeneration = sourceBytes.slice();
      const doc = await PDFDocument.load(bytesForGeneration);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      const pagesRef = doc.getPages();

      for (const f of fields) {
        const p = pagesRef[f.page - 1];
        if (!p) continue;
        const { width: pw, height: ph } = p.getSize();
        const x = f.x * pw;
        const w = f.w * pw;
        const h = f.h * ph;
        const y = ph - (f.y * ph) - h;

        if (f.type === "checkbox") {
          if (f.checked) p.drawText("X", { x: x + 3, y: y + 2, size: 12, font: bold, color: rgb(0.08, 0.2, 0.62) });
          continue;
        }
        if (f.type === "radio") {
          if (f.checked) p.drawText("o", { x: x + 2, y: y + 1, size: 12, font: bold, color: rgb(0.08, 0.2, 0.62) });
          continue;
        }
        if (f.type === "signature") {
          const sig = f.signatureData || signatureData;
          if (sig && sig.startsWith("data:image")) {
            const raw = sig.split(",")[1];
            const ib = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
            const img = sig.includes("png") ? await doc.embedPng(ib) : await doc.embedJpg(ib);
            const dims = img.scaleToFit(w, h);
            p.drawImage(img, { x, y, width: dims.width, height: dims.height });
          }
          continue;
        }

        const text = (f.value || "").toString();
        if (!text) continue;
        if (f.type === "multiline") {
          text.split("\n").forEach((line, idx) => {
            p.drawText(line, { x: x + 3, y: y + h - 14 - idx * 13, size: 10, font, color: rgb(0.08, 0.2, 0.62) });
          });
          continue;
        }
        if (f.type === "char_boxes") {
          const clean = text.replace(/\s/g, "");
          const count = f.boxCount || clean.length;
          const boxW = w / Math.max(count, 1);
          for (let i = 0; i < Math.min(clean.length, count); i++) {
            p.drawText(clean[i], {
              x: x + i * boxW + boxW / 2 - 3,
              y: y + h / 2 - 5,
              size: 11,
              font: bold,
              color: rgb(0.08, 0.2, 0.62),
            });
          }
          continue;
        }
        p.drawText(text, { x: x + 3, y: y + 3, size: f.fontSize || 11, font, color: rgb(0.08, 0.2, 0.62) });
      }

      const out = await doc.save();
      setGeneratedBytes(out);
      const blob = new Blob([out], { type: "application/pdf" });
      if (generatedUrl) URL.revokeObjectURL(generatedUrl);
      const url = URL.createObjectURL(blob);
      setGeneratedUrl(url);
      setStatus(`PDF generated (${(out.length / 1024).toFixed(1)} KB). Preview before download is ready.`);
    } catch {
      setError("Unable to process this PDF. Please try another document.");
    }
  };

  const downloadPdf = () => {
    if (!generatedBytes) return;
    const blob = new Blob([generatedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BankHub_Completed_${fileName || "form"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const printPdf = () => {
    if (!generatedUrl) return;
    const win = window.open(generatedUrl, "_blank", "noopener,noreferrer");
    if (!win) {
      setStatus("Unable to open print preview. Please allow pop-ups.");
      return;
    }
    const trigger = () => {
      try {
        win.focus();
        win.print();
      } catch {
        setStatus("Print preview unavailable on this device.");
      }
    };
    win.onload = trigger;
    setTimeout(trigger, 900);
  };

  const sharePdf = async () => {
    if (!generatedUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: "BankHub Completed PDF", text: "Completed form PDF", url: generatedUrl });
      } else {
        await navigator.clipboard.writeText(generatedUrl);
        setStatus("Share link copied to clipboard.");
      }
    } catch {
      setStatus("Share is unavailable on this device.");
    }
  };

  const duplicateField = (id: string) => {
    const f = fields.find((x) => x.id === id);
    if (!f) return;
    const copy: StudioField = {
      ...f,
      id: `f_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      x: Math.min(0.92, f.x + 0.02),
      y: Math.min(0.92, f.y + 0.02),
      label: `${f.label} Copy`,
    };
    setFields((prev) => [...prev, copy]);
  };

  const onWorkspaceDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!rw || !rh) return;
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = (e.clientX - rect.left - 12) / rw;
    const ry = (e.clientY - rect.top - 12) / rh;
    const [type, label, boxes] = raw.split("|");
    addFieldAtPoint(type as FieldType, label || undefined, rx, ry, boxes ? Number(boxes) : undefined);
  };

  return (
    <div className="min-h-screen bg-indigo-50/30 pb-24">
      <div className="bg-white border-b border-indigo-200 px-4 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-indigo-100 transition-colors text-indigo-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-indigo-900 leading-tight">BankHub Form Studio Pro</h1>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Manual Banking PDF Editor</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[330px_1fr_300px] gap-4">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-indigo-200 bg-white p-4">
            <h3 className="font-bold text-sm mb-3">Step 1: Upload PDF</h3>
            <label className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold cursor-pointer">
              <Upload className="w-4 h-4" /> Upload PDF
              <input type="file" accept="application/pdf" className="hidden" onChange={uploadPdf} />
            </label>
            <p className="text-xs text-slate-500 mt-2">{fileName || "No document selected"}</p>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-white p-4">
            <h3 className="font-bold text-sm mb-1">Add Fields</h3>
            <p className="text-[11px] text-slate-500 mb-3">Drag and drop fields onto PDF</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ["text", "Text"],
                ["multiline", "Multi-line"],
                ["number", "Number"],
                ["date", "Date"],
                ["checkbox", "Checkbox"],
                ["radio", "Radio"],
                ["dropdown", "Dropdown"],
                ["signature", "Signature"],
                ["char_boxes", "Character Boxes"],
              ].map(([type, label]) => (
                <button key={type} className="px-2 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold" draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", `${type}|${label}`)} onClick={() => addField(type as FieldType)}>
                  {label}
                </button>
              ))}
            </div>
            <h4 className="font-bold text-xs mt-4 mb-2">Banking Presets</h4>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button key={preset} className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100" draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", `text|${preset}`)} onClick={() => addField("text", preset)}>
                  {preset}
                </button>
              ))}
              <button className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-100" draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", "char_boxes|PAN|10")} onClick={() => addField("char_boxes", "PAN", 10)}>
                PAN Boxes
              </button>
              <button className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-100" draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", "char_boxes|Mobile|10")} onClick={() => addField("char_boxes", "Mobile", 10)}>
                Mobile Boxes
              </button>
              <button className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-100" draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", "char_boxes|Aadhaar|12")} onClick={() => addField("char_boxes", "Aadhaar", 12)}>
                Aadhaar Boxes
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-white p-4">
            <h3 className="font-bold text-sm mb-3">Step 4: Signature</h3>
            <label className="inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded border border-slate-200 cursor-pointer">
              Upload Signature
              <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={onSigUpload} />
            </label>
            <canvas
              ref={sigCanvasRef}
              width={290}
              height={90}
              className="w-full mt-2 border rounded bg-white"
              onMouseDown={sigDown}
              onMouseMove={sigMove}
              onMouseUp={sigUp}
              onMouseLeave={sigUp}
              onTouchStart={sigDown}
              onTouchMove={sigMove}
              onTouchEnd={sigUp}
            />
            <div className="mt-2 flex gap-2">
              <button className="px-2 py-1 text-xs rounded border" onClick={clearSignature}>Clear</button>
              <button className="px-2 py-1 text-xs rounded bg-indigo-600 text-white" onClick={saveDrawnSignature}>Save Drawn</button>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-white p-4 space-y-2">
            <button className="w-full px-3 py-2 rounded-lg bg-indigo-600 text-white font-bold text-sm" onClick={generatePdf}>
              Generate Completed PDF
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="px-2 py-2 rounded border text-xs font-semibold" onClick={() => generatedUrl && setStatus("Preview loaded below.")} disabled={!generatedUrl}>
                Preview
              </button>
              <button className="px-2 py-2 rounded border text-xs font-semibold" onClick={downloadPdf} disabled={!generatedUrl}>
                <Download className="w-3 h-3 inline mr-1" /> Download
              </button>
              <button className="col-span-2 px-2 py-2 rounded border text-xs font-semibold" onClick={printPdf} disabled={!generatedUrl}>
                <Printer className="w-3 h-3 inline mr-1" /> Print
              </button>
              <button className="col-span-2 px-2 py-2 rounded border text-xs font-semibold" onClick={sharePdf} disabled={!generatedUrl}>
                Share PDF
              </button>
            </div>
            <div className="text-[11px] text-slate-600">{status}</div>
            {error && <div className="text-[11px] text-rose-700 font-semibold">{error}</div>}
          </div>
        </aside>

        <main className="rounded-2xl border border-indigo-200 bg-white p-3">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 border rounded text-xs font-semibold" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}><ZoomOut className="w-3 h-3 inline mr-1" />Zoom Out</button>
              <button className="px-2 py-1 border rounded text-xs font-semibold" onClick={() => setZoom((z) => Math.min(3, z + 0.1))}><ZoomIn className="w-3 h-3 inline mr-1" />Zoom In</button>
              <button className="px-2 py-1 border rounded text-xs font-semibold" onClick={() => setFitWidth(true)}>Fit Width</button>
              <button className="px-2 py-1 border rounded text-xs font-semibold" onClick={() => setFitWidth(false)}>Manual Zoom</button>
              <button className="px-2 py-1 border rounded text-xs font-semibold" onClick={() => void renderPage()}>Refresh</button>
              <button className="px-2 py-1 border rounded text-xs font-semibold" onClick={() => pdfWrapRef.current?.requestFullscreen?.()}>Fullscreen</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 max-w-[140px] truncate">{fileName || "No file selected"}</span>
              <button className="px-2 py-1 border rounded text-xs font-semibold" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
              <span className="text-xs font-bold">Page {page} / {pages || 1}</span>
              <button className="px-2 py-1 border rounded text-xs font-semibold" onClick={() => setPage((p) => Math.min(pages || 1, p + 1))}>Next</button>
              <span className="text-xs font-bold">{Math.round(zoom * 100)}%</span>
            </div>
          </div>

          <div
            ref={pdfWrapRef}
            className="relative overflow-auto scroll-smooth bg-slate-100 rounded-xl p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onWorkspaceDrop}
            onMouseMove={onDragMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
          >
            <div className="relative inline-block" style={{ width: rw, height: rh }}>
              <canvas ref={pageCanvasRef} className="block bg-white rounded border" />
              {pageFields.map((f) => {
                const left = f.x * rw;
                const top = f.y * rh;
                const width = f.w * rw;
                const height = f.h * rh;
                return (
                  <div
                    key={f.id}
                    className={`absolute border-2 ${selectedId === f.id ? "border-indigo-600" : "border-indigo-300"} bg-white/95 rounded`}
                    style={{ left, top, width, height }}
                    onClick={() => setSelectedId(f.id)}
                  >
                    <div className="h-5 bg-indigo-50 border-b border-indigo-200 text-[10px] px-1 flex items-center justify-between cursor-move" onMouseDown={(e) => startDrag(e, f.id, "move")}>
                      <input className="bg-transparent w-full outline-none" value={f.label} onChange={(e) => updateField(f.id, { label: e.target.value })} />
                      <button className="text-rose-600 ml-1" onClick={(e) => { e.stopPropagation(); removeField(f.id); }}>x</button>
                    </div>
                    <div className="p-1 text-[11px]">
                      {(f.type === "text" || f.type === "number" || f.type === "date") && (
                        <input
                          type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                          className="w-full border rounded px-1 py-0.5 text-[11px]"
                          value={f.value || ""}
                          placeholder={f.placeholder || ""}
                          onChange={(e) => updateField(f.id, { value: e.target.value })}
                        />
                      )}
                      {f.type === "multiline" && (
                        <textarea className="w-full border rounded px-1 py-0.5 text-[11px] h-12" value={f.value || ""} onChange={(e) => updateField(f.id, { value: e.target.value })} />
                      )}
                      {f.type === "checkbox" && (
                        <label className="inline-flex items-center gap-1"><input type="checkbox" checked={!!f.checked} onChange={(e) => updateField(f.id, { checked: e.target.checked })} /> Checked</label>
                      )}
                      {f.type === "radio" && (
                        <label className="inline-flex items-center gap-1"><input type="radio" checked={!!f.checked} onChange={(e) => updateField(f.id, { checked: e.target.checked })} /> Selected</label>
                      )}
                      {f.type === "dropdown" && (
                        <div className="space-y-1">
                          <select className="w-full border rounded px-1 py-0.5 text-[11px]" value={f.value || ""} onChange={(e) => updateField(f.id, { value: e.target.value })}>
                            <option value="">Select</option>
                            {(f.options || []).map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                          <input
                            className="w-full border rounded px-1 py-0.5 text-[11px]"
                            value={(f.options || []).join(", ")}
                            onChange={(e) => updateField(f.id, { options: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })}
                            placeholder="Option 1, Option 2"
                          />
                        </div>
                      )}
                      {f.type === "char_boxes" && (
                        <div className="space-y-1">
                          <input className="w-full border rounded px-1 py-0.5 text-[11px]" value={f.value || ""} onChange={(e) => updateField(f.id, { value: e.target.value })} placeholder="Characters" />
                          <input type="number" className="w-full border rounded px-1 py-0.5 text-[11px]" value={f.boxCount || 10} onChange={(e) => updateField(f.id, { boxCount: Number(e.target.value) })} />
                        </div>
                      )}
                      {f.type === "signature" && (
                        <div className="space-y-1">
                          <button className="px-1 py-0.5 border rounded text-[10px]" onClick={() => updateField(f.id, { signatureData })}>Use Saved Signature</button>
                          {(f.signatureData || signatureData) && <img src={f.signatureData || signatureData} alt="signature" className="max-h-8" />}
                        </div>
                      )}
                    </div>
                    <div className="absolute right-0 bottom-0 w-3 h-3 bg-indigo-600 cursor-se-resize" onMouseDown={(e) => startDrag(e, f.id, "resize")} />
                  </div>
                );
              })}
            </div>
          </div>
          {generatedUrl && (
            <div className="mt-4 rounded-xl border border-indigo-200 bg-white p-3">
              <h4 className="text-sm font-bold text-indigo-900 mb-2">Generated PDF Preview</h4>
              <div className="mb-2 text-xs">
                <a href={generatedUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-700 font-semibold underline mr-4">Open Preview in New Tab</a>
                <a href={generatedUrl} download={`BankHub_Completed_${fileName || "form"}.pdf`} className="text-indigo-700 font-semibold underline">Direct Download Link</a>
              </div>
              <iframe
                title="Generated PDF Preview"
                src={generatedUrl}
                className="w-full h-[560px] rounded border border-slate-200 bg-white"
              />
            </div>
          )}
        </main>

        <aside className="rounded-2xl border border-indigo-200 bg-white p-4">
          <h3 className="font-bold text-sm mb-3">Fields</h3>
          <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
            {fields.length === 0 && <p className="text-xs text-slate-500">No fields added yet.</p>}
            {fields.map((f) => (
              <div key={f.id} className={`rounded-lg border p-2 ${selectedId === f.id ? "border-indigo-400 bg-indigo-50/50" : "border-slate-200"}`}>
                <div className="text-[11px] font-bold">{f.label}</div>
                <div className="text-[10px] text-slate-500">Type: {f.type} | Page: {f.page}</div>
                <div className="text-[10px] text-slate-500">x:{f.x.toFixed(2)} y:{f.y.toFixed(2)} w:{f.w.toFixed(2)} h:{f.h.toFixed(2)}</div>
                <div className="mt-1 flex gap-1">
                  <button className="px-2 py-0.5 text-[10px] border rounded" onClick={() => { setSelectedId(f.id); setPage(f.page); }}>Edit</button>
                  <button className="px-2 py-0.5 text-[10px] border rounded" onClick={() => duplicateField(f.id)}>Duplicate</button>
                  <button className="px-2 py-0.5 text-[10px] border rounded text-rose-700" onClick={() => removeField(f.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          {selectedField && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
              <h4 className="font-bold text-xs text-slate-700">Properties</h4>
              <input className="w-full border rounded px-2 py-1 text-xs" value={selectedField.label} onChange={(e) => updateField(selectedField.id, { label: e.target.value })} placeholder="Label" />
              <input className="w-full border rounded px-2 py-1 text-xs" value={selectedField.placeholder || ""} onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })} placeholder="Placeholder" />
              <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={!!selectedField.required} onChange={(e) => updateField(selectedField.id, { required: e.target.checked })} /> Required</label>
              <label className="text-xs block">Width (%)
                <input type="number" className="w-full border rounded px-2 py-1 text-xs" value={Math.round(selectedField.w * 100)} onChange={(e) => updateField(selectedField.id, { w: Math.max(0.04, Math.min(0.9, Number(e.target.value) / 100)) })} />
              </label>
              <label className="text-xs block">Height (%)
                <input type="number" className="w-full border rounded px-2 py-1 text-xs" value={Math.round(selectedField.h * 100)} onChange={(e) => updateField(selectedField.id, { h: Math.max(0.03, Math.min(0.7, Number(e.target.value) / 100)) })} />
              </label>
              <label className="text-xs block">X Position (%)
                <input type="number" className="w-full border rounded px-2 py-1 text-xs" value={Math.round(selectedField.x * 100)} onChange={(e) => updateField(selectedField.id, { x: Math.max(0, Math.min(0.95, Number(e.target.value) / 100)) })} />
              </label>
              <label className="text-xs block">Y Position (%)
                <input type="number" className="w-full border rounded px-2 py-1 text-xs" value={Math.round(selectedField.y * 100)} onChange={(e) => updateField(selectedField.id, { y: Math.max(0, Math.min(0.95, Number(e.target.value) / 100)) })} />
              </label>
              <label className="text-xs block">Font Size
                <input type="number" className="w-full border rounded px-2 py-1 text-xs" value={selectedField.fontSize || 11} onChange={(e) => updateField(selectedField.id, { fontSize: Math.max(8, Math.min(28, Number(e.target.value) || 11)) })} />
              </label>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}


