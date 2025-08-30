<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Agents</h1>
    </div>
    
    <AgentsList />
  </div>
</template>

<script setup>
import AgentsList from '@/components/agents/AgentsList.vue'
</script>
