<template>
  <div class="mt-6 p-4 bg-gray-50 rounded-lg">
    <h3 class="text-sm font-medium text-gray-700 mb-2">{{ t('auth.demoCredentials') }}</h3>
    <div class="text-xs text-gray-600 space-y-1">
      <p><strong>{{ t('auth.email') }}:</strong> admin@iceberg.com</p>
      <p><strong>{{ t('auth.password') }}:</strong> password123</p>
    </div>
    <a-button
      block
      size="small"
      class="mt-3"
      @click="$emit('use-demo')"
    >
      {{ t('auth.useDemoLogin') }}
    </a-button>
  </div>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n'

// i18n
const { t } = useI18n()

defineEmits(['use-demo'])
</script>
