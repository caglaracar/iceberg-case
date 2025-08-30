import type { Agent, Appointment, AppointmentFilters } from '@/types/api'

// Component props interfaces
export interface AppointmentTableProps {
  appointments: Appointment[]
  loading: boolean
  totalRecords: number
}

export interface AppointmentTableEmits {
  'page-change': [event: { page: number }]
  'sort-change': [event: { sortField: string; sortOrder: number }]
  'view': [appointment: Appointment]
  'edit': [appointment: Appointment]
  'delete': [appointment: Appointment]
}

export interface AppointmentFiltersProps {
  filters: AppointmentFilters
}

export interface AppointmentFiltersEmits {
  'update:filters': [filters: AppointmentFilters]
  'apply-filters': [filters: AppointmentFilters]
}

export interface CreateAppointmentModalProps {
  visible: boolean
}

export interface CreateAppointmentModalEmits {
  'update:visible': [visible: boolean]
  'appointment-created': [appointmentData: any]
}

// Form interfaces
export interface AppointmentForm {
  customerName: string
  email: string
  phone: string
  address: string
  date: any // dayjs object
  time: any // dayjs object
  agent: string | null
}

export interface FormValidationErrors {
  [key: string]: string
}

// Table column interface
export interface TableColumn {
  title: string
  key: string
  dataIndex?: string
  sorter?: boolean
  width?: number
}

// Status options
export interface StatusOption {
  label: string
  value: string
  color: string
}

// Agent display interface
export interface AgentDisplay extends Agent {
  initials: string
}
