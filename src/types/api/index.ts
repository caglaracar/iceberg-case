// API response types for our application
export interface ApiResponse<T = any> {
  data: T
  status: number
  message?: string
}

export interface ApiError {
  status: number
  message: string
  originalError?: any
}

// Agent type for our application
export interface Agent {
  id: string
  number: number
  name: string
  firstName: string
  lastName: string
  color: string
  appointments: string[]
  createdTime: string
}

// Appointment type for our application
export interface Appointment {
  id: string
  appointmentId?: string
  date: string
  time: string
  address: string
  contactId?: string
  contactName?: string
  contactSurname?: string
  contactEmail?: string
  contactPhone?: string
  agentId?: string
  agentName?: string
  agentSurname?: string
  isCancelled: boolean
  createdTime: string
  // Computed properties
  customer: string
  agent: string
  status: 'upcoming' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
}

// Contact type for our application
export interface Contact {
  id: string
  contactId: string
  name: string
  surname: string
  email: string
  phone: string
  address?: string
  createdTime: string
  // Computed properties
  fullName: string
  initials: string
}

// Pagination type
export interface Pagination {
  currentPage: number
  pageSize: number
  totalCount: number
  hasMore: boolean
}

// Filter options
export interface AppointmentFilters {
  search: string
  status: string | null
  agents: string[]
  dateRange: {
    start: Date | null
    end: Date | null
  }
}

// Create appointment data
export interface CreateAppointmentData {
  customer: string
  contactEmail: string
  contactPhone: string
  address: string
  date: string
  time: string
  agent?: string
  status: string
}
