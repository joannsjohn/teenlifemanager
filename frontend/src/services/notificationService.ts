import { API_URL, getAuthToken } from '../config/api';
import { Notification } from '../types';

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  limit: number;
  offset: number;
}

class NotificationService {
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
   * Get all notifications for the current user
   */
  async getNotifications(options: {
    limit?: number;
    offset?: number;
    isRead?: boolean;
    type?: string;
  } = {}): Promise<NotificationResponse> {
    try {
      const headers = await this.getHeaders();
      const params = new URLSearchParams();
      
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.offset) params.append('offset', options.offset.toString());
      if (options.isRead !== undefined) params.append('isRead', options.isRead.toString());
      if (options.type) params.append('type', options.type);

      const response = await fetch(
        `${API_URL}/notifications?${params.toString()}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/notifications/unread`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch unread count: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.count;
    } catch (error) {
      // Re-throw network errors so caller can handle gracefully
      // Don't log here - let the component decide how to handle
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to mark all as read: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();

