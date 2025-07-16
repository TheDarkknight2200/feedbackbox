import { AdminUser, AuthState } from '../types';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'Passer123'
};

export class AuthService {
  private static readonly AUTH_KEY = 'feedback_auth';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static login(username: string, password: string): boolean {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const authData = {
        isAuthenticated: true,
        user: { username },
        timestamp: Date.now()
      };
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));
      return true;
    }
    return false;
  }

  static logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }

  static isAuthenticated(): boolean {
    const authData = localStorage.getItem(this.AUTH_KEY);
    if (!authData) return false;

    try {
      const parsed = JSON.parse(authData);
      const now = Date.now();
      
      // Check if session has expired
      if (now - parsed.timestamp > this.SESSION_DURATION) {
        this.logout();
        return false;
      }

      return parsed.isAuthenticated;
    } catch {
      return false;
    }
  }

  static getUser(): AdminUser | null {
    const authData = localStorage.getItem(this.AUTH_KEY);
    if (!authData) return null;

    try {
      const parsed = JSON.parse(authData);
      return parsed.user || null;
    } catch {
      return null;
    }
  }
}