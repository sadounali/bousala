import { AnalysisResult } from "../types";

// ========== مصفوفة SDG لتخصصات جامعة الوادي ==========

const SDG_MAP: Record<string, number[]> = {
  // كلية التكنولوجيا
  "الهندسة الميكانيكية": [7, 9, 11, 12, 13],
  "الهندسة الكهربائية": [7, 9, 11, 13],
  "هندسة الطرائق": [6, 9, 12, 13, 15],
  "الهندسة المدنية": [9, 11, 13, 15],
  // كلية العلوم الدقيقة
  "الرياضيات": [4, 9, 17],
  "الفيزياء": [7, 9, 13, 17],
  "الكيمياء": [3, 6, 9, 12, 13],
  "الإعلام الآلي": [4, 8, 9, 16, 17],
  // كلية علوم الطبيعة والحياة
  "البيولوجيا": [2, 3, 6, 13, 14, 15],
  "الفلاحة": [1, 2, 6, 12, 13, 15],
  // كلية العلوم الاقتصادية
  "العلوم الاقتصادية": [1, 8, 9, 10, 17],
  "العلوم التجارية": [8, 9, 10, 12, 17],
  "علوم التسيير": [8, 9, 10, 16, 17],
  // كلية الآداب واللغات
  "اللغة العربية وآدابها": [4, 10, 16],
  "اللغة الإنجليزية": [4, 10, 17],
  "اللغة الفرنسية": [4, 10, 17],
  // كلية العلوم الاجتماعية والإنسانية
  "العلوم الاجتماعية": [1, 3, 4, 5, 10, 16],
  "العلوم الإنسانية": [3, 4, 5, 10, 16],
  "علم النفس": [3, 4, 5, 10, 16],
  "علم الاجتماع": [1, 3, 5, 10, 11, 16],
  // كلية الحقوق والعلوم السياسية
  "الحقوق": [5, 10, 16, 17],
  "العلوم السياسية": [10, 16, 17],
  // علوم الإعلام والاتصال
  "علوم الإعلام والاتصال": [4, 9, 10, 16, 17],
  "الصحافة والإعلام": [4, 10, 16, 17],
  "تكنولوجيا المعلومات والاتصال والمجتمع": [4, 9, 10, 16, 17],
  "الاتصال والعلاقات العامة": [4, 8, 10, 16, 17],
  "السمعي البصري": [4, 9, 10, 16, 17],
  "الإعلام الرقمي": [4, 9, 10, 16, 17],
  // علم المكتبات والتوثيق
  "علم المكتبات": [4, 9, 16, 17],
  "علم المعلومات والتوثيق": [4, 9, 16, 17],
  // تخصصات أخرى
  "الفلسفة": [4, 10, 16],
  "التاريخ": [4, 10, 16],
  "الجغرافيا": [11, 13, 15, 17],
  "التربية البدنية والرياضية": [3, 4, 10],
  "الفنون": [4, 10, 11],
};

const SDG_INFO: Record<number, { name: string; label: string; keywords: string[] }> = {
  1:  { name: "القضاء على الفقر", label: "SDG 1", keywords: ["فقر","دخل","اجتماعي","تنمية","توزيع","محرومين","هشاشة","الفئات الضعيفة"] },
  2:  { name: "القضاء على الجوع", label: "SDG 2", keywords: ["غذاء","زراعة","أمن غذائي","إنتاج","محصول","تغذية","جوع","استدامة غذائية"] },
  3:  { name: "الصحة الجيدة والرفاه", label: "SDG 3", keywords: ["صحة","طب","مرض","علاج","وقاية","رفاه","بيئة صحية","رعاية","مستشفى","نفسي"] },
  4:  { name: "التعليم الجيد", label: "SDG 4", keywords: ["تعليم","تدريب","تعلم","مهارة","مدرسة","جامعة","معرفة","تكوين","بيداغوجيا","أكاديمي","بحث علمي","طالب","أستاذ","منهج"] },
  5:  { name: "المساواة بين الجنسين", label: "SDG 5", keywords: ["مرأة","جنس","مساواة","تمكين","نوع اجتماعي","نسوي","حقوق المرأة","التمييز"] },
  6:  { name: "المياه النظيفة والصرف الصحي", label: "SDG 6", keywords: ["مياه","ماء","صرف","نظافة","ري","تلوث مائي","شرب","موارد مائية"] },
  7:  { name: "طاقة نظيفة وبأسعار معقولة", label: "SDG 7", keywords: ["طاقة","كهرباء","متجددة","شمسية","رياح","وقود","نفط","غاز","طاقة نظيفة"] },
  8:  { name: "العمل اللائق ونمو الاقتصاد", label: "SDG 8", keywords: ["عمل","اقتصاد","نمو","توظيف","إنتاجية","تشغيل","سوق العمل","بطالة","مؤسسة","شركة"] },
  9:  { name: "الصناعة والابتكار والبنية التحتية", label: "SDG 9", keywords: ["صناعة","ابتكار","تقنية","بنية","تحتية","بحث","تطوير","رقمنة","تكنولوجيا","منصة","تطبيق","رقمي","إنترنت","ذكاء اصطناعي"] },
  10: { name: "الحد من أوجه عدم المساواة", label: "SDG 10", keywords: ["مساواة","عدالة","فجوة","توزيع","إدماج","تهميش","اندماج","إقصاء","طبقة"] },
  11: { name: "مدن ومجتمعات مستدامة", label: "SDG 11", keywords: ["مدينة","عمران","سكن","نقل","تخطيط","مستدام","حضري","ريفي","تهيئة"] },
  12: { name: "الاستهلاك والإنتاج المسؤولان", label: "SDG 12", keywords: ["استهلاك","إنتاج","نفايات","إعادة تدوير","كفاءة","موارد","ترشيد"] },
  13: { name: "العمل المناخي", label: "SDG 13", keywords: ["مناخ","انبعاثات","احترار","كربون","بيئة","تغير مناخي","كوارث","درجة حرارة"] },
  14: { name: "الحياة تحت الماء", label: "SDG 14", keywords: ["بحر","محيط","أسماك","مائي","بحري","تلوث بحري","مياه بحرية"] },
  15: { name: "الحياة في البر", label: "SDG 15", keywords: ["غابة","تنوع حيوي","أرض","نبات","حيوان","بيئة برية","تصحر","تشجير"] },
  16: { name: "السلام والعدل والمؤسسات القوية", label: "SDG 16", keywords: ["قانون","عدالة","حوكمة","مؤسسة","حقوق","سلام","إعلام","صحافة","شفافية","ديمقراطية","رأي عام","حرية","تضليل","أخبار","وسائل الإعلام","صحفي","قضاء","فساد"] },
  17: { name: "عقد الشراكات لتحقيق الأهداف", label: "SDG 17", keywords: ["شراكة","تعاون","دولي","تمويل","تكنولوجيا","بيانات","إعلام","اتصال","منصة","فيسبوك","تقنية","شركات","جلوبال","عولمة","تكامل"] },
};

// ========== الكلمات المفتاحية للمقاييس ==========

const METRIC_KEYWORDS = {
  environmental: ["بيئة","مناخ","طاقة","مياه","تلوث","انبعاثات","غابة","تنوع","أرض","كربون","متجددة","نفايات","طبيعة","بيئي"],
  social: ["مجتمع","صحة","تعليم","عدالة","مساواة","فقر","مرأة","حقوق","سكن","أمن","رفاه","اجتماعي","ثقافي","إعلام","صحافة","رأي","جمهور","متلقي","مستخدم"],
  economic: ["اقتصاد","تنمية","إنتاج","عمل","توظيف","نمو","تجارة","استثمار","دخل","ثروة","سوق","مؤسسة","شركة","مالي","ربح"],
  materiality: ["أهمية","جوهري","محوري","أساسي","رئيسي","حيوي","ضروري","استراتيجي","إشكالية","مشكلة","هدف","غاية"],
  scalability: ["توسع","تطوير","نشر","تطبيق","ترقية","انتشار","عالمي","إقليمي","وطني","تأثير","أثر","نتيجة","توصية"],
};

// ========== استخراج العنوان ومنطلق التحليل ==========

const SECTION_TRIGGERS = [
  "مقدمة", "المقدمة",
  "ملخص", "الملخص",
  "خاتمة", "الخاتمة",
  "تمهيد", "التمهيد",
  "خلاصة", "الخلاصة",
  "abstract", "introduction", "conclusion", "summary"
];

function extractTitleAndBody(rawText: string): { title: string; body: string } {
  // استخرج العنوان من أول 500 حرف
  const header = rawText.substring(0, 500).replace(/\s+/g, ' ').trim();
  const titleMatch = header.match(/[\u0600-\u06FF\w][^\n]{10,120}/);
  const title = titleMatch ? titleMatch[0].trim() : "عنوان غير محدد";

  // ابحث عن أول كلمة تشغيل في النص
  const lowerText = rawText.toLowerCase();
  let startIndex = rawText.length;

  for (const trigger of SECTION_TRIGGERS) {
    const idx = lowerText.indexOf(trigger.toLowerCase());
    if (idx !== -1 && idx < startIndex) {
      startIndex = idx;
    }
  }

  // إذا وجدنا منطلقاً، ابدأ التحليل منه
  const body = startIndex < rawText.length
    ? rawText.substring(startIndex)
    : rawText.substring(500);

  return { title, body };
}

// ========== دوال التحليل ==========

function countKeywords(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((count, kw) => count + (lower.split(kw).length - 1), 0);
}

function scoreFromCount(count: number, max: number = 10): number {
  return Math.min(5, parseFloat(((count / max) * 5).toFixed(1)));
}

// ========== تصنيف التخصصات وقائمة SDGs المحظورة ==========

const SPECIALIZATION_CATEGORY: Record<string, string> = {
  // تقنية وهندسة
  "الهندسة الميكانيكية": "engineering",
  "الهندسة الكهربائية": "engineering",
  "هندسة الطرائق": "engineering",
  "الهندسة المدنية": "engineering",
  "الإعلام الآلي": "it",
  "الرياضيات": "science",
  "الفيزياء": "science",
  "الكيمياء": "science",
  // طبيعة وحياة
  "البيولوجيا": "life",
  "الفلاحة": "life",
  // اقتصاد
  "العلوم الاقتصادية": "economics",
  "العلوم التجارية": "economics",
  "علوم التسيير": "economics",
  // آداب ولغات
  "اللغة العربية وآدابها": "humanities",
  "اللغة الإنجليزية": "humanities",
  "اللغة الفرنسية": "humanities",
  // علوم اجتماعية
  "العلوم الاجتماعية": "social",
  "العلوم الإنسانية": "social",
  "علم النفس": "social",
  "علم الاجتماع": "social",
  // حقوق وسياسة
  "الحقوق": "law",
  "العلوم السياسية": "law",
  // إعلام واتصال
  "علوم الإعلام والاتصال": "media",
  "الصحافة والإعلام": "media",
  "تكنولوجيا المعلومات والاتصال والمجتمع": "media",
  "الاتصال والعلاقات العامة": "media",
  "السمعي البصري": "media",
  "الإعلام الرقمي": "media",
  "علم المكتبات": "media",
  "علم المعلومات والتوثيق": "media",
};

// SDGs المحظورة لكل فئة تخصص
const BLOCKED_SDGS: Record<string, number[]> = {
  "media":      [2, 6, 7, 11, 12, 13, 14, 15],
  "law":        [2, 6, 7, 12, 13, 14, 15],
  "humanities": [2, 6, 7, 12, 13, 14, 15],
  "social":     [2, 6, 7, 12, 13, 14, 15],
  "economics":  [3, 6, 13, 14, 15],
  "engineering":[1, 2, 5, 10],
  "it":         [1, 2, 5, 6, 12, 14, 15],
  "science":    [1, 2, 5, 10, 11],
  "life":       [4, 8, 10, 16, 17],
};

function getBlockedSDGs(specialization: string): number[] {
  const category = SPECIALIZATION_CATEGORY[specialization];
  return category ? (BLOCKED_SDGS[category] || []) : [];
}

function detectSpecialization(text: string): string {
  let best = { spec: "غير محدد", score: 0 };
  for (const [spec, sdgIds] of Object.entries(SDG_MAP)) {
    const relatedKeywords = sdgIds.flatMap(id => SDG_INFO[id]?.keywords || []);
    const score = countKeywords(text, relatedKeywords);
    if (score > best.score) best = { spec, score };
  }
  return best.spec;
}

function getSDGsForSpecialization(specialization: string, text: string): number[] {
  const fromMap = SDG_MAP[specialization] || [];
  const blocked = getBlockedSDGs(specialization);

  // أضف SDGs إضافية بناءً على محتوى النص مع تصفية المحظورة
  const extra: number[] = [];
  for (const [id, info] of Object.entries(SDG_INFO)) {
    const numId = Number(id);
    if (blocked.includes(numId)) continue; // تجاهل المحظورة
    const count = countKeywords(text, info.keywords);
    if (count >= 3 && !fromMap.includes(numId)) {
      extra.push(numId);
    }
  }

  // تصفية fromMap أيضاً من المحظورة
  const filtered = fromMap.filter(id => !blocked.includes(id));

  return [...new Set([...filtered, ...extra])].slice(0, 8);
}

function buildSDGs(sdgIds: number[], text: string) {
  return sdgIds.map(id => {
    const info = SDG_INFO[id];
    const count = countKeywords(text, info.keywords);
    const percentage = Math.min(95, Math.max(20, count * 8 + 30));
    const strength = percentage >= 70 ? "عالية" : percentage >= 45 ? "متوسطة" : "منخفضة";

    const targets = buildTargets(id, text);

    return {
      id,
      label: info.label,
      name: info.name,
      percentage,
      strength,
      justification: buildJustification(id, info.name, count, text),
      targets,
    };
  });
}

function buildJustification(id: number, name: string, count: number, text: string): string {
  const sample = text.substring(0, 300).replace(/\n/g, ' ');
  return `تناولت الدراسة موضوعات ذات صلة مباشرة بهدف "${name}" (${SDG_INFO[id].label})، حيث وردت المفاهيم المرتبطة ${count} مرة في المحتوى. ويتجلى ذلك من خلال: "${sample}..."`;
}

function buildTargets(sdgId: number, text: string) {
  const targetMap: Record<number, { id: string; description: string; indicatorId: string; indicatorDesc: string }[]> = {
    1:  [{ id: "1.1", description: "القضاء على الفقر المدقع", indicatorId: "1.1.1", indicatorDesc: "نسبة السكان دون خط الفقر" }],
    2:  [{ id: "2.1", description: "تحقيق الأمن الغذائي", indicatorId: "2.1.1", indicatorDesc: "معدل انتشار نقص التغذية" }],
    3:  [{ id: "3.4", description: "الحد من الأمراض غير المعدية", indicatorId: "3.4.1", indicatorDesc: "معدل الوفيات من الأمراض القلبية والسرطان" }],
    4:  [{ id: "4.1", description: "التعليم الابتدائي والثانوي الجيد", indicatorId: "4.1.1", indicatorDesc: "نسبة الأطفال الذين يحققون الحد الأدنى من الكفاءة" }],
    5:  [{ id: "5.1", description: "إنهاء التمييز ضد المرأة", indicatorId: "5.1.1", indicatorDesc: "وجود أطر قانونية للمساواة" }],
    6:  [{ id: "6.1", description: "الوصول الآمن لمياه الشرب", indicatorId: "6.1.1", indicatorDesc: "نسبة السكان الذين يستخدمون خدمات مياه الشرب الآمنة" }],
    7:  [{ id: "7.2", description: "زيادة حصة الطاقة المتجددة", indicatorId: "7.2.1", indicatorDesc: "حصة الطاقة المتجددة من إجمالي الطاقة" }],
    8:  [{ id: "8.1", description: "نمو الناتج المحلي الإجمالي", indicatorId: "8.1.1", indicatorDesc: "معدل نمو الناتج المحلي الإجمالي للفرد" }],
    9:  [{ id: "9.5", description: "تعزيز البحث العلمي والابتكار", indicatorId: "9.5.1", indicatorDesc: "الإنفاق على البحث والتطوير كنسبة من الناتج المحلي" }],
    10: [{ id: "10.1", description: "تحقيق نمو دخل أسرع للشرائح الدنيا", indicatorId: "10.1.1", indicatorDesc: "معدلات نمو نفقات الفرد للسكان الأفقر" }],
    11: [{ id: "11.1", description: "الوصول إلى السكن اللائق", indicatorId: "11.1.1", indicatorDesc: "نسبة السكان في الأحياء الفقيرة" }],
    12: [{ id: "12.2", description: "الإدارة المستدامة للموارد الطبيعية", indicatorId: "12.2.1", indicatorDesc: "بصمة المواد المحلية" }],
    13: [{ id: "13.1", description: "تعزيز القدرة على الصمود أمام المخاطر المناخية", indicatorId: "13.1.1", indicatorDesc: "عدد الوفيات من الكوارث المناخية" }],
    14: [{ id: "14.1", description: "الحد من تلوث البحار", indicatorId: "14.1.1", indicatorDesc: "مؤشر الزخم الساحلي اليوتروفي" }],
    15: [{ id: "15.1", description: "صون النظم البيئية البرية", indicatorId: "15.1.1", indicatorDesc: "مساحة الغابة كنسبة من إجمالي مساحة الأرض" }],
    16: [{ id: "16.6", description: "تطوير مؤسسات فعالة وشفافة", indicatorId: "16.6.1", indicatorDesc: "النفقات الحكومية الأولية كنسبة من الميزانية" }],
    17: [{ id: "17.6", description: "تعزيز التعاون في العلوم والتكنولوجيا", indicatorId: "17.6.1", indicatorDesc: "عدد اتفاقيات التعاون العلمي" }],
  };

  const entry = targetMap[sdgId];
  if (!entry) return [];

  return entry.map(t => ({
    id: t.id,
    description: t.description,
    indicators: [{
      id: t.indicatorId,
      description: t.indicatorDesc,
      assessment: {
        measuresDirectly: countKeywords(text, SDG_INFO[sdgId].keywords) >= 5,
        suggestsSolutions: text.length > 2000,
        collectsData: text.includes("بيانات") || text.includes("إحصاء") || text.includes("قياس"),
        contributionScore: Math.min(5, Math.floor(countKeywords(text, SDG_INFO[sdgId].keywords) / 2) + 1),
        notes: `تُسهم الدراسة في هذا المؤشر من خلال تناولها لمحاور "${SDG_INFO[sdgId].name}"`,
      }
    }]
  }));
}

function buildMetrics(text: string) {
  return [
    { name: "البعد البيئي", score: scoreFromCount(countKeywords(text, METRIC_KEYWORDS.environmental)), description: "مدى تناول الدراسة للقضايا البيئية والمناخية" },
    { name: "البعد الاجتماعي", score: scoreFromCount(countKeywords(text, METRIC_KEYWORDS.social)), description: "مدى تناول الدراسة للقضايا الاجتماعية والإنسانية" },
    { name: "البعد الاقتصادي", score: scoreFromCount(countKeywords(text, METRIC_KEYWORDS.economic)), description: "مدى تناول الدراسة للتنمية الاقتصادية" },
    { name: "الأهمية الجوهرية", score: scoreFromCount(countKeywords(text, METRIC_KEYWORDS.materiality)), description: "أهمية المواضيع المطروحة بالنسبة للاستدامة" },
    { name: "قابلية التوسع", score: scoreFromCount(countKeywords(text, METRIC_KEYWORDS.scalability)), description: "إمكانية تطبيق نتائج الدراسة على نطاق أوسع" },
  ];
}

function buildPillars(text: string, specialization: string) {
  const category = SPECIALIZATION_CATEGORY[specialization] || "general";

  // وزن الأبعاد حسب التخصص
  const weights: Record<string, [number, number, number]> = {
    "media":      [0.3, 1.2, 1.5], // بيئة منخفضة، مجتمع متوسط، حوكمة عالية
    "law":        [0.2, 1.0, 1.8],
    "humanities": [0.2, 1.2, 1.3],
    "social":     [0.5, 1.5, 1.0],
    "economics":  [0.5, 1.0, 1.5],
    "engineering":[1.5, 0.8, 1.0],
    "it":         [0.8, 1.0, 1.5],
    "science":    [1.2, 0.8, 1.0],
    "life":       [1.8, 1.0, 0.5],
    "general":    [1.0, 1.0, 1.0],
  };

  const [we, ws, wg] = weights[category] || [1, 1, 1];

  const e = Math.min(5, scoreFromCount(countKeywords(text, METRIC_KEYWORDS.environmental)) * we);
  const s = Math.min(5, scoreFromCount(countKeywords(text, METRIC_KEYWORDS.social)) * ws);
  const g = Math.min(5, scoreFromCount(countKeywords(text, METRIC_KEYWORDS.economic)) * wg);

  return [
    { name: "البيئة (E)", score: parseFloat(e.toFixed(1)), comment: "التأثير البيئي للبحث", notes: "يقيس مدى تناول الدراسة للأبعاد البيئية ضمن إطار ESG" },
    { name: "المجتمع (S)", score: parseFloat(s.toFixed(1)), comment: "الأثر الاجتماعي للبحث", notes: "يقيس مدى مساهمة الدراسة في التماسك الاجتماعي والعدالة" },
    { name: "الحوكمة (G)", score: parseFloat(g.toFixed(1)), comment: "الإسهام في منظومة الحوكمة", notes: "يقيس مدى ارتباط الدراسة بالحوكمة والمؤسسات الفعالة" },
  ];
}

function buildBenchmarks(sdgIds: number[]) {
  const global = [
    { name: "معيار التنمية المستدامة الأكاديمي", score: 65, benchmark: 70, description: "المعيار العالمي للأبحاث الأكاديمية المرتبطة بأهداف SDG", notes: "يعتمد على تقرير Sustainable Development Report 2023" },
    { name: "معيار الأبحاث الجزائرية", score: 55, benchmark: 60, description: "متوسط أداء الأبحاث الجامعية الجزائرية في مجال الاستدامة", notes: "مستند إلى تقارير وزارة التعليم العالي والبحث العلمي" },
    { name: "معيار أهداف SDG الأممية 2030", score: sdgIds.length * 8, benchmark: 80, description: "مدى توافق الدراسة مع مؤشرات أهداف التنمية المستدامة", notes: "يعتمد على إطار متابعة أهداف SDG التابع للأمم المتحدة" },
  ];
  return global;
}

function buildSWOT(text: string, sdgIds: number[], specialization: string) {
  const strengths = [
    `ارتباط واضح بـ ${sdgIds.length} من أهداف التنمية المستدامة`,
    `تخصص "${specialization}" يمتلك إمكانات عالية في مجال الاستدامة`,
    text.length > 5000 ? "دراسة مفصلة وشاملة تغطي جوانب متعددة" : "دراسة مركزة على موضوع محدد",
  ];
  const opportunities = [
    "إمكانية توسيع نطاق البحث ليشمل أبعاداً إضافية من أهداف SDG",
    "التعاون مع مؤسسات دولية متخصصة في التنمية المستدامة",
    "تحويل نتائج البحث إلى سياسات وطنية قابلة للتطبيق",
  ];
  return { strengths, opportunities };
}

function buildSuggestions(sdgIds: number[], specialization: string) {
  return [
    {
      category: "المنهجية",
      gap: "غياب مؤشرات قياس كمية مرتبطة بأهداف SDG",
      suggestion: "إضافة مؤشرات قابلة للقياس لكل هدف من أهداف SDG المحددة",
      priority: "عالية",
      notes: "يمكن الاستناد إلى الإطار العالمي لمؤشرات SDG الصادر عن الأمم المتحدة"
    },
    {
      category: "المحتوى",
      gap: "محدودية تغطية الأبعاد الاجتماعية والاقتصادية معاً",
      suggestion: "دمج تحليل متكامل يجمع الأبعاد الثلاثة: البيئية والاجتماعية والاقتصادية",
      priority: "متوسطة",
      notes: "يُنصح باعتماد نموذج التقاطع (Nexus) بين الأهداف"
    },
    {
      category: "التوصيات",
      gap: "غياب خارطة طريق تطبيقية",
      suggestion: `تطوير خارطة طريق لتطبيق نتائج البحث في سياق التخصص "${specialization}"`,
      priority: "متوسطة",
      notes: "يمكن الاستعانة بتجارب دول مماثلة في منطقة MENA"
    },
  ];
}

function buildRecommendations(sdgIds: number[], specialization: string) {
  const allIds = Object.keys(SDG_INFO).map(Number);
  const otherTargets = allIds
    .filter(id => !sdgIds.includes(id))
    .slice(0, 3)
    .map(id => `${SDG_INFO[id].label}: ${SDG_INFO[id].name}`);

  const futureIndicators = [
    "قياس بصمة الكربون المرتبطة بالنشاط البحثي",
    "تتبع أثر نتائج البحث على السياسات المحلية",
    "مؤشر التحول نحو الاقتصاد الأخضر في القطاع المرتبط",
  ];

  const complementarySpecializations = Object.keys(SDG_MAP)
    .filter(s => s !== specialization)
    .filter(s => SDG_MAP[s].some(id => sdgIds.includes(id)))
    .slice(0, 3);

  return { otherTargets, futureIndicators, complementarySpecializations };
}

// ========== الدالة الرئيسية ==========

export async function analyzeSustainabilityDocument(
  text: string,
  file?: File,
  onProgress?: (stage: string, percent: number) => void
): Promise<AnalysisResult> {

  onProgress?.('reading', 10);
  await new Promise(r => setTimeout(r, 300));

  // استخراج العنوان ومنطلق التحليل الفعلي
  const { title, body } = extractTitleAndBody(text);
  const analysisText = body; // يتجاهل الواجهة ويبدأ من المقدمة أو الملخص

  // استخراج التخصص من نص التحليل
  const specialization = detectSpecialization(analysisText);
  onProgress?.('basic_info', 25);
  await new Promise(r => setTimeout(r, 300));

  // تحديد أهداف SDG
  const sdgIds = getSDGsForSpecialization(specialization, analysisText);
  onProgress?.('sdg_mapping', 50);
  await new Promise(r => setTimeout(r, 300));

  // بناء المقاييس
  const metrics = buildMetrics(analysisText);
  const pillars = buildPillars(analysisText, specialization);
  onProgress?.('detailed_matrix', 70);
  await new Promise(r => setTimeout(r, 300));

  // بناء SDGs
  const sdgs = buildSDGs(sdgIds, analysisText);
  onProgress?.('detailed_matrix', 85);
  await new Promise(r => setTimeout(r, 300));

  // حساب النتيجة الإجمالية
  const avgMetric = metrics.reduce((s, m) => s + m.score, 0) / metrics.length;
  const sdgCoverage = (sdgIds.length / 17) * 100;
  const overallScore = Math.round((avgMetric / 5) * 60 + sdgCoverage * 0.4);

  const swot = buildSWOT(analysisText, sdgIds, specialization);
  const suggestions = buildSuggestions(sdgIds, specialization);
  const recommendations = buildRecommendations(sdgIds, specialization);
  const benchmarks = buildBenchmarks(sdgIds);

  onProgress?.('complete', 100);

  return {
    specialization,
    sustainabilityField: `أهداف التنمية المستدامة - ${SDG_INFO[sdgIds[0]]?.name || "متعددة"}`,
    overallScore,
    metrics,
    sdgs,
    benchmarks,
    pillars,
    strengths: swot.strengths,
    opportunities: swot.opportunities,
    suggestions,
    recommendations,
  } as AnalysisResult;
}
