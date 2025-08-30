// Common utility types
export type ID = string

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

// Date types
export type DateString = string // ISO date string
export type TimeString = string // HH:mm format

// API status types
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error'

// Sort direction
export type SortDirection = 'asc' | 'desc'

// Generic filter type
export interface BaseFilter {
  [key: string]: any
}

// Generic search parameters
export interface SearchParams {
  query?: string
  page?: number
  pageSize?: number
  sort?: {
    field: string
    direction: SortDirection
  }
}

// Composable return type template
export interface UseApiReturn<T> {
  data: Ref<T[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetch: (params?: any) => Promise<T[]>
  create?: (item: Partial<T>) => Promise<T>
  update?: (id: ID, item: Partial<T>) => Promise<T>
  delete?: (id: ID) => Promise<void>
}

// Vue refs import
import type { Ref } from 'vue'
