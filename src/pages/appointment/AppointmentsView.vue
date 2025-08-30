<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Appointments</h1>
        <p class="text-gray-600 mt-1">{{ appointmentStore.totalCount }} Appointments found.</p>
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
        :appointments="appointmentStore.appointments"
        :loading="appointmentStore.isLoading"
        :total-records="appointmentStore.totalCount"
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
import { ref, onMounted, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useAppointmentStore } from '@/stores/appointments'
import AppointmentFilters from '@/components/appointment/AppointmentFilters.vue'
import AppointmentTable from '@/components/appointment/AppointmentTable.vue'
import CreateAppointmentModal from '@/components/appointment/CreateAppointmentModal.vue'

const appointmentStore = useAppointmentStore()
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
  await appointmentStore.fetchAppointments({ 
    page: 1, 
    filters: filters.value 
  })
}

const handlePageChange = async (event) => {
  await appointmentStore.fetchAppointments({ 
    page: event.page + 1,
    filters: filters.value 
  })
}

const handleSortChange = async (event) => {
  await appointmentStore.fetchAppointments({
    page: appointmentStore.currentPage,
    filters: filters.value,
    sort: {
      field: event.sortField,
      order: event.sortOrder
    }
  })
}

const handleAppointmentCreated = async () => {
  showCreateModal.value = false
  await appointmentStore.fetchAppointments({ 
    page: 1, 
    filters: filters.value 
  })
}

onMounted(async () => {
  await appointmentStore.fetchAppointments()
})
</script>

<style scoped>
.appointments-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
