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

async function captureElement(elementId: string): Promise<string | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`[PDF] Element not found: #${elementId}`);
    return null;
  }

  await new Promise(resolve => setTimeout(resolve, 800));

  let dataUrl: string | null = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: false,
        filter: (node: HTMLElement) => node.tagName !== 'IFRAME',
      });
      if (dataUrl && dataUrl.length > 5000) break;
    } catch (err) {
      console.warn(`[PDF] Attempt ${attempt} failed for #${elementId}:`, err);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  return dataUrl || null;
}

function downloadPDF(pdf: jsPDF, filename: string) {
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  if (isMobile) {
    // On mobile: open PDF in new tab so user can download/share from browser
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);

    // Try opening in new tab
    const newTab = window.open(url, '_blank');

    if (!newTab) {
      // If popup blocked, create a temporary link and click it
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Revoke after delay to allow download
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } else {
    // Desktop: use normal save
    pdf.save(filename);
  }
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
    const W = pdf.internal.pageSize.getWidth();
    const H = pdf.internal.pageSize.getHeight();

    const img1 = await captureElement(elementId1);
    if (img1) {
      pdf.addImage(img1, 'PNG', 0, 0, W, H, undefined, 'FAST');
    } else {
      pdf.setFontSize(12);
      pdf.setTextColor(180, 180, 180);
      pdf.text('Page 1 could not be captured.', W / 2, H / 2, { align: 'center' });
    }

    const img2 = await captureElement(elementId2);
    if (img2) {
      pdf.addPage();
      pdf.addImage(img2, 'PNG', 0, 0, W, H, undefined, 'FAST');
    }

    const filename = `SA-COMPASS-${serialNumber}.pdf`;
    downloadPDF(pdf, filename);

  } catch (error) {
    console.error('[PDF] Export failed:', error);
    onError?.(error);
  } finally {
    await onEnd?.();
  }
}
