<template>
  <a-modal
    v-model:open="isVisible"
    :title="title"
    :width="width"
    :centered="centered"
    :closable="closable"
    :mask-closable="maskClosable"
    @cancel="handleCancel"
  >
    <template #default>
      <div class="flex items-start space-x-3">
        <!-- Icon -->
        <div v-if="type" class="flex-shrink-0">
          <component 
            :is="iconComponent" 
            :class="iconClass"
            class="w-6 h-6"
          />
        </div>
        
        <!-- Content -->
        <div class="flex-1">
          <p v-if="description" class="text-gray-600 mb-2">
            {{ description }}
          </p>
          
          <!-- Custom content slot -->
          <slot />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <a-button 
          @click="handleCancel"
          :disabled="loading"
        >
          {{ cancelText }}
        </a-button>
        <a-button 
          :type="confirmButtonType"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons-vue'

export interface ConfirmationModalProps {
  visible: boolean
  title?: string
  description?: string
  type?: 'warning' | 'error' | 'success' | 'info' | 'question'
  confirmText?: string
  cancelText?: string
  loading?: boolean
  width?: number | string
  centered?: boolean
  closable?: boolean
  maskClosable?: boolean
}

export interface ConfirmationModalEmits {
  'update:visible': [visible: boolean]
  'confirm': []
  'cancel': []
}

const props = withDefaults(defineProps<ConfirmationModalProps>(), {
  title: 'Confirm Action',
  type: 'question',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  loading: false,
  width: 420,
  centered: true,
  closable: true,
  maskClosable: false
})

const emit = defineEmits<ConfirmationModalEmits>()

// Modal visibility
const isVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
})

// Icon configuration
const iconComponent = computed(() => {
  switch (props.type) {
    case 'warning': return ExclamationCircleOutlined
    case 'error': return CloseCircleOutlined
    case 'success': return CheckCircleOutlined
    case 'info': return InfoCircleOutlined
    case 'question': return QuestionCircleOutlined
    default: return QuestionCircleOutlined
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'warning': return 'text-orange-500'
    case 'error': return 'text-red-500'
    case 'success': return 'text-green-500'
    case 'info': return 'text-blue-500'
    case 'question': return 'text-gray-500'
    default: return 'text-gray-500'
  }
})

const confirmButtonType = computed(() => {
  switch (props.type) {
    case 'warning': return 'primary'
    case 'error': return 'primary'
    case 'success': return 'primary'
    case 'info': return 'primary'
    case 'question': return 'primary'
    default: return 'primary'
  }
})

// Event handlers
const handleConfirm = (): void => {
  emit('confirm')
}

const handleCancel = (): void => {
  emit('cancel')
  emit('update:visible', false)
}
</script>
