import { API_CONFIG, getAuthToken } from '../config/api';
import { ScheduleEvent, EventCategory } from '../types';

export interface CreateEventRequest {
  title: string;
  description?: string;
  startTime: string; // ISO string
  endTime?: string; // ISO string
  category: string;
  color?: string;
  location?: string;
}

export interface BackendEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  category: string;
  color?: string;
  location?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventExtractionRequest {
  text: string;
  timezone?: string;
  preference?: string;
}

export interface ExtractedEventSuggestion {
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  dueTime?: string;
  category?: string;
  confidence: number;
  notes?: string;
}

export interface EventExtractionResponse {
  userId: string;
  summary: string;
  events: ExtractedEventSuggestion[];
}

class EventService {
  /**
   * Get all events for the current user
   */
  async getEvents(startDate?: Date, endDate?: Date, category?: string): Promise<ScheduleEvent[]> {
    try {
      const token = await getAuthToken();
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      if (category) params.append('category', category);

      const url = `${API_CONFIG.baseURL}/events${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Failed to fetch events: ${response.statusText}`);
      }

      const result = await response.json();
      const backendEvents: BackendEvent[] = result.data || [];
      
      // Map backend events to frontend ScheduleEvent format
      return backendEvents.map(event => this.mapBackendEventToScheduleEvent(event));
    } catch (error: any) {
      if (__DEV__) {
        console.error('[EventService] Error fetching events:', error);
      }
      // Return empty array on error - graceful degradation
      return [];
    }
  }

  /**
   * Create a new event
   */
  async createEvent(data: CreateEventRequest): Promise<ScheduleEvent> {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_CONFIG.baseURL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Failed to create event: ${response.statusText}`);
      }

      const result = await response.json();
      return this.mapBackendEventToScheduleEvent(result.data);
    } catch (error: any) {
      if (__DEV__) {
        console.error('[EventService] Error creating event:', error);
      }
      throw error;
    }
  }

  /**
   * Update an event
   */
  async updateEvent(eventId: string, data: Partial<CreateEventRequest>): Promise<ScheduleEvent> {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_CONFIG.baseURL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Failed to update event: ${response.statusText}`);
      }

      const result = await response.json();
      return this.mapBackendEventToScheduleEvent(result.data);
    } catch (error: any) {
      if (__DEV__) {
        console.error('[EventService] Error updating event:', error);
      }
      throw error;
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_CONFIG.baseURL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Failed to delete event: ${response.statusText}`);
      }
    } catch (error: any) {
      if (__DEV__) {
        console.error('[EventService] Error deleting event:', error);
      }
      throw error;
    }
  }

  /**
   * Extract event suggestions from pasted text using AI
   */
  async extractEventsFromText(payload: EventExtractionRequest): Promise<EventExtractionResponse> {
    const token = await getAuthToken();

    const response = await fetch(`${API_CONFIG.baseURL}/events/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error || errorData.message || `Failed to extract events: ${response.statusText}`;
      throw new Error(message);
    }

    const result = await response.json();
    return result.data as EventExtractionResponse;
  }

  /**
   * Map backend event to frontend ScheduleEvent
   */
  private mapBackendEventToScheduleEvent(backendEvent: BackendEvent): ScheduleEvent {
    // Map category string to EventCategory object
    const categoryMap: Record<string, EventCategory> = {
      'homework': { id: '1', name: 'School', color: '#3b82f6', icon: 'school' },
      'exam': { id: '2', name: 'Study', color: '#10b981', icon: 'book' },
      'personal': { id: '3', name: 'Personal', color: '#f59e0b', icon: 'calendar' },
      'volunteer': { id: '4', name: 'Volunteering', color: '#ef4444', icon: 'heart' },
      'social': { id: '5', name: 'Social', color: '#8b5cf6', icon: 'people' },
    };

    const category = categoryMap[backendEvent.category] || {
      id: backendEvent.category,
      name: backendEvent.category,
      color: backendEvent.color || '#6366f1',
      icon: 'calendar',
    };

    return {
      id: backendEvent.id,
      title: backendEvent.title,
      description: backendEvent.description,
      startTime: new Date(backendEvent.startTime),
      endTime: backendEvent.endTime ? new Date(backendEvent.endTime) : new Date(backendEvent.startTime),
      category,
      priority: 'medium', // Default priority
      isRecurring: false, // Default to false
      location: backendEvent.location,
      isCompleted: false, // Default to false
      createdAt: new Date(backendEvent.createdAt),
      updatedAt: new Date(backendEvent.updatedAt),
    };
  }
}

export const eventService = new EventService();

