import { ref } from 'vue'
import type { Appointment } from '@/types/appointment/core'

export function useAppointmentModal() {
  const showModal = ref(false)
  const modalMode = ref<'create' | 'edit' | 'detail'>('create')
  const selectedAppointmentId = ref<string | undefined>()
  const selectedAppointment = ref<Appointment | undefined>(undefined)

  const createAppointment = () => {
    selectedAppointmentId.value = undefined
    selectedAppointment.value = undefined
    modalMode.value = 'create'
    showModal.value = true
  }

  const viewAppointment = (appointmentId: string) => {
    selectedAppointmentId.value = appointmentId
    selectedAppointment.value = undefined
    modalMode.value = 'detail'
    showModal.value = true
  }

  const editAppointment = (appointmentId: string) => {
    selectedAppointmentId.value = appointmentId
    selectedAppointment.value = undefined
    modalMode.value = 'edit'
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    selectedAppointmentId.value = undefined
    selectedAppointment.value = undefined
  }

  return {
    // State
    showModal,
    modalMode,
    selectedAppointmentId,
    selectedAppointment,
    
    // Actions
    createAppointment,
    viewAppointment,
    editAppointment,
    closeModal
  }
}
