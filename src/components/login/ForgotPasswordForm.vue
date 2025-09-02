<template>
  <div class="forgot-password-form">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ t('auth.forgotPasswordTitle') }}</h1>
      <p class="text-gray-600">{{ t('auth.forgotPasswordDesc') }}</p>
    </div>

    <form @submit.prevent="handleForgotPassword" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('auth.emailAddress') }}</label>
        <a-input
          v-model:value="form.email"
          type="email"
          :placeholder="t('auth.emailAddress')"
          size="large"
          :status="errors.email ? 'error' : ''"
          class="rounded-lg"
        />
        <div v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</div>
      </div>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        block
        :loading="isLoading"
        class="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 rounded-lg font-medium h-12"
        @click="handleForgotPassword"
      >
        {{ t('auth.sendVerificationCode') }}
      </a-button>
    </form>

    <div class="mt-6 text-center">
      <a 
        href="#" 
        @click.prevent="$emit('back-to-signin')"
        class="text-indigo-600 hover:text-indigo-500 font-medium"
      >
        ← {{ t('auth.backToSignIn') }}
      </a>
    </div>

    <!-- Error Message -->
    <a-alert
      v-if="errorMessage"
      :message="errorMessage"
      type="error"
      class="mt-4"
      closable
      @close="errorMessage = ''"
    />

    <!-- Success Message -->
    <a-alert
      v-if="successMessage"
      :message="successMessage"
      type="success"
      class="mt-4"
      closable
      @close="successMessage = ''"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n'

// i18n
const { t } = useI18n()

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})


const emit = defineEmits(['forgot-password', 'back-to-signin'])

const form = ref({
  email: ''
})

const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')

const validateForm = () => {
  const newErrors = {}

  if (!form.value.email) {
    newErrors.email = t('validation.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    newErrors.email = t('validation.invalidEmail')
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleForgotPassword = () => {
  if (!validateForm()) {
    return
  }

  emit('forgot-password', form.value)
}

// Expose methods for parent component
defineExpose({
  setError: (message) => {
    errorMessage.value = message
  },
  setSuccess: (message) => {
    successMessage.value = message
  },
  clearMessages: () => {
    errors.value = {}
    errorMessage.value = ''
    successMessage.value = ''
  }
})
</script>
