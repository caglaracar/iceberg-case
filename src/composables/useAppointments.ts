import { ref, computed, type Ref } from 'vue'
import api from '@/services/api'
import type { Appointment } from '@/types/appointment'
import type { AirtableAppointmentRecord } from '@/types/appointment'

export function useAppointments() {
  const appointments: Ref<Appointment[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const pagination: Ref<{offset?: string; hasMore: boolean}> = ref({
    hasMore: false
  })

  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID
  const tableId = import.meta.env.VITE_AIRTABLE_APPOINTMENTS_TABLE_ID

  // Transform Airtable record to our appointment format
  const transformAppointment = (record: AirtableAppointmentRecord): Appointment => {
    const fields = record.fields
    return {
      id: record.id,
      appointmentId: fields.appointment_id,
      date: fields.appointment_date || '',
      time: fields.appointment_date ? new Date(fields.appointment_date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) : '',
      address: fields.appointment_address || '',
      contactId: fields.contact_id?.[0],
      contactName: fields.contact_name?.[0],
      contactSurname: fields.contact_surname?.[0],
      contactEmail: fields.contact_email?.[0],
      contactPhone: fields.contact_phone?.[0],
      agentId: fields.agent_id?.[0],
      agentName: fields.agent_name?.[0],
      agentSurname: fields.agent_surname?.[0],
      isCancelled: fields.is_cancelled || false,
      createdTime: record.createdTime,
      
      // Computed properties for display
      customer: `${fields.contact_name?.[0] || ''} ${fields.contact_surname?.[0] || ''}`.trim(),
      agent: fields.agent_name?.[0] || 'Unassigned',
      status: (fields.is_cancelled ? 'cancelled' : 'upcoming') as 'cancelled' | 'upcoming' | 'confirmed' | 'in_progress' | 'completed'
    }
  }

  // Fetch appointments - basit request
  const fetchAppointments = async (options: {append?: boolean; filterByFormula?: string; offset?: string} = {}): Promise<Appointment[]> => {
    loading.value = true
    error.value = null

    try {
      // Sadece basit GET request
      const response = await api.get(`/${baseId}/${tableId}`)
      
      const transformedRecords = response.data.records.map(transformAppointment)
      
      if (options.append) {
        appointments.value = [...appointments.value, ...transformedRecords]
      } else {
        appointments.value = transformedRecords
      }

      pagination.value = {
        offset: response.data.offset,
        hasMore: !!response.data.offset
      }

      return transformedRecords
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch appointments'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get single appointment
  const getAppointment = async (recordId: string): Promise<Appointment> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/${baseId}/${tableId}/${recordId}`)
      return transformAppointment(response.data)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch appointment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new appointment
  const createAppointment = async (appointmentData: any): Promise<Appointment> => {
    loading.value = true
    error.value = null

    try {
      const payload = {
        records: [{
          fields: {
            appointment_date: appointmentData.date,
            appointment_address: appointmentData.address,
            contact_id: appointmentData.contactId ? [appointmentData.contactId] : undefined,
            agent_id: appointmentData.agentId ? [appointmentData.agentId] : undefined,
            is_cancelled: appointmentData.isCancelled || false
          }
        }]
      }

      const response = await api.post(`/${baseId}/${tableId}`, payload)
      const newAppointment = transformAppointment(response.data.records[0])
      
      // Add to local state
      appointments.value.unshift(newAppointment)
      
      return newAppointment
    } catch (err: any) {
      error.value = err.message || 'Failed to create appointment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update appointment
  const updateAppointment = async (recordId: string, updates: any): Promise<Appointment> => {
    loading.value = true
    error.value = null

    try {
      const payload = {
        records: [{
          id: recordId,
          fields: {
            ...updates.date && { appointment_date: updates.date },
            ...updates.address && { appointment_address: updates.address },
            ...updates.contactId && { contact_id: [updates.contactId] },
            ...updates.agentId && { agent_id: [updates.agentId] },
            ...updates.hasOwnProperty('isCancelled') && { is_cancelled: updates.isCancelled }
          }
        }]
      }

      const response = await api.patch(`/${baseId}/${tableId}`, payload)
      const updatedAppointment = transformAppointment(response.data.records[0])
      
      // Update local state
      const index = appointments.value.findIndex(apt => apt.id === recordId)
      if (index !== -1) {
        appointments.value.splice(index, 1, updatedAppointment)
      }
      
      return updatedAppointment
    } catch (err: any) {
      error.value = err.message || 'Failed to update appointment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete appointment
  const deleteAppointment = async (recordId: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/${baseId}/${tableId}`, {
        params: { records: [recordId] }
      })
      
      // Remove from local state
      appointments.value = appointments.value.filter(apt => apt.id !== recordId)
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete appointment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search appointments
  const searchAppointments = async (searchTerm: string): Promise<Appointment[]> => {
    if (!searchTerm.trim()) {
      return fetchAppointments()
    }

    const formula = `OR(
      SEARCH(LOWER("${searchTerm}"), LOWER({contact_name})),
      SEARCH(LOWER("${searchTerm}"), LOWER({contact_surname})),
      SEARCH(LOWER("${searchTerm}"), LOWER({contact_email})),
      SEARCH(LOWER("${searchTerm}"), LOWER({appointment_address}))
    )`

    return fetchAppointments({ filterByFormula: formula })
  }

  // Filter by status
  const filterByStatus = async (status: string): Promise<Appointment[]> => {
    let formula = ''
    
    switch (status) {
      case 'upcoming':
        formula = 'NOT({is_cancelled})'
        break
      case 'cancelled':
        formula = '{is_cancelled}'
        break
      default:
        return fetchAppointments()
    }

    return fetchAppointments({ filterByFormula: formula })
  }

  // Load more appointments (pagination)
  const loadMore = async (): Promise<Appointment[] | undefined> => {
    if (!pagination.value.hasMore || loading.value) return
    
    return fetchAppointments({
      offset: pagination.value.offset,
      append: true
    })
  }

  // Computed properties
  const totalAppointments = computed(() => appointments.value.length)
  const upcomingAppointments = computed(() => 
    appointments.value.filter(apt => !apt.isCancelled)
  )
  const cancelledAppointments = computed(() => 
    appointments.value.filter(apt => apt.isCancelled)
  )

  return {
    // State
    appointments,
    loading,
    error,
    pagination,
    
    // Actions
    fetchAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    searchAppointments,
    filterByStatus,
    loadMore,
    
    // Computed
    totalAppointments,
    upcomingAppointments,
    cancelledAppointments
  }
}
