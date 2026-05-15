// Local storage-based auth fallback for when Firebase isn't configured
const USERS_KEY = 'vv:users'
const SESSION_KEY = 'vv:session'

export interface LocalUser {
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
  passwordHash: string
}

function hashPassword(password: string): string {
  // Simple deterministic hash for client-side storage (not production crypto)
  let hash = 0
  const str = password + 'vv_salt_2024'
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36) + str.length.toString(36)
}

function getUsers(): LocalUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users: LocalUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const localAuth = {
  async register(userData: {
    name: string
    email: string
    phone: string
    password: string
    role: 'user' | 'agent'
  }) {
    const users = getUsers()
    const existing = users.find(u => u.email === userData.email.toLowerCase())
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const user: LocalUser = {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      phone: userData.phone,
      role: userData.role,
      avatar: '',
      preferences: { notifications: true, emailUpdates: true, smsUpdates: false },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordHash: hashPassword(userData.password),
    }

    users.push(user)
    saveUsers(users)

    const token = `local_token_${user.id}`
    localStorage.setItem(SESSION_KEY, token)

    const { passwordHash: _, ...safeUser } = user
    return { success: true, user: safeUser, token }
  },

  async login(email: string, password: string) {
    const users = getUsers()
    const user = users.find(u => u.email === email.toLowerCase())

    if (!user) {
      return { success: false, error: 'No account found with this email address.' }
    }

    if (user.passwordHash !== hashPassword(password)) {
      return { success: false, error: 'Incorrect password. Please try again.' }
    }

    const token = `local_token_${user.id}`
    localStorage.setItem(SESSION_KEY, token)

    const { passwordHash: _, ...safeUser } = user
    return { success: true, user: safeUser, token }
  },

  async logout() {
    localStorage.removeItem(SESSION_KEY)
  },
}
