import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { Property } from '../context/PropertyContext'

export interface PropertyFilters {
  type?: string
  transactionType?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  search?: string
  page?: number
  limit?: number
}

export interface PropertyResponse {
  properties: Property[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export const firebaseProperties = {
  // Get all properties with filters
  async getProperties(filters: PropertyFilters = {}): Promise<PropertyResponse> {
    try {
      const propertiesRef = collection(db, 'properties')
      let q = query(propertiesRef)
      
      // Apply filters
      if (filters.type) {
        q = query(q, where('propertyType', '==', filters.type))
      }
      
      if (filters.transactionType) {
        q = query(q, where('transactionType', '==', filters.transactionType))
      }
      
      if (filters.city) {
        q = query(q, where('location.city', '==', filters.city))
      }
      
      if (filters.minPrice !== undefined) {
        q = query(q, where('price', '>=', filters.minPrice))
      }
      
      if (filters.maxPrice !== undefined) {
        q = query(q, where('price', '<=', filters.maxPrice))
      }
      
      if (filters.bedrooms !== undefined) {
        q = query(q, where('bedrooms', '==', filters.bedrooms))
      }
      
      if (filters.bathrooms !== undefined) {
        q = query(q, where('bathrooms', '==', filters.bathrooms))
      }
      
      // Order by creation date
      q = query(q, orderBy('createdAt', 'desc'))
      
      // Apply pagination
      const pageSize = filters.limit || 10
      const page = filters.page || 1
      const startIndex = (page - 1) * pageSize
      
      if (startIndex > 0) {
        // For pagination, you'd need to implement cursor-based pagination
        // This is a simplified version
        q = query(q, limit(pageSize))
      } else {
        q = query(q, limit(pageSize))
      }
      
      const snapshot = await getDocs(q)
      const properties: Property[] = []
      
      snapshot.forEach((doc) => {
        properties.push({
          id: doc.id,
          ...doc.data()
        } as Property)
      })
      
      return {
        properties,
        total: properties.length, // In a real app, you'd get total count separately
        page: page,
        limit: pageSize,
        hasMore: properties.length === pageSize
      }
    } catch (error) {
      console.error('Firebase get properties error:', error)
      throw new Error('Failed to fetch properties')
    }
  },

  // Get single property by ID
  async getProperty(id: string): Promise<Property | null> {
    try {
      const propertyRef = doc(db, 'properties', id)
      const propertyDoc = await getDoc(propertyRef)
      
      if (!propertyDoc.exists()) {
        return null
      }
      
      return {
        id: propertyDoc.id,
        ...propertyDoc.data()
      } as Property
    } catch (error) {
      console.error('Firebase get property error:', error)
      throw new Error('Failed to fetch property')
    }
  },

  // Create new property
  async createProperty(propertyData: Omit<Property, 'id'>): Promise<Property> {
    try {
      const propertiesRef = collection(db, 'properties')
      const docRef = await addDoc(propertiesRef, {
        ...propertyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      
      return {
        id: docRef.id,
        ...propertyData
      } as Property
    } catch (error) {
      console.error('Firebase create property error:', error)
      throw new Error('Failed to create property')
    }
  },

  // Update property
  async updateProperty(id: string, propertyData: Partial<Property>): Promise<Property> {
    try {
      const propertyRef = doc(db, 'properties', id)
      await updateDoc(propertyRef, {
        ...propertyData,
        updatedAt: new Date().toISOString(),
      })
      
      // Return updated property
      const updatedDoc = await getDoc(propertyRef)
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Property
    } catch (error) {
      console.error('Firebase update property error:', error)
      throw new Error('Failed to update property')
    }
  },

  // Delete property
  async deleteProperty(id: string): Promise<void> {
    try {
      const propertyRef = doc(db, 'properties', id)
      await deleteDoc(propertyRef)
    } catch (error) {
      console.error('Firebase delete property error:', error)
      throw new Error('Failed to delete property')
    }
  },

  // Search properties
  async searchProperties(searchTerm: string): Promise<Property[]> {
    try {
      const propertiesRef = collection(db, 'properties')
      const q = query(propertiesRef, orderBy('title'))
      
      const snapshot = await getDocs(q)
      const properties: Property[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data() as Property
        if (
          data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.location.address.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          properties.push({
            id: doc.id,
            ...data
          })
        }
      })
      
      return properties
    } catch (error) {
      console.error('Firebase search properties error:', error)
      throw new Error('Failed to search properties')
    }
  }
}
