import { auth, registerWithEmail, loginWithEmail, signInWithGoogle, resetPassword as firebaseResetPassword, logout as firebaseLogout, saveUserToFirestore } from '../lib/firebase';
import { storage } from '../lib/storage';
import { updateProfile } from 'firebase/auth';

export class AuthService {
  static async loginWithGoogle() {
    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;
      
      await saveUserToFirestore(user);
      
      const profile = {
        email: user.email!,
        fullName: user.displayName || user.email?.split('@')[0] || 'Unknown',
        createdAt: new Date().toISOString(),
        uid: user.uid,
        photoURL: user.photoURL
      };

      // Force session persistence for Google
      storage.setSession(profile as any, true);
      return user;
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw { code: 'SIGN_IN_CANCELLED' };
      }
      console.error("Google Auth Error:", error.code, error.message);
      throw error;
    }
  }

  static async signup(fullName: string, email: string, pass: string) {
    try {
      const userCredential = await registerWithEmail(email, pass);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, { displayName: fullName });
      
      // Save to firestore
      await saveUserToFirestore(user);
      
      // Save locally
      await storage.register(email, pass);
      
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  static async login(email: string, pass: string, rememberMe: boolean = false) {
    try {
      const userCredential = await loginWithEmail(email, pass);
      const user = userCredential.user;

      const profile = {
        email: user.email!,
        fullName: user.displayName || email.split('@')[0],
        createdAt: new Date().toISOString(),
        uid: user.uid
      };

      storage.setSession(profile as any, rememberMe, pass);
      return user;
    } catch (error: any) {
      // Local backup login if Firebase fails or is offline (optional depending on UX)
      const localProfile = await storage.login(email, pass);
      if (localProfile) {
        storage.setSession(localProfile as any, rememberMe, pass);
        return { email: localProfile.email, displayName: localProfile.fullName, uid: localProfile.email } as any;
      }
      throw error;
    }
  }

  static async forgotPassword(email: string) {
    try {
      await firebaseResetPassword(email);
    } catch (error) {
      throw error;
    }
  }

  static async logout() {
    try {
      await firebaseLogout();
      storage.logout();
    } catch (error) {
      storage.logout();
    }
  }

  static getAuthErrorMessage(code: string, language: string = 'ar'): string {
    const isAr = language === 'ar';
    switch (code) {
      case 'auth/popup-blocked':
        return isAr 
          ? 'تم حظر النافذة المنبثقة. يرجى تفعيل السماح بالنوافذ المنبثقة في متصفحك أو قم بفتح التطبيق في نافذة مستقلة.' 
          : 'Popup blocked. Please allow popups in your browser or open the app in a new tab.';
      case 'auth/cancelled-popup-request':
      case 'auth/popup-closed-by-user':
      case 'SIGN_IN_CANCELLED':
        return isAr ? 'تم إلغاء عملية تسجيل الدخول. يرجى المحاولة مرة أخرى وإبقاء النافذة مفتوحة.' : 'Sign in cancelled. Please try again and keep the popup open.';
      case 'auth/email-already-in-use':
        return isAr ? 'هذا البريد الإلكتروني مستخدم بالفعل' : 'Email already in use';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return isAr ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials';
      case 'auth/user-not-found':
        return isAr ? 'الحساب غير موجود' : 'Account not found';
      case 'auth/operation-not-allowed':
        return isAr ? 'طريقة الدخول هذه غير مفعلة في إعدادات فيربيز' : 'This login method is not enabled in Firebase';
      case 'PLAY_SERVICES_NOT_AVAILABLE':
        return isAr ? 'خدمات Google Play غير متوفرة على هذا الجهاز' : 'Google Play services not available';
      default:
        return isAr ? `حدث خطأ: ${code}` : `Error occurred: ${code}`;
    }
  }
}
