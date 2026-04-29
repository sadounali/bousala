import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, RadarProps, Radar as RechartsRadar } from 'recharts';
import { AnalysisResult } from '../types';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronLeft, Minus, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ComparisonPanelProps {
  results: [AnalysisResult, AnalysisResult];
  names: [string, string];
  onBack: () => void;
}

export default function ComparisonPanel({ results, names, onBack }: ComparisonPanelProps) {
  const { t, i18n } = useTranslation();
  const [a, b] = results;
  const [nameA, nameB] = names;

  const scoreDiff = b.overallScore - a.overallScore;

  const chartData = a.metrics.map((m, idx) => ({
    subject: m.name,
    A: m.score,
    B: b.metrics[idx]?.score || 0,
    fullMark: 100,
  }));

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors group"
        >
          <ChevronLeft className={cn("w-4 h-4 group-hover:-translate-x-1 transition-transform", i18n.language === 'ar' ? "rotate-180" : "")} />
          {t('comparison.back')}
        </button>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t('comparison.title')}</h2>
        <div className="w-24" /> {/* Spacer */}
      </div>

      {/* Score Comparison Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="minimal-card text-center relative overflow-hidden">
          <div className={cn("absolute top-0 w-1 h-full bg-slate-200", i18n.language === 'ar' ? "right-0" : "left-0")} />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{nameA}</p>
          <div className="text-4xl font-bold text-slate-900">{a.overallScore}</div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-2",
            scoreDiff > 0 ? "bg-oued-blue/10 text-oued-blue" : scoreDiff < 0 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"
          )}>
            {scoreDiff > 0 ? <TrendingUp /> : scoreDiff < 0 ? <TrendingDown /> : <Minus />}
          </div>
          <div className={cn(
            "text-lg font-bold",
            scoreDiff > 0 ? "text-oued-blue" : scoreDiff < 0 ? "text-amber-600" : "text-slate-400"
          )}>
            {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} {t('comparison.diff')}
          </div>
        </div>

        <div className="minimal-card text-center relative overflow-hidden">
          <div className={cn("absolute top-0 w-1 h-full bg-oued-gold", i18n.language === 'ar' ? "left-0" : "right-0")} />
          <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-2", i18n.language === 'ar' ? "text-oued-gold" : "text-oued-gold")}>{nameB}</p>
          <div className="text-4xl font-bold text-slate-900">{b.overallScore}</div>
        </div>
      </div>

      {/* Radar Comparison */}
      <div className="minimal-card h-[400px]">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">{t('comparison.variance')}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
            <RechartsRadar
              name={nameA}
              dataKey="A"
              stroke="#94a3b8"
              fill="#94a3b8"
              fillOpacity={0.1}
            />
            <RechartsRadar
              name={nameB}
              dataKey="B"
              stroke="#c5a059"
              fill="#c5a059"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-slate-300" />
            <span className="text-xs font-bold text-slate-500">{nameA}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-oued-gold" />
            <span className="text-xs font-bold text-slate-500">{nameB}</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{nameA} {t('comparison.strengths')}</h3>
          <div className="minimal-card bg-slate-50/50 border-none space-y-3">
            {a.strengths.map((s, i) => (
              <div key={i} className="flex gap-2 text-xs text-slate-600 font-medium">
                <span className="text-slate-400">•</span> {s}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-oued-gold uppercase tracking-[0.2em]">{nameB} {t('comparison.strengths')}</h3>
          <div className="minimal-card border-oued-gold/20 bg-oued-gold/5 space-y-3">
            {b.strengths.map((s, i) => (
              <div key={i} className="flex gap-2 text-xs text-oued-gold font-bold">
                <span className="text-oued-gold">✓</span> {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions Comparison */}
      <div className="minimal-card">
         <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">{t('comparison.recommendations')}</h3>
         <div className="space-y-4">
            <p className="text-xs text-slate-500 italic mb-4">
              {t('comparison.comparing', { nameA, nameB })}
            </p>
            {/* Simple list of B's suggestions as "Current Focus" */}
            <div className="grid grid-cols-1 gap-4">
              {b.suggestions.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-oued-blue text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.suggestion}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.category} • {i18n.language === 'ar' ? (item.priority === 'High' ? 'عالي' : 'منخفض') : item.priority} {t('advisory.priority')}</p>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}

