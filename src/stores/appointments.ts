import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import { mockAppointments, mockAgents, simulateApiResponse } from '@/data/mockData'
import DOMPurify from 'dompurify'
import dayjs from 'dayjs'
import type { Agent, Appointment } from '@/types/api'

interface FetchOptions {
  page?: number
  limit?: number
  filters?: {
    search?: string
    status?: string
    agents?: string[]
    dateRange?: {
      start?: string
      end?: string
    }
  }
  sort?: {
    field: string
    order: number
  }
}

interface CreateAppointmentData {
  customerName: string
  email: string
  phone: string
  address: string
  date: string
  time: string
  agents?: Agent[]
}

export const useAppointmentStore = defineStore('appointments', () => {
  const appointments: Ref<Appointment[]> = ref([])
  const agents: Ref<Agent[]> = ref(mockAgents)
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  
  // Pagination
  const currentPage: Ref<number> = ref(1)
  const pageSize: Ref<number> = ref(10)
  const totalCount: Ref<number> = ref(0)
  
  // Computed
  const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPreviousPage = computed(() => currentPage.value > 1)

  // Fetch appointments with filters, pagination, and sorting
  const fetchAppointments = async (options: FetchOptions = {}): Promise<Appointment[]> => {
    try {
      isLoading.value = true
      error.value = null
      
      const {
        page = 1,
        limit = pageSize.value,
        filters = {},
        sort = { field: 'date', order: -1 }
      } = options

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredAppointments = [...mockAppointments]
      
      // Apply search filter
      if (filters.search) {
        const searchTerm = DOMPurify.sanitize(filters.search.toLowerCase())
        filteredAppointments = filteredAppointments.filter(apt => 
          apt.customerName.toLowerCase().includes(searchTerm) ||
          apt.email.toLowerCase().includes(searchTerm) ||
          apt.phone.includes(searchTerm) ||
          apt.address.toLowerCase().includes(searchTerm)
        )
      }
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        filteredAppointments = filteredAppointments.filter(apt => 
          apt.status === filters.status
        )
      }
      
      // Apply agents filter
      if (filters.agents && filters.agents.length > 0) {
        filteredAppointments = filteredAppointments.filter(apt =>
          apt.agents.some(agent => filters.agents.includes(agent.id))
        )
      }
      
      // Apply date range filter
      if (filters.dateRange?.start && filters.dateRange?.end) {
        filteredAppointments = filteredAppointments.filter(apt => {
          const aptDate = dayjs(apt.date)
          return aptDate.isAfter(dayjs(filters.dateRange.start).subtract(1, 'day')) &&
                 aptDate.isBefore(dayjs(filters.dateRange.end).add(1, 'day'))
        })
      }
      
      // Apply sorting
      if (sort.field) {
        filteredAppointments.sort((a, b) => {
          let aVal = a[sort.field]
          let bVal = b[sort.field]
          
          if (sort.field === 'date') {
            aVal = dayjs(a.date + ' ' + a.time).valueOf()
            bVal = dayjs(b.date + ' ' + b.time).valueOf()
          } else if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase()
            bVal = bVal.toLowerCase()
          }
          
          if (sort.order === 1) {
            return aVal > bVal ? 1 : -1
          } else {
            return aVal < bVal ? 1 : -1
          }
        })
      }
      
      // Set total count
      totalCount.value = filteredAppointments.length
      
      // Apply pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex)
      
      // Update state
      appointments.value = paginatedAppointments
      currentPage.value = page
      
      return paginatedAppointments
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch appointments'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Create new appointment
  const createAppointment = async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
    try {
      isLoading.value = true
      error.value = null
      
      // Sanitize input data
      const sanitizedData = {
        customerName: DOMPurify.sanitize(appointmentData.customerName),
        email: DOMPurify.sanitize(appointmentData.email),
        phone: DOMPurify.sanitize(appointmentData.phone),
        address: DOMPurify.sanitize(appointmentData.address),
        date: appointmentData.date,
        time: appointmentData.time,
        agents: appointmentData.agents || []
      }
      
      // Simulate API call
      const response = await simulateApiResponse({
        id: `apt_${Date.now()}`,
        ...sanitizedData,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      // Add to local state (in real app, this would be handled by refetching)
      mockAppointments.unshift(response.data)
      
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to create appointment'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId: string, newStatus: string): Promise<void> => {
    try {
      isLoading.value = true
      
      // Find and update appointment
      const appointment = mockAppointments.find(apt => apt.id === appointmentId)
      if (appointment) {
        appointment.status = newStatus
        appointment.updatedAt = new Date().toISOString()
      }
      
      // Update local state
      const localAppointment = appointments.value.find(apt => apt.id === appointmentId)
      if (localAppointment) {
        localAppointment.status = newStatus
        localAppointment.updatedAt = new Date().toISOString()
      }
      
      await simulateApiResponse({ success: true })
      
    } catch (err: any) {
      error.value = err.message || 'Failed to update appointment'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete appointment
  const deleteAppointment = async (appointmentId: string): Promise<void> => {
    try {
      isLoading.value = true
      
      // Remove from mock data
      const index = mockAppointments.findIndex(apt => apt.id === appointmentId)
      if (index > -1) {
        mockAppointments.splice(index, 1)
      }
      
      // Remove from local state
      const localIndex = appointments.value.findIndex(apt => apt.id === appointmentId)
      if (localIndex > -1) {
        appointments.value.splice(localIndex, 1)
      }
      
      totalCount.value = Math.max(0, totalCount.value - 1)
      
      await simulateApiResponse({ success: true })
      
    } catch (err: any) {
      error.value = err.message || 'Failed to delete appointment'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get statistics
  const getStatistics = computed(() => {
    return {
      total: totalCount.value,
      upcoming: mockAppointments.filter(apt => apt.status === 'upcoming').length,
      completed: mockAppointments.filter(apt => apt.status === 'completed').length,
      cancelled: mockAppointments.filter(apt => apt.status === 'cancelled').length
    }
  })

  return {
    // State
    appointments,
    agents,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalCount,
    
    // Computed
    totalPages,
    hasNextPage,
    hasPreviousPage,
    getStatistics,
    
    // Actions
    fetchAppointments,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment
  }
})
