import { API_URL, getAuthToken } from '../config/api';
import { Organization } from '../types';

export interface CreateOrganizationData {
  name: string;
  description?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  categories?: string[];
}

export interface UpdateOrganizationData extends Partial<CreateOrganizationData> {
  isVerified?: boolean;
}

class OrganizationService {
  private async getHeaders(): Promise<HeadersInit> {
    const token = await getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getOrganizations(filters?: { verified?: boolean; search?: string }): Promise<Organization[]> {
    try {
      const headers = await this.getHeaders();
      const queryParams = new URLSearchParams();
      if (filters?.verified !== undefined) {
        queryParams.append('verified', filters.verified.toString());
      }
      if (filters?.search) {
        queryParams.append('search', filters.search);
      }

      const url = `${API_URL}/organizations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch organizations: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      // Re-throw network errors so caller can handle gracefully
      if (__DEV__) {
        console.log('Organization service unavailable - backend may not be running');
      }
      throw error;
    }
  }

  async getOrganizationById(id: string): Promise<Organization> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/organizations/${id}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch organization: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      if (__DEV__) {
        console.log('Error fetching organization:', error);
      }
      throw error;
    }
  }

  async createOrganization(data: CreateOrganizationData): Promise<Organization> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/organizations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create organization: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      if (__DEV__) {
        console.log('Error creating organization:', error);
      }
      throw error;
    }
  }

  async updateOrganization(id: string, data: UpdateOrganizationData): Promise<Organization> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/organizations/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update organization: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      if (__DEV__) {
        console.log('Error updating organization:', error);
      }
      throw error;
    }
  }

  async deleteOrganization(id: string): Promise<void> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_URL}/organizations/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete organization: ${response.statusText}`);
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Error deleting organization:', error);
      }
      throw error;
    }
  }
}

export const organizationService = new OrganizationService();

