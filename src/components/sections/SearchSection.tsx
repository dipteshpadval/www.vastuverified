import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Home, 
  Filter, 
  SlidersHorizontal,
  X,
  ChevronDown
} from 'lucide-react'
import { useProperty } from '../../context/PropertyContext'
import { propertyTypes, cities, amenities } from '../../data/mockData'

const SearchSection: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    location: '',
    propertyType: [] as string[],
    priceRange: { min: 0, max: 10000000 },
    bedrooms: [] as number[],
    amenities: [] as string[],
  })
  
  const { searchProperties } = useProperty()

  const bedroomOptions = [1, 2, 3, 4, 5, 6]
  const priceRanges = [
    { min: 0, max: 5000000, label: 'Under ₹50 Lakhs' },
    { min: 5000000, max: 10000000, label: '₹50 Lakhs - ₹1 Crore' },
    { min: 10000000, max: 20000000, label: '₹1 Crore - ₹2 Crore' },
    { min: 20000000, max: 50000000, label: '₹2 Crore - ₹5 Crore' },
    { min: 50000000, max: 100000000, label: '₹5 Crore+' },
  ]

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

  const handleSearch = () => {
    searchProperties(filters)
    setShowFilters(false)
    // Navigate to properties page with filters
    const queryParams = new URLSearchParams()
    if (filters.location) queryParams.set('search', filters.location)
    if (filters.propertyType.length > 0) queryParams.set('type', filters.propertyType[0])
    if (filters.bedrooms.length > 0) queryParams.set('bedrooms', filters.bedrooms.join(','))
    
    window.location.href = `/properties?${queryParams.toString()}`
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      propertyType: [],
      priceRange: { min: 0, max: 10000000 },
      bedrooms: [],
      amenities: [],
    })
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Property
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Use our advanced search filters to find properties that match your exact requirements
            </p>
          </div>

          {/* Main Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Property Type */}
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filters.propertyType[0] || ''}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value ? [e.target.value] : [])}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="">Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Price Range */}
              <div className="relative">
                <select
                  value={`${filters.priceRange.min}-${filters.priceRange.max}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number)
                    handleFilterChange('priceRange', { min, max })
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  {priceRanges.map((range, index) => (
                    <option key={index} value={`${range.min}-${range.max}`}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="btn btn-primary flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Advanced Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {Object.values(filters).some(value => 
                Array.isArray(value) ? value.length > 0 : value !== '' && (typeof value !== 'object' || value.min !== 0 || value.max !== 10000000)
              ) && (
                <button
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Bedrooms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {bedroomOptions.map((bedroom) => (
                      <button
                        key={bedroom}
                        onClick={() => handleArrayFilterChange('bedrooms', bedroom)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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

                {/* Property Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Property Type
                  </label>
                  <div className="space-y-2">
                    {propertyTypes.map((type) => (
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

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Amenities
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {amenities.slice(0, 10).map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleArrayFilterChange('amenities', amenity)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSearch}
                  className="btn btn-primary px-8"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Search Tags */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {[
                '2BHK in Mumbai', '3BHK in Bangalore', 'Villa in Delhi',
                'Apartment in Pune', 'Commercial in Gurgaon', 'Plot in Noida'
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const [bedroom, city] = tag.split(' in ')
                    handleFilterChange('location', city)
                    if (bedroom.includes('BHK')) {
                      const bhk = parseInt(bedroom)
                      handleArrayFilterChange('bedrooms', bhk)
                    }
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SearchSection

