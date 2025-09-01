import { ref } from 'vue'
import api from '@/services/api'
import type { Appointment } from '@/types/appointment/core'
import type { AirtableAppointmentRecord } from '@/types/appointment/airtable'

export const useAppointments = () => {
  const appointments = ref<Appointment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)

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
      contactEmail: fields.contact_email?.[0] || '',
      contactPhone: fields.contact_phone?.[0] || '',
      agentId: fields.agent_id?.[0],
      agentName: fields.agent_name?.[0],
      agentSurname: fields.agent_surname?.[0],
      agentIds: fields.agent_id || [],
      agentNames: fields.agent_name || [],
      agentSurnames: fields.agent_surname || [],
      isCancelled: fields.is_cancelled || false,
      createdTime: record.createdTime,
      
      // Computed properties for display
      contact: `${fields.contact_name?.[0] || ''} ${fields.contact_surname?.[0] || ''}`.trim(),
      agent: fields.agent_name?.[0] || 'Unassigned',
      status: (() => {
        if (fields.is_cancelled) return 'cancelled'
        if (fields.appointment_date) {
          const appointmentDate = new Date(fields.appointment_date)
          const now = new Date()
          if (appointmentDate < now) return 'completed'
        }
        return 'upcoming'
      })() as 'cancelled' | 'upcoming' | 'completed'
    }
  }

  // Fetch all appointments - simplified approach
  const fetchAppointments = async (): Promise<Appointment[]> => {
    loading.value = true
    error.value = null

    try {
      const params = {
        'sort[0][field]': 'appointment_date',
        'sort[0][direction]': 'desc'
      }
      
      const response = await api.get(`/${baseId}/${tableId}`, { params })
      const transformedRecords = response.data.records.map(transformAppointment)
      
      appointments.value = transformedRecords
      totalCount.value = transformedRecords.length
      
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
            appointment_date: appointmentData.appointment_date,
            appointment_address: appointmentData.appointment_address,
            contact_id: appointmentData.contact_id,
            agent_id: appointmentData.agent_id,
            is_cancelled: appointmentData.is_cancelled
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
  const updateAppointment = async (recordId: string, appointmentData: any): Promise<Appointment> => {
    loading.value = true
    error.value = null

    try {
      const payload = {
        records: [{
          id: recordId,
          fields: {
            appointment_date: appointmentData.appointment_date,
            appointment_address: appointmentData.appointment_address,
            contact_id: appointmentData.contact_id,
            agent_id: appointmentData.agent_id,
            is_cancelled: appointmentData.is_cancelled
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
  const deleteAppointment = async (recordId: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.delete(`/${baseId}/${tableId}`, {
        params: {
          'records[]': recordId
        }
      })

      // Remove from local state
      const index = appointments.value.findIndex(apt => apt.id === recordId)
      if (index !== -1) {
        appointments.value.splice(index, 1)
      }

      // Update total count
      if (totalCount.value > 0) {
        totalCount.value -= 1
      }

      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to delete appointment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search appointments - simplified
  const searchAppointments = async (): Promise<Appointment[]> => {
    return fetchAppointments()
  }

  return {
    appointments,
    loading,
    error,
    totalCount,
    fetchAppointments,
    createAppointment,
    getAppointment,
    updateAppointment,
    deleteAppointment,
    searchAppointments
  }
}
