// src/pages/PropertyList.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { propertyService } from '../services/propertyService';
import { Search, Filter, MapPin, Bed, Bath, Heart, Home as HomeIcon, ChevronDown } from 'lucide-react';
import type { Property, PropertyFilters } from '../types';

const BOZEMAN_CENTER = { lat: 45.6793, lng: -111.0373 };
const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const PropertyList = () => {
  const [filters, setFilters] = useState<PropertyFilters>({
    sortBy: 'newest',
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getProperties(filters),
  });

  const properties = data?.data || [];

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Search Bar - Zillow Style */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by address, neighborhood, or ZIP"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex gap-2">
              {/* Property Type */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showFilters && (
                  <div className="absolute top-full mt-2 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Property Type
                        </label>
                        <select
                          value={filters.propertyType || ''}
                          onChange={(e) => handleFilterChange('propertyType', e.target.value || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="">All Types</option>
                          <option value="apartment">Apartment</option>
                          <option value="house">House</option>
                          <option value="condo">Condo</option>
                          <option value="townhome">Townhome</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Min Price
                          </label>
                          <input
                            type="number"
                            placeholder="No Min"
                            value={filters.minPrice || ''}
                            onChange={(e) =>
                              handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Max Price
                          </label>
                          <input
                            type="number"
                            placeholder="No Max"
                            value={filters.maxPrice || ''}
                            onChange={(e) =>
                              handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bedrooms
                        </label>
                        <div className="flex gap-2">
                          {[0, 1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              onClick={() => handleFilterChange('bedrooms', num)}
                              className={`flex-1 px-3 py-2 border rounded-md text-sm font-medium ${
                                filters.bedrooms === num
                                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {num === 0 ? 'Studio' : num === 4 ? '4+' : num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Sort By
                        </label>
                        <select
                          value={filters.sortBy || 'newest'}
                          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="newest">Newest</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="bedrooms">Most Bedrooms</option>
                        </select>
                      </div>

                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">{properties.length}</span> homes available
          </div>
        </div>
      </div>

      {/* Zillow-Style Split View: Map Left, List Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Section - Fixed Left Side */}
        <div className="w-1/2 relative">
          <APIProvider apiKey={MAPS_API_KEY}>
            <Map
              defaultCenter={BOZEMAN_CENTER}
              defaultZoom={12}
              mapId="bozeman-health-housing"
              className="w-full h-full"
            >
              {properties.map((property) => (
                property.lat && property.lng && (
                  <AdvancedMarker
                    key={property._id}
                    position={{ lat: property.lat, lng: property.lng }}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border-2 border-blue-600 hover:scale-110 transition-transform cursor-pointer">
                      <span className="font-bold text-sm">${property.rent.toLocaleString()}</span>
                    </div>
                  </AdvancedMarker>
                )
              ))}

              {selectedProperty && selectedProperty.lat && selectedProperty.lng && (
                <InfoWindow
                  position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
                  onCloseClick={() => setSelectedProperty(null)}
                >
                  <Link
                    to={`/property/${selectedProperty._id}`}
                    className="block p-2 hover:opacity-75"
                  >
                    <div className="w-64">
                      <h3 className="font-bold text-base mb-1">${selectedProperty.rent.toLocaleString()}/mo</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {selectedProperty.bedrooms} bd | {selectedProperty.bathrooms} ba | {selectedProperty.squareFootage || '---'} sqft
                      </p>
                      <p className="text-sm text-gray-700">{selectedProperty.address}</p>
                    </div>
                  </Link>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>

        {/* Property Cards Section - Scrollable Right Side */}
        <div className="w-1/2 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-600 dark:text-gray-400">Loading properties...</div>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <HomeIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No properties found</h2>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {properties.map((property) => (
                <ZillowStyleCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Zillow-Style Property Card
const ZillowStyleCard = ({ property }: { property: Property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await propertyService.toggleFavorite(property._id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];

  return (
    <Link to={`/property/${property._id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700">
        <div className="flex">
          {/* Image */}
          <div className="relative w-64 h-44 flex-shrink-0 bg-gray-200 dark:bg-gray-700">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <HomeIcon className="w-16 h-16 text-gray-300 dark:text-gray-500" />
              </div>
            )}
            <button
              onClick={handleFavorite}
              className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition-transform z-10"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
                }`}
              />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            {/* Price */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${property.rent.toLocaleString()}
              </span>
              <span className="text-gray-600 dark:text-gray-400">/mo</span>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span className="font-medium">{property.bedrooms}</span>
                <span className="text-sm">bd</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span className="font-medium">{property.bathrooms}</span>
                <span className="text-sm">ba</span>
              </div>
              {property.squareFootage && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">{property.squareFootage.toLocaleString()}</span>
                  <span className="text-sm">sqft</span>
                </div>
              )}
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded capitalize">
                {property.propertyType}
              </span>
            </div>

            {/* Address */}
            <div className="flex items-start gap-1 text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{property.address}</span>
            </div>

            {/* Title/Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{property.description}</p>

            {/* Landlord */}
            {property.landlord && (
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Listed by {property.landlord.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
