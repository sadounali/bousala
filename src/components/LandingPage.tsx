import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, BarChart2, FileText, ArrowRight, Sparkles, GraduationCap, Award } from 'lucide-react';
import { CompassLogo } from './CompassLogo';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <CompassLogo size={34} />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-oued-blue leading-none">بوصلة</span>
            <span className="text-[9px] font-medium text-slate-400 mt-0.5 leading-none hidden md:inline">
              منصة تحليل مذكرات الطلبة · جامعة الوادي
            </span>
          </div>
        </div>
        <button
          onClick={onGetStarted}
          className="px-5 py-2 bg-oued-blue text-white rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-md shadow-oued-blue/20"
        >
          ابدأ الآن
        </button>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
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
            مدعوم بالذكاء الاصطناعي · Gemini AI
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-oued-blue tracking-tight leading-tight">
            حلّل مذكرتك<br />
            <span className="text-oued-gold">بذكاء واحترافية</span>
          </h1>

          <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto font-medium">
            منصة بوصلة تُحلّل مذكرات التخرج وتقيّم مدى توافقها مع أهداف التنمية المستدامة الأممية — في ثوانٍ.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
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

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-slate-800 mb-12">
            لماذا <span className="text-oued-blue">بوصلة</span>؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="w-7 h-7" />,
                title: 'تحليل ذكي للمذكرات',
                desc: 'ارفع ملف PDF مذكرتك وسيقوم الذكاء الاصطناعي بتحليله وتصنيفه فورياً.',
                color: 'text-oued-blue bg-oued-blue/5',
              },
              {
                icon: <BarChart2 className="w-7 h-7" />,
                title: 'تقارير مفصّلة',
                desc: 'احصل على تقارير PDF احترافية توضح نتائج التحليل ومدى التوافق مع أهداف SDGs.',
                color: 'text-oued-gold bg-oued-gold/5',
              },
              {
                icon: <GraduationCap className="w-7 h-7" />,
                title: 'بوابة الطالب',
                desc: 'سجّل بياناتك الشخصية وتتبّع تاريخ تحليلاتك من مكان واحد.',
                color: 'text-emerald-600 bg-emerald-50',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:shadow-lg transition-all text-center"
              >
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-oued-blue text-white text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <Award className="w-12 h-12 mx-auto text-oued-gold" />
          <h2 className="text-3xl font-black">جاهز لتحليل مذكرتك؟</h2>
          <p className="text-blue-100 text-base leading-relaxed">
            انضم لمئات الطلاب الذين يستخدمون بوصلة لتقييم مذكراتهم واحترافيتها.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-oued-blue rounded-2xl text-base font-bold hover:scale-105 transition-all shadow-xl"
          >
            ابدأ الآن مجاناً
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-8 border-t border-slate-100 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        © 2024 بوصلة · جامعة الوادي
      </footer>
    </div>
  );
};

export default LandingPage;
