import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';
import { useTranslation } from 'react-i18next';
import { AnalysisResult } from '../types';
import { Trash2, Calendar, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface HistoryItem {
  id: string;
  userId: string;
  fileName: string;
  timestamp: any;
  result: AnalysisResult;
}

export default function HistoryPanel({ user, onSelect, onCompare }: { user: any, onSelect: (res: AnalysisResult) => void, onCompare: (results: [AnalysisResult, AnalysisResult], names: [string, string]) => void }) {
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      setLoading(true);
      const q = query(
        collection(db, 'analysisHistory'),
        where('userId', '==', user.uid || user.email),
        orderBy('timestamp', 'desc')
      );

      try {
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HistoryItem));
        setHistory(docs);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'analysisHistory');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const handleCompareClick = async () => {
    if (selectedIds.length !== 2) return;
    setIsComparing(true);
    // Artificial delay for better UX of the loading state
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const items = history.filter(h => selectedIds.includes(h.id)).sort((a, b) => {
      const dateA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp).getTime();
      const dateB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp).getTime();
      return dateA - dateB;
    });
    onCompare(
      [items[0].result, items[1].result],
      [items[0].fileName, items[1].fileName]
    );
    setIsComparing(false);
  };

  const deleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'analysisHistory', id));
      setHistory(prev => prev.filter(item => item.id !== id));
      setSelectedIds(prev => prev.filter(i => i !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `analysisHistory/${id}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">{t('history.title')}</h2>
        <div className="flex items-center gap-4">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleCompareClick}
              disabled={selectedIds.length !== 2 || isComparing}
              className="px-4 py-2 bg-oued-blue text-white rounded-xl text-xs font-bold disabled:opacity-30 transition-all shadow-lg shadow-oued-blue/10 flex items-center gap-2"
            >
              {isComparing && <Loader2 className="w-3 h-3 animate-spin" />}
              {t('history.compare')} ({selectedIds.length}/2)
            </button>
          )}
          <p className="text-slate-500 text-sm">{history.length} {t('history.count')}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="minimal-card h-40 animate-pulse bg-white border-slate-100 p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                  <div className="h-3 bg-slate-50 rounded-lg w-1/2" />
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-xl" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="h-4 bg-slate-50 rounded-full w-24" />
                <div className="h-4 bg-slate-50 rounded-full w-8" />
              </div>
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 minimal-card space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 font-medium">{t('history.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {history.map((item, idx) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onSelect(item.result)}
                  className={cn(
                    "group relative minimal-card cursor-pointer transition-all duration-300",
                    isSelected ? "border-oued-gold ring-2 ring-oued-gold/10" : "hover:border-slate-300",
                    i18n.language === 'ar' ? "text-right" : "text-left"
                  )}
                >
                  <div className={cn("absolute top-4 z-10", i18n.language === 'ar' ? "right-4" : "left-4")}>
                    <button 
                      onClick={(e) => toggleSelect(e, item.id)}
                      className={cn(
                        "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center",
                        isSelected ? "bg-oued-gold border-oued-gold text-white" : "border-slate-200 bg-white opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {isSelected && <FileText className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className={cn("flex items-start justify-between", i18n.language === 'ar' ? "pr-8" : "pl-8")}>
                  <div className={cn("space-y-1", i18n.language === 'ar' ? "pl-8" : "pr-8")}>
                    <h4 className="font-bold text-slate-800 line-clamp-1">{item.fileName}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.timestamp?.toDate ? item.timestamp.toDate() : item.timestamp).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={i18n.language === 'ar' ? "text-left" : "text-right"}>
                      <div className="text-lg font-bold text-oued-blue">{item.result.overallScore}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('history.score')}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                   <span className="text-[10px] font-bold text-oued-blue bg-oued-blue/10 px-2 py-0.5 rounded-full uppercase">
                     {item.result.metrics.length} {t('history.metrics')}
                   </span>
                   <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => deleteItem(e, item.id)}
                      disabled={deletingId === item.id}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    <ChevronRight className={cn("w-4 h-4 text-slate-300 group-hover:text-oued-blue transition-all", i18n.language === 'ar' ? "rotate-180" : "")} />
                   </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        </div>
      )}
    </div>
  );
}

