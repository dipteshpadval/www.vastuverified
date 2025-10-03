// Form validation utilities
export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation (Indian format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  const errors: ValidationError[] = []
  
  if (password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long' })
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' })
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' })
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one number' })
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one special character (@$!%*?&)' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Name validation
export const validateName = (name: string): ValidationResult => {
  const errors: ValidationError[] = []
  
  if (!name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' })
  } else if (name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' })
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    errors.push({ field: 'name', message: 'Name can only contain letters and spaces' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Property validation
export const validateProperty = (property: any): ValidationResult => {
  const errors: ValidationError[] = []
  
  if (!property.title?.trim()) {
    errors.push({ field: 'title', message: 'Property title is required' })
  }
  
  if (!property.description?.trim()) {
    errors.push({ field: 'description', message: 'Property description is required' })
  }
  
  if (!property.price || property.price <= 0) {
    errors.push({ field: 'price', message: 'Valid price is required' })
  }
  
  if (!property.area || property.area <= 0) {
    errors.push({ field: 'area', message: 'Valid area is required' })
  }
  
  if (!property.bedrooms || property.bedrooms < 0) {
    errors.push({ field: 'bedrooms', message: 'Number of bedrooms is required' })
  }
  
  if (!property.bathrooms || property.bathrooms < 0) {
    errors.push({ field: 'bathrooms', message: 'Number of bathrooms is required' })
  }
  
  if (!property.location?.address?.trim()) {
    errors.push({ field: 'address', message: 'Property address is required' })
  }
  
  if (!property.location?.city?.trim()) {
    errors.push({ field: 'city', message: 'City is required' })
  }
  
  if (!property.images || property.images.length === 0) {
    errors.push({ field: 'images', message: 'At least one property image is required' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Contact form validation
export const validateContactForm = (formData: any): ValidationResult => {
  const errors: ValidationError[] = []
  
  if (!formData.name?.trim()) {
    errors.push({ field: 'name', message: 'Name is required' })
  }
  
  if (!formData.email?.trim()) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!validateEmail(formData.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }
  
  if (!formData.phone?.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' })
  } else if (!validatePhone(formData.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid Indian phone number' })
  }
  
  if (!formData.subject?.trim()) {
    errors.push({ field: 'subject', message: 'Subject is required' })
  }
  
  if (!formData.message?.trim()) {
    errors.push({ field: 'message', message: 'Message is required' })
  } else if (formData.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters long' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

// Format price for display
export const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`
  } else {
    return `₹${price.toLocaleString()}`
  }
}

// Format area for display
export const formatArea = (area: number): string => {
  return `${area} sq ft`
}
