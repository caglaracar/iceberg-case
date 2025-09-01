import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/shared/components/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/LoginView.vue')
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 'dashboard',
          component: () => import('@/pages/home/HomeView.vue')
        },
        {
          path: '/appointments',
          name: 'appointments',
          component: () => import('@/pages/appointment/AppointmentsView.vue')
        },
        {
          path: '/contacts',
          name: 'contacts',
          component: () => import('@/pages/contacts/ContactsView.vue')
        },
        {
          path: '/agents',
          name: 'agents', 
          component: () => import('@/pages/agents/AgentsView.vue')
        },
        {
          path: '/reports',
          name: 'reports',
          component: () => import('@/pages/reports/ReportsView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found/NotFoundView.vue')
    }
  ]
})

export default router
