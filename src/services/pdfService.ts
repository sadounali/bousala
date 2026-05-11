import jsPDF from 'jspdf';

export interface ExportPdfOptions {
  elementId1?: string;
  elementId2?: string;
  serialNumber: string;
  onStart?: () => Promise<void>;
  onEnd?: () => Promise<void>;
  onError?: (error: any) => void;
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

const SDG_NAMES_AR: Record<number, string> = {
  1:'القضاء على الفقر', 2:'القضاء على الجوع', 3:'الصحة الجيدة',
  4:'التعليم الجيد', 5:'المساواة بين الجنسين', 6:'المياه النظيفة',
  7:'الطاقة النظيفة', 8:'العمل اللائق', 9:'الصناعة والابتكار',
  10:'الحد من التفاوت', 11:'المدن المستدامة', 12:'الإنتاج المسؤول',
  13:'المناخ', 14:'الحياة تحت الماء', 15:'الحياة البرية',
  16:'السلام والعدالة', 17:'الشراكات'
};

function buildHTML(result: any, studentInfo: any, thesisInfo: any, serialNumber: string, lang: 'ar' | 'en'): string {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const score = result?.overallScore || 0;
  const sdgs = (result?.sdgs || []).filter((s: any) => (s.percentage || 0) > 0);
  const pillars = result?.pillars || [];
  const strengths = result?.strengths || [];
  const opportunities = result?.opportunities || [];

  const sdgBoxes = sdgs.map((sdg: any) => `
    <div style="display:inline-block;width:36px;height:36px;border-radius:8px;background:${SDG_COLORS[sdg.id]||'#64748b'};
      color:white;font-weight:900;font-size:13px;line-height:36px;text-align:center;margin:3px;">
      ${sdg.id}
    </div>`).join('');

  const pillarBars = pillars.map((p: any) => {
    const pct = ((p.score || 0) / 5) * 100;
    return `
    <div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span style="font-size:12px;color:#475569;">${p.name}</span>
        <span style="font-size:12px;font-weight:700;color:#1b365d;">${pct.toFixed(0)}%</span>
      </div>
      <div style="background:#e2e8f0;border-radius:4px;height:8px;">
        <div style="background:#1b365d;width:${pct}%;height:8px;border-radius:4px;"></div>
      </div>
    </div>`;
  }).join('');

  const strengthItems = strengths.slice(0,3).map((s: string) =>
    `<div style="font-size:11px;margin-bottom:6px;color:#334155;">• ${s}</div>`).join('');

  const oppItems = opportunities.slice(0,3).map((o: string) =>
    `<div style="font-size:11px;margin-bottom:6px;color:#334155;">• ${o}</div>`).join('');

  // Page 2: all SDG cards
  const allSdgs17 = Array.from({length:17},(_,i)=>i+1).map(n => (result?.sdgs||[]).find((s:any)=>s.id===n)||{id:n,percentage:0,name:'',label:''});
  const allSdgCards = allSdgs17.map((sdg: any) => {
    const pct = sdg.percentage || 0;
    const name = isAr ? (SDG_NAMES_AR[sdg.id] || sdg.name) : (sdg.label || sdg.name);
    return `
    <div style="width:160px;border-radius:10px;background:#f8fafc;padding:10px;margin:5px;display:inline-block;vertical-align:top;box-sizing:border-box;border-right:4px solid ${SDG_COLORS[sdg.id]||'#64748b'};">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <div style="width:28px;height:28px;border-radius:6px;background:${SDG_COLORS[sdg.id]||'#64748b'};
          color:white;font-weight:900;font-size:12px;line-height:28px;text-align:center;flex-shrink:0;">${sdg.id}</div>
        <span style="font-size:10px;font-weight:700;color:#1e293b;line-height:1.3;">${name}</span>
      </div>
      <div style="background:#e2e8f0;border-radius:3px;height:6px;margin-bottom:4px;">
        <div style="background:${SDG_COLORS[sdg.id]||'#64748b'};width:${pct}%;height:6px;border-radius:3px;min-width:${pct>0?'4px':'0'};"></div>
      </div>
      <div style="font-size:11px;font-weight:700;color:${SDG_COLORS[sdg.id]||'#64748b'};text-align:${isAr?'left':'right'};">${pct}%</div>
    </div>`;
  }).join('');

  const topPillar = pillars.sort((a: any,b: any) => (b.score||0)-(a.score||0))[0]?.name || '';
  const summary = isAr
    ? `تم تحديد مواءمة قوية مع ركائز التنمية المستدامة. سجلت المذكرة نقاطاً عالية في ${topPillar}.`
    : `Strong alignment identified. Top performance in ${topPillar}.`;

  return `<!DOCTYPE html>
<html dir="${dir}">
<head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Cairo', Arial, sans-serif; background: white; color: #1e293b; }
  .page { width: 794px; min-height: 1123px; padding: 0; background: white; position: relative; page-break-after: always; }
</style>
</head>
<body>

<!-- PAGE 1 -->
<div class="page" id="pdf-html-page1">
  <!-- Top bar -->
  <div style="background:#1b365d;height:8px;width:100%;"></div>

  <!-- Header -->
  <div style="text-align:center;padding:24px 40px 16px;">
    <div style="font-size:24px;font-weight:900;color:#1b365d;">
      ${isAr ? 'تقرير تقييم الأثر المرجعي' : 'Sustainability Impact Assessment Report'}
    </div>
    <div style="font-size:13px;color:#b4963c;margin-top:6px;font-weight:700;">
      ${isAr ? 'نتائج تدقيق مواءمة مذكرات التخرج' : 'Thesis Alignment Audit Results'}
    </div>
    <div style="width:60px;height:3px;background:#b4963c;margin:10px auto;border-radius:2px;"></div>
  </div>

  <!-- Serial + Date -->
  <div style="position:absolute;top:20px;${isAr?'left':'right'}:30px;text-align:${isAr?'left':'right'};">
    <div style="font-size:9px;color:#94a3b8;">${serialNumber}</div>
    <div style="font-size:9px;color:#94a3b8;">${new Date().toLocaleDateString(isAr?'ar-DZ':'en-GB')}</div>
  </div>

  <!-- Score + Info -->
  <div style="display:flex;gap:20px;padding:0 40px 20px;align-items:flex-start;">
    <!-- Score Circle -->
    <div style="flex-shrink:0;width:140px;height:140px;border-radius:50%;background:white;
      border:8px solid #1b365d;display:flex;flex-direction:column;align-items:center;
      justify-content:center;box-shadow:0 4px 20px rgba(27,54,93,0.15);">
      <div style="font-size:32px;font-weight:900;color:#1b365d;">${score}%</div>
      <div style="font-size:10px;color:#94a3b8;font-weight:700;">${isAr?'مؤشر التوافق':'Compatibility'}</div>
    </div>

    <!-- Student Info -->
    <div style="flex:1;background:#f8fafc;border-radius:12px;padding:16px;border:1px solid #e2e8f0;">
      <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">
        ${isAr?'بيانات الطالب والمشروع':'STUDENT & PROJECT DATA'}
      </div>
      ${[
        [isAr?'الاسم':'Name', studentInfo?.fullName||'N/A'],
        [isAr?'الكلية':'Faculty', studentInfo?.faculty||'N/A'],
        [isAr?'القسم':'Department', studentInfo?.department||'N/A'],
        [isAr?'عنوان المذكرة':'Thesis Title', thesisInfo?.title||'N/A'],
        [isAr?'المشرف':'Supervisor', thesisInfo?.supervisor||'N/A'],
      ].map(([label, val]) => `
        <div style="display:flex;gap:8px;margin-bottom:7px;font-size:12px;">
          <span style="color:#64748b;font-weight:700;min-width:90px;flex-shrink:0;">${label}:</span>
          <span style="color:#1e293b;">${String(val).slice(0,50)}</span>
        </div>`).join('')}
    </div>
  </div>

  <!-- SDG Achieved -->
  <div style="padding:0 40px 16px;">
    <div style="font-size:13px;font-weight:700;color:#1b365d;margin-bottom:10px;text-align:center;">
      ${isAr?'الأهداف المستدامة المحققة':'Achieved SDGs'}
    </div>
    <div style="text-align:center;">${sdgBoxes}</div>
  </div>

  <!-- Pillars -->
  <div style="padding:0 40px 16px;">
    <div style="font-size:13px;font-weight:700;color:#1b365d;margin-bottom:12px;">
      ${isAr?'نتائج المجالات':'Pillar Scores'}
    </div>
    ${pillarBars}
  </div>

  <!-- Strengths + Opportunities -->
  <div style="display:flex;gap:16px;padding:0 40px 20px;">
    <div style="flex:1;background:#ecfdf5;border-radius:10px;padding:14px;">
      <div style="font-size:12px;font-weight:700;color:#059669;margin-bottom:8px;">
        ${isAr?'نقاط القوة':'Strengths'}
      </div>
      ${strengthItems}
    </div>
    <div style="flex:1;background:#fffbeb;border-radius:10px;padding:14px;">
      <div style="font-size:12px;font-weight:700;color:#b45309;margin-bottom:8px;">
        ${isAr?'التوصيات':'Recommendations'}
      </div>
      ${oppItems}
    </div>
  </div>

  <!-- Footer -->
  <div style="position:absolute;bottom:0;left:0;right:0;background:#f8fafc;padding:10px 40px;
    display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;border-top:1px solid #e2e8f0;">
    <span>University of El Oued — Sustainability Office</span>
    <span>01 / 02</span>
    <span>${new Date().toLocaleDateString()}</span>
  </div>
</div>

<!-- PAGE 2 -->
<div class="page" id="pdf-html-page2" style="padding-top:0;">
  <div style="background:#b4963c;height:8px;width:100%;"></div>
  <div style="padding:24px 40px 16px;text-align:center;">
    <div style="font-size:20px;font-weight:900;color:#1b365d;">
      ${isAr?'تفاصيل مؤشرات التنمية المستدامة':'SDG Alignment Details'}
    </div>
  </div>

  <div style="padding:0 30px;text-align:center;">
    ${allSdgCards}
  </div>

  <!-- Summary -->
  <div style="margin:20px 40px;background:#1b365d;border-radius:12px;padding:20px;text-align:center;">
    <div style="font-size:13px;font-weight:700;color:#b4963c;margin-bottom:8px;">
      ${isAr?'الخلاصة التقييمية':'Assessment Summary'}
    </div>
    <div style="font-size:12px;color:white;line-height:1.7;">${summary}</div>
  </div>

  <!-- Footer -->
  <div style="position:absolute;bottom:0;left:0;right:0;background:#f8fafc;padding:10px 40px;
    display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;border-top:1px solid #e2e8f0;">
    <span>University of El Oued — Sustainability Office</span>
    <span>02 / 02</span>
    <span>${serialNumber}</span>
  </div>
</div>

</body></html>`;
}

async function capturePage(html: string, pageId: string): Promise<string | null> {
  // Create hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:none;z-index:-1;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(html);
  doc.close();

  // Wait for fonts and layout
  await new Promise(resolve => setTimeout(resolve, 2500));

  const page = doc.getElementById(pageId);
  if (!page) { document.body.removeChild(iframe); return null; }

  try {
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(page, {
      quality: 1,
      pixelRatio: 2,
      width: 794,
      cacheBust: true,
    });
    document.body.removeChild(iframe);
    return dataUrl;
  } catch(e) {
    document.body.removeChild(iframe);
    console.error('[PDF] capture failed', e);
    return null;
  }
}

function downloadPDF(pdf: jsPDF, filename: string) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.target = '_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } else {
    pdf.save(filename);
  }
}

export async function exportAnalysisToPDF({
  serialNumber, onStart, onEnd, onError,
  result, studentInfo, thesisInfo, lang = 'ar',
}: ExportPdfOptions) {
  try {
    await onStart?.();
    await new Promise(r => setTimeout(r, 300));

    if (!result) throw new Error('No result data');

    const html = buildHTML(result, studentInfo||{}, thesisInfo||{}, serialNumber, lang);

    const pdf = new jsPDF('p','mm','a4');
    const W = pdf.internal.pageSize.getWidth();
    const H = pdf.internal.pageSize.getHeight();

    const img1 = await capturePage(html, 'pdf-html-page1');
    if (img1) pdf.addImage(img1,'PNG',0,0,W,H,undefined,'FAST');

    const img2 = await capturePage(html, 'pdf-html-page2');
    if (img2) { pdf.addPage(); pdf.addImage(img2,'PNG',0,0,W,H,undefined,'FAST'); }

    downloadPDF(pdf, `SA-COMPASS-${serialNumber}.pdf`);

  } catch(e) {
    console.error('[PDF]', e);
    onError?.(e);
  } finally {
    await onEnd?.();
  }
}
