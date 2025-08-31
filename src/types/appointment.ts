export interface Appointment {
  id: string
  customer: string
  contactEmail: string
  contactPhone: string
  address: string
  date: string
  time: string
  status: AppointmentStatus
  agent?: string
  createdAt?: string
  updatedAt?: string
}

export type AppointmentStatus = 
  | 'upcoming' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled'

export interface AppointmentFilters {
  search: string
  status: AppointmentStatus | null
  agents: string[]
  dateRange: {
    start: Date | null
    end: Date | null
  }
}

export interface CreateAppointmentData {
  customer: string
  contactEmail: string
  contactPhone: string
  address: string
  date: string
  time: string
  agent?: string
  status: AppointmentStatus
}

import type { Dayjs } from 'dayjs'

// Appointment-specific form validation
export interface AppointmentFormData {
  customerName: string
  email: string
  phone: string
  address: string
  date: Dayjs | null
  time: Dayjs | null
  agent: string | null
}

// Component-specific interfaces moved to UI types
export type { TableColumn, PaginationConfig, TableChangeEvent, SortChangeEvent, FormErrors } from './ui'
