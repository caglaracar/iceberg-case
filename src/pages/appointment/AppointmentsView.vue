<template>
  <div class="p-6">
    <!-- Filters -->
    <AppointmentFiltersComponent
      :filters="filters"
      @filters-changed="(newFilters: AppointmentFiltersType) => filters = newFilters"
      class="mb-6"
    />

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <p class="text-gray-600">{{ totalFilteredCount }} {{ t('appointments.title') }} {{ t('table.entries') }}.</p>
      </div>
      <a-button
        type="primary"
        @click="createAppointment"
        class="bg-pink-600 hover:bg-pink-700 border-pink-600 hover:border-pink-700"
      >
        <template #icon>
          <plus-outlined />
        </template>
        {{ t('appointments.newAppointment') }}
      </a-button>
    </div>

    <!-- Appointment Table -->
    <AppointmentTable
      :appointments="appointments"
      :filters="filters"
      :loading="loading"
      @view="(appointment) => viewAppointment(appointment.id)"
      @edit="(appointment) => editAppointment(appointment.id)"
      @delete="(appointment) => confirmDelete(appointment.id)"
    />

    <!-- Appointment Modal -->
    <AppointmentModal
      v-model:visible="showModal"
      :mode="modalMode"
      :appointment-id="selectedAppointmentId"
      :appointment="selectedAppointment"
      @appointment:created="async () => { closeModal(); await fetchAppointments() }"
      @appointment:updated="async () => { closeModal(); await fetchAppointments() }"
      @edit="(appointment) => editAppointment(appointment.id)"
      @delete="(appointment) => confirmDelete(appointment.id)"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-model:visible="showConfirmModal"
      type="warning"
      :title="t('appointments.deleteAppointment')"
      :description="t('appointments.confirmDelete')"
      :confirm-text="t('common.delete')"
      :cancel-text="t('common.cancel')"
      :loading="isDeleting"
      @confirm="executeDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useAppointments } from '@/composables/appointment/useAppointments.ts'
import { useAgents } from '@/composables/agent/useAgents.ts'
import { useAppointmentFiltering } from '@/composables/appointment/useAppointmentFiltering.ts'
import { useAppointmentModal } from '@/composables/appointment/useAppointmentModal.ts'
import { useAppointmentDelete } from '@/composables/appointment/useAppointmentDelete.ts'
import AppointmentFiltersComponent from '@/components/appointment/AppointmentFilters.vue'
import AppointmentTable from '@/components/appointment/AppointmentTable.vue'
import AppointmentModal from '@/components/appointment/AppointmentModal.vue'
import ConfirmationModal from '@/shared/components/ConfirmationModal.vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { AppointmentFilters as AppointmentFiltersType } from '@/types/appointment/core'

const route = useRoute()

// i18n
const { t } = useI18n()

// Composables
const { appointments, loading, fetchAppointments } = useAppointments()
const { agents: availableAgents, fetchAgents } = useAgents()
const { showModal, modalMode, selectedAppointmentId, selectedAppointment, createAppointment, viewAppointment, editAppointment, closeModal } = useAppointmentModal()
const refreshAppointments = async (): Promise<void> => {
  await fetchAppointments()
}

const { showConfirmModal, isDeleting, confirmDelete, executeDelete, cancelDelete } = useAppointmentDelete(refreshAppointments)

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
  () => route.query.agent, // Changed from 'agents' to 'agent'
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
  
  // Handle agent pre-selection after agents are loaded
  const agentId = route.query.agent
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
})
</script>

