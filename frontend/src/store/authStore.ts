import { create } from 'zustand';
import { User, AppState } from '../types';

interface AuthState extends AppState {
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: any) => void;
  markNotificationAsRead: (notificationId: string) => void;
}

// Helper to ensure boolean values are always booleans
const ensureBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true' || value === '1';
  if (typeof value === 'number') return value !== 0;
  return false;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  theme: 'light',
  notifications: [],

  login: (user: User) => {
    set({
      user,
      isAuthenticated: true, // Explicitly set as boolean
      isLoading: false,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false, // Explicitly set as boolean
      notifications: [],
    });
  },

  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: { ...currentUser, ...userData },
      });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
  },

  addNotification: (notification: any) => {
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
  },

  markNotificationAsRead: (notificationId: string) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      ),
    }));
  },
}));
