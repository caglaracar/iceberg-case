// Main Appointment entity
import type {Dayjs} from "dayjs";

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  appointmentId: string
  date: string
  time: string
  address: string
  contactId: string
  contactName?: string
  contactSurname?: string
  contactEmail: string
  contactPhone: string
  agentId?: string
  agentName?: string
  agentSurname?: string
  agentIds: string[]
  agentNames: string[]
  agentSurnames: string[]
  isCancelled: boolean
  createdTime: string
  
  // Computed properties
  contact: string
  agent: string
  status: 'cancelled' | 'upcoming' | 'completed'
}

// Filter interface
export interface AppointmentFilters {
  search: string
  status: AppointmentStatus | 'all' | null
  agents: string[]
  dateRange: {
    start: Date | null
    end: Date | null
  }
}


// API request payload for create operation
export interface CreateAppointmentRequest {
  contactId: string | null
  address: string
  date: Dayjs | null
  time: Dayjs | null
  agentId: string[]
}
