<template>
  <a-modal
    v-model:open="isVisible"
    :title="modalTitle"
    :footer="mode === 'detail' ? null : undefined"
    :width="isMobile ? '95vw' : '800px'"
    :style="{ top: '20px' }"
    :maskClosable="true"
    class="appointment-modal"
    :bodyStyle="isMobile ? { padding: '16px' } : {}"
    :getContainer="false"
    :destroyOnClose="true"
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
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('appointment.contact') }}</label>
            <div class="p-2 bg-gray-50 rounded">{{ currentAppointment?.contact }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('appointment.contactEmail') }}</label>
            <div class="p-2 bg-gray-50 rounded">{{ currentAppointment?.contactEmail }}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('appointment.contactPhone') }}</label>
            <div class="p-2 bg-gray-50 rounded">{{ currentAppointment?.contactPhone }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('appointment.status') }}</label>
            <StatusBadge 
              :status="currentAppointment?.status as any" 
              :date="currentAppointment?.date"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('appointment.address') }}</label>
          <div class="p-2 bg-gray-50 rounded">{{ currentAppointment?.address }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('appointment.appointmentDateTime') }}</label>
          <div class="p-2 bg-gray-50 rounded">{{ formatDate(currentAppointment?.date) }} {{ currentAppointment?.time || '' }}</div>
        </div>
        <div v-if="currentAppointment?.agentNames?.length">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('appointment.agents') }}</label>
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
          <label class="block text-sm font-medium text-gray-700 mb-3">{{ t('appointment.relatedAppointments') }}</label>
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
                  :text="t(`status.${appointment.status}`)"
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

        <!-- Mobile Action Buttons (Only in detail mode on mobile) -->
        <div v-if="isMobile && mode === 'detail'" class="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-between space-x-2 z-10">
          <a-button 
            block 
            type="primary" 
            @click="$emit('edit', currentAppointment)"
            class="flex-1"
          >
            {{ t('common.edit') }}
          </a-button>
          <a-button 
            block 
            danger 
            @click="$emit('delete', currentAppointment)"
            class="flex-1"
          >
            {{ t('common.delete') }}
          </a-button>
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
        <a-form-item :label="t('appointment.contact')" :validate-status="errors.contactId ? 'error' : ''" :help="errors.contactId" class="mb-3">
          <a-select
            v-model:value="formData.contactId"
            :placeholder="t('appointment.selectContact')"
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
        <a-form-item :label="t('appointment.address')" class="mb-3">
          <a-input v-model:value="formData.address" :placeholder="t('appointment.enterAddress')" />
        </a-form-item>

        <!-- Appointment Date -->
        <a-form-item :label="t('appointment.appointmentDate')" class="mb-3">
          <a-date-picker
            v-model:value="formData.date"
            :placeholder="t('appointment.selectDate')"
            format="DD/MM/YYYY"
            style="width: 100%"
          />
        </a-form-item>

        <!-- Appointment Time -->
        <a-form-item :label="t('appointment.appointmentTime')" class="mb-3">
          <a-time-picker
            v-model:value="formData.time"
            :placeholder="t('appointment.selectTime')"
            format="HH:mm"
            style="width: 100%"
          />
        </a-form-item>

        <!-- Status (only for edit mode) -->
        <a-form-item v-if="mode === 'edit'" :label="t('appointment.status')" class="mb-3">
          <a-select
            v-model:value="formData.status"
            placeholder="Select status"
            :options="statusOptions"
            style="width: 100%"
          />
        </a-form-item>

        <!-- Agent Selection -->
        <a-form-item :label="t('appointment.agents')" class="mb-3">
          <a-select
            v-model:value="formData.agentId"
            mode="multiple"
            :placeholder="t('appointment.selectAgents')"
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
          <label class="block text-sm font-medium text-gray-700 mb-3">{{ t('appointment.relatedAppointments') }}</label>

          <!-- Related Appointments Grid -->
          <div v-if="relatedAppointments.length > 0" :class="isMobile ? 'space-y-3 mb-4' : 'grid grid-cols-3 gap-3 mb-4'">
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
                  :text="t(`status.${appointment.status}`)"
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
            {{ t('appointment.noRelatedAppointments') }}
          </div>
        </div>
      </a-form>
    </template>

    <!-- Footer for Create/Edit -->
    <template v-if="mode !== 'detail'" #footer>
      <div class="flex justify-end space-x-2">
        <a-button @click="closeModal">{{ t('common.cancel') }}</a-button>
        <a-button
          type="primary"
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          {{ mode === 'create' ? t('appointment.createAppointment') : t('appointment.updateAppointment') }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import { notification } from 'ant-design-vue'
import { useI18n } from '@/composables/useI18n'
import { HomeOutlined, ClockCircleOutlined } from '@ant-design/icons-vue'
import { useAppointments } from '@/composables/appointment/useAppointments.ts'
import { useAgents } from '@/composables/agent/useAgents.ts'
import { useContacts } from '@/composables/contact/useContacts.ts'
import StatusBadge from '@/shared/components/StatusBadge.vue'
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

// i18n
const { t } = useI18n()

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
    case 'create': return t('appointments.newAppointment')
    case 'edit': return t('appointments.editAppointment')
    case 'detail': return t('appointments.viewAppointment')
    default: return t('appointments.title')
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
      { label: t('status.upcoming'), value: 'upcoming' },
      { label: t('status.cancelled'), value: 'cancelled' }
    ]
  }

  const appointmentDate = dayjs(formData.value.date)
  const now = dayjs()
  const isPastDate = appointmentDate.isBefore(now, 'day')

  if (isPastDate) {
    return [
      { label: t('status.completed'), value: 'completed' },
      { label: t('status.cancelled'), value: 'cancelled' }
    ]
  } else {
    return [
      { label: t('status.upcoming'), value: 'upcoming' },
      { label: t('status.cancelled'), value: 'cancelled' }
    ]
  }
})

// Removed separate loading state - now using single isLoadingData state

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
        message: t('appointment.appointmentCreated'),
        description: t('appointment.appointmentCreatedDesc'),
        duration: 3
      })

      emit('appointment:created', appointmentData)
    } else if (props.mode === 'edit' && props.appointmentId) {
      await updateAppointment(props.appointmentId, appointmentData)

      notification.success({
        message: t('appointment.appointmentUpdated'),
        description: t('appointment.appointmentUpdatedDesc'),
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
  if (props.mode === 'edit' || props.mode === 'detail') {
    try {
      isLoadingData.value = true

      // Use provided appointment data first, fallback to fetching by ID
      if (props.appointment) {
        currentAppointment.value = props.appointment
      } else if (props.appointmentId) {
        currentAppointment.value = await getAppointmentById(props.appointmentId) as any
      }

      if (currentAppointment.value) {
        // For edit mode, populate form data
        if (props.mode === 'edit') {
          // Parse the appointment date properly
          const appointmentDateTime = dayjs(currentAppointment.value.date)

          // Find contact by name matching
          let contactId = null
          if (currentAppointment.value?.contact && contacts.value.length > 0) {
            const contact = contacts.value.find(c => {
              const fullName = `${c.name} ${c.surname || ''}`.trim()
              const contactName = currentAppointment.value!.contact
              return fullName === contactName || c.name === contactName
            })
            contactId = contact?.id || null
          }

          formData.value = {
            contactId: contactId,
            address: currentAppointment.value.address || '',
            date: appointmentDateTime.isValid() ? appointmentDateTime : null,
            time: appointmentDateTime.isValid() ? appointmentDateTime : null,
            agentId: currentAppointment.value.agentIds || [],
            status: currentAppointment.value.status || 'upcoming'
          }
        }
      }
    } catch (error) {
      notification.error({
        message: t('appointment.loadError'),
        description: t('appointment.loadErrorDesc'),
        duration: 4
      })
    } finally {
      isLoadingData.value = false
    }
  }
}

// Watch for modal visibility and mode changes
watch([() => props.visible, () => props.mode, () => props.appointmentId, () => props.appointment], async () => {
  if (props.visible) {
    isLoadingData.value = true
    
    try {
      // Load all data simultaneously
      await Promise.all([
        fetchContacts(),
        fetchAgents(),
        fetchAppointments() // Load appointments upfront for related appointments
      ])

      if (props.mode === 'create') {
        resetForm()
        currentAppointment.value = null
      } else {
        await loadAppointmentData()
      }
    } catch (error) {
      console.error('Failed to load modal data:', error)
    } finally {
      isLoadingData.value = false
    }
  }
}, { immediate: true })

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

/* Fix modal positioning */
:deep(.ant-modal) {
  top: 20px !important;
  max-height: calc(100vh - 40px);
}

:deep(.ant-modal-body) {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

:deep(.ant-modal-wrap) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 1000 !important;
}
</style>
