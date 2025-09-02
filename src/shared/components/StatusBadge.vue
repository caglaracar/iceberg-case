<template>
  <div class="status-badge" :class="statusClasses">
    <span class="status-text">{{ statusText }}</span>
    <span v-if="date" class="date-time">{{ formattedDate }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from '@/composables/useI18n'

interface StatusBadgeProps {
  status: 'upcoming' | 'completed' | 'cancelled'
  date?: string | Date
  showDate?: boolean
}

const props = withDefaults(defineProps<StatusBadgeProps>(), {
  showDate: true
})

const { t } = useI18n()

const statusText = computed(() => {
  return t(`status.${props.status}`).toUpperCase()
})

const formattedDate = computed(() => {
  if (!props.date || !props.showDate) return ''
  return dayjs(props.date).format('DD/MM/YYYY HH:mm')
})

const statusClasses = computed(() => {
  const baseClasses = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium'
  
  switch (props.status) {
    case 'upcoming':
      return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`
    case 'completed':
      return `${baseClasses} bg-green-100 text-green-800 border border-green-200`
    case 'cancelled':
      return `${baseClasses} bg-pink-100 text-pink-800 border border-pink-200`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`
  }
})
</script>

<style scoped>
.status-badge {
  transition: all 0.2s ease-in-out;
}

.status-text {
  font-weight: 600;
  letter-spacing: 0.025em;
}

.date-time {
  font-weight: 500;
  opacity: 0.9;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .status-badge {
    flex-direction: column;
    align-items: flex-start;
    gap: 1px;
  }
  
  .date-time {
    font-size: 0.625rem;
    opacity: 0.7;
  }
}
</style>
