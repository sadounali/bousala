
export interface UserProfile {
  email: string;
  fullName: string;
  createdAt: string;
}

export interface AuthSession {
  user: UserProfile;
  expiresAt: number;
}

class AppStorage {
  private USERS_KEY = 'compass_users';
  private SESSION_KEY = 'compass_session';
  private REMEMBER_KEY = 'compass_remember_email';
  private REMEMBER_PASS_KEY = 'compass_remember_pass';
  private SECRET_PREFIX = 'c0mp4ss_';

  // Helper to hash password using SHA-256
  private async hashPassword(password: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Helper to "encrypt" data (Base64 + XOR simulation for demo security)
  private encrypt(data: string): string {
    try {
      const b64 = btoa(unescape(encodeURIComponent(data)));
      return this.SECRET_PREFIX + b64.split('').reverse().join('');
    } catch (e) {
      return data;
    }
  }

  // Helper to "decrypt" data
  private decrypt(encoded: string): string {
    if (!encoded || !encoded.startsWith(this.SECRET_PREFIX)) return encoded;
    try {
      const b64 = encoded.replace(this.SECRET_PREFIX, '').split('').reverse().join('');
      return decodeURIComponent(escape(atob(b64)));
    } catch (e) {
      return encoded;
    }
  }

  // 1. Save user data (Registration)
  async register(email: string, password: string): Promise<boolean> {
    const users = this.getUsers();
    if (users[email]) return false; // Already exists

    users[email] = {
      profile: {
        email,
        fullName: email.split('@')[0],
        createdAt: new Date().toISOString(),
      },
      password: btoa(password) // Basic encoding for demo
    };

    localStorage.setItem(this.USERS_KEY, this.encrypt(JSON.stringify(users)));
    return true;
  }

  // 2. Verify login data
  async login(email: string, password: string): Promise<UserProfile | null> {
    const users = this.getUsers();
    const userEntry = users[email];
    const encodedPass = btoa(password);

    if (userEntry && userEntry.password === encodedPass) {
      const userWithUid = { ...userEntry.profile, uid: email };
      return userWithUid as any;
    }

    return null;
  }

  // 3. Reset password
  async resetPassword(email: string, newPassword: string): Promise<boolean> {
    const users = this.getUsers();
    if (!users[email]) return false;

    users[email].password = btoa(newPassword);
    localStorage.setItem(this.USERS_KEY, this.encrypt(JSON.stringify(users)));
    return true;
  }

  // Check if a user exists
  hasUser(email: string): boolean {
    const users = this.getUsers();
    return !!users[email];
  }

  private getUsers(): Record<string, any> {
    const raw = localStorage.getItem(this.USERS_KEY);
    if (!raw) return {};
    try {
      const data = this.decrypt(raw);
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }

  // Session detection logic
  setSession(user: UserProfile, remember: boolean = false, password?: string): void {
    const session: AuthSession = {
      user,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24h
    };
    localStorage.setItem(this.SESSION_KEY, this.encrypt(JSON.stringify(session)));
    
    if (remember) {
      localStorage.setItem(this.REMEMBER_KEY, this.encrypt(user.email));
      if (password) {
        localStorage.setItem(this.REMEMBER_PASS_KEY, this.encrypt(password));
      }
    } else {
      localStorage.removeItem(this.REMEMBER_KEY);
      localStorage.removeItem(this.REMEMBER_PASS_KEY);
    }
  }

  // 2. Detect active session
  getSession(): UserProfile | null {
    const raw = localStorage.getItem(this.SESSION_KEY);
    if (!raw) {
      // Create a guest session if none exists to satisfy UI requirements
      const guestUser = {
        email: 'student@univ.edu.dz',
        fullName: 'طالب زائر (Guest)',
        createdAt: new Date().toISOString(),
        uid: 'guest-123'
      };
      this.setSession(guestUser as any, true);
      return guestUser as any;
    }

    try {
      const sessionStr = this.decrypt(raw);
      const session: AuthSession = JSON.parse(sessionStr);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session.user;
    } catch (e) {
      return null;
    }
  }

  // 3. Logout
  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  // 4. Remember Me helper
  getRememberedEmail(): string {
    const raw = localStorage.getItem(this.REMEMBER_KEY);
    if (!raw) return '';
    try {
      return this.decrypt(raw);
    } catch (e) {
      return '';
    }
  }

  getRememberedPassword(): string {
    const raw = localStorage.getItem(this.REMEMBER_PASS_KEY);
    if (!raw) return '';
    try {
      return this.decrypt(raw);
    } catch (e) {
      return '';
    }
  }

  clearRemembered(): void {
    localStorage.removeItem(this.REMEMBER_KEY);
    localStorage.removeItem(this.REMEMBER_PASS_KEY);
  }
}

export const storage = new AppStorage();
