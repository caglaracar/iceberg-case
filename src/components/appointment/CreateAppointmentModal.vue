<template>
  <a-modal
    v-model:open="isVisible"
    title="Create Appointment"
    width="600px"
    @cancel="closeModal"
    :footer="null"
  >
    <a-form
      :model="formData"
      @finish="handleSubmit"
      layout="vertical"
      class="space-y-6"
    >
      <!-- Contact Selection -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Contact & Address</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a-form-item
            label="Select Contact"
            :validate-status="errors.contactId ? 'error' : ''"
            :help="errors.contactId"
            :rules="[{ required: true, message: 'Contact selection is required' }]"
          >
            <a-select
              v-model:value="formData.contactId"
              placeholder="Search and select a contact"
              show-search
              :filter-option="filterContactOption"
              :loading="contactsLoading"
              class="w-full"
            >
              <a-select-option
                v-for="contact in availableContacts"
                :key="contact.id"
                :value="contact.id"
              >
                {{ contact.fullName }} - {{ contact.email }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="Address"
            :validate-status="errors.address ? 'error' : ''"
            :help="errors.address"
            :rules="[{ required: true, message: 'Address is required' }]"
          >
            <a-input
              v-model:value="formData.address"
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
              v-model:value="formData.date"
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
              v-model:value="formData.time"
              placeholder="Select time"
              format="HH:mm"
              class="w-full"
            />
          </a-form-item>
        </div>

        <!-- Agent Selection -->
        <a-form-item 
          label="Assign Agent(s)"
          :validate-status="errors.agentId ? 'error' : ''"
          :help="errors.agentId"
          :rules="[{ required: true, message: 'At least one agent is required' }]"
        >
          <a-select
            v-model:value="formData.agentId"
            mode="multiple"
            placeholder="Select agent(s)"
            class="w-full"
            allow-clear
          >
            <a-select-option
              v-for="agent in availableAgents"
              :key="agent.id"
              :value="agent.id"
            >
              <div class="flex items-center gap-2">
                <a-avatar
                  :style="{ backgroundColor: agent.color || '#6366f1', color: 'white' }"
                  size="small"
                >
                  {{ getAgentInitials(agent.name) }}
                </a-avatar>
                <span>{{ agent.name }}</span>
              </div>
            </a-select-option>
          </a-select>
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
import { useContacts } from '@/composables/useContacts'
import dayjs from 'dayjs'
import { validateRequired } from '@/utils/validation'
import type { 
  CreateAppointmentModalProps, 
  CreateAppointmentModalEmits,
  CreateAppointmentFormData
} from '@/types/appointment/types'

const props = withDefaults(defineProps<CreateAppointmentModalProps>(), {
  visible: false
})

const emit = defineEmits<CreateAppointmentModalEmits>()

// Use composables for API integration
const { createAppointment } = useAppointments()
const { agents: availableAgents, fetchAgents } = useAgents()
const { contacts: availableContacts, fetchContacts, loading: contactsLoading } = useContacts()
const isSubmitting = ref(false)

// Contact search filter
const filterContactOption = (input: string, option: any) => {
  if (!input) return true
  
  const contact = availableContacts.value.find(c => c.id === option.value)
  if (!contact) return false
  
  const searchText = input.toLowerCase()
  return contact.fullName.toLowerCase().includes(searchText) || 
         contact.email.toLowerCase().includes(searchText) ||
         contact.name.toLowerCase().includes(searchText) ||
         contact.surname.toLowerCase().includes(searchText)
}

// Load data on component mount
onMounted(async () => {
  await Promise.all([
    fetchAgents(),
    fetchContacts()
  ])
})

// Form data
const formData = ref<CreateAppointmentFormData>({
  contactId: null,
  address: '',
  date: null,
  time: null,
  agentId: []
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


const getAgentInitials = (agentName: string): string => {
  if (!agentName) return ''
  return agentName.split(' ').map((name: string) => name.charAt(0)).join('').toUpperCase()
}

// Methods

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}

  // Contact validation
  if (!formData.value.contactId) {
    newErrors.contactId = 'Contact selection is required'
  }

  // Agent validation
  if (formData.value.agentId.length === 0) {
    newErrors.agentId = 'At least one agent must be selected'
  }

  const addressError = validateRequired(formData.value.address, 'Address')
  if (addressError) newErrors.address = addressError

  // Date validation
  if (!formData.value.date) {
    newErrors.date = 'Date is required'
  } else if (dayjs(formData.value.date).isBefore(dayjs(), 'day')) {
    newErrors.date = 'Date cannot be in the past'
  }

  // Time validation
  if (!formData.value.time) {
    newErrors.time = 'Time is required'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async (): Promise<void> => {
  // Always run validation on submit
  if (!validateForm()) {
    return
  }

  try {
    isSubmitting.value = true

    // Combine date and time into ISO format for API
    const appointmentDateTime = dayjs(formData.value.date)
      .hour(dayjs(formData.value.time).hour())
      .minute(dayjs(formData.value.time).minute())
      .toISOString()

    // Create appointment with selected contact_id
    const appointmentData = {
      appointment_date: appointmentDateTime,
      appointment_address: formData.value.address.trim(),
      contact_id: [formData.value.contactId],
      agent_id: formData.value.agentId.length > 0 ? formData.value.agentId : undefined,
      is_cancelled: false
    }

    await createAppointment(appointmentData)
    
    // Success (200): Close modal and emit for list refresh
    closeModal()
    resetForm()
    emit('appointment:created', appointmentData as any)
    
  } catch (error) {
    console.error('Failed to create appointment:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = (): void => {
  formData.value = {
    contactId: null,
    address: '',
    date: null,
    time: null,
    agentId: []
  }
  errors.value = {}
}

const closeModal = (): void => {
  isVisible.value = false
}

// Watch for form changes to clear errors
watch(formData, () => {
  // Clear errors when user makes changes
  if (Object.keys(errors.value).length > 0) {
    errors.value = {}
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

