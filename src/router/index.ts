import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'
import { isAuthenticated } from '@/services/api'

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
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 'dashboard',
          component: () => import('@/pages/home/HomeView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/appointments',
          name: 'appointments',
          component: () => import('@/pages/appointment/AppointmentsView.vue'),
          meta: { requiresAuth: true }
        },

      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found/NotFoundView.vue')
    }
  ]
})

// Navigation guards for authentication
router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated()
  
  // If route requires authentication and user is not authenticated
  if (to.meta.requiresAuth && !authenticated) {
    next('/login')
    return
  }
  
  // If user is authenticated and trying to access login page, redirect to home
  if (to.path === '/login' && authenticated) {
    next('/')
    return
  }
  
  next()
})

export default router
