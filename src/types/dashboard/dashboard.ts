export interface DashboardStats {
  todayAppointments: number
  totalContacts: number
  activeAgents: number
}

export interface RecentAppointment {
  id: string
  contactName: string
  initials: string
  color: string
  time: string
  service: string
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled'
}
