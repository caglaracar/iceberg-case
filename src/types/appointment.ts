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

// Create appointment form data
export interface CreateAppointmentFormData {
  customerName: string
  email: string
  phone: string
  address: string
  date: Dayjs | null
  time: Dayjs | null
  agentId: string | null
}

// Modal types
export interface CreateAppointmentModalProps {
  visible: boolean
  loading?: boolean
}

export interface CreateAppointmentModalEmits {
  'update:visible': [visible: boolean]
  'appointment:created': [appointment: any]
}
