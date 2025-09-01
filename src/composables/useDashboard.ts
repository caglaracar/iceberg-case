import { ref, computed } from 'vue'
import { useAppointments } from './useAppointments'
import { useAgents } from './useAgents'
import { useContacts } from './useContacts'
import type { DashboardStats, RecentAppointment } from '@/types/dashboard'
import dayjs from 'dayjs'

export function useDashboard() {
  const { appointments, fetchAppointments } = useAppointments()
  const { agents, fetchAgents } = useAgents()
  const { contacts, fetchContacts } = useContacts()
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Dashboard stats computed from real data
  const dashboardStats = computed<DashboardStats>(() => {
    const today = dayjs().format('YYYY-MM-DD')
    
    const todayAppointments = appointments.value.filter(apt => 
      dayjs(apt.date).format('YYYY-MM-DD') === today
    ).length

    return {
      todayAppointments,
      totalCustomers: contacts.value.length,
      activeAgents: agents.value.length
    }
  })

  // Recent appointments (last 5)
  const recentAppointments = computed<RecentAppointment[]>(() => {
    return appointments.value
      .slice(0, 5)
      .map(apt => {
        const agent = agents.value.find(a => apt.agentIds?.includes(a.id))
        
        return {
          id: apt.id,
          customerName: apt.customer || 'Unknown Customer',
          initials: apt.customer?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || '??',
          color: agent?.color || '#1890ff',
          time: dayjs(apt.date).format('HH:mm'),
          service: 'Appointment',
          status: apt.status as any
        }
      })
  })


  // Load all dashboard data
  const loadDashboardData = async () => {
    loading.value = true
    error.value = null

    try {
      await Promise.all([
        fetchAppointments(),
        fetchAgents(),
        fetchContacts()
      ])
    } catch (err: any) {
      error.value = err.message || 'Failed to load dashboard data'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    dashboardStats,
    recentAppointments,
    loadDashboardData
  }
}
