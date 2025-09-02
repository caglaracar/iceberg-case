<template>
  <div class="login-view min-h-screen flex">
    <!-- Left Side - Forms -->
    <div class="flex-1 flex items-center justify-center bg-gray-50 p-2">
      <div class="w-full max-w-md">
        <!-- Language Switcher -->
        <div class="mb-2">
          <LanguageSwitcher variant="light" />
        </div>

        <!-- Dynamic Form Content -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <!-- Sign In Form -->
          <SignInForm
            v-if="currentView === 'signin'"
            ref="signInFormRef"
            :is-loading="isLoading"
            @sign-in="handleSignIn"
            @forgot-password="switchView('forgot-password')"
            @switch-to-signup="switchView('signup')"
          />

          <!-- Sign Up Form -->
          <SignUpForm
            v-else-if="currentView === 'signup'"
            ref="signUpFormRef"
            :is-loading="isLoading"
            @sign-up="handleSignUp"
            @switch-to-signin="switchView('signin')"
          />

          <!-- Forgot Password Form -->
          <ForgotPasswordForm
            v-else-if="currentView === 'forgot-password'"
            ref="forgotPasswordFormRef"
            :is-loading="isLoading"
            @forgot-password="handleForgotPassword"
            @back-to-signin="switchView('signin')"
          />

          <!-- OTP Verification Form -->
          <OTPVerificationForm
            v-else-if="currentView === 'otp'"
            ref="otpFormRef"
            :email="forgotPasswordEmail"
            :is-loading="isLoading"
            @verify-otp="handleOTPVerification"
            @resend-code="handleResendCode"
            @back-to-forgot-password="switchView('forgot-password')"
          />
        </div>
      </div>
    </div>

    <!-- Right Side - Branding -->
    <div class="flex-1 hidden lg:block">
      <BrandingSection />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import SignInForm from '@/components/login/SignInForm.vue'
import SignUpForm from '@/components/login/SignUpForm.vue'
import ForgotPasswordForm from '@/components/login/ForgotPasswordForm.vue'
import OTPVerificationForm from '@/components/login/OTPVerificationForm.vue'
import BrandingSection from '@/components/login/BrandingSection.vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

const router = useRouter()
const { login, isLoggedIn } = useAuth()

// Redirect if already logged in
onMounted(() => {
  if (isLoggedIn.value) {
    router.push('/')
  }
})

// Component refs
const signInFormRef = ref(null)
const signUpFormRef = ref(null)
const forgotPasswordFormRef = ref(null)
const otpFormRef = ref(null)

// State management
const currentView = ref('signin') // 'signin', 'signup', 'forgot-password', 'otp'
const isLoading = ref(false)
const forgotPasswordEmail = ref('')

// View switching
const switchView = (view) => {
  currentView.value = view
  // Clear any existing errors when switching views
  clearAllErrors()
}

const clearAllErrors = () => {
  signInFormRef.value?.clearErrors()
  signUpFormRef.value?.clearErrors()
  forgotPasswordFormRef.value?.clearMessages()
  otpFormRef.value?.clearErrors()
}

// Sign In Handler
const handleSignIn = async (formData) => {
  isLoading.value = true

  try {
    const result = await login(formData.email, formData.password)
    
    if (!result.success) {
      signInFormRef.value?.setError(result.message || 'Invalid email or password. Use admin@iceberg.com / admin123 for demo.')
    }
    // Success handling is done in useAuth (redirects to home)
  } catch (error) {
    signInFormRef.value?.setError('Login failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Sign Up Handler
const handleSignUp = async (formData) => {
  isLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock successful registration
    // Registration successful
    
    // Switch to sign in view with success message
    switchView('signin')
    
    // You could show a success message here
    setTimeout(() => {
      signInFormRef.value?.setError('Registration successful! Please sign in with your credentials.')
    }, 100)
    
  } catch (error) {
    signUpFormRef.value?.setError('Registration failed. Please try again.')
    // Error handled by UI
  } finally {
    isLoading.value = false
  }
}

// Forgot Password Handler
const handleForgotPassword = async (formData) => {
  isLoading.value = true

  try {
    // Forgot password initiated
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Store email for OTP verification
    forgotPasswordEmail.value = formData.email
    
    // Mock successful code sending
    forgotPasswordFormRef.value?.setSuccess(`Verification code sent to ${formData.email}`)
    
    // Switching to OTP view
    
    // Switch to OTP view after a short delay
    setTimeout(() => {
      switchView('otp')
      // Switched to OTP view
    }, 2000)
    
  } catch (error) {
    forgotPasswordFormRef.value?.setError('Failed to send verification code. Please try again.')
    // Error handled by UI
  } finally {
    isLoading.value = false
  }
}

// OTP Verification Handler
const handleOTPVerification = async (otp) => {
  isLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock OTP validation (accept '123456' as valid)
    if (otp === '123456') {
      // OTP verified successfully
      // In a real app, you would redirect to password reset or auto-login
      await router.push('/home')
    } else {
      otpFormRef.value?.setError('Invalid verification code. Please try again. (Use: 123456)')
    }
    
  } catch (error) {
    otpFormRef.value?.setError('Verification failed. Please try again.')
    // Error handled by UI
  } finally {
    isLoading.value = false
  }
}

// Resend Code Handler
const handleResendCode = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Verification code resent
    // The OTP component handles the countdown automatically
    
  } catch (error) {
    otpFormRef.value?.setError('Failed to resend code. Please try again.')
    // Error handled by UI
  }
}
</script>

<style scoped>
/* Custom login styles */
</style>
