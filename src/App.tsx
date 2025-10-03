import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'

// Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import FeaturedProperties from './components/sections/FeaturedProperties'
import SearchSection from './components/sections/SearchSection'
import Services from './components/sections/Services'
import Testimonials from './components/sections/Testimonials'
import Stats from './components/sections/Stats'
import PropertyListings from './components/pages/PropertyListings'
import PropertyDetails from './components/pages/PropertyDetails'
import BuyProperties from './components/pages/BuyProperties'
import RentProperties from './components/pages/RentProperties'
import SellProperties from './components/pages/SellProperties'
import ListProperty from './components/pages/ListProperty'
import ListRentProperty from './components/pages/ListRentProperty'
import ListSellProperty from './components/pages/ListSellProperty'
import PropertySubmissionSuccess from './components/pages/PropertySubmissionSuccess'
import About from './components/pages/About'
import Contact from './components/pages/Contact'
import Privacy from './components/pages/Privacy'
import Terms from './components/pages/Terms'
import Cookies from './components/pages/Cookies'
import NotFound from './components/pages/NotFound'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/pages/Dashboard'
import ScrollToTop from './components/common/ScrollToTop'
import ErrorBoundary from './components/common/ErrorBoundary'
import ProtectedRoute from './components/common/ProtectedRoute'

// Context
import { PropertyProvider } from './context/PropertyContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <PropertyProvider>
            <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Hero />
                  <SearchSection />
                  <FeaturedProperties />
                  <Services />
                  <Stats />
                  <Testimonials />
                </>
              } />
              <Route path="/properties" element={<PropertyListings />} />
              <Route path="/buy" element={<BuyProperties />} />
              <Route path="/rent" element={<RentProperties />} />
              <Route path="/sell" element={<SellProperties />} />
              <Route path="/list-property" element={<ListProperty />} />
              <Route path="/list-property/rent" element={<ListRentProperty />} />
              <Route path="/list-property/sell" element={<ListSellProperty />} />
              <Route path="/property-submitted" element={<PropertySubmissionSuccess />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
              </Routes>
              
              <Footer />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </PropertyProvider>
      </AuthProvider>
    </ErrorBoundary>
  </HelmetProvider>
  )
}

export default App

