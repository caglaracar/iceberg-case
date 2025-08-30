<template>
  <a-layout class="min-h-screen">
    <AppSidebar />
    <a-layout>
      <AppHeader />
      <a-layout-content class="bg-gray-50">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
</script>
