import React, { useState, useMemo } from 'react';
import { AnalysisResult, ImprovementSuggestion } from '../types';
import { Lightbulb, ArrowRight, AlertTriangle, ShieldCheck, Filter, ArrowUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AdvisoryPanelProps {
  suggestions: ImprovementSuggestion[];
}

export default function AdvisoryPanel({ suggestions }: AdvisoryPanelProps) {
  const { t, i18n } = useTranslation();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'HighFirst' | 'LowFirst'>('HighFirst');

  const categories = useMemo(() => {
    const cats = new Set(suggestions.map(s => s.category));
    return ['All', ...Array.from(cats)];
  }, [suggestions]);

  const filteredAndSortedSuggestions = useMemo(() => {
    let result = [...suggestions];

    // Filter
    if (filterCategory !== 'All') {
      result = result.filter(s => s.category === filterCategory);
    }

    // Sort
    const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
    result.sort((a, b) => {
      const scoreA = priorityMap[a.priority as keyof typeof priorityMap] || 0;
      const scoreB = priorityMap[b.priority as keyof typeof priorityMap] || 0;
      return sortOrder === 'HighFirst' ? scoreB - scoreA : scoreA - scoreB;
    });

    return result;
  }, [suggestions, filterCategory, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('advisory.title')}</h2>
        
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <div className="relative group">
            <Filter className={cn("absolute top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400", i18n.language === 'ar' ? "right-3" : "left-3")} />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={cn(
                "py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer",
                i18n.language === 'ar' ? "pr-8 pl-4" : "pl-8 pr-4"
              )}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? (i18n.language === 'ar' ? 'الكل' : 'All') : cat}</option>
              ))}
            </select>
          </div>

          {/* Priority Sort */}
          <button 
            onClick={() => setSortOrder(prev => prev === 'HighFirst' ? 'LowFirst' : 'HighFirst')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortOrder === 'HighFirst' ? `${t('advisory.priority')}: ${i18n.language === 'ar' ? 'عالي' : 'High'}` : `${t('advisory.priority')}: ${i18n.language === 'ar' ? 'منخفض' : 'Low'}`}
          </button>
        </div>
      </div>

      <div id="advisory-list-pdf" className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedSuggestions.map((item, idx) => (
            <motion.div
              layout
              key={`${item.suggestion}-${idx}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.005 }}
              className={cn(
                "p-5 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all",
                i18n.language === 'ar' ? "border-r-[6px]" : "border-l-[6px]",
                item.priority === 'High' ? (i18n.language === 'ar' ? "border-r-oued-gold" : "border-l-oued-gold") : (i18n.language === 'ar' ? "border-r-slate-300" : "border-l-slate-300")
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('advisory.category')}: {item.category}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                  item.priority === 'High' ? "bg-oued-blue/10 text-oued-blue-500" : "bg-slate-50 text-slate-500"
                )}>
                  {i18n.language === 'ar' 
                    ? (item.priority === 'High' ? 'عالي' : item.priority === 'Medium' ? 'متوسط' : 'منخفض') 
                    : item.priority}
                </span>
              </div>
              
              <h4 className="font-bold text-slate-900 mb-1">{item.suggestion}</h4>
              <div className="mt-3 space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <p className="text-xs text-slate-500 leading-relaxed italic">
                     <span className={cn("font-bold text-slate-700 not-italic uppercase text-[9px]", i18n.language === 'ar' ? "ml-2" : "mr-2")}>
                       {t('advisory.gap')}:
                     </span>
                     {item.gap}
                   </p>
                </div>
                {item.notes && (
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">
                      {i18n.language === 'ar' ? 'ملاحظات التنفيذ:' : 'Execution Notes:'}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {item.notes}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
    </div>
  );
}

