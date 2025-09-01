import type { AppointmentStatus } from '@/types/appointment/core'

export const APPOINTMENT_STATUSES = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' }
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

// Agent display constants
export const AGENT_DISPLAY_LIMIT = 5

// Default agent colors (fallback when API color not available)
export const DEFAULT_AGENT_COLORS = [
  '#6366f1', // indigo
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ef4444', // red
  '#84cc16'  // lime
] as const

// Helper function to get agent color from API data or fallback
export const getAgentColorFromApi = (agents: any[], agentName: string, index: number): string => {
  // Find agent in API data by name
  const agent = agents?.find(a => a.fields?.agent_name === agentName)
  
  if (agent?.fields?.color) {
    return agent.fields.color as string
  }
  
  // Fallback to default colors
  const hash = agentName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  return DEFAULT_AGENT_COLORS[(Math.abs(hash) + index) % DEFAULT_AGENT_COLORS.length] as string
}
