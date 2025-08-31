// UI/Common component types

// Pagination
export interface Pagination {
  currentPage: number
  pageSize: number
  totalCount: number
  hasMore: boolean
}

// Sort options
export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: Pagination
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Common form validation
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'time'
  placeholder?: string
  rules?: ValidationRule[]
  options?: { label: string; value: any }[]
}

// Table column definition
export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any) => string
}

// Modal props
export interface BaseModalProps {
  visible: boolean
  title?: string
  width?: string
  closable?: boolean
  maskClosable?: boolean
}

export interface BaseModalEmits {
  'update:visible': [visible: boolean]
  'close': []
}

// Button props
export interface ButtonProps {
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
  block?: boolean
  icon?: string
}

// Input props
export interface InputProps {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  maxLength?: number
  size?: 'small' | 'medium' | 'large'
  error?: string
}

export interface InputEmits {
  'update:modelValue': [value: string | number]
  'input': [value: string | number]
  'change': [value: string | number]
  'focus': []
  'blur': []
}

// Select props
export interface SelectProps {
  modelValue?: any
  options: { label: string; value: any; disabled?: boolean }[]
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  loading?: boolean
}

export interface SelectEmits {
  'update:modelValue': [value: any]
  'change': [value: any]
  'search': [query: string]
}
