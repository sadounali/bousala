import React from 'react';
import { AnalysisResult, PillarScore } from '../types';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, User, BookOpen, School, Calendar, MapPin, Award, Activity, TrendingUp, HelpCircle } from 'lucide-react';
import { CompassLogo } from './CompassLogo';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ReportTemplateProps {
  result: AnalysisResult;
  studentInfo: any;
  thesisInfo: any;
  serialNumber: string;
}

export const ReportTemplate: React.FC<ReportTemplateProps> = ({ result, studentInfo, thesisInfo, serialNumber }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const getSdgColor = (id: number) => {
    const colors: Record<number, string> = {
      1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D', 5: '#FF3A21',
      6: '#26BDE2', 7: '#FCC30B', 8: '#A21942', 9: '#FD6925', 10: '#DD1367',
      11: '#FD9D24', 12: '#BF8B2E', 13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B',
      16: '#00689D', 17: '#19486A'
    };
    return colors[id] || '#64748b';
  };

  const pillarData = (result.pillars || []).map(p => ({
    subject: p.name,
    A: ((p.score || 0) / 5) * 100,
    fullMark: 100,
  }));

  return (
    <div 
      className={`bg-white text-slate-900 w-[1200px] font-sans ${isAr ? 'font-arabic' : ''}`}
      dir={isAr ? 'rtl' : 'ltr'}
      style={isAr ? { lineHeight: '1.8' } : {}}
    >
      {/* PAGE 1: COVER */}
      <div id="pdf-page-1" className="p-[60px] min-h-[1600px] flex flex-col relative border-b-2 border-slate-100 bg-white">
        <div className="absolute top-0 left-0 right-0 h-4 bg-oued-blue"></div>
        
        <div className="flex justify-between items-start mb-16">
          <div className="flex items-center gap-6">
            <CompassLogo size={80} animate={false} />
            <div>
              <h1 className="text-4xl font-black text-oued-blue tracking-tighter mb-1">{t('nav.title')}</h1>
              <p className="text-oued-gold font-bold text-lg">{t('nav.subtitle')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Official Document</p>
            <p className="text-sm font-bold text-slate-900 mb-2">{serialNumber}</p>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-wider ${isAr ? 'flex-row-reverse' : ''} bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm shadow-emerald-100`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isAr ? 'تم التحقق من الأثر' : 'IMPACT VERIFIED'}
            </div>
          </div>
        </div>

        <div className="text-center mb-20 space-y-6 pt-10">
          <h2 className="text-6xl font-black text-slate-900 leading-tight">
            {isAr ? 'تقرير تقييم الأثر المرجعي' : 'Sustainability Impact Assessment Report'}
          </h2>
          <div className="w-24 h-1.5 bg-oued-gold mx-auto rounded-full"></div>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto uppercase tracking-wide">
            {isAr ? 'نتائج تدقيق مواءمة مذكرات التخرج' : 'Thesis Alignment Audit Results'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-20 items-center mb-20">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-80 h-80 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="160" cy="160" r="140" stroke="#f8fafc" strokeWidth="20" fill="transparent" />
                <circle
                  cx="160" cy="160" r="140" stroke="#1b365d" strokeWidth="20" fill="transparent"
                  strokeDasharray={2 * Math.PI * 140}
                  strokeDashoffset={2 * Math.PI * 140 * (1 - (result.overallScore || 0) / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-7xl font-black text-oued-blue leading-none">{result.overallScore || 0}%</span>
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest mt-2">{isAr ? 'مؤشر التوافق' : 'Compatibility Index'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
              <User className="w-4 h-4" />
              {isAr ? 'بيانات الطالب والمشروع' : 'Student & Project Data'}
            </h3>
            <div className="space-y-6">
              <InfoItem label={isAr ? 'الاسم واللقب' : 'Student Name'} value={studentInfo.fullName || 'N/A'} icon={<User className="w-4 h-4" />} />
              <InfoItem label={isAr ? 'الكلية' : 'Faculty'} value={studentInfo.faculty || 'N/A'} icon={<School className="w-4 h-4" />} />
              <InfoItem label={isAr ? 'القسم' : 'Department'} value={studentInfo.department || 'N/A'} icon={<Activity className="w-4 h-4" />} />
              <div className="h-px bg-slate-200 my-2"></div>
              <InfoItem label={isAr ? 'عنوان المذكرة' : 'Thesis Title'} value={thesisInfo.title || 'N/A'} icon={<BookOpen className="w-4 h-4" />} />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-20">
          <h3 className="text-center text-xs font-black text-slate-400 uppercase tracking-widest mb-10">{isAr ? 'الأهداف المستدامة المحققة' : 'Achieved Sustainable Development Goals'}</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {(result.sdgs || []).filter(s => (s.percentage || 0) > 0).map(sdg => (
              <div key={sdg.id} className="flex flex-col items-center" style={{ width: '100px' }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white mb-2 shadow-lg" style={{ backgroundColor: getSdgColor(sdg.id) }}>
                  <span className="text-2xl font-black">{sdg.id}</span>
                </div>
                <span className="text-[10px] font-black text-center text-slate-500 uppercase line-clamp-2 leading-tight">{isAr ? sdg.name : sdg.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>University of El Oued - Sustainability Office</span>
          <span>{new Date().toLocaleDateString(isAr ? 'ar-DZ' : 'en-US')}</span>
          <span>Page 01 / 02</span>
        </div>
      </div>

      {/* PAGE 2: DETAILED ANALYSIS */}
      <div id="pdf-page-2" className="p-[60px] min-h-[1600px] flex flex-col relative bg-white">
        <div className="absolute top-0 left-0 right-0 h-4 bg-oued-gold"></div>

        <div className="grid grid-cols-2 gap-16 mb-16 items-start">
          <div>
            <h2 className="text-2xl font-black text-oued-blue mb-8 flex items-center gap-4">
              <TrendingUp className="w-8 h-8" />
              {isAr ? 'تحليل مجالات التركيز' : 'Focus Areas Analysis'}
            </h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={pillarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 900 }} />
                  <Radar name="Impact Score" dataKey="A" stroke="#1b365d" fill="#1b365d" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="space-y-8 pt-12">
            {(result.pillars || []).map((pillar, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black text-slate-700 uppercase">{pillar.name}</span>
                  <span className="text-lg font-black text-oued-blue">{((pillar.score || 0) / 5 * 100).toFixed(0)}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-oued-blue" style={{ width: `${((pillar.score || 0) / 5) * 100}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 italic">{pillar.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-oued-blue text-white p-10 rounded-[40px] shadow-xl mb-12">
           <h3 className="text-xs font-black text-oued-gold uppercase tracking-widest mb-4">{isAr ? 'الخلاصة التقييمية' : 'Assessment Executive Summary'}</h3>
           <p className="text-lg leading-relaxed font-medium">
             {isAr 
               ? `بناءً على التحليل المعمق باستخدام خوارزميات بوصلة، تم تحديد مواءمة قوية مع ركائز التنمية المستدامة. سجلت المذكرة نقاطاً عالية في ${result.pillars.sort((a,b) => (b.score||0) - (a.score||0))[0]?.name} بنسبة نمو متوقعة عالية.`
               : `Based on in-depth analysis using Bousala algorithms, strong alignment with sustainable development pillars has been identified. The thesis scored high in ${result.pillars.sort((a,b) => (b.score||0) - (a.score||0))[0]?.name} with high expected growth potential.`}
           </p>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-16">
          <div className="bg-emerald-50 p-8 rounded-[30px] border border-emerald-100">
            <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {isAr ? 'مكاسب الاستدامة' : 'Sustainability Gains'}
            </h3>
            <ul className="space-y-4">
              {(result.strengths || []).map((str, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                  {str}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 p-8 rounded-[30px] border border-amber-100">
            <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {isAr ? 'توصيات التحسين' : 'Improvement Recommendations'}
            </h3>
            <ul className="space-y-4">
              {(result.opportunities || []).map((opp, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                  {opp}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-20">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{isAr ? 'خارطة طريق التطوير المقترحة' : 'Suggested Development Roadmap'}</h3>
          <div className="grid grid-cols-2 gap-6">
            {(result.suggestions || []).slice(0, 4).map((sug, i) => (
              <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase">{sug.category}</span>
                  <span className={`text-[10px] font-black ${sug.priority === 'High' ? 'text-red-500' : 'text-emerald-500'}`}>{sug.priority}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-relaxed">{sug.suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-10">
          <SignatureBox title={isAr ? 'توقيع رئيس اللجنة' : "Chairperson's Signature"} />
          <SignatureBox title={isAr ? 'توقيع المشرف العلمي' : 'Supervisor Signature'} />
          <SignatureBox title={isAr ? 'ختم الإدارة' : 'Administrative Seal'} />
        </div>

        <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>{isAr ? 'تم الإصدار بواسطة نظام بوصلة الذكي - جامعة الوادي' : 'Issued by Bousala System - University of El Oued'}</span>
          <span>Page 02 / 03</span>
        </div>
      </div>

      {/* PAGE 3: ANALYTICAL MATRIX & RECOMMENDATIONS */}
      <div id="pdf-page-3" className="p-[60px] min-h-[1600px] flex flex-col relative bg-white">
        <div className="absolute top-0 left-0 right-0 h-4 bg-slate-900"></div>

        <div className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
            {isAr ? 'مصفوفة التحليل الذكية (SDG Matrix)' : 'Analytical SDG Matrix'}
          </h2>
          <div className="w-20 h-1 bg-oued-gold rounded-full"></div>
        </div>

        <div className="space-y-10">
          {(result.sdgs || []).map((sdg) => (
            <div key={sdg.id} className="border border-slate-200 rounded-3xl overflow-hidden bg-slate-50/30">
              <div className="px-6 py-4 flex items-center gap-4 text-white" style={{ backgroundColor: getSdgColor(sdg.id) }}>
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-black text-xl">
                  {sdg.id}
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase">{sdg.name}</h3>
                  <p className="text-[8px] font-black opacity-80">SDG {sdg.id} • {sdg.strength.toUpperCase()} CORRELATION</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6 pb-6 border-b border-white">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{isAr ? 'تبرير الارتباط' : 'Mapping Justification'}</p>
                   <p className="text-xs font-medium text-slate-700 leading-relaxed italic">{sdg.justification}</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {(sdg.targets || []).map((target) => (
                    <div key={target.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-oued-blue"></span>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{isAr ? 'الغاية' : 'Target'} {target.id}:</h4>
                        <p className="text-xs font-medium text-slate-600 leading-tight">{target.description}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 ml-4 mt-4">
                        {(target.indicators || []).map((indicator) => (
                          <div key={indicator.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                             <div className="flex items-start gap-3">
                                <div className="text-[8px] font-black px-1.5 py-0.5 bg-slate-900 text-white rounded mt-0.5">{indicator.id}</div>
                                <div className="flex-1">
                                   <p className="text-xs font-bold text-slate-800 mb-3">{indicator.description}</p>
                                   <div className="grid grid-cols-4 gap-2">
                                      <AssessmentBox active={indicator.assessment.measuresDirectly} label={isAr ? 'قياس مباشر' : 'Measurement'} />
                                      <AssessmentBox active={indicator.assessment.suggestsSolutions} label={isAr ? 'حلول' : 'Solutions'} />
                                      <AssessmentBox active={indicator.assessment.collectsData} label={isAr ? 'بيانات' : 'Data'} />
                                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white border border-slate-100">
                                         <p className="text-[7px] font-black text-slate-400 uppercase mb-1">{isAr ? 'الإسهام' : 'Score'}</p>
                                         <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(s => <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= indicator.assessment.contributionScore ? 'bg-oued-gold' : 'bg-slate-200'}`} />)}
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xs font-black text-oued-gold uppercase tracking-widest mb-8">{isAr ? 'التوصيات الذكية والمستقبلية' : 'Smart Future Recommendations'}</h3>
            <div className="grid grid-cols-3 gap-10">
              <div>
                <p className="text-[9px] font-black text-oued-gold uppercase mb-4 tracking-widest">{isAr ? 'غايات إضافية' : 'Other Targets'}</p>
                <ul className="space-y-3 opacity-90 text-[10px] font-bold">
                  {(result.recommendations?.otherTargets || []).map((t, i) => <li key={i} className="border-l border-white/20 pl-3">- {t}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-[9px] font-black text-emerald-400 uppercase mb-4 tracking-widest">{isAr ? 'مؤشرات للقياس' : 'Future Indicators'}</p>
                <ul className="space-y-3 opacity-90 text-[10px] font-bold">
                  {(result.recommendations?.futureIndicators || []).map((t, i) => <li key={i} className="border-l border-white/20 pl-3">- {t}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-[9px] font-black text-indigo-400 uppercase mb-4 tracking-widest">{isAr ? 'تخصصات مكملة' : 'Cross-Fields'}</p>
                <ul className="space-y-3 opacity-90 text-[10px] font-bold">
                  {(result.recommendations?.complementarySpecializations || []).map((t, i) => <li key={i} className="border-l border-white/20 pl-3">- {t}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>{isAr ? 'تم الإصدار بواسطة نظام بوصلة الذكي - جامعة الوادي' : 'Issued by Bousala System - University of El Oued'}</span>
          <span>Page 03 / 03</span>
        </div>
      </div>
    </div>
  );
};

const AssessmentBox = ({ active, label }: { active: boolean, label: string }) => (
  <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${active ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
    <p className="text-[7px] font-black uppercase">{label}</p>
    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${active ? 'bg-indigo-600' : 'border border-slate-300'}`}></div>
  </div>
);

const InfoItem = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 mt-0.5">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-800 leading-tight whitespace-pre-wrap">{value}</p>
    </div>
  </div>
);

const SignatureBox = ({ title }: { title: string }) => (
  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 h-40 flex flex-col justify-between">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{title}</p>
    <div className="h-px bg-slate-200"></div>
  </div>
);
