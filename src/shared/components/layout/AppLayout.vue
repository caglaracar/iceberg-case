<template>
  <a-layout class="min-h-screen">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content Area -->
    <a-layout>
      <!-- Header -->
      <AppHeader />

      <!-- Content -->
      <a-layout-content class="bg-gray-50 overflow-auto">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
</script>

<style scoped>
:deep(.ant-layout-content) {
  overflow: auto;
}
</style>
