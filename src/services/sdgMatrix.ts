// sdgMatrix.ts
// التحليل يعمل محلياً بدون أي API
// المصفوفة: تخصص × SDG → نسبة مئوية (0-100)

import { AnalysisResult } from "../types";

// ====================================================
// 1. تعريف أهداف SDG الـ 17
// ====================================================
export const SDG_LIST = [
  { id: 1,  label: "SDG 1",  name: "القضاء على الفقر",               color: "#E5243B" },
  { id: 2,  label: "SDG 2",  name: "القضاء على الجوع",               color: "#DDA63A" },
  { id: 3,  label: "SDG 3",  name: "الصحة الجيدة والرفاه",           color: "#4C9F38" },
  { id: 4,  label: "SDG 4",  name: "التعليم الجيد",                  color: "#C5192D" },
  { id: 5,  label: "SDG 5",  name: "المساواة بين الجنسين",           color: "#FF3A21" },
  { id: 6,  label: "SDG 6",  name: "المياه النظيفة والصرف الصحي",   color: "#26BDE2" },
  { id: 7,  label: "SDG 7",  name: "طاقة نظيفة وبأسعار معقولة",     color: "#FCC30B" },
  { id: 8,  label: "SDG 8",  name: "العمل اللائق ونمو الاقتصاد",    color: "#A21942" },
  { id: 9,  label: "SDG 9",  name: "الصناعة والابتكار والبنية التحتية", color: "#FD6925" },
  { id: 10, label: "SDG 10", name: "الحد من أوجه عدم المساواة",     color: "#DD1367" },
  { id: 11, label: "SDG 11", name: "مدن ومجتمعات مستدامة",          color: "#FD9D24" },
  { id: 12, label: "SDG 12", name: "الاستهلاك والإنتاج المسؤولان",  color: "#BF8B2E" },
  { id: 13, label: "SDG 13", name: "العمل المناخي",                  color: "#3F7E44" },
  { id: 14, label: "SDG 14", name: "الحياة تحت الماء",               color: "#0A97D9" },
  { id: 15, label: "SDG 15", name: "الحياة في البر",                 color: "#56C02B" },
  { id: 16, label: "SDG 16", name: "السلام والعدل والمؤسسات القوية", color: "#00689D" },
  { id: 17, label: "SDG 17", name: "عقد الشراكات لتحقيق الأهداف",  color: "#19486A" },
];

// ====================================================
// 2. المصفوفة الرئيسية: تخصص → SDG → نسبة %
// القيم: 0 = لا علاقة، 100 = علاقة مباشرة قوية جداً
// ====================================================
export const SDG_MATRIX: Record<string, Record<number, number>> = {

  // ─── كلية التكنولوجيا ───────────────────────────────
  "الهندسة الميكانيكية": {
    1:5, 2:5, 3:10, 4:20, 5:10, 6:15, 7:75, 8:70,
    9:90, 10:10, 11:55, 12:65, 13:60, 14:20, 15:20, 16:10, 17:40
  },
  "الهندسة الكهربائية": {
    1:5, 2:5, 3:10, 4:20, 5:10, 6:10, 7:90, 8:65,
    9:85, 10:10, 11:50, 12:55, 13:65, 14:10, 15:15, 16:10, 17:40
  },
  "هندسة الطرائق": {
    1:10, 2:15, 3:20, 4:20, 5:10, 6:60, 7:55, 8:55,
    9:75, 10:15, 11:45, 12:80, 13:70, 14:50, 15:55, 16:10, 17:35
  },
  "الهندسة المدنية": {
    1:15, 2:10, 3:20, 4:20, 5:15, 6:65, 7:40, 8:60,
    9:80, 10:20, 11:85, 12:60, 13:55, 14:35, 15:40, 16:25, 17:35
  },

  // ─── كلية العلوم الدقيقة ────────────────────────────
  "الرياضيات": {
    1:5, 2:5, 3:10, 4:80, 5:20, 6:10, 7:15, 8:30,
    9:45, 10:15, 11:10, 12:10, 13:15, 14:10, 15:10, 16:20, 17:30
  },
  "الفيزياء": {
    1:5, 2:5, 3:15, 4:75, 5:15, 6:15, 7:70, 8:35,
    9:65, 10:10, 11:25, 12:20, 13:55, 14:15, 15:20, 16:10, 17:30
  },
  "الكيمياء": {
    1:10, 2:20, 3:40, 4:65, 5:15, 6:55, 7:30, 8:40,
    9:60, 10:15, 11:30, 12:75, 13:50, 14:55, 15:50, 16:10, 17:30
  },
  "الإعلام الآلي": {
    1:15, 2:10, 3:20, 4:70, 5:25, 6:10, 7:20, 8:75,
    9:85, 10:20, 11:40, 12:30, 13:25, 14:10, 15:15, 16:40, 17:60
  },

  // ─── كلية علوم الطبيعة والحياة ──────────────────────
  "البيولوجيا": {
    1:20, 2:40, 3:80, 4:55, 5:25, 6:50, 7:15, 8:30,
    9:35, 10:20, 11:25, 12:40, 13:55, 14:70, 15:85, 16:15, 17:35
  },
  "الفلاحة": {
    1:40, 2:90, 3:55, 4:45, 5:35, 6:75, 7:35, 8:55,
    9:40, 10:30, 11:35, 12:70, 13:70, 14:45, 15:80, 16:20, 17:50
  },

  // ─── كلية الاقتصاد والتجارة والتسيير ────────────────
  "العلوم الاقتصادية": {
    1:70, 2:50, 3:35, 4:45, 5:50, 6:30, 7:40, 8:90,
    9:55, 10:80, 11:45, 12:60, 13:45, 14:20, 15:25, 16:50, 17:75
  },
  "العلوم التجارية": {
    1:55, 2:40, 3:25, 4:35, 5:45, 6:20, 7:30, 8:85,
    9:50, 10:65, 11:40, 12:70, 13:35, 14:15, 15:20, 16:40, 17:70
  },
  "علوم التسيير": {
    1:50, 2:35, 3:30, 4:40, 5:50, 6:25, 7:35, 8:80,
    9:55, 10:60, 11:45, 12:65, 13:40, 14:15, 15:20, 16:55, 17:65
  },

  // ─── كلية الآداب واللغات ────────────────────────────
  "اللغة العربية وآدابها": {
    1:20, 2:10, 3:15, 4:85, 5:55, 6:10, 7:5,  8:25,
    9:10, 10:45, 11:20, 12:10, 13:10, 14:5,  15:10, 16:60, 17:40
  },
  "اللغة الإنجليزية": {
    1:20, 2:10, 3:15, 4:80, 5:50, 6:10, 7:5,  8:30,
    9:15, 10:40, 11:20, 12:10, 13:10, 14:5,  15:10, 16:55, 17:55
  },
  "اللغة الفرنسية": {
    1:20, 2:10, 3:15, 4:80, 5:50, 6:10, 7:5,  8:30,
    9:15, 10:40, 11:20, 12:10, 13:10, 14:5,  15:10, 16:55, 17:55
  },

  // ─── كلية العلوم الاجتماعية والإنسانية ──────────────
  "العلوم الاجتماعية": {
    1:65, 2:45, 3:55, 4:65, 5:80, 6:30, 7:15, 8:50,
    9:20, 10:85, 11:60, 12:30, 13:30, 14:15, 15:25, 16:70, 17:55
  },
  "العلوم الإنسانية": {
    1:55, 2:35, 3:45, 4:70, 5:75, 6:25, 7:10, 8:40,
    9:15, 10:80, 11:50, 12:25, 13:25, 14:10, 15:20, 16:65, 17:50
  },

  // ─── كلية الحقوق والعلوم السياسية ───────────────────
  "الحقوق": {
    1:60, 2:30, 3:40, 4:55, 5:70, 6:35, 7:20, 8:45,
    9:20, 10:75, 11:50, 12:40, 13:45, 14:30, 15:30, 16:90, 17:60
  },
  "العلوم السياسية": {
    1:55, 2:30, 3:35, 4:50, 5:65, 6:30, 7:25, 8:40,
    9:25, 10:70, 11:55, 12:35, 13:50, 14:25, 15:30, 16:85, 17:70
  },
};

// ====================================================
// 3. أوزان الكلمات المفتاحية في نص المذكرة
// تُستخدم لتعديل النسب بناءً على محتوى المذكرة
// ====================================================
const KEYWORD_BOOSTS: Record<number, string[]> = {
  1:  ["فقر", "دخل", "معيشة", "poverty", "income"],
  2:  ["غذاء", "أمن غذائي", "زراعة", "food", "nutrition", "hunger"],
  3:  ["صحة", "طب", "مرض", "رعاية", "health", "medical", "disease"],
  4:  ["تعليم", "تدريب", "مدرسة", "جامعة", "education", "learning"],
  5:  ["مرأة", "نوع اجتماعي", "جندر", "gender", "women", "equality"],
  6:  ["مياه", "ري", "صرف صحي", "water", "sanitation", "irrigation"],
  7:  ["طاقة", "كهرباء", "متجددة", "شمسية", "energy", "solar", "renewable"],
  8:  ["اقتصاد", "عمل", "توظيف", "نمو", "economy", "employment", "growth"],
  9:  ["صناعة", "ابتكار", "تكنولوجيا", "بنية", "industry", "innovation", "technology"],
  10: ["تفاوت", "مساواة", "inequality", "disparity"],
  11: ["مدينة", "حضري", "سكن", "نقل", "city", "urban", "housing", "transport"],
  12: ["استهلاك", "نفايات", "إعادة تدوير", "consumption", "waste", "recycling"],
  13: ["مناخ", "انبعاثات", "احتباس", "تغير مناخي", "climate", "carbon", "emission"],
  14: ["بحر", "محيط", "أسماك", "مائي", "ocean", "marine", "fish"],
  15: ["غابات", "تنوع بيولوجي", "أرض", "forest", "biodiversity", "land"],
  16: ["قانون", "سلام", "عدالة", "حوكمة", "law", "peace", "justice", "governance"],
  17: ["شراكة", "تعاون", "دولي", "تمويل", "partnership", "cooperation", "international"],
};

// ====================================================
// 4. دالة استخراج نسب SDG من التخصص + نص المذكرة
// ====================================================
function computeSDGScores(
  specialization: string,
  text: string
): Record<number, number> {
  const lowerText = text.toLowerCase();

  // ابحث عن أقرب تخصص في المصفوفة
  const baseKey = findClosestSpecialization(specialization);
  const base: Record<number, number> = { ...(SDG_MATRIX[baseKey] || getDefaultScores()) };

  // عدّل النسب بناءً على الكلمات المفتاحية في النص
  for (const [sdgIdStr, keywords] of Object.entries(KEYWORD_BOOSTS)) {
    const sdgId = Number(sdgIdStr);
    const hits = keywords.filter(kw => lowerText.includes(kw.toLowerCase())).length;
    if (hits > 0) {
      const boost = Math.min(hits * 8, 25); // حد أقصى +25%
      base[sdgId] = Math.min(100, (base[sdgId] || 0) + boost);
    }
  }

  return base;
}

function findClosestSpecialization(input: string): string {
  const keys = Object.keys(SDG_MATRIX);
  // بحث مباشر
  if (SDG_MATRIX[input]) return input;
  // بحث جزئي
  const found = keys.find(k =>
    k.includes(input) || input.includes(k) ||
    k.toLowerCase().includes(input.toLowerCase())
  );
  return found || "الإعلام الآلي"; // افتراضي
}

function getDefaultScores(): Record<number, number> {
  const defaults: Record<number, number> = {};
  for (let i = 1; i <= 17; i++) defaults[i] = 10;
  return defaults;
}

// ====================================================
// 5. بناء AnalysisResult كامل من المصفوفة
// ====================================================
function buildAnalysisResult(
  specialization: string,
  text: string,
  scores: Record<number, number>
): AnalysisResult {

  // فلتر SDGs التي نسبتها >= 20%
  const relevantSDGs = SDG_LIST
    .filter(sdg => scores[sdg.id] >= 20)
    .sort((a, b) => scores[b.id] - scores[a.id])
    .slice(0, 8); // أعلى 8 أهداف

  const overallScore = Math.round(
    relevantSDGs.reduce((sum, s) => sum + scores[s.id], 0) / Math.max(relevantSDGs.length, 1)
  );

  const getStrength = (pct: number): string => {
    if (pct >= 70) return "High";
    if (pct >= 40) return "Medium";
    return "Low";
  };

  const getJustification = (sdgId: number, pct: number, spec: string): string => {
    const strength = getStrength(pct);
    const map: Record<string, string> = {
      "High": "علاقة مباشرة وقوية",
      "Medium": "علاقة متوسطة",
      "Low": "علاقة غير مباشرة"
    };
    return `تخصص ${spec} يرتبط بـ ${SDG_LIST[sdgId-1]?.name} بنسبة ${pct}% — ${map[strength]} بناءً على محتوى البحث والمصفوفة المرجعية.`;
  };

  // بناء SDGs
  const sdgs = relevantSDGs.map(sdg => ({
    id: sdg.id,
    label: sdg.label,
    name: sdg.name,
    percentage: scores[sdg.id],
    strength: getStrength(scores[sdg.id]),
    justification: getJustification(sdg.id, scores[sdg.id], specialization),
    targets: buildTargets(sdg.id, scores[sdg.id])
  }));

  // مقاييس
  const envSDGs = [6, 7, 13, 14, 15];
  const socSDGs = [1, 2, 3, 4, 5, 10, 11, 16];
  const ecoSDGs = [8, 9, 12, 17];

  // avgPct: المتوسط كنسبة مئوية (0-100) — للركائز ESG
  const avgPct = (ids: number[]) =>
    Math.round(ids.reduce((s, id) => s + (scores[id] || 0), 0) / ids.length);

  // avgScore: المتوسط كدرجة (0-5) — للمقاييس metrics
  const avgScore = (ids: number[]) =>
    Math.round(avgPct(ids) / 20);

  const metrics = [
    { name: "البيئي",         score: avgScore(envSDGs),        description: "مدى ارتباط البحث بالأهداف البيئية (6، 7، 13، 14، 15)" },
    { name: "الاجتماعي",     score: avgScore(socSDGs),         description: "مدى ارتباط البحث بالأهداف الاجتماعية (1-5، 10، 11، 16)" },
    { name: "الاقتصادي",     score: avgScore(ecoSDGs),         description: "مدى ارتباط البحث بالأهداف الاقتصادية (8، 9، 12، 17)" },
    { name: "الجوهرية",      score: Math.min(5, Math.round(overallScore / 20)), description: "مدى تناول البحث لقضايا جوهرية في الاستدامة" },
    { name: "قابلية التوسع", score: Math.min(5, Math.round(overallScore / 25)), description: "إمكانية تطبيق نتائج البحث على نطاق أوسع" },
  ];

  // معايير مرجعية
  const benchmarks = [
    { name: "معيار الأمم المتحدة للبحث المستدام", score: overallScore, benchmark: 75, description: "المعيار الدولي للبحث الأكاديمي المساهم في SDGs", notes: "يُقيّم مدى تناول البحث لعدد كافٍ من الأهداف بعمق" },
    { name: "مؤشر الاستدامة الجامعية UI GreenMetric", score: overallScore - 5, benchmark: 70, description: "معيار تصنيف الجامعات من حيث الاستدامة", notes: "يُستخدم لمقارنة مخرجات الجامعات الجزائرية" },
    { name: "معيار SDSN للبحث الأكاديمي", score: overallScore + 5, benchmark: 80, description: "شبكة الحلول للتنمية المستدامة — معيار التميز البحثي", notes: "يقيس جودة البحث وأثره على السياسات العامة" },
  ];

  // ركائز ESG — تستخدم avgPct مباشرة لتجنب خطأ التقريب المزدوج
  const pillars = [
    { name: "البيئي (E)",    score: avgPct(envSDGs), comment: "الأثر البيئي للبحث",    notes: "يشمل الطاقة، المياه، المناخ، التنوع البيولوجي" },
    { name: "الاجتماعي (S)", score: avgPct(socSDGs), comment: "الأثر الاجتماعي للبحث", notes: "يشمل التعليم، الصحة، المساواة، العدالة" },
    { name: "الحوكمة (G)",   score: Math.round((scores[16] + scores[17]) / 2), comment: "جودة الحوكمة والشراكات", notes: "يشمل الحوكمة، الشراكات الدولية، المؤسسات" },
  ];

  // نقاط القوة
  const strengths = [
    `ارتباط قوي بـ ${relevantSDGs[0]?.name || "التنمية المستدامة"} بنسبة ${relevantSDGs[0] ? scores[relevantSDGs[0].id] : 0}%`,
    `يغطي ${relevantSDGs.length} هدفاً من أهداف التنمية المستدامة`,
    `تخصص ${specialization} يمتلك إطاراً نظرياً راسخاً في مجال الاستدامة`,
  ];

  // الفرص
  const opportunities = [
    `تعزيز الارتباط بـ SDG ${relevantSDGs[relevantSDGs.length - 1]?.id} لرفع النسبة الإجمالية`,
    "إضافة منهجية قياس كمية لمؤشرات التنمية المستدامة",
    "إجراء دراسات مقارنة دولية لتحسين معايير القياس",
  ];

  // اقتراحات
  const suggestions = [
    {
      category: "المنهجية",
      gap: "غياب مؤشرات قياس كمية مرتبطة بـ SDGs",
      suggestion: "إضافة فصل يربط نتائج البحث بمؤشرات الأمم المتحدة الرسمية",
      priority: "عالية",
      notes: "يمكن الاستعانة بقاعدة بيانات UNSDG الرسمية"
    },
    {
      category: "التغطية",
      gap: `ضعف الارتباط بـ ${SDG_LIST.find(s => scores[s.id] < 20)?.name || "بعض الأهداف"}`,
      suggestion: "تضمين أبعاد متعددة الأهداف في الإطار النظري للبحث",
      priority: "متوسطة",
      notes: "تكامل الأهداف يرفع الأثر الإجمالي للبحث"
    },
    {
      category: "التوثيق",
      gap: "محدودية الإسناد لوثائق الأمم المتحدة",
      suggestion: "الاستشهاد بخطة 2030 وتقارير التقدم الوطنية الجزائرية",
      priority: "منخفضة",
      notes: "يعزز مصداقية البحث أمام لجان التقييم الدولي"
    },
  ];

  // توصيات
  const recommendations = {
    otherTargets: relevantSDGs.slice(0, 3).map(s => `${s.label}: ${s.name}`),
    futureIndicators: [
      "مؤشر الكثافة الكربونية لكل وحدة ناتج بحثي",
      "معدل تبني نتائج البحث في السياسات المحلية",
      "عدد الشراكات المؤسسية الناتجة عن البحث",
    ],
    complementarySpecializations: getComplementarySpecs(specialization),
  };

  return {
    specialization,
    sustainabilityField: getSustainabilityField(specialization),
    overallScore,
    metrics,
    sdgs,
    benchmarks,
    pillars,
    strengths,
    opportunities,
    suggestions,
    recommendations,
  };
}

// ====================================================
// 6. دوال مساعدة
// ====================================================
function buildTargets(sdgId: number, percentage: number) {
  const targetMap: Record<number, Array<{ id: string; description: string }>> = {
    4:  [{ id: "4.1", description: "ضمان التعليم الابتدائي والثانوي الجيد" }, { id: "4.4", description: "مهارات التقنية والمهنية" }],
    7:  [{ id: "7.2", description: "زيادة حصة الطاقة المتجددة" }, { id: "7.3", description: "مضاعفة كفاءة الطاقة" }],
    9:  [{ id: "9.1", description: "بنية تحتية جيدة وصناعة مستدامة" }, { id: "9.5", description: "تعزيز البحث العلمي والابتكار" }],
    13: [{ id: "13.1", description: "تعزيز الصمود أمام الكوارث المناخية" }, { id: "13.3", description: "التثقيف بشأن تغير المناخ" }],
    8:  [{ id: "8.2", description: "تحقيق إنتاجية اقتصادية أعلى" }, { id: "8.6", description: "تقليص نسبة الشباب غير الملتحقين" }],
    3:  [{ id: "3.4", description: "تقليص معدل الوفيات الناجمة عن الأمراض" }, { id: "3.8", description: "تحقيق التغطية الصحية الشاملة" }],
    15: [{ id: "15.1", description: "الحفاظ على النظم البيئية البرية" }, { id: "15.2", description: "إدارة الغابات بصورة مستدامة" }],
    16: [{ id: "16.3", description: "تعزيز سيادة القانون" }, { id: "16.6", description: "تطوير مؤسسات فعالة وشفافة" }],
  };

  const targets = targetMap[sdgId] || [{ id: `${sdgId}.1`, description: `الهدف الرئيسي لـ SDG ${sdgId}` }];
  const score = Math.min(5, Math.round(percentage / 20));

  return targets.map(t => ({
    id: t.id,
    description: t.description,
    indicators: [{
      id: `${t.id}.a`,
      description: `مؤشر قياس ${t.description}`,
      assessment: {
        measuresDirectly: percentage >= 60,
        suggestsSolutions: percentage >= 40,
        collectsData: percentage >= 50,
        contributionScore: score,
        notes: `البحث يساهم في هذا المؤشر بنسبة ${percentage}% بناءً على التخصص والمحتوى`
      }
    }]
  }));
}

function getSustainabilityField(spec: string): string {
  const map: Record<string, string> = {
    "الهندسة الميكانيكية": "الاستدامة الصناعية والطاقة",
    "الهندسة الكهربائية": "الطاقة المتجددة والأنظمة الكهربائية",
    "هندسة الطرائق": "الاستدامة الكيميائية والصناعية",
    "الهندسة المدنية": "البنية التحتية المستدامة",
    "الرياضيات": "النمذجة الرياضية للاستدامة",
    "الفيزياء": "فيزياء الطاقة والبيئة",
    "الكيمياء": "الكيمياء الخضراء",
    "الإعلام الآلي": "التكنولوجيا للتنمية المستدامة",
    "البيولوجيا": "التنوع البيولوجي وعلوم الحياة",
    "الفلاحة": "الزراعة المستدامة والأمن الغذائي",
    "العلوم الاقتصادية": "الاقتصاد الأخضر والتنمية",
    "العلوم التجارية": "التجارة المستدامة والمسؤولية الاجتماعية",
    "علوم التسيير": "إدارة الاستدامة المؤسسية",
    "الحقوق": "القانون البيئي وحقوق الإنسان",
    "العلوم السياسية": "السياسات العامة والحوكمة المستدامة",
    "العلوم الاجتماعية": "العدالة الاجتماعية والتنمية البشرية",
    "العلوم الإنسانية": "الأبعاد الإنسانية للتنمية المستدامة",
  };
  return map[spec] || "التنمية المستدامة متعددة الأبعاد";
}

function getComplementarySpecs(spec: string): string[] {
  const map: Record<string, string[]> = {
    "الهندسة الميكانيكية": ["هندسة الطرائق", "الفيزياء", "علوم التسيير"],
    "الهندسة الكهربائية": ["الفيزياء", "الإعلام الآلي", "الهندسة الميكانيكية"],
    "هندسة الطرائق": ["الكيمياء", "البيولوجيا", "الهندسة الميكانيكية"],
    "الهندسة المدنية": ["الجغرافيا", "علوم التسيير", "العلوم الاجتماعية"],
    "الإعلام الآلي": ["الرياضيات", "الهندسة الكهربائية", "العلوم الاقتصادية"],
    "الفلاحة": ["البيولوجيا", "الكيمياء", "العلوم الاقتصادية"],
    "العلوم الاقتصادية": ["العلوم السياسية", "علوم التسيير", "العلوم الاجتماعية"],
    "الحقوق": ["العلوم السياسية", "العلوم الاجتماعية", "العلوم الاقتصادية"],
  };
  return map[spec] || ["العلوم الاقتصادية", "الإعلام الآلي", "العلوم الاجتماعية"];
}

// ====================================================
// 7. الدالة الرئيسية — نفس واجهة geminiService تماماً
// ====================================================
export async function analyzeSustainabilityDocument(
  text: string,
  file?: File,
  onProgress?: (stage: string, percent: number) => void
): Promise<AnalysisResult> {

  onProgress?.('reading', 10);
  await delay(300);

  // استخراج التخصص من النص
  onProgress?.('basic_info', 30);
  await delay(200);
  const specialization = detectSpecialization(text);

  onProgress?.('sdg_mapping', 60);
  await delay(400);

  // حساب النسب
  const scores = computeSDGScores(specialization, text);

  onProgress?.('detailed_matrix', 80);
  await delay(300);

  // بناء النتيجة الكاملة
  const result = buildAnalysisResult(specialization, text, scores);

  onProgress?.('complete', 100);
  return result;
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// ====================================================
// 8. كشف التخصص من نص المذكرة
// ====================================================
function detectSpecialization(text: string): string {
  const lower = text.toLowerCase();

  const specKeywords: Record<string, string[]> = {
    "الهندسة الميكانيكية":    ["ميكانيك", "آلات", "mechanical", "thermodynamic", "fluid"],
    "الهندسة الكهربائية":     ["كهرباء", "إلكترون", "electrical", "circuit", "power"],
    "هندسة الطرائق":          ["طرائق", "process", "chemical engineering", "reactor"],
    "الهندسة المدنية":        ["مدني", "بناء", "خرسانة", "civil", "concrete", "structural"],
    "الرياضيات":              ["رياضيات", "معادلات", "mathematics", "algebra", "calculus"],
    "الفيزياء":               ["فيزياء", "physics", "quantum", "thermodynamics"],
    "الكيمياء":               ["كيمياء", "chemistry", "molecule", "reaction", "compound"],
    "الإعلام الآلي":          ["برمجة", "خوارزمية", "computer", "algorithm", "software", "réseau"],
    "البيولوجيا":             ["بيولوجيا", "خلية", "biology", "organism", "genetics"],
    "الفلاحة":                ["فلاحة", "زراعة", "agriculture", "crop", "soil", "irrigation"],
    "العلوم الاقتصادية":      ["اقتصاد", "economics", "gdp", "macro", "micro"],
    "العلوم التجارية":        ["تجارة", "تسويق", "commerce", "marketing", "trade"],
    "علوم التسيير":           ["تسيير", "إدارة", "management", "organisation", "stratégie"],
    "اللغة العربية وآدابها":  ["أدب عربي", "نقد", "شعر", "رواية عربية"],
    "اللغة الإنجليزية":       ["english literature", "linguistics", "discourse"],
    "اللغة الفرنسية":         ["littérature", "français", "linguistique"],
    "العلوم الاجتماعية":      ["اجتماع", "sociology", "social", "communauté"],
    "العلوم الإنسانية":       ["تاريخ", "فلسفة", "history", "philosophy", "psychology"],
    "الحقوق":                 ["قانون", "law", "droit", "juridique", "législation"],
    "العلوم السياسية":        ["سياسة", "politics", "political", "gouvernance", "État"],
  };

  let best = "الإعلام الآلي";
  let bestScore = 0;

  for (const [spec, keywords] of Object.entries(specKeywords)) {
    const score = keywords.filter(kw => lower.includes(kw.toLowerCase())).length;
    if (score > bestScore) {
      bestScore = score;
      best = spec;
    }
  }

  return best;
}
