import React, { useEffect } from 'react';
import { Home, History, UserCog, BookOpen, ChevronRight, ChevronLeft, X, ShieldCheck, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppView, UserRole, UserTier } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ currentView, onViewChange, isOpen, onToggle, isMobile = false }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const { role, tier } = useAuth();
  const isAr = i18n.language === 'ar';
  const isGuest = tier === UserTier.GUEST;

  const menuItems = [
    { id: AppView.MAIN, label: t('nav.home'), icon: Home, locked: false },
    { id: AppView.THESIS, label: t('nav.thesis'), icon: BookOpen, locked: isGuest },
    { id: AppView.HISTORY, label: t('nav.history'), icon: History, locked: isGuest },
    { id: AppView.STUDENT_INFO, label: t('nav.profile'), icon: UserCog, locked: false },
  ];

  if (role === UserRole.ADMIN) {
    menuItems.push({ 
        id: AppView.ADMIN, 
        label: isAr ? 'لوحة المشرف' : 'Admin Panel', 
        icon: ShieldCheck,
        locked: false,
    });
  }

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-6 px-3 space-y-2">
        {isMobile && (
          <div className="flex items-center justify-between mb-8 px-2">
             <span className="font-black text-lg text-oued-blue">القائمة</span>
             <button onClick={onToggle} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
             </button>
          </div>
        )}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isLocked = item.locked;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (isLocked) return;
                onViewChange(item.id);
                if (isMobile) onToggle();
              }}
              disabled={isLocked}
              className={`w-full flex items-center gap-3 p-4 md:p-3 rounded-2xl transition-all group relative ${
                isLocked
                  ? 'text-slate-300 cursor-not-allowed opacity-60'
                  : isActive 
                    ? 'bg-oued-blue text-white shadow-lg shadow-oued-blue/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-oued-blue'
              }`}
            >
              <Icon className={`w-5 h-5 min-w-[20px] ${isActive && !isLocked ? 'text-white' : isLocked ? 'text-slate-300' : 'group-hover:scale-110 transition-transform'}`} />
              {(isOpen || isMobile) && (
                <span className="font-bold text-sm truncate flex-1 text-start">
                  {item.label}
                </span>
              )}
              {(isOpen || isMobile) && isLocked && (
                <Lock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              )}
              {!isOpen && !isMobile && (
                <div className={`absolute ${isAr ? 'right-full mr-2' : 'left-full ml-2'} px-2 py-1 bg-slate-900 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50`}>
                  {isLocked ? (isAr ? '🔒 للمسجّلين فقط' : '🔒 Registered only') : item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!isMobile && (
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-oued-blue transition-colors"
          >
            {isOpen ? (
              isAr ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
            ) : (
              isAr ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.aside
              initial={{ x: isAr ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${isAr ? 'right-0' : 'left-0'} bottom-0 w-[280px] bg-white z-[101] shadow-2xl overflow-y-auto`}
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      className="h-[calc(100vh-64px)] bg-white border-e border-slate-200 sticky top-16 z-40 hidden md:flex flex-col transition-all duration-300"
    >
      {content}
    </motion.aside>
  );
}
