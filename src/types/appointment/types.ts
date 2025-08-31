// Appointment domain types

// Main Appointment entity
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
  agentIds?: string[]
  agentNames?: string[]
  agentSurnames?: string[]
  isCancelled: boolean
  createdTime: string
  // Computed properties
  customer: string
  agent: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

// Create appointment form data
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

// Update appointment data
export interface UpdateAppointmentData {
  date?: string
  address?: string
  contactId?: string
  agentId?: string
  isCancelled?: boolean
}

// Appointment filters
export interface AppointmentFilters {
  search?: string
  status?: string
  agents?: string[]
  dateRange?: {
    start?: string
    end?: string
  }
}

// Appointment table props
export interface AppointmentTableProps {
  appointments: Appointment[]
  loading?: boolean
  pagination?: {
    currentPage: number
    pageSize: number
    totalCount: number
  }
}

export interface AppointmentTableEmits {
  'update:pagination': [pagination: { currentPage: number; pageSize: number }]
  'appointment:edit': [appointment: Appointment]
  'appointment:delete': [appointmentId: string]
  'appointment:status-change': [appointmentId: string, status: string]
}

// Appointment filters component props
export interface AppointmentFiltersProps {
  modelValue: AppointmentFilters
  loading?: boolean
}

export interface AppointmentFiltersEmits {
  'update:modelValue': [filters: AppointmentFilters]
  'filter:apply': [filters: AppointmentFilters]
  'filter:reset': []
}

// Create appointment modal props
export interface CreateAppointmentModalProps {
  visible: boolean
  loading?: boolean
}

export interface CreateAppointmentModalEmits {
  'update:visible': [visible: boolean]
  'appointment:created': [appointment: any]
}

// Create appointment form data
export interface CreateAppointmentFormData {
  contactId: string | null
  address: string
  date: any
  time: any
  agentId: string[]
}
