// src/pages/PropertyDetail.tsx
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { propertyService } from '../services/propertyService';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Bed,
  Bath,
  Home,
  Calendar,
  DollarSign,
  PawPrint,
  Car,
  FileText,
  User,
  Phone,
  Mail,
} from 'lucide-react';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getProperty(id!),
    enabled: !!id,
  });

  const favoriteMutation = useMutation({
    mutationFn: () => propertyService.toggleFavorite(id!),
    onSuccess: () => {
      setIsFavorite(!isFavorite);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading property...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Property not found</p>
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
          Back to Properties
        </Link>
      </div>
    );
  }

  const images = property.images.sort((a, b) => a.order - b.order);
  const currentImage = images[selectedImageIndex] || images[0];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Properties</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div>
              <div className="relative h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                {currentImage ? (
                  <img
                    src={currentImage.url}
                    alt={currentImage.caption || property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-20 rounded-lg overflow-hidden border-2 transition ${
                        index === selectedImageIndex
                          ? 'border-blue-600'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.caption || `Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title and Price */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <button
                  onClick={() => favoriteMutation.mutate()}
                  className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center space-x-6 text-lg text-gray-700 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <Bed className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bath className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">{property.bathrooms} Bathrooms</span>
                </div>
                {property.squareFootage && (
                  <div className="flex items-center space-x-2">
                    <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium">{property.squareFootage} sq ft</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Additional Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.petPolicy && (
                  <div className="flex items-start space-x-3">
                    <PawPrint className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Pet Policy</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{property.petPolicy}</p>
                    </div>
                  </div>
                )}

                {property.parkingSpaces !== undefined && (
                  <div className="flex items-start space-x-3">
                    <Car className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Parking</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{property.parkingSpaces} spaces</p>
                    </div>
                  </div>
                )}

                {property.leaseTerms && (
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Lease Terms</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{property.leaseTerms}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Available</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(property.dateAvailable).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            {property.lat && property.lng && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Location</h2>
                <div className="h-80 rounded-lg overflow-hidden">
                  <APIProvider apiKey={MAPS_API_KEY}>
                    <Map
                      defaultCenter={{ lat: property.lat, lng: property.lng }}
                      defaultZoom={15}
                      mapId="property-detail-map"
                    >
                      <AdvancedMarker position={{ lat: property.lat, lng: property.lng }} />
                    </Map>
                  </APIProvider>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">${property.rent}</p>
                    <p className="text-gray-600 dark:text-gray-400">per month</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full">
                    {property.propertyType}
                  </span>
                </div>

                {property.available ? (
                  <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-800 dark:text-green-300 font-medium text-center">Available Now</p>
                  </div>
                ) : (
                  <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-center">Not Currently Available</p>
                  </div>
                )}
              </div>

              {/* Landlord Contact */}
              {property.landlord && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Contact Landlord</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span>{property.landlord.name}</span>
                    </div>
                    {property.landlord.phone && (
                      <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                        <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <a
                          href={`tel:${property.landlord.phone}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {property.landlord.phone}
                        </a>
                      </div>
                    )}
                    {property.landlord.email && (
                      <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                        <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <a
                          href={`mailto:${property.landlord.email}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400 break-all"
                        >
                          {property.landlord.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
