<template>
  <a-layout-header class="bg-slate-800 shadow-lg px-4 md:px-6 flex items-center justify-between border-b border-slate-700">
    <div class="flex items-center gap-4">
      <!-- Search -->
      <a-input-search
        placeholder="Search patients..."
        @search="onSearch"
        class="w-64 md:w-80"
      />
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
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  SearchOutlined,
  UserOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()


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
