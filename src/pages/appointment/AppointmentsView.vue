<template>
  <div class="p-6">
    <!-- Filters -->
    <AppointmentFiltersComponent 
      @filters-changed="(newFilters: AppointmentFiltersType) => filters = newFilters"
      class="mb-6"
    />

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <p class="text-gray-600">{{ totalFilteredCount }} Appointments found.</p>
      </div>
      <a-button 
        type="primary"
        @click="createAppointment"
        class="bg-pink-600 hover:bg-pink-700 border-pink-600 hover:border-pink-700"
      >
        <template #icon>
          <plus-outlined />
        </template>
        Create Appointment
      </a-button>
    </div>

    <!-- Appointment Table -->
    <AppointmentTable
      :appointments="appointments"
      :filters="filters"
      :loading="loading"
      @view="viewAppointment"
      @edit="editAppointment"
      @delete="confirmDelete"
    />

    <!-- Appointment Modal -->
    <AppointmentModal 
      v-model:visible="showModal"
      :mode="modalMode"
      :appointment-id="selectedAppointmentId"
      :appointment="selectedAppointment"
      @appointment:created="async () => { closeModal(); await fetchAppointments() }"
      @appointment:updated="async () => { closeModal(); await fetchAppointments() }"
    />
    
    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-model:visible="showConfirmModal"
      type="warning"
      title="Delete Appointment"
      description="Are you sure you want to delete this appointment? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      :loading="isDeleting"
      @confirm="executeDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppointments } from '@/composables/useAppointments'
import { useAgents } from '@/composables/useAgents'
import { useAppointmentFiltering } from '@/composables/useAppointmentFiltering'
import { useAppointmentModal } from '@/composables/useAppointmentModal'
import { useAppointmentDelete } from '@/composables/useAppointmentDelete'
import AppointmentFiltersComponent from '@/components/appointment/AppointmentFilters.vue'
import AppointmentTable from '@/components/appointment/AppointmentTable.vue'
import AppointmentModal from '@/components/appointment/AppointmentModal.vue'
import ConfirmationModal from '@/shared/components/ConfirmationModal.vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { AppointmentFilters as AppointmentFiltersType } from '@/types/appointment/core'

const route = useRoute()

// Composables
const { appointments, loading, fetchAppointments } = useAppointments()
const { agents: availableAgents, fetchAgents } = useAgents()
const { showModal, modalMode, selectedAppointmentId, selectedAppointment, createAppointment, viewAppointment, editAppointment, closeModal } = useAppointmentModal()
const { showConfirmModal, isDeleting, confirmDelete, executeDelete, cancelDelete } = useAppointmentDelete()

// Minimal state for table filtering
const filters = ref<AppointmentFiltersType>({
  search: '',
  status: null,
  agents: [],
  dateRange: { start: null, end: null }
})

const { totalFilteredCount } = useAppointmentFiltering(appointments, filters)

// Route watcher for agent pre-selection
watch(
  () => route.query.agents,
  (agentId) => {
    if (agentId && availableAgents.value.length > 0) {
      const selectedAgentId = Array.isArray(agentId) ? agentId[0] : agentId
      const agentExists = availableAgents.value.find(a => a.id === selectedAgentId)
      if (agentExists) {
        filters.value = {
          search: '',
          status: null,
          agents: [selectedAgentId as string],
          dateRange: { start: null, end: null }
        }
      }
    }
  },
  { immediate: true }
)

// Load data
onMounted(async () => {
  await Promise.all([fetchAppointments(), fetchAgents()])
})
</script>

