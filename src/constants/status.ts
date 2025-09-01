export const STATUS_COLORS = {
  upcoming: 'blue',
  'in-progress': 'orange',
  completed: 'green',
  cancelled: 'red'
} as const

export type StatusColor = typeof STATUS_COLORS[keyof typeof STATUS_COLORS]
