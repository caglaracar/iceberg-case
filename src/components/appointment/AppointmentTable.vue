<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <a-table
      :columns="tableColumns"
      :data-source="sortedPaginatedAppointments"
      :loading="loading"
      :pagination="false"
      row-key="id"
      class="modern-table"
      @change="handleTableChange"
    >
      <!-- Contact column -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'contact'">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <UserOutlined class="text-gray-400 text-sm" />
              <span class="font-medium text-gray-900">{{ record.contact }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <MailOutlined class="text-gray-400 text-sm" />
              <span>{{ record.contactEmail }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <PhoneOutlined class="text-gray-400 text-sm" />
              <span>{{ record.contactPhone }}</span>
            </div>
          </div>
        </template>

        <template v-else-if="column.key === 'address'">
          <div class="flex items-center gap-2">
            <HomeOutlined class="text-gray-400" />
            <span class="text-sm text-gray-700">{{ record.address }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'status'">
          <div class="status-row">
            <div :class="getStatusBadgeClass(record.status)" class="status-pill">
              {{ getStatusLabel(record.status) }}
              <span v-if="record.status === 'upcoming'" class="countdown-badge">
                {{ getDaysRemaining(record.date) }}
              </span>
            </div>
            <div class="time-row">
              <clock-circle-outlined class="time-icon-small" />
              {{ formatDate(record.date) }} {{ formatTime(record.date) }}
            </div>
          </div>
        </template>

        <template v-else-if="column.key === 'agent'">
          <div v-if="record.agentNames && record.agentNames.length > 0" class="flex items-center gap-1">
            <!-- Show up to 5 agents, then +N -->
            <template v-for="(agentName, index) in record.agentNames.slice(0, AGENT_DISPLAY_LIMIT)" :key="index">
              <a-tooltip :title="`${agentName} ${record.agentSurnames?.[index] || ''}`">
                <a-avatar 
                  :style="{ backgroundColor: getAgentColor(agentName, index), color: 'white' }"
                  size="small"
                >
                  {{ getAgentInitials(agentName, record.agentSurnames?.[index] || '') }}
                </a-avatar>
              </a-tooltip>
            </template>
            
            <!-- Show +N if more than 5 agents -->
            <a-tooltip v-if="record.agentNames.length > AGENT_DISPLAY_LIMIT" 
                       :title="getHiddenAgentsTooltip(record.agentNames, record.agentSurnames)">
              <span class="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1 ml-1 cursor-help">
                +{{ record.agentNames.length - AGENT_DISPLAY_LIMIT }}
              </span>
            </a-tooltip>
          </div>
          <span v-else class="text-sm text-gray-400">No agent assigned</span>
        </template>

        <template v-else-if="column.key === 'actions'">
          <div class="flex items-center gap-2">
            <a-tooltip title="View Details">
              <a-button type="text" size="small" @click="emit('view', record.id)">
                <template #icon>
                  <eye-outlined />
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip title="Edit">
              <a-button 
                type="text" 
                size="small"
                @click="emit('edit', record.id)">
              
                <template #icon>
                  <edit-outlined />
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip title="Delete">
              <a-button 
                type="text" 
                size="small"
                danger
                @click="emit('delete', record.id)"
              >
                <template #icon>
                  <delete-outlined />
                </template>
              </a-button>
            </a-tooltip>
          </div>
        </template>
      </template>
    </a-table>
    
    <!-- Pagination -->
    <div class="p-4 border-t">
      <a-pagination 
        v-bind="paginationConfig" 
        @change="(page: number, size: number) => { currentPage = page; pageSize = size }" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref, onMounted } from 'vue'
import { 
  ClockCircleOutlined,
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined
} from '@ant-design/icons-vue'
import { useAppointmentFiltering } from '@/composables/useAppointmentFiltering'
import { useAgents } from '@/composables/useAgents'
import type { Appointment, AppointmentFilters, AppointmentStatus } from '@/types/appointment/core'
import { STATUS_LABELS, AGENT_DISPLAY_LIMIT, getAgentColorFromApi } from '@/constants/appointment'

interface Props {
  appointments: Appointment[]
  loading?: boolean
  filters: AppointmentFilters
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  view: [id: string]
  edit: [id: string] 
  delete: [id: string]
}>()

// Use agents for dynamic colors
const { agents, fetchAgents } = useAgents()

// Internal pagination state
const currentPage = ref(1)
const pageSize = ref(10)

// Sorting state - only for appointment time
const sortOrder = ref<'ascend' | 'descend' | null>(null)

// Use filtering composable
const { paginatedAppointments: getPaginatedAppointments, totalFilteredCount } = useAppointmentFiltering(
  computed(() => props.appointments) as Ref<Appointment[]>, 
  computed(() => props.filters) as Ref<AppointmentFilters>
)
const paginatedAppointments = getPaginatedAppointments(currentPage, pageSize)

// Sorted appointments for display
const sortedPaginatedAppointments = computed(() => {
  if (!sortOrder.value) return paginatedAppointments.value
  
  return [...paginatedAppointments.value].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    
    if (sortOrder.value === 'ascend') {
      return dateA - dateB
    } else {
      return dateB - dateA
    }
  })
})

// Pagination config
const paginationConfig = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: totalFilteredCount.value,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} items`
}))

// Table columns configuration - computed to react to sort changes
const tableColumns = computed(() => [
  { title: 'Contact', key: 'contact', dataIndex: 'contact', width: '25%' },
  { title: 'Address', key: 'address', dataIndex: 'address', width: '25%' },
  { 
    title: 'Status & Appointment Time', 
    key: 'status', 
    dataIndex: 'status', 
    width: '25%',
    sorter: true,
    sortOrder: sortOrder.value
  },
  { title: 'Agents', key: 'agent', dataIndex: 'agent', width: '20%' },
  { title: 'Actions', key: 'actions', width: '5%' }
])

// Helper functions
const getStatusLabel = (status: AppointmentStatus): string => {
  return STATUS_LABELS[status] || status
}

const getAgentInitials = (firstName: string, lastName?: string): string => {
  if (!firstName) return 'U'
  const firstInitial = firstName.charAt(0).toUpperCase()
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
  return firstInitial + lastInitial
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  })
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const getStatusBadgeClass = (status: AppointmentStatus): string => {
  switch (status) {
    case 'upcoming':
      return 'badge-upcoming'
    case 'completed':
      return 'badge-completed'
    case 'cancelled':
      return 'badge-cancelled'
    default:
      return 'badge-default'
  }
}

const getHiddenAgentsTooltip = (agentNames: string[], agentSurnames?: string[]): string => {
  const hiddenAgents = agentNames.slice(AGENT_DISPLAY_LIMIT)
  return hiddenAgents.map((name, index) => {
    const surname = agentSurnames?.[AGENT_DISPLAY_LIMIT + index] || ''
    return surname ? `${name} ${surname}` : name
  }).join('\n')
}

const getDaysRemaining = (appointmentDate: string): string => {
  const now = new Date()
  const apptDate = new Date(appointmentDate)
  const diffTime = apptDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return '1 day'
  } else if (diffDays <= 30) {
    return `${diffDays} days`
  } else if (diffDays <= 365) {
    const months = Math.floor(diffDays / 30)
    const remainingDays = diffDays % 30
    if (remainingDays > 0) {
      return `${months} month${months > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
    }
    return `${months} month${months > 1 ? 's' : ''}`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} year${years > 1 ? 's' : ''}`
  }
}

const getAgentColor = (agentName: string, index: number): string => {
  return getAgentColorFromApi(agents.value, agentName, index)
}

// Load agents on mount
onMounted(async () => {
  try {
    await fetchAgents()
  } catch (error) {
    console.error('Failed to fetch agents:', error)
  }
})

// Table change handler for sorting
const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
  if (sorter.columnKey === 'status') {
    sortOrder.value = sorter.order
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Ultra Compact Status */
.status-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 2px 0;
}

.status-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  min-width: 120px;
}

.countdown-badge {
  background: linear-gradient(45deg, #ff4757, #ff3838);
  color: white;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 700;
  margin-left: 4px;
  box-shadow: 0 1px 3px rgba(255, 71, 87, 0.4);
  animation: glow 1.5s ease-in-out infinite alternate;
  white-space: nowrap;
  min-width: 60px;
  text-align: center;
}

.time-row {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 9px;
  color: #6b7280;
  font-weight: 400;
}

.time-icon-small {
  width: 8px;
  height: 8px;
  color: #9ca3af;
}

@keyframes glow {
  0% { 
    box-shadow: 0 1px 3px rgba(255, 71, 87, 0.4);
    transform: scale(1);
  }
  100% { 
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.8);
    transform: scale(1.05);
  }
}

/* Pill Colors */
.badge-upcoming {
  background: #dbeafe;
  color: #1d4ed8;
  border: 1px solid #93c5fd;
}

.badge-completed {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.badge-cancelled {
  background: #fce7f3;
  color: #be185d;
  border: 1px solid #f9a8d4;
}

.badge-default {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}
</style>
