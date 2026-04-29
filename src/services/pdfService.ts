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

export async function exportAnalysisToPDF({
  elementId1,
  elementId2,
  serialNumber,
  onStart,
  onEnd,
  onError
}: ExportPdfOptions) {
  try {
    await onStart?.();
    
    // Extended wait for charts and fonts to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const capturePage = async (elementId: string) => {
      const element = document.getElementById(elementId);
      if (!element) return;

      // Ensure the element is "visible" to the capture engine even if invisible to user
      element.style.opacity = '1';
      element.style.visibility = 'visible';
      element.style.display = 'block';

      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        skipFonts: false,
        fontEmbedCSS: '', // We rely on pre-loaded fonts
        style: {
          visibility: 'visible',
          opacity: '1',
          display: 'block'
        }
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    };

    // Page 1
    await capturePage(elementId1);
    
    // Page 2
    pdf.addPage();
    await capturePage(elementId2);

    pdf.save(`SA-COMPASS-${serialNumber}.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
    onError?.(error);
  } finally {
    await onEnd?.();
  }
}
