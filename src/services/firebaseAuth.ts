import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

export interface FirebaseUser {
  id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'agent'
  avatar?: string
  preferences: {
    notifications: boolean
    emailUpdates: boolean
    smsUpdates: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface AuthResult {
  success: boolean
  user?: FirebaseUser
  token?: string
  error?: string
}

export const firebaseAuth = {
  async register(userData: {
    name: string
    email: string
    phone: string
    password: string
    role: 'user' | 'agent'
  }): Promise<AuthResult> {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      const user = userCredential.user

      // Update user profile
      await updateProfile(user, {
        displayName: userData.name
      })

      // Create user document in Firestore
      const firebaseUser: FirebaseUser = {
        id: user.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        avatar: null,
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsUpdates: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await setDoc(doc(db, 'users', user.uid), firebaseUser)

      // Get ID token
      const token = await user.getIdToken()

      return {
        success: true,
        user: firebaseUser,
        token
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed'
      }
    }
  },

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (!userDoc.exists()) {
        return {
          success: false,
          error: 'User data not found'
        }
      }

      const userData = userDoc.data() as FirebaseUser

      // Get ID token
      const token = await user.getIdToken()

      return {
        success: true,
        user: userData,
        token
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed'
      }
    }
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  async getCurrentUser(): Promise<FirebaseUser | null> {
    try {
      const user = auth.currentUser
      if (!user) return null

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) return null

      return userDoc.data() as FirebaseUser
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  },

  async updateUser(userId: string, updates: Partial<FirebaseUser>): Promise<boolean> {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      return true
    } catch (error) {
      console.error('Update user error:', error)
      return false
    }
  }
}