// Core appointment types and enums

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled'

// Main appointment entity (transformed from Airtable)
export interface Appointment {
  id: string
  appointmentId?: string
  date: string
  time: string
  address: string
  contactId?: string
  contactName?: string
  contactSurname?: string
  contactEmail: string
  contactPhone: string
  agentId?: string
  agentName?: string
  agentSurname?: string
  agentIds?: string[]
  agentNames?: string[]
  agentSurnames?: string[]
  isCancelled: boolean
  createdTime: string
  // Computed properties
  customer: string
  agent: string
  status: AppointmentStatus
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
