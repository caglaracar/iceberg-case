<template>
  <a-layout class="min-h-screen">
    <!-- Sidebar -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      :width="240"
      :collapsed-width="80"
      theme="light"
      class="shadow-lg"
      :breakpoint="'lg'"
      @breakpoint="onBreakpoint"
    >
      <div class="flex items-center justify-center h-16 border-b bg-gradient-to-r from-pink-500 to-pink-600">
        <h1 class="text-white font-bold text-lg" v-if="!collapsed">
          Iceberg CRM
        </h1>
        <h1 class="text-white font-bold text-xl" v-else>
          IC
        </h1>
      </div>
      
      <a-menu
        mode="inline"
        :selected-keys="selectedKeys"
        class="h-full border-r-0"
      >
        <a-menu-item key="appointments" @click="navigateTo('/appointments')">
          <template #icon>
            <calendar-outlined />
          </template>
          <span>Appointments</span>
        </a-menu-item>
        
        <a-menu-item key="customers" @click="navigateTo('/customers')">
          <template #icon>
            <user-outlined />
          </template>
          <span>Customers</span>
        </a-menu-item>
        
        <a-menu-item key="agents" @click="navigateTo('/agents')">
          <template #icon>
            <team-outlined />
          </template>
          <span>Agents</span>
        </a-menu-item>
        
        <a-menu-item key="reports" @click="navigateTo('/reports')">
          <template #icon>
            <bar-chart-outlined />
          </template>
          <span>Reports</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- Main Content Area -->
    <a-layout>
      <!-- Header -->
      <a-layout-header class="bg-white shadow-sm px-4 md:px-6 flex items-center justify-between">
        <div class="flex items-center gap-2 md:gap-4">
          <a-breadcrumb class="hidden md:block">
            <a-breadcrumb-item>
              <home-outlined />
              <span class="ml-1">Home</span>
            </a-breadcrumb-item>
            <a-breadcrumb-item v-if="currentPageName">
              {{ currentPageName }}
            </a-breadcrumb-item>
          </a-breadcrumb>
          <h2 class="md:hidden font-semibold text-gray-900">{{ currentPageName }}</h2>
        </div>
        
        <div class="flex items-center gap-2 md:gap-4">
          <!-- Search -->
          <a-input-search
            placeholder="Search..."
            :style="{ width: $screen.md ? '300px' : '200px' }"
            @search="onSearch"
            class="hidden sm:block"
          >
            <template #prefix>
              <search-outlined />
            </template>
          </a-input-search>
          
          <!-- Mobile Search -->
          <a-button type="text" shape="circle" class="sm:hidden">
            <template #icon>
              <search-outlined />
            </template>
          </a-button>
          
          <!-- Notifications -->
          <a-badge :count="3">
            <a-button type="text" shape="circle">
              <template #icon>
                <bell-outlined />
              </template>
            </a-button>
          </a-badge>
          
          <!-- User Menu -->
          <a-dropdown>
            <a-button type="text" class="flex items-center gap-2">
              <a-avatar size="small" style="background-color: #1890ff">
                <template #icon>
                  <user-outlined />
                </template>
              </a-avatar>
              <span class="hidden md:inline">Admin User</span>
              <down-outlined class="hidden md:inline" />
            </a-button>
            <template #overlay>
              <a-menu>
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

      <!-- Content -->
      <a-layout-content class="bg-gray-50 overflow-auto">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  HomeOutlined,
  SearchOutlined,
  BellOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const collapsed = ref(false)

const selectedKeys = computed(() => {
  const path = route.path
  if (path.includes('/appointments')) return ['appointments']
  if (path.includes('/customers')) return ['customers']
  if (path.includes('/agents')) return ['agents']
  if (path.includes('/reports')) return ['reports']
  return ['appointments']
})

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

const onBreakpoint = (broken) => {
  collapsed.value = broken
}

const logout = () => {
  router.push('/login')
}
</script>

<style scoped>
:deep(.ant-layout-sider-trigger) {
  background: #f0f0f0;
  color: #666;
}

:deep(.ant-menu-item-selected) {
  background-color: #e6f7ff !important;
  border-right: 3px solid #1890ff;
}

:deep(.ant-layout-header) {
  height: 64px;
  line-height: 64px;
  padding: 0 24px;
}

:deep(.ant-layout-content) {
  overflow: auto;
}
</style>
