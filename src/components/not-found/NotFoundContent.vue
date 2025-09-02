<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-6xl font-bold text-gray-800 mb-4">{{ t('notFound.title') }}</h1>
    <p class="text-xl text-gray-600 mb-8">{{ t('notFound.message') }}</p>
    
    <a-button 
      type="primary" 
      size="large"
      @click="$emit('go-home')"
      class="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 px-8 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {{ t('notFound.goHome') }}
    </a-button>
    
    <div class="mt-8 text-sm text-gray-500">
      <p>{{ t('notFound.needHelp') }} <a href="#" class="text-blue-500 hover:text-blue-600">{{ t('notFound.contact') }}</a></p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

defineEmits(['go-home'])
</script>
