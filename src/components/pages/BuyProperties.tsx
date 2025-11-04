import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  Grid3X3,
  List,
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  Car,
  Heart,
  Share2,
  Phone,
  Star,
  ChevronDown,
  X,
  ShoppingCart
} from 'lucide-react'
import { useProperty } from '../../context/PropertyContext'
import { formatCurrency, formatArea, formatPricePerSqft } from '../../utils/helpers'
import { apiClient } from '../../utils/apiClient'
import VastuVerifiedLogo from '../common/VastuVerifiedLogo'
import VastuVerifiedIcon from '../common/VastuVerifiedIcon'

const BuyProperties: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    location: searchParams.get('search') || '',
    propertyType: [] as string[],
    priceRange: { min: 0, max: 100000000 },
    bedrooms: [] as number[],
    amenities: [] as string[],
  })
  
  const { state, searchProperties, toggleFavorite, dispatch } = useProperty()

  // Filter properties for buy transaction type from API data
  const buyProperties = state.properties.filter(property => property.transactionType === 'buy')

  useEffect(() => {
    // Load properties from API
    const loadProperties = async () => {
      setLoading(true)
      try {
        const response = await apiClient.getProperties({ 
          transactionType: 'buy',
          limit: 100 
        })
        if (response.success && response.data) {
          dispatch({ type: 'SET_PROPERTIES', payload: response.data.properties })
        }
      } catch (error) {
        console.error('Failed to load properties:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProperties()

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const locationParam = urlParams.get('location')
    const typeParam = urlParams.get('type')
    
    // Set initial filters based on URL parameters
    const initialFilters = {
      location: locationParam || '',
      propertyType: typeParam ? [typeParam] : [],
      transactionType: 'buy' as 'buy' | 'rent' | 'sell',
    }
    
    setFilters(prev => ({
      ...prev,
      ...initialFilters
    }))
    
    // Apply filters
    searchProperties(initialFilters)
  }, [])

  const properties = state.filteredProperties.length > 0 
    ? state.filteredProperties.filter(p => p.transactionType === 'buy')
    : buyProperties

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleArrayFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key as keyof typeof prev].includes(value)
        ? prev[key as keyof typeof prev].filter((item: any) => item !== value)
        : [...prev[key as keyof typeof prev], value]
    }))
  }

  const applyFilters = () => {
    searchProperties({ ...filters, transactionType: 'buy' })
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      propertyType: [],
      priceRange: { min: 0, max: 100000000 },
      bedrooms: [],
      amenities: [],
    })
    searchProperties({ transactionType: 'buy' })
  }

  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return a.price - b.price
      case 'price-high-low':
        return b.price - a.price
      case 'area-low-high':
        return a.area - b.area
      case 'area-high-low':
        return b.area - a.area
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <ShoppingCart className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Properties for Sale</h1>
              <p className="text-gray-600">Find your dream home from our curated collection of properties</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Enter location"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'apartment', label: 'Apartment' },
                      { value: 'house', label: 'House' },
                      { value: 'villa', label: 'Villa' },
                      { value: 'plot', label: 'Plot' },
                      { value: 'commercial', label: 'Commercial' },
                    ].map((type) => (
                      <label key={type.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.propertyType.includes(type.value)}
                          onChange={() => handleArrayFilterChange('propertyType', type.value)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    {priceRanges.buy.map((range, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceRange.min === range.min && filters.priceRange.max === range.max}
                          onChange={() => handleFilterChange('priceRange', { min: range.min, max: range.max })}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map((bedroom) => (
                      <button
                        key={bedroom}
                        onClick={() => handleArrayFilterChange('bedrooms', bedroom)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          filters.bedrooms.includes(bedroom)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {bedroom} BHK
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Filters */}
                <div className="space-y-2">
                  <button
                    onClick={applyFilters}
                    className="w-full btn btn-primary"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={clearFilters}
                    className="w-full btn btn-outline"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {properties.length} Properties for Sale
                    {filters.location && ` in ${filters.location}`}
                    {filters.propertyType.length > 0 && ` - ${filters.propertyType.join(', ')}`}
                  </h2>
                  <p className="text-gray-600">
                    {filters.location && `Location: ${filters.location}`}
                    {filters.propertyType.length > 0 && ` | Type: ${filters.propertyType.join(', ')}`}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                      <option value="area-low-high">Area: Low to High</option>
                      <option value="area-high-low">Area: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden btn btn-outline flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Grid/List */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-6'
            }`}>
              {sortedProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`property-card group ${viewMode === 'list' ? 'flex' : ''}`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-80 h-48' : 'aspect-[4/3]'}`}>
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      {property.featured && (
                        <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                      {property.verified && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                          <VastuVerifiedIcon size="sm" />
                          <span className="text-green-700 text-xs font-medium">Verified</span>
                        </div>
                      )}
                      <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        For Sale
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => toggleFavorite(property.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                          state.favorites.includes(property.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/80 text-gray-700 rounded-full backdrop-blur-sm hover:bg-primary-500 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Content */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    {/* Title and Location */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{property.location.address}, {property.location.city}</span>
                      </div>
                      
                      {/* Price */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                        <div className="text-2xl font-bold text-blue-900 mb-1">
                          {formatCurrency(property.price)}
                        </div>
                        <div className="text-sm text-blue-700 font-medium">
                          {formatPricePerSqft(property.price, property.area)}
                        </div>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {property.bedrooms > 0 && (
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            <span>{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms > 0 && (
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            <span>{property.bathrooms}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Square className="w-4 h-4 mr-1" />
                          <span>{formatArea(property.area)}</span>
                        </div>
                        {property.parking > 0 && (
                          <div className="flex items-center">
                            <Car className="w-4 h-4 mr-1" />
                            <span>{property.parking}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Owner/Agent Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={property.agent?.verified ? 
                            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' :
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
                          }
                          alt={property.agent?.name || property.owner.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {property.agent?.name || property.owner.name}
                          </div>
                          {property.agent && (
                            <div className="text-xs text-gray-500">
                              {property.agent.company}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">4.8</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/property/${property.id}`}
                        className="flex-1 btn btn-primary flex items-center justify-center space-x-2"
                      >
                        <Home className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                      <button className="btn btn-outline flex items-center justify-center px-3">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Results */}
            {properties.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties for sale found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyProperties
