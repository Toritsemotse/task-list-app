<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('user@example.com') // Pre-fill for demo
const password = ref('password123')   // Pre-fill for demo
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

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
    
    console.log('✅ Login successful, redirecting to dashboard')
    await router.push('/dashboard')
    
  } catch (err: any) {
    console.error('❌ Login failed:', err)
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="w-full space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-slate-800 mb-2">
        Welcome Back
      </h2>
      <p class="text-slate-600 font-medium">
        Sign in to access your dashboard
      </p>
    </div>

    <!-- Login Form -->
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Email Field -->
      <div class="space-y-2">
        <label for="email" class="block text-sm font-semibold text-slate-700">
          Email Address
        </label>
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          :disabled="isLoading"
          class="block w-full px-6 py-4 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          placeholder="Enter your email"
        >
      </div>

      <!-- Password Field -->
      <div class="space-y-2">
        <label for="password" class="block text-sm font-semibold text-slate-700">
          Password
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            name="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            required
            :disabled="isLoading"
            class="block w-full px-6 py-4 pr-12 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            placeholder="Enter your password"
          >
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            :disabled="isLoading"
          >
            <span class="text-sm font-medium">{{ showPassword ? 'Hide' : 'Show' }}</span>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4">
        <div class="flex items-center space-x-3">
          <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <span class="text-red-500 text-xs font-bold">!</span>
          </div>
          <p class="text-red-700 font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-2">
        <button
          type="submit"
          :disabled="isLoading"
          class="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
        >
          <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-6">
            <div class="animate-spin h-6 w-6 border-2 border-white/30 border-t-white rounded-full"></div>
          </span>
          
          {{ isLoading ? 'Signing In...' : 'Sign In to Dashboard' }}
          
          <span v-if="!isLoading" class="ml-3 group-hover:translate-x-1 transition-transform duration-300">→</span>
        </button>
      </div>


    </form>
  </div>
</template>