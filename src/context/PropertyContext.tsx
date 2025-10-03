import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { apiClient } from '../utils/apiClient'

// Types
export interface Property {
  id: string
  title: string
  description: string
  price: number
  pricePerSqft: number
  area: number
  bedrooms: number
  bathrooms: number
  propertyType: 'apartment' | 'house' | 'villa' | 'plot' | 'commercial'
  transactionType: 'buy' | 'rent' | 'sell'
  location: {
    address: string
    city: string
    state: string
    pincode: string
    coordinates: [number, number]
  }
  images: string[]
  amenities: string[]
  features: string[]
  age: number
  floor: number
  totalFloors: number
  furnishing: 'furnished' | 'semi-furnished' | 'unfurnished'
  parking: number
  balcony: number
  owner: {
    id: string
    name: string
    phone: string
    email: string
    verified: boolean
  }
  agent?: {
    id: string
    name: string
    phone: string
    email: string
    company: string
    verified: boolean
  }
  createdAt: string
  updatedAt: string
  featured: boolean
  verified: boolean
  virtualTour?: string
  floorPlan?: string
  nearbyPlaces: {
    name: string
    type: 'school' | 'hospital' | 'metro' | 'mall' | 'restaurant'
    distance: number
  }[]
}

export interface SearchFilters {
  location: string
  propertyType: string[]
  transactionType: 'buy' | 'rent' | 'sell'
  priceRange: {
    min: number
    max: number
  }
  areaRange: {
    min: number
    max: number
  }
  bedrooms: number[]
  bathrooms: number[]
  amenities: string[]
  furnishing: string[]
  age: number
  verified: boolean
  featured: boolean
}

interface PropertyState {
  properties: Property[]
  filteredProperties: Property[]
  searchFilters: SearchFilters
  loading: boolean
  error: string | null
  selectedProperty: Property | null
  favorites: string[]
  recentSearches: string[]
}

type PropertyAction =
  | { type: 'SET_PROPERTIES'; payload: Property[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<SearchFilters> }
  | { type: 'FILTER_PROPERTIES' }
  | { type: 'SET_SELECTED_PROPERTY'; payload: Property | null }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'ADD_RECENT_SEARCH'; payload: string }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'ADD_PROPERTY'; payload: Property }

const initialState: PropertyState = {
  properties: [],
  filteredProperties: [],
  searchFilters: {
    location: '',
    propertyType: [],
    transactionType: 'buy',
    priceRange: { min: 0, max: 10000000 },
    areaRange: { min: 0, max: 10000 },
    bedrooms: [],
    bathrooms: [],
    amenities: [],
    furnishing: [],
    age: 0,
    verified: false,
    featured: false,
  },
  loading: false,
  error: null,
  selectedProperty: null,
  favorites: [],
  recentSearches: [],
}

const propertyReducer = (state: PropertyState, action: PropertyAction): PropertyState => {
  switch (action.type) {
    case 'SET_PROPERTIES':
      return {
        ...state,
        properties: action.payload,
        filteredProperties: action.payload,
        loading: false,
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case 'SET_FILTERS':
      return {
        ...state,
        searchFilters: { ...state.searchFilters, ...action.payload },
      }
    case 'FILTER_PROPERTIES':
      const filtered = state.properties.filter(property => {
        const filters = state.searchFilters
        
        // Location filter
        if (filters.location && !property.location.city.toLowerCase().includes(filters.location.toLowerCase()) &&
            !property.location.address.toLowerCase().includes(filters.location.toLowerCase())) {
          return false
        }
        
        // Property type filter
        if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.propertyType)) {
          return false
        }
        
        // Transaction type filter
        if (filters.transactionType && property.transactionType !== filters.transactionType) {
          return false
        }
        
        // Price range filter
        if (property.price < filters.priceRange.min || property.price > filters.priceRange.max) {
          return false
        }
        
        // Area range filter
        if (property.area < filters.areaRange.min || property.area > filters.areaRange.max) {
          return false
        }
        
        // Bedrooms filter
        if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(property.bedrooms)) {
          return false
        }
        
        // Bathrooms filter
        if (filters.bathrooms.length > 0 && !filters.bathrooms.includes(property.bathrooms)) {
          return false
        }
        
        // Amenities filter
        if (filters.amenities.length > 0 && !filters.amenities.every(amenity => property.amenities.includes(amenity))) {
          return false
        }
        
        // Furnishing filter
        if (filters.furnishing.length > 0 && !filters.furnishing.includes(property.furnishing)) {
          return false
        }
        
        // Age filter
        if (filters.age > 0 && property.age > filters.age) {
          return false
        }
        
        // Verified filter
        if (filters.verified && !property.verified) {
          return false
        }
        
        // Featured filter
        if (filters.featured && !property.featured) {
          return false
        }
        
        return true
      })
      
      return {
        ...state,
        filteredProperties: filtered,
      }
    case 'SET_SELECTED_PROPERTY':
      return {
        ...state,
        selectedProperty: action.payload,
      }
    case 'TOGGLE_FAVORITE':
      const favorites = state.favorites.includes(action.payload)
        ? state.favorites.filter(id => id !== action.payload)
        : [...state.favorites, action.payload]
      return {
        ...state,
        favorites,
      }
    case 'ADD_RECENT_SEARCH':
      const recentSearches = [action.payload, ...state.recentSearches.filter(search => search !== action.payload)].slice(0, 10)
      return {
        ...state,
        recentSearches,
      }
    case 'CLEAR_FILTERS':
      return {
        ...state,
        searchFilters: initialState.searchFilters,
        filteredProperties: state.properties,
      }
    case 'ADD_PROPERTY':
      const newProperties = [action.payload, ...state.properties]
      return {
        ...state,
        properties: newProperties,
        filteredProperties: newProperties,
      }
    default:
      return state
  }
}

interface PropertyContextType {
  state: PropertyState
  dispatch: React.Dispatch<PropertyAction>
  searchProperties: (filters: Partial<SearchFilters>) => void
  getPropertyById: (id: string) => Property | undefined
  toggleFavorite: (propertyId: string) => void
  addRecentSearch: (search: string) => void
  addProperty: (property: Property) => void
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined)

export const useProperty = () => {
  const context = useContext(PropertyContext)
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider')
  }
  return context
}

interface PropertyProviderProps {
  children: ReactNode
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(propertyReducer, initialState)

  // Load properties on mount
  useEffect(() => {
    const loadProperties = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Use real API to get properties
      const response = await apiClient.getProperties()
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_PROPERTIES', payload: response.data.properties })
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to load properties' })
      }
    }
    
    loadProperties()
  }, [])

  const searchProperties = (filters: Partial<SearchFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
    dispatch({ type: 'FILTER_PROPERTIES' })
  }

  const getPropertyById = (id: string) => {
    return state.properties.find(property => property.id === id)
  }

  const toggleFavorite = (propertyId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: propertyId })
  }

  const addRecentSearch = (search: string) => {
    dispatch({ type: 'ADD_RECENT_SEARCH', payload: search })
  }

  const addProperty = (property: Property) => {
    dispatch({ type: 'ADD_PROPERTY', payload: property })
  }

  const value = {
    state,
    dispatch,
    searchProperties,
    getPropertyById,
    toggleFavorite,
    addRecentSearch,
    addProperty,
  }

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  )
}
