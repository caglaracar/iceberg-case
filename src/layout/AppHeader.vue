<template>
  <a-layout-header class="bg-slate-800 shadow-lg px-2 sm:px-4 md:px-6 flex items-center justify-between border-b border-slate-700">
    
    <!-- Mobile Menu Toggle (Only on mobile) -->
    <button 
      v-if="isMobile"
      @click="toggleSidebar"
      class="text-white p-2 rounded hover:bg-slate-700 flex-shrink-0"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>
    
    <!-- Search (Center on mobile, left on desktop) -->
    <div class="relative" :class="isMobile ? 'flex-1 mx-4' : 'flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'">
      <a-input
        v-model:value="searchTerm"
        :placeholder="isMobile ? t('common.search') : t('filters.searchAgents')"
        @input="handleSearchInput"
        @focus="isSearchOpen = true"
        @blur="handleSearchBlur"
        class="w-full"
      >
        <template #suffix>
          <search-outlined class="text-gray-400" />
        </template>
      </a-input>
      
      <!-- Search Results Dropdown -->
      <div 
        v-if="isSearchOpen"
        class="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 max-h-64 overflow-y-auto"
      >
        <div v-if="filteredAgents.length === 0" class="px-4 py-3 text-center text-gray-500 text-sm">
          {{ t('messages.noAgentsFound') }}
        </div>
        <div v-else>
          <div
            v-for="agent in filteredAgents"
            :key="agent.id"
            @click="() => selectAgent(agent.id)"
            @mousedown.prevent
            class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <a-avatar
              :style="{ backgroundColor: agent.color, color: 'white' }"
              size="small"
            >
              {{ agent.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() }}
            </a-avatar>
            <div>
              <div class="font-medium text-gray-900">{{ agent.name }}</div>
              <div class="text-sm text-gray-500">#{{ agent.number }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Language Switcher & User Menu -->
    <div class="flex items-center gap-2 md:gap-4">
      <!-- Language Switcher -->
      <LanguageSwitcher :compact="isMobile" />
      
      <!-- User Menu -->
      <a-dropdown placement="bottomRight">
        <div class="flex items-center gap-3 cursor-pointer hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors">
          <a-avatar style="background-color: #4f46e5; color: white" size="small">
            AU
          </a-avatar>
          <div v-if="!isMobile" class="text-white">
            <div class="text-sm font-medium">{{ t('auth.adminUser') }}</div>
          </div>
          <down-outlined v-if="!isMobile" class="text-gray-400 text-xs" />
        </div>
        <template #overlay>
          <a-menu class="dark-menu">
            <a-menu-item @click="logout">
              <logout-outlined />
              <span class="ml-2">{{ t('navigation.logout') }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    
  </a-layout-header>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGlobalSearchStore } from '@/stores/globalSearch.ts'
import { useAuth } from '@/composables/useAuth'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useI18n } from '@/composables/useI18n'
import {
  SearchOutlined,
  UserOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// Authentication
const { logout: authLogout, user } = useAuth()

// i18n
const { t } = useI18n()

// Mobile detection
const isMobile = computed(() => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
})

// Global search store
const globalSearchStore = useGlobalSearchStore()
const { searchTerm, isSearchOpen, filteredAgents } = storeToRefs(globalSearchStore)

// Props for sidebar communication
const props = defineProps({
  sidebarRef: {
    type: Object,
    default: null
  }
})

const navigateTo = (path) => {
  router.push(path)
}

const handleSearchInput = (e) => {
  globalSearchStore.setSearchTerm(e.target.value)
}

const handleSearchBlur = () => {
  // Use setTimeout to allow for click events on dropdown items
  setTimeout(() => {
    globalSearchStore.setSearchOpen(false)
  }, 150)
}

const selectAgent = (agentId) => {
  // Navigate to appointments with agent filter
  router.push({
    path: '/appointments',
    query: { agent: agentId }
  })
  
  // Clear search and close dropdown
  globalSearchStore.clearSearch()
}

const toggleSidebar = () => {
  if (props.sidebarRef?.toggleSidebar) {
    props.sidebarRef.toggleSidebar()
  }
}

const logout = async () => {
  await authLogout()
}

onMounted(() => {
  globalSearchStore.initializeAgents()
})
</script>

<style scoped>
:deep(.ant-layout-header) {
  height: 64px;
  line-height: 64px;
  padding: 0 24px;
}


:deep(.ant-input-search) {
  border-radius: 8px;
}

:deep(.ant-input-search .ant-input) {
  border-color: #e5e7eb !important;
  background-color: white !important;
  color: #374151 !important;
}

:deep(.ant-input-search .ant-input:focus) {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
  background-color: white !important;
}

:deep(.ant-input-search .ant-input::placeholder) {
  color: #9ca3af !important;
}

:deep(.ant-input-search .ant-btn) {
  border-color: #e5e7eb !important;
  background-color: white !important;
  color: #6b7280 !important;
}

:deep(.ant-input-search .ant-btn:hover) {
  border-color: #6366f1 !important;
  background-color: #f8fafc !important;
  color: #4f46e5 !important;
}

:deep(.ant-input-search .anticon) {
  color: #6b7280 !important;
}

:deep(.dark-menu) {
  background-color: #1e293b;
  border: 1px solid #334155;
}

:deep(.dark-menu .ant-menu-item) {
  color: #cbd5e1;
}

:deep(.dark-menu .ant-menu-item:hover) {
  background-color: #334155;
}
</style>
