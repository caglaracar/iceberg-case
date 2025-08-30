<template>
  <a-layout-sider
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
        <span>Dashboard</span>
      </a-menu-item>
      
      <a-menu-item key="appointments" @click="navigateTo('/appointments')" class="menu-item">
        <template #icon>
          <calendar-outlined />
        </template>
        <span>Appointments</span>
      </a-menu-item>
      
      <a-menu-item key="customers" @click="navigateTo('/customers')" class="menu-item">
        <template #icon>
          <user-outlined />
        </template>
        <span>Customers</span>
      </a-menu-item>
      
      <a-menu-item key="agents" @click="navigateTo('/agents')" class="menu-item">
        <template #icon>
          <team-outlined />
        </template>
        <span>Agents</span>
      </a-menu-item>
      
      <a-menu-item key="reports" @click="navigateTo('/reports')" class="menu-item">
        <template #icon>
          <bar-chart-outlined />
        </template>
        <span>Reports</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  HomeOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const collapsed = ref(false)

const selectedKeys = computed(() => {
  const path = route.path
  if (path.includes('/home') || path === '/') return ['home']
  if (path.includes('/appointments')) return ['appointments']
  if (path.includes('/customers')) return ['customers']
  if (path.includes('/agents')) return ['agents']
  if (path.includes('/reports')) return ['reports']
  return ['home']
})

const navigateTo = (path) => {
  router.push(path)
}

const onBreakpoint = (broken) => {
  collapsed.value = broken
}
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
