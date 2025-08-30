<template>
  <div class="appointment-filters bg-white p-6 rounded-lg shadow-sm border">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search Input -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Search</label>
        <a-input
          v-model:value="localFilters.search"
          placeholder="Address, customer name, email or phone number..."
          @input="debouncedApplyFilters"
        />
      </div>

      <!-- Status Filter -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Status</label>
        <a-select
          v-model:value="localFilters.status"
          placeholder="All Statuses"
          class="w-full"
          @change="applyFilters"
          allow-clear
        >
          <a-select-option
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>
      </div>

      <!-- Agent Filter -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Agents</label>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="agent in agents"
            :key="agent.id"
            :class="[
              'flex items-center gap-2 px-3 py-2 rounded-full text-sm cursor-pointer transition-all',
              isAgentSelected(agent.id) 
                ? 'bg-pink-100 text-pink-800 ring-1 ring-pink-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            @click="toggleAgent(agent.id)"
          >
            <a-avatar
              :style="{ backgroundColor: agent.color, color: 'white' }"
              size="small"
            >
              {{ agent.initials }}
            </a-avatar>
            <span>{{ agent.name.split(' ')[0] }}</span>
          </div>
        </div>
      </div>

      <!-- Date Range Filter -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Date Range</label>
        <a-range-picker
          v-model:value="dateRange"
          format="DD/MM/YYYY"
          @change="handleDateRangeChange"
          class="w-full"
        />
      </div>
    </div>

    <!-- Filter Actions -->
    <div class="flex justify-between items-center mt-6 pt-4 border-t">
      <div class="text-sm text-gray-500">
        {{ activeFiltersCount }} filter{{ activeFiltersCount !== 1 ? 's' : '' }} applied
      </div>
      <div class="flex gap-2">
        <a-button
          @click="clearFilters"
          :disabled="activeFiltersCount === 0"
        >
          Clear All
        </a-button>
        <a-button
          type="primary"
          @click="applyFilters"
          class="bg-pink-600 hover:bg-pink-700 border-pink-600 hover:border-pink-700"
        >
          Apply Filters
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import dayjs from 'dayjs'
import { mockAgents, appointmentStatuses } from '@/data/mockData'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      search: '',
      status: null,
      agents: [],
      dateRange: { start: null, end: null }
    })
  }
})

const emit = defineEmits(['update:filters', 'apply-filters'])

// Local reactive copy of filters
const localFilters = ref({
  search: '',
  status: null,
  agents: [],
  dateRange: { start: null, end: null },
  ...props.filters
})

// Date range for Ant Design RangePicker
const dateRange = ref([])

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
  // Update date range for Ant Design
  if (newFilters.dateRange.start && newFilters.dateRange.end) {
    dateRange.value = [dayjs(newFilters.dateRange.start), dayjs(newFilters.dateRange.end)]
  } else {
    dateRange.value = []
  }
}, { deep: true })

// Available options
const statusOptions = ref([
  { label: 'All Statuses', value: null },
  ...appointmentStatuses.map(status => ({
    label: status.label,
    value: status.value
  }))
])

const agents = ref(mockAgents)

// Computed properties
const activeFiltersCount = computed(() => {
  let count = 0
  if (localFilters.value.search) count++
  if (localFilters.value.status) count++
  if (localFilters.value.agents.length > 0) count++
  if (localFilters.value.dateRange.start || localFilters.value.dateRange.end) count++
  return count
})

// Methods
const isAgentSelected = (agentId) => {
  return localFilters.value.agents.includes(agentId)
}

const toggleAgent = (agentId) => {
  const agents = [...localFilters.value.agents]
  const index = agents.indexOf(agentId)
  
  if (index > -1) {
    agents.splice(index, 1)
  } else {
    agents.push(agentId)
  }
  
  localFilters.value.agents = agents
  applyFilters()
}

const handleDateRangeChange = (dates) => {
  if (dates && dates.length === 2) {
    localFilters.value.dateRange.start = dates[0].toDate()
    localFilters.value.dateRange.end = dates[1].toDate()
  } else {
    localFilters.value.dateRange.start = null
    localFilters.value.dateRange.end = null
  }
  applyFilters()
}

const applyFilters = () => {
  emit('update:filters', { ...localFilters.value })
  emit('apply-filters', { ...localFilters.value })
}

const clearFilters = () => {
  localFilters.value = {
    search: '',
    status: null,
    agents: [],
    dateRange: { start: null, end: null }
  }
  dateRange.value = []
  applyFilters()
}

// Debounced search
const debouncedApplyFilters = useDebounceFn(applyFilters, 300)
</script>

<style scoped>
/* Custom styles for filter component */
</style>
