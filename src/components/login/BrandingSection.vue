<template>
  <div class="branding-section h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 flex flex-col justify-center items-center text-white p-12">
    <!-- Logo -->
    <div class="mb-8">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <span class="text-xl font-bold">I</span>
        </div>
        <span class="text-xl font-semibold">iceberg</span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="text-center max-w-md">
      <h1 class="text-4xl font-bold mb-6">{{ t('branding.title') }}</h1>
      
      <p class="text-lg mb-8 text-indigo-100 leading-relaxed">
        {{ t('branding.description') }}
      </p>

      <!-- Stats -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <div class="flex -space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full border-2 border-white"></div>
          <div class="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-white"></div>
          <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full border-2 border-white"></div>
          <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full border-2 border-white"></div>
        </div>
        <div class="ml-4 text-left">
          <p class="text-sm text-indigo-100">{{ t('branding.businessesPrefer', { count: '2000' }) }}</p>
        </div>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute top-10 right-10 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>
    <div class="absolute bottom-10 left-10 w-24 h-24 bg-white bg-opacity-5 rounded-full"></div>
    <div class="absolute top-1/3 left-5 w-16 h-16 bg-white bg-opacity-5 rounded-full"></div>
  </div>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n'

// i18n
const { t } = useI18n()
</script>

<style scoped>
.branding-section {
  position: relative;
  overflow: hidden;
}
</style>
