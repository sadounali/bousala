import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, BarChart2, FileText, ArrowRight, Sparkles, GraduationCap, Award, X, Mail, Phone, MapPin, Globe, Target } from 'lucide-react';
import { CompassLogo } from './CompassLogo';

interface LandingPageProps {
  onGetStarted: () => void;
}

const SDG_GOALS = [
  { num: 1,  label: 'القضاء على الفقر',        color: '#E5243B' },
  { num: 2,  label: 'القضاء على الجوع',         color: '#DDA63A' },
  { num: 3,  label: 'الصحة الجيدة',            color: '#4C9F38' },
  { num: 4,  label: 'التعليم الجيد',            color: '#C5192D' },
  { num: 5,  label: 'المساواة بين الجنسين',     color: '#FF3A21' },
  { num: 6,  label: 'المياه النظيفة',           color: '#26BDE2' },
  { num: 7,  label: 'الطاقة النظيفة',           color: '#FCC30B' },
  { num: 8,  label: 'العمل اللائق',             color: '#A21942' },
  { num: 9,  label: 'الصناعة والابتكار',        color: '#FD6925' },
  { num: 10, label: 'الحد من التفاوت',          color: '#DD1367' },
  { num: 11, label: 'المدن المستدامة',          color: '#FD9D24' },
  { num: 12, label: 'الإنتاج المسؤول',          color: '#BF8B2E' },
  { num: 13, label: 'المناخ',                   color: '#3F7E44' },
  { num: 14, label: 'الحياة تحت الماء',         color: '#0A97D9' },
  { num: 15, label: 'الحياة البرية',            color: '#56C02B' },
  { num: 16, label: 'السلام والعدالة',          color: '#00689D' },
  { num: 17, label: 'الشراكات',                 color: '#19486A' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans" dir="rtl">

      {/* ── Navbar ── */}
      <nav className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <CompassLogo size={34} />
          <div className="flex flex-col">
الوادي 🎓            <span className="text-lg font-bold tracking-tight text-oued-blue leading-none">بوصلة جامعة </span>
            <span className="text-[9px] font-medium text-slate-400 mt-0.5 leading-none hidden md:inline">
              منصة تحليل مذكرات الطلبة · جامعة الوادي
            </span>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-oued-blue/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-oued-gold/5 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-oued-blue/5 rounded-full border border-oued-blue/10 text-oued-blue text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
             مدعوم بمصفوفة التنمية المستدامة SDG
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-oued-blue tracking-tight leading-tight">
            حلّل مذكرتك<br />
            <span className="text-oued-gold">بذكاء واحترافية</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto font-medium">
            منصة بوصلة تُحلّل مذكرات التخرج وتقيّم مدى توافقها مع أهداف التنمية المستدامة الأممية — في ثوانٍ.
          </p>
          <div className="flex items-center justify-center pt-4">
            <button
              onClick={onGetStarted}
              className="flex items-center gap-3 px-8 py-4 bg-oued-blue text-white rounded-2xl text-base font-bold shadow-xl shadow-oued-blue/25 hover:scale-105 transition-all"
            >
              ابدأ التحليل مجاناً
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-slate-800 mb-12">
            لماذا <span className="text-oued-blue">بوصلة</span>؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FileText className="w-7 h-7" />, title: 'تحليل ذكي للمذكرات', desc: 'ارفع ملف PDF مذكرتك وسيقوم الذكاء الاصطناعي بتحليله وتصنيفه فورياً.', color: 'text-oued-blue bg-oued-blue/5' },
              { icon: <BarChart2 className="w-7 h-7" />, title: 'تقارير مفصّلة', desc: 'احصل على تقارير PDF احترافية توضح نتائج التحليل ومدى التوافق مع أهداف SDGs.', color: 'text-oued-gold bg-oued-gold/5' },
              { icon: <GraduationCap className="w-7 h-7" />, title: 'بوابة الطالب', desc: 'سجّل بياناتك الشخصية وتتبّع تاريخ تحليلاتك من مكان واحد.', color: 'text-emerald-600 bg-emerald-50' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:shadow-lg transition-all text-center">
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>{f.icon}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SDG Matrix Section ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-oued-gold/10 rounded-full border border-oued-gold/20 text-oued-gold text-xs font-bold">
              <Target className="w-3.5 h-3.5" />
              أهداف التنمية المستدامة للأمم المتحدة
            </div>
            <h2 className="text-3xl font-black text-slate-800">
              التحليل عبر <span className="text-oued-gold">مصفوفة التنمية المستدامة</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              تقوم المنصة بتحليل مذكرتك وربطها تلقائياً بأهداف التنمية المستدامة الـ 17 الصادرة عن الأمم المتحدة، وإظهار مدى مساهمة بحثك في تحقيق كل هدف.
            </p>
          </motion.div>

          {/* SDG colored squares */}
          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-9 gap-2 mb-10 justify-items-center">
            {SDG_GOALS.map((sdg, i) => (
              <motion.div key={sdg.num} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} viewport={{ once: true }}
                className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: sdg.color }}>
                  {sdg.num}
                </div>
                <span className="text-[7px] text-slate-400 text-center leading-tight font-medium hidden md:block max-w-[52px]">
                  {sdg.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'رفع المذكرة', desc: 'ارفع ملف PDF مذكرتك بضغطة واحدة' },
              { step: '02', title: 'التحليل الذكي', desc: 'تقرأ بوصلة المحتوى وتحدد الأهداف ذات الصلة' },
              { step: '03', title: 'مصفوفة النتائج', desc: 'تحصل على مصفوفة تفصيلية تُظهر نسبة التوافق مع كل هدف' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}
                className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-3xl font-black text-oued-blue/20 leading-none shrink-0">{s.step}</div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">{s.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-oued-blue text-white text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-2xl mx-auto space-y-6">
          <Award className="w-12 h-12 mx-auto text-oued-gold" />
          <h2 className="text-3xl font-black">جاهز لتحليل مذكرتك؟</h2>
          <p className="text-blue-100 text-base leading-relaxed">انضم لمئات الطلاب الذين يستخدمون بوصلة لتقييم مذكراتهم واحترافيتها.</p>
          <button onClick={onGetStarted} className="inline-flex items-center gap-3 px-8 py-4 bg-white text-oued-blue rounded-2xl text-base font-bold hover:scale-105 transition-all shadow-xl">
            ابدأ الآن مجاناً
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-8 bg-slate-900 text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CompassLogo size={28} />
            <div>
              <p className="text-white font-bold text-sm">بوصلة</p>
              <p className="text-[10px] text-slate-500">جامعة الوادي · © 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs font-bold">
            <button onClick={() => setShowTerms(true)} className="hover:text-white transition-colors">الأحكام والشروط</button>
            <button onClick={() => setShowContact(true)} className="hover:text-white transition-colors">اتصل بنا</button>
            <button onClick={onGetStarted} className="hover:text-white transition-colors">الدخول للمنصة</button>
          </div>
        </div>
      </footer>

      {/* ── Terms Modal ── */}
      <AnimatePresence>
        {showTerms && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowTerms(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative max-h-[80vh] overflow-y-auto">
              <button onClick={() => setShowTerms(false)} className="absolute top-5 left-5 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-6">الأحكام والشروط</h2>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-800">1. قبول الشروط</p>
                <p>باستخدامك منصة بوصلة، فإنك توافق على هذه الأحكام والشروط. إذا كنت لا توافق عليها، يُرجى عدم استخدام المنصة.</p>
                <p className="font-bold text-slate-800">2. الاستخدام المسموح به</p>
                <p>المنصة مخصصة حصرياً لطلاب جامعة الوادي لتحليل مذكرات التخرج الأكاديمية. يُحظر استخدامها لأغراض تجارية أو غير أكاديمية.</p>
                <p className="font-bold text-slate-800">3. الخصوصية وحماية البيانات</p>
                <p>نلتزم بحماية بيانات المستخدمين. لا يتم مشاركة المذكرات أو نتائج التحليل مع أطراف خارجية دون موافقة صريحة.</p>
                <p className="font-bold text-slate-800">4. دقة النتائج</p>
                <p>نتائج التحليل مبنية على الذكاء الاصطناعي وهي إرشادية بطبيعتها. لا تُعدّ المنصة مسؤولة عن القرارات الأكاديمية المبنية كلياً على هذه النتائج.</p>
                <p className="font-bold text-slate-800">5. حقوق الملكية الفكرية</p>
                <p>جميع حقوق المنصة وتصميمها محفوظة لجامعة الوادي. يُحظر نسخ أو إعادة توزيع المحتوى دون إذن مسبق.</p>
                <p className="font-bold text-slate-800">6. التعديلات</p>
                <p>تحتفظ المنصة بحق تعديل هذه الشروط في أي وقت، مع إشعار المستخدمين عبر البريد الإلكتروني أو إشعار داخل المنصة.</p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                <button onClick={() => setShowTerms(false)} className="px-6 py-2 bg-oued-blue text-white rounded-xl text-sm font-bold hover:bg-oued-blue/90 transition-all">
                  فهمت وأوافق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Contact Modal ── */}
      <AnimatePresence>
        {showContact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowContact(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setShowContact(false)} className="absolute top-5 left-5 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-2">اتصل بنا</h2>
              <p className="text-slate-500 text-sm mb-8">نحن هنا للمساعدة. تواصل معنا عبر أي وسيلة.</p>
              <div className="space-y-5">
                {[
                  { icon: <Mail className="w-5 h-5" />, label: 'البريد الإلكتروني', value: 'sadoun-ali@univ-eloued.dz', color: 'text-oued-blue bg-oued-blue/5' },
                  { icon: <Phone className="w-5 h-5" />, label: 'الهاتف', value: '+213 (0) 76 71 88 46', color: 'text-emerald-600 bg-emerald-50' },
                  { icon: <MapPin className="w-5 h-5" />, label: 'العنوان', value: 'جامعة الشهيد حمه لخضر — الوادي، الجزائر', color: 'text-oued-gold bg-oued-gold/5' },
                  { icon: <Globe className="w-5 h-5" />, label: 'الموقع الرسمي', value: 'www.univ-eloued.dz', color: 'text-purple-600 bg-purple-50' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center shrink-0`}>{c.icon}</div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.label}</p>
                      <p className="text-sm font-medium text-slate-700">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button onClick={() => setShowContact(false)} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LandingPage;
