<template>
  <div class="sign-in-form">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
      <p class="text-gray-600">You can sign in with your registered e-mail and password.</p>
    </div>

    <form @submit.prevent="handleSignIn" class="space-y-6">
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
          placeholder="Password"
          size="large"
          :status="errors.password ? 'error' : ''"
          class="rounded-lg"
        />
        <div v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</div>
      </div>

      <div class="flex items-center justify-between">
        <a-checkbox v-model:checked="form.keepSignedIn" class="text-sm">
          Keep Me Signed In
        </a-checkbox>
        <a 
          href="#" 
          @click.prevent="$emit('forgot-password')"
          class="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Forgot Password?
        </a>
      </div>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        block
        :loading="isLoading"
        class="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 rounded-lg font-medium h-12"
        @click="handleSignIn"
      >
        Sign In
      </a-button>
    </form>

    <div class="mt-6 text-center">
      <span class="text-gray-500">or</span>
    </div>

    <div class="mt-6 text-center">
      <span class="text-gray-600">Don't have an account? </span>
      <a 
        href="#" 
        @click.prevent="$emit('switch-to-signup')"
        class="text-indigo-600 hover:text-indigo-500 font-medium"
      >
        Sign Up Now
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

const emit = defineEmits(['sign-in', 'forgot-password', 'switch-to-signup'])

const form = ref({
  email: '',
  password: '',
  keepSignedIn: false
})

const errors = ref({})
const errorMessage = ref('')

const validateForm = () => {
  const newErrors = {}

  if (!form.value.email) {
    newErrors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  if (!form.value.password) {
    newErrors.password = 'Password is required'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSignIn = () => {
  if (!validateForm()) {
    return
  }

  emit('sign-in', form.value)
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
