<template>
  <a-form @finish="handleLogin" layout="vertical" class="space-y-4">
    <a-form-item 
      label="Email Address"
      :validate-status="errors.email ? 'error' : ''"
      :help="errors.email"
    >
      <a-input
        v-model:value="form.email"
        type="email"
        placeholder="Enter your email"
        size="large"
      />
    </a-form-item>

    <a-form-item 
      label="Password"
      :validate-status="errors.password ? 'error' : ''"
      :help="errors.password"
    >
      <a-input-password
        v-model:value="form.password"
        placeholder="Enter your password"
        size="large"
      />
    </a-form-item>

    <div class="flex items-center justify-between mb-4">
      <a-checkbox v-model:checked="form.rememberMe">
        Remember me
      </a-checkbox>
      <a href="#" class="text-sm text-pink-600 hover:text-pink-500">
        Forgot password?
      </a>
    </div>

    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        size="large"
        block
        :loading="isLoading"
        class="bg-pink-600 hover:bg-pink-700 border-pink-600 hover:border-pink-700"
      >
        Sign In
      </a-button>
    </a-form-item>
  </a-form>
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
