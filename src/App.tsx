/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Leaf, Award, FileSearch, Sparkles, RefreshCcw, ChevronLeft, LogIn, LogOut, User as UserIcon, Languages, Download, LayoutDashboard, History as HistoryIcon, GraduationCap, BookOpen, Menu, X, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { CompassLogo } from './components/CompassLogo';
import FileUploader from './components/FileUploader';
import Dashboard from './components/Dashboard';
import StudentPortal from './components/StudentPortal';
import Sidebar from './components/Sidebar';
import { useTranslation } from 'react-i18next';
import AdvisoryPanel from './components/AdvisoryPanel';
import HistoryPanel from './components/HistoryPanel';
import ComparisonPanel from './components/ComparisonPanel';
import { analyzeSustainabilityDocument } from './services/geminiService';
import { AnalysisResult, AnalysisStatus, AppView } from './types';
import { ExtractedContent } from './lib/fileParser';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './lib/AuthContext';
import { signInWithGoogle, logout, db, handleFirestoreError, OperationType, serverTimestamp, loginWithEmail, registerWithEmail, resetPassword as firebaseResetPassword } from './lib/firebase';
import { collection, addDoc, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { exportAnalysisToPDF } from './services/pdfService';
import { AuthScreen } from './components/auth/AuthScreen';
import { AuthService } from './services/authService';
import { ReportTemplate } from './components/ReportTemplate';
import { storage } from './lib/storage';
import AdminDashboard from './components/Admin/AdminDashboard';
import { UserTier, UserRole } from './types';
import LandingPage from './components/LandingPage';

import ActionLogger, { ActionLogEntry } from './components/ActionLogger';

export default function App() {
  const { user, loading: authLoading, tier, role } = useAuth();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [comparison, setComparison] = useState<{ results: [AnalysisResult, AnalysisResult], names: [string, string] } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const [pdfProfile, setPdfProfile] = useState<any>(null);
  const [pdfThesis, setPdfThesis] = useState<any>(null);
  const [pdfSerial, setPdfSerial] = useState("");

  const [logs, setLogs] = useState<ActionLogEntry[]>([]);

  const logAction = (action: string, note: string, status: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      action,
      note,
      status
    }, ...prev].slice(0, 50));
  };

  const handleAuthSuccess = (user: any) => {
    setView(AppView.PORTAL);
  };

  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [showResetUI, setShowResetUI] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const saveToHistory = async (res: AnalysisResult, fileName: string) => {
    if (!user?.uid) return;
    try {
      await addDoc(collection(db, 'analysisHistory'), {
        userId: user.uid,
        fileName,
        timestamp: serverTimestamp(),
        result: res
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'analysisHistory');
    }
  };

  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const [analysisProgress, setAnalysisProgress] = useState<{ stage: string, percent: number }>({ stage: '', percent: 0 });

  const handleAnalyze = async (content: ExtractedContent, fileName: string) => {
    console.log("handleAnalyze started in App.tsx. FileName:", fileName);
    logAction(
      isAr ? 'بدء تحليل المذكرة' : 'Starting Thesis Analysis',
      isAr ? `جاري معالجة الملف: ${fileName}` : `Processing file: ${fileName}`,
      'info'
    );
    
    setAnalysisError(null);
    setAnalysisProgress({ stage: 'reading', percent: 10 });
    
    // Check limits for Free tier
    if (tier === UserTier.FREE && user) {
        try {
            logAction(
              isAr ? 'التحقق من الحدود' : 'Checking Limits',
              isAr ? 'جارٍ التحقق من حدود التحليل الشهري للمستخدم...' : 'Checking monthly analysis limits for user...',
              'info'
            );
            const historyRef = collection(db, 'analysisHistory');
            const q = query(historyRef, where('userId', '==', user.uid));
            const snapshot = await getDocs(q);
            
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            const monthAnalyses = snapshot.docs.filter(doc => {
                const timestamp = doc.data().timestamp;
                if (!timestamp) return false;
                const date = timestamp.toDate();
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            });

            const limit = 5;
            const remaining = Math.max(0, limit - monthAnalyses.length);

            logAction(
              isAr ? 'حالة الرصيد' : 'Account Balance',
              isAr ? `${remaining} تحليلات متبقية هذا الشهر` : `${remaining} analyses remaining this month`,
              'info'
            );

            if (monthAnalyses.length >= limit) {
                logAction(
                  isAr ? 'تجاوز الحد' : 'Limit Exceeded',
                  isAr ? `لقد وصلت لأقصى حد للتحليل لهذا الشهر (${limit}/${limit})` : `You have reached the analysis limit (${limit}/${limit})`,
                  'error'
                );
                alert(isAr ? `لقد وصلت للحد الأقصى للتحليلات المجانية لهذا الشهر (${limit}/${limit}). يرجى الترقية للحساب المميز.` : `You have reached the free analysis limit for this month (${limit}/${limit}). Please upgrade to Premium.`);
                return;
            }
        } catch (e) {
            console.error("Limit check error:", e);
        }
    }

    console.log("Setting status to LOADING");
    setStatus(AnalysisStatus.LOADING);
    setComparison(null);
    try {
      const { text, sourceFile, isImagePdf } = content;
      
      logAction(
        isAr ? 'استخراج النص' : 'Text Extraction',
        isAr ? (isImagePdf ? 'تم اكتشاف PDF صوري، جاري استخدام المعالجة المباشرة' : 'تم استخراج النص بنجاح من المستند') : (isImagePdf ? 'Image PDF detected, using direct processing' : 'Text extracted successfully from document'),
        'success'
      );

      if (!isImagePdf && (!text || text.trim().length < 100)) {
        console.log("Content validation failed: text too short and not an image PDF.");
        throw new Error(isAr ? 'النص قصير جداً للتحليل' : 'Text is too short for analysis');
      }

      console.log("Calling analyzeSustainabilityDocument service...");
      logAction(
        isAr ? 'استدعاء الذكاء الاصطناعي' : 'AI Analysis Call',
        isAr ? 'جاري إرسال البيانات إلى محرك Gemini للتحليل المعمق...' : 'Sending data to Gemini engine for deep analysis...',
        'info'
      );

      const analysisResult = await analyzeSustainabilityDocument(text, sourceFile, (stage, percent) => {
        setAnalysisProgress({ stage, percent });
        const stageLabel = isAr ? 
          (stage === 'reading' ? 'قراءة المستند' : stage === 'basic_info' ? 'تحديد المعلومات الأساسية' : stage === 'sdg_mapping' ? 'مواءمة أهداف التنمية' : stage === 'detailed_matrix' ? 'بناء المصفوفة الذكية' : 'معالجة البيانات') : 
          stage.replace('_', ' ');
        if (percent % 20 === 0) {
          logAction(isAr ? 'تقدم المعالجة' : 'Processing Progress', `${stageLabel}: ${percent}%`, 'info');
        }
      });
      console.log("Analysis successful!");
      
      logAction(
        isAr ? 'اكتمال التحليل' : 'Analysis Complete',
        isAr ? 'تم استلام النتائج وتدقيقها بنجاح' : 'Results received and verified successfully',
        'success'
      );

      setResult(analysisResult);
      setStatus(AnalysisStatus.SUCCESS);
      setAnalysisProgress({ stage: 'complete', percent: 100 });
      
      if (user) {
        console.log("Saving results to history...");
        saveToHistory(analysisResult, fileName).catch(error => {
          console.error("Background save failed:", error);
        });
      }

      setTimeout(() => {
        console.log("Scrolling to dashboard start...");
        const dashboard = document.getElementById('dashboard-start');
        dashboard?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (error: any) {
      console.error("Analysis Error in App.tsx:", error);
      logAction(
        isAr ? 'خطأ في التحليل' : 'Analysis Error',
        error instanceof Error ? error.message : String(error),
        'error'
      );
      setStatus(AnalysisStatus.ERROR);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setAnalysisError(errorMsg);
    }
  };

  const exportToPDF = async (targetLang?: string) => {
    if (!result || !user) return;
    
    const originalLang = i18n.language;
    const exportLang = targetLang || originalLang;
    
    setIsExporting(true);

    try {
      if (exportLang !== originalLang) {
        await i18n.changeLanguage(exportLang);
        // Wait for language change to propagate
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Fetch student/thesis data for template
      try {
        const studentDoc = await getDoc(doc(db, 'students', user.uid));
        setPdfProfile(studentDoc.exists() ? studentDoc.data() : {});
        const thesisDoc = await getDoc(doc(db, 'theses', user.uid));
        setPdfThesis(thesisDoc.exists() ? thesisDoc.data() : {});
      } catch (e) {
        console.error("Info fetch failed:", e);
        setPdfProfile({});
        setPdfThesis({});
      }
      
      setPdfSerial(`REF-${new Date().getTime()}`);

      // Now call the service
      await exportAnalysisToPDF({
        elementId1: 'pdf-page-1',
        elementId2: 'pdf-page-2',
        serialNumber: `REF-${new Date().getTime()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        onStart: async () => {
          // Additional rendering stabilization wait
          await new Promise(resolve => setTimeout(resolve, 1000));
        },
        onEnd: async () => {
          if (exportLang !== originalLang) {
            await i18n.changeLanguage(originalLang);
          }
          setIsExporting(false);
        },
        onError: (err) => {
          console.error('PDF export failed:', err);
          setIsExporting(false);
          alert(i18n.language === 'ar' ? 'فشل تصدير PDF. يرجى المحاولة مرة أخرى.' : 'PDF Export failed. Please try again.');
        }
      });
    } catch (e) {
      console.error("Export sequence failed:", e);
      setIsExporting(false);
    }
  };

  const resetAnalysis = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setComparison(null);
    setView(AppView.MAIN);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistory = (res: AnalysisResult) => {
    setResult(res);
    setComparison(null);
    setStatus(AnalysisStatus.SUCCESS);
    setView(AppView.THESIS); // Navigate to thesis view to show the result
    setTimeout(() => {
      const dashboard = document.getElementById('dashboard-start');
      dashboard?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCompareHistory = (results: [AnalysisResult, AnalysisResult], names: [string, string]) => {
    setComparison({ results, names });
    setResult(null);
    setStatus(AnalysisStatus.SUCCESS);
    setView(AppView.THESIS); // Navigate to thesis view to show the comparison
    setTimeout(() => {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 100);
  };

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Login failed:', error);
      let message = error.message || 'Login failed. Please try again.';
      
      if (error.code === 'auth/popup-blocked') {
        message = i18n.language === 'ar' 
          ? 'تم حظر النافذة المنبثقة. يرجى تفعيل النوافذ المنبثقة في متصفحك أو افتح التطبيق في نافذة جديدة.' 
          : 'Popup blocked. Please enable popups for this site or open the app in a new tab.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = i18n.language === 'ar'
          ? 'تم إلغاء عملية الدخول. يرجى المحاولة مرة أخرى.'
          : 'Login cancelled. Please try again.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        message = i18n.language === 'ar'
          ? 'تم إغلاق نافذة الدخول. يرجى إتمام العملية في النافذة المنبثقة.'
          : 'Login window closed. Please complete the process in the popup.';
      }
      
      setLoginError(message);
      alert(message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Show LandingPage for non-authenticated users on first visit
  if (view === AppView.LANDING && !user && !authLoading) {
    return (
      <LandingPage onGetStarted={() => setView(AppView.PORTAL)} />
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-sans ${i18n.language === 'ar' ? 'font-arabic' : ''}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Navigation */}
      <nav className="h-16 bg-white border-b border-oued-gold/20 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {user && (
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 md:hidden hover:bg-slate-50 rounded-xl text-slate-500"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={resetAnalysis}
            >
              <CompassLogo size={34} />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-oued-blue leading-none">{t('nav.title')}</span>
                <span className="text-[9px] font-medium text-slate-400 mt-0.5 leading-none hidden md:inline">منصة بوصلة لتحليل مذكرات الطلبة بجامعة الوادي</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all text-slate-600 font-bold text-xs border border-transparent hover:border-slate-200"
          >
            <Languages className="w-4 h-4" />
            {i18n.language === 'en' ? 'عربي' : 'English'}
          </button>

          {user && (
            <div className="flex items-center gap-4">
              <div 
                className="hidden sm:text-right sm:block"
              >
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t('nav.studentPortal')}</p>
                <p className="text-sm font-medium">
                  {user?.displayName || (user as any)?.fullName || user?.email?.split('@')[0] || '?'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || (user as any)?.fullName || ''} 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-oued-blue text-white flex items-center justify-center relative shadow-sm">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                )}
                <button 
                  onClick={async () => {
                    await AuthService.logout();
                    setView(AppView.MAIN);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold hover:bg-red-100 transition-all border border-red-100"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t('nav.signOut')}</span>
                </button>
              </div>
            </div>
          )}
          {!user && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                <UserIcon className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {user && (
          <Sidebar 
            currentView={view} 
            onViewChange={setView} 
            isOpen={isSidebarOpen} 
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isMobile={isMobile}
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          <AnimatePresence mode="wait">
            {view === AppView.MAIN ? (
              <motion.section
                key="main"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                {tier === UserTier.GUEST && (
                  <div className="p-6 bg-oued-blue/5 rounded-3xl border border-oued-blue/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-oued-blue/5 rounded-full blur-3xl" />
                    <div className="relative space-y-2 text-center md:text-right">
                      <h3 className="text-xl font-black text-oued-blue tracking-tight">هل تريد الاستفادة الكاملة من بوصلة؟</h3>
                      <p className="text-sm text-slate-500 font-medium max-w-lg">سجل حسابك الآن لحفظ تاريخ تحليلاتك، الحصول على تقارير PDF مفصلة، والوصول إلى أدوات الطالب الكاملة.</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <button 
                        onClick={() => handleLogin()}
                        disabled={loginLoading}
                        className="relative px-8 py-3 bg-oued-blue text-white rounded-2xl text-sm font-bold shadow-xl shadow-oued-blue/20 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
                      >
                        {loginLoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <UserIcon className="w-4 h-4" />}
                        إنشاء حساب طالب
                      </button>
                      {loginError && (
                        <p className="text-[10px] text-red-500 font-bold animate-pulse">{loginError}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-center space-y-4 pt-4">
                  <h1 className="text-4xl md:text-5xl font-black text-oued-blue tracking-tighter">
                    {t('dashboard.welcome')}
                  </h1>
                  <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                    {t('dashboard.welcomeDesc')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div 
                    onClick={() => setView(AppView.THESIS)}
                    className="minimal-card p-8 bg-white border-oued-blue/5 hover:border-oued-blue transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 bg-oued-blue/5 rounded-2xl flex items-center justify-center text-oued-blue mb-4 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{t('dashboard.cardThesis')}</h3>
                    <p className="text-sm text-slate-500">{t('dashboard.cardThesisDesc')}</p>
                  </div>

                  <div 
                    onClick={() => setView(AppView.HISTORY)}
                    className="minimal-card p-8 bg-white border-oued-gold/5 hover:border-oued-gold transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 bg-oued-gold/5 rounded-2xl flex items-center justify-center text-oued-gold mb-4 group-hover:scale-110 transition-transform">
                      <HistoryIcon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{t('dashboard.cardHistory')}</h3>
                    <p className="text-sm text-slate-500">{t('dashboard.cardHistoryDesc')}</p>
                  </div>

                  <div 
                    onClick={() => setView(AppView.STUDENT_INFO)}
                    className="minimal-card p-8 bg-white border-slate-100 hover:border-oued-blue transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 mb-4 group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{t('dashboard.cardProfile')}</h3>
                    <p className="text-sm text-slate-500">{t('dashboard.cardProfileDesc')}</p>
                  </div>
                </div>
              </motion.section>
            ) : view === AppView.THESIS ? (
              <motion.section
                key="thesis"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {status === AnalysisStatus.IDLE || status === AnalysisStatus.LOADING ? (
                  <>
                    <div className="text-center space-y-4 pt-4">
                      <h1 className="text-4xl md:text-5xl font-black text-oued-blue tracking-tighter">
                        {t('hero.title')}
                      </h1>
                      <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        {t('hero.subtitle')}
                      </p>
                    </div>
                    <FileUploader 
                      onAnalyze={handleAnalyze} 
                      isLoading={status === AnalysisStatus.LOADING} 
                      progress={status === AnalysisStatus.LOADING ? analysisProgress : undefined}
                    />
                  </>
                ) : status === AnalysisStatus.ERROR ? (
                  <div className="text-center py-20 minimal-card space-y-6">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-red-100">
                      <X className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-2xl font-black text-slate-800">{i18n.language === 'ar' ? 'فشل التحليل' : 'Analysis Failed'}</h2>
                       <div className="text-slate-500 font-medium max-w-md mx-auto space-y-2">
                        <p>{i18n.language === 'ar' ? 'حدث خطأ أثناء تحليل الوثيقة. يرجى المحاولة مرة أخرى.' : 'An error occurred during document analysis. Please try again.'}</p>
                        {analysisError && (
                          <div className="p-3 bg-slate-100 rounded-xl text-[10px] font-mono break-all">
                            {analysisError}
                          </div>
                        )}
                       </div>
                    </div>
                    <button 
                      onClick={resetAnalysis}
                      className="px-8 py-3 bg-oued-blue text-white rounded-2xl text-sm font-bold shadow-xl shadow-oued-blue/20 hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      {i18n.language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
                    </button>
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ChevronLeft 
                          className={`w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-900 ${i18n.language === 'ar' ? 'rotate-180' : ''}`} 
                          onClick={resetAnalysis}
                        />
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('dashboard.status')}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative group">
                          <button 
                            disabled={isExporting}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                          >
                            {isExporting ? (
                              <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            {t('advisory.exportPdf')}
                          </button>
                          
                          <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[120px]">
                            <button 
                              onClick={() => exportToPDF('en')}
                              className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors border-b border-slate-100"
                            >
                              English Report
                            </button>
                            <button 
                              onClick={() => exportToPDF('ar')}
                              className="w-full px-4 py-2 text-right text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              تقرير بالعربية
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                      <div id="analysis-report" className="flex flex-col lg:flex-row items-start gap-8 p-1">
                        <div className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-24">
                          <div className="minimal-card border-oued-gold/20">
                            <div className="flex items-center gap-3 p-3 bg-oued-gold/5 rounded-xl border border-oued-gold/10">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <FileSearch className="w-5 h-5 text-oued-gold" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-bold truncate text-slate-900 tracking-tight">{t('dashboard.complete')}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t('dashboard.verified')}</p>
                              </div>
                            </div>
                          </div>
                          <AdvisoryPanel suggestions={result.suggestions} />
                        </div>
                        <div id="dashboard-start" className="w-full lg:w-2/3">
                          <Dashboard result={result} />
                        </div>
                      </div>
                  </div>
                ) : comparison ? (
                  <ComparisonPanel 
                    results={comparison.results} 
                    names={comparison.names} 
                    onBack={resetAnalysis} 
                  />
                ) : null}
              </motion.section>
            ) : view === AppView.HISTORY ? (
              <motion.section
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <HistoryPanel user={user} onSelect={handleSelectHistory} onCompare={handleCompareHistory} />
              </motion.section>
            ) : view === AppView.STUDENT_INFO || view === AppView.PORTAL ? (
              <motion.section
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <StudentPortal user={user} onBack={() => setView(AppView.MAIN)} />
              </motion.section>
            ) : view === AppView.ADMIN ? (
              <motion.section
                key="admin"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <AdminDashboard />
              </motion.section>
            ) : null}
          </AnimatePresence>
        </main>
      </div>

      <footer className="h-auto min-h-12 py-6 bg-white border-t border-slate-100 px-8 flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-4 z-50" dir="ltr">
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={() => setShowPrivacy(true)} className="hover:text-oued-blue transition-colors uppercase cursor-pointer">
            {t('footer.privacy')}
          </button>
          <button onClick={() => setShowTerms(true)} className="hover:text-oued-blue transition-colors uppercase cursor-pointer">
            {t('footer.terms')}
          </button>
        </div>
        <div className="text-center md:text-right text-slate-400">{t('footer.copyright')}</div>
      </footer>

      {/* Legal Modals */}
      <AnimatePresence>
        {(showPrivacy || showTerms) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => { setShowPrivacy(false); setShowTerms(false); }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl relative ${i18n.language === 'ar' ? 'font-arabic' : ''}`}
              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            >
              <button 
                onClick={() => { setShowPrivacy(false); setShowTerms(false); }}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="Close"
              >
                <RefreshCcw className="w-5 h-5 rotate-45" />
              </button>

              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-display">
                {showPrivacy ? t('footer.privacy') : t('footer.terms')}
              </h2>
              
              <div className="prose prose-slate prose-sm overflow-y-auto max-h-[60vh] text-slate-600 leading-relaxed">
                {showPrivacy ? t('footer.privacyContent') : t('footer.termsContent')}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => { setShowPrivacy(false); setShowTerms(false); }}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                >
                  {i18n.language === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Loading Overlay */}
      <AnimatePresence>
        {isExporting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md"
          >
            <div className="relative">
              <CompassLogo size={80} />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-oued-gold/20 border-t-oued-gold rounded-full"
              />
            </div>
            <div className="mt-8 text-center space-y-2">
              <h3 className="text-xl font-black text-oued-blue tracking-tight">
                {i18n.language === 'ar' ? 'جاري إنشاء التقرير...' : 'Generating Report...'}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {i18n.language === 'ar' ? 'نحن نقوم الآن بتحليل وتنسيق بيانات مواءمة الاستدامة الخاصة بك.' : 'We are currently analyzing and formatting your sustainability alignment data.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden PDF Template */}
      <div className="absolute left-0 -top-[10000px] overflow-hidden pointer-events-none opacity-0 invisible" aria-hidden="true">
        {result && (
          <ReportTemplate 
            result={result} 
            studentInfo={{ ...(pdfProfile || {}), fullName: user?.displayName || 'Student' }} 
            thesisInfo={pdfThesis || {}}
            serialNumber={pdfSerial} 
          />
        )}
      </div>

      <ActionLogger logs={logs} onClear={() => setLogs([])} />
    </div>
  );
}
