<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <!-- Mobile Cards View -->
    <div class="block md:hidden">
      <div v-if="loading" class="space-y-4 p-4">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="bg-gray-50 rounded-lg p-4 space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="h-6 bg-gray-300 rounded-full w-20"></div>
              <div class="h-3 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="divide-y divide-gray-100">
        <div 
          v-for="appointment in sortedPaginatedAppointments" 
          :key="appointment.id"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <!-- Contact Info -->
          <div class="flex items-start gap-3 mb-3">
            <UserOutlined class="text-gray-400 text-lg mt-1" />
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900 truncate">{{ appointment.contact }}</div>
              <div class="text-sm text-gray-500 truncate">{{ appointment.contactEmail }}</div>
              <div class="text-sm text-gray-500">{{ appointment.contactPhone }}</div>
            </div>
          </div>
          
          <!-- Address -->
          <div class="flex items-center gap-2 mb-3">
            <HomeOutlined class="text-gray-400" />
            <span class="text-sm text-gray-700 truncate">{{ appointment.address }}</span>
          </div>
          
          <!-- Status & Date -->
          <div class="flex items-center justify-between mb-3">
            <div :class="getStatusBadgeClass(appointment.status)" class="status-pill">
              {{ getStatusLabel(appointment.status) }}
              <span v-if="appointment.status === 'upcoming'" class="countdown-badge">
                {{ getDaysRemaining(appointment.date) }}
              </span>
            </div>
            <div class="flex items-center gap-1 text-xs text-gray-500">
              <clock-circle-outlined />
              {{ formatDate(appointment.date) }} {{ formatTime(appointment.date) }}
            </div>
          </div>
          
          <!-- Agents -->
          <div v-if="appointment.agentNames && appointment.agentNames.length > 0" class="flex items-center gap-1 mb-3">
            <template v-for="(agentName, index) in appointment.agentNames.slice(0, AGENT_DISPLAY_LIMIT)" :key="index">
              <a-avatar 
                :style="{ backgroundColor: getAgentColor(appointment.agentIds?.[index] || '') }"
                size="small"
              >
                {{ getAgentInitials(agentName, appointment.agentSurnames?.[index] || '') }}
              </a-avatar>
            </template>
            <span v-if="appointment.agentNames.length > AGENT_DISPLAY_LIMIT" 
                  class="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1 ml-1">
              +{{ appointment.agentNames.length - AGENT_DISPLAY_LIMIT }}
            </span>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center gap-2 justify-end">
            <a-button type="text" size="small" @click="emit('view', appointment.id)">
              <eye-outlined />
            </a-button>
            <a-button type="text" size="small" @click="emit('edit', appointment.id)">
              <edit-outlined />
            </a-button>
            <a-button type="text" size="small" danger @click="emit('delete', appointment.id)">
              <delete-outlined />
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <a-table
        :columns="tableColumns"
        :data-source="sortedPaginatedAppointments"
        :loading="loading"
        :pagination="false"
        row-key="id"
        class="modern-table min-w-full"
        @change="handleTableChange"
        :scroll="{ x: 1200 }"
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
                  :style="{ backgroundColor: getAgentColor(record.agentIds?.[index] || '') }"
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
    </div>
    
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
import { computed, ref, type Ref } from 'vue'
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
import { useAppointmentFiltering } from '@/composables/appointment/useAppointmentFiltering.ts'
import { useAgents } from '@/composables/agent/useAgents.ts'
import type { Appointment, AppointmentFilters, AppointmentStatus } from '@/types/appointment/core'
import { STATUS_LABELS, AGENT_DISPLAY_LIMIT } from '@/constants/appointment/appointment.ts'

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

const { getAgentColor } = useAgents()

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

// Table change handler for sorting
const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
  if (sorter.columnKey === 'status') {
    sortOrder.value = sorter.order
  }
}
</script>

<style scoped>
@import '@/assets/appointment.css';
</style>
