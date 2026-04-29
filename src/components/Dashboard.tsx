import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Treemap } from 'recharts';
import { AnalysisResult } from '../types';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import Tooltip from './ui/Tooltip';

import AnalyticalMatrix from './AnalyticalMatrix';

interface DashboardProps {
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

const getStrengthClass = (strength: string) => {
  switch (strength) {
    case 'Strong': return 'text-emerald-600 bg-emerald-50';
    case 'Moderate': return 'text-amber-600 bg-amber-50';
    case 'Weak': return 'text-slate-500 bg-slate-50';
    default: return 'text-slate-500 bg-slate-50';
  }
};

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, id, name, size, lang } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: getSDGColor(id).replace('bg-[', '').replace(']', ''),
          fillOpacity: 0.8,
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
        className="transition-all hover:fill-opacity-100 cursor-pointer"
      />
      {width > 60 && height > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 5}
            textAnchor="middle"
            fill="#fff"
            fontSize={width > 100 ? 12 : 10}
            fontWeight="bold"
            className="pointer-events-none"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            fill="#fff"
            fillOpacity={0.8}
            fontSize={width > 100 ? 10 : 8}
            className="pointer-events-none"
          >
            {size}%
          </text>
        </>
      )}
    </g>
  );
};

export default function Dashboard({ result }: DashboardProps) {
  const { t, i18n } = useTranslation();
  
  const METRIC_DESCRIPTIONS: Record<string, string> = {
    'Overall Score': t('dashboard.indexDesc'),
    'Environmental Depth': t('dashboard.envDesc'),
    'Environmental Impact': t('dashboard.envDesc'),
    'Social Impact': t('dashboard.socDesc'),
    'Economic Feasibility': t('dashboard.ecoDesc'),
    'Economic Impact': t('dashboard.ecoDesc'),
    'Materiality': t('dashboard.matDesc'),
    'Future Scalability': t('dashboard.scalDesc')
  };

  const pillarData = (result.pillars || []).map(p => ({
    subject: p.name,
    A: ((p.score || 0) / 5) * 100, // Normalize to 100 for radar
    fullMark: 100,
  }));

  const benchmarkData = (result.benchmarks || []).map(b => ({
    subject: b.name,
    Score: b.score || 0,
    Benchmark: b.benchmark || 0,
    Description: b.description || '',
    fullMark: 100,
  }));

  const sdgData = (result.sdgs || []).map(s => ({
    name: i18n.language === 'ar' ? s.name : s.label,
    id: s.id,
    size: s.percentage || 0,
    strength: s.strength || 'Weak'
  }));

  return (
    <div id="dashboard-content-pdf" className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="minimal-card bg-linear-to-r from-oued-blue/10 to-transparent border-oued-blue/20">
          <p className="text-[10px] font-bold text-oued-blue uppercase tracking-widest mb-1">{t('dashboard.specialization') || 'Specialization'}</p>
          <p className="text-lg font-bold text-slate-800">{result.specialization}</p>
        </div>
        <div className="minimal-card bg-linear-to-r from-oued-gold/10 to-transparent border-oued-gold/20">
          <p className="text-[10px] font-bold text-oued-gold uppercase tracking-widest mb-1">{t('dashboard.sustainabilityField') || 'Sustainability Field'}</p>
          <p className="text-lg font-bold text-slate-800">{result.sustainabilityField}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic Industry Benchmarks Chart */}
        <div className="lg:col-span-12 minimal-card">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('dashboard.industryCompare')}</h3>
              <Tooltip content={t('dashboard.industryCompareDesc')}>
                <Info className="w-3 h-3 text-slate-300 cursor-help" />
              </Tooltip>
            </div>
          </div>
          <div className="h-[250px] md:h-[350px]">
            {benchmarkData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={benchmarkData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                  <RechartsTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700 max-w-[200px]" style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>
                            <p className="font-bold mb-2">{data.subject}</p>
                            <div className="space-y-1 mb-2">
                               <p className="flex justify-between gap-4">
                                 <span className="opacity-70">{t('dashboard.yourResearch')}:</span>
                                 <span className="text-oued-gold">{data.Score}/100</span>
                               </p>
                               <p className="flex justify-between gap-4">
                                 <span className="opacity-70">{t('dashboard.sectorAverage')}:</span>
                                 <span>{data.Benchmark}/100</span>
                               </p>
                            </div>
                            <p className="text-[10px] leading-tight opacity-80 pt-2 border-t border-slate-700">
                              {data.Description}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Radar
                     name={t('dashboard.sectorAverage')}
                     dataKey="Benchmark"
                     stroke="#94a3b8"
                     fill="#94a3b8"
                     strokeDasharray="4 4"
                     fillOpacity={0.05}
                  />
                  <Radar
                     name={t('dashboard.yourResearch')}
                     dataKey="Score"
                     stroke="#c5a059"
                     fill="#c5a059"
                     fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
                No benchmark data available
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-4 px-4 overflow-x-auto pb-2">
             {(result.benchmarks || []).map((b, idx) => (
                <Tooltip key={idx} content={b.description}>
                   <div className="flex items-center gap-2 cursor-help whitespace-nowrap">
                      <div className="w-1.5 h-1.5 bg-oued-gold rounded-full" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{b.name}</span>
                   </div>
                </Tooltip>
             ))}
          </div>
        </div>

        {/* Score Overview */}
        <div className="lg:col-span-4 minimal-card flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('dashboard.index')}</h3>
            <Tooltip content={METRIC_DESCRIPTIONS['Overall Score']}>
              <Info className="w-3 h-3 text-slate-300 cursor-help" />
            </Tooltip>
          </div>
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-100"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={552.92}
                initial={{ strokeDashoffset: 552.92 }}
                animate={{ strokeDashoffset: 552.92 - (552.92 * (result.overallScore || 0)) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-oued-gold"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-slate-900">{result.overallScore || 0}</span>
              <span className="text-sm font-medium text-slate-400">{t('dashboard.score')}</span>
            </div>
          </div>
          <p className="mt-6 status-chip">
            {(result.overallScore || 0) > 70 ? t('dashboard.strongAlignment') : (result.overallScore || 0) > 40 ? t('dashboard.moderatePotential') : t('dashboard.needsOptimization')}
          </p>
        </div>

        {/* Pillar Radar */}
        <div className="lg:col-span-8 minimal-card">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('dashboard.radarTitle')}</h3>
              <Tooltip content={t('dashboard.radarDesc')}>
                <Info className="w-3 h-3 text-slate-300 cursor-help" />
              </Tooltip>
            </div>
          </div>
          <div className="h-[250px] md:h-[350px]">
            {pillarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={pillarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textAlign: i18n.language === 'ar' ? 'right' : 'left'
                    }} 
                  />
                  <Radar
                     name={t('dashboard.score')}
                     dataKey="A"
                     stroke="#2b4c7e"
                     fill="#2b4c7e"
                     fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
                No pillar data available
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
             {(result.pillars || []).map((p, idx) => (
                <div 
                  key={idx} 
                  className="text-center p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="text-lg font-bold text-slate-800">{p.score}/5</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">{p.name}</div>
                  
                  <div className="pt-2 border-t border-slate-50">
                    <p className="text-[9px] text-slate-400 italic line-clamp-2 group-hover:line-clamp-none transition-all cursor-default">
                      {p.comment}
                    </p>
                    {p.notes && (
                      <p className="mt-1 text-[8px] font-bold text-oued-blue opacity-0 group-hover:opacity-100 transition-opacity">
                         {p.notes}
                      </p>
                    )}
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* SDGs Section */}
      <div className="minimal-card space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />
          <h3 className="font-bold text-slate-800">{t('dashboard.impactDist')}</h3>
          <p className="text-xs text-slate-400 font-medium ml-auto">{t('dashboard.unSdgs')}</p>
        </div>

        {/* Visual Distribution Treemap */}
        <div className="h-[350px] w-full bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden p-4">
          {sdgData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={sdgData}
                dataKey="size"
                stroke="#fff"
                content={<CustomTreemapContent lang={i18n.language} />}
              >
                <RechartsTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700" style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>
                          <div className="font-bold flex items-center gap-2 mb-1">
                            <span className={cn("w-4 h-4 rounded-sm flex items-center justify-center text-[10px]", getSDGColor(data.id))}>
                              {data.id}
                            </span>
                            {data.name}
                          </div>
                          <div className="opacity-70">{t('dashboard.focusScore')}: {data.size}%</div>
                          <div className="opacity-70">{t('dashboard.strength')}: {data.strength}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </Treemap>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
              No SDG data available
            </div>
          )}
        </div>

        {/* Top Priority SDGs Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-indigo-50/30 p-6 rounded-3xl border border-indigo-100/50">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">{t('dashboard.primaryFocus')}</h4>
            <div className="space-y-6">
              {(result.sdgs || []).sort((a,b) => b.percentage - a.percentage).slice(0, 3).map((sdg, idx) => (
                <div key={sdg.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className={cn("w-6 h-6 rounded flex items-center justify-center text-white text-[10px]", getSDGColor(sdg.id))}>
                        {sdg.id}
                      </span>
                      {i18n.language === 'ar' ? sdg.name : sdg.label}
                    </span>
                    <span>{sdg.percentage}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sdg.percentage}%` }}
                      transition={{ delay: idx * 0.2, duration: 1 }}
                      className={cn("h-full", getSDGColor(sdg.id))}
                    />
                  </div>
                  <div className="flex justify-end">
                    <span className={cn("text-[8px] px-2 py-0.5 rounded-full font-bold uppercase", getStrengthClass(sdg.strength))}>
                      {sdg.strength} {i18n.language === 'ar' ? 'ارتباط' : 'Correlation'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={cn("hidden lg:flex flex-col justify-center", i18n.language === 'ar' ? "border-r pr-8" : "border-l pl-8")}>
            <h4 className="text-sm font-bold text-slate-800 mb-2">{t('dashboard.impactSummary')}</h4>
            <p className="text-sm text-slate-500 leading-relaxed italic">
              {i18n.language === 'ar' ? (
                <>
                  يظهر بحثك توافقاً قوياً مع الهدف {(result.sdgs || [])[0]?.id}, مما يشير إلى إمكانات كبيرة لـ {(result.sdgs || [])[0]?.name}.
                  التركيز على هذه المجالات الرئيسية سيعظم أثر الاستدامة لنتائجك.
                </>
              ) : (
                <>
                  Your research demonstrates strong alignment with Goal {(result.sdgs || [])[0]?.id}, showing significant potential for {(result.sdgs||[])[0]?.label?.toLowerCase() || 'selected areas'}.
                  Focusing on these key areas will maximize the sustainability footprint of your findings.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(result.sdgs || []).sort((a,b) => b.percentage - a.percentage).map((sdg) => (
            <motion.div 
              key={sdg.id} 
              whileHover={{ y: -4 }}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0", getSDGColor(sdg.id))}>
                  {sdg.id}
                </div>
                <div className="min-w-0">
                   <h4 className="text-sm font-bold text-slate-800 truncate">{i18n.language === 'ar' ? sdg.name : sdg.label}</h4>
                   <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-tight">{i18n.language === 'ar' ? sdg.label : sdg.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex-1" style={{ marginRight: i18n.language === 'ar' ? '0' : '1rem', marginLeft: i18n.language === 'ar' ? '1rem' : '0' }}>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sdg.percentage}%` }}
                      className={cn("h-full", getSDGColor(sdg.id))}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">{sdg.percentage}%</span>
                  <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase", getStrengthClass(sdg.strength))}>
                    {sdg.strength}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Strengths & Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className={cn(
             "minimal-card bg-linear-to-br from-white to-oued-blue/5 shadow-sm hover:shadow-md transition-shadow",
             i18n.language === 'ar' ? "border-r-4 border-r-oued-blue" : "border-l-4 border-l-oued-blue"
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-oued-blue/10 rounded-lg text-oued-blue">
               <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800">{t('dashboard.strengthsTitle')}</h3>
            <Tooltip content={t('dashboard.strengthsDesc')}>
              <Info className="w-3 h-3 text-slate-300 cursor-help" />
            </Tooltip>
          </div>
          <ul className="space-y-4">
            {(result.strengths || []).map((strength, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-oued-blue flex items-center justify-center shrink-0 mt-0.5">
                   <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-slate-700 leading-relaxed font-medium">{strength}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
          className={cn(
            "minimal-card bg-linear-to-br from-white to-oued-gold/5 shadow-sm hover:shadow-md transition-shadow",
            i18n.language === 'ar' ? "border-r-4 border-r-oued-gold" : "border-l-4 border-l-oued-gold"
         )}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-oued-gold/20 rounded-lg text-oued-gold">
               <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800">{t('dashboard.opportunitiesTitle')}</h3>
            <Tooltip content={t('dashboard.opportunitiesDesc')}>
              <Info className="w-3 h-3 text-slate-300 cursor-help" />
            </Tooltip>
          </div>
          <ul className="space-y-4">
            {(result.opportunities || []).map((opp, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-oued-gold flex items-center justify-center shrink-0 mt-0.5">
                   <Info className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-slate-700 leading-relaxed font-medium">{opp}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* The Intelligence Matrix Section */}
      <AnalyticalMatrix result={result} />
    </div>
  );
}

