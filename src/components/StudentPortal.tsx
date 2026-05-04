import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Save, GraduationCap, BookOpen, User, Phone, Mail, Hash, MapPin, School, Info, RefreshCcw, Lock, CreditCard, ShieldCheck, Share2 } from 'lucide-react';
import { ALGERIA_WILAYAS, FACULTIES, DEGREE_TYPES } from '../constants/universityData';
import { db, handleFirestoreError, OperationType, resetPassword as firebaseResetPassword } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { storage } from '../lib/storage';
import { cn } from '../lib/utils';

import { AppView, UserRole, UserTier } from '../types';
import { useAuth } from '../lib/AuthContext';

interface StudentPortalProps {
  onBack: () => void;
  user: any;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ onBack, user }) => {
  const { t, i18n } = useTranslation();
  const { tier } = useAuth();

  // Guest = tier is GUEST (set in AuthContext when no Firebase session)
  const isGuest = tier === UserTier.GUEST;

  const [activeTab, setActiveTab] = useState<'pedagogical' | 'memo' | 'security' | 'subscription'>(
    isGuest ? 'subscription' : 'pedagogical'
  );

  // Sync tab when auth state resolves
  useEffect(() => {
    if (isGuest) setActiveTab('subscription');
  }, [isGuest]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({ current: '', new: '' });

  const [profile, setProfile] = useState({
    birthWilaya: '',
    faculty: '',
    department: '',
    specialty: '',
    studentCardNumber: '',
    phoneNumber: '',
    email: user?.email || ''
  });

  const [thesis, setThesis] = useState({
    title: '',
    supervisor: '',
    participants: '',
    type: 'Master',
    graduationYear: new Date().getFullYear()
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const profileDoc = await getDoc(doc(db, 'students', user.uid));
        if (profileDoc.exists()) {
          setProfile(prev => ({ ...prev, ...profileDoc.data() }));
        }

        const thesisDoc = await getDoc(doc(db, 'theses', user.uid));
        if (thesisDoc.exists()) {
          setThesis(prev => ({ ...prev, ...thesisDoc.data() }));
        }
      } catch (error) {
        // If it's a firebase error, handle it. If it's something else (like the indexOf error), log it properly.
        console.error('Error fetching student data:', error);
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
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await setDoc(doc(db, 'students', user.uid), profile);
      setSaveMessage(t('portal.success'));
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `students/${user.uid}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveThesis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await setDoc(doc(db, 'theses', user.uid), thesis);
      setSaveMessage(t('portal.success'));
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `theses/${user.uid}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    
    if (passwords.new.length < 6) {
      alert(i18n.language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'New password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    try {
      // Try local update
      await storage.resetPassword(user.email, passwords.new);
      
      // Try Firebase update if possible
      try {
        await firebaseResetPassword(user.email);
      } catch (e) {
        console.warn("Firebase password reset skipped");
      }

      setSaveMessage(i18n.language === 'ar' ? 'تم تحديث كلمة المرور محلياً' : 'Password updated locally');
      setPasswords({ current: '', new: '' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      alert('Error updating password');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedFaculty = FACULTIES.find(f => f.name === profile.faculty || f.nameAr === profile.faculty);
  const departments = selectedFaculty ? selectedFaculty.departments : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-oued-gold/20 border-t-oued-gold rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChevronLeft 
            className={`w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-900 ${i18n.language === 'ar' ? 'rotate-180' : ''}`} 
            onClick={onBack}
          />
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('nav.studentPortal')}</h3>
        </div>
      </div>

      {/* Student Profile Header */}
      <div className="minimal-card p-6 bg-white flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user?.displayName || ''} 
              className="w-24 h-24 rounded-3xl border-4 border-slate-50 shadow-sm object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-oued-blue text-white flex items-center justify-center relative shadow-sm border-4 border-slate-50">
              <GraduationCap className="w-12 h-12" />
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-xl shadow-lg border-4 border-white">
            <School className="w-4 h-4" />
          </div>
        </div>
        
        <div className="text-center md:text-right flex-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {user?.displayName || (user as any)?.fullName || user?.email?.split('@')[0]}
          </h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Mail className="w-3.5 h-3.5" />
              {user?.email}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-oued-blue bg-oued-blue/5 px-3 py-1.5 rounded-lg border border-oued-blue/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              {tier}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl text-center min-w-[100px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{i18n.language === 'ar' ? 'التحليلات' : 'Analyses'}</p>
                <p className="text-lg font-black text-slate-800">12</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl text-center min-w-[100px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{i18n.language === 'ar' ? 'الرتبة' : 'Rank'}</p>
                <p className="text-lg font-black text-slate-800">#42</p>
            </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-full overflow-x-auto no-scrollbar sm:w-fit">
        {!isGuest && (
          <>
            <button
              onClick={() => setActiveTab('pedagogical')}
              className={cn(
                "px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                activeTab === 'pedagogical' ? "bg-white text-oued-blue shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {t('portal.academicTitle')}
            </button>
            <button
              onClick={() => setActiveTab('memo')}
              className={cn(
                "px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                activeTab === 'memo' ? "bg-white text-oued-blue shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {t('portal.memoTitle')}
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={cn(
                "px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                activeTab === 'security' ? "bg-white text-oued-blue shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {i18n.language === 'ar' ? 'الأمان' : 'Security'}
            </button>
          </>
        )}
        <button
          onClick={() => setActiveTab('subscription')}
          className={cn(
            "px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            activeTab === 'subscription' ? "bg-white text-oued-blue shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          {i18n.language === 'ar' ? 'الاشتراك والمكافآت' : 'Subscription & Rewards'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="minimal-card p-8">
            <AnimatePresence mode="wait">
              {!isGuest && activeTab === 'pedagogical' ? (
                <motion.form
                  key="pedagogical"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSaveProfile}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-oued-blue/10 rounded-lg text-oued-blue">
                      <School className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{t('portal.academicTitle')}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {t('portal.birthWilaya')}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                          value={profile.birthWilaya}
                          onChange={(e) => setProfile({ ...profile, birthWilaya: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm transition-all bg-white"
                        >
                          <option value="">Select Wilaya</option>
                          {ALGERIA_WILAYAS.map(w => (
                            <option key={w} value={w}>{w}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          {t('portal.studentCard')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            maxLength={12}
                            pattern="\d{12}"
                            value={profile.studentCardNumber}
                            onChange={(e) => setProfile({ ...profile, studentCardNumber: e.target.value.replace(/\D/g, '') })}
                            placeholder="e.g. 212139066666"
                            className={cn(
                              "w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-0 text-sm transition-all",
                              profile.studentCardNumber && profile.studentCardNumber.length !== 12 
                                ? "border-red-300 focus:border-red-500" 
                                : "border-slate-200 focus:border-oued-gold"
                            )}
                            required
                          />
                        </div>
                        {profile.studentCardNumber && profile.studentCardNumber.length !== 12 && (
                          <p className="text-[10px] text-red-500 font-bold">
                            {i18n.language === 'ar' ? 'يجب أن يتكون رقم البطاقة من 12 رقمًا' : 'Must be exactly 12 digits'}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {t('portal.faculty')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={profile.faculty}
                        required
                        onChange={(e) => setProfile({ ...profile, faculty: e.target.value, department: '' })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm transition-all bg-white"
                      >
                        <option value="">Select Faculty</option>
                        {FACULTIES.map(f => (
                          <option key={f.name} value={i18n.language === 'ar' ? f.nameAr : f.name}>
                            {i18n.language === 'ar' ? f.nameAr : f.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {t('portal.department')}
                      </label>
                      <select
                        value={profile.department}
                        disabled={!profile.faculty}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm transition-all bg-white disabled:opacity-50"
                      >
                        <option value="">Select Department</option>
                        {departments.map(d => (
                          <option key={d.name} value={i18n.language === 'ar' ? d.nameAr : d.name}>
                            {i18n.language === 'ar' ? d.nameAr : d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          {t('portal.specialty')}
                        </label>
                        <input
                          type="text"
                          value={profile.specialty}
                          onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                          placeholder="e.g. Artificial Intelligence & Data Science"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {t('portal.phone')}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          maxLength={10}
                          pattern="0[5-7]\d{8}"
                          value={profile.phoneNumber}
                          onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value.replace(/\D/g, '') })}
                          placeholder="e.g. 0550123456"
                          className={cn(
                            "w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-0 text-sm transition-all",
                            profile.phoneNumber && (profile.phoneNumber.length !== 10 || !/^0[5-7]/.test(profile.phoneNumber))
                              ? "border-red-300 focus:border-red-500" 
                              : "border-slate-200 focus:border-oued-gold"
                          )}
                        />
                      </div>
                      {profile.phoneNumber && (profile.phoneNumber.length !== 10 || !/^0[5-7]/.test(profile.phoneNumber)) && (
                        <p className="text-[10px] text-red-500 font-bold">
                          {i18n.language === 'ar' 
                            ? 'رقم غير صحيح (يجب أن يبدأ بـ 05، 06 أو 07 ويتكون من 10 أرقام)' 
                            : 'Must start with 05, 06 or 07 and be 10 digits'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {t('portal.email')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={profile.email}
                          readOnly
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 text-sm cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 px-8 py-3 bg-oued-blue text-white rounded-xl font-bold text-sm hover:bg-oued-blue-500 transition-all shadow-lg shadow-oued-blue/20 disabled:opacity-50"
                    >
                      {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {isSaving ? t('portal.saving') : t('portal.save')}
                    </button>
                    {saveMessage && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-emerald-600 text-xs font-bold"
                      >
                        {saveMessage}
                      </motion.span>
                    )}
                  </div>
                </motion.form>
              ) : !isGuest && activeTab === 'memo' ? (
                <motion.form
                  key="memo"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleSaveThesis}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-oued-gold/10 rounded-lg text-oued-gold">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{t('portal.memoTitle')}</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          {t('portal.thesisTitle')} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={thesis.title}
                          onChange={(e) => setThesis({ ...thesis, title: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          {t('portal.supervisor')}
                        </label>
                        <input
                          type="text"
                          value={thesis.supervisor}
                          onChange={(e) => setThesis({ ...thesis, supervisor: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          {t('portal.gradYear')}
                        </label>
                        <input
                          type="number"
                          value={thesis.graduationYear}
                          min={2000}
                          max={2050}
                          onChange={(e) => setThesis({ ...thesis, graduationYear: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {t('portal.participants')}
                      </label>
                      <input
                        type="text"
                        value={thesis.participants}
                        onChange={(e) => setThesis({ ...thesis, participants: e.target.value })}
                        placeholder="Names of student colleagues..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {t('portal.degreeType')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {DEGREE_TYPES.map(type => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setThesis({ ...thesis, type: type.value })}
                            className={cn(
                              "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                              thesis.type === type.value 
                                ? "bg-oued-gold border-oued-gold text-white" 
                                : "bg-white border-slate-200 text-slate-500 hover:border-oued-gold"
                            )}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 px-8 py-3 bg-oued-blue text-white rounded-xl font-bold text-sm hover:bg-oued-blue-500 transition-all shadow-lg shadow-oued-blue/20 disabled:opacity-50"
                    >
                      {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {isSaving ? t('portal.saving') : t('portal.save')}
                    </button>
                    {saveMessage && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-emerald-600 text-xs font-bold"
                      >
                        {saveMessage}
                      </motion.span>
                    )}
                  </div>
                </motion.form>
              ) : !isGuest && activeTab === 'security' ? (
                <motion.form
                  key="security"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  onSubmit={handleUpdatePassword}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{i18n.language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</h2>
                  </div>

                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                         {i18n.language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                       </label>
                       <input 
                         type="password"
                         required
                         value={passwords.new}
                         onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                         placeholder="••••••••"
                         className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-oued-gold focus:ring-0 text-sm transition-all"
                       />
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      {i18n.language === 'ar' 
                        ? '* سيتم تحديث كلمة المرور في هذا المتصفح فوراً.'
                        : '* Password will be updated in this browser immediately.'}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 px-8 py-3 bg-oued-blue text-white rounded-xl font-bold text-sm hover:bg-oued-blue-500 transition-all shadow-lg shadow-oued-blue/20 disabled:opacity-50"
                    >
                      {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {isSaving ? t('portal.saving') : i18n.language === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
                    </button>
                    {saveMessage && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-emerald-600 text-xs font-bold"
                      >
                        {saveMessage}
                      </motion.span>
                    )}
                  </div>
                </motion.form>
              ) : activeTab === 'subscription' ? (
                <motion.div
                  key="subscription"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{i18n.language === 'ar' ? 'حالة الحساب والاشتراك' : 'Account & Subscription'}</h2>
                  </div>

                  {isGuest && (
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-oued-blue/5 border border-oued-blue/20 mb-2">
                      <div className="p-3 bg-oued-blue/10 rounded-xl text-oued-blue shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 mb-0.5">
                          {i18n.language === 'ar' ? 'سجّل حساباً للوصول إلى جميع الميزات' : 'Create an account to access all features'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {i18n.language === 'ar'
                            ? 'المعلومات، المذكرة، والأمان متاحة للمستخدمين المسجّلين فقط.'
                            : 'Profile, thesis info, and security settings are available to registered users only.'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-3xl border-2 transition-all ${tier === UserTier.PREMIUM ? 'border-purple-500 bg-purple-50/30' : 'border-slate-100 bg-slate-50/30'}`}>
                      <div className="flex items-center justify-between mb-4">
                         <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${tier === UserTier.PREMIUM ? 'bg-purple-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {tier}
                         </span>
                         <ShieldCheck className={tier === UserTier.PREMIUM ? 'text-purple-500' : 'text-slate-300'} />
                      </div>
                      <h4 className="text-lg font-black text-slate-800 mb-2">
                         {tier === UserTier.PREMIUM 
                            ? (i18n.language === 'ar' ? 'حساب مميز' : 'Premium Account')
                            : (i18n.language === 'ar' ? 'حساب مجاني' : 'Free Account')}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                         {tier === UserTier.PREMIUM 
                            ? (i18n.language === 'ar' ? 'استمتع بتحليلات غير محدودة لجميع مذكراتك وتقارير احترافية.' : 'Enjoy unlimited analyses for all your theses and professional reports.')
                            : (i18n.language === 'ar' ? 'لديك تحليل واحد مجاني شهرياً. قم بالترقية للحصول على مميزات أكثر.' : 'You have 1 free analysis per month. Upgrade for more features.')}
                      </p>
                      {tier !== UserTier.PREMIUM && (
                        <button className="w-full mt-6 py-3 bg-purple-600 text-white rounded-2xl text-xs font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">
                           {i18n.language === 'ar' ? 'الترقية للمميز' : 'Upgrade to Premium'}
                        </button>
                      )}
                    </div>

                    <div className="p-6 rounded-3xl border border-blue-100 bg-blue-50/30">
                      <Share2 className="w-6 h-6 text-blue-500 mb-4" />
                      <h4 className="text-lg font-black text-slate-800 mb-2">{i18n.language === 'ar' ? 'برنامج الإحالة' : 'Referral Program'}</h4>
                      <p className="text-xs text-slate-500 mb-6">
                         {i18n.language === 'ar' ? 'شارك رمز الإحالة الخاص بك مع زملائك واحصل على شهر مميز مجاناً عن كل 3 مشتركين جدد.' : 'Share your referral code with colleagues and get 1 premium month for every 3 new subscribers.'}
                      </p>
                      <div className="flex items-center gap-2 p-1 bg-white border border-blue-100 rounded-2xl">
                         <code className="flex-1 px-4 text-sm font-black text-blue-600 font-mono tracking-wider">COMPASS-{user?.uid?.slice(0, 5).toUpperCase()}</code>
                         <button className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-bold hover:bg-blue-600 transition-all">
                            {i18n.language === 'ar' ? 'نسخ' : 'Copy'}
                         </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="minimal-card p-6 bg-linear-to-br from-oued-blue to-oued-blue-500 text-white border-none">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-oued-gold" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t('nav.studentPortal')}</h3>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {i18n.language === 'ar' 
                ? 'يرجى التأكد من دقة المعلومات المدخلة حيث تستخدم في توليد تقارير بوصلة الرسمية وتوثيق البحث العلمي.'
                : 'Please ensure the accuracy of the information entered as it is used to generate official Compass reports and document scientific research.'}
            </p>
          </div>

          <div className="minimal-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-oued-gold">
               <Info className="w-4 h-4" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">User Identity</span>
            </div>
            <div className="flex items-center gap-4">
               <img src={user?.photoURL ?? undefined} alt={user?.displayName || ''} className="w-12 h-12 rounded-full border-2 border-oued-blue/10" />
               <div>
                  <p className="text-sm font-bold text-slate-800">{user?.displayName}</p>
                  <p className="text-[10px] text-slate-400 font-bold truncate max-w-[150px]">{user?.email}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
