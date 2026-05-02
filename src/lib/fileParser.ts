import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// PDF.js worker setup
const PDF_JS_VERSION = '5.6.205';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDF_JS_VERSION}/build/pdf.worker.min.mjs`;

export async function detectFileType(file: File): Promise<string> {
  const buffer = await file.slice(0, 4).arrayBuffer();
  const header = new Uint8Array(buffer);
  
  // PDF: %PDF-
  if (header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46) {
    return 'application/pdf';
  }
  
  // DOCX (ZIP): PK..
  if (header[0] === 0x50 && header[1] === 0x4B && header[2] === 0x03 && header[3] === 0x04) {
    if (file.type.includes('wordprocessingml') || file.name.endsWith('.docx')) {
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
  }

  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return 'text/plain';
  }

  return file.type || 'unknown';
}

export interface ExtractedContent {
  text: string;
  sourceFile?: File;
  isImagePdf?: boolean;
}

export async function extractTextFromPDF(file: File): Promise<ExtractedContent> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    if (!fullText.trim()) {
      return { text: '', sourceFile: file, isImagePdf: true };
    }

    return { text: fullText, sourceFile: file, isImagePdf: false };
  } catch (error) {
    console.error('PDF extraction error:', error);
    return { text: '', sourceFile: file, isImagePdf: true };
  }
}

export async function extractTextFromDocx(file: File): Promise<ExtractedContent> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return { text: result.value, sourceFile: file };
  } catch (error) {
    throw new Error("Failed to extract text from Word document. Ensure it is a valid .docx file.");
  }
}

export async function extractTextFromFile(file: File): Promise<ExtractedContent> {
  const detectedType = await detectFileType(file);

  switch (detectedType) {
    case 'application/pdf':
      return extractTextFromPDF(file);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return extractTextFromDocx(file);
    case 'text/plain':
      return { text: await file.text(), sourceFile: file };
    default:
      throw new Error(`Unsupported file type: ${detectedType}`);
  }
}
