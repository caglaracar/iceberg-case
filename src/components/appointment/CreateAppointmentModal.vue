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
        <a-form-item label="Assign Agent">
          <a-select
            v-model:value="form.agent"
            placeholder="Select an agent"
            class="w-full"
            allow-clear
          >
            <a-select-option
              v-for="agent in availableAgents"
              :key="agent.id"
              :value="agent.name"
            >
              <div class="flex items-center gap-2">
                <a-avatar
                  :style="{ backgroundColor: '#6366f1', color: 'white' }"
                  size="small"
                >
                  {{ getAgentInitials(agent.name) }}
                </a-avatar>
                <span>{{ agent.name }}</span>
              </div>
            </a-select-option>
          </a-select>
          <div class="text-sm text-gray-500 mt-1">Select an agent for this appointment</div>
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

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAppointments } from '@/composables/useAppointments'
import { useAgents } from '@/composables/useAgents'
import dayjs from 'dayjs'
import type { CreateAppointmentData, AppointmentStatus } from '@/types/appointment'
import { validateEmail, validateRequired } from '@/utils/validation'
import { formatDateForAPI, formatTimeForAPI } from '@/utils/date'

interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

interface Emits {
  'update:visible': [visible: boolean]
  'appointment-created': [data: CreateAppointmentData]
}

const emit = defineEmits<Emits>()

// Use composables for API integration
const { createAppointment } = useAppointments()
const { agents: availableAgents, fetchAgents } = useAgents()
const isSubmitting = ref(false)

// Form data
interface FormData {
  customerName: string
  email: string
  phone: string
  address: string
  date: dayjs.Dayjs | null
  time: dayjs.Dayjs | null
  agent: string | null
}

const form = ref<FormData>({
  customerName: '',
  email: '',
  phone: '',
  address: '',
  date: null,
  time: null,
  agent: null
})

// Form validation errors
const errors = ref<Record<string, string>>({})

// Computed properties
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const disabledDate = (current: dayjs.Dayjs): boolean => {
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

const getAgentInitials = (agentName: string): string => {
  if (!agentName) return ''
  return agentName.split(' ').map((name: string) => name.charAt(0)).join('').toUpperCase()
}

// Methods

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}

  // Use utils for validation
  const nameError = validateRequired(form.value.customerName, 'Customer name')
  if (nameError) newErrors.customerName = nameError

  const emailError = validateEmail(form.value.email)
  if (emailError) newErrors.email = emailError

  const phoneError = validateRequired(form.value.phone, 'Phone number')
  if (phoneError) newErrors.phone = phoneError

  const addressError = validateRequired(form.value.address, 'Address')
  if (addressError) newErrors.address = addressError

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

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }

  try {
    isSubmitting.value = true

    const appointmentData = {
      customer: form.value.customerName.trim(),
      contactEmail: form.value.email.trim(),
      contactPhone: form.value.phone.trim(),
      address: form.value.address.trim(),
      date: formatDateForAPI(form.value.date!),
      time: form.value.time ? formatTimeForAPI(form.value.time) : '',
      agent: form.value.agent || undefined,
      status: 'upcoming' as AppointmentStatus
    }

    await createAppointment(appointmentData)
    
    emit('appointment-created', appointmentData)
    resetForm()
    
  } catch (error) {
    console.error('Failed to create appointment:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = (): void => {
  form.value = {
    customerName: '',
    email: '',
    phone: '',
    address: '',
    date: null,
    time: null,
    agent: null
  }
  errors.value = {}
}

const closeModal = (): void => {
  isVisible.value = false
}

// Watch for form changes to validate in real-time
watch(form, () => {
  if (Object.keys(errors.value).length > 0) {
    validateForm()
  }
}, { deep: true })

// Load agents on mount
onMounted(async () => {
  try {
    await fetchAgents()
  } catch (error) {
    console.error('Failed to load agents:', error)
  }
})
</script>

