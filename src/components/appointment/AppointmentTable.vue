<template>
  <div class="appointment-table">
    <a-table
      :columns="columns"
      :data-source="appointments"
      :loading="loading"
      :pagination="paginationConfig"
      @change="handleTableChange"
      :scroll="{ x: 1200 }"
      row-key="id"
    >
      <!-- Customer column -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'customer'">
          <div class="flex flex-col">
            <span class="font-medium text-gray-900">{{ record.customer }}</span>
            <span class="text-sm text-gray-500">{{ record.contactEmail }}</span>
            <span class="text-sm text-gray-400">{{ record.contactPhone }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'address'">
          <div class="max-w-xs">
            <span class="text-sm text-gray-700 line-clamp-2">{{ record.address }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusLabel(record.status) }}
          </a-tag>
        </template>

        <template v-else-if="column.key === 'datetime'">
          <div class="flex flex-col">
            <span class="font-medium text-gray-900">{{ formatDate(record.date) }}</span>
            <span class="text-sm text-gray-500">{{ record.time }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'agents'">
          <div v-if="record.agent">
            <a-avatar
              :style="{ backgroundColor: '#6366f1', color: 'white' }"
              size="small"
            >
              {{ getAgentInitials(record.agent) }}
            </a-avatar>
            <span class="ml-2 text-sm text-gray-700">{{ record.agent }}</span>
          </div>
          <span v-else class="text-sm text-gray-400">No agent assigned</span>
        </template>

        <template v-else-if="column.key === 'actions'">
          <a-space>
            <a-button 
              type="text" 
              size="small"
              @click="viewAppointment(record)"
            >
              <template #icon>
                <eye-outlined />
              </template>
            </a-button>
            <a-button 
              type="text" 
              size="small"
              @click="editAppointment(record)"
            >
              <template #icon>
                <edit-outlined />
              </template>
            </a-button>
            <a-button 
              type="text" 
              size="small"
              danger
              @click="confirmDelete(record)"
            >
              <template #icon>
                <delete-outlined />
              </template>
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { Appointment, AppointmentStatus } from '@/types/appointment'
import type { TableChangeEvent, SortChangeEvent } from '@/types/ui'
import { APPOINTMENT_TABLE_COLUMNS, STATUS_COLORS, STATUS_LABELS, PAGINATION_CONFIG } from '@/constants/appointment'
import { formatDate } from '@/utils/date'

interface Props {
  appointments: Appointment[]
  loading: boolean
  totalRecords: number
}

const props = withDefaults(defineProps<Props>(), {
  appointments: () => [],
  loading: false,
  totalRecords: 0
})

interface Emits {
  'page-change': [event: TableChangeEvent]
  'sort-change': [event: SortChangeEvent]
  'view': [appointment: Appointment]
  'edit': [appointment: Appointment]
  'delete': [appointment: Appointment]
}

const emit = defineEmits<Emits>()

const columns = APPOINTMENT_TABLE_COLUMNS

const paginationConfig = computed(() => ({
  current: 1,
  pageSize: PAGINATION_CONFIG.defaultPageSize,
  total: props.totalRecords,
  showSizeChanger: PAGINATION_CONFIG.showSizeChanger,
  showQuickJumper: PAGINATION_CONFIG.showQuickJumper,
  showTotal: PAGINATION_CONFIG.showTotal
}))

const getStatusLabel = (status: AppointmentStatus): string => {
  return STATUS_LABELS[status] || status
}

const getAgentInitials = (agentName: string): string => {
  if (!agentName) return ''
  return agentName.split(' ').map((name: string) => name.charAt(0)).join('').toUpperCase()
}

const getStatusColor = (status: AppointmentStatus): string => {
  return STATUS_COLORS[status] || 'default'
}

// formatDate imported from utils

const handleTableChange = (pagination: any, _filters: any, sorter: any): void => {
  if (pagination.current !== paginationConfig.value.current) {
    emit('page-change', { page: pagination.current - 1 })
  }
  if (sorter.field) {
    emit('sort-change', {
      sortField: sorter.field,
      sortOrder: sorter.order === 'ascend' ? 1 : -1
    })
  }
}

const viewAppointment = (appointment: Appointment): void => {
  emit('view', appointment)
}

const editAppointment = (appointment: Appointment): void => {
  emit('edit', appointment)
}

const confirmDelete = (appointment: Appointment): void => {
  emit('delete', appointment)
}
</script>

<style scoped>
.appointment-table {
  position: relative;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
