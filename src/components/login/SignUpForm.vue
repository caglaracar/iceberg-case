<template>
  <div class="sign-up-form">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
      <p class="text-gray-600">Create your account to get started with our platform.</p>
    </div>

    <form @submit.prevent="handleSignUp" class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <a-input
            v-model:value="form.firstName"
            placeholder="First Name"
            size="large"
            :status="errors.firstName ? 'error' : ''"
            class="rounded-lg"
          />
          <div v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <a-input
            v-model:value="form.lastName"
            placeholder="Last Name"
            size="large"
            :status="errors.lastName ? 'error' : ''"
            class="rounded-lg"
          />
          <div v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <a-input
          v-model:value="form.email"
          type="email"
          placeholder="Email Address"
          size="large"
          :status="errors.email ? 'error' : ''"
          class="rounded-lg"
        />
        <div v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <a-input-password
          v-model:value="form.password"
          placeholder="Create Password"
          size="large"
          :status="errors.password ? 'error' : ''"
          class="rounded-lg"
        />
        <div v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
        <a-input-password
          v-model:value="form.confirmPassword"
          placeholder="Confirm Password"
          size="large"
          :status="errors.confirmPassword ? 'error' : ''"
          class="rounded-lg"
        />
        <div v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</div>
      </div>

      <div>
        <a-checkbox v-model:checked="form.agreeToTerms" class="text-sm">
          I agree to the 
          <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms of Service</a> 
          and 
          <a href="#" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
        </a-checkbox>
        <div v-if="errors.agreeToTerms" class="text-red-500 text-sm mt-1">{{ errors.agreeToTerms }}</div>
      </div>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        block
        :loading="isLoading"
        class="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 rounded-lg font-medium h-12"
        @click="handleSignUp"
      >
        Create Account
      </a-button>
    </form>

    <div class="mt-6 text-center">
      <span class="text-gray-600">Already have an account? </span>
      <a 
        href="#" 
        @click.prevent="$emit('switch-to-signin')"
        class="text-indigo-600 hover:text-indigo-500 font-medium"
      >
        Sign In
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

const emit = defineEmits(['sign-up', 'switch-to-signin'])

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const errors = ref({})
const errorMessage = ref('')

const validateForm = () => {
  const newErrors = {}

  if (!form.value.firstName) {
    newErrors.firstName = 'First name is required'
  }

  if (!form.value.lastName) {
    newErrors.lastName = 'Last name is required'
  }

  if (!form.value.email) {
    newErrors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  if (!form.value.password) {
    newErrors.password = 'Password is required'
  } else if (form.value.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters'
  }

  if (!form.value.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password'
  } else if (form.value.password !== form.value.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match'
  }

  if (!form.value.agreeToTerms) {
    newErrors.agreeToTerms = 'You must agree to the terms and conditions'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSignUp = () => {
  if (!validateForm()) {
    return
  }

  emit('sign-up', form.value)
}

// Expose methods for parent component
defineExpose({
  setError: (message) => {
    errorMessage.value = message
  },
  clearErrors: () => {
    errors.value = {}
    errorMessage.value = ''
  }
})
</script>
