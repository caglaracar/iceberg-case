<template>
  <a-modal
    v-model:open="isVisible"
    :title="modalTitle"
    :footer="mode === 'detail' ? null : undefined"
    :width="isMobile ? '95vw' : '800px'"
    :style="isMobile ? { top: '10px' } : {}"
    :maskClosable="false"
    class="appointment-modal"
    :bodyStyle="isMobile ? { padding: '16px' } : {}"
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
            <div class="p-2 bg-gray-50 rounded">{{ currentAppointment?.contact }}</div>
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
              :color="getAgentColor(currentAppointment.agentIds?.[index] || '')"
              class="flex items-center gap-1"
            >
              <a-avatar 
                :style="{ backgroundColor: getAgentColor(currentAppointment.agentIds?.[index] || '') }"
                size="small"
              >
                {{ getAgentInitials(agentName) }}
              </a-avatar>
              {{ agentName }}
            </a-tag>
          </div>
        </div>
        
        <!-- Related Appointments -->
        <div v-if="relatedAppointments.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-3">Related Appointments:</label>
          <div class="space-y-2">
            <div 
              v-for="appointment in relatedAppointments" 
              :key="appointment.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1">
                  <HomeOutlined class="text-gray-400 text-sm" />
                  <span class="text-sm text-gray-700">{{ appointment.address }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <a-badge 
                  :color="appointment.status === 'completed' ? 'green' : appointment.status === 'cancelled' ? 'red' : 'blue'" 
                  :text="appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)" 
                />
                <div class="flex items-center gap-1 text-xs text-gray-500">
                  <ClockCircleOutlined />
                  {{ formatDate(appointment.date) }}
                </div>
                <div v-if="appointment.agentNames?.[0]" class="flex items-center gap-1">
                  <a-avatar 
                    :style="{ backgroundColor: getAgentColor(appointment.agentIds?.[0] || '') }"
                    size="small"
                  >
                    {{ getAgentInitials(appointment.agentNames[0] || '') }}
                  </a-avatar>
                </div>
              </div>
            </div>
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
        <a-form-item label="Contact" :validate-status="errors.contactId ? 'error' : ''" :help="errors.contactId" class="mb-3">
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
            <a-option
              v-for="contact in contacts"
              :key="contact.id"
              :value="contact.id"
            >
              {{ contact.name }}
            </a-option>
          </a-select>
        </a-form-item>

        <!-- Address -->
        <a-form-item label="Address" class="mb-3">
          <a-input v-model:value="formData.address" placeholder="Enter address" />
        </a-form-item>

        <!-- Appointment Date -->
        <a-form-item label="Appointment Date" class="mb-3">
          <a-date-picker
            v-model:value="formData.date"
            placeholder="Select date"
            format="DD/MM/YYYY"
            style="width: 100%"
          />
        </a-form-item>

        <!-- Appointment Time -->
        <a-form-item label="Appointment Time" class="mb-3">
          <a-time-picker
            v-model:value="formData.time"
            placeholder="Select time"
            format="HH:mm"
            style="width: 100%"
          />
        </a-form-item>

        <!-- Status (only for edit mode) -->
        <a-form-item v-if="mode === 'edit'" label="Status" class="mb-3">
          <a-select
            v-model:value="formData.status"
            placeholder="Select status"
            :options="statusOptions"
            style="width: 100%"
          />
        </a-form-item>

        <!-- Agent Selection -->
        <a-form-item label="Agents" class="mb-3">
          <a-select
            v-model:value="formData.agentId"
            mode="multiple"
            placeholder="Select agents"
            show-search
            :filter-option="false"
            :options="agentOptions"
            :loading="agentsLoading"
            @search="handleAgentSearch"
            :allow-clear="true"
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

        <!-- Related Appointments in Edit Mode -->
        <div v-if="mode === 'edit'">
          <label class="block text-sm font-medium text-gray-700 mb-3">Related Appointments:</label>
          
          <!-- Loading State -->
          <div v-if="relatedAppointmentsLoading" :class="isMobile ? 'grid grid-cols-1 gap-3 mb-4' : 'grid grid-cols-3 gap-3 mb-4'">
            <div v-for="i in 3" :key="i" class="p-3 bg-gray-50 rounded-lg border animate-pulse">
              <div class="flex items-start gap-2 mb-2">
                <div class="w-4 h-4 bg-gray-300 rounded mt-0.5"></div>
                <div class="w-20 h-4 bg-gray-300 rounded"></div>
              </div>
              <div class="flex items-center justify-between">
                <div class="w-16 h-4 bg-gray-300 rounded"></div>
                <div class="flex items-center gap-1">
                  <div class="w-12 h-3 bg-gray-300 rounded"></div>
                  <div class="w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Related Appointments Grid -->
          <div v-else-if="relatedAppointments.length > 0" :class="isMobile ? 'space-y-3 mb-4' : 'grid grid-cols-3 gap-3 mb-4'">
            <div 
              v-for="appointment in relatedAppointments" 
              :key="appointment.id"
              class="p-3 bg-gray-50 rounded-lg border"
            >
              <div class="flex items-start gap-2 mb-2">
                <HomeOutlined class="text-gray-400 text-sm mt-0.5 flex-shrink-0" />
                <span class="text-sm text-gray-700 truncate">{{ appointment.address }}</span>
              </div>
              <div class="flex items-center justify-between">
                <a-badge 
                  :color="appointment.status === 'completed' ? 'green' : appointment.status === 'cancelled' ? 'red' : 'blue'" 
                  :text="appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)" 
                />
                <div class="flex items-center gap-1">
                  <div class="text-xs text-gray-500">
                    {{ formatDate(appointment.date) }}
                  </div>
                  <div v-if="appointment.agentNames?.[0]">
                    <a-avatar 
                      :style="{ backgroundColor: getAgentColor(appointment.agentIds?.[0] || '') }"
                      size="small"
                    >
                      {{ getAgentInitials(appointment.agentNames[0] || '') }}
                    </a-avatar>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No Related Appointments -->
          <div v-else class="p-3 bg-gray-50 rounded-lg border text-center text-gray-500 text-sm mb-4">
            No related appointments found for this contact.
          </div>
        </div>
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
import { HomeOutlined, ClockCircleOutlined } from '@ant-design/icons-vue'
import { useAppointments } from '@/composables/appointment/useAppointments.ts'
import { useAgents } from '@/composables/agent/useAgents.ts'
import { useContacts } from '@/composables/contact/useContacts.ts'
import type { Appointment } from '@/types/appointment/core.ts'
import type { AppointmentModalProps, AppointmentModalEmits } from '@/types/appointment/ui.ts'
import type { CreateAppointmentRequest } from '@/types/appointment/appointment.ts'

// Mobile detection
const isMobile = computed(() => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
})

const props = withDefaults(defineProps<AppointmentModalProps>(), {
  visible: false,
  mode: 'create',
  loading: false
})

const emit = defineEmits<AppointmentModalEmits>()

// Use composables for API integration
const { createAppointment, getAppointmentById, updateAppointment, appointments, fetchAppointments } = useAppointments()
const { agents: availableAgents, fetchAgents, loading: agentsLoading, getAgentColor } = useAgents()
const { contacts, fetchContacts, loading: contactsLoading } = useContacts()

// Modal visibility
const isVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
})

// Current appointment data (for edit/detail modes)
const currentAppointment = ref<Appointment | null>(null)

// Form data
const formData = ref<CreateAppointmentRequest & { status?: string }>({
  contactId: null,
  address: '',
  date: null,
  time: null,
  agentId: [],
  status: 'upcoming'
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

const statusOptions = computed(() => {
  if (!formData.value.date) {
    return [
      { label: 'Upcoming', value: 'upcoming' },
      { label: 'Cancelled', value: 'cancelled' }
    ]
  }
  
  const appointmentDate = dayjs(formData.value.date)
  const now = dayjs()
  const isPastDate = appointmentDate.isBefore(now, 'day')
  
  if (isPastDate) {
    return [
      { label: 'Completed', value: 'completed' },
      { label: 'Cancelled', value: 'cancelled' }
    ]
  } else {
    return [
      { label: 'Upcoming', value: 'upcoming' },
      { label: 'Cancelled', value: 'cancelled' }
    ]
  }
})

// Related appointments loading state - separate from main appointments loading
const relatedAppointmentsLoading = ref(false)

// Related appointments for the same contact
const relatedAppointments = computed(() => {  
  const contactId = formData.value.contactId || currentAppointment.value?.contactId
  
  if (!contactId) {
    return []
  }
  
  // Don't wait for appointmentsLoading - use appointments if available
  if (!appointments.value?.length) {
    return []
  }
  
  const currentId = props.appointmentId || currentAppointment.value?.id
  
  const related = appointments.value
    .filter(apt => 
      apt.contactId === contactId && 
      apt.id !== currentId
    )
    .slice(0, 5) // Limit to 5 related appointments
    
  return related
})

// Methods
const getAgentInitials = (name: string): string => {
  return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : ''
}

const formatDate = (date: any): string => {
  return date ? dayjs(date).format('DD/MM/YYYY') : ''
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
      agent_id: formData.value.agentId ? (Array.isArray(formData.value.agentId) ? formData.value.agentId : [formData.value.agentId]) : undefined,
      is_cancelled: formData.value.status === 'cancelled'
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
    address: '',
    date: null,
    time: null,
    agentId: [],
    status: 'upcoming'
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
      
      currentAppointment.value = await getAppointmentById(props.appointmentId) as any
      
      if (props.mode === 'edit' && currentAppointment.value) {
        formData.value = {
          contactId: currentAppointment.value.contactId || null,
          address: currentAppointment.value.address,
          date: currentAppointment.value.date ? dayjs(currentAppointment.value.date) : null,
          time: currentAppointment.value.date ? dayjs(currentAppointment.value.date) : null,
          agentId: currentAppointment.value.agentIds || [],
          status: currentAppointment.value.status || 'upcoming'
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
        address: currentAppointment.value.address,
        date: dayjs(currentAppointment.value.date),
        time: dayjs(currentAppointment.value.time, 'HH:mm'),
        agentId: currentAppointment.value.agentIds || [],
        status: currentAppointment.value.status || 'upcoming'
      }
    }
  }
}

// Watch for modal visibility and mode changes
watch([() => props.visible, () => props.mode, () => props.appointmentId], async () => {
  if (props.visible) {
    // Show skeleton for 300ms, then fetch appointments
    if (props.mode === 'edit') {
      relatedAppointmentsLoading.value = true
      setTimeout(() => {
        relatedAppointmentsLoading.value = false
      }, 300)
    }
    
    // Fetch appointments in background (non-blocking)
    fetchAppointments()
    
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
    console.error(error)
  }
})
</script>

<style scoped>
.contact-select .ant-select-selection-item {
  font-weight: 500;
}
</style>
