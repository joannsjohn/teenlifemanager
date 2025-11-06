import { API_CONFIG, getAuthToken } from '../config/api';

export interface UpdateProfileRequest {
  displayName?: string;
  nickname?: string;
  avatar?: string;
  age?: number;
  grade?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  nickname?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

class UserService {
  private async getHeaders(): Promise<HeadersInit> {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_CONFIG.baseURL}/users/me`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_CONFIG.baseURL}/users/me`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update profile: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<{
    eventsCount: number;
    totalVolunteerHours: number;
    moodEntriesCount: number;
    journalEntriesCount: number;
  }> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_CONFIG.baseURL}/users/me/stats`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
}

export const userService = new UserService();

