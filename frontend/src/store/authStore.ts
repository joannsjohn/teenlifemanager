import { create } from 'zustand';
import { User, AppState, Notification } from '../types';
import { notificationService } from '../services/notificationService';

interface AuthState extends AppState {
  token: string | null;
  login: (user: User, token?: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  loadNotifications: () => Promise<void>;
  syncNotifications: () => Promise<void>;
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
  token: null,
  isAuthenticated: false,
  isLoading: false,
  theme: 'light',
  notifications: [],

  login: (user: User, token?: string) => {
    console.log('[authStore] DEBUG - login called with user:', user);
    const authValue = true;
    const loadingValue = false;
    // For now, use a mock token if none provided (for development)
    // In production, this should come from the actual login API response
    const authToken = token || `mock-token-${user.id}-${Date.now()}`;
    console.log('[authStore] DEBUG - Setting isAuthenticated:', authValue, 'Type:', typeof authValue);
    set((state) => ({
      user,
      token: authToken,
      isAuthenticated: authValue,
      isLoading: loadingValue,
    }));
    console.log('[authStore] DEBUG - State updated, new isAuthenticated:', get().isAuthenticated, 'Type:', typeof get().isAuthenticated);
    // Load notifications after login (non-blocking)
    get().loadNotifications().catch(() => {
      // Silently handle - notifications will be available when backend is running
    });
  },

  logout: () => {
    console.log('[authStore] DEBUG - logout called');
    const authValue = false;
    console.log('[authStore] DEBUG - Setting isAuthenticated:', authValue, 'Type:', typeof authValue);
    set((state) => ({
      user: null,
      token: null,
      isAuthenticated: authValue,
      notifications: [],
    }));
    console.log('[authStore] DEBUG - State updated, new isAuthenticated:', get().isAuthenticated, 'Type:', typeof get().isAuthenticated);
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

  markNotificationAsRead: async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        ),
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Still update locally on error
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        ),
      }));
    }
  },

  loadNotifications: async () => {
    try {
      const response = await notificationService.getNotifications({ limit: 50 });
      set({ notifications: response.notifications });
    } catch (error) {
      // Silently fail - network errors are expected when backend is not available
      // Only log in development mode
      if (__DEV__) {
        console.log('Notification service unavailable - backend may not be running');
      }
      // Keep existing notifications or empty array
    }
  },

  syncNotifications: async () => {
    try {
      const response = await notificationService.getNotifications({ limit: 50 });
      set({ notifications: response.notifications });
    } catch (error) {
      // Silently fail - network errors are expected when backend is not available
      if (__DEV__) {
        console.log('Notification service unavailable - backend may not be running');
      }
      // Keep existing notifications
    }
  },
}));
