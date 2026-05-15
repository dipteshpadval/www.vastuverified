import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MapPin,
  Home,
  Building,
  TrendingUp,
  Star,
  Users,
  Award,
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useProperty } from '../../context/PropertyContext'

const heroImages = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&h=1080&fit=crop',
]

const transactionTabs = [
  { value: 'buy', label: 'Buy', icon: Home, accent: 'from-blue-500 to-cyan-500' },
  { value: 'rent', label: 'Rent', icon: Building, accent: 'from-green-500 to-emerald-500' },
  { value: 'sell', label: 'Sell', icon: TrendingUp, accent: 'from-purple-500 to-pink-500' },
]

const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad']

const stats = [
  { number: '50K+', label: 'Properties', icon: Home, color: 'from-blue-400 to-cyan-400' },
  { number: '25K+', label: 'Happy Buyers', icon: Users, color: 'from-green-400 to-emerald-400' },
  { number: '500+', label: 'Cities', icon: MapPin, color: 'from-purple-400 to-pink-400' },
  { number: '4.8★', label: 'Rating', icon: Star, color: 'from-yellow-400 to-orange-400' },
]

const floatingCards = [
  {
    icon: Shield,
    title: 'Vastu Verified',
    sub: '100% certified',
    color: 'from-emerald-400 to-green-500',
    pos: 'top-24 left-8',
  },
  {
    icon: Award,
    title: 'Best Price',
    sub: 'Guaranteed',
    color: 'from-blue-400 to-cyan-500',
    pos: 'top-32 right-8',
  },
  {
    icon: Star,
    title: 'Top Rated',
    sub: '4.8 / 5 stars',
    color: 'from-yellow-400 to-orange-500',
    pos: 'bottom-44 left-6',
  },
]

const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('buy')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)

  const { searchProperties, addRecentSearch } = useProperty()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => setBgIndex(i => (i + 1) % heroImages.length), 6000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const location = selectedLocation.trim()
    const type = searchQuery.trim()

    if (!location && !type) return

    setIsSearching(true)
    try {
      const searchTerm = location || type
      addRecentSearch(searchTerm)

      const filters: any = { transactionType: selectedType }
      if (location) filters.location = location
      if (type) {
        const typeMap: Record<string, string> = {
          apartment: 'apartment', flat: 'apartment', apartments: 'apartment', flats: 'apartment',
          house: 'house', houses: 'house',
          villa: 'villa', villas: 'villa',
          plot: 'plot', plots: 'plot',
          commercial: 'commercial', office: 'commercial', shop: 'commercial',
        }
        const mapped = typeMap[type.toLowerCase()]
        if (mapped) filters.propertyType = [mapped]
      }
      searchProperties(filters)

      await new Promise(r => setTimeout(r, 400))

      const params = new URLSearchParams()
      if (location) params.set('location', location)
      if (type) params.set('type', type)
      const qs = params.toString() ? `?${params}` : ''
      navigate(`/${selectedType}${qs}`)
    } finally {
      setIsSearching(false)
    }
  }

  const activeTab = transactionTabs.find(t => t.value === selectedType)!

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={bgIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/85 via-primary-900/75 to-accent-950/85 z-10" />
          <img
            src={heroImages[bgIndex]}
            alt="Property"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Floating badge cards (desktop) */}
      {floatingCards.map((card, i) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + i * 0.2 }}
            className={`absolute hidden xl:flex z-20 ${card.pos}`}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center space-x-3 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 shadow-xl"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">{card.title}</p>
                <p className="text-blue-200 text-xs mt-0.5">{card.sub}</p>
              </div>
            </motion.div>
          </motion.div>
        )
      })}

      {/* Main content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-medium">India's #1 Vastu-Verified Real Estate Platform</span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
              Dream Property
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Verified listings, expert guidance, and seamless transactions.
            Your perfect home is just one search away.
          </p>

          {/* Search card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-white/98 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-2xl max-w-4xl mx-auto"
          >
            {/* Transaction type tabs */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {transactionTabs.map(tab => {
                const Icon = tab.icon
                const active = selectedType === tab.value
                return (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedType(tab.value)}
                    className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      active
                        ? 'bg-gradient-to-r ' + tab.accent + ' text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Search form */}
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative group sm:col-span-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="City, area or landmark"
                    value={selectedLocation}
                    onChange={e => setSelectedLocation(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-0 outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>

                <div className="relative group sm:col-span-1">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Property type (Apartment, Villa...)"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-0 outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className={`flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r ${activeTab.accent} hover:shadow-xl hover:scale-[1.02]`}
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>

              {/* Popular cities */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Popular:</span>
                {popularCities.map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedLocation(city)}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-700 rounded-full font-medium transition-all"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </form>

            {/* List property link */}
            <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-center">
              <Link
                to="/list-property"
                className="inline-flex items-center space-x-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group"
              >
                <Building className="w-4 h-4" />
                <span>Want to list your property?</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-blue-200 text-xs mt-0.5 font-medium">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center items-start pt-2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full"
          />
        </motion.div>
      </motion.div>

      {/* Slideshow dots */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center space-x-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setBgIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === bgIndex ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
