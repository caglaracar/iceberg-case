// Authentication domain types

// Login credentials
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

// User entity
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'agent' | 'manager'
  isActive: boolean
  createdTime: string
  lastLoginTime?: string
}

// Auth tokens
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// Auth state
export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Registration data
export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

// Password reset
export interface PasswordResetData {
  email: string
}

export interface PasswordUpdateData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// OTP verification
export interface OTPVerificationData {
  email: string
  code: string
}

// Auth form props
export interface LoginFormProps {
  loading?: boolean
  error?: string
}

export interface LoginFormEmits {
  'auth:login': [credentials: LoginCredentials]
}

export interface RegisterFormProps {
  loading?: boolean
  error?: string
}

export interface RegisterFormEmits {
  'auth:register': [data: RegisterData]
}
