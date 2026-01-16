// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'provider' | 'admin' | 'superadmin';
  employeeId: string;
  department?: string;
  verified: boolean;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  address: string;
  unitNumber?: string;
  location?: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  lat?: number;
  lng?: number;
  propertyType: 'apartment' | 'house' | 'condo' | 'townhome';
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
  rent: number;
  images: PropertyImage[];
  amenities: string[];
  available: boolean;
  dateAvailable: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  landlord?: {
    name: string;
    phone: string;
    email: string;
  };
  distanceToHospital?: number;
  petPolicy?: string;
  parkingSpaces?: number;
  leaseTerms?: string;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyImage {
  url: string;
  isPrimary: boolean;
  order: number;
  caption?: string;
}

export interface PropertyFilters {
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  search?: string;
  sortBy?: 'price-low' | 'price-high' | 'newest' | 'bedrooms' | 'popular';
  page?: number;
  limit?: number;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  totalPages?: number;
  currentPage?: number;
  message?: string;
}