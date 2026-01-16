// src/pages/Admin.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Bed,
  Bath,
  DollarSign,
  Clock,
  AlertCircle,
} from 'lucide-react';
import type { Property } from '../types';

export const Admin = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['properties', { status: filter }],
    queryFn: () => propertyService.getProperties({ sortBy: 'newest' }),
  });

  const properties = (data?.data || []).filter((p) => p.status === filter);

  const approveMutation = useMutation({
    mutationFn: (id: string) => propertyService.approveProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => propertyService.rejectProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Review and manage property submissions</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 p-1 flex space-x-2">
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 px-4 py-3 rounded-md font-medium transition ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Pending</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                {(data?.data || []).filter((p) => p.status === 'pending').length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setFilter('approved')}
            className={`flex-1 px-4 py-3 rounded-md font-medium transition ${
              filter === 'approved'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Approved</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                {(data?.data || []).filter((p) => p.status === 'approved').length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setFilter('rejected')}
            className={`flex-1 px-4 py-3 rounded-md font-medium transition ${
              filter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <XCircle className="w-4 h-4" />
              <span>Rejected</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                {(data?.data || []).filter((p) => p.status === 'rejected').length}
              </span>
            </div>
          </button>
        </div>

        {/* Property List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400">Loading properties...</div>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No {filter} properties found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <PropertyReviewCard
                key={property._id}
                property={property}
                onApprove={() => approveMutation.mutate(property._id)}
                onReject={() => rejectMutation.mutate(property._id)}
                isLoading={approveMutation.isPending || rejectMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Property Review Card Component
interface PropertyReviewCardProps {
  property: Property;
  onApprove: () => void;
  onReject: () => void;
  isLoading: boolean;
}

const PropertyReviewCard = ({
  property,
  onApprove,
  onReject,
  isLoading,
}: PropertyReviewCardProps) => {
  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="p-6">
        <div className="flex gap-6">
          {/* Image */}
          <div className="flex-shrink-0 w-48 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{property.title}</h3>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{property.address}</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full">
                {property.propertyType}
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{property.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">${property.rent}/mo</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Submitted: {new Date(property.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Landlord Info */}
            {property.landlord && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Landlord:</span> {property.landlord.name}
                  {property.landlord.phone && ` • ${property.landlord.phone}`}
                  {property.landlord.email && ` • ${property.landlord.email}`}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Link
                to={`/property/${property._id}`}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </Link>

              {property.status === 'pending' && (
                <>
                  <button
                    onClick={onApprove}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-green-400 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={onReject}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-red-400 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
