<template>
  <div class="home-content p-6">
    <!-- Welcome Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ t('dashboard.welcome') }}</h1>
      <p class="text-gray-600">{{ t('dashboard.subtitle') }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <a-spin size="large" />
      <p class="mt-4 text-gray-500">{{ t('dashboard.loadingData') }}</p>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <calendar-outlined class="text-blue-600 text-xl" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">{{ t('dashboard.todaysAppointments') }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.todayAppointments }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <user-outlined class="text-green-600 text-xl" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">{{ t('dashboard.totalContacts') }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.totalContacts }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-lg">
            <team-outlined class="text-purple-600 text-xl" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">{{ t('dashboard.activeAgents') }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.activeAgents }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Recent Appointments -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">{{ t('dashboard.recentAppointments') }}</h2>
            <a-button type="link" @click="$router.push('/appointments')">
              {{ t('dashboard.viewAll') }}
            </a-button>
          </div>
        </div>
        <div class="p-6">
          <div v-if="recentAppointments.length === 0" class="text-center py-4 text-gray-500">
            {{ t('dashboard.noRecentAppointments') }}
          </div>
          <div v-else class="space-y-4">
            <div v-for="appointment in recentAppointments" :key="appointment.id" class="flex items-center justify-between">
              <div class="flex items-center">
                <a-avatar :style="{ backgroundColor: appointment.color }" class="mr-3">
                  {{ appointment.initials }}
                </a-avatar>
                <div>
                  <p class="font-medium text-gray-900">{{ appointment.contactName }}</p>
                  <p class="text-sm text-gray-500">{{ appointment.time }} - {{ appointment.service }}</p>
                </div>
              </div>
              <a-tag :color="getStatusColor(appointment.status)">
                {{ getStatusText(appointment.status) }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900">{{ t('quickActions.title') }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- New Appointment Card -->
            <div class="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow duration-200" @click="handleNewAppointment">
              <div class="flex items-center">
                <div class="p-3 bg-indigo-100 rounded-lg">
                  <plus-outlined class="text-indigo-600 text-xl" />
                </div>
                <div class="ml-4">
                  <p class="text-lg font-semibold text-gray-900">{{ t('quickActions.newAppointment') }}</p>
                  <p class="text-sm text-gray-500">{{ t('appointments.newAppointment') }}</p>
                </div>
              </div>
            </div>

            <!-- View Schedule Card -->
            <div class="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow duration-200" @click="$router.push('/appointments')">
              <div class="flex items-center">
                <div class="p-3 bg-blue-100 rounded-lg">
                  <calendar-outlined class="text-blue-600 text-xl" />
                </div>
                <div class="ml-4">
                  <p class="text-lg font-semibold text-gray-900">{{ t('appointments.viewSchedule') }}</p>
                  <p class="text-sm text-gray-500">{{ t('quickActions.viewReports') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Modal -->
    <AppointmentModal
      :visible="showAppointmentModal"
      :mode="'create'"
      @update:visible="showAppointmentModal = $event"
      @appointment:created="handleAppointmentCreated"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useDashboard } from '@/composables/dashboard/useDashboard.ts'
import AppointmentModal from '@/components/appointment/AppointmentModal.vue'
import { STATUS_COLORS } from '@/constants/appointment/color.ts'
import {
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// i18n
const { t } = useI18n()

// Modal state
const showAppointmentModal = ref(false)

// Dashboard composable
const {
  loading,
  dashboardStats,
  recentAppointments,
  loadDashboardData
} = useDashboard()

// Modal handlers
const handleNewAppointment = () => {
  // If we're on home page, show modal
  if (route.path === '/home' || route.name === 'dashboard') {
    showAppointmentModal.value = true
  } else {
    // Otherwise navigate to appointments page
    router.push('/appointments')
  }
}

const handleAppointmentCreated = async () => {
  showAppointmentModal.value = false
  // Refresh dashboard data to show new appointment
  await loadDashboardData()
  // Navigate to appointments page after creating
  router.push('/appointments')
}

// Status color helper
const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'default'
}

// Status text helper with i18n translation mapping
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'upcoming': t('status.upcoming'),
    'completed': t('status.completed'), 
    'cancelled': t('status.cancelled'),
    'confirmed': t('status.confirmed'),
    'pending': t('status.pending'),
    'in-progress': t('status.inProgress')
  }
  return statusMap[status] || status
}

// Load dashboard data on component mount
onMounted(async () => {
  await loadDashboardData()
})
</script>
