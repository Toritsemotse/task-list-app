<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useApi } from '../composables/useApi'

const router = useRouter()
const authStore = useAuthStore()
const api = useApi()

const email = ref('user@example.com') // Pre-fill for demo
const password = ref('password123')   // Pre-fill for demo
const error = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    console.log('🚀 Attempting login...')
    const response = await authStore.login({
      email: email.value,
      password: password.value
    })
    
    console.log('✅ Login successful, setting auth state')
    // Set auth state (this will automatically persist to localStorage)
    // authStore.setAuth(response.token, response.user)
    
    console.log('🔄 Redirecting to dashboard')
    await router.push('/dashboard')
    
  } catch (err: any) {
    console.error('❌ Login failed:', err)
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>





<template>
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Sign in to your account
      </h2>
    </div>
    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            :disabled="isLoading"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50"
            placeholder="Email address"
          >
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            v-model="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            :disabled="isLoading"
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50"
            placeholder="Password"
          >
        </div>
      </div>

      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="text-sm text-red-700">{{ error }}</div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="isLoading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="animate-spin h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>

      <!-- Demo credentials helper -->
      <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <p class="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">Demo Credentials:</p>
        <p class="text-xs text-blue-500 dark:text-blue-300">
          Email: user@example.com<br>
          Password: password123
        </p>
      </div>
    </form>
  </div>
</template>

