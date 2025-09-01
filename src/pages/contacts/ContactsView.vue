<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Contacts</h1>
    </div>
    
    <ContactsList />
  </div>
</template>

<script setup>
import ContactsList from '@/components/contacts/ContactsList.vue'
</script>
