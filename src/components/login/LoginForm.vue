<template>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('auth.username') }}</label>
      <a-input
        v-model:value="form.email"
        type="email"
        :placeholder="t('auth.username')"
        size="large"
        :status="errors.email ? 'error' : ''"
      />
      <div v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('auth.password') }}</label>
      <a-input-password
        v-model:value="form.password"
        :placeholder="t('auth.password')"
        size="large"
        :status="errors.password ? 'error' : ''"
      />
      <div v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</div>
    </div>

    <div class="flex items-center justify-between mb-4">
      <a-checkbox v-model:checked="form.rememberMe">
        {{ t('auth.rememberMe') }}
      </a-checkbox>
      <a href="#" class="text-sm text-pink-600 hover:text-pink-500">
        {{ t('auth.forgotPassword') }}
      </a>
    </div>

    <a-button
      type="primary"
      html-type="submit"
      size="large"
      block
      :loading="isLoading"
      class="bg-pink-600 hover:bg-pink-700 border-pink-600 hover:border-pink-700"
      @click="handleLogin"
    >
      {{ t('auth.login') }}
    </a-button>
  </form>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n'

const props = defineProps({
  form: Object,
  errors: Object,
  isLoading: Boolean
})

const emit = defineEmits(['submit'])

// i18n
const { t } = useI18n()

const handleLogin = () => {
  emit('submit')
}
</script>
