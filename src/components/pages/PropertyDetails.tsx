import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Share2, 
  Phone, 
  Mail, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car,
  Star,
  Calendar,
  Shield,
  CheckCircle,
  ArrowLeft,
  Play,
  ChevronLeft,
  ChevronRight,
  Home,
  Building,
  TrendingUp
} from 'lucide-react'
import { useProperty } from '../../context/PropertyContext'
import { formatCurrency, formatArea, formatPricePerSqft, formatDate } from '../../utils/helpers'
import { mockProperties } from '../../data/mockData'

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const { state, toggleFavorite, getPropertyById } = useProperty()
  
  const property = getPropertyById(id || '') || mockProperties.find(p => p.id === id)

  useEffect(() => {
    if (property) {
      // Track property view
      console.log('Property viewed:', property.id)
    }
  }, [property])

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link to="/properties" className="btn btn-primary">
            Browse Properties
          </Link>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const isFavorite = state.favorites.includes(property.id)

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/properties"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden mb-8">
              <div className="relative aspect-[16/10]">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>

                {/* Virtual Tour Button */}
                {property.virtualTour && (
                  <button className="absolute top-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Virtual Tour</span>
                  </button>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {property.images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                        index === currentImageIndex ? 'ring-2 ring-primary-500' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Listed {formatDate(property.createdAt)}</span>
                    </div>
                    {property.verified && (
                      <div className="flex items-center text-green-600">
                        <Shield className="w-4 h-4 mr-1" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className={`p-3 rounded-full transition-colors ${
                      isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-primary-500 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="bg-primary-50 rounded-xl p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-4xl font-bold text-primary-600 mb-2">
                      {formatCurrency(property.price)}
                    </div>
                    <div className="text-lg text-gray-600">
                      {formatPricePerSqft(property.price, property.area)}
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className="text-sm text-gray-500 mb-1">Property Type</div>
                    <div className="text-lg font-semibold text-gray-900 capitalize">
                      {property.propertyType}
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {property.bedrooms > 0 && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Bed className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Bath className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Square className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{formatArea(property.area)}</div>
                  <div className="text-sm text-gray-600">Area</div>
                </div>
                {property.parking > 0 && (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Car className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{property.parking}</div>
                    <div className="text-sm text-gray-600">Parking</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(showAllAmenities ? property.amenities : property.amenities.slice(0, 6)).map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
                {property.amenities.length > 6 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {showAllAmenities ? 'Show Less' : `Show All ${property.amenities.length} Amenities`}
                  </button>
                )}
              </div>

              {/* Nearby Places */}
              {property.nearbyPlaces.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Nearby Places</h3>
                  <div className="space-y-3">
                    {property.nearbyPlaces.map((place, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            {place.type === 'metro' && <Building className="w-4 h-4 text-primary-600" />}
                            {place.type === 'mall' && <Home className="w-4 h-4 text-primary-600" />}
                            {place.type === 'hospital' && <Shield className="w-4 h-4 text-primary-600" />}
                            {place.type === 'restaurant' && <TrendingUp className="w-4 h-4 text-primary-600" />}
                          </div>
                          <span className="font-medium text-gray-900">{place.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{place.distance} km</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Owner</h3>
              
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src={property.agent?.verified ? 
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face' :
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
                  }
                  alt={property.agent?.name || property.owner.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {property.agent?.name || property.owner.name}
                  </div>
                  {property.agent && (
                    <div className="text-sm text-gray-600">
                      {property.agent.company}
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">4.8</span>
                    <span className="text-sm text-gray-600">(127 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full btn btn-primary flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </button>
                <button className="w-full btn btn-outline flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Response Time</div>
                <div className="text-sm font-medium text-gray-900">Usually responds within 2 hours</div>
              </div>
            </div>

            {/* Property Summary */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium capitalize">{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction Type</span>
                  <span className="font-medium capitalize">{property.transactionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Furnishing</span>
                  <span className="font-medium capitalize">{property.furnishing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age</span>
                  <span className="font-medium">{property.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Floor</span>
                  <span className="font-medium">{property.floor} of {property.totalFloors}</span>
                </div>
                {property.balcony > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balcony</span>
                    <span className="font-medium">{property.balcony}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails

