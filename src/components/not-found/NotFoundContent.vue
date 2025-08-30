<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <p class="text-xl text-gray-600 mb-8">Aradığınız sayfa mevcut değil.</p>
    
    <a-button 
      type="primary" 
      size="large"
      @click="$emit('go-home')"
      class="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 px-8 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
    >
      Ana Sayfaya Dön
    </a-button>
    
    <div class="mt-8 text-sm text-gray-500">
      <p>Yardıma mı ihtiyacınız var? <a href="#" class="text-blue-500 hover:text-blue-600">İletişime geçin</a></p>
    </div>
  </div>
</template>

<script setup>
defineEmits(['go-home'])
</script>
