import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Home, 
  Building, 
  TrendingUp,
  Play,
  Star,
  Users,
  Award,
  Shield
} from 'lucide-react'
import { useProperty } from '../../context/PropertyContext'

const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('buy')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { searchProperties, addRecentSearch } = useProperty()

  const propertyTypes = [
    { value: 'buy', label: 'Buy', icon: Home, color: 'text-blue-600' },
    { value: 'rent', label: 'Rent', icon: Building, color: 'text-green-600' },
    { value: 'sell', label: 'Sell', icon: TrendingUp, color: 'text-purple-600' },
  ]

  const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'
  ]

  const stats = [
    { number: '50K+', label: 'Properties Listed', icon: Home },
    { number: '25K+', label: 'Happy Customers', icon: Users },
    { number: '500+', label: 'Cities Covered', icon: MapPin },
    { number: '4.8', label: 'Customer Rating', icon: Star },
  ]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const locationTerm = selectedLocation.trim()
    const propertyTypeTerm = searchQuery.trim()
    
    if (locationTerm || propertyTypeTerm) {
      setIsSearching(true)
      try {
        // Use location as primary search term, fallback to property type
        const searchTerm = locationTerm || propertyTypeTerm
        addRecentSearch(searchTerm)
        
        // Prepare search filters
        const searchFilters: any = {
          transactionType: selectedType as 'buy' | 'rent' | 'sell',
        }
        
        // Add location filter if provided
        if (locationTerm) {
          searchFilters.location = locationTerm
        }
        
        // Add property type filter if provided
        if (propertyTypeTerm) {
          // Map common property type terms to our property types
          const propertyTypeMap: { [key: string]: string } = {
            'apartment': 'apartment',
            'apartments': 'apartment',
            'flat': 'apartment',
            'flats': 'apartment',
            'house': 'house',
            'houses': 'house',
            'villa': 'villa',
            'villas': 'villa',
            'plot': 'plot',
            'plots': 'plot',
            'commercial': 'commercial',
            'office': 'commercial',
            'shop': 'commercial',
          }
          
          const mappedType = propertyTypeMap[propertyTypeTerm.toLowerCase()]
          if (mappedType) {
            searchFilters.propertyType = [mappedType]
          }
        }
        
        searchProperties(searchFilters)
        
        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Navigate to the appropriate page based on transaction type
        const queryParams = new URLSearchParams()
        if (locationTerm) queryParams.set('location', locationTerm)
        if (propertyTypeTerm) queryParams.set('type', propertyTypeTerm)
        
        const queryString = queryParams.toString()
        const url = queryString ? `?${queryString}` : ''
        
        if (selectedType === 'buy') {
          window.location.href = `/buy${url}`
        } else if (selectedType === 'rent') {
          window.location.href = `/rent${url}`
        } else if (selectedType === 'sell') {
          window.location.href = `/sell${url}`
        } else {
          window.location.href = `/properties${url}`
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-accent-900/90 z-10" />
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop"
          alt="Luxury Property"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Dream Property
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover, buy, sell, and rent properties with India's most trusted Vastu-verified real estate platform. 
            Verified listings, expert guidance, and seamless transactions.
          </p>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl max-w-5xl mx-auto"
          >
            {/* Property Type Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {propertyTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      selectedType === type.value
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{type.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Location Input */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter city, area, or landmark"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>

                {/* Property Type Input */}
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Property type (e.g., Apartment, Villa)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  disabled={isSearching}
                  className="btn btn-primary btn-lg w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Search Properties</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Popular Cities */}
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedLocation(city)}
                    className="px-4 py-2 bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-full text-sm font-medium transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* List Property CTA */}
            <div className="mt-8 text-center">
              <Link
                to="/list-property"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-xl font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Building className="w-5 h-5 mr-2" />
                List Your Property
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-200 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-20 w-12 h-12 bg-white/10 rounded-full"
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero

