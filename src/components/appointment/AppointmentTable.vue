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

<script setup>
import { computed } from 'vue'
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const props = defineProps({
  appointments: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  totalRecords: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['page-change', 'sort-change', 'view', 'edit', 'delete'])

const columns = [
  {
    title: 'Customer',
    key: 'customer',
    dataIndex: 'customerName',
    sorter: true,
    width: 250
  },
  {
    title: 'Address',
    key: 'address',
    dataIndex: 'address',
    width: 200
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    sorter: true,
    width: 120
  },
  {
    title: 'Date & Time',
    key: 'datetime',
    dataIndex: 'date',
    sorter: true,
    width: 150
  },
  {
    title: 'Agents',
    key: 'agents',
    width: 150
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120
  }
]

const paginationConfig = computed(() => ({
  current: 1,
  pageSize: 10,
  total: props.totalRecords,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
}))

const getStatusLabel = (status) => {
  const statusLabels = {
    upcoming: 'Upcoming',
    completed: 'Completed',
    cancelled: 'Cancelled',
    confirmed: 'Confirmed',
    in_progress: 'In Progress'
  }
  return statusLabels[status] || status
}

const getAgentInitials = (agentName) => {
  if (!agentName) return ''
  return agentName.split(' ').map(name => name.charAt(0)).join('').toUpperCase()
}

const getStatusColor = (status) => {
  const mapping = {
    upcoming: 'blue',
    completed: 'green',
    cancelled: 'red'
  }
  return mapping[status] || 'default'
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY')
}

const handleTableChange = (pagination, filters, sorter) => {
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

const viewAppointment = (appointment) => {
  emit('view', appointment)
}

const editAppointment = (appointment) => {
  emit('edit', appointment)
}

const confirmDelete = (appointment) => {
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
