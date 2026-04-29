import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

export interface ActionLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  note: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

interface ActionLoggerProps {
  logs: ActionLogEntry[];
  onClear?: () => void;
}

export default function ActionLogger({ logs, onClear }: ActionLoggerProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isAr = i18n.language === 'ar';

  if (logs.length === 0) return null;

  return (
    <div className={cn(
      "fixed bottom-20 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-[60] transition-all duration-300",
      isOpen ? "translate-y-0" : "translate-y-2 opacity-90"
    )}>
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden shadow-slate-900/10">
        {/* Header */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-slate-900 rounded-lg text-white">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 tracking-tight">
              {isAr ? 'سجل ملاحظات الإجراءات' : 'Action Observations Log'}
              <span className="ml-2 px-1.5 py-0.5 bg-slate-100 rounded-full text-[10px] text-slate-500 font-black">
                {logs.length}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            {onClear && (
               <button 
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest relative z-10"
               >
                 {isAr ? 'مسح الكل' : 'Clear All'}
               </button>
            )}
            {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto', maxHeight: '300px' }}
              exit={{ height: 0 }}
              className="overflow-y-auto border-t border-slate-100 bg-slate-50/50"
            >
              <div className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 px-6 flex items-start gap-3 hover:bg-white transition-colors group">
                    <div className={cn(
                      "mt-1 p-1 rounded-full",
                      log.status === 'success' ? "bg-emerald-50 text-emerald-500" :
                      log.status === 'error' ? "bg-red-50 text-red-500" :
                      log.status === 'warning' ? "bg-amber-50 text-amber-500" :
                      "bg-indigo-50 text-indigo-500"
                    )}>
                      {log.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> :
                       log.status === 'error' ? <AlertCircle className="w-3 h-3" /> :
                       log.status === 'warning' ? <AlertCircle className="w-3 h-3" /> :
                       <Info className="w-3 h-3" />}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">{log.action}</span>
                         <span className="text-[8px] text-slate-400 font-medium">{log.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {log.note}
                      </p>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[9px] font-bold text-oued-blue uppercase tracking-widest">
                        {isAr ? 'سجل' : 'Log'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
