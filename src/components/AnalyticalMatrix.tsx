import React from 'react';
import { AnalysisResult, SDGAlignment, SDGTarget } from '../types';
import { useTranslation } from 'react-i18next';
import { Shield, Target, Activity, Lightbulb, Users, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface AnalyticalMatrixProps {
  result: AnalysisResult;
}

const getSDGColor = (id: number) => {
  const colors: Record<number, string> = {
    1: 'bg-[#E5243B]', 2: 'bg-[#DDA63A]', 3: 'bg-[#4C9F38]', 4: 'bg-[#C5192D]', 5: 'bg-[#FF3A21]',
    6: 'bg-[#26BDE2]', 7: 'bg-[#FCC30B]', 8: 'bg-[#A21942]', 9: 'bg-[#FD6925]', 10: 'bg-[#DD1367]',
    11: 'bg-[#FD9D24]', 12: 'bg-[#BF8B2E]', 13: 'bg-[#3F7E44]', 14: 'bg-[#0A97D9]', 15: 'bg-[#56C02B]',
    16: 'bg-[#00689D]', 17: 'bg-[#19486A]'
  };
  return colors[id] || 'bg-slate-400';
};

const getLevelBadge = (level: number) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
        {level}
      </div>
      <div className="h-px flex-1 bg-slate-200"></div>
    </div>
  );
};

export default function AnalyticalMatrix({ result }: AnalyticalMatrixProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-8 mt-12 pt-12 border-t border-slate-100">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {isAr ? 'مصفوفة التحليل الذكية' : 'Analytical Intelligence Matrix'}
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          {isAr 
            ? 'تحليل عميق لمذكرة التخرج وفق المعايير الأممية للتنمية المستدامة' 
            : 'In-depth analysis of the thesis according to UN Sustainable Development standards'}
        </p>
      </div>

      {/* Level 3, 4, 5: The Detailed Matrix */}
      <div className="space-y-12">
        {(result.sdgs || []).map((sdg, sIdx) => (
          <div key={sdg.id} className="minimal-card overflow-hidden">
            <div className={cn("px-6 py-4 flex items-center gap-4 text-white", getSDGColor(sdg.id))}>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-2xl">
                {sdg.id}
              </div>
              <div>
                <h3 className="font-bold text-lg">{sdg.name}</h3>
                <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest leading-none">SDG {sdg.id}</p>
              </div>
              <div className="ml-auto bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                {isAr ? 'ارتباط' : 'Correlation'}: {sdg.strength === 'High' ? (isAr ? 'عالي' : 'High') : sdg.strength === 'Medium' ? (isAr ? 'متوسط' : 'Medium') : (isAr ? 'منخفض' : 'Low')}
              </div>
            </div>
            
            <div className="p-6 bg-slate-50/30">
              <p className="text-sm italic text-slate-600 mb-6 bg-white p-3 rounded-xl border border-slate-100 shadow-sm leading-relaxed">
                <span className="font-bold block mb-1 text-slate-400 uppercase text-[10px] tracking-widest not-italic">
                  {isAr ? 'التبرير' : 'Justification'}
                </span>
                {sdg.justification}
              </p>

              <div className="space-y-6">
                {(sdg.targets || []).map((target, tIdx) => (
                  <div key={target.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-5 h-5 text-indigo-500" />
                      <h4 className="font-bold text-slate-800">
                        {isAr ? 'الغاية' : 'Target'} {target.id}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed bg-slate-50 p-3 rounded-xl">
                      {target.description}
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                      {(target.indicators || []).map((indicator, iIdx) => (
                        <div key={indicator.id} className="border-t border-slate-50 pt-4 first:border-0 first:pt-0">
                          <div className="flex items-center gap-3 mb-3">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                              {isAr ? 'المؤشر' : 'Indicator'} {indicator.id}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-700 mb-4 ml-7">
                            {indicator.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ml-7">
                            <div className={cn(
                              "p-3 rounded-xl border flex flex-col items-center justify-center text-center",
                              indicator.assessment.measuresDirectly ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-slate-100 text-slate-400"
                            )}>
                              <p className="text-[9px] font-bold uppercase mb-1">{isAr ? 'قياس مباشر' : 'Direct Measurement'}</p>
                              {indicator.assessment.measuresDirectly ? <Shield className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-current opacity-20" />}
                            </div>
                            <div className={cn(
                              "p-3 rounded-xl border flex flex-col items-center justify-center text-center",
                              indicator.assessment.suggestsSolutions ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "bg-slate-50 border-slate-100 text-slate-400"
                            )}>
                              <p className="text-[9px] font-bold uppercase mb-1">{isAr ? 'اقتراح حلول' : 'Suggests Solutions'}</p>
                              {indicator.assessment.suggestsSolutions ? <Lightbulb className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-current opacity-20" />}
                            </div>
                            <div className={cn(
                              "p-3 rounded-xl border flex flex-col items-center justify-center text-center",
                              indicator.assessment.collectsData ? "bg-amber-50 border-amber-100 text-amber-700" : "bg-slate-50 border-slate-100 text-slate-400"
                            )}>
                              <p className="text-[9px] font-bold uppercase mb-1">{isAr ? 'جمع بيانات' : 'Collects Data'}</p>
                              {indicator.assessment.collectsData ? <Globe className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-current opacity-20" />}
                            </div>
                            <div className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center text-center">
                              <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">{isAr ? 'درجة الإسهام' : 'Contribution Score'}</p>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <div 
                                    key={star} 
                                    className={cn(
                                      "w-3 h-3 rounded-full",
                                      star <= indicator.assessment.contributionScore ? "bg-oued-gold" : "bg-slate-200"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {indicator.assessment.notes && (
                            <div className="mt-3 p-3 bg-indigo-50/30 rounded-xl border border-indigo-100/50 ml-7">
                              <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1">{isAr ? 'ملاحظة التقييم' : 'Assessment Note'}</p>
                              <p className="text-xs text-slate-600 leading-relaxed italic">{indicator.assessment.notes}</p>
                            </div>
                          )}
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

      {/* Level 6: Smart Recommendations */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-oued-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
              <Lightbulb className="w-6 h-6 text-oued-gold" />
            </div>
            <h2 className="text-2xl font-bold">{isAr ? 'التوصيات الذكية' : 'Smart Recommendations'}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-oued-gold mb-4">
                <Target className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-widest">{isAr ? 'غايات بديلة' : 'Other Targets'}</h4>
              </div>
              <ul className="space-y-3">
                {(result.recommendations?.otherTargets || []).map((target, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm opacity-90 leading-relaxed border-l border-white/20 pl-4 py-1">
                    {target}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-4">
                <Activity className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-widest">{isAr ? 'مؤشرات مستقبلية' : 'Future Indicators'}</h4>
              </div>
              <ul className="space-y-3">
                {(result.recommendations?.futureIndicators || []).map((indicator, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm opacity-90 leading-relaxed border-l border-white/20 pl-4 py-1">
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 mb-4">
                <Users className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-widest">{isAr ? 'تخصصات مكملة' : 'Complementary Fields'}</h4>
              </div>
              <ul className="space-y-3">
                {(result.recommendations?.complementarySpecializations || []).map((field, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm opacity-90 leading-relaxed border-l border-white/20 pl-4 py-1">
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
