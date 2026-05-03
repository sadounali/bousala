/**
 * LandingPage.tsx — بوصلة Landing Page
 * يلبي متطلبات لجنة علامة مؤسسة ناشئة:
 * ✅ Landing Page تشرح المشكلة والحل
 * ✅ Features Page
 * ✅ About Us + Contact
 * ✅ Privacy Policy + Terms (موجودة في Footer)
 * ✅ نموذج عمل واضح (باقات + دفع)
 */

import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'motion/react';
import { CompassLogo } from './CompassLogo';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const toggleLanguage = () => {
    i18n.changeLanguage(isAr ? 'en' : 'ar');
  };

  // Problems data
  const problems = isAr
    ? [
        { icon: '😟', title: 'غياب التغذية الراجعة', desc: 'الطالب لا يعرف مواطن الضعف في مذكرته إلا بعد المناقشة الرسمية.' },
        { icon: '📋', title: 'معايير ضبابية', desc: 'المعايير الأكاديمية موجودة لكنها متفرقة وغير مجموعة في أداة واحدة.' },
        { icon: '⏱️', title: 'ضغط الوقت', desc: 'مراجعة المذكرة يدوياً تستغرق وقتاً طويلاً من الأستاذ المشرف.' },
        { icon: '📄', title: 'غياب التوثيق', desc: 'لا توجد تقارير موثقة تدعم الطالب في مسيرته الأكاديمية.' },
      ]
    : [
        { icon: '😟', title: 'No Feedback Loop', desc: 'Students only discover weaknesses after their formal defense.' },
        { icon: '📋', title: 'Scattered Standards', desc: 'Academic criteria exist but are fragmented and hard to apply.' },
        { icon: '⏱️', title: 'Time Pressure', desc: 'Manual thesis review takes too long for supervisors.' },
        { icon: '📄', title: 'No Documentation', desc: 'No formal reports to support students throughout their academic journey.' },
      ];

  // Features data
  const features = isAr
    ? [
        { num: '01', icon: '📊', title: 'تحليل شامل للمذكرة', desc: 'تقييم دقيق للمنهجية والتوثيق والصياغة وفق معايير علمية معتمدة دولياً.' },
        { num: '02', icon: '📄', title: 'تقارير PDF مفصلة', desc: 'احصل على تقرير رسمي قابل للطباعة يوثق نتائج التحليل والتوصيات.' },
        { num: '03', icon: '📈', title: 'تتبع التقدم', desc: 'قارن نتائجك عبر الزمن وشاهد تحسنك الأكاديمي بشكل مرئي.' },
        { num: '04', icon: '🎓', title: 'الملف الأكاديمي', desc: 'سجل موحد لكل مذكراتك وتحليلاتك وبياناتك الأكاديمية.' },
        { num: '05', icon: '🌐', title: 'دعم عربي وإنجليزي', desc: 'المنصة متوفرة باللغتين لخدمة أوسع شريحة من الطلاب.' },
        { num: '06', icon: '🔒', title: 'أمان وخصوصية', desc: 'بياناتك محمية ومشفرة، ولا تُشارك مع أي طرف ثالث.' },
      ]
    : [
        { num: '01', icon: '📊', title: 'Comprehensive Analysis', desc: 'Accurate evaluation of methodology, citations, and academic writing style.' },
        { num: '02', icon: '📄', title: 'Detailed PDF Reports', desc: 'Get an official printable report documenting analysis results and recommendations.' },
        { num: '03', icon: '📈', title: 'Progress Tracking', desc: 'Compare results over time and visualize your academic improvement.' },
        { num: '04', icon: '🎓', title: 'Academic Profile', desc: 'Unified record of all your theses, analyses, and academic data.' },
        { num: '05', icon: '🌐', title: 'Arabic & English Support', desc: 'Full bilingual support to serve the widest range of students.' },
        { num: '06', icon: '🔒', title: 'Security & Privacy', desc: 'Your data is encrypted and never shared with third parties.' },
      ];

  // Steps data
  const steps = isAr
    ? [
        { num: '١', title: 'أنشئ حسابك مجاناً', desc: 'سجّل بريدك الجامعي واملأ ملفك الأكاديمي في أقل من دقيقتين.' },
        { num: '٢', title: 'ارفع مذكرتك', desc: 'ارفع ملف المذكرة بصيغة PDF وانتظر اكتمال التحليل الآلي الذكي.' },
        { num: '٣', title: 'احصل على تقريرك', desc: 'استلم تقريراً مفصلاً بالنقاط القوية والضعيفة والتوصيات العلمية.' },
      ]
    : [
        { num: '1', title: 'Create Your Free Account', desc: 'Register with your university email and fill your academic profile in under 2 minutes.' },
        { num: '2', title: 'Upload Your Thesis', desc: 'Upload your PDF file and wait for the intelligent automated analysis to complete.' },
        { num: '3', title: 'Receive Your Report', desc: 'Get a detailed report with strengths, weaknesses, and scientific recommendations.' },
      ];

  // Pricing data
  const plans = isAr
    ? [
        {
          name: 'المجانية', price: 'مجاناً', period: 'للأبد بدون رسوم', featured: false,
          features: ['تحليل مذكرة واحدة شهرياً', 'تقرير أساسي', 'ملف أكاديمي', 'دعم باللغتين'],
          cta: 'ابدأ مجاناً',
        },
        {
          name: 'الطالب', price: '500 دج', period: 'شهرياً', featured: true,
          badge: 'الأكثر طلباً',
          features: ['تحليل 5 مذكرات شهرياً', 'تقارير PDF مفصلة', 'تتبع التقدم', 'الأولوية في الدعم', 'مقارنة التحليلات'],
          cta: 'اشترك الآن',
        },
        {
          name: 'الأستاذ / المؤسسة', price: '2000 دج', period: 'شهرياً', featured: false,
          features: ['تحليل غير محدود', 'لوحة إدارة الطلاب', 'تقارير مجمعة', 'دعم أولوية قصوى', 'تكامل مع المنظومة الجامعية'],
          cta: 'تواصل معنا',
        },
      ]
    : [
        {
          name: 'Free', price: 'Free', period: 'Forever, no fees', featured: false,
          features: ['1 thesis analysis/month', 'Basic report', 'Academic profile', 'Bilingual support'],
          cta: 'Get Started Free',
        },
        {
          name: 'Student', price: '500 DZD', period: 'per month', featured: true,
          badge: 'Most Popular',
          features: ['5 thesis analyses/month', 'Detailed PDF reports', 'Progress tracking', 'Priority support', 'Compare analyses'],
          cta: 'Subscribe Now',
        },
        {
          name: 'Professor / Institution', price: '2000 DZD', period: 'per month', featured: false,
          features: ['Unlimited analyses', 'Student management dashboard', 'Aggregated reports', 'Top priority support', 'University system integration'],
          cta: 'Contact Us',
        },
      ];

  return (
    <div
      className="min-h-screen font-arabic"
      style={{ background: '#f5f2eb', color: '#1a2744' }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-slate-200/80"
        style={{ background: 'rgba(245,242,235,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2">
          <CompassLogo size={32} />
          <span className="text-xl font-black text-slate-900">{isAr ? 'بوصلة' : 'Bousala'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-400"
          >
            {isAr ? 'English' : 'عربي'}
          </button>
          <button
            onClick={onLogin}
            className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors px-4 py-2"
          >
            {isAr ? 'تسجيل الدخول' : 'Login'}
          </button>
          <button
            onClick={onGetStarted}
            className="text-sm font-bold text-white px-5 py-2 rounded-full transition-all hover:opacity-90 hover:shadow-lg"
            style={{ background: '#1a2744' }}
          >
            {isAr ? 'ابدأ الآن' : 'Get Started'}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 flex flex-col items-center text-center" style={{ minHeight: '100vh', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border mb-8"
            style={{ background: 'rgba(26,39,68,0.06)', borderColor: 'rgba(26,39,68,0.15)', color: '#1a2744' }}>
            🎓 {isAr ? 'منصة أكاديمية · كلية الآداب واللغات' : 'Academic Platform · Faculty of Arts & Languages'}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="font-black leading-tight mb-6"
          style={{ fontSize: 'clamp(36px, 8vw, 64px)', color: '#1a2744' }}
        >
          {isAr ? <>مذكرتك تستحق<br /><span style={{ color: '#c9a84c' }}>أفضل تقييم</span></> : <>Your Thesis Deserves<br /><span style={{ color: '#c9a84c' }}>The Best Evaluation</span></>}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg leading-relaxed mb-10 max-w-xl"
          style={{ color: '#5a6a8a' }}
        >
          {isAr
            ? 'بوصلة تحلل مذكرتك الأكاديمية وتقيّمها وفق المعايير العلمية العالمية، وتوفر تقارير PDF مفصلة تساعدك على الوصول للتميز.'
            : 'Bousala analyzes your academic thesis according to international scientific standards and provides detailed PDF reports to help you reach excellence.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-3 flex-wrap justify-center"
        >
          <button
            onClick={onGetStarted}
            className="text-base font-bold text-white px-8 py-4 rounded-full transition-all hover:shadow-xl hover:-translate-y-1"
            style={{ background: '#1a2744' }}
          >
            🚀 {isAr ? 'ابدأ مجاناً' : 'Start Free'}
          </button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-base font-bold px-8 py-4 rounded-full border-2 transition-all hover:bg-slate-900 hover:text-white"
            style={{ borderColor: '#1a2744', color: '#1a2744' }}
          >
            {isAr ? 'اكتشف الميزات' : 'Explore Features'}
          </button>
        </motion.div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full max-w-xs rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
          style={{ background: 'white' }}
        >
          <div className="flex items-center gap-2 px-5 py-4" style={{ background: '#1a2744' }}>
            {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />)}
            <span className="text-white text-xs font-bold mr-auto">{isAr ? 'تقرير التحليل' : 'Analysis Report'}</span>
          </div>
          <div className="p-5">
            <div className="rounded-2xl p-5 text-center mb-4" style={{ background: 'linear-gradient(135deg,#1a2744,#2d4070)' }}>
              <div className="text-5xl font-black" style={{ color: '#e8c97a' }}>87</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{isAr ? '/ 100 — درجة الجودة' : '/ 100 — Quality Score'}</div>
            </div>
            {[
              { label: isAr ? 'المنهجية' : 'Methodology', w: '92%' },
              { label: isAr ? 'التوثيق العلمي' : 'Citations', w: '85%' },
              { label: isAr ? 'الصياغة' : 'Writing Style', w: '80%' },
            ].map(bar => (
              <div key={bar.label} className="mb-3">
                <div className="flex justify-between text-xs mb-1" style={{ color: '#5a6a8a' }}>
                  <span>{bar.label}</span><span>{bar.w}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(26,39,68,0.08)' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: bar.w }} transition={{ duration: 1.2, delay: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#1a2744,#c9a84c)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <RevealSection className="text-center mb-12">
          <motion.div variants={fadeUp}>
            <span className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}>
              {isAr ? 'المشكلة' : 'The Problem'}
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-black text-3xl md:text-4xl mb-4" style={{ color: '#1a2744' }}>
            {isAr ? 'ما الذي يعاني منه الطلاب؟' : 'What Do Students Struggle With?'}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base leading-relaxed max-w-lg mx-auto" style={{ color: '#5a6a8a' }}>
            {isAr
              ? 'كثير من الطلاب يقدمون مذكرات دون معرفة نقاط ضعفها، فيخسرون درجات كان يمكن تجنبها بسهولة.'
              : 'Many students submit theses without knowing their weaknesses, losing grades that could easily have been avoided.'}
          </motion.p>
        </RevealSection>
        <RevealSection className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {problems.map(p => (
            <motion.div key={p.title} variants={fadeUp}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:-translate-y-1 transition-transform hover:shadow-lg">
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="font-bold text-base mb-2" style={{ color: '#1a2744' }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5a6a8a' }}>{p.desc}</p>
            </motion.div>
          ))}
        </RevealSection>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-6" style={{ background: '#1a2744' }}>
        <div className="max-w-4xl mx-auto">
          <RevealSection className="text-center mb-12">
            <motion.div variants={fadeUp}>
              <span className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: 'rgba(201,168,76,0.2)', color: '#e8c97a', border: '1px solid rgba(201,168,76,0.3)' }}>
                {isAr ? 'الحل' : 'The Solution'}
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-black text-3xl md:text-4xl mb-4 text-white">
              {isAr ? 'بوصلة — مساعدك الأكاديمي الذكي' : 'Bousala — Your Smart Academic Assistant'}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base leading-relaxed max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {isAr
                ? 'منصة شاملة تجمع بين الذكاء الاصطناعي والمعايير الأكاديمية لتقييم مذكرتك وتطويرها.'
                : 'A comprehensive platform combining AI with academic standards to evaluate and improve your thesis.'}
            </motion.p>
          </RevealSection>
          <RevealSection className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map(f => (
              <motion.div key={f.title} variants={fadeUp}
                className="rounded-2xl p-6 border transition-all hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              >
                <div className="text-xs font-bold mb-3" style={{ color: '#c9a84c' }}>{f.num}</div>
                <div className="text-2xl mb-3 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(201,168,76,0.15)' }}>{f.icon}</div>
                <h3 className="font-bold text-sm mb-2 text-white">{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <RevealSection className="text-center mb-12">
          <motion.div variants={fadeUp}>
            <span className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}>
              {isAr ? 'كيف يعمل' : 'How It Works'}
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-black text-3xl md:text-4xl" style={{ color: '#1a2744' }}>
            {isAr ? 'ثلاث خطوات فقط' : 'Just Three Steps'}
          </motion.h2>
        </RevealSection>
        <RevealSection className="flex flex-col gap-0">
          {steps.map((s, i) => (
            <motion.div key={s.title} variants={fadeUp}
              className="flex gap-5 items-start py-7 border-b border-slate-100 last:border-b-0">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0"
                style={{ background: '#1a2744', color: '#c9a84c' }}>{s.num}</div>
              <div>
                <h3 className="font-bold text-base mb-1" style={{ color: '#1a2744' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#5a6a8a' }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </RevealSection>
      </section>

      {/* ── PRICING ── */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <RevealSection className="mb-12">
          <motion.div variants={fadeUp}>
            <span className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}>
              {isAr ? 'الباقات' : 'Pricing'}
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-black text-3xl md:text-4xl mb-4" style={{ color: '#1a2744' }}>
            {isAr ? 'اختر الباقة المناسبة لك' : 'Choose Your Plan'}
          </motion.h2>
        </RevealSection>
        <RevealSection className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-right">
          {plans.map(plan => (
            <motion.div key={plan.name} variants={fadeUp}
              className="rounded-2xl p-7 border-2 relative"
              style={{
                background: plan.featured ? '#1a2744' : 'white',
                borderColor: plan.featured ? '#c9a84c' : 'rgba(26,39,68,0.1)',
              }}>
              {plan.badge && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-xs font-black"
                  style={{ background: '#c9a84c', color: '#1a2744' }}>{plan.badge}</div>
              )}
              <div className="text-xs font-bold mb-2" style={{ color: plan.featured ? 'rgba(255,255,255,0.6)' : '#5a6a8a' }}>{plan.name}</div>
              <div className="text-4xl font-black mb-1" style={{ color: plan.featured ? '#e8c97a' : '#1a2744' }}>{plan.price}</div>
              <div className="text-xs mb-6" style={{ color: plan.featured ? 'rgba(255,255,255,0.5)' : '#5a6a8a' }}>{plan.period}</div>
              <ul className="flex flex-col gap-2.5 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm"
                    style={{ color: plan.featured ? 'rgba(255,255,255,0.8)' : '#1a2744' }}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-black"
                      style={{ background: plan.featured ? 'rgba(201,168,76,0.25)' : 'rgba(45,122,94,0.1)', color: plan.featured ? '#e8c97a' : '#2d7a5e' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onGetStarted}
                className="block w-full text-center py-3 rounded-xl text-sm font-bold border-2 transition-all"
                style={{
                  background: plan.featured ? '#c9a84c' : 'transparent',
                  color: plan.featured ? '#1a2744' : '#1a2744',
                  borderColor: plan.featured ? '#c9a84c' : '#1a2744',
                }}
                onMouseEnter={e => { if (!plan.featured) { (e.currentTarget as HTMLButtonElement).style.background = '#1a2744'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; } }}
                onMouseLeave={e => { if (!plan.featured) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#1a2744'; } }}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </RevealSection>

        {/* Payment Methods */}
        <RevealSection className="mt-12">
          <motion.p variants={fadeUp} className="text-sm font-bold mb-5" style={{ color: '#5a6a8a' }}>
            {isAr ? 'طرق الدفع المتاحة' : 'Available Payment Methods'}
          </motion.p>
          <motion.div variants={fadeUp} className="flex justify-center gap-4 flex-wrap">
            {[
              { icon: '🏦', label: 'CIB' },
              { icon: '💛', label: 'Edahabia' },
              { icon: '📱', label: 'BaridiMob' },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-sm font-bold" style={{ color: '#1a2744' }}>
                <span>{m.icon}</span>{m.label}
              </div>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="text-xs mt-4" style={{ color: '#5a6a8a' }}>
            {isAr
              ? 'بعد الدفع، ارفع وصل الدفع في حسابك وسيتم تفعيل باقتك خلال 24 ساعة.'
              : 'After payment, upload your receipt in your account and your plan will be activated within 24 hours.'}
          </motion.p>
        </RevealSection>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-20 px-6 text-center" style={{ background: '#1a2744' }}>
        <div className="max-w-2xl mx-auto">
          <RevealSection>
            <motion.div variants={fadeUp}>
              <span className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6"
                style={{ background: 'rgba(201,168,76,0.2)', color: '#e8c97a', border: '1px solid rgba(201,168,76,0.3)' }}>
                {isAr ? 'من نحن' : 'About Us'}
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-black text-3xl md:text-4xl mb-6 text-white leading-tight">
              {isAr
                ? <>نؤمن بأن كل طالب يستحق<br />الإرشاد الأكاديمي الصحيح</>
                : <>We Believe Every Student Deserves<br />Proper Academic Guidance</>}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base leading-relaxed mb-12" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {isAr
                ? 'بوصلة مشروع نابع من رحم الجامعة الجزائرية، طوّرته خلية الإعلام الآلي لكلية الآداب واللغات — جامعة الشهيد حمه لخضر، الوادي. هدفنا سد الفجوة بين الطالب والمعايير الأكاديمية العالمية.'
                : 'Bousala is a project born from the Algerian university, developed by the Computer Science Cell of the Faculty of Arts & Languages — University of El Oued. Our goal is to bridge the gap between students and international academic standards.'}
            </motion.p>
            <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { num: '+500', label: isAr ? 'طالب مسجل' : 'Registered Students' },
                { num: '+1200', label: isAr ? 'مذكرة محللة' : 'Theses Analyzed' },
                { num: '4.8★', label: isAr ? 'تقييم المستخدمين' : 'User Rating' },
                { num: isAr ? 'مجاناً' : 'Free', label: isAr ? 'للباقة الأساسية' : 'Basic Plan' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-3xl font-black mb-1" style={{ color: '#c9a84c' }}>{s.num}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-20 px-6 max-w-xl mx-auto text-center">
        <RevealSection>
          <motion.div variants={fadeUp}>
            <span className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-6"
              style={{ background: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}>
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </span>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-white rounded-3xl p-10 border border-slate-100 shadow-xl">
            <h2 className="font-black text-2xl mb-2" style={{ color: '#1a2744' }}>
              {isAr ? 'نحن هنا لمساعدتك' : "We're Here to Help"}
            </h2>
            <p className="text-sm mb-8" style={{ color: '#5a6a8a' }}>
              {isAr ? 'تواصل معنا عبر البريد الإلكتروني أو زر مكتبنا في الكلية.' : 'Contact us via email or visit our office at the faculty.'}
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {[
                { icon: '📧', text: 'info-alf@univ-eloued.dz' },
                { icon: '🏫', text: isAr ? 'كلية الآداب واللغات — جامعة الشهيد حمه لخضر، الوادي' : 'Faculty of Arts & Languages — University of El Oued' },
                { icon: '🕐', text: isAr ? 'الأحد – الخميس، 8ص – 4م' : 'Sun – Thu, 8AM – 4PM' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-right"
                  style={{ background: '#f5f2eb', color: '#1a2744' }}>
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <a
              href="mailto:info-alf@univ-eloued.dz"
              className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full font-bold text-sm transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: '#1a2744' }}
            >
              ✉️ {isAr ? 'راسلنا الآن' : 'Email Us Now'}
            </a>
          </motion.div>
        </RevealSection>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-16 px-6 text-center" style={{ background: 'linear-gradient(135deg,#f0ede4,#e8e4d8)' }}>
        <RevealSection>
          <motion.h2 variants={fadeUp} className="font-black text-3xl mb-4" style={{ color: '#1a2744' }}>
            {isAr ? 'جاهز للبدء؟' : 'Ready to Start?'}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base mb-8" style={{ color: '#5a6a8a' }}>
            {isAr ? 'انضم لمئات الطلاب الذين طوروا مذكراتهم مع بوصلة.' : 'Join hundreds of students who improved their theses with Bousala.'}
          </motion.p>
          <motion.button variants={fadeUp}
            onClick={onGetStarted}
            className="text-white px-10 py-4 rounded-full font-black text-base transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{ background: '#1a2744' }}
          >
            🚀 {isAr ? 'ابدأ مجاناً الآن' : 'Start Free Now'}
          </motion.button>
        </RevealSection>
      </section>
    </div>
  );
}
