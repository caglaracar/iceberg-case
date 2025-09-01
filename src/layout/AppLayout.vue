<template>
  <a-layout class="min-h-screen">
    <AppSidebar ref="sidebarRef" />
    <a-layout>
      <AppHeader :sidebar-ref="sidebarRef" />
      <a-layout-content class="bg-gray-50">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const sidebarRef = ref(null)
</script>
