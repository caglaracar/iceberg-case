<template>
  <div v-if="isMobile">
    <!-- Mobile Drawer Overlay -->
    <div 
      v-if="!collapsed" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="collapsed = true"
    ></div>
    
    <!-- Mobile Drawer -->
    <div 
      :class="[
        'fixed top-0 left-0 h-full w-64 bg-slate-800 shadow-xl border-r border-slate-700 z-50 transform transition-transform duration-300 ease-in-out',
        collapsed ? '-translate-x-full' : 'translate-x-0'
      ]"
    >
      <div class="flex items-center justify-between h-16 border-b border-slate-700 bg-slate-900 px-4">
        <h1 class="text-white font-bold text-lg">
          <span class="text-indigo-400">Ice</span>berg CRM
        </h1>
        <button 
          @click="collapsed = true"
          class="text-gray-400 hover:text-white p-1 rounded"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <a-menu
        mode="inline"
        :selected-keys="selectedKeys"
        theme="dark"
        class="h-full border-r-0 bg-slate-800"
      >
        <a-menu-item key="home" @click="navigateToMobile('/home')" class="menu-item">
          <template #icon>
            <home-outlined />
          </template>
          <span>Dashboard</span>
        </a-menu-item>
        
        <a-menu-item key="appointments" @click="navigateToMobile('/appointments')" class="menu-item">
          <template #icon>
            <calendar-outlined />
          </template>
          <span>Appointments</span>
        </a-menu-item>
        
        <a-menu-item key="not-found" @click="navigateToMobile('/not-found')" class="menu-item">
          <template #icon>
            <team-outlined />
          </template>
          <span>Not Found</span>
        </a-menu-item>
      </a-menu>
    </div>
  </div>
  
  <!-- Desktop Sidebar -->
  <a-layout-sider
    v-else
    v-model:collapsed="collapsed"
    collapsible
    :width="240"
    :collapsed-width="80"
    theme="dark"
    class="shadow-xl border-r border-slate-700"
    :breakpoint="'lg'"
    @breakpoint="onBreakpoint"
  >
    <div class="flex items-center justify-center h-16 border-b border-slate-700 bg-slate-900">
      <h1 class="text-white font-bold text-lg" v-if="!collapsed">
        <span class="text-indigo-400">Ice</span>berg CRM
      </h1>
      <h1 class="text-indigo-400 font-bold text-xl" v-else>
        IC
      </h1>
    </div>
    
    <a-menu
      mode="inline"
      :selected-keys="selectedKeys"
      theme="dark"
      class="h-full border-r-0 bg-slate-800"
    >
      <a-menu-item key="home" @click="navigateTo('/home')" class="menu-item">
        <template #icon>
          <home-outlined />
        </template>
        <span>{{ t('navigation.dashboard') }}</span>
      </a-menu-item>
      
      <a-menu-item key="appointments" @click="navigateTo('/appointments')" class="menu-item">
        <template #icon>
          <calendar-outlined />
        </template>
        <span>{{ t('navigation.appointments') }}</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import {
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  HomeOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// i18n
const { t } = useI18n()

const collapsed = ref(false)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

// Mobile detection
const isMobile = computed(() => windowWidth.value < 768)

// Update window width on resize
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
  // Auto-collapse on mobile initially
  if (isMobile.value) {
    collapsed.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

const selectedKeys = computed(() => {
  const path = route.path
  if (path.includes('/home') || path === '/') return ['home']
  if (path.includes('/appointments')) return ['appointments']
  if (path.includes('/not-found')) return ['not-found']
  if (path.includes('/contacts')) return ['contacts']
  if (path.includes('/agents')) return ['agents']
  if (path.includes('/reports')) return ['reports']
  return ['home']
})

const navigateTo = (path) => {
  router.push(path)
}

const navigateToMobile = (path) => {
  router.push(path)
  // Close mobile drawer after navigation
  collapsed.value = true
}

const onBreakpoint = (broken) => {
  collapsed.value = broken
}

// Expose toggle method for header
const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

defineExpose({
  toggleSidebar
})
</script>

<style scoped>
:deep(.ant-layout-sider-trigger) {
  background: #475569;
  color: #cbd5e1;
  border-top: 1px solid #64748b;
  transition: all 0.2s;
}

:deep(.ant-layout-sider-trigger:hover) {
  background: #334155;
  color: white;
}

:deep(.ant-menu-dark) {
  background: #334155;
}

:deep(.ant-menu-item) {
  border-radius: 8px;
  margin: 6px 12px;
  padding: 12px 16px;
  transition: all 0.2s;
  height: auto;
}

:deep(.ant-menu-item:hover) {
  background-color: #475569 !important;
  color: white;
}

:deep(.ant-menu-item-selected) {
  background-color: #4f46e5 !important;
  color: white !important;
  font-weight: 600;
  border-radius: 8px;
}

:deep(.ant-menu-item-selected .anticon) {
  color: white;
}

:deep(.ant-menu-item .anticon) {
  font-size: 16px;
  color: #94a3b8;
}

:deep(.ant-menu-item-selected .anticon) {
  color: white;
}

:deep(.ant-menu-item span) {
  font-weight: 500;
}

:deep(.ant-menu-item-selected span) {
  font-weight: 600;
  color: white;
}
</style>
