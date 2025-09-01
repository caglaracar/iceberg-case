<template>
  <a-layout-header class="bg-slate-800 shadow-lg px-4 md:px-6 flex items-center justify-between border-b border-slate-700">
    <div class="flex items-center gap-4 relative">
      <!-- Search -->
      <div class="relative">
        <a-input
          v-model:value="searchTerm"
          placeholder="Search agents..."
          @input="handleSearchInput"
          @focus="isSearchOpen = true"
          @blur="handleSearchBlur"
          class="w-64 md:w-80"
        >
          <template #suffix>
            <search-outlined class="text-gray-400" />
          </template>
        </a-input>
        
        <!-- Search Results Dropdown -->
        <div 
          v-if="isSearchOpen && filteredAgents.length > 0"
          class="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 max-h-64 overflow-y-auto"
        >
          <div
            v-for="agent in filteredAgents"
            :key="agent.id"
            @click="() => selectAgent(agent.id)"
            @mousedown.prevent
            class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer border-gray-100 last:border-b-0"
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
    
    <div class="flex items-center gap-2 md:gap-4">
      
      <!-- User Menu -->
      <a-dropdown>
        <a-button type="text" class="flex items-center gap-2 hover:bg-slate-700 px-3 py-1 rounded-lg transition-colors">
          <a-avatar size="small" style="background-color: #6366f1">
            <template #icon>
              <user-outlined />
            </template>
          </a-avatar>
          <span class="hidden md:inline text-white font-medium">Admin User</span>
          <down-outlined class="hidden md:inline text-slate-300" />
        </a-button>
        <template #overlay>
          <a-menu class="dark-menu">
            <a-menu-item @click="navigateTo('/profile')">
              <user-outlined />
              <span class="ml-2">Profile</span>
            </a-menu-item>
            <a-menu-item @click="navigateTo('/settings')">
              <setting-outlined />
              <span class="ml-2">Settings</span>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="logout">
              <logout-outlined />
              <span class="ml-2">Logout</span>
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
import { useGlobalSearchStore } from '@/stores/globalSearch'
import {
  SearchOutlined,
  UserOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// Global search store
const globalSearchStore = useGlobalSearchStore()
const { searchTerm, isSearchOpen, filteredAgents } = storeToRefs(globalSearchStore)

const navigateTo = (path) => {
  router.push(path)
}

const handleSearchInput = (e) => {
  globalSearchStore.setSearchTerm(e.target.value)
}

const selectAgent = (agentId) => {
  globalSearchStore.selectAgent(agentId)
}

const handleSearchBlur = () => {
  // Delay hiding to allow click on dropdown item
  setTimeout(() => {
    globalSearchStore.clearSearch()
  }, 200)
}

const logout = () => {
  router.push('/login')
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
