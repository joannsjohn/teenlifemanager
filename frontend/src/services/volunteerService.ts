import { API_URL, getAuthToken } from '../config/api';
import { VolunteeringRecord } from '../types';

export interface CreateVolunteerHourData {
  organizationId?: string;
  organization: string;
  description: string;
  hours: number;
  date: Date | string;
  location?: string;
  supervisorEmail?: string;
  supervisorName?: string;
}

export interface UpdateVolunteerHourData extends Partial<CreateVolunteerHourData> {
  verified?: boolean;
}

export interface VolunteerHourFilters {
  startDate?: Date;
  endDate?: Date;
  organization?: string;
  verified?: boolean;
}

class VolunteerService {
  private async getHeaders(): Promise<HeadersInit> {
    const token = await getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getVolunteerHours(filters?: VolunteerHourFilters): Promise<VolunteeringRecord[]> {
    try {
      const headers = await this.getHeaders();
      const queryParams = new URLSearchParams();
      
      if (filters?.startDate) {
        queryParams.append('startDate', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        queryParams.append('endDate', filters.endDate.toISOString());
      }
      if (filters?.organization) {
        queryParams.append('organization', filters.organization);
      }
      if (filters?.verified !== undefined) {
        queryParams.append('verified', filters.verified.toString());
      }

      const url = `${API_URL}/volunteer${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch volunteer hours: ${response.statusText}`);
      }

      const data = await response.json();
      // Transform backend data to frontend format
      return (data.data || []).map((item: any) => ({
        id: item.id,
        organizationId: item.organizationId || '',
        organizationName: item.organization || '',
        activity: item.description.substring(0, 50) || 'Volunteer Work',
        description: item.description,
        startTime: new Date(item.date),
        endTime: new Date(new Date(item.date).getTime() + item.hours * 60 * 60 * 1000),
        hours: item.hours,
        status: item.verified ? 'approved' : 'pending',
        supervisorName: item.supervisorName,
        supervisorEmail: item.supervisorEmail,
        verificationCode: item.verificationCode,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
    } catch (error) {
      // Re-throw network errors so caller can handle gracefully
      // Only log in development mode
      if (__DEV__) {
        console.log('Volunteer service unavailable - backend may not be running');
      }
      throw error;
    }
  }

  async getTotalHours(): Promise<number> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/volunteer/total`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch total hours: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data?.totalHours || 0;
    } catch (error) {
      // Re-throw network errors so caller can handle gracefully
      if (__DEV__) {
        console.log('Volunteer service unavailable - backend may not be running');
      }
      throw error;
    }
  }

  async createVolunteerHour(data: CreateVolunteerHourData): Promise<VolunteeringRecord> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/volunteer`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...data,
          date: typeof data.date === 'string' ? data.date : data.date.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create volunteer hour: ${response.statusText}`);
      }

      const result = await response.json();
      const item = result.data;
      return {
        id: item.id,
        organizationId: item.organizationId || '',
        organizationName: item.organization || '',
        activity: item.description.substring(0, 50) || 'Volunteer Work',
        description: item.description,
        startTime: new Date(item.date),
        endTime: new Date(new Date(item.date).getTime() + item.hours * 60 * 60 * 1000),
        hours: item.hours,
        status: item.verified ? 'approved' : 'pending',
        supervisorName: item.supervisorName,
        supervisorEmail: item.supervisorEmail,
        verificationCode: item.verificationCode,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      };
    } catch (error) {
      // Re-throw errors so caller can show appropriate messages
      if (__DEV__) {
        console.log('Error creating volunteer hour:', error);
      }
      throw error;
    }
  }

  async updateVolunteerHour(id: string, data: UpdateVolunteerHourData): Promise<VolunteeringRecord> {
    try {
      const headers = await this.getHeaders();
      const updateData: any = { ...data };
      if (data.date) {
        updateData.date = typeof data.date === 'string' ? data.date : data.date.toISOString();
      }

      const response = await fetch(`${API_URL}/volunteer/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update volunteer hour: ${response.statusText}`);
      }

      const result = await response.json();
      const item = result.data;
      return {
        id: item.id,
        organizationId: item.organizationId || '',
        organizationName: item.organization || '',
        activity: item.description.substring(0, 50) || 'Volunteer Work',
        description: item.description,
        startTime: new Date(item.date),
        endTime: new Date(new Date(item.date).getTime() + item.hours * 60 * 60 * 1000),
        hours: item.hours,
        status: item.verified ? 'approved' : 'pending',
        supervisorName: item.supervisorName,
        supervisorEmail: item.supervisorEmail,
        verificationCode: item.verificationCode,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      };
    } catch (error) {
      if (__DEV__) {
        console.log('Error updating volunteer hour:', error);
      }
      throw error;
    }
  }

  async deleteVolunteerHour(id: string): Promise<void> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/volunteer/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete volunteer hour: ${response.statusText}`);
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Error deleting volunteer hour:', error);
      }
      throw error;
    }
  }
}

export const volunteerService = new VolunteerService();

