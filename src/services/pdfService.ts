import jsPDF from 'jspdf';

export interface ExportPdfOptions {
  elementId1: string;
  elementId2: string;
  serialNumber: string;
  onStart?: () => Promise<void>;
  onEnd?: () => Promise<void>;
  onError?: (error: any) => void;
  // Direct data (bypasses html-to-image entirely)
  result?: any;
  studentInfo?: any;
  thesisInfo?: any;
  lang?: 'ar' | 'en';
}

const SDG_COLORS: Record<number, string> = {
  1:'#E5243B',2:'#DDA63A',3:'#4C9F38',4:'#C5192D',5:'#FF3A21',
  6:'#26BDE2',7:'#FCC30B',8:'#A21942',9:'#FD6925',10:'#DD1367',
  11:'#FD9D24',12:'#BF8B2E',13:'#3F7E44',14:'#0A97D9',15:'#56C02B',
  16:'#00689D',17:'#19486A'
};

function hexToRgb(hex: string): [number,number,number] {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

function buildPDF(
  result: any,
  studentInfo: any,
  thesisInfo: any,
  serialNumber: string,
  lang: 'ar' | 'en'
): jsPDF {
  const pdf = new jsPDF('p','mm','a4');
  const W = 210, H = 297;
  const isAr = lang === 'ar';

  // ── PAGE 1: COVER ────────────────────────────────────────────────────
  // Top bar
  pdf.setFillColor(27, 54, 93); // oued-blue
  pdf.rect(0, 0, W, 6, 'F');

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(27, 54, 93);
  const mainTitle = isAr ? 'تقرير تقييم الأثر المرجعي' : 'Sustainability Impact Assessment Report';
  pdf.text(mainTitle, W/2, 30, { align: 'center' });

  pdf.setFontSize(11);
  pdf.setTextColor(180, 150, 50);
  const subTitle = isAr ? 'نتائج تدقيق مواءمة مذكرات التخرج' : 'Thesis Alignment Audit Results';
  pdf.text(subTitle, W/2, 38, { align: 'center' });

  // Gold line
  pdf.setDrawColor(180, 150, 50);
  pdf.setLineWidth(0.8);
  pdf.line(W/2 - 20, 42, W/2 + 20, 42);

  // Serial + date
  pdf.setFontSize(8);
  pdf.setTextColor(150,150,150);
  pdf.setFont('helvetica','normal');
  pdf.text(serialNumber, W - 14, 14, { align: 'right' });
  pdf.text(new Date().toLocaleDateString(), W - 14, 19, { align: 'right' });

  // Score circle (drawn with arcs)
  const score = result.overallScore || 0;
  const cx = 52, cy = 85, r = 28;
  pdf.setDrawColor(240,244,248);
  pdf.setLineWidth(4);
  pdf.circle(cx, cy, r);
  const [br,bg,bb] = hexToRgb('#1b365d');
  pdf.setDrawColor(br,bg,bb);
  pdf.setLineWidth(4);
  // Draw arc for score (approximate with lines)
  const steps = 60;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (score / 100) * 2 * Math.PI;
  for (let i = 0; i < steps; i++) {
    const a1 = startAngle + (i / steps) * (endAngle - startAngle);
    const a2 = startAngle + ((i+1) / steps) * (endAngle - startAngle);
    if (a2 > endAngle) break;
    pdf.line(
      cx + r * Math.cos(a1), cy + r * Math.sin(a1),
      cx + r * Math.cos(a2), cy + r * Math.sin(a2)
    );
  }
  pdf.setFontSize(18);
  pdf.setFont('helvetica','bold');
  pdf.setTextColor(27,54,93);
  pdf.text(`${score}%`, cx, cy + 2, { align: 'center' });
  pdf.setFontSize(7);
  pdf.setTextColor(150,150,150);
  pdf.text(isAr ? 'مؤشر التوافق' : 'Compatibility', cx, cy + 8, { align: 'center' });

  // Student info box
  pdf.setFillColor(248,250,252);
  pdf.roundedRect(90, 50, W - 104, 70, 4, 4, 'F');
  pdf.setFont('helvetica','bold');
  pdf.setFontSize(8);
  pdf.setTextColor(100,116,139);
  pdf.text(isAr ? 'بيانات الطالب والمشروع' : 'STUDENT & PROJECT DATA', 96, 60);
  pdf.setLineWidth(0.3);
  pdf.setDrawColor(226,232,240);
  pdf.line(90, 63, W - 14, 63);

  const infoItems = [
    { label: isAr ? 'الاسم' : 'Name', value: studentInfo?.fullName || 'N/A' },
    { label: isAr ? 'الكلية' : 'Faculty', value: studentInfo?.faculty || 'N/A' },
    { label: isAr ? 'القسم' : 'Department', value: studentInfo?.department || 'N/A' },
    { label: isAr ? 'عنوان المذكرة' : 'Thesis Title', value: thesisInfo?.title || 'N/A' },
    { label: isAr ? 'المشرف' : 'Supervisor', value: thesisInfo?.supervisor || 'N/A' },
  ];
  infoItems.forEach((item, i) => {
    pdf.setFont('helvetica','bold');
    pdf.setFontSize(7);
    pdf.setTextColor(100,116,139);
    pdf.text(item.label + ':', 96, 70 + i * 9);
    pdf.setFont('helvetica','normal');
    pdf.setTextColor(30,41,59);
    const val = item.value.length > 40 ? item.value.slice(0,40) + '…' : item.value;
    pdf.text(val, 125, 70 + i * 9);
  });

  // SDG Goals achieved
  pdf.setFont('helvetica','bold');
  pdf.setFontSize(9);
  pdf.setTextColor(27,54,93);
  pdf.text(isAr ? 'الأهداف المستدامة المحققة' : 'Achieved SDGs', W/2, 132, { align: 'center' });

  const sdgs = (result.sdgs || []).filter((s: any) => (s.percentage || 0) > 0).slice(0, 17);
  const boxSize = 14;
  const totalWidth = sdgs.length * (boxSize + 3) - 3;
  const startX = (W - totalWidth) / 2;

  sdgs.forEach((sdg: any, i: number) => {
    const x = startX + i * (boxSize + 3);
    const [r2,g,b] = hexToRgb(SDG_COLORS[sdg.id] || '#64748b');
    pdf.setFillColor(r2,g,b);
    pdf.roundedRect(x, 136, boxSize, boxSize, 2, 2, 'F');
    pdf.setFont('helvetica','bold');
    pdf.setFontSize(7);
    pdf.setTextColor(255,255,255);
    pdf.text(String(sdg.id), x + boxSize/2, 136 + boxSize/2 + 1, { align: 'center' });
  });

  // Pillars bars
  const pillars = result.pillars || [];
  pdf.setFont('helvetica','bold');
  pdf.setFontSize(9);
  pdf.setTextColor(27,54,93);
  pdf.text(isAr ? 'نتائج المجالات' : 'Pillar Scores', 14, 163);

  pillars.forEach((p: any, i: number) => {
    const yy = 168 + i * 13;
    const pct = ((p.score || 0) / 5) * 100;
    pdf.setFont('helvetica','normal');
    pdf.setFontSize(7);
    pdf.setTextColor(71,85,105);
    pdf.text(p.name, 14, yy + 4);
    // Background bar
    pdf.setFillColor(241,245,249);
    pdf.roundedRect(65, yy, 110, 6, 1, 1, 'F');
    // Score bar
    const [r3,g3,b3] = hexToRgb('#1b365d');
    pdf.setFillColor(r3,g3,b3);
    pdf.roundedRect(65, yy, Math.max(2, 110 * pct / 100), 6, 1, 1, 'F');
    // Percent
    pdf.setFont('helvetica','bold');
    pdf.setFontSize(7);
    pdf.setTextColor(27,54,93);
    pdf.text(`${pct.toFixed(0)}%`, 178, yy + 4);
  });

  // Strengths
  const strY = 168 + pillars.length * 13 + 8;
  pdf.setFillColor(236,253,245);
  pdf.roundedRect(14, strY, 86, 45, 3, 3, 'F');
  pdf.setFont('helvetica','bold');
  pdf.setFontSize(8);
  pdf.setTextColor(5,150,105);
  pdf.text(isAr ? 'نقاط القوة' : 'Strengths', 20, strY + 8);
  pdf.setFont('helvetica','normal');
  pdf.setFontSize(7);
  pdf.setTextColor(51,65,85);
  (result.strengths || []).slice(0,3).forEach((s: string, i: number) => {
    const lines = pdf.splitTextToSize('• ' + s, 75);
    pdf.text(lines[0], 20, strY + 15 + i * 10);
  });

  // Opportunities
  pdf.setFillColor(255,251,235);
  pdf.roundedRect(110, strY, 86, 45, 3, 3, 'F');
  pdf.setFont('helvetica','bold');
  pdf.setFontSize(8);
  pdf.setTextColor(180,83,9);
  pdf.text(isAr ? 'توصيات' : 'Recommendations', 116, strY + 8);
  pdf.setFont('helvetica','normal');
  pdf.setFontSize(7);
  pdf.setTextColor(51,65,85);
  (result.opportunities || []).slice(0,3).forEach((o: string, i: number) => {
    const lines = pdf.splitTextToSize('• ' + o, 75);
    pdf.text(lines[0], 116, strY + 15 + i * 10);
  });

  // Footer page 1
  pdf.setFillColor(248,250,252);
  pdf.rect(0, H - 12, W, 12, 'F');
  pdf.setFont('helvetica','normal');
  pdf.setFontSize(7);
  pdf.setTextColor(148,163,184);
  pdf.text('University of El Oued — Sustainability Office', 14, H - 5);
  pdf.text('01 / 02', W/2, H - 5, { align: 'center' });
  pdf.text(new Date().toLocaleDateString(), W - 14, H - 5, { align: 'right' });

  // ── PAGE 2: SDG DETAILS ──────────────────────────────────────────────
  pdf.addPage();
  pdf.setFillColor(180, 150, 50);
  pdf.rect(0, 0, W, 6, 'F');

  pdf.setFont('helvetica','bold');
  pdf.setFontSize(16);
  pdf.setTextColor(27,54,93);
  pdf.text(isAr ? 'تفاصيل مؤشرات التنمية المستدامة' : 'SDG Alignment Details', W/2, 20, { align: 'center' });

  // SDG cards grid
  const allSdgs = (result.sdgs || []).slice(0, 17);
  const cols = 4;
  const cardW = 44, cardH = 28;
  const startXG = 14, startYG = 28;
  const gapX = (W - startXG*2 - cols * cardW) / (cols - 1);

  allSdgs.forEach((sdg: any, idx: number) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const cx2 = startXG + col * (cardW + gapX);
    const cy2 = startYG + row * (cardH + 4);
    const pct = sdg.percentage || 0;
    const [r4,g4,b4] = hexToRgb(SDG_COLORS[sdg.id] || '#64748b');

    // Card bg
    pdf.setFillColor(248,250,252);
    pdf.roundedRect(cx2, cy2, cardW, cardH, 3, 3, 'F');

    // Color accent left bar
    pdf.setFillColor(r4,g4,b4);
    pdf.roundedRect(cx2, cy2, 3, cardH, 1, 1, 'F');

    // SDG number badge
    pdf.setFillColor(r4,g4,b4);
    pdf.roundedRect(cx2 + 5, cy2 + 4, 10, 10, 2, 2, 'F');
    pdf.setFont('helvetica','bold');
    pdf.setFontSize(8);
    pdf.setTextColor(255,255,255);
    pdf.text(String(sdg.id), cx2 + 10, cy2 + 11, { align: 'center' });

    // SDG name
    pdf.setFont('helvetica','bold');
    pdf.setFontSize(6.5);
    pdf.setTextColor(30,41,59);
    const name = (isAr ? sdg.name : sdg.label) || '';
    const nameLines = pdf.splitTextToSize(name, cardW - 20);
    pdf.text(nameLines[0], cx2 + 17, cy2 + 9);
    if (nameLines[1]) pdf.text(nameLines[1], cx2 + 17, cy2 + 14);

    // Progress bar
    pdf.setFillColor(226,232,240);
    pdf.roundedRect(cx2 + 5, cy2 + 18, cardW - 10, 3, 1, 1, 'F');
    if (pct > 0) {
      pdf.setFillColor(r4,g4,b4);
      pdf.roundedRect(cx2 + 5, cy2 + 18, Math.max(2, (cardW - 10) * pct / 100), 3, 1, 1, 'F');
    }

    // Percentage
    pdf.setFont('helvetica','bold');
    pdf.setFontSize(7);
    pdf.setTextColor(r4,g4,b4);
    pdf.text(`${pct}%`, cx2 + cardW - 5, cy2 + 21, { align: 'right' });
  });

  // Summary box
  const sumY = startYG + Math.ceil(allSdgs.length / cols) * (cardH + 4) + 8;
  pdf.setFillColor(27,54,93);
  pdf.roundedRect(14, sumY, W - 28, 35, 4, 4, 'F');
  pdf.setFont('helvetica','bold');
  pdf.setFontSize(8);
  pdf.setTextColor(180,150,50);
  pdf.text(isAr ? 'الخلاصة التقييمية' : 'Assessment Summary', W/2, sumY + 9, { align: 'center' });
  pdf.setFont('helvetica','normal');
  pdf.setFontSize(8);
  pdf.setTextColor(255,255,255);
  const topPillar = (result.pillars || []).sort((a: any,b: any) => (b.score||0)-(a.score||0))[0]?.name || '';
  const summary = isAr
    ? `تم تحديد مواءمة قوية مع ركائز التنمية المستدامة. سجلت المذكرة نقاطاً عالية في ${topPillar}.`
    : `Strong alignment with sustainable development pillars identified. Top performance in ${topPillar}.`;
  const summaryLines = pdf.splitTextToSize(summary, W - 48);
  pdf.text(summaryLines, W/2, sumY + 18, { align: 'center' });

  // Footer page 2
  pdf.setFillColor(248,250,252);
  pdf.rect(0, H - 12, W, 12, 'F');
  pdf.setFont('helvetica','normal');
  pdf.setFontSize(7);
  pdf.setTextColor(148,163,184);
  pdf.text('University of El Oued — Sustainability Office', 14, H - 5);
  pdf.text('02 / 02', W/2, H - 5, { align: 'center' });
  pdf.text(serialNumber, W - 14, H - 5, { align: 'right' });

  return pdf;
}

function downloadPDF(pdf: jsPDF, filename: string) {
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  if (isMobile) {
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } else {
    pdf.save(filename);
  }
}

export async function exportAnalysisToPDF({
  serialNumber,
  onStart,
  onEnd,
  onError,
  result,
  studentInfo,
  thesisInfo,
  lang = 'ar',
}: ExportPdfOptions) {
  try {
    await onStart?.();
    await new Promise(resolve => setTimeout(resolve, 200));

    if (!result) throw new Error('No result data provided');

    const pdf = buildPDF(result, studentInfo || {}, thesisInfo || {}, serialNumber, lang);
    const filename = `SA-COMPASS-${serialNumber}.pdf`;
    downloadPDF(pdf, filename);

  } catch (error) {
    console.error('[PDF] Export failed:', error);
    onError?.(error);
  } finally {
    await onEnd?.();
  }
                    }
                                          
