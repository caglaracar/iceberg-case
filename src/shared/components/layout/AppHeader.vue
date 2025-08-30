<template>
  <a-layout-header class="bg-slate-800 shadow-lg px-4 md:px-6 flex items-center justify-between border-b border-slate-700">
    <div class="flex items-center gap-2 md:gap-4">
      <a-breadcrumb class="hidden md:block">
        <a-breadcrumb-item>
          <home-outlined class="text-slate-400" />
          <span class="ml-1 text-slate-300">Home</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item v-if="currentPageName">
          <span class="text-white font-semibold">{{ currentPageName }}</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h2 class="md:hidden font-semibold text-white">{{ currentPageName }}</h2>
    </div>
    
    <div class="flex items-center gap-2 md:gap-4">
      <!-- Search -->
      <a-input-search
        placeholder="Search..."
        @search="onSearch"
        class="hidden sm:block w-48 md:w-72"
      >
        <template #prefix>
          <search-outlined />
        </template>
      </a-input-search>
      
      <!-- Mobile Search -->
      <a-button type="text" shape="circle" class="sm:hidden text-slate-300 hover:bg-slate-700">
        <template #icon>
          <search-outlined class="text-slate-300" />
        </template>
      </a-button>
      
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
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const currentPageName = computed(() => {
  const path = route.path
  if (path.includes('/appointments')) return 'Appointments'
  if (path.includes('/customers')) return 'Customers'
  if (path.includes('/agents')) return 'Agents'
  if (path.includes('/reports')) return 'Reports'
  return 'Dashboard'
})

const navigateTo = (path) => {
  router.push(path)
}

const onSearch = (value) => {
  console.log('Search:', value)
}

const logout = () => {
  router.push('/login')
}
</script>

<style scoped>
:deep(.ant-layout-header) {
  height: 64px;
  line-height: 64px;
  padding: 0 24px;
}

:deep(.ant-breadcrumb) {
  color: #cbd5e1;
}

:deep(.ant-breadcrumb-link) {
  color: #cbd5e1;
}

:deep(.ant-breadcrumb .ant-breadcrumb-link:hover) {
  color: #a78bfa;
}

:deep(.ant-breadcrumb .anticon) {
  color: #94a3b8;
}

:deep(.ant-input-search) {
  border-radius: 8px;
}

:deep(.ant-input-search .ant-input) {
  border-color: #475569;
  background-color: #334155;
  color: #f1f5f9;
}

:deep(.ant-input-search .ant-input:focus) {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

:deep(.ant-input-search .ant-input::placeholder) {
  color: #94a3b8;
}

:deep(.ant-input-search .ant-btn) {
  border-color: #475569;
  background-color: #334155;
  color: #cbd5e1;
}

:deep(.ant-input-search .anticon) {
  color: #94a3b8;
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
