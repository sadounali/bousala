import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, saveUserToFirestore, testConnection, db } from './firebase';
import { storage } from './storage';
import { UserRole, UserTier } from '../types';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: any;
  loading: boolean;
  isAdmin: boolean;
  tier: UserTier;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  isAdmin: false,
  tier: UserTier.GUEST,
  role: UserRole.STUDENT
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [tier, setTier] = useState<UserTier>(UserTier.GUEST);

  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        await saveUserToFirestore(fbUser);
        
        // Fetch extended profile for role/tier
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role || (fbUser.email === '3ALISADOUN@gmail.com' ? UserRole.ADMIN : UserRole.STUDENT));
            setTier(data.tier || UserTier.FREE);
          } else {
            setRole(fbUser.email === '3ALISADOUN@gmail.com' ? UserRole.ADMIN : UserRole.STUDENT);
            setTier(UserTier.FREE);
          }
        } catch (e) {
          console.error("Profile fetch error:", e);
        }
      } else {
        const localSession = storage.getSession();
        setUser(localSession);
        setRole(UserRole.STUDENT);
        setTier(UserTier.GUEST);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin: role === UserRole.ADMIN,
      tier,
      role
    }}>
      {children}
    </AuthContext.Provider>
  );
};
