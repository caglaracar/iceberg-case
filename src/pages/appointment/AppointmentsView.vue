<template>
  <div class="p-6">
    <!-- Filters -->
    <AppointmentFiltersComponent 
      v-model:filters="filters"
      @apply-filters="handleFiltersChange"
      class="mb-6"
    />

    <!-- Header - Moved below filters -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <p class="text-gray-600">{{ totalAppointments }} Appointments found.</p>
      </div>
      <a-button 
        type="primary"
        @click="handleCreateAppointment"
        class="bg-pink-600 hover:bg-pink-700 border-pink-600 hover:border-pink-700"
      >
        <template #icon>
          <plus-outlined />
        </template>
        Create Appointment
      </a-button>
    </div>

    <!-- Modern Table with Enhanced Design -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <a-table
        :columns="tableColumns"
        :data-source="displayedAppointments"
        :loading="loading"
        :pagination="false"
        row-key="id"
        class="modern-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'customer'">
            <div class="flex items-center gap-3">
              <div class="flex flex-col items-center">
                <UserOutlined class="text-gray-400 text-lg mb-1" />
                <a-avatar size="small" class="bg-gradient-to-r from-blue-500 to-purple-600">
                  <span class="text-white">{{ record.customer.charAt(0).toUpperCase() }}</span>
                </a-avatar>
              </div>
              <div class="flex flex-col">
                <span class="font-medium text-gray-900">{{ record.customer }}</span>
                <div class="flex items-center gap-1 text-xs text-gray-500">
                  <MailOutlined class="text-xs" />
                  <span>{{ record.contactEmail }}</span>
                </div>
                <div class="flex items-center gap-1 text-xs text-gray-500">
                  <PhoneOutlined class="text-xs" />
                  <span>{{ record.contactPhone }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'address'">
            <div class="flex items-center gap-2">
              <HomeOutlined class="text-gray-400" />
              <span class="text-sm text-gray-700">{{ record.address }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'agent'">
            <div class="flex items-center gap-1 flex-wrap">
              <template v-if="record.agentNames && record.agentNames.length > 1">
                <div 
                  v-for="(agentName, index) in record.agentNames"
                  :key="record.agentIds?.[index] || index"
                  class="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1"
                >
                  <a-avatar 
                    :style="{ backgroundColor: getAgentColorById(record.agentIds?.[index]), color: 'white' }" 
                    size="small"
                  >
                    {{ getAgentInitials(`${agentName} ${record.agentSurnames?.[index] || ''}`) }}
                  </a-avatar>
                  <span class="text-xs font-medium">{{ agentName }}</span>
                </div>
              </template>
              <template v-else>
                <div class="flex items-center gap-1">
                  <a-avatar 
                    :style="{ backgroundColor: getAgentColor(record.agent), color: 'white' }" 
                    size="small"
                  >
                    {{ getAgentInitials(record.agent) }}
                  </a-avatar>
                  <span class="text-xs font-medium">{{ record.agent }}</span>
                </div>
              </template>
            </div>
          </template>
          <template v-else-if="column.key === 'status'">
            <div class="flex flex-col gap-2">
              <!-- Status Badge -->
              <div v-if="record.status === 'upcoming'" 
                   class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                   style="background-color: #f0f9ff; border: 1px solid #3b82f6; color: #1d4ed8;">
                Upcoming {{ getTimeUntilAppointment(record.date) }}
              </div>
              
              <div v-else-if="record.status === 'cancelled'"
                   class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                   style="background-color: #fef2f2; border: 1px solid #ef4444; color: #dc2626;">
                Cancelled
              </div>
              
              <div v-else-if="record.status === 'completed'"
                   class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                   style="background-color: #f0fdf4; border: 1px solid #22c55e; color: #16a34a;">
                Completed
              </div>
              
              <div v-else
                   class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                   style="background-color: #f8fafc; border: 1px solid #64748b; color: #475569;">
                {{ getStatusLabel(record.status) }}
              </div>
              
              <!-- Date & Time -->
              <div class="flex items-center gap-1 text-xs text-gray-600">
                <ClockCircleOutlined class="text-xs" />
                <span>{{ formatDate(record.date) }} {{ formatTime(record.date) }}</span>
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'actions'">
            <div class="flex gap-1">
              <a-button type="text" size="small" class="text-gray-600 hover:text-blue-600" @click="handleViewAppointment(record)">
                <EyeOutlined />
              </a-button>
              <a-button type="text" size="small" class="text-gray-600 hover:text-green-600" @click="handleEditAppointment(record)">
                <EditOutlined />
              </a-button>
              <a-button type="text" size="small" class="text-gray-600 hover:text-red-600" @click="handleDeleteAppointment(record)">
                <DeleteOutlined />
              </a-button>
            </div>
          </template>
        </template>
      </a-table>
      
      <!-- Simple Ant Design Pagination -->
      <div class="p-4 border-t">
        <a-pagination
          v-model:current="currentPage"
          v-model:page-size="pageSize"
          :total="totalCount"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :show-total="(total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} items`"
          @change="handlePageChange"
          @show-size-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Create Appointment Modal -->
    <CreateAppointmentModal 
      v-model:visible="showCreateModal"
      @appointment:created="handleAppointmentCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppointments } from '@/composables/useAppointments'
import { useAgents } from '@/composables/useAgents'
import AppointmentFiltersComponent from '@/components/appointment/AppointmentFilters.vue'
import CreateAppointmentModal from '@/components/appointment/CreateAppointmentModal.vue'
import { 
  PlusOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  HomeOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined 
} from '@ant-design/icons-vue'
import { formatDate, formatTime, getTimeUntilAppointment } from '@/utils/date'
import { STATUS_LABELS } from '@/constants/appointment'
import type { Appointment, AppointmentFilters, AppointmentStatus } from '@/types/appointment'

// ===== BUSINESS LOGIC LAYER (Page Responsibility) =====

const { 
  appointments, 
  loading, 
  totalAppointments,
  totalCount,
  pagination,
  fetchAppointments 
} = useAppointments()

const { agents: availableAgents, fetchAgents } = useAgents()

// ===== TABLE CONFIG =====
const tableColumns = [
  { title: 'Customer', key: 'customer', dataIndex: 'customer', width: '25%' },
  { title: 'Address', key: 'address', dataIndex: 'address', width: '25%' },
  { title: 'Status & Time', key: 'status', dataIndex: 'status', width: '25%' },
  { title: 'Agents', key: 'agent', dataIndex: 'agent', width: '20%' },
  { title: 'Actions', key: 'actions', width: '5%' }
]

// ===== STATE =====
const currentPage = ref(1)
const pageSize = ref(10)
const showCreateModal = ref(false)
const filters = ref<AppointmentFilters>({
  search: '',
  status: null,
  agents: [],
  dateRange: { start: null, end: null }
})

// ===== COMPUTED =====
const displayedAppointments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return appointments.value.slice(start, end)
})

// ===== HELPER FUNCTIONS =====
const getStatusLabel = (status: AppointmentStatus): string => {
  return STATUS_LABELS[status] || status
}

const getAgentInitials = (agentName: string): string => {
  if (!agentName || agentName === 'Unassigned') return 'U'
  return agentName.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
}

const getAgentColor = (agentName: string): string => {
  if (agentName === 'Unassigned') return '#94a3b8'
  
  // Find agent by name and return their color
  const agent = availableAgents.value.find((a: any) => a.name === agentName)
  return agent?.color || '#6366f1'
}

const getAgentColorById = (agentId?: string): string => {
  if (!agentId) return '#94a3b8'
  
  // Find agent by ID and return their color
  const agent = availableAgents.value.find((a: any) => a.id === agentId)
  return agent?.color || '#6366f1'
}

// ===== EVENT HANDLERS (Business Logic) =====

const handleCreateAppointment = (): void => {
  showCreateModal.value = true
}

const handleFiltersChange = async (newFilters: AppointmentFilters): Promise<void> => {
  filters.value = { ...newFilters }
  
  try {
    await fetchAppointments()
  } catch (err) {
    console.error('Filter error:', err)
  }
}

const handlePageChange = async (page: number, size?: number) => {
  console.log('Page change to:', page, size)
  currentPage.value = page
  if (size && size !== pageSize.value) {
    pageSize.value = size
  }
  
  // Calculate how many records we need to display this page
  const startIndex = (page - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  
  // Keep fetching until we have enough records or no more data
  while (appointments.value.length < endIndex && pagination.value.hasMore) {
    try {
      await fetchAppointments({ 
        append: true,
        offset: pagination.value.offset,
        pageSize: 100, // Use Airtable's max pageSize for efficiency
        updateTotal: false
      })
    } catch (err) {
      console.error('Page change error:', err)
      break
    }
  }
}

// Removed complex sort handling - keep it simple

const handleAppointmentCreated = async (): Promise<void> => {
  // Modal already closed in CreateAppointmentModal component
  // Just refresh the appointments list
  try {
    await fetchAppointments()
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
    // Fetch both appointments and agents
    await Promise.all([
      fetchAppointments({ 
        pageSize: pageSize.value,
        updateTotal: true 
      }),
      fetchAgents()
    ])
  } catch (err) {
    console.error('Error loading data:', err)
  }
})
</script>

<style scoped>
.modern-table :deep(.ant-table) {
  border-radius: 0;
}

.modern-table :deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  padding: 16px 12px;
}

.modern-table :deep(.ant-table-tbody > tr > td) {
  padding: 16px 12px;
  border-bottom: 1px solid #f1f5f9;
}

.modern-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f8fafc;
}

.modern-table :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: none;
}

.modern-table :deep(.ant-table-placeholder) {
  border-bottom: none;
}
</style>
