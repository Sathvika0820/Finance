type ZipEntry = {
  name: string;
  method: number;
  compressedSize: number;
  uncompressedSize: number;
  localHeaderOffset: number;
  compressedData: Uint8Array;
  data?: Uint8Array;
};

export type DocxImageValue = {
  name: string;
  dataUrl: string;
};

export type DocxAnswers = Record<string, string | DocxImageValue | undefined>;

export type BuildFilledDocxOptions = {
  blankUnanswered?: boolean;
  requireRenderedBoxKeys?: string[];
};

type DocxImagePart = {
  key: string;
  rid: string;
  fileName: string;
  data: Uint8Array;
  mimeType: string;
  widthEmu: number;
  heightEmu: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const EMU_PER_PIXEL = 9525;
const SIGNATURE_WIDTH_EMU = 138 * EMU_PER_PIXEL;
const SIGNATURE_HEIGHT_EMU = 30 * EMU_PER_PIXEL;
const PHOTO_WIDTH_EMU = 95 * EMU_PER_PIXEL;
const PHOTO_HEIGHT_EMU = 115 * EMU_PER_PIXEL;

function readU16(bytes: Uint8Array, offset: number) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readU32(bytes: Uint8Array, offset: number) {
  return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
}

function writeU16(out: number[], value: number) {
  out.push(value & 255, (value >>> 8) & 255);
}

function writeU32(out: number[], value: number) {
  out.push(value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255);
}

function appendBytes(out: number[], bytes: Uint8Array) {
  for (const byte of bytes) out.push(byte);
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

async function inflateRaw(data: Uint8Array) {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("DOCX decompression is not supported in this browser.");
  }
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw" as CompressionFormat));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function findEndOfCentralDirectory(bytes: Uint8Array) {
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 66000); i -= 1) {
    if (readU32(bytes, i) === 0x06054b50) return i;
  }
  throw new Error("Invalid DOCX file: ZIP directory not found.");
}

async function readZip(bytes: Uint8Array) {
  const eocd = findEndOfCentralDirectory(bytes);
  const totalEntries = readU16(bytes, eocd + 10);
  const centralOffset = readU32(bytes, eocd + 16);
  const entries: ZipEntry[] = [];
  let offset = centralOffset;

  for (let i = 0; i < totalEntries; i += 1) {
    if (readU32(bytes, offset) !== 0x02014b50) throw new Error("Invalid DOCX central directory.");
    const method = readU16(bytes, offset + 10);
    const compressedSize = readU32(bytes, offset + 20);
    const uncompressedSize = readU32(bytes, offset + 24);
    const nameLength = readU16(bytes, offset + 28);
    const extraLength = readU16(bytes, offset + 30);
    const commentLength = readU16(bytes, offset + 32);
    const localHeaderOffset = readU32(bytes, offset + 42);
    const name = decoder.decode(bytes.slice(offset + 46, offset + 46 + nameLength));

    const localNameLength = readU16(bytes, localHeaderOffset + 26);
    const localExtraLength = readU16(bytes, localHeaderOffset + 28);
    const dataOffset = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const compressedData = bytes.slice(dataOffset, dataOffset + compressedSize);

    let data: Uint8Array | undefined;
    if (method === 0) data = compressedData;
    if (method === 8) data = await inflateRaw(compressedData);

    entries.push({ name, method, compressedSize, uncompressedSize, localHeaderOffset, compressedData, data });
    offset += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

function createStoredZip(entries: Array<{ name: string; data: Uint8Array }>) {
  const out: number[] = [];
  const central: number[] = [];

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const localOffset = out.length;
    const crc = crc32(entry.data);

    writeU32(out, 0x04034b50);
    writeU16(out, 20);
    writeU16(out, 0);
    writeU16(out, 0);
    writeU16(out, 0);
    writeU16(out, 0);
    writeU32(out, crc);
    writeU32(out, entry.data.length);
    writeU32(out, entry.data.length);
    writeU16(out, nameBytes.length);
    writeU16(out, 0);
    appendBytes(out, nameBytes);
    appendBytes(out, entry.data);

    writeU32(central, 0x02014b50);
    writeU16(central, 20);
    writeU16(central, 20);
    writeU16(central, 0);
    writeU16(central, 0);
    writeU16(central, 0);
    writeU16(central, 0);
    writeU32(central, crc);
    writeU32(central, entry.data.length);
    writeU32(central, entry.data.length);
    writeU16(central, nameBytes.length);
    writeU16(central, 0);
    writeU16(central, 0);
    writeU16(central, 0);
    writeU16(central, 0);
    writeU32(central, 0);
    writeU32(central, localOffset);
    appendBytes(central, nameBytes);
  }

  const centralOffset = out.length;
  out.push(...central);
  writeU32(out, 0x06054b50);
  writeU16(out, 0);
  writeU16(out, 0);
  writeU16(out, entries.length);
  writeU16(out, entries.length);
  writeU32(out, central.length);
  writeU32(out, centralOffset);
  writeU16(out, 0);

  return new Uint8Array(out);
}

function decodeXml(entry: ZipEntry) {
  if (!entry.data) throw new Error(`Unsupported compressed entry: ${entry.name}`);
  return decoder.decode(entry.data);
}

function xmlText(xml: string) {
  return xml
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isDocxImageValue(value: DocxAnswers[string]): value is DocxImageValue {
  return Boolean(value && typeof value === "object" && "dataUrl" in value);
}

function extensionForMime(mimeType: string) {
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") return "jpg";
  if (mimeType === "image/png") return "png";
  return "";
}

function bytesFromBase64(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function parseImageDataUrl(value: DocxImageValue) {
  const match = value.dataUrl.match(/^data:(image\/(?:png|jpe?g));base64,(.+)$/i);
  if (!match) throw new Error(`Unsupported image format for ${value.name}. Use PNG or JPG.`);
  const mimeType = match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase();
  const extension = extensionForMime(mimeType);
  if (!extension) throw new Error(`Unsupported image format for ${value.name}. Use PNG or JPG.`);
  const data = bytesFromBase64(match[2]);
  return { mimeType, extension, data, dimensions: imageDimensions(data, mimeType) };
}

function signatureDrawingXml(part: DocxImagePart) {
  const descr = escapeXml(part.fileName);
  return `<w:r><w:drawing><wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${part.widthEmu}" cy="${part.heightEmu}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="1" name="${escapeXml(part.key)}" descr="${descr}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="${descr}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${part.rid}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${part.widthEmu}" cy="${part.heightEmu}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
}

function readU32BE(bytes: Uint8Array, offset: number) {
  return ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
}

function imageDimensions(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "image/png" && bytes.length > 24) {
    return { width: readU32BE(bytes, 16), height: readU32BE(bytes, 20) };
  }
  if (mimeType === "image/jpeg") {
    let offset = 2;
    while (offset < bytes.length - 9) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
      if (marker >= 0xc0 && marker <= 0xc3) {
        return { height: (bytes[offset + 5] << 8) | bytes[offset + 6], width: (bytes[offset + 7] << 8) | bytes[offset + 8] };
      }
      offset += 2 + length;
    }
  }
  return { width: 400, height: 120 };
}

function containImageSize(key: string, width: number, height: number) {
  const isPhoto = key.toLowerCase().includes("photo");
  const maxWidth = isPhoto ? PHOTO_WIDTH_EMU : SIGNATURE_WIDTH_EMU;
  const maxHeight = isPhoto ? PHOTO_HEIGHT_EMU : SIGNATURE_HEIGHT_EMU;
  const sourceWidth = Math.max(width, 1);
  const sourceHeight = Math.max(height, 1);
  const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
  return {
    widthEmu: Math.round(sourceWidth * scale),
    heightEmu: Math.round(sourceHeight * scale),
  };
}

function cellRunProperties(cellXml: string) {
  return cellXml.match(/<w:rPr[\s\S]*?<\/w:rPr>/)?.[0] || cellXml.match(/<w:pPr[\s\S]*?(<w:rPr[\s\S]*?<\/w:rPr>)[\s\S]*?<\/w:pPr>/)?.[1] || "";
}

function cellTextRun(cellXml: string, value: string) {
  const runProperties = cellRunProperties(cellXml);
  return `<w:r>${runProperties}<w:t>${escapeXml(value)}</w:t></w:r>`;
}

function centerCellContent(cellXml: string) {
  let output = cellXml;
  if (/<w:tcPr[\s\S]*?<\/w:tcPr>/.test(output)) {
    output = output.replace(/<w:tcPr[\s\S]*?<\/w:tcPr>/, (tcPr) => {
      let nextTcPr = /<w:vAlign\b[^>]*\/>/.test(tcPr)
        ? tcPr.replace(/<w:vAlign\b[^>]*\/>/, '<w:vAlign w:val="center"/>')
        : tcPr.replace("</w:tcPr>", '<w:vAlign w:val="center"/></w:tcPr>');
      if (/<w:tcMar[\s\S]*?<\/w:tcMar>/.test(nextTcPr)) {
        nextTcPr = nextTcPr.replace(/<w:tcMar[\s\S]*?<\/w:tcMar>/, '<w:tcMar><w:top w:w="0" w:type="dxa"/><w:left w:w="0" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tcMar>');
      } else {
        nextTcPr = nextTcPr.replace("</w:tcPr>", '<w:tcMar><w:top w:w="0" w:type="dxa"/><w:left w:w="0" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tcMar></w:tcPr>');
      }
      return nextTcPr;
    });
  } else {
    output = output.replace(/<w:tc(\s[^>]*)?>/, '<w:tc$1><w:tcPr><w:vAlign w:val="center"/><w:tcMar><w:top w:w="0" w:type="dxa"/><w:left w:w="0" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tcMar></w:tcPr>');
  }
  if (/<w:pPr[\s\S]*?<\/w:pPr>/.test(output)) {
    output = output.replace(/<w:pPr[\s\S]*?<\/w:pPr>/, (pPr) => {
      let nextPPr = /<w:jc\b[^>]*\/>/.test(pPr)
        ? pPr.replace(/<w:jc\b[^>]*\/>/, '<w:jc w:val="center"/>')
        : pPr.replace("</w:pPr>", '<w:jc w:val="center"/></w:pPr>');
      nextPPr = /<w:spacing\b[^>]*\/>/.test(nextPPr)
        ? nextPPr.replace(/<w:spacing\b[^>]*\/>/, '<w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>')
        : nextPPr.replace("</w:pPr>", '<w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>');
      nextPPr = /<w:ind\b[^>]*\/>/.test(nextPPr)
        ? nextPPr.replace(/<w:ind\b[^>]*\/>/, '<w:ind w:left="0" w:right="0" w:firstLine="0" w:hanging="0"/>')
        : nextPPr.replace("</w:pPr>", '<w:ind w:left="0" w:right="0" w:firstLine="0" w:hanging="0"/></w:pPr>');
      return nextPPr;
    });
  } else {
    output = output.replace(/<w:p(\s[^>]*)?>/, '<w:p$1><w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/><w:ind w:left="0" w:right="0" w:firstLine="0" w:hanging="0"/></w:pPr>');
  }
  return output;
}

function setCellText(cellXml: string, value: string, key?: string, center = false) {
  let output = cellXml;
  if (key) {
    output = output.replace(placeholderPattern(key), escapeXml(value));
    output = output.replace(flexiblePlaceholderPattern(key), escapeXml(value));
    if (output !== cellXml) return center ? centerCellContent(output) : output;
  }

  if (/<w:t(?:\s[^>]*)?>[\s\S]*?<\/w:t>/.test(output)) {
    output = output.replace(/<w:t(\s[^>]*)?>[\s\S]*?<\/w:t>/, `<w:t$1>${escapeXml(value)}</w:t>`);
    return center ? centerCellContent(output) : output;
  }

  if (/<\/w:p>/.test(output)) {
    output = output.replace(/<\/w:p>/, `${cellTextRun(cellXml, value)}</w:p>`);
    return center ? centerCellContent(output) : output;
  }

  return center ? centerCellContent(output) : output;
}

function fillExistingBoxCells(xml: string, key: string, value: string) {
  const chars = value.replace(/\s+/g, "").split("");
  let filled = false;
  let expectedBoxes = 0;
  let renderedCharacters = 0;
  let renderStatus = "FAILED";
  const output = xml.replace(/<w:tr[\s\S]*?<\/w:tr>/g, (row) => {
    if (!placeholderPattern(key).test(row) && !flexiblePlaceholderPattern(key).test(row)) return row;

    const cells = row.match(/<w:tc(?:\s|>)[\s\S]*?<\/w:tc>/g);
    if (!cells?.length) return row;

    const markerIndex = cells.findIndex((cell) => placeholderPattern(key).test(cell) || flexiblePlaceholderPattern(key).test(cell));
    if (markerIndex < 0) return row;
    const nextMarkerIndex = cells.findIndex((cell, index) => (
      index > markerIndex && /(?:\{\{\s*[a-zA-Z0-9_]+\s*\}\}|\[\[\s*[a-zA-Z0-9_]+\s*\]\])/.test(xmlText(cell))
    ));
    const fillEnd = nextMarkerIndex > markerIndex ? nextMarkerIndex : cells.length;
    const targetCount = fillEnd - markerIndex;
    const values = targetCount <= 1 ? [value.replace(/\s+/g, "")] : chars;
    expectedBoxes = Math.max(expectedBoxes, targetCount);

    let nextRow = row;
    cells.slice(markerIndex, fillEnd).forEach((cell, offset) => {
      const index = markerIndex + offset;
      const charIndex = index - markerIndex;
      const char = values[charIndex] || "";
      const updatedCell = setCellText(cell, char, index === markerIndex ? key : undefined, true);
      if (char) renderedCharacters += 1;
      nextRow = nextRow.replace(cell, updatedCell);
    });

    filled = true;
    renderStatus = targetCount > 1 && renderedCharacters === Math.min(chars.length, targetCount) ? "SUCCESS" : "FAILED";
    return nextRow;
  });

  if (key === "account_number_boxes") {
    console.info("[BankHub Form Assistant] Box render debug", {
      "Fixed box field": key,
      "User value": value,
      "Characters rendered": renderedCharacters,
      "Expected boxes": expectedBoxes,
      "Render status": renderStatus,
    });
    if (renderStatus !== "SUCCESS") {
      throw new Error("Account Number could not be rendered.");
    }
  }

  if (!filled) {
    console.warn("[BankHub Form Assistant] Box marker had no existing row cells; removed marker only", { key });
    return output.replace(placeholderPattern(key), "").replace(flexiblePlaceholderPattern(key), "");
  }

  console.info("[BankHub Form Assistant] Filled existing box cells", { key, characters: chars.length });
  return output;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeSplitPlaceholders(xml: string) {
  return xml.replace(/(\{\{[\s\S]*?\}\}|\[\[[\s\S]*?\]\])/g, (match) => {
    const normalized = xmlText(match).replace(/\s+/g, "");
    return /^(\{\{[a-zA-Z0-9_]+\}\}|\[\[[a-zA-Z0-9_]+\]\])$/.test(normalized) ? normalized : match;
  });
}

function placeholderPattern(key: string) {
  return new RegExp(`(?:\\{\\{\\s*${escapeRegex(key)}\\s*\\}\\}|\\[\\[\\s*${escapeRegex(key)}\\s*\\]\\])`, "g");
}

function flexiblePlaceholderPattern(key: string) {
  const gap = "(?:<[^>]+>|\\s)*";
  const flexibleKey = key.split("").map(escapeRegex).join(gap);
  return new RegExp(`(?:\\{${gap}\\{${gap}${flexibleKey}${gap}\\}${gap}\\}|\\[${gap}\\[${gap}${flexibleKey}${gap}\\]${gap}\\])`, "g");
}

function containsPlaceholder(xml: string, key: string) {
  return placeholderPattern(key).test(xml) || flexiblePlaceholderPattern(key).test(xml);
}

function replaceImagePlaceholder(xml: string, key: string, imageXml: string) {
  let replaced = false;
  let output = xml.replace(/<w:r(?:\s|>)[\s\S]*?<\/w:r>/g, (run) => {
    if (!containsPlaceholder(run, key)) return run;
    replaced = true;
    return imageXml;
  });
  if (!replaced) {
    const before = output;
    output = output.replace(placeholderPattern(key), imageXml);
    output = output.replace(flexiblePlaceholderPattern(key), imageXml);
    replaced = before !== output;
  }
  return { output, replaced };
}

function replaceXmlPlaceholders(xml: string, answers: DocxAnswers, imageParts: DocxImagePart[] = [], options: BuildFilledDocxOptions = {}) {
  let output = normalizeSplitPlaceholders(xml);
  const replaced: string[] = [];
  const visibleKeys = Array.from(
    new Set(Array.from(xmlText(output).matchAll(/(?:\{\{\s*([a-zA-Z0-9_]+)\s*\}\}|\[\[\s*([a-zA-Z0-9_]+)\s*\]\])/g)).map((match) => match[1] || match[2])),
  );
  const keys = Array.from(new Set([...visibleKeys, ...Object.keys(answers), "signature", "passport_photo"]));

  for (const key of keys) {
    const rawValue = answers[key];
    const imagePart = imageParts.find((part) => part.key === key);
    if (imagePart) {
      const result = replaceImagePlaceholder(output, key, signatureDrawingXml(imagePart));
      output = result.output;
      if (result.replaced) replaced.push(key);
      continue;
    }
    if (key.endsWith("_boxes")) {
      if (rawValue && typeof rawValue === "string") {
        output = fillExistingBoxCells(output, key, rawValue);
        if (options.requireRenderedBoxKeys?.includes(key) && containsPlaceholder(output, key)) {
          throw new Error("Account Number could not be rendered.");
        }
      } else {
        output = output.replace(placeholderPattern(key), "").replace(flexiblePlaceholderPattern(key), "");
      }
      if (rawValue && typeof rawValue === "string") replaced.push(key);
      continue;
    }
    const replacement = rawValue && typeof rawValue === "string"
      ? escapeXml(rawValue)
      : "";
    const before = output;
    output = output.replace(placeholderPattern(key), replacement);
    output = output.replace(flexiblePlaceholderPattern(key), replacement);
    if (before !== output && replacement) replaced.push(key);
  }
  if (options.blankUnanswered !== false) {
    output = output.replace(/\{\{[\s\S]*?\}\}/g, "");
    output = output.replace(/\[\[[\s\S]*?\]\]/g, "");
  }
  console.info("[BankHub Form Assistant] Replaced placeholders", replaced);
  return lockSinglePageWordLayout(populateSbiInlineFields(populateSbiInternetBankingStructure(output, answers), answers, imageParts));
}

function lockSinglePageWordLayout(xml: string) {
  return xml
    .replace(/<w:pageBreakBefore\b[^>]*\/>/g, "")
    .replace(/<w:br\b[^>]*w:type="page"[^>]*\/>/g, "")
    .replace(/<w:tbl(?:\s|>)[\s\S]*?<\/w:tbl>/g, (table) => enforceFixedTableLayout(table))
    .replace(/<w:trHeight\b[^>]*\/>/g, (height) => {
      const withoutRule = height.replace(/\s+w:hRule="[^"]*"/, "");
      return withoutRule.replace(/\/>$/, ' w:hRule="exact"/>');
    });
}

function enforceFixedTableLayout(tableXml: string) {
  if (/<w:tblLayout\b[^>]*\/>/.test(tableXml)) {
    return tableXml.replace(/<w:tblLayout\b[^>]*\/>/, '<w:tblLayout w:type="fixed"/>');
  }
  if (/<w:tblPr[\s\S]*?<\/w:tblPr>/.test(tableXml)) {
    return tableXml.replace("</w:tblPr>", '<w:tblLayout w:type="fixed"/></w:tblPr>');
  }
  return tableXml.replace(/<w:tbl(\s[^>]*)?>/, '<w:tbl$1><w:tblPr><w:tblLayout w:type="fixed"/></w:tblPr>');
}

function populateSbiInlineFields(xml: string, answers: DocxAnswers, imageParts: DocxImagePart[]) {
  let output = replaceBranchNameLine(xml, textValue(answers.branch_name));
  output = replaceEmailLine(output, textValue(answers.email_id));
  output = replaceSubmissionDate(output, textValue(answers.submission_date));

  const signaturePart = imageParts.find((part) => part.key === "customer_signature");
  if (signaturePart && !output.includes(`r:embed="${signaturePart.rid}"`)) {
    output = insertSignatureIntoExistingArea(output, signatureDrawingXml(signaturePart));
  } else {
    console.info("[BankHub Form Assistant] customer_signature =", signaturePart ? "uploaded" : "missing", {
      "Render Status": signaturePart ? "SUCCESS" : "FAILED",
      reason: signaturePart ? "Signature placeholder already rendered." : "No signature image uploaded.",
    });
  }

  return output;
}

function replaceBranchNameLine(xml: string, branchName: string) {
  if (!branchName) {
    console.info("[BankHub Form Assistant] branch_name =", "", { "Render Status": "FAILED", reason: "Branch name is empty." });
    return xml;
  }

  let replaced = false;
  const output = xml.replace(/<w:p(?:\s|>)[\s\S]*?<\/w:p>/g, (paragraph) => {
    if (replaced) return paragraph;
    const text = xmlText(paragraph).trim();
    if (!/^[.\u2026]{3,}$/.test(text)) return paragraph;
    const updated = replaceFirstTextRun(paragraph, branchName);
    replaced = updated !== paragraph;
    return updated;
  });

  console.info("[BankHub Form Assistant] branch_name =", branchName, { "Render Status": replaced ? "SUCCESS" : "FAILED" });
  return output;
}

function replaceEmailLine(xml: string, email: string) {
  if (!email) {
    console.info("[BankHub Form Assistant] email_id =", "", { "Render Status": "FAILED", reason: "Email value is empty." });
    return xml;
  }

  let replaced = false;
  const output = xml.replace(/<w:p(?:\s|>)[\s\S]*?<\/w:p>/g, (paragraph) => {
    if (replaced || !/E-?Mail\s*:/i.test(xmlText(paragraph))) return paragraph;
    const updated = replaceLastTextRun(paragraph, ` ${email}`);
    replaced = updated !== paragraph;
    return updated;
  });

  console.info("[BankHub Form Assistant] email_id =", email, { "Render Status": replaced ? "SUCCESS" : "FAILED" });
  return output;
}

function replaceSubmissionDate(xml: string, date: string) {
  if (!date) {
    console.info("[BankHub Form Assistant] submission_date =", "", { "Render Status": "FAILED", reason: "Date value is empty." });
    return xml;
  }

  let replaced = false;
  const output = xml.replace(/<w:p(?:\s|>)[\s\S]*?<\/w:p>/g, (paragraph) => {
    const text = xmlText(paragraph);
    if (replaced || !/Date\s*:/i.test(text) || !/Signature/i.test(text)) return paragraph;
    const updated = paragraph.replace(/<w:t(\s[^>]*)?>[\s\S]*?<\/w:t>/g, (run) => {
      const runText = xmlText(run);
      if (replaced || !/Date\s*:/i.test(runText)) return run;
      replaced = true;
      return `<w:t xml:space="preserve">${escapeXml(runText.replace(/Date\s*:.*$/i, `Date: ${date}`))}</w:t>`;
    });
    return updated;
  });

  console.info("[BankHub Form Assistant] submission_date =", date, { "Render Status": replaced ? "SUCCESS" : "FAILED" });
  return output;
}

function insertSignatureIntoExistingArea(xml: string, imageXml: string) {
  const paragraphs = Array.from(xml.matchAll(/<w:p(?:\s|>)[\s\S]*?<\/w:p>/g));
  const labelIndex = paragraphs.findIndex((match) => {
    const text = xmlText(match[0]);
    return /Customer/i.test(text) && /Signature/i.test(text);
  });

  if (labelIndex <= 0) {
    console.info("[BankHub Form Assistant] customer_signature = uploaded", {
      "Render Status": "FAILED",
      reason: "Signature label area was not found.",
    });
    return xml;
  }

  const target = paragraphs[labelIndex - 1][0];
  const updated = replaceParagraphContent(target, imageXml);
  if (updated === target) {
    console.info("[BankHub Form Assistant] customer_signature = uploaded", {
      "Render Status": "FAILED",
      reason: "Existing signature paragraph could not be updated.",
    });
    return xml;
  }

  console.info("[BankHub Form Assistant] customer_signature = uploaded", { "Render Status": "SUCCESS" });
  return xml.slice(0, paragraphs[labelIndex - 1].index) + updated + xml.slice((paragraphs[labelIndex - 1].index || 0) + target.length);
}

function replaceParagraphContent(paragraph: string, contentXml: string) {
  const pPr = paragraph.match(/<w:pPr[\s\S]*?<\/w:pPr>/)?.[0] || "";
  const open = paragraph.match(/^<w:p(?:\s[^>]*)?>/)?.[0];
  if (!open || !paragraph.endsWith("</w:p>")) return paragraph;
  return `${open}${pPr}${contentXml}</w:p>`;
}

function replaceLastTextRun(paragraph: string, value: string, runProperties = "") {
  const runs = Array.from(paragraph.matchAll(/<w:t(\s[^>]*)?>[\s\S]*?<\/w:t>/g));
  const target = [...runs].reverse().find((match) => /^\s*$/.test(xmlText(match[0])));
  if (!target) return paragraph;

  const containingRun = Array.from(paragraph.matchAll(/<w:r(?:\s|>)[\s\S]*?<\/w:r>/g)).find((match) => {
    const start = match.index || 0;
    const end = start + match[0].length;
    const targetIndex = target.index || 0;
    return targetIndex >= start && targetIndex < end;
  });
  if (containingRun?.index !== undefined) {
    const replacementRun = `<w:r>${runProperties || runPropertiesFromRun(containingRun[0])}<w:t xml:space="preserve">${escapeXml(value)}</w:t></w:r>`;
    return paragraph.slice(0, containingRun.index) + replacementRun + paragraph.slice(containingRun.index + containingRun[0].length);
  }

  const updatedRun = target[0].replace(/<w:t(\s[^>]*)?>[\s\S]*?<\/w:t>/, `<w:t xml:space="preserve">${escapeXml(value)}</w:t>`);
  return paragraph.slice(0, target.index) + updatedRun + paragraph.slice((target.index || 0) + target[0].length);
}

function replaceFirstTextRun(paragraph: string, value: string, runProperties = "") {
  const target = paragraph.match(/<w:t(\s[^>]*)?>[\s\S]*?<\/w:t>/);
  if (target?.index === undefined) return paragraph;
  const containingRun = Array.from(paragraph.matchAll(/<w:r(?:\s|>)[\s\S]*?<\/w:r>/g)).find((match) => {
    const start = match.index || 0;
    const end = start + match[0].length;
    return target.index! >= start && target.index! < end;
  });
  if (containingRun?.index !== undefined) {
    const replacementRun = `<w:r>${runProperties || runPropertiesFromRun(containingRun[0])}<w:t xml:space="preserve">${escapeXml(value)}</w:t></w:r>`;
    return paragraph.slice(0, containingRun.index) + replacementRun + paragraph.slice(containingRun.index + containingRun[0].length);
  }
  return paragraph.slice(0, target.index) + `<w:t xml:space="preserve">${escapeXml(value)}</w:t>` + paragraph.slice(target.index + target[0].length);
}

function runPropertiesFromRun(runXml: string) {
  return runXml.match(/<w:rPr[\s\S]*?<\/w:rPr>/)?.[0] || "";
}

function populateSbiInternetBankingStructure(xml: string, answers: DocxAnswers) {
  if (!answers.customer_name_boxes && !answers.mobile_number_boxes && !answers.account_number_1_boxes) return xml;

  let rowIndex = -1;
  return xml.replace(/<w:tr[\s\S]*?<\/w:tr>/g, (row) => {
    rowIndex += 1;
    if (rowIndex === 0) return fillRowCells(row, 0, nameBoxChars(textValue(answers.customer_name_boxes)), true);
    if (rowIndex === 1) return fillRowCells(row, 1, limitedDigitBoxChars(textValue(answers.mobile_number_boxes), 10), true);
    if (rowIndex === 2) return fillDobRow(row, answers);
    if (rowIndex >= 4 && rowIndex <= 10) {
      const accountRow = rowIndex - 3;
      const accountNumber = textValue(answers[`account_number_${accountRow}_boxes`]);
      const accountType = textValue(answers[`account_${accountRow}_single_joint`]);
      const transactionRights = textValue(answers[`account_${accountRow}_transaction_rights`]);
      const limitedTransactionRights = textValue(answers[`account_${accountRow}_limited_transaction_rights`]);
      if (!accountNumber && !accountType && !transactionRights && !limitedTransactionRights) return row;
      let nextRow = fillRowCells(row, 0, limitedDigitBoxChars(accountNumber, 13), true);
      nextRow = fillRowCells(nextRow, 13, [accountType, transactionRights, limitedTransactionRights], true);
      return nextRow;
    }
    return row;
  });
}

function fillRowCells(rowXml: string, startIndex: number, values: string[], center = false) {
  const cells = rowXml.match(/<w:tc(?:\s|>)[\s\S]*?<\/w:tc>/g);
  if (!cells?.length) return rowXml;
  let output = rowXml;
  values.forEach((value, offset) => {
    const cell = cells[startIndex + offset];
    if (!cell || !value) return;
    output = output.replace(cell, setCellText(cell, value, undefined, center));
  });
  return output;
}

function fillDobRow(rowXml: string, answers: DocxAnswers) {
  const dayDigits = digitBoxChars(textValue(answers.dob_dd_boxes)).slice(0, 2);
  const monthDigits = digitBoxChars(textValue(answers.dob_mm_boxes)).slice(0, 2);
  const yearDigits = digitBoxChars(textValue(answers.dob_yy_boxes)).slice(0, 2);
  const cells = rowXml.match(/<w:tc(?:\s|>)[\s\S]*?<\/w:tc>/g);

  if (cells && cells.length >= 6) {
    return fillRowCells(rowXml, 0, [...dayDigits, ...monthDigits, ...yearDigits], true);
  }

  return fillRowCells(rowXml, 0, [
    dobCellText(textValue(answers.dob_dd_boxes)),
    dobCellText(textValue(answers.dob_mm_boxes)),
    dobCellText(textValue(answers.dob_yy_boxes)),
  ], true);
}

function nameBoxChars(value: string) {
  return value.toUpperCase().replace(/\s+/g, " ").trim().split("").slice(0, 25).map((char) => char === " " ? "" : char);
}

function digitBoxChars(value: string) {
  return value.replace(/\D/g, "").split("");
}

function dobCellText(value: string) {
  const chars = digitBoxChars(value).slice(0, 2);
  if (chars.length <= 1) return chars[0] || "";
  return `${chars[0]}   ${chars[1]}`;
}

function limitedDigitBoxChars(value: string, limit: number) {
  return digitBoxChars(value).slice(0, limit);
}

function textValue(value: DocxAnswers[string]) {
  return typeof value === "string" ? value : "";
}

function ensureContentTypeDefaults(xml: string, imageParts: DocxImagePart[]) {
  let output = xml;
  const defaults = new Set(
    Array.from(output.matchAll(/<Default\s+Extension="([^"]+)"/g)).map((match) => match[1].toLowerCase()),
  );
  const needed = new Map<string, string>();
  for (const part of imageParts) {
    const extension = part.fileName.split(".").pop()?.toLowerCase();
    if (extension && !defaults.has(extension)) needed.set(extension, part.mimeType);
  }
  if (!needed.size) return output;
  const additions = Array.from(needed.entries())
    .map(([extension, mimeType]) => `<Default Extension="${extension}" ContentType="${mimeType}"/>`)
    .join("");
  output = output.replace("</Types>", `${additions}</Types>`);
  return output;
}

function ensureDocumentRelationships(xml: string | undefined, imageParts: DocxImagePart[]) {
  const base = xml || '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>';
  const additions = imageParts
    .filter((part) => !base.includes(`Id="${part.rid}"`))
    .map((part) => `<Relationship Id="${part.rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${part.fileName}"/>`)
    .join("");
  return additions ? base.replace("</Relationships>", `${additions}</Relationships>`) : base;
}

function collectImageParts(answers: DocxAnswers) {
  const imageParts: DocxImagePart[] = [];
  for (const [key, value] of Object.entries(answers)) {
    if (!isDocxImageValue(value)) continue;
    const parsed = parseImageDataUrl(value);
    const size = containImageSize(key, parsed.dimensions.width, parsed.dimensions.height);
    imageParts.push({
      key,
      rid: `rIdBankHub${imageParts.length + 1}`,
      fileName: `bankhub_${key}_${imageParts.length + 1}.${parsed.extension}`,
      data: parsed.data,
      mimeType: parsed.mimeType,
      ...size,
    });
  }
  return imageParts;
}

export async function loadDocxTemplate(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load local Word template.");
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (readU32(bytes, 0) !== 0x04034b50) {
    throw new Error("This file is not a DOCX template. Please convert old .doc files to .docx before adding placeholders.");
  }
  const entries = await readZip(bytes);
  console.info("[BankHub Form Assistant] Loaded template", { url, bytes: bytes.length, entries: entries.length });
  return { bytes, entries, placeholders: [], text: "" };
}

export async function buildFilledDocx(templateUrl: string, answers: DocxAnswers, options: BuildFilledDocxOptions = {}) {
  const { entries } = await loadDocxTemplate(templateUrl);
  const imageParts = collectImageParts(answers);
  const filled = entries.map((entry) => {
    if (!entry.data) throw new Error(`Unsupported DOCX entry compression for ${entry.name}`);
    if (/^word\/(document|header|footer).*\.xml$/.test(entry.name)) {
      return { name: entry.name, data: encoder.encode(replaceXmlPlaceholders(decodeXml(entry), answers, imageParts, options)) };
    }
    if (entry.name === "[Content_Types].xml") {
      return { name: entry.name, data: encoder.encode(ensureContentTypeDefaults(decodeXml(entry), imageParts)) };
    }
    if (entry.name === "word/_rels/document.xml.rels") {
      return { name: entry.name, data: encoder.encode(ensureDocumentRelationships(decodeXml(entry), imageParts)) };
    }
    return { name: entry.name, data: entry.data };
  });
  if (imageParts.length && !filled.some((entry) => entry.name === "word/_rels/document.xml.rels")) {
    filled.push({ name: "word/_rels/document.xml.rels", data: encoder.encode(ensureDocumentRelationships(undefined, imageParts)) });
  }
  for (const part of imageParts) {
    filled.push({ name: `word/media/${part.fileName}`, data: part.data });
  }
  const docx = new Blob([createStoredZip(filled)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  console.info("[BankHub Form Assistant] Generated DOCX size", { size: docx.size, images: imageParts.map((part) => part.key) });
  return docx;
}
