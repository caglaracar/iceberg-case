import { computed, type Ref } from 'vue'
import type { Appointment, AppointmentFilters } from '@/types/appointment/core.ts'

export function useAppointmentFiltering(
  appointments: Ref<Appointment[]>,
  filters: Ref<AppointmentFilters>
) {
  const filteredAppointments = computed(() => {
    let filtered = appointments.value
    
    // Search filter
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(apt => 
        apt.contact.toLowerCase().includes(search) ||
        apt.contactEmail?.toLowerCase().includes(search) ||
        apt.contactPhone?.toString().toLowerCase().includes(search) ||
        apt.address.toLowerCase().includes(search)
      )
    }
    
    // Status filter
    if (filters.value.status && filters.value.status !== 'all') {
      const now = new Date()
      
      if (filters.value.status === 'cancelled') {
        filtered = filtered.filter(apt => apt.status === 'cancelled')
      } else if (filters.value.status === 'upcoming') {
        filtered = filtered.filter(apt => 
          apt.status !== 'cancelled' && new Date(apt.date) > now
        )
      } else if (filters.value.status === 'completed') {
        filtered = filtered.filter(apt => 
          apt.status !== 'cancelled' && new Date(apt.date) <= now
        )
      }
    }
    
    // Agent filter
    if (filters.value.agents && filters.value.agents.length > 0) {
      filtered = filtered.filter(apt => 
        apt.agentIds?.some((agentId: string) => filters.value.agents?.includes(agentId))
      )
    }
    
    // Date range filter
    if (filters.value.dateRange?.start && filters.value.dateRange?.end) {
      const start = filters.value.dateRange.start
      const end = filters.value.dateRange.end
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.date)
        return aptDate >= start && aptDate <= end
      })
    }
    
    return filtered
  })

  const paginatedAppointments = (currentPage: Ref<number>, pageSize: Ref<number>) => {
    return computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize.value
      const endIndex = startIndex + pageSize.value
      return filteredAppointments.value.slice(startIndex, endIndex)
    })
  }

  const totalFilteredCount = computed(() => filteredAppointments.value.length)

  return {
    filteredAppointments,
    paginatedAppointments,
    totalFilteredCount
  }
}
