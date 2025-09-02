<template>
  <div class="appointment-filters bg-white p-4 rounded-lg shadow-sm border">
    <!-- Responsive layout -->
    <div class="flex flex-col md:flex-row md:items-center gap-4 md:gap-4">
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

      <!-- Mobile: Second Row - Status & Date Range -->
      <div class="flex flex-col sm:flex-row gap-3 w-full">
        <!-- Status Filter -->
        <div class="flex-1 min-w-0">
          <a-select
            v-model:value="localFilters.status"
            :placeholder="t('filters.allStatuses')"
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
        <div class="flex-1 min-w-0">
          <a-range-picker
            v-model:value="dateRange"
            format="DD/MM/YYYY"
            @change="handleDateRangeChange"
            class="w-full"
            :dropdown-style="{ zIndex: 1050 }"
            :placeholder="[t('filters.startDate'), t('filters.endDate')]"
            :allow-clear="true"
          />
        </div>
      </div>

      <!-- Mobile: Third Row - Search Input -->
      <div class="w-full">
        <a-input
          v-model:value="localFilters.search"
          :placeholder="t('appointments.searchAppointments')"
          @keyup.enter="applyFilters"
          @input="applyFilters"
          class="header-style-search w-full"
          allow-clear
        >
          <template #suffix>
            <search-outlined class="text-gray-400" />
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

<style scoped>
.header-style-search {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.header-style-search:hover {
  border-color: #cbd5e1;
  background: #ffffff;
}

.header-style-search:focus-within {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from '@/composables/useI18n'
import { SearchOutlined } from '@ant-design/icons-vue'
import { useAgents } from '@/composables/agent/useAgents.ts'
import type { AppointmentFilters } from '@/types/appointment/core'
import { APPOINTMENT_STATUSES } from '@/constants/appointment/appointment.ts'

const emit = defineEmits<{
  'filters-changed': [filters: AppointmentFilters]
}>()

// Use agents composable
const { agents: availableAgents, fetchAgents } = useAgents()

// i18n
const { t } = useI18n()

// Internal filters state - self-managed
const localFilters = ref<AppointmentFilters>({
  search: '',
  status: null,
  agents: [],
  dateRange: {
    start: null,
    end: null
  }
})

// Show all agents toggle
const showAllAgents = ref<boolean>(false)

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
const activeFiltersCount = computed((): number => {
  let count = 0
  if (localFilters.value.search) count++
  if (localFilters.value.status && localFilters.value.status !== 'all') count++
  if (localFilters.value.agents && localFilters.value.agents.length > 0) count++
  if (localFilters.value.dateRange && (localFilters.value.dateRange.start || localFilters.value.dateRange.end)) count++
  return count
})

// Methods
const isAgentSelected = (agentId: string): boolean => {
  return localFilters.value.agents?.includes(agentId) || false
}

const toggleAgent = (agentId: string): void => {
  if (!localFilters.value.agents) {
    localFilters.value.agents = []
  }
  
  const index = localFilters.value.agents.indexOf(agentId)
  if (index === -1) {
    localFilters.value.agents.push(agentId)
  } else {
    localFilters.value.agents.splice(index, 1)
  }
  applyFilters()
}

// Convert dates for date range picker
const dateRange = computed({
  get(): [dayjs.Dayjs, dayjs.Dayjs] | null {
    if (localFilters.value.dateRange?.start && localFilters.value.dateRange?.end) {
      return [dayjs(localFilters.value.dateRange.start), dayjs(localFilters.value.dateRange.end)]
    }
    return null
  },
  set(value: [dayjs.Dayjs, dayjs.Dayjs] | null) {
    if (!localFilters.value.dateRange) {
      localFilters.value.dateRange = { start: null, end: null }
    }
    if (value && value.length === 2) {
      localFilters.value.dateRange.start = value[0].toDate()
      localFilters.value.dateRange.end = value[1].toDate()
    } else {
      localFilters.value.dateRange.start = null
      localFilters.value.dateRange.end = null
    }
    applyFilters()
  }
})

const handleDateRangeChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null): void => {
  if (!localFilters.value.dateRange) {
    localFilters.value.dateRange = { start: null, end: null }
  }
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
  emit('filters-changed', { ...localFilters.value })
}


// Search triggers only on Enter or button click

// Load agents on mount
onMounted(async () => {
  try {
    await fetchAgents()
  } catch (error) {
    // Error handled silently
  }
})
</script>

