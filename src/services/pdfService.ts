import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export interface ExportPdfOptions {
  elementId1: string;
  elementId2: string;
  serialNumber: string;
  onStart?: () => Promise<void>;
  onEnd?: () => Promise<void>;
  onError?: (error: any) => void;
}

/**
 * Captures a DOM element as PNG.
 * Works on mobile by cloning the element into a fixed-width off-screen container
 * that mimics a desktop viewport (794px = A4 at 96dpi).
 */
async function captureElement(elementId: string): Promise<string | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`[PDF] Element not found: #${elementId}`);
    return null;
  }

  const DESKTOP_WIDTH = 794; // A4 width at 96dpi

  // Off-screen wrapper — positioned far left so user never sees it
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position: fixed;
    top: 0;
    left: -${DESKTOP_WIDTH + 200}px;
    width: ${DESKTOP_WIDTH}px;
    background: white;
    z-index: 99999;
    overflow: visible;
    pointer-events: none;
  `;

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.cssText = `
    width: ${DESKTOP_WIDTH}px !important;
    max-width: ${DESKTOP_WIDTH}px !important;
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important;
    position: relative !important;
    transform: none !important;
    overflow: visible !important;
  `;

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // Wait for layout, fonts, and charts to render inside the clone
  await new Promise(resolve => setTimeout(resolve, 1500));

  let dataUrl: string | null = null;
  let lastError: any = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      dataUrl = await toPng(clone, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
        width: DESKTOP_WIDTH,
        style: { visibility: 'visible', opacity: '1', display: 'block' },
        filter: (node: HTMLElement) => node.tagName !== 'IFRAME',
      });
      if (dataUrl && dataUrl.length > 5000) break;
    } catch (err) {
      lastError = err;
      console.warn(`[PDF] Attempt ${attempt} failed for #${elementId}:`, err);
      await new Promise(resolve => setTimeout(resolve, 700));
    }
  }

  document.body.removeChild(wrapper);

  if (!dataUrl) {
    console.error(`[PDF] All attempts failed for #${elementId}`, lastError);
    return null;
  }

  return dataUrl;
}

export async function exportAnalysisToPDF({
  elementId1,
  elementId2,
  serialNumber,
  onStart,
  onEnd,
  onError,
}: ExportPdfOptions) {
  try {
    await onStart?.();
    await new Promise(resolve => setTimeout(resolve, 400));

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Page 1
    const img1 = await captureElement(elementId1);
    if (img1) {
      pdf.addImage(img1, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    } else {
      pdf.setFontSize(12);
      pdf.setTextColor(180, 180, 180);
      pdf.text('Page 1 could not be captured.', pdfWidth / 2, pdfHeight / 2, { align: 'center' });
    }

    // Page 2 (optional — skip if element not found)
    const img2 = await captureElement(elementId2);
    if (img2) {
      pdf.addPage();
      pdf.addImage(img2, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    pdf.save(`SA-COMPASS-${serialNumber}.pdf`);
  } catch (error) {
    console.error('[PDF] Export failed:', error);
    onError?.(error);
  } finally {
    await onEnd?.();
  }
}
