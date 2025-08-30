<template>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
      <a-input
        v-model:value="form.email"
        type="email"
        placeholder="Enter your email"
        size="large"
        :status="errors.email ? 'error' : ''"
      />
      <div v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
      <a-input-password
        v-model:value="form.password"
        placeholder="Enter your password"
        size="large"
        :status="errors.password ? 'error' : ''"
      />
      <div v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</div>
    </div>

    <div class="flex items-center justify-between mb-4">
      <a-checkbox v-model:checked="form.rememberMe">
        Remember me
      </a-checkbox>
      <a href="#" class="text-sm text-pink-600 hover:text-pink-500">
        Forgot password?
      </a>
    </div>

    <a-button
      type="primary"
      html-type="submit"
      size="large"
      block
      :loading="isLoading"
      class="bg-pink-600 hover:bg-pink-700 border-pink-600 hover:border-pink-700"
      @click="handleLogin"
    >
      Sign In
    </a-button>
  </form>
</template>

<script setup>
const props = defineProps({
  form: Object,
  errors: Object,
  isLoading: Boolean
})

const emit = defineEmits(['submit'])

const handleLogin = () => {
  emit('submit')
}
</script>
