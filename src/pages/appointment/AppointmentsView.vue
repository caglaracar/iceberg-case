<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Appointments</h1>
        <p class="text-gray-600 mt-1">{{ totalAppointments }} Appointments found.</p>
      </div>
      <a-button 
        type="primary"
        @click="showCreateModal = true"
        class="bg-pink-600 hover:bg-pink-700 border-pink-600 hover:border-pink-700"
      >
        <template #icon>
          <plus-outlined />
        </template>
        Create Appointment
      </a-button>
    </div>

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
      />
    </div>

    <!-- Create Appointment Modal -->
    <CreateAppointmentModal 
      v-model:visible="showCreateModal"
      @appointment-created="handleAppointmentCreated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useAppointments } from '@/composables/useAppointments'
import AppointmentFilters from '@/components/appointment/AppointmentFilters.vue'
import AppointmentTable from '@/components/appointment/AppointmentTable.vue'
import CreateAppointmentModal from '@/components/appointment/CreateAppointmentModal.vue'

const { 
  appointments, 
  loading, 
  error, 
  totalAppointments,
  fetchAppointments,
  searchAppointments,
  filterByStatus,
  createAppointment 
} = useAppointments()

const showCreateModal = ref(false)

const filters = ref({
  search: '',
  status: null,
  agents: [],
  dateRange: {
    start: null,
    end: null
  }
})

const handleFiltersChange = async (newFilters) => {
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

const handlePageChange = async (event) => {
  // Since Airtable pagination works differently, we'll load more records
  // For now, just refetch - can be enhanced later with proper pagination
  await fetchAppointments()
}

const handleSortChange = async (event) => {
  const sortConfig = [{
    field: event.sortField === 'date' ? 'appointment_date' : event.sortField,
    direction: event.sortOrder === 1 ? 'asc' : 'desc'
  }]
  
  await fetchAppointments({ sort: JSON.stringify(sortConfig) })
}

const handleAppointmentCreated = async (appointmentData) => {
  showCreateModal.value = false
  try {
    await createAppointment(appointmentData)
  } catch (err) {
    console.error('Create appointment error:', err)
  }
}

onMounted(async () => {
  try {
    await fetchAppointments()
  } catch (err) {
    console.error('Failed to load appointments:', err)
  }
})
</script>

<style scoped>
.appointments-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
