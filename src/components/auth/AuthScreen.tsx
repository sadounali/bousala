import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ArrowLeft, ArrowRight, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { CompassLogo } from '../CompassLogo';
import { AuthService } from '../../services/authService';
import { storage } from '../../lib/storage';

interface AuthScreenProps {
  onSuccess: (user: any) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetUI, setShowResetUI] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(storage.getRememberedEmail());
  const [password, setPassword] = useState(storage.getRememberedPassword());
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(!!storage.getRememberedEmail());
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const rememberedEmail = storage.getRememberedEmail();
    const rememberedPass = storage.getRememberedPassword();
    
    if (rememberedEmail && rememberedPass && mode === 'login' && !showResetUI) {
      const autoLogin = async () => {
        setIsLoading(true);
        try {
          const user = await AuthService.login(rememberedEmail, rememberedPass, true);
          onSuccess(user);
        } catch (e) {
          console.warn("Auto-login failed", e);
        } finally {
          setIsLoading(false);
        }
      };
      autoLogin();
    }
  }, []);

  const validateForm = () => {
    if (!email || !password) return false;
    if (mode === 'signup') {
      if (!fullName) {
        alert(i18n.language === 'ar' ? 'يرجى إدخال الاسم الكامل' : 'Please enter full name');
        return false;
      }
      if (password !== confirmPassword) {
        alert(i18n.language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
        return false;
      }
      if (password.length < 6) {
        alert(i18n.language === 'ar' ? 'كلمة المرور قصيرة جداً' : 'Password is too short');
        return false;
      }
      if (!termsAccepted) {
        alert(i18n.language === 'ar' ? 'يجب الموافقة على الشروط' : 'Must accept terms');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const user = await AuthService.signup(fullName, email, password);
        alert(i18n.language === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!');
        setMode('login');
      } else {
        const user = await AuthService.login(email, password, rememberMe);
        onSuccess(user);
      }
    } catch (error: any) {
      alert(AuthService.getAuthErrorMessage(error.code, i18n.language));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await AuthService.loginWithGoogle();
      onSuccess(user);
    } catch (error: any) {
      alert(AuthService.getAuthErrorMessage(error.code, i18n.language));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert(i18n.language === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email');
      return;
    }
    setIsLoading(true);
    try {
      await AuthService.forgotPassword(email);
      setShowResetUI(true);
    } catch (error: any) {
      alert(AuthService.getAuthErrorMessage(error.code, i18n.language));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setShowResetUI(false);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[90vh] py-12 px-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-oued-blue/5 border border-slate-100 p-8 space-y-8 relative overflow-hidden"
      >
        {/* Header */}
        <div className="text-center space-y-4 relative z-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <CompassLogo size={64} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-oued-blue tracking-tight">بوصلة</h1>
          <p className="text-slate-500 text-sm font-medium">
            {showResetUI 
              ? (i18n.language === 'ar' ? 'تم إرسال رابط إعادة التعيين' : 'Reset link sent')
              : (mode === 'login' ? 'سجل دخولك لمتابعة رحلتك' : 'أنشئ حساباً جديداً للبدء')}
          </p>
        </div>

        {!showResetUI && (
          <div className="space-y-4 relative z-10">
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{i18n.language === 'ar' ? 'المتابعة باستخدام Google' : 'Continue with Google'}</span>
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-[1px] bg-slate-100"></div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                {i18n.language === 'ar' ? 'أو' : 'OR'}
              </span>
              <div className="flex-1 h-[1px] bg-slate-100"></div>
            </div>
          </div>
        )}

        {showResetUI ? (
          <div className="space-y-6 text-center py-4">
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-medium">
              {i18n.language === 'ar' 
                ? 'لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.'
                : 'We have sent a password reset link to your email.'}
            </div>
            <button 
              onClick={() => setShowResetUI(false)}
              className="w-full h-12 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              {i18n.language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10 text-right">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                   <User className="w-3 h-3" /> الاسم الكامل
                </label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد أحمد..."
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 text-sm focus:bg-white focus:border-oued-gold focus:ring-4 focus:ring-oued-gold/5 outline-none transition-all"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                 <Mail className="w-3 h-3" /> البريد الإلكتروني
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 text-sm focus:bg-white focus:border-oued-gold focus:ring-4 focus:ring-oued-gold/5 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                   <Lock className="w-3 h-3" /> كلمة المرور
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-2 text-sm focus:bg-white focus:border-oued-gold focus:ring-4 focus:ring-oued-gold/5 outline-none transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                     <ShieldCheck className="w-3 h-3" /> تأكيد كلمة المرور
                  </label>
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 text-sm focus:bg-white focus:border-oued-gold focus:ring-4 focus:ring-oued-gold/5 outline-none transition-all"
                  />
                </div>
              )}
            </div>

            {mode === 'login' ? (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-200 text-oued-blue"
                  />
                  <span className="text-xs font-bold text-slate-400">تذكرني</span>
                </label>
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-xs font-bold text-oued-gold hover:underline"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
            ) : (
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-200 text-oued-blue focus:ring-oued-blue/20" 
                />
                <span className="text-xs text-slate-500 leading-relaxed font-medium">
                  أوافق على <span className="text-oued-blue font-bold">شروط الخدمة</span> و <span className="text-oued-blue font-bold">سياسة الخصوصية</span>
                </span>
              </label>
            )}

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full h-14 bg-oued-blue text-white rounded-2xl font-bold text-lg shadow-lg shadow-oued-blue/20 hover:bg-oued-blue-600 disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-6"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
                  <ArrowLeft className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-6 text-center border-t border-slate-50">
          <button 
            type="button"
            onClick={toggleMode}
            className="text-sm font-bold text-slate-500"
          >
            {mode === 'login' ? (
              <>ليس لديك حساب؟ <span className="text-oued-gold underline">إنشاء حساب جديد</span></>
            ) : (
              <>لديك حساب بالفعل؟ <span className="text-oued-gold underline">تسجيل الدخول</span></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
