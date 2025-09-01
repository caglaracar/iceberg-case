import { ref } from 'vue'
import { useAppointments } from './useAppointments'

export function useAppointmentDelete() {
  const { deleteAppointment, fetchAppointments } = useAppointments()
  
  const showConfirmModal = ref(false)
  const appointmentToDelete = ref<string | null>(null)
  const isDeleting = ref(false)

  const confirmDelete = (appointmentId: string) => {
    appointmentToDelete.value = appointmentId
    showConfirmModal.value = true
  }

  const executeDelete = async () => {
    if (!appointmentToDelete.value) return
    
    try {
      isDeleting.value = true
      await deleteAppointment(appointmentToDelete.value)
      await fetchAppointments()
      showConfirmModal.value = false
      appointmentToDelete.value = null
    } catch (error) {
      // Error handled silently - UI will show loading state completion
    } finally {
      isDeleting.value = false
    }
  }

  const cancelDelete = () => {
    showConfirmModal.value = false
    appointmentToDelete.value = null
  }

  return {
    // State
    showConfirmModal,
    appointmentToDelete,
    isDeleting,
    
    // Actions
    confirmDelete,
    executeDelete,
    cancelDelete
  }
}
