// UI component types for appointment components

import type { Appointment, AppointmentFilters } from './core'

// Table component props and emits
export interface AppointmentTableProps {
  appointments: Appointment[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    showTotal?: (total: number, range: [number, number]) => string
  }
}

export interface AppointmentTableEmits {
  'view': [appointmentId: string]
  'edit': [appointmentId: string] 
  'delete': [appointmentId: string]
  'page-change': [page: number, pageSize: number]
  'sort-change': [sortData: { sortField: string; sortOrder: number }]
}

// Filters component props and emits
export interface AppointmentFiltersProps {
  filters?: AppointmentFilters
  loading?: boolean
}

export interface AppointmentFiltersEmits {
  'update:filters': [filters: AppointmentFilters]
  'apply-filters': [filters: AppointmentFilters]
  'filter:reset': []
}

// Modal component props and emits
export interface AppointmentModalProps {
  visible: boolean
  mode: 'create' | 'edit' | 'detail'
  appointmentId?: string
  appointment?: Appointment
  loading?: boolean
}

export interface AppointmentModalEmits {
  'update:visible': [visible: boolean]
  'appointment:created': [appointment: any]
  'appointment:updated': [appointment: any]
}
