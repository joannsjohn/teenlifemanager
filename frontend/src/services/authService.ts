import { API_CONFIG } from '../config/api';

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  nickname?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    nickname?: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      if (__DEV__) {
        console.log('[AuthService] Registering user:', data.email);
      }

      const response = await fetch(`${API_CONFIG.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (__DEV__) {
        console.log('[AuthService] Register response status:', response.status);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || `Registration failed: ${response.statusText}`;
        if (__DEV__) {
          console.error('[AuthService] Register error:', errorMessage, errorData);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      if (__DEV__) {
        console.log('[AuthService] Register success:', result.data?.user?.email);
      }
      return result.data;
    } catch (error: any) {
      if (__DEV__) {
        console.error('[AuthService] Register exception:', error);
      }
      // If it's a network error, provide a helpful message
      if (error.message?.includes('Network request failed') || error.message?.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Login failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error: any) {
      if (__DEV__) {
        console.error('Error logging in:', error);
      }
      throw error;
    }
  }
}

export const authService = new AuthService();

