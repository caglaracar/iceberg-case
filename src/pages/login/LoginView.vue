<template>
  <div class="login-view min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-gray-100">
    <div class="max-w-md w-full mx-4">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p class="text-gray-600">Sign in to access your appointment dashboard</p>
        </div>

        <!-- Login Form -->
        <LoginForm 
          :form="form"
          :errors="errors"
          :is-loading="isLoading"
          @submit="handleLogin"
        />

        <!-- Demo credentials -->
        <DemoCredentials @use-demo="fillDemoCredentials" />

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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/login/LoginForm.vue'
import DemoCredentials from '@/components/login/DemoCredentials.vue'

const router = useRouter()

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref({})
const isLoading = ref(false)
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
  } else if (form.value.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check demo credentials
    if (form.value.email === 'admin@iceberg.com' && form.value.password === 'password123') {
      console.log('Login successful, redirecting to appointments...')
      await router.push('/appointments')
      console.log('Redirect completed')
    } else {
      errorMessage.value = 'Invalid email or password. Please use demo credentials.'
    }
  } catch (error) {
    errorMessage.value = 'Login failed. Please try again.'
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}

const fillDemoCredentials = () => {
  form.value.email = 'admin@iceberg.com'
  form.value.password = 'password123'
  errors.value = {}
  errorMessage.value = ''
}
</script>

<style scoped>
/* Custom login styles */
</style>
