<template>
  <a-modal
    v-model:open="isVisible"
    :title="modalTitle"
    :width="800"
    :footer="mode === 'detail' ? null : undefined"
    @cancel="closeModal"
  >
    <!-- Detail Mode - Read Only Display -->
    <template v-if="mode === 'detail'">
      <div v-if="isLoadingData" class="flex justify-center items-center py-8">
        <a-spin size="large" />
      </div>
      <div v-else class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <div class="p-2 bg-gray-50 rounded">{{ currentAppointment?.customer }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div class="p-2 bg-gray-50 rounded">{{ currentAppointment?.contactEmail }}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div class="p-2 bg-gray-50 rounded">{{ currentAppointment?.contactPhone }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <a-badge :color="statusColor" :text="currentAppointment?.status" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <div class="p-2 bg-gray-50 rounded">{{ currentAppointment?.address }}</div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
            <div class="p-2 bg-gray-50 rounded">{{ formatDate(currentAppointment?.date) }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
            <div class="p-2 bg-gray-50 rounded">{{ currentAppointment?.time || 'N/A' }}</div>
          </div>
        </div>
        <div v-if="currentAppointment?.agentNames?.length">
          <label class="block text-sm font-medium text-gray-700 mb-1">Agents</label>
          <div class="flex flex-wrap gap-2">
            <a-tag 
              v-for="(agentName, index) in currentAppointment.agentNames"
              :key="index"
              :color="getAgentColor(currentAppointment.agentIds?.[index])"
              class="flex items-center gap-1"
            >
              <a-avatar 
                :style="{ backgroundColor: getAgentColor(currentAppointment.agentIds?.[index]) }"
                size="small"
              >
                {{ getAgentInitials(agentName) }}
              </a-avatar>
              {{ agentName }}
            </a-tag>
          </div>
        </div>
      </div>
    </template>

    <!-- Create/Edit Mode - Form -->
    <template v-else>
      <div v-if="isLoadingData && mode === 'edit'" class="flex justify-center items-center py-8">
        <a-spin size="large" />
      </div>
      <a-form v-else :model="formData" layout="vertical">
        <!-- Contact Selection -->
        <a-form-item label="Contact" :validate-status="errors.contactId ? 'error' : ''" :help="errors.contactId">
          <a-select
            v-model:value="formData.contactId"
            placeholder="Select a contact"
            show-search
            :filter-option="false"
            :options="filteredContacts"
            :loading="contactsLoading"
            @search="handleContactSearch"
            class="contact-select"
          >
            <template #option="{ label, email, phone }">
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-medium">{{ label }}</div>
                  <div class="text-sm text-gray-500">{{ email }}</div>
                </div>
                <div class="text-sm text-gray-400">{{ phone }}</div>
              </div>
            </template>
          </a-select>
        </a-form-item>

        <!-- Address -->
        <a-form-item label="Address" :validate-status="errors.address ? 'error' : ''" :help="errors.address">
          <a-input 
            v-model:value="formData.address" 
            placeholder="Enter appointment address" 
          />
        </a-form-item>

        <!-- Date Selection -->
        <a-form-item label="Appointment Date" :validate-status="errors.date ? 'error' : ''" :help="errors.date">
          <a-date-picker 
            v-model:value="formData.date" 
            style="width: 100%" 
            format="DD/MM/YYYY"
            :disabled-date="disabledDate"
          />
        </a-form-item>

        <!-- Time Selection -->
        <a-form-item label="Appointment Time" :validate-status="errors.time ? 'error' : ''" :help="errors.time">
          <a-time-picker 
            v-model:value="formData.time" 
            style="width: 100%" 
            format="HH:mm"
          />
        </a-form-item>

        <!-- Agent Selection -->
        <a-form-item label="Agents">
          <a-select
            v-model:value="formData.agentId"
            mode="multiple"
            placeholder="Select agents"
            show-search
            :filter-option="false"
            :options="agentOptions"
            :loading="agentsLoading"
            @search="handleAgentSearch"
            style="width: 100%"
          >
            <template #option="{ label, value }">
              <div class="flex items-center space-x-2">
                <a-avatar 
                  :style="{ backgroundColor: getAgentColor(value) }" 
                  size="small"
                >
                  {{ getAgentInitials(label) }}
                </a-avatar>
                <span>{{ label }}</span>
              </div>
            </template>
            <template #tagRender="{ label, value, closable, onClose }">
              <a-tag 
                :closable="closable" 
                :style="{ 
                  backgroundColor: getAgentColor(value),
                  color: 'white',
                  border: 'none'
                }"
                @close="onClose"
              >
                {{ getAgentInitials(label) }} {{ label }}
              </a-tag>
            </template>
          </a-select>
        </a-form-item>
      </a-form>
    </template>

    <!-- Footer for Create/Edit -->
    <template v-if="mode !== 'detail'" #footer>
      <div class="flex justify-end space-x-2">
        <a-button @click="closeModal">Cancel</a-button>
        <a-button 
          type="primary" 
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          {{ mode === 'create' ? 'Create' : 'Update' }} Appointment
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import { notification } from 'ant-design-vue'
import { useAppointments } from '@/composables/useAppointments'
import { useAgents } from '@/composables/useAgents'
import { useContacts } from '@/composables/useContacts'
import type { Appointment } from '@/types/appointment/core'
import type { AppointmentModalProps, AppointmentModalEmits } from '@/types/appointment/ui'
import type { AppointmentFormData } from '@/types/appointment/forms'

const props = withDefaults(defineProps<AppointmentModalProps>(), {
  visible: false,
  mode: 'create',
  loading: false
})

const emit = defineEmits<AppointmentModalEmits>()

// Use composables for API integration
const { createAppointment, getAppointment, updateAppointment } = useAppointments()
const { agents: availableAgents, fetchAgents, loading: agentsLoading } = useAgents()
const { contacts, fetchContacts, loading: contactsLoading } = useContacts()

// Modal visibility
const isVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
})

// Current appointment data (for edit/detail modes)
const currentAppointment = ref<Appointment | null>(null)

// Form data
const formData = ref<AppointmentFormData>({
  contactId: null,
  customerName: '',
  email: '',
  phone: '',
  address: '',
  date: null,
  time: null,
  agentId: null
})

// Form state
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const isLoadingData = ref(false)

// Contact search
const contactSearchQuery = ref('')

// Agent search
const agentSearchQuery = ref('')

// Computed properties
const modalTitle = computed(() => {
  switch (props.mode) {
    case 'create': return 'Create New Appointment'
    case 'edit': return 'Edit Appointment'
    case 'detail': return 'Appointment Details'
    default: return 'Appointment'
  }
})

const statusColor = computed(() => {
  if (!currentAppointment.value) return 'default'
  switch (currentAppointment.value.status) {
    case 'upcoming': return 'blue'
    case 'completed': return 'green'
    case 'cancelled': return 'red'
    default: return 'default'
  }
})

const filteredContacts = computed(() => {
  const query = contactSearchQuery.value.toLowerCase()
  return contacts.value
    .filter(contact => {
      const fullName = `${contact.name} ${contact.surname}`.toLowerCase()
      const email = contact.email?.toLowerCase() || ''
      return fullName.includes(query) || email.includes(query)
    })
    .map(contact => ({
      value: contact.id,
      label: `${contact.name} ${contact.surname}`,
      email: contact.email,
      phone: contact.phone
    }))
})

const agentOptions = computed(() => {
  const query = agentSearchQuery.value.toLowerCase()
  return availableAgents.value
    .filter(agent => {
      const name = agent.name?.toLowerCase() || ''
      return name.includes(query)
    })
    .map(agent => ({
      value: agent.id,
      label: agent.name
    }))
})

// Methods
const getAgentInitials = (name: string): string => {
  return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : ''
}

const getAgentColor = (agentId?: string): string => {
  const agent = availableAgents.value.find(a => a.id === agentId)
  return agent?.color || '#1890ff'
}

const formatDate = (date: any): string => {
  return date ? dayjs(date).format('DD/MM/YYYY') : ''
}


const disabledDate = (current: dayjs.Dayjs): boolean => {
  return current && current.isBefore(dayjs().startOf('day'))
}

const handleContactSearch = (value: string): void => {
  contactSearchQuery.value = value
}

const handleAgentSearch = (value: string): void => {
  agentSearchQuery.value = value
}


const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}

  if (!formData.value.contactId) {
    newErrors.contactId = 'Contact is required'
  }

  if (!formData.value.address?.trim()) {
    newErrors.address = 'Address is required'
  }

  if (!formData.value.date) {
    newErrors.date = 'Date is required'
  }

  if (!formData.value.time) {
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

    // Combine date and time into ISO format for API
    const appointmentDateTime = dayjs(formData.value.date)
      .hour(dayjs(formData.value.time).hour())
      .minute(dayjs(formData.value.time).minute())
      .toISOString()

    const appointmentData = {
      appointment_date: appointmentDateTime,
      appointment_address: formData.value.address.trim(),
      contact_id: [formData.value.contactId],
      agent_id: formData.value.agentId ? [formData.value.agentId] : undefined,
      is_cancelled: false
    }

    if (props.mode === 'create') {
      await createAppointment(appointmentData)
      
      notification.success({
        message: 'Appointment Created',
        description: 'Your appointment has been successfully created',
        duration: 3
      })
      
      emit('appointment:created', appointmentData)
    } else if (props.mode === 'edit' && props.appointmentId) {
      await updateAppointment(props.appointmentId, appointmentData)
      
      notification.success({
        message: 'Appointment Updated',
        description: 'Your appointment has been successfully updated',
        duration: 3
      })
      
      emit('appointment:updated', appointmentData)
    }
    
    closeModal()
    resetForm()
    
  } catch (error) {
    // Error handled by notification below
    notification.error({
      message: 'Failed to Save Appointment',
      description: 'Please check your details and try again',
      duration: 4
    })
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = (): void => {
  formData.value = {
    contactId: null,
    customerName: '',
    email: '',
    phone: '',
    address: '',
    date: null,
    time: null,
    agentId: null
  }
  errors.value = {}
}

const closeModal = (): void => {
  isVisible.value = false
}

// Load appointment data for edit/detail modes
const loadAppointmentData = async (): Promise<void> => {
  if ((props.mode === 'edit' || props.mode === 'detail') && props.appointmentId) {
    try {
      isLoadingData.value = true
      // Clear previous data to prevent showing old data
      currentAppointment.value = null
      
      currentAppointment.value = await getAppointment(props.appointmentId) as any
      if (props.mode === 'edit' && currentAppointment.value) {
        formData.value = {
          contactId: null,
          customerName: currentAppointment.value.customer || '',
          email: currentAppointment.value.contactEmail || '',
          phone: currentAppointment.value.contactPhone || '',
          address: currentAppointment.value.address,
          date: currentAppointment.value.date ? dayjs(currentAppointment.value.date) : null,
          time: currentAppointment.value.date ? dayjs(currentAppointment.value.date) : null,
          agentId: currentAppointment.value.agentIds?.[0] || null
        }
      }
    } catch (error) {
      // Error handled by notification below
      notification.error({
        message: 'Failed to Load Appointment',
        description: 'Could not load appointment details',
        duration: 4
      })
    } finally {
      isLoadingData.value = false
    }
  } else if (props.appointment) {
    // Use provided appointment data
    currentAppointment.value = props.appointment
    
    if (props.mode === 'edit' && currentAppointment.value) {
      formData.value = {
        contactId: null,
        customerName: currentAppointment.value.customer || '',
        email: currentAppointment.value.contactEmail || '',
        phone: currentAppointment.value.contactPhone || '',
        address: currentAppointment.value.address,
        date: dayjs(currentAppointment.value.date),
        time: dayjs(currentAppointment.value.time, 'HH:mm'),
        agentId: currentAppointment.value.agentIds?.[0] || null
      }
    }
  }
}

// Watch for modal visibility and mode changes
watch([() => props.visible, () => props.mode, () => props.appointmentId], async () => {
  if (props.visible) {
    if (props.mode === 'create') {
      resetForm()
      currentAppointment.value = null
    } else {
      await loadAppointmentData()
    }
  }
})

// Load initial data
onMounted(async () => {
  try {
    await Promise.all([
      fetchAgents(),
      fetchContacts()
    ])
  } catch (error) {
    // Error handled silently
  }
})
</script>

<style scoped>
.contact-select .ant-select-selection-item {
  font-weight: 500;
}
</style>
