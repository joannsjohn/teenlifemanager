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

// Helper to ensure boolean values are ALWAYS booleans - used internally
const toStrictBoolean = (value: any): boolean => {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return Boolean(value);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  theme: 'light',
  notifications: [],

  login: (user: User) => {
    set((state) => ({
      user,
      isAuthenticated: toStrictBoolean(true), // Force boolean conversion
      isLoading: toStrictBoolean(false),
    }));
  },

  logout: () => {
    set((state) => ({
      user: null,
      isAuthenticated: toStrictBoolean(false), // Force boolean conversion
      notifications: [],
    }));
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
