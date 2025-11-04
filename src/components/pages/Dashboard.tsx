import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Heart, 
  Search, 
  Settings, 
  Bell, 
  User,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Star,
  Eye,
  Phone,
  Filter,
  Plus,
  TrendingUp,
  Calendar,
  MessageCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useProperty } from '../../context/PropertyContext'
import { formatCurrency, formatArea, formatDate } from '../../utils/helpers'
import { apiClient } from '../../utils/apiClient'

const Dashboard: React.FC = () => {
  const { state: authState, logout, updateUser } = useAuth()
  const { state: propertyState, toggleFavorite } = useProperty()
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', avatar: '' })

  React.useEffect(() => {
    setProfile({
      name: authState.user?.name || '',
      email: authState.user?.email || '',
      phone: authState.user?.phone || '',
      avatar: authState.user?.avatar || '',
    })
  }, [authState.user])

  const recentProperties = propertyState.properties.slice(0, 4)
  const favoriteProperties = propertyState.properties.filter(property => 
    propertyState.favorites.includes(property.id)
  )

  const stats = [
    { label: 'Properties Viewed', value: '24', icon: Eye, color: 'text-blue-600' },
    { label: 'Favorites', value: favoriteProperties.length.toString(), icon: Heart, color: 'text-red-600' },
    { label: 'Searches', value: '12', icon: Search, color: 'text-green-600' },
    { label: 'Messages', value: '8', icon: MessageCircle, color: 'text-purple-600' },
  ]

  const recentActivities = [
    { id: 1, type: 'view', property: '3BHK Apartment in Bandra', time: '2 hours ago', icon: Eye },
    { id: 2, type: 'favorite', property: '2BHK Villa in Whitefield', time: '1 day ago', icon: Heart },
    { id: 3, type: 'search', property: 'Properties in Mumbai', time: '2 days ago', icon: Search },
    { id: 4, type: 'message', property: 'Contacted agent for 4BHK House', time: '3 days ago', icon: MessageCircle },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'searches', label: 'Searches', icon: Search },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-8">
                <img
                  src={authState.user?.avatar || '/icon.png'}
                  alt={authState.user?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900">{authState.user?.name}</div>
                  <div className="text-sm text-gray-600">{authState.user?.email}</div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-8 flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {authState.user?.name?.split(' ')[0]}!
                  </h1>
                  <p className="text-gray-600">
                    Here's what's happening with your property search
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <button className="btn btn-outline flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </button>
                  <Link to="/properties" className="btn btn-primary flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Search Properties</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-soft p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                              {stat.value}
                            </div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                          </div>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                            <Icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Recent Properties */}
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Properties</h2>
                    <Link to="/properties" className="text-primary-600 hover:text-primary-700 font-medium">
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentProperties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group cursor-pointer"
                      >
                        <div className="relative overflow-hidden rounded-xl">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4">
                            <button
                              onClick={() => toggleFavorite(property.id)}
                              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                                propertyState.favorites.includes(property.id)
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                              }`}
                            >
                              <Heart className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                              <div className="text-lg font-bold text-gray-900">
                                {formatCurrency(property.price)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {property.location.city}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {property.title}
                          </h3>
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
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => {
                      const Icon = activity.icon
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{activity.property}</div>
                            <div className="text-sm text-gray-600">{activity.time}</div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Favorite Properties</h2>
                  <span className="text-sm text-gray-600">{favoriteProperties.length} properties</span>
                </div>
                {favoriteProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favoriteProperties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group cursor-pointer"
                      >
                        <div className="relative overflow-hidden rounded-xl">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4">
                            <button
                              onClick={() => toggleFavorite(property.id)}
                              className="p-2 bg-red-500 text-white rounded-full backdrop-blur-sm hover:bg-red-600 transition-colors"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                              <div className="text-lg font-bold text-gray-900">
                                {formatCurrency(property.price)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {property.location.city}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {property.title}
                          </h3>
                          <div className="flex items-center justify-between">
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
                            </div>
                            <Link
                              to={`/property/${property.id}`}
                              className="btn btn-primary btn-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
                    <p className="text-gray-600 mb-6">Start exploring properties and add them to your favorites</p>
                    <Link to="/properties" className="btn btn-primary">
                      Browse Properties
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Other tabs would be implemented similarly */}
            {activeTab === 'searches' && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Search History</h2>
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recent Searches</h3>
                  <p className="text-gray-600 mb-6">Your search history will appear here</p>
                  <Link to="/properties" className="btn btn-primary">
                    Start Searching
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Messages</h2>
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Messages</h3>
                  <p className="text-gray-600 mb-6">Your conversations with agents will appear here</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-soft p-6" id="account-settings-form">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                    <input
                      type="url"
                      value={profile.avatar}
                      onChange={(e) => setProfile((p) => ({ ...p, avatar: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setProfile((p) => ({ ...p, avatar: reader.result as string }))
                          }
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      updateUser({
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone,
                        avatar: profile.avatar,
                      })
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

