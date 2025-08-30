<template>
  <div class="forgot-password-form">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
      <p class="text-gray-600">Enter your email address and we'll send you a verification code.</p>
    </div>

    <form @submit.prevent="handleForgotPassword" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <a-input
          v-model:value="form.email"
          type="email"
          placeholder="Enter your email address"
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
        Send Verification Code
      </a-button>
    </form>

    <div class="mt-6 text-center">
      <a 
        href="#" 
        @click.prevent="$emit('back-to-signin')"
        class="text-indigo-600 hover:text-indigo-500 font-medium"
      >
        ← Back to Sign In
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

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})


console.log("xx")
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
    newErrors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleForgotPassword = () => {
  console.log('handleForgotPassword called', form.value)
  
  if (!validateForm()) {
    console.log('Form validation failed', errors.value)
    return
  }

  console.log('Emitting forgot-password event', form.value)
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
