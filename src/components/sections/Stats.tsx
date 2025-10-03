import React, { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Home, 
  Users, 
  MapPin, 
  Star,
  TrendingUp,
  Award,
  Clock,
  Shield
} from 'lucide-react'

const Stats: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [counts, setCounts] = useState({
    properties: 0,
    customers: 0,
    cities: 0,
    rating: 0,
    transactions: 0,
    agents: 0,
    years: 0,
    satisfaction: 0
  })

  const stats = [
    {
      icon: Home,
      value: 50000,
      suffix: '+',
      label: 'Properties Listed',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Users,
      value: 25000,
      suffix: '+',
      label: 'Happy Customers',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: MapPin,
      value: 500,
      suffix: '+',
      label: 'Cities Covered',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Star,
      value: 4.8,
      suffix: '/5',
      label: 'Customer Rating',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      icon: TrendingUp,
      value: 10000,
      suffix: '+',
      label: 'Successful Transactions',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      icon: Award,
      value: 1000,
      suffix: '+',
      label: 'Expert Agents',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: Clock,
      value: 5,
      suffix: '+',
      label: 'Years Experience',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Shield,
      value: 98,
      suffix: '%',
      label: 'Customer Satisfaction',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    }
  ]

  useEffect(() => {
    if (isInView) {
      const duration = 2000 // 2 seconds
      const steps = 60
      const stepDuration = duration / steps

      stats.forEach((stat, index) => {
        const targetValue = stat.value
        const increment = targetValue / steps
        let currentValue = 0

        const timer = setInterval(() => {
          currentValue += increment
          if (currentValue >= targetValue) {
            currentValue = targetValue
            clearInterval(timer)
          }

          setCounts(prev => ({
            ...prev,
            [Object.keys(prev)[index]]: Math.floor(currentValue * 100) / 100
          }))
        }, stepDuration)

        return () => clearInterval(timer)
      })
    }
  }, [isInView])

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
    <section className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Millions
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Our numbers speak for themselves. Join the growing community of satisfied customers.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const currentValue = Object.values(counts)[index]
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {currentValue.toLocaleString()}{stat.suffix}
                </div>
                
                <div className="text-sm text-white/80 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              India's Leading Property Platform
            </h3>
            <p className="text-lg text-white/90 mb-6">
              We've revolutionized the way people buy, sell, and rent properties in India. 
              Our innovative platform combines cutting-edge technology with personalized service 
              to deliver exceptional results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-400 mb-1">₹50,000 Cr+</div>
                <div className="text-sm text-white/80">Total Transaction Value</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400 mb-1">24/7</div>
                <div className="text-sm text-white/80">Customer Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400 mb-1">100%</div>
                <div className="text-sm text-white/80">Verified Listings</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Stats

