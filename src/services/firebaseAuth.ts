import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { User } from '../context/AuthContext'

export interface FirebaseAuthResult {
  user: User
  token: string
}

export const firebaseAuth = {
  // Login with email and password
  async login(email: string, password: string): Promise<FirebaseAuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      const token = await firebaseUser.getIdToken()
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      const userData = userDoc.exists() ? userDoc.data() : null
      
      const user: User = {
        id: firebaseUser.uid,
        name: userData?.name || firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        phone: userData?.phone || '',
        avatar: userData?.avatar || firebaseUser.photoURL || '',
        role: userData?.role || 'user',
        verified: firebaseUser.emailVerified,
        preferences: userData?.preferences || {
          propertyTypes: [],
          locations: [],
          priceRange: { min: 0, max: 10000000 },
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
        },
        createdAt: userData?.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }
      
      return { user, token }
    } catch (error) {
      console.error('Firebase login error:', error)
      throw new Error('Login failed')
    }
  },

  // Register new user
  async register(userData: {
    name: string
    email: string
    phone: string
    password: string
    role: 'user' | 'agent'
  }): Promise<FirebaseAuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      const firebaseUser = userCredential.user
      
      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: userData.name,
      })
      
      // Create user document in Firestore
      const user: User = {
        id: firebaseUser.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        verified: false,
        preferences: {
          propertyTypes: [],
          locations: [],
          priceRange: { min: 0, max: 10000000 },
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...user,
        updatedAt: new Date().toISOString(),
      })
      
      const token = await firebaseUser.getIdToken()
      return { user, token }
    } catch (error) {
      console.error('Firebase registration error:', error)
      throw new Error('Registration failed')
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Firebase logout error:', error)
      throw new Error('Logout failed')
    }
  },

  // Update user profile
  async updateUser(uid: string, userData: Partial<User>): Promise<User> {
    try {
      const userRef = doc(db, 'users', uid)
      await setDoc(userRef, {
        ...userData,
        updatedAt: new Date().toISOString(),
      }, { merge: true })
      
      // Return updated user data
      const userDoc = await getDoc(userRef)
      return userDoc.data() as User
    } catch (error) {
      console.error('Firebase update user error:', error)
      throw new Error('Update failed')
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth.currentUser
      if (!firebaseUser) return null
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (!userDoc.exists()) return null
      
      return userDoc.data() as User
    } catch (error) {
      console.error('Firebase get current user error:', error)
      return null
    }
  }
}
