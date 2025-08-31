<template>
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Appointments</h1>
      <p class="text-gray-600 mt-1">{{ totalCount }} Appointments found.</p>
    </div>
    <a-button 
      type="primary"
      @click="$emit('create-appointment')"
      class="bg-pink-600 hover:bg-pink-700 border-pink-600 hover:border-pink-700"
    >
      <template #icon>
        <plus-outlined />
      </template>
      Create Appointment
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'

interface Props {
  totalCount: number
}

defineProps<Props>()

defineEmits<{
  'create-appointment': []
}>()
</script>
