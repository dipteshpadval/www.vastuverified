import React from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Building, 
  TrendingUp, 
  Calculator,
  Shield,
  Headphones,
  FileText,
  MapPin,
  Users,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react'

const Services: React.FC = () => {
  const services = [
    {
      icon: Home,
      title: 'Property Search',
      description: 'Find your dream property with our advanced search filters and AI-powered recommendations.',
      features: ['Smart Search', 'AI Recommendations', 'Virtual Tours', 'Price Alerts']
    },
    {
      icon: Building,
      title: 'Property Management',
      description: 'Comprehensive property management services for owners and tenants.',
      features: ['Rent Collection', 'Maintenance', 'Tenant Screening', 'Legal Support']
    },
    {
      icon: TrendingUp,
      title: 'Market Analysis',
      description: 'Get detailed market insights and property valuation reports.',
      features: ['Price Trends', 'Market Reports', 'Investment Advice', 'ROI Calculator']
    },
    {
      icon: Calculator,
      title: 'Financial Tools',
      description: 'Calculate EMI, compare loans, and get the best financing options.',
      features: ['EMI Calculator', 'Loan Comparison', 'Credit Score Check', 'Pre-approval']
    },
    {
      icon: Shield,
      title: 'Legal Support',
      description: 'Complete legal assistance for property transactions and documentation.',
      features: ['Document Verification', 'Legal Advice', 'Registration Support', 'Compliance']
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your property needs.',
      features: ['Live Chat', 'Phone Support', 'Email Support', 'Video Consultation']
    }
  ]

  const whyChooseUs = [
    {
      icon: CheckCircle,
      title: 'Verified Listings',
      description: 'All properties are verified and authenticated by our team'
    },
    {
      icon: Users,
      title: 'Expert Agents',
      description: 'Professional agents with years of experience in real estate'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized as the best property platform in India'
    },
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'Get instant responses to your queries and requests'
    }
  ]

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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive real estate services to make your property journey smooth and successful
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                  <Icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-soft"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Why Choose PropertyHub?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are committed to providing the best real estate experience with our innovative platform and dedicated service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Find Your Dream Property?
            </h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of satisfied customers who found their perfect home with PropertyHub
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3">
                Start Searching
              </button>
              <button className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3">
                Contact Us
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services

