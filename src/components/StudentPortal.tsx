import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Save, GraduationCap, User, Phone, Mail, Hash, MapPin, School,
  Info, RefreshCcw, CreditCard, ShieldCheck, Share2,
  FileText, BarChart2, History, ChevronDown, ChevronUp,
  CheckCircle2, Clock, Download
} from 'lucide-react';
import { ALGERIA_WILAYAS, FACULTIES, DEGREE_TYPES } from '../constants/universityData';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { UserTier } from '../types';
import { useAuth } from '../lib/AuthContext';

interface StudentPortalProps {
  onBack: () => void;
  user: any;
  onLogin?: () => void;
  onStartAnalysis?: () => void;
}

// ── Section wrapper with collapse support ──────────────────────────────────
const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ icon, title, subtitle, badge, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-oued-blue/8 text-oued-blue flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">{title}</h2>
              {badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-oued-gold/15 text-oued-gold">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-slate-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const StudentPortal: React.FC<StudentPortalProps> = ({ onBack, user, onLogin, onStartAnalysis }) => {
  const { t, i18n } = useTranslation();
  const { tier } = useAuth();
  const isGuest = tier === UserTier.GUEST;
  const ar = i18n.language === 'ar';

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);

  const [profile, setProfile] = useState({
    birthWilaya: '', faculty: '', department: '', specialty: '',
    studentCardNumber: '', phoneNumber: '', email: user?.email || ''
  });

  const [thesis, setThesis] = useState({
    title: '', supervisor: '', participants: '',
    type: 'Master', graduationYear: new Date().getFullYear()
  });

  // Fetch profile + thesis + reports
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) { setIsLoading(false); return; }
      setIsLoading(true);
      try {
        const profileDoc = await getDoc(doc(db, 'students', user.uid));
        if (profileDoc.exists()) setProfile(prev => ({ ...prev, ...profileDoc.data() }));

        const thesisDoc = await getDoc(doc(db, 'theses', user.uid));
        if (thesisDoc.exists()) setThesis(prev => ({ ...prev, ...thesisDoc.data() }));

        // Fetch reports history
        try {
          const q = query(
            collection(db, 'analyses'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          const snap = await getDocs(q);
          setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch { /* history collection may not exist yet */ }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `students/${user.uid}/data`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.uid]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    setIsSaving(true); setSaveMessage(null);
    try {
      await setDoc(doc(db, 'students', user.uid), profile);
      setSaveMessage(t('portal.success'));
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `students/${user.uid}`);
    } finally { setIsSaving(false); }
  };

  const handleSaveThesis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    setIsSaving(true); setSaveMessage(null);
    try {
      await setDoc(doc(db, 'theses', user.uid), thesis);
      setSaveMessage(t('portal.success'));
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `theses/${user.uid}`);
    } finally { setIsSaving(false); }
  };

  const selectedFaculty = FACULTIES.find(f => f.name === profile.faculty || f.nameAr === profile.faculty);
  const departments = selectedFaculty ? selectedFaculty.departments : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-oued-gold/20 border-t-oued-gold rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading...</p>
      </div>
    );
  }

  // ── Profile header ─────────────────────────────────────────────────────
  const profileHeader = (
    <div className="bg-gradient-to-l from-oued-blue to-oued-blue/80 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center gap-5">
      <div className="relative shrink-0">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="" className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20" />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center border-4 border-white/20">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
        )}
        <div className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 rounded-xl border-4 border-oued-blue">
          <School className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <div className="text-center sm:text-right flex-1">
        <h2 className="text-xl font-black tracking-tight">
          {user?.displayName || (user as any)?.fullName || user?.email?.split('@')[0] || (ar ? 'طالب' : 'Student')}
        </h2>
        <p className="text-blue-200 text-xs mt-1">{user?.email}</p>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/15 border border-white/20">
            {tier?.toUpperCase()}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-oued-gold/20 border border-oued-gold/30 text-oued-gold">
            {reports.length} {ar ? 'تحليل' : 'analyses'}
          </span>
        </div>
      </div>
    </div>
  );

  // ── Guest banner ───────────────────────────────────────────────────────
  if (isGuest) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500" dir={ar ? 'rtl' : 'ltr'}>
        {/* Guest hero */}
        <div className="bg-gradient-to-l from-oued-blue to-oued-blue/80 rounded-3xl p-8 text-white text-center space-y-4">
          <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto">
            <GraduationCap className="w-9 h-9 text-oued-gold" />
          </div>
          <h2 className="text-2xl font-black">{ar ? 'مرحباً بك في بوصلة' : 'Welcome to Bousala'}</h2>
          <p className="text-blue-200 text-sm leading-relaxed max-w-md mx-auto">
            {ar
              ? 'سجّل حسابك المجاني للوصول إلى الملف البيداغوجي، تحليل المذكرة، وسجل التقارير.'
              : 'Create your free account to access your academic profile, thesis analysis, and reports history.'}
          </p>
          <button
            onClick={onLogin}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-oued-blue rounded-2xl text-sm font-black hover:scale-105 transition-all shadow-xl"
          >
            <User className="w-4 h-4" />
            {ar ? 'إنشاء حساب / تسجيل الدخول' : 'Sign Up / Sign In'}
          </button>
        </div>

        {/* Preview of locked sections */}
        {[
          { icon: <School className="w-5 h-5" />, title: ar ? '١ · الملف البيداغوجي' : '1 · Academic Profile', sub: ar ? 'معلوماتك الجامعية ومعلومات المذكرة' : 'Your university info and thesis details' },
          { icon: <FileText className="w-5 h-5" />, title: ar ? '٢ · تحليل المذكرة' : '2 · Thesis Analysis', sub: ar ? 'ارفع مذكرتك وابدأ التحليل الذكي' : 'Upload your thesis and start AI analysis' },
          { icon: <History className="w-5 h-5" />, title: ar ? '٣ · سجل التقارير' : '3 · Reports History', sub: ar ? 'جميع تحليلاتك السابقة ونتائجها' : 'All your previous analyses and results' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-100 p-5 flex items-center gap-4 opacity-50 select-none">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
              {s.icon}
            </div>
            <div className="text-right flex-1">
              <p className="text-sm font-bold text-slate-700">{s.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
            </div>
            <ShieldCheck className="w-4 h-4 text-slate-300 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  // ── Authenticated dashboard ────────────────────────────────────────────
  return (
    <div className="space-y-5 animate-in fade-in duration-500" dir={ar ? 'rtl' : 'ltr'}>

      {/* Profile header */}
      {profileHeader}

      {/* ── Section 1: الملف البيداغوجي ── */}
      <Section
        icon={<School className="w-5 h-5" />}
        title={ar ? '١ · الملف البيداغوجي' : '1 · Academic Profile'}
        subtitle={ar ? 'معلوماتك الجامعية ومعلومات المذكرة' : 'Your university info and thesis details'}
        defaultOpen={true}
      >
        {/* Profile sub-tabs */}
        <div className="flex gap-2 mt-5 mb-5 p-1 bg-slate-100 rounded-2xl w-fit">
          {['pedagogical', 'memo'].map(tab => (
            <button
              key={tab}
              onClick={() => {/* handled inline below via separate state */}}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-500"
            >
              {tab === 'pedagogical' ? (ar ? 'المعلومات البيداغوجية' : 'Academic Info') : (ar ? 'معلومات المذكرة' : 'Thesis Info')}
            </button>
          ))}
        </div>

        {/* Academic info form */}
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <p className="text-xs font-bold text-oued-blue uppercase tracking-widest pb-1 border-b border-slate-100">
            {ar ? 'المعلومات البيداغوجية' : 'Academic Information'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wilaya */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('portal.birthWilaya')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select value={profile.birthWilaya} onChange={e => setProfile({ ...profile, birthWilaya: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm bg-white">
                  <option value="">{ar ? 'اختر الولاية' : 'Select Wilaya'}</option>
                  {ALGERIA_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
            {/* Student card */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('portal.studentCard')} <span className="text-red-500">*</span></label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" maxLength={12} pattern="\d{12}" required value={profile.studentCardNumber}
                  onChange={e => setProfile({ ...profile, studentCardNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="212139066666"
                  className={cn("w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-0 text-sm",
                    profile.studentCardNumber && profile.studentCardNumber.length !== 12 ? "border-red-300" : "border-slate-200 focus:border-oued-gold")} />
              </div>
            </div>
            {/* Faculty */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('portal.faculty')} <span className="text-red-500">*</span></label>
              <select required value={profile.faculty} onChange={e => setProfile({ ...profile, faculty: e.target.value, department: '' })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm bg-white">
                <option value="">{ar ? 'اختر الكلية' : 'Select Faculty'}</option>
                {FACULTIES.map(f => <option key={f.name} value={ar ? f.nameAr : f.name}>{ar ? f.nameAr : f.name}</option>)}
              </select>
            </div>
            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('portal.department')}</label>
              <select value={profile.department} disabled={!profile.faculty} onChange={e => setProfile({ ...profile, department: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm bg-white disabled:opacity-50">
                <option value="">{ar ? 'اختر القسم' : 'Select Department'}</option>
                {departments.map((d: any) => <option key={d.name} value={ar ? d.nameAr : d.name}>{ar ? d.nameAr : d.name}</option>)}
              </select>
            </div>
            {/* Specialty */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('portal.specialty')}</label>
              <input type="text" value={profile.specialty} onChange={e => setProfile({ ...profile, specialty: e.target.value })}
                placeholder={ar ? 'مثال: الذكاء الاصطناعي وعلوم البيانات' : 'e.g. Artificial Intelligence & Data Science'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm" />
            </div>
            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('portal.phone')}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" maxLength={10} value={profile.phoneNumber}
                  onChange={e => setProfile({ ...profile, phoneNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="0550123456"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm" />
              </div>
            </div>
          </div>

          {/* Thesis info */}
          <p className="text-xs font-bold text-oued-blue uppercase tracking-widest pb-1 border-b border-slate-100 mt-6">
            {ar ? 'معلومات المذكرة' : 'Thesis Information'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('portal.thesisTitle')} <span className="text-red-500">*</span></label>
              <input type="text" required value={thesis.title} onChange={e => setThesis({ ...thesis, title: e.target.value })}
                placeholder={ar ? 'عنوان المذكرة' : 'Thesis title'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('portal.supervisor')}</label>
              <input type="text" value={thesis.supervisor} onChange={e => setThesis({ ...thesis, supervisor: e.target.value })}
                placeholder={ar ? 'اسم المشرف' : 'Supervisor name'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('portal.degreeType')}</label>
              <select value={thesis.type} onChange={e => setThesis({ ...thesis, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm bg-white">
                {DEGREE_TYPES.map((d: string) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('portal.graduationYear')}</label>
              <input type="number" min={2000} max={2035} value={thesis.graduationYear}
                onChange={e => setThesis({ ...thesis, graduationYear: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('portal.participants')}</label>
              <input type="text" value={thesis.participants} onChange={e => setThesis({ ...thesis, participants: e.target.value })}
                placeholder={ar ? 'أسماء المشاركين (اختياري)' : 'Participants (optional)'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button type="submit" disabled={isSaving}
              className="flex items-center gap-2 px-7 py-3 bg-oued-blue text-white rounded-xl font-bold text-sm hover:bg-oued-blue/90 transition-all shadow-lg shadow-oued-blue/20 disabled:opacity-50">
              {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? t('portal.saving') : t('portal.save')}
            </button>
            {saveMessage && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {saveMessage}
              </motion.span>
            )}
          </div>
        </form>
      </Section>

      {/* ── Section 2: تحليل المذكرة ── */}
      <Section
        icon={<FileText className="w-5 h-5" />}
        title={ar ? '٢ · تحليل المذكرة' : '2 · Thesis Analysis'}
        subtitle={ar ? 'ارفع مذكرتك وابدأ التحليل الذكي' : 'Upload your thesis for AI-powered SDG analysis'}
        defaultOpen={true}
      >
        <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-bold text-slate-800">
              {ar ? 'ابدأ تحليل مذكرتك الآن' : 'Start analyzing your thesis now'}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {ar
                ? 'ارفع ملف PDF الخاص بمذكرتك وسيقوم الذكاء الاصطناعي بتحليله ومطابقته مع أهداف التنمية المستدامة SDG.'
                : 'Upload your PDF and our AI will analyze it against all 17 Sustainable Development Goals.'}
            </p>
          </div>
          <button
            onClick={onStartAnalysis}
            className="shrink-0 flex items-center gap-2 px-6 py-3 bg-oued-blue text-white rounded-2xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-oued-blue/20"
          >
            <FileText className="w-4 h-4" />
            {ar ? 'بدء التحليل' : 'Start Analysis'}
          </button>
        </div>

        {/* Recent stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: ar ? 'إجمالي التحليلات' : 'Total Analyses', value: reports.length },
            { label: ar ? 'هذا الشهر' : 'This Month', value: reports.filter(r => {
                const d = r.createdAt?.toDate?.();
                return d && d.getMonth() === new Date().getMonth();
              }).length },
            { label: ar ? 'آخر تحليل' : 'Last Analysis', value: reports[0]?.createdAt?.toDate?.()
                ? new Intl.DateTimeFormat(ar ? 'ar' : 'en', { month: 'short', day: 'numeric' }).format(reports[0].createdAt.toDate())
                : '—' },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 text-center">
              <p className="text-lg font-black text-oued-blue">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Section 3: سجل التقارير ── */}
      <Section
        icon={<History className="w-5 h-5" />}
        title={ar ? '٣ · سجل التقارير' : '3 · Reports History'}
        subtitle={ar ? 'جميع تحليلاتك السابقة' : 'All your previous analyses'}
        badge={reports.length > 0 ? String(reports.length) : undefined}
        defaultOpen={true}
      >
        {reports.length === 0 ? (
          <div className="mt-5 text-center py-10 text-slate-400 space-y-2">
            <History className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-sm font-bold">{ar ? 'لا توجد تقارير بعد' : 'No reports yet'}</p>
            <p className="text-xs">{ar ? 'ابدأ تحليلك الأول من القسم أعلاه' : 'Start your first analysis above'}</p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {reports.slice(0, 10).map((r, i) => (
              <div key={r.id || i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-oued-blue/20 transition-all">
                <div className="w-9 h-9 rounded-xl bg-oued-blue/10 text-oued-blue flex items-center justify-center shrink-0">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-sm font-bold text-slate-800 truncate">{r.thesisTitle || r.title || (ar ? 'تحليل مذكرة' : 'Thesis Analysis')}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-bold">
                      {r.createdAt?.toDate
                        ? new Intl.DateTimeFormat(ar ? 'ar' : 'en', { year: 'numeric', month: 'short', day: 'numeric' }).format(r.createdAt.toDate())
                        : '—'}
                    </span>
                  </div>
                </div>
                <button className="shrink-0 p-2 rounded-xl hover:bg-oued-blue/10 text-slate-400 hover:text-oued-blue transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Subscription card (compact) ── */}
      <div className={`p-5 rounded-3xl border-2 transition-all ${tier === UserTier.PREMIUM ? 'border-purple-400 bg-purple-50/40' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className={`w-5 h-5 ${tier === UserTier.PREMIUM ? 'text-purple-500' : 'text-slate-400'}`} />
            <div>
              <p className="text-sm font-black text-slate-800">
                {tier === UserTier.PREMIUM ? (ar ? 'حساب مميز ✨' : 'Premium Account ✨') : (ar ? 'حساب مجاني' : 'Free Account')}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {tier === UserTier.PREMIUM
                  ? (ar ? 'تحليلات غير محدودة' : 'Unlimited analyses')
                  : (ar ? 'تحليل واحد مجاني شهرياً' : '1 free analysis/month')}
              </p>
            </div>
          </div>
          {tier !== UserTier.PREMIUM && (
            <button className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all">
              {ar ? 'ترقية' : 'Upgrade'}
            </button>
          )}
        </div>
        {/* Referral code */}
        {user?.uid && (
          <div className="mt-4 flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl">
            <Share2 className="w-4 h-4 text-blue-500 shrink-0" />
            <code className="flex-1 text-xs font-black text-blue-600 tracking-wider">COMPASS-{user.uid.slice(0, 5).toUpperCase()}</code>
            <button
              onClick={() => navigator.clipboard?.writeText(`COMPASS-${user.uid.slice(0, 5).toUpperCase()}`)}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-[10px] font-bold hover:bg-blue-600 transition-all">
              {ar ? 'نسخ' : 'Copy'}
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentPortal;
