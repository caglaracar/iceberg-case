<template>
  <div class="sign-up-form">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ t('auth.signUp') }}</h1>
      <p class="text-gray-600">{{ t('auth.createAccountDesc') }}</p>
    </div>

    <form @submit.prevent="handleSignUp" class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('auth.firstName') }}</label>
          <a-input
            v-model:value="form.firstName"
            :placeholder="t('auth.firstName')"
            size="large"
            :status="errors.firstName ? 'error' : ''"
            class="rounded-lg"
          />
          <div v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('auth.lastName') }}</label>
          <a-input
            v-model:value="form.lastName"
            :placeholder="t('auth.lastName')"
            size="large"
            :status="errors.lastName ? 'error' : ''"
            class="rounded-lg"
          />
          <div v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</div>
        </div>
      </div>

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

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('auth.password') }}</label>
        <a-input-password
          v-model:value="form.password"
          :placeholder="t('auth.createPassword')"
          size="large"
          :status="errors.password ? 'error' : ''"
          class="rounded-lg"
        />
        <div v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('auth.confirmPassword') }}</label>
        <a-input-password
          v-model:value="form.confirmPassword"
          :placeholder="t('auth.confirmPassword')"
          size="large"
          :status="errors.confirmPassword ? 'error' : ''"
          class="rounded-lg"
        />
        <div v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</div>
      </div>

      <div>
        <a-checkbox v-model:checked="form.agreeToTerms" class="text-sm">
          {{ t('auth.iAgreeToThe') }}
          <a href="#" class="text-indigo-600 hover:text-indigo-500">{{ t('auth.termsOfService') }}</a> 
          {{ t('auth.and') }}
          <a href="#" class="text-indigo-600 hover:text-indigo-500">{{ t('auth.privacyPolicy') }}</a>
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
        {{ t('auth.createAccount') }}
      </a-button>
    </form>

    <div class="mt-6 text-center">
      <span class="text-gray-600">{{ t('auth.alreadyHaveAccount') }} </span>
      <a 
        href="#" 
        @click.prevent="$emit('switch-to-signin')"
        class="text-indigo-600 hover:text-indigo-500 font-medium"
      >
        {{ t('auth.signIn') }}
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
import { useI18n } from '@/composables/useI18n'

// i18n
const { t } = useI18n()

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
    newErrors.firstName = t('validation.firstNameRequired')
  }

  if (!form.value.lastName) {
    newErrors.lastName = t('validation.lastNameRequired')
  }

  if (!form.value.email) {
    newErrors.email = t('validation.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    newErrors.email = t('validation.invalidEmail')
  }

  if (!form.value.password) {
    newErrors.password = t('validation.passwordRequired')
  } else if (form.value.password.length < 8) {
    newErrors.password = t('validation.passwordMinLength')
  }

  if (!form.value.confirmPassword) {
    newErrors.confirmPassword = t('validation.confirmPasswordRequired')
  } else if (form.value.password !== form.value.confirmPassword) {
    newErrors.confirmPassword = t('validation.passwordsDoNotMatch')
  }

  if (!form.value.agreeToTerms) {
    newErrors.agreeToTerms = t('validation.mustAgreeToTerms')
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
