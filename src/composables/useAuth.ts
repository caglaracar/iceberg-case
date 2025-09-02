import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockLogin, mockLogout, isAuthenticated, getAuthToken } from '@/services/api'

const isLoggedIn = ref(isAuthenticated())
const user = ref<any>(null)

export const useAuth = () => {
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      const result = await mockLogin(email, password)
      
      if (result.success) {
        isLoggedIn.value = true
        
        // Decode mock JWT to get user info
        const token = getAuthToken()
        if (token) {
          try {
            const payload = JSON.parse(atob(token))
            user.value = {
              email: payload.email,
              name: payload.name,
              id: payload.sub
            }
          } catch (e) {
            console.error('Failed to parse token:', e)
          }
        }
        
        // Redirect to home after successful login
        router.push('/')
        return { success: true }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      return { success: false, message: 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      await mockLogout()
      isLoggedIn.value = false
      user.value = null
      
      // Force clear any remaining authentication state
      const token = getAuthToken()
      console.log('Token after logout:', token) // Debug log
      
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Force logout even if mockLogout fails
      isLoggedIn.value = false
      user.value = null
      router.push('/login')
    }
  }

  const checkAuth = () => {
    const authenticated = isAuthenticated()
    isLoggedIn.value = authenticated
    
    if (!authenticated) {
      user.value = null
      // Only redirect if not already on login page
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    } else {
      // Load user info from token if logged in
      const token = getAuthToken()
      if (token && !user.value) {
        try {
          const payload = JSON.parse(atob(token))
          user.value = {
            email: payload.email,
            name: payload.name,
            id: payload.sub
          }
        } catch (e) {
          // Invalid token, logout
          logout()
        }
      }
    }
    
    return authenticated
  }

  return {
    isLoggedIn: computed(() => isLoggedIn.value),
    user: computed(() => user.value),
    login,
    logout,
    checkAuth
  }
}
