import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          "nav": {
            "title": "Compass",
            "subtitle": "",
            "studentPortal": "Student Portal",
            "signOut": "Sign Out",
            "signIn": "Sign In",
            "home": "Home",
            "thesis": "Thesis",
            "history": "History",
            "profile": "Profile"
          },
          "hero": {
            "title": "Analysis",
            "subtitle": "Upload your research document to identify sustainability gaps and receive concrete academic recommendations."
          },
          "uploader": {
            "drop": "Drop your research document here",
            "or": "or",
            "click": "click to browse files",
            "support": "Supports PDF, DOCX, and TXT (Max 10MB). Should include cover, intro, summaries, and conclusion.",
            "selected": "Selected file:",
            "analyze": "Analyze Sustainability",
            "analyzing": "Analyzing Impact..."
          },
          "dashboard": {
            "status": "Analysis Status",
            "complete": "Diagnostic Complete",
            "verified": "Verified SDG-v4",
            "radarTitle": "Sustainability Radar (Pillars)",
            "radarDesc": "Spider map showing evaluation across Environmental, Social, and Economic dimensions.",
            "impactDist": "SDG Impact Distribution",
            "unSdgs": "UN Sustainable Development Goals",
            "primaryFocus": "Primary Focus Areas",
            "impactSummary": "Impact Summary",
            "focusScore": "Focus Score",
            "strength": "Strength",
            "strengthsTitle": "Points of Strength",
            "strengthsDesc": "Positive indicators identified in your document that align with best practices.",
            "opportunitiesTitle": "Opportunities for Growth",
            "opportunitiesDesc": "Areas where your document could improve depth or compliance with standards.",
            "index": "Alignment Index",
            "industryCompare": "Relevant Industry Comparison",
            "industryCompareDesc": "Comparison against specific industry averages for your identified research focus.",
            "yourResearch": "Your Research",
            "sectorAverage": "Estimated Sector Average",
            "score": "Score",
            "strongAlignment": "Strong Alignment",
            "moderatePotential": "Moderate Potential",
            "needsOptimization": "Needs Optimization",
            "welcome": "Welcome to Student Dashboard",
            "welcomeDesc": "Your personal assistant to analyze and develop your academic thesis in accordance with international standards.",
            "cardThesis": "Thesis Analysis",
            "cardThesisDesc": "Start a new auditing and analysis process for your thesis.",
            "cardHistory": "Report History",
            "cardHistoryDesc": "Review and compare past analysis results.",
            "cardProfile": "Academic Profile",
            "cardProfileDesc": "Update your academic information and thesis data.",
            "indexDesc": "A weighted index based on SDG compliance, ESG standards, and total research transparency.",
            "envDesc": "Measures the rigor of environmental impact analysis and lifecycle assessments.",
            "socDesc": "Evaluates how the research considers human rights, labor, and community equity.",
            "ecoDesc": "Assessment of the financial viability and long-term economic scalability.",
            "matDesc": "Evaluation of focus on the most critical environmental and social factors.",
            "scalDesc": "The potential for the findings to be expanded or replicated in different markets."
          },
          "advisory": {
            "title": "Actionable Advisory",
            "category": "Category",
            "priority": "Priority",
            "gap": "Gap Identified",
            "apply": "Apply Suggested Improvements",
            "exportPdf": "Export PDF Report"
          },
          "history": {
            "title": "Your History",
            "compare": "Compare Selected",
            "count": "Previous Analyses",
            "empty": "No history found. Start your first analysis!",
            "metrics": "Metrics Analyzed",
            "score": "Score"
          },
          "comparison": {
            "title": "Comparative Analysis",
            "back": "Back to History",
            "diff": "pts",
            "variance": "Metric Variance",
            "strengths": "Strengths",
            "recommendations": "New vs. Resolved Recommendations",
            "comparing": "Comparing improvements from {{nameA}} to {{nameB}}."
          },
          "footer": {
            "engine": "",
            "status": "",
            "copyright": "All Rights Reserved © 2026 Compass",
            "privacy": "Privacy Policy",
            "terms": "Terms & Conditions",
            "privacyContent": "Privacy Policy for Compass: This service uses advanced AI analysis to evaluate your research. Your uploaded documents are processed securely and are only accessible by you when logged in. We do not share your private data with third parties.",
            "termsContent": "Terms & Conditions for Compass: By using this platform, you agree to our processing of sustainability data. The results provided are academic advisory and should be verified against official standards. The intellectual property of the 'Compass' methodology belongs to the academic board."
          },
          "portal": {
            "academicTitle": "Pedagogical Information",
            "memoTitle": "Thesis Information",
            "birthWilaya": "Place of Birth (Wilaya)",
            "faculty": "Faculty",
            "department": "Department",
            "specialty": "Specialty",
            "studentCard": "Student Card Number (12 digits)",
            "phone": "Phone Number (10 digits)",
            "email": "Email Address",
            "thesisTitle": "Thesis Title",
            "supervisor": "Supervisor",
            "participants": "Participating Students",
            "degreeType": "Degree Type",
            "gradYear": "Graduation Year",
            "save": "Save Information",
            "saving": "Saving...",
            "success": "Information saved successfully!"
          }
        }
      },
      ar: {
        translation: {
          "nav": {
            "title": "بوصلة",
            "subtitle": "",
            "studentPortal": "بوابة الطالب",
            "signOut": "تسجيل الخروج",
            "signIn": "تسجيل الدخول",
            "home": "الرئيسية",
            "thesis": "المذكرة",
            "history": "سجل التقارير",
            "profile": "الملف الشخصي"
          },
          "hero": {
            "title": "التحليل",
            "subtitle": "قم بتحميل وثيقة البحث الخاصة بك لتحديد فجوات الاستدامة وتلقي توصيات أكاديمية ملموسة."
          },
          "uploader": {
            "drop": "أفلت وثيقة البحث هنا",
            "or": "أو",
            "click": "انقر لتصفح الملفات",
            "support": "يدعم PDF و DOCX و TXT (بحد أقصى 10 ميجابايت). يجب أن يحتوي الملف على الواجهة، المقدمة، الملخصات، والخاتمة.",
            "selected": "الملف المختار:",
            "analyze": "تحليل الاستدامة",
            "analyzing": "جاري تحليل الأثر..."
          },
          "dashboard": {
            "status": "حالة التحليل",
            "complete": "اكتمل التشخيص",
            "verified": "تم التحقق من SDG-v4",
            "radarTitle": "رادار الاستدامة (الأركان)",
            "radarDesc": "خريطة عنكبوتية تظهر التقييم عبر الأبعاد البيئية والاجتماعية والاقتصادية.",
            "impactDist": "توزيع أثر أهداف التنمية المستدامة (SDGs)",
            "unSdgs": "أهداف الأمم المتحدة للتنمية المستدامة",
            "primaryFocus": "مجالات التركيز الأساسية",
            "impactSummary": "ملخص الأثر",
            "focusScore": "درجة التركيز",
            "strength": "القوة",
            "strengthsTitle": "نقاط القوة",
            "strengthsDesc": "المؤشرات الإيجابية المحددة في وثيقتك والتي تتماشى مع أفضل الممارسات.",
            "opportunitiesTitle": "فرص النمو",
            "opportunitiesDesc": "المجالات التي يمكن لبحثك تحسين عمقها أو امتثالها للمعايير.",
            "index": "مؤشر التوافق",
            "industryCompare": "مقارنة المجال ذات الصلة",
            "industryCompareDesc": "مقارنة بمتوسطات المجال المحددة لتركيز بحثك.",
            "yourResearch": "بحثك",
            "sectorAverage": "متوسط القطاع التقديري",
            "score": "الدرجة",
            "strongAlignment": "توافق قوي",
            "moderatePotential": "إمكانات متوسطة",
            "needsOptimization": "بحاجة إلى تحسين",
            "welcome": "مرحباً بك في لوحة تحكم الطالب",
            "welcomeDesc": "مساعدك الشخصي لتحليل وتطوير مذكرتك الأكاديمية بما يتوافق مع المعايير العالمية.",
            "cardThesis": "تحليل المذكرة",
            "cardThesisDesc": "ابدأ عملية تدقيق وتحليل جديدة لمذكرتك.",
            "cardHistory": "سجل التقارير",
            "cardHistoryDesc": "استعرض وقارن نتائج التحليلات السابقة.",
            "cardProfile": "الملف الأكاديمي",
            "cardProfileDesc": "تحديث معلوماتك الأكاديمية وبيانات المذكرة.",
            "indexDesc": "مؤشر مرجح يعتمد على الامتثال لأهداف التنمية المستدامة، ومعايير الحوكمة البيئية والاجتماعية والمؤسسية، والشفافية البحثية.",
            "envDesc": "يقيس جودة تحليل الأثر البيئي وتقييمات دورة حياة المشروع.",
            "socDesc": "يقيم مدى مراعاة البحث لحقوق الإنسان، والعمل، والعدالة المجتمعية.",
            "ecoDesc": "تقييم الجدوى المالية وقابلية التوسع الاقتصادي على المدى الطويل.",
            "matDesc": "تقييم التركيز على العوامل البيئية والاجتماعية الأكثر أهمية.",
            "scalDesc": "إمكانية توسيع نطاق النتائج أو تكرارها في أسواق أو سياقات مختلفة."
          },
          "advisory": {
            "title": "توصيات قابلة للتنفيذ",
            "category": "الفئة",
            "priority": "الأولوية",
            "gap": "الفجوة المحددة",
            "apply": "تطبيق التحسينات المقترحة",
            "exportPdf": "تصدير تقرير PDF"
          },
          "history": {
            "title": "سجلك",
            "compare": "مقارنة المختار",
            "count": "تحليلات سابقة",
            "empty": "لا يوجد سجل. ابدأ تحليلك الأول!",
            "metrics": "مقاييس تم تحليلها",
            "score": "الدرجة"
          },
          "comparison": {
            "title": "التحليل المقارن",
            "back": "العودة إلى السجل",
            "diff": "نقطة",
            "variance": "تباين المقاييس",
            "strengths": "نقاط القوة",
            "recommendations": "التوصيات الجديدة مقابل التي تم حلها",
            "comparing": "مقارنة التحسينات من {{nameA}} إلى {{nameB}}."
          },
          "footer": {
            "engine": "",
            "status": "",
            "copyright": "جميع الحقوق محفوظة © 2026 بوصلة",
            "privacy": "سياسة الخصوصية",
            "terms": "الأحكام والشروط",
            "privacyContent": "سياسة الخصوصية لبوصلة: تستخدم هذه الخدمة تحليل الذكاء الاصطناعي المتقدم لتقييم بحثك. تتم معالجة مستنداتك المرفوعة بشكل آمن ولا يمكن الوصول إليها إلا من قبلك عند تسجيل الدخول. نحن لا نشارك بياناتك الخاصة مع أطراف ثالثة.",
            "termsContent": "الأحكام والشروط لبوصلة: باستخدام هذه المنصة، فإنك توافق على معالجتنا لبيانات الاستدامة. النتائج المقدمة هي مشورة أكاديمية ويجب التحقق منها مقابل المعايير الرسمية. الملكية الفكرية لمنهجية 'بوصلة' تعود للمجلس الأكاديمي."
          },
          "portal": {
            "academicTitle": "المعلومات البيداغوجية",
            "memoTitle": "معلومات المذكرة",
            "birthWilaya": "ولاية الميلاد",
            "faculty": "الكلية",
            "department": "القسم",
            "specialty": "التخصص",
            "studentCard": "رقم بطاقة الطالب (12 رقم)",
            "phone": "رقم الهاتف (10 أرقام)",
            "email": "البريد الإلكتروني",
            "thesisTitle": "عنوان المذكرة",
            "supervisor": "المشرف",
            "participants": "الطلبة المشاركين",
            "degreeType": "نوع الشهادة",
            "gradYear": "سنة التخرج",
            "save": "حفظ المعلومات",
            "saving": "جاري الحفظ...",
            "success": "تم حفظ المعلومات بنجاح!"
          }
        }
      }
    }
  });

export default i18n;
