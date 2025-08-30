<template>
  <div class="otp-verification-form">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Enter Verification Code</h1>
      <p class="text-gray-600">We've sent a 6-digit verification code to <strong>{{ email }}</strong></p>
    </div>

    <a-form @finish="handleOTPVerification" layout="vertical" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-4">Verification Code</label>
        <div class="flex gap-3 justify-center">
          <a-input
            v-for="(digit, index) in otpDigits"
            :key="index"
            v-model:value="otpDigits[index]"
            :ref="el => setInputRef(el, index)"
            @input="handleInput(index)"
            @keydown="handleKeydown($event, index)"
            maxlength="1"
            size="large"
            class="w-12 h-12 text-center text-xl font-bold rounded-lg"
            :status="errors.otp ? 'error' : ''"
          />
        </div>
        <div v-if="errors.otp" class="text-red-500 text-sm mt-2 text-center">{{ errors.otp }}</div>
      </div>

      <div class="text-center">
        <p class="text-gray-600 mb-2">Didn't receive the code?</p>
        <a-button 
          type="link" 
          @click="handleResendCode"
          :disabled="countdown > 0"
          class="text-indigo-600 hover:text-indigo-500 font-medium p-0"
        >
          {{ countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code' }}
        </a-button>
      </div>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        block
        :loading="isLoading"
        class="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 rounded-lg font-medium h-12"
      >
        Verify Code
      </a-button>
    </a-form>

    <div class="mt-6 text-center">
      <a 
        href="#" 
        @click.prevent="$emit('back-to-forgot-password')"
        class="text-indigo-600 hover:text-indigo-500 font-medium"
      >
        ← Back to Email Entry
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
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  email: {
    type: String,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['verify-otp', 'resend-code', 'back-to-forgot-password'])

const otpDigits = reactive(['', '', '', '', '', ''])
const inputRefs = ref([])
const errors = ref({})
const errorMessage = ref('')
const countdown = ref(0)
let countdownTimer = null

const setInputRef = (el, index) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

const handleInput = (index) => {
  const value = otpDigits[index]
  
  // Only allow numbers
  if (value && !/^\d$/.test(value)) {
    otpDigits[index] = ''
    return
  }

  // Move to next input if current is filled
  if (value && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }

  // Clear errors when user starts typing
  if (errors.value.otp) {
    errors.value = {}
  }
}

const handleKeydown = (event, index) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
  
  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
}

const validateOTP = () => {
  const otp = otpDigits.join('')
  const newErrors = {}

  if (otp.length !== 6) {
    newErrors.otp = 'Please enter all 6 digits'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleOTPVerification = () => {
  if (!validateOTP()) {
    return
  }

  const otp = otpDigits.join('')
  emit('verify-otp', otp)
}

const handleResendCode = () => {
  if (countdown.value > 0) return
  
  emit('resend-code')
  startCountdown()
}

const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
    }
  }, 1000)
}

onMounted(() => {
  // Focus first input
  inputRefs.value[0]?.focus()
  // Start initial countdown
  startCountdown()
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})

// Expose methods for parent component
defineExpose({
  setError: (message) => {
    errorMessage.value = message
  },
  clearErrors: () => {
    errors.value = {}
    errorMessage.value = ''
  },
  resetForm: () => {
    otpDigits.splice(0, 6, '', '', '', '', '', '')
    inputRefs.value[0]?.focus()
  }
})
</script>
