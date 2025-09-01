import { ref, computed } from 'vue'
import type { DashboardStats, RecentAppointment } from '@/types/dashboard/dashboard.ts'
import { useAppointments } from '../appointment/useAppointments.ts'
import { useAgents } from '../agent/useAgents.ts'
import { useContacts } from '../contact/useContacts.ts'
import dayjs from 'dayjs'

// Helper function to generate initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

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
      totalContacts: contacts.value.length,
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
          contactName: apt.contact || 'Unknown',
          initials: getInitials(apt.contact || 'Unknown'),
          color: agent?.color || '#1890ff',
          time: apt.time,
          service: 'Property Viewing',
          status: apt.status
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
