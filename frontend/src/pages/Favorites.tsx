// src/pages/Favorites.tsx
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { Heart, MapPin, Bed, Bath, DollarSign } from 'lucide-react';
import type { Property } from '../types';

export const Favorites = () => {
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => propertyService.getFavorites(),
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Favorites</h1>
          <p className="text-gray-600 dark:text-gray-400">Properties you've saved for later</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400">Loading favorites...</div>
          </div>
        ) : !favorites || favorites.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No favorites yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring properties and save your favorites to view them here
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <FavoriteCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Favorite Card Component
const FavoriteCard = ({ property }: { property: Property }) => {
  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];

  return (
    <Link to={`/property/${property._id}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
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
          <div className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              ${property.rent}/month
            </h3>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
              {property.propertyType}
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 font-medium mb-2 line-clamp-1">{property.title}</p>

          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 text-sm mb-3">
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
          </div>

          <div className="flex items-start space-x-1 text-gray-600 dark:text-gray-400 text-sm">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1">{property.address}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
