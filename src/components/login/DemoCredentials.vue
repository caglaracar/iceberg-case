<template>
  <div class="mt-6 p-4 bg-gray-50 rounded-lg">
    <h3 class="text-sm font-medium text-gray-700 mb-2">Demo Credentials</h3>
    <div class="text-xs text-gray-600 space-y-1">
      <p><strong>Email:</strong> admin@iceberg.com</p>
      <p><strong>Password:</strong> password123</p>
    </div>
    <a-button
      block
      size="small"
      class="mt-3"
      @click="$emit('use-demo')"
    >
      Use Demo Login
    </a-button>
  </div>
</template>

<script setup>
defineEmits(['use-demo'])
</script>
