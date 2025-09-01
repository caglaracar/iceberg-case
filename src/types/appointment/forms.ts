// Form data types for appointment creation and editing

import type { Dayjs } from 'dayjs'

// Create appointment API data
export interface CreateAppointmentData {
  customerName: string
  email: string
  phone: string
  address: string
  date: string
  time: string
  agentId?: string
  contactId?: string
  isCancelled?: boolean
}

// Update appointment API data
export interface UpdateAppointmentData {
  date?: string
  address?: string
  contactId?: string
  agentId?: string
  isCancelled?: boolean
}

// Form data for appointment forms (with Dayjs objects)
export interface AppointmentFormData {
  contactId: string | null
  customerName?: string
  email?: string
  phone?: string
  address: string
  date: Dayjs | null
  time: Dayjs | null
  agentId: string | null
}
