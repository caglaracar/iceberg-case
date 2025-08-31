import type { AppointmentStatus } from '@/types/appointment'

export const APPOINTMENT_STATUSES = [
  { label: 'All Statuses', value: null },
  { label: 'Cancelled', value: 'cancelled' as AppointmentStatus }
] as const

export const STATUS_COLORS: Record<AppointmentStatus, string> = {
  upcoming: 'blue',
  completed: 'green',
  cancelled: 'red'
}

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  upcoming: 'Upcoming',
  completed: 'Completed',
  cancelled: 'Cancelled'
}

export const APPOINTMENT_TABLE_COLUMNS = [
  {
    title: 'Customer',
    key: 'customer',
    dataIndex: 'customerName',
    sorter: true,
    width: 250
  },
  {
    title: 'Address',
    key: 'address',
    dataIndex: 'address',
    width: 200
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    sorter: true,
    width: 120
  },
  {
    title: 'Date & Time',
    key: 'datetime',
    dataIndex: 'date',
    sorter: true,
    width: 150
  },
  {
    title: 'Agents',
    key: 'agents',
    width: 150
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120
  }
] as const

export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `${range[0]}-${range[1]} of ${total} items`
} as const
