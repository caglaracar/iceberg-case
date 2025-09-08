// UI component types for appointment components

import type { Appointment } from './core'

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
  'edit': [appointment: any]
  'delete': [appointment: any]
}
