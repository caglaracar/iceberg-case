<template>
  <div class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
    <div class="flex items-center">
      <h3 class="text-sm font-semibold text-blue-800">{{ t('auth.demoCredentials') }}</h3>
    </div>
    <div class="text-xs text-blue-700 space-y-1 mb-3">
      <p><strong>{{ t('auth.email') }}:</strong> <code class="bg-blue-100 px-1 rounded text-blue-800">admin@iceberg.com</code></p>
      <p><strong>{{ t('auth.password') }}:</strong> <code class="bg-blue-100 px-1 rounded text-blue-800">admin123</code></p>
    </div>
    <p class="text-xs text-blue-600 mb-3">{{ t('auth.demoLoginInfo') }}</p>
    <a-button
      type="primary"
      block
      size="small"
      class="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 font-medium"
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
