// src/services/propertyService.ts
import api from './api';
import type { Property, PropertyFilters, ApiResponse } from '../types';

export const propertyService = {
  // Get all properties with filters
  getProperties: async (filters?: PropertyFilters): Promise<ApiResponse<Property[]>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await api.get<ApiResponse<Property[]>>(`/properties?${params.toString()}`);
    return response.data;
  },

  // Get single property by ID
  getProperty: async (id: string): Promise<Property> => {
    const response = await api.get<ApiResponse<Property>>(`/properties/${id}`);
    return response.data.data!;
  },

  // Create new property (provider)
  createProperty: async (data: Omit<Property, '_id' | 'viewCount' | 'favoriteCount' | 'createdAt' | 'updatedAt'>): Promise<Property> => {
    const response = await api.post<ApiResponse<Property>>('/properties', data);
    return response.data.data!;
  },

  // Update property
  updateProperty: async (id: string, data: Partial<Property>): Promise<Property> => {
    const response = await api.put<ApiResponse<Property>>(`/properties/${id}`, data);
    return response.data.data!;
  },

  // Delete property
  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },

  // Approve property (admin)
  approveProperty: async (id: string): Promise<Property> => {
    const response = await api.patch<ApiResponse<Property>>(`/properties/${id}/approve`);
    return response.data.data!;
  },

  // Reject property (admin)
  rejectProperty: async (id: string, reason?: string): Promise<Property> => {
    const response = await api.patch<ApiResponse<Property>>(`/properties/${id}/reject`, { reason });
    return response.data.data!;
  },

  // Increment view count
  incrementViewCount: async (id: string): Promise<void> => {
    await api.post(`/properties/${id}/view`);
  },

  // Toggle favorite
  toggleFavorite: async (id: string): Promise<void> => {
    await api.post(`/properties/${id}/favorite`);
  },

  // Get user's favorite properties
  getFavorites: async (): Promise<Property[]> => {
    const response = await api.get<ApiResponse<Property[]>>('/properties/favorites');
    return response.data.data!;
  },
};
