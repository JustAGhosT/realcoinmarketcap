export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country: string
  isVerified: boolean
  isSeller: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}
