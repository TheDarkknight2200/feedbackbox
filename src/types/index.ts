export interface FeedbackMessage {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface AdminUser {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
}