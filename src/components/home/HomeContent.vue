<template>
  <div class="home-content p-6">
    <!-- Welcome Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to Iceberg CRM</h1>
      <p class="text-gray-600">Your appointment management dashboard</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <calendar-outlined class="text-blue-600 text-xl" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Today's Appointments</p>
            <p class="text-2xl font-bold text-gray-900">24</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <user-outlined class="text-green-600 text-xl" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Patients</p>
            <p class="text-2xl font-bold text-gray-900">1,234</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-lg">
            <team-outlined class="text-purple-600 text-xl" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active Agents</p>
            <p class="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-3 bg-orange-100 rounded-lg">
            <dollar-outlined class="text-orange-600 text-xl" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Monthly Revenue</p>
            <p class="text-2xl font-bold text-gray-900">₺45,600</p>
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
            <h2 class="text-lg font-semibold text-gray-900">Recent Appointments</h2>
            <a-button type="link" @click="$router.push('/appointments')">
              View All
            </a-button>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="appointment in recentAppointments" :key="appointment.id" class="flex items-center justify-between">
              <div class="flex items-center">
                <a-avatar :style="{ backgroundColor: appointment.color }" class="mr-3">
                  {{ appointment.initials }}
                </a-avatar>
                <div>
                  <p class="font-medium text-gray-900">{{ appointment.customerName }}</p>
                  <p class="text-sm text-gray-500">{{ appointment.time }} - {{ appointment.service }}</p>
                </div>
              </div>
              <a-tag :color="getStatusColor(appointment.status)">
                {{ appointment.status }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 gap-4">
            <a-button 
              type="primary" 
              size="large"
              block
              @click="$router.push('/appointments')"
              class="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700"
            >
              <template #icon>
                <plus-outlined />
              </template>
              New Appointment
            </a-button>

            <a-button 
              size="large"
              block
              @click="$router.push('/customers')"
            >
              <template #icon>
                <user-add-outlined />
              </template>
              Add Patient
            </a-button>

            <a-button 
              size="large"
              block
              @click="$router.push('/reports')"
            >
              <template #icon>
                <bar-chart-outlined />
              </template>
              View Reports
            </a-button>

            <a-button 
              size="large"
              block
              @click="$router.push('/agents')"
            >
              <template #icon>
                <team-outlined />
              </template>
              Manage Agents
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Schedule -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="p-6 border-b">
        <h2 class="text-lg font-semibold text-gray-900">Today's Schedule</h2>
      </div>
      <div class="p-6">
        <div class="space-y-3">
          <div v-for="schedule in todaySchedule" :key="schedule.id" class="flex items-center p-3 bg-gray-50 rounded-lg">
            <div class="w-16 text-center">
              <p class="text-sm font-medium text-gray-900">{{ schedule.time }}</p>
            </div>
            <div class="flex-1 ml-4">
              <p class="font-medium text-gray-900">{{ schedule.customerName }}</p>
              <p class="text-sm text-gray-500">{{ schedule.service }} with {{ schedule.agent }}</p>
            </div>
            <a-tag :color="getStatusColor(schedule.status)">
              {{ schedule.status }}
            </a-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  PlusOutlined,
  UserAddOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// Mock data
const recentAppointments = ref([
  {
    id: 1,
    customerName: 'Ahmet Yılmaz',
    initials: 'AY',
    color: '#1890ff',
    time: '09:00',
    service: 'Dental Cleaning',
    status: 'upcoming'
  },
  {
    id: 2,
    customerName: 'Fatma Kaya',
    initials: 'FK',
    color: '#52c41a',
    time: '10:30',
    service: 'Consultation',
    status: 'in-progress'
  },
  {
    id: 3,
    customerName: 'Mehmet Demir',
    initials: 'MD',
    color: '#faad14',
    time: '14:00',
    service: 'Treatment',
    status: 'completed'
  }
])

const todaySchedule = ref([
  {
    id: 1,
    time: '09:00',
    customerName: 'Ahmet Yılmaz',
    service: 'Dental Cleaning',
    agent: 'Dr. Smith',
    status: 'upcoming'
  },
  {
    id: 2,
    time: '10:30',
    customerName: 'Fatma Kaya',
    service: 'Consultation',
    agent: 'Dr. Johnson',
    status: 'in-progress'
  },
  {
    id: 3,
    time: '14:00',
    customerName: 'Mehmet Demir',
    service: 'Treatment',
    agent: 'Dr. Brown',
    status: 'upcoming'
  },
  {
    id: 4,
    time: '16:30',
    customerName: 'Ayşe Özkan',
    service: 'Follow-up',
    agent: 'Dr. Davis',
    status: 'upcoming'
  }
])

const getStatusColor = (status) => {
  const colors = {
    'upcoming': 'blue',
    'in-progress': 'orange',
    'completed': 'green',
    'cancelled': 'red'
  }
  return colors[status] || 'default'
}
</script>
