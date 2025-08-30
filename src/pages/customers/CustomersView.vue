<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Customers</h1>
    </div>
    
    <CustomersList />
  </div>
</template>

<script setup>
import CustomersList from '@/components/customers/CustomersList.vue'
</script>
