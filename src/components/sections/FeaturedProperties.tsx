import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car,
  Star,
  Eye,
  Share2,
  Phone,
  Home
} from 'lucide-react'
import { useProperty } from '../../context/PropertyContext'
import { formatCurrency, formatArea, formatPricePerSqft } from '../../utils/helpers'

const FeaturedProperties: React.FC = () => {
  const { state, toggleFavorite } = useProperty()
  const featuredProperties = state.properties.filter(property => property.featured).slice(0, 6)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties across India's top cities
          </p>
        </motion.div>

        {featuredProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-full text-center py-12"
          >
            <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Featured Properties Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Featured properties will appear here once added by property owners or agents.
              </p>
              <Link
                to="/list-property"
                className="btn btn-primary"
              >
                List Your Property
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProperties.map((property) => (
            <motion.div
              key={property.id}
              variants={itemVariants}
              className="property-card group"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="property-image"
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
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Verified
                    </span>
                  )}
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

                {/* Price */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(property.price)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatPricePerSqft(property.price, property.area)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title and Location */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location.address}, {property.location.city}</span>
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

                {/* Amenities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{property.amenities.length - 3} more
                      </span>
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
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                  <button className="btn btn-outline flex items-center justify-center px-3">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/properties"
            className="btn btn-primary btn-lg px-8"
          >
            View All Properties
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProperties

