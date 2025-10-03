import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Building, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Shield
} from 'lucide-react'

const ListProperty: React.FC = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<'rent' | 'sell' | null>(null)

  const handleCategorySelect = (category: 'rent' | 'sell') => {
    setSelectedCategory(category)
    setTimeout(() => {
      navigate(`/list-property/${category}`)
    }, 300)
  }

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Vastu Verified",
      description: "All properties are Vastu-verified for positive energy"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Support",
      description: "Get help from our property experts"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Premium Listing",
      description: "Your property gets maximum visibility"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Quick Approval",
      description: "Fast verification and listing process"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              List Your Property
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Reach thousands of potential buyers and tenants
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/20 px-4 py-2 rounded-full">✓ Free Listing</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">✓ Vastu Verified</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">✓ Expert Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Listing Type
            </h2>
            <p className="text-lg text-gray-600">
              Select whether you want to rent out or sell your property
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Rent Property */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 ${
                selectedCategory === 'rent' 
                  ? 'ring-4 ring-green-500 shadow-2xl' 
                  : 'hover:shadow-xl'
              }`}
              onClick={() => handleCategorySelect('rent')}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Rent Out Property
                </h3>
                <p className="text-gray-600 mb-6">
                  List your property for rent and find reliable tenants quickly
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Monthly rental income
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Tenant verification included
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Property management support
                  </div>
                </div>
                <div className="mt-8">
                  <span className="inline-flex items-center text-green-600 font-semibold">
                    Start Renting
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Sell Property */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 ${
                selectedCategory === 'sell' 
                  ? 'ring-4 ring-blue-500 shadow-2xl' 
                  : 'hover:shadow-xl'
              }`}
              onClick={() => handleCategorySelect('sell')}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Sell Property
                </h3>
                <p className="text-gray-600 mb-6">
                  Sell your property at the best market price with expert guidance
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-3" />
                    Market price evaluation
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-3" />
                    Legal documentation support
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-3" />
                    Buyer verification & screening
                  </div>
                </div>
                <div className="mt-8">
                  <span className="inline-flex items-center text-blue-600 font-semibold">
                    Start Selling
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Why Choose VastuVerified?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-6">
              Need help choosing? Contact our property experts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn btn-outline btn-lg"
              >
                Contact Support
              </Link>
              <Link
                to="/properties"
                className="btn btn-primary btn-lg"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListProperty



