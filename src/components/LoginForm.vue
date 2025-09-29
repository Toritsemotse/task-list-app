<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const handleSubmit = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })
    
    await router.push('/dashboard')
  } catch (err: any) {
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
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
    <div class="w-80 h-[600px] md:w-96 md:h-[650px] lg:w-[420px] lg:h-[700px] relative">
      <!-- Background Glass Effect -->
      <div class="w-full h-full absolute inset-0 bg-gradient-to-bl from-teal-300/30 to-white/0 rounded-[10px] backdrop-blur-[2px] border border-white/20 shadow-xl" ></div>
      
      <!-- Content Container -->
      <div class="relative z-10 flex flex-col items-center justify-center h-full p-8">
        <!-- Header -->
        <div class="text-center mb-12 md:mb-16">
          <h1 class="text-white text-lg md:text-xl lg:text-2xl font-normal font-roboto tracking-[3.96px] mb-2">
            LOG IN
          </h1>
          <div class="w-16 h-px bg-white/30 mx-auto"></div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="w-full max-w-xs space-y-6">
          <!-- Username/Email Field -->
          <div class="space-y-2">
            <label for="email" class="block text-zinc-500 text-xs font-normal font-roboto">
              Username
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              :disabled="isLoading"
              class="w-full h-8 md:h-10 bg-white/90 backdrop-blur-sm rounded-md px-3 text-sm text-gray-800 placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all disabled:opacity-50"
              placeholder="Enter your email"
            />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="block text-zinc-500 text-xs font-normal font-roboto">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                :disabled="isLoading"
                class="w-full h-8 md:h-10 bg-white/90 backdrop-blur-sm rounded-md px-3 pr-10 text-sm text-gray-800 placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                :disabled="isLoading"
              >
                <span class="text-gray-400 text-xs">{{ showPassword ? 'Hide' : 'Show' }}</span>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-md p-3">
            <p class="text-red-100 text-xs font-medium text-center">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full h-10 md:h-12 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-white font-medium rounded-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            <span v-if="isLoading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Log In</span>
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

.font-roboto {
  font-family: 'Roboto', sans-serif;
}

/* Enhanced glass morphism effect */
.backdrop-blur-\[2px\] {
  backdrop-filter: blur(2px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .tracking-\[3\.96px\] {
    letter-spacing: 2px;
  }
}

@media (min-width: 1024px) {
  .tracking-\[3\.96px\] {
    letter-spacing: 4.5px;
  }
}
</style>