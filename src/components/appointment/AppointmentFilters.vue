<template>
  <div class="appointment-filters bg-white p-4 rounded-lg shadow-sm border">
    <!-- Compact horizontal layout -->
    <div class="flex items-center gap-4 flex-wrap">
      <!-- Agent Filter - Show max 5 + counter (First) -->
      <div class="flex items-center gap-2">
        <div
          v-for="agent in visibleAgents"
          :key="agent.id"
          :class="[
            'cursor-pointer transition-all',
            isAgentSelected(agent.id) 
              ? 'ring-2 ring-pink-300' 
              : 'hover:ring-2 hover:ring-gray-300'
          ]"
          @click="toggleAgent(agent.id)"
        >
          <a-avatar
            :style="{ backgroundColor: agent.color, color: 'white' }"
            :size="32"
          >
            {{ agent.initials }}
          </a-avatar>
        </div>
        
        <!-- Show remaining count if there are more than 5 agents -->
        <div
          v-if="remainingAgentsCount > 0"
          class="flex items-center justify-center w-8 h-8 rounded-full text-xs bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200"
          @click="showAllAgents = !showAllAgents"
        >
          +{{ remainingAgentsCount }}
        </div>
      </div>

      <!-- Status Filter -->
      <div class="min-w-[140px]">
        <a-select
          v-model:value="localFilters.status"
          placeholder="All Statuses"
          class="w-full"
          @change="applyFilters"
          allow-clear
          :dropdown-style="{ zIndex: 1050 }"
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

      <!-- Date Range Filter -->
      <div class="min-w-[200px]">
        <a-range-picker
          v-model:value="dateRange"
          format="DD/MM/YYYY"
          @change="handleDateRangeChange"
          class="w-full"
          :dropdown-style="{ zIndex: 1050 }"
        />
      </div>

      <!-- Search Input - Moved to right -->
      <div class="ml-auto min-w-[250px]">
        <a-input
          v-model:value="localFilters.search"
          placeholder="Search..."
          @input="debouncedApplyFilters"
          class="h-8"
        >
          <template #suffix>
            <a-button type="text" class="p-0 h-auto border-0 bg-transparent hover:bg-gray-100">
              <i class="anticon anticon-search text-gray-400"></i>
            </a-button>
          </template>
        </a-input>
      </div>
    </div>

    <!-- Expanded agents view (when +N is clicked) -->
    <div v-if="showAllAgents && remainingAgentsCount > 0" class="mt-3 pt-3 border-t">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="agent in hiddenAgents"
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

    <!-- Filter count indicator -->
    <div v-if="activeFiltersCount > 0" class="mt-2 text-xs text-gray-500">
      {{ activeFiltersCount }} filter{{ activeFiltersCount !== 1 ? 's' : '' }} applied
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import dayjs from 'dayjs'
import { useAgents } from '@/composables/useAgents'
import type { AppointmentFilters } from '@/types/appointment'
import type { AppointmentFiltersProps, AppointmentFiltersEmits } from '@/types/ui'
import { APPOINTMENT_STATUSES } from '@/constants/appointment'

const props = withDefaults(defineProps<AppointmentFiltersProps>(), {
  filters: () => ({
    search: '',
    status: null,
    agents: [],
    dateRange: { start: null, end: null }
  })
})

const emit = defineEmits<AppointmentFiltersEmits>()

// Use agents composable
const { agents: availableAgents, fetchAgents } = useAgents()

// Local reactive copy of filters
const localFilters = ref<AppointmentFilters>({
  ...props.filters
})

// Date range for Ant Design RangePicker
const dateRange = ref<[dayjs.Dayjs, dayjs.Dayjs] | []>([])

// Show all agents toggle
const showAllAgents = ref<boolean>(false)

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

// Available options from constants
const statusOptions = APPOINTMENT_STATUSES

// Transform agents for display using real colors from API
const agents = computed(() => {
  return availableAgents.value.map(agent => ({
    id: agent.id,
    name: agent.name,
    initials: agent.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase(),
    color: agent.color || '#6366f1' // Use agent's color from API, fallback to default
  }))
})

// Agent display logic
const maxVisibleAgents = 5
const visibleAgents = computed(() => {
  return agents.value.slice(0, maxVisibleAgents)
})

const hiddenAgents = computed(() => {
  return agents.value.slice(maxVisibleAgents)
})

const remainingAgentsCount = computed(() => {
  return Math.max(0, agents.value.length - maxVisibleAgents)
})

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
const isAgentSelected = (agentId: string): boolean => {
  return localFilters.value.agents.includes(agentId)
}

const toggleAgent = (agentId: string): void => {
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

const handleDateRangeChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null): void => {
  if (dates && dates.length === 2) {
    localFilters.value.dateRange.start = dates[0].toDate()
    localFilters.value.dateRange.end = dates[1].toDate()
  } else {
    localFilters.value.dateRange.start = null
    localFilters.value.dateRange.end = null
  }
  applyFilters()
}

const applyFilters = (): void => {
  emit('update:filters', { ...localFilters.value })
  emit('apply-filters', { ...localFilters.value })
}


// Debounced search
const debouncedApplyFilters = useDebounceFn(applyFilters, 300)

// Load agents on mount
onMounted(async () => {
  try {
    await fetchAgents()
  } catch (error) {
    console.error('Failed to load agents:', error)
  }
})
</script>

