<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <div class="relative inline-block">
          <!-- Background Circle -->
          <div class="w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center relative overflow-hidden">
            <!-- Decorative Elements -->
            <div class="absolute top-8 left-12 w-6 h-6 bg-white bg-opacity-30 rounded-full"></div>
            <div class="absolute top-16 right-20 w-4 h-4 bg-white bg-opacity-40 rounded-full"></div>
            <div class="absolute bottom-20 left-8 w-8 h-8 bg-white bg-opacity-20 rounded-full"></div>
            <div class="absolute bottom-12 right-16 w-3 h-3 bg-white bg-opacity-50 rounded-full"></div>
            
            <!-- Character -->
            <div class="relative z-10 flex flex-col items-center">
              <!-- Question Mark Icon -->
              <div class="absolute -top-16 -right-8 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <question-circle-outlined class="text-white text-2xl" />
              </div>
              
              <!-- Person -->
              <div class="relative">
                <!-- Head -->
                <div class="w-16 h-16 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full mb-2 relative">
                  <!-- Hair -->
                  <div class="absolute -top-1 left-2 w-12 h-8 bg-purple-800 rounded-t-full"></div>
                  <!-- Eyes -->
                  <div class="absolute top-6 left-4 w-2 h-2 bg-black rounded-full"></div>
                  <div class="absolute top-6 right-4 w-2 h-2 bg-black rounded-full"></div>
                  <!-- Mouth -->
                  <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-red-400 rounded-full"></div>
                </div>
                
                <!-- Body -->
                <div class="w-20 h-24 bg-white rounded-lg relative mb-2">
                  <!-- Arms -->
                  <div class="absolute -left-6 top-2 w-12 h-4 bg-orange-200 rounded-full transform rotate-12"></div>
                  <div class="absolute -right-6 top-2 w-12 h-4 bg-orange-200 rounded-full transform -rotate-12"></div>
                  
                  <!-- Box in hands -->
                  <div class="absolute -left-2 top-6 w-12 h-8 bg-yellow-600 border-2 border-yellow-700 rounded transform rotate-3">
                    <div class="absolute top-1 left-1 text-xs text-yellow-900">📦</div>
                  </div>
                </div>
                
                <!-- Legs -->
                <div class="flex gap-2 justify-center">
                  <div class="w-4 h-20 bg-blue-500 rounded-lg"></div>
                  <div class="w-4 h-20 bg-blue-500 rounded-lg"></div>
                </div>
                
                <!-- Feet -->
                <div class="flex gap-2 justify-center mt-1">
                  <div class="w-6 h-3 bg-gray-800 rounded-full"></div>
                  <div class="w-6 h-3 bg-gray-800 rounded-full"></div>
                </div>
              </div>
              
              <!-- Floating Elements -->
              <div class="absolute bottom-0 right-12">
                <div class="w-8 h-16 bg-green-500 rounded-t-lg"></div>
                <div class="w-8 h-12 bg-green-400 rounded-t-lg mt-1"></div>
                <div class="w-12 h-6 bg-yellow-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Content -->
      <NotFoundContent @go-home="goHome" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import NotFoundContent from '@/components/not-found/NotFoundContent.vue'

const router = useRouter()

const goHome = () => {
  router.push('/appointments')
}
</script>

<style scoped>
/* Additional animations */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
