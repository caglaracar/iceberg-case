<template>
  <a-modal
    v-model:open="isVisible"
    title="Create Appointment"
    width="600px"
    @cancel="closeModal"
    :footer="null"
  >
    <a-form
      :model="form"
      @finish="handleSubmit"
      layout="vertical"
      class="space-y-6"
    >
      <!-- Customer Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Customer Information</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a-form-item
            label="Customer Name"
            :validate-status="errors.customerName ? 'error' : ''"
            :help="errors.customerName"
            :rules="[{ required: true, message: 'Customer name is required' }]"
          >
            <a-input
              v-model:value="form.customerName"
              placeholder="Enter customer name"
            />
          </a-form-item>

          <a-form-item
            label="Email"
            :validate-status="errors.email ? 'error' : ''"
            :help="errors.email"
            :rules="[{ required: true, message: 'Email is required' }]"
          >
            <a-input
              v-model:value="form.email"
              type="email"
              placeholder="customer@example.com"
            />
          </a-form-item>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a-form-item
            label="Phone Number"
            :validate-status="errors.phone ? 'error' : ''"
            :help="errors.phone"
            :rules="[{ required: true, message: 'Phone number is required' }]"
          >
            <a-input
              v-model:value="form.phone"
              placeholder="+44 7700 900123"
            />
          </a-form-item>

          <a-form-item
            label="Address"
            :validate-status="errors.address ? 'error' : ''"
            :help="errors.address"
            :rules="[{ required: true, message: 'Address is required' }]"
          >
            <a-input
              v-model:value="form.address"
              placeholder="Enter address"
            />
          </a-form-item>
        </div>
      </div>

      <!-- Appointment Details -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Appointment Details</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a-form-item
            label="Date"
            :validate-status="errors.date ? 'error' : ''"
            :help="errors.date"
            :rules="[{ required: true, message: 'Date is required' }]"
          >
            <a-date-picker
              v-model:value="form.date"
              placeholder="Select date"
              format="YYYY-MM-DD"
              :disabled-date="disabledDate"
              class="w-full"
            />
          </a-form-item>

          <a-form-item
            label="Time"
            :validate-status="errors.time ? 'error' : ''"
            :help="errors.time"
            :rules="[{ required: true, message: 'Time is required' }]"
          >
            <a-time-picker
              v-model:value="form.time"
              placeholder="Select time"
              format="HH:mm"
              class="w-full"
            />
          </a-form-item>
        </div>

        <!-- Agent Selection -->
        <a-form-item label="Assign Agents">
          <div class="flex flex-wrap gap-2">
            <div
              v-for="agent in availableAgents"
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
              <span>{{ agent.name }}</span>
            </div>
          </div>
          <div class="text-sm text-gray-500 mt-1">Select one or more agents for this appointment</div>
        </a-form-item>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 pt-4">
        <a-button
          @click="closeModal"
          :disabled="isSubmitting"
        >
          Cancel
        </a-button>
        <a-button
          type="primary"
          html-type="submit"
          :loading="isSubmitting"
          :disabled="!isFormValid"
          class="bg-pink-600 hover:bg-pink-700 border-pink-600 hover:border-pink-700"
        >
          Create Appointment
        </a-button>
      </div>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppointmentStore } from '@/stores/appointments'
import { mockAgents } from '@/data/mockData'
import dayjs from 'dayjs'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'appointment-created'])

const appointmentStore = useAppointmentStore()
const availableAgents = ref(mockAgents)
const isSubmitting = ref(false)

// Form data
const form = ref({
  customerName: '',
  email: '',
  phone: '',
  address: '',
  date: null,
  time: null,
  agents: []
})

// Form validation errors
const errors = ref({})

// Computed properties
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const disabledDate = (current) => {
  return current && current < dayjs().startOf('day')
}

const isFormValid = computed(() => {
  return form.value.customerName &&
         form.value.email &&
         form.value.phone &&
         form.value.address &&
         form.value.date &&
         form.value.time &&
         Object.keys(errors.value).length === 0
})

// Methods
const isAgentSelected = (agentId) => {
  return form.value.agents.some(agent => agent.id === agentId)
}

const toggleAgent = (agentId) => {
  const agent = availableAgents.value.find(a => a.id === agentId)
  const index = form.value.agents.findIndex(a => a.id === agentId)
  
  if (index > -1) {
    form.value.agents.splice(index, 1)
  } else {
    form.value.agents.push(agent)
  }
}

const validateForm = () => {
  const newErrors = {}

  // Customer name validation
  if (!form.value.customerName?.trim()) {
    newErrors.customerName = 'Customer name is required'
  }

  // Email validation
  if (!form.value.email?.trim()) {
    newErrors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  // Phone validation
  if (!form.value.phone?.trim()) {
    newErrors.phone = 'Phone number is required'
  }

  // Address validation
  if (!form.value.address?.trim()) {
    newErrors.address = 'Address is required'
  }

  // Date validation
  if (!form.value.date) {
    newErrors.date = 'Date is required'
  } else if (dayjs(form.value.date).isBefore(dayjs(), 'day')) {
    newErrors.date = 'Date cannot be in the past'
  }

  // Time validation
  if (!form.value.time) {
    newErrors.time = 'Time is required'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    isSubmitting.value = true

    const appointmentData = {
      customerName: form.value.customerName.trim(),
      email: form.value.email.trim(),
      phone: form.value.phone.trim(),
      address: form.value.address.trim(),
      date: dayjs(form.value.date).format('YYYY-MM-DD'),
      time: form.value.time ? dayjs(form.value.time).format('HH:mm') : '',
      agents: form.value.agents
    }

    await appointmentStore.createAppointment(appointmentData)
    
    emit('appointment-created')
    resetForm()
    
  } catch (error) {
    console.error('Failed to create appointment:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    customerName: '',
    email: '',
    phone: '',
    address: '',
    date: null,
    time: null,
    agents: []
  }
  errors.value = {}
}

const closeModal = () => {
  isVisible.value = false
}

// Watch for form changes to validate in real-time
watch(form, () => {
  if (Object.keys(errors.value).length > 0) {
    validateForm()
  }
}, { deep: true })
</script>

<style scoped>
/* Custom styles for modal */
</style>
