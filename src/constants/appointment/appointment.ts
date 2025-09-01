import type { AppointmentStatus } from '@/types/appointment/core.ts'

export const APPOINTMENT_STATUSES = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' }
] as const


export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  upcoming: 'Upcoming',
  completed: 'Completed',
  cancelled: 'Cancelled'
}

// Agent display constants
export const AGENT_DISPLAY_LIMIT = 5
