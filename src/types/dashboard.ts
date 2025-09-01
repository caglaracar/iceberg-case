export interface DashboardStats {
  todayAppointments: number
  totalCustomers: number
  activeAgents: number
}

export interface RecentAppointment {
  id: string
  customerName: string
  initials: string
  color: string
  time: string
  service: string
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled'
}
