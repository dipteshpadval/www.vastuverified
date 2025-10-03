import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Home, Building, TrendingUp, ArrowRight } from 'lucide-react'

const PropertySubmissionSuccess: React.FC = () => {
  const location = useLocation()
  const { propertyType, propertyTitle } = location.state || { propertyType: 'rent', propertyTitle: 'Your Property' }
  const isRent = propertyType === 'rent'
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft p-8 md:p-12 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Property Listed Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your property "<span className="font-semibold text-primary-600">{propertyTitle}</span>" has been 
              successfully listed for <span className="font-semibold text-primary-600">
                {isRent ? 'rent' : 'sale'}
              </span>.
            </p>
          </motion.div>

          {/* Property Type Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-white font-semibold ${
              isRent 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}>
              {isRent ? (
                <>
                  <Building className="w-5 h-5 mr-2" />
                  For Rent
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  For Sale
                </>
              )}
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gray-50 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary-600">1</span>
                </div>
                <p className="text-gray-700">
                  Your property is now live and visible to potential {isRent ? 'tenants' : 'buyers'}.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary-600">2</span>
                </div>
                <p className="text-gray-700">
                  You'll receive inquiries directly to your provided contact information.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary-600">3</span>
                </div>
                <p className="text-gray-700">
                  Manage your listing and track views from your dashboard.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to={isRent ? '/rent' : '/buy'}
              className="btn btn-primary flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              View {isRent ? 'Rent' : 'Buy'} Properties
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              to="/dashboard"
              className="btn btn-outline flex items-center justify-center"
            >
              Go to Dashboard
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-8 text-sm text-gray-500"
          >
            <p>
              Need help? <Link to="/contact" className="text-primary-600 hover:underline">Contact our support team</Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default PropertySubmissionSuccess
