// Format currency
export const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`
  } else {
    return `₹${amount.toLocaleString('en-IN')}`
  }
}

// Format area
export const formatArea = (area: number): string => {
  return `${area} sq ft`
}

// Format price per sq ft
export const formatPricePerSqft = (price: number, area: number): string => {
  const pricePerSqft = Math.round(price / area)
  return `₹${pricePerSqft.toLocaleString('en-IN')}/sq ft`
}

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return formatDate(dateString)
  }
}

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

// Calculate EMI
export const calculateEMI = (
  principal: number,
  annualRate: number,
  tenureYears: number
): number => {
  const monthlyRate = annualRate / 12 / 100
  const tenureMonths = tenureYears * 12
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  return Math.round(emi)
}

// Calculate total interest
export const calculateTotalInterest = (
  principal: number,
  emi: number,
  tenureYears: number
): number => {
  const totalPayment = emi * tenureYears * 12
  return totalPayment - principal
}

// Get property type label
export const getPropertyTypeLabel = (type: string): string => {
  const types: { [key: string]: string } = {
    apartment: 'Apartment',
    house: 'House',
    villa: 'Villa',
    plot: 'Plot',
    commercial: 'Commercial',
  }
  return types[type] || type
}

// Get transaction type label
export const getTransactionTypeLabel = (type: string): string => {
  const types: { [key: string]: string } = {
    buy: 'Buy',
    rent: 'Rent',
    sell: 'Sell',
  }
  return types[type] || type
}

// Get furnishing label
export const getFurnishingLabel = (furnishing: string): string => {
  const furnishingTypes: { [key: string]: string } = {
    furnished: 'Furnished',
    'semi-furnished': 'Semi-Furnished',
    unfurnished: 'Unfurnished',
  }
  return furnishingTypes[furnishing] || furnishing
}

// Calculate distance between two coordinates
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Format distance
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  } else {
    return `${distance.toFixed(1)}km`
  }
}

// Get property age label
export const getPropertyAgeLabel = (age: number): string => {
  if (age === 0) {
    return 'Under Construction'
  } else if (age === 1) {
    return '1 year old'
  } else if (age < 5) {
    return `${age} years old`
  } else if (age < 10) {
    return `${age} years old`
  } else {
    return `${age}+ years old`
  }
}

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + '...'
}

// Generate search suggestions
export const generateSearchSuggestions = (query: string, cities: string[]): string[] => {
  if (!query) return []
  
  const suggestions = cities
    .filter(city => city.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
  
  return suggestions
}

// Parse search query
export const parseSearchQuery = (query: string): {
  location?: string
  propertyType?: string
  bedrooms?: number
} => {
  const result: any = {}
  
  // Extract location (look for city names)
  const cityMatch = query.match(/\b(mumbai|delhi|bangalore|hyderabad|chennai|kolkata|pune|ahmedabad|jaipur|surat|lucknow|kanpur|nagpur|indore|thane|bhopal|visakhapatnam|pimpri-chinchwad|patna|vadodara|ghaziabad|ludhiana|agra|nashik|faridabad|meerut|rajkot|kalyan-dombivali|vasai-virar|varanasi|srinagar|aurangabad|navi mumbai|solapur|vijayawada|kolhapur|amritsar|noida|ranchi|howrah|coimbatore|raipur|jabalpur|gwalior|chandigarh|tiruchirappalli|mysore|mangalore|bhubaneswar|kochi)\b/i)
  if (cityMatch) {
    result.location = cityMatch[0]
  }
  
  // Extract property type
  const propertyTypeMatch = query.match(/\b(apartment|house|villa|plot|commercial)\b/i)
  if (propertyTypeMatch) {
    result.propertyType = propertyTypeMatch[0]
  }
  
  // Extract bedrooms
  const bedroomMatch = query.match(/\b(\d+)\s*(?:bhk|bedroom|bed)\b/i)
  if (bedroomMatch) {
    result.bedrooms = parseInt(bedroomMatch[1])
  }
  
  return result
}

// Sort properties
export const sortProperties = (properties: any[], sortBy: string): any[] => {
  const sorted = [...properties]
  
  switch (sortBy) {
    case 'price-low-high':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-high-low':
      return sorted.sort((a, b) => b.price - a.price)
    case 'area-low-high':
      return sorted.sort((a, b) => a.area - b.area)
    case 'area-high-low':
      return sorted.sort((a, b) => b.area - a.area)
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'featured':
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    default:
      return sorted
  }
}

