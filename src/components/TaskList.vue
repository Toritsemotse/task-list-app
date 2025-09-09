<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import TaskRow from '../components/TaskRow.vue'

const tasksStore = useTasksStore()
const authStore = useAuthStore()
const router = useRouter()

// Debug computed
const debugInfo = computed(() => ({
  isLoading: tasksStore.isLoading,
  error: tasksStore.error,
  tasksCount: tasksStore.tasks.length,
  tasks: tasksStore.tasks
}))

// Fetch tasks when component mounts
onMounted(async () => {
  console.log('🏗️ TaskList mounted, fetching tasks...')
  await tasksStore.fetchTasks()
  console.log('📊 Debug info:', debugInfo.value)
})

const handleLogout = () => {
  console.log('👋 Logging out...')
  authStore.logout()
}

// New computed properties for stats
const completedTasks = computed(() => 
  tasksStore.tasks.filter(task => task.status === 'completed').length
)

const inProgressTasks = computed(() => 
  tasksStore.tasks.filter(task => task.status === 'in_progress').length
)

const userInitials = computed(() => 
  authStore.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Enhanced Header -->
    <header class="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <!-- Enhanced Brand Section -->
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Task Dashboard
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Project Management Hub</p>
            </div>
          </div>
          
          <!-- Enhanced User Section -->
          <div class="flex items-center space-x-6">
            <!-- User Profile -->
            <div class="flex items-center space-x-3 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <span class="text-white text-sm font-bold">{{ userInitials }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Welcome, {{ authStore.user?.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Project Manager</p>
              </div>
            </div>
            
            <!-- Enhanced Logout Button -->
            <button 
              @click="handleLogout"
              class="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Enhanced Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Tasks -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-105 transition-all duration-200">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ tasksStore.tasks.length }}</p>
            </div>
          </div>
        </div>

        <!-- In Progress -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-105 transition-all duration-200">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ inProgressTasks }}</p>
            </div>
          </div>
        </div>

        <!-- Completed -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-105 transition-all duration-200">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ completedTasks }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Info (enhanced styling) -->
    <div class="max-w-7xl mx-auto px-4 mb-6">
      <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 text-sm">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <strong class="text-yellow-800 dark:text-yellow-200">Debug Info:</strong>
          <span class="text-yellow-700 dark:text-yellow-300">
            Loading: {{ tasksStore.isLoading }}, 
            Error: {{ tasksStore.error }}, 
            Tasks: {{ tasksStore.tasks.length }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 pb-8">
      <!-- Enhanced Loading State -->
      <div v-if="tasksStore.isLoading" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
        <div class="flex flex-col items-center space-y-4">
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center">
            <svg class="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div class="text-xl font-medium text-gray-900 dark:text-white">Loading your tasks...</div>
          <div class="text-gray-500 dark:text-gray-400">Please wait while we fetch your data</div>
        </div>
      </div>

      <!-- Enhanced Error State -->
      <div v-else-if="tasksStore.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-6">
        <div class="flex items-center space-x-3">
          <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">Oops! Something went wrong</h3>
            <p class="text-red-600 dark:text-red-400 mt-1">{{ tasksStore.error }}</p>
          </div>
        </div>
      </div>

      <!-- Enhanced Tasks List -->
      <div v-else-if="tasksStore.tasks.length > 0" class="space-y-6">
        <!-- Enhanced Table Headers -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="grid grid-cols-4 gap-4 font-semibold text-gray-700 dark:text-gray-300 text-lg">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Title</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Status</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Assignee</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Due Date</span>
            </div>
          </div>
        </div>

        <!-- Task Rows Container -->
        <div class="space-y-4">
          <TaskRow 
            v-for="task in tasksStore.tasks" 
            :key="task.id" 
            :task="task" 
          />
        </div>
      </div>

      <!-- Enhanced Empty State -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
        <div class="flex flex-col items-center space-y-4">
          <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="text-2xl font-semibold text-gray-900 dark:text-white">No tasks found</div>
          <div class="text-gray-500 dark:text-gray-400">Your tasks will appear here once they're created</div>
        </div>
      </div>
    </main>
  </div>
</template>