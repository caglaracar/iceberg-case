<template>
  <div class="p-6">
    <!-- Header -->
    <AppointmentHeader 
      :total-count="totalAppointments"
      @create-appointment="handleCreateAppointment"
    />

    <!-- Filters -->
    <AppointmentFilters 
      v-model:filters="filters"
      @apply-filters="handleFiltersChange"
      class="mb-6"
    />

    <!-- Table -->
    <div class="bg-white rounded-lg shadow-sm">
      <AppointmentTable 
        :appointments="appointments"
        :loading="loading"
        :total-records="totalAppointments"
        @page-change="handlePageChange"
        @sort-change="handleSortChange"
        @view="handleViewAppointment"
        @edit="handleEditAppointment"
        @delete="handleDeleteAppointment"
      />
    </div>

    <!-- Create Appointment Modal -->
    <CreateAppointmentModal 
      v-model:visible="showCreateModal"
      @appointment-created="handleAppointmentCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppointments } from '@/composables/useAppointments'
import AppointmentHeader from '@/components/appointment/AppointmentHeader.vue'
import AppointmentFilters from '@/components/appointment/AppointmentFilters.vue'
import AppointmentTable from '@/components/appointment/AppointmentTable.vue'
import CreateAppointmentModal from '@/components/appointment/CreateAppointmentModal.vue'
import type { 
  Appointment, 
  AppointmentFilters as FilterType,
  CreateAppointmentData 
} from '@/types/appointment'
import type { TableChangeEvent, SortChangeEvent } from '@/types/ui'

// ===== BUSINESS LOGIC LAYER (Page Responsibility) =====

const { 
  appointments, 
  loading, 
  totalAppointments,
  fetchAppointments,
  searchAppointments,
  filterByStatus,
  createAppointment 
} = useAppointments()

// ===== STATE MANAGEMENT =====
const showCreateModal = ref<boolean>(false)
const filters = ref<FilterType>({
  search: '',
  status: null,
  agents: [],
  dateRange: { start: null, end: null }
})

// ===== EVENT HANDLERS (Business Logic) =====

const handleCreateAppointment = (): void => {
  showCreateModal.value = true
}

const handleFiltersChange = async (newFilters: FilterType): Promise<void> => {
  filters.value = { ...newFilters }
  
  try {
    if (newFilters.search) {
      await searchAppointments(newFilters.search)
    } else if (newFilters.status) {
      await filterByStatus(newFilters.status)
    } else {
      await fetchAppointments()
    }
  } catch (err) {
    console.error('Filter error:', err)
  }
}

const handlePageChange = async (_event: TableChangeEvent): Promise<void> => {
  await fetchAppointments()
}

const handleSortChange = async (event: SortChangeEvent): Promise<void> => {
  console.log('Sort requested:', event)
  await fetchAppointments()
}

const handleAppointmentCreated = async (appointmentData: CreateAppointmentData): Promise<void> => {
  showCreateModal.value = false
  try {
    await createAppointment(appointmentData)
    await fetchAppointments() // Refresh list
  } catch (err) {
    console.error('Create appointment error:', err)
  }
}

const handleViewAppointment = (appointment: Appointment): void => {
  console.log('View appointment:', appointment)
  // TODO: Navigate to detail view
}

const handleEditAppointment = (appointment: Appointment): void => {
  console.log('Edit appointment:', appointment)
  // TODO: Open edit modal
}

const handleDeleteAppointment = async (appointment: Appointment): Promise<void> => {
  if (confirm(`Delete appointment for ${appointment.customer}?`)) {
    try {
      // TODO: Implement delete API call
      console.log('Delete appointment:', appointment)
      await fetchAppointments() // Refresh list
    } catch (err) {
      console.error('Delete appointment error:', err)
    }
  }
}

// ===== LIFECYCLE =====
onMounted(async (): Promise<void> => {
  try {
    await fetchAppointments()
  } catch (err) {
    console.error('Failed to load appointments:', err)
  }
})
</script>

