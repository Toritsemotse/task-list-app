<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import TaskRow from '../components/TaskRow.vue'

const tasksStore = useTasksStore()
const authStore = useAuthStore()

// Fetch tasks when component mounts
onMounted(async () => {
  try {
    console.log('TaskList mounted, fetching tasks...')
    await tasksStore.fetchTasks()
    console.log('Tasks loaded:', tasksStore.tasks?.length || 0)
  } catch (error) {
    console.error('Error in TaskList onMounted:', error)
  }
})

const handleLogout = () => {
  try {
    console.log('Logging out...')
    authStore.logout()
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

// Helper for user initials - with error handling
const userInitials = computed(() => {
  try {
    return authStore.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  } catch (error) {
    console.error('Error computing user initials:', error)
    return 'U'
  }
})

// Safe task count
const taskCount = computed(() => {
  try {
    return tasksStore.tasks?.length || 0
  } catch (error) {
    console.error('Error computing task count:', error)
    return 0
  }
})

// Safe filtered tasks
const displayTasks = computed(() => {
  try {
    return tasksStore.filteredTasks || tasksStore.tasks || []
  } catch (error) {
    console.error('Error computing display tasks:', error)
    return []
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <!-- Brand Section -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-lg shadow-lg"></div>
              <div class="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">{{ taskCount }}</span>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-800">Task Dashboard</h1>
              <p class="text-slate-500 text-sm font-medium">Project Management Hub</p>
            </div>
          </div>
          
          <!-- User Section -->
          <div class="flex items-center space-x-4">
            <!-- User Profile -->
            <div class="flex items-center space-x-3 px-4 py-2 bg-white/60 rounded-xl border border-gray-200 shadow-sm">
              <div class="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">{{ userInitials }}</span>
              </div>
              <div>
                <p class="text-slate-700 font-semibold text-sm">{{ authStore.user?.name || 'User' }}</p>
                <p class="text-slate-500 text-xs">Project Manager</p>
              </div>
            </div>
            
            <!-- Logout Button -->
            <button 
              @click="handleLogout"
              class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Debug Info -->
    <div class="max-w-7xl mx-auto px-6 py-3">
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
            <span class="text-amber-600 text-xs font-bold">i</span>
          </div>
          <div class="text-sm">
            <strong class="text-amber-800">Debug:</strong>
            <span class="text-amber-700 ml-2">
              Loading: {{ tasksStore.isLoading || false }}, 
              Error: {{ tasksStore.error || 'none' }}, 
              Tasks: {{ taskCount }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 pb-12">
      <!-- Loading State -->
      <div v-if="tasksStore.isLoading" class="bg-white rounded-lg shadow-lg p-12 text-center border">
        <div class="flex flex-col items-center space-y-4">
          <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div class="text-lg font-semibold text-slate-800">Loading tasks...</div>
          <div class="text-slate-500">Please wait while we fetch your data</div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="tasksStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <span class="text-red-500 font-bold">!</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-red-800">Something went wrong</h3>
            <p class="text-red-600">{{ tasksStore.error }}</p>
          </div>
        </div>
      </div>

      <!-- Tasks List -->
      <div v-else-if="taskCount > 0" class="space-y-6">
        <!-- Simple Search & Filter (if available) -->
        <div v-if="tasksStore.setSearchQuery || tasksStore.setStatusFilter" class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Search & Filter Tasks</h3>
          
          <!-- Search Box (if available) -->
          <div v-if="tasksStore.setSearchQuery" class="mb-4">
            <input
              :value="tasksStore.searchQuery || ''"
              @input="tasksStore.setSearchQuery($event.target.value)"
              type="text"
              placeholder="Search tasks..."
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          <!-- Filter Buttons (if available) -->
          <div v-if="tasksStore.setStatusFilter" class="flex space-x-2">
            <button
              @click="tasksStore.setStatusFilter('all')"
              :class="(tasksStore.statusFilter === 'all' || !tasksStore.statusFilter) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              All Tasks
            </button>
            <button
              @click="tasksStore.setStatusFilter('in_progress')"
              :class="tasksStore.statusFilter === 'in_progress' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              In Progress
            </button>
            <button
              @click="tasksStore.setStatusFilter('completed')"
              :class="tasksStore.statusFilter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Completed
            </button>
          </div>
        </div>

        <!-- Table Headers -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="grid grid-cols-4 gap-6 font-semibold text-slate-700">
            <span>Title</span>
            <span>Status</span>
            <span>Assignee</span>
            <span>Due Date</span>
          </div>
        </div>

        <!-- Task Rows -->
        <div class="space-y-3">
          <TaskRow 
            v-for="task in displayTasks" 
            :key="task.id" 
            :task="task" 
          />
        </div>
        
        <!-- No results message (if filtered tasks exist but are empty) -->
        <div v-if="tasksStore.filteredTasks && tasksStore.filteredTasks.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center border">
          <div class="text-slate-500">
            <div class="text-lg font-semibold mb-2">No tasks match your search or filter</div>
            <div class="text-sm">Try adjusting your search terms or filter settings</div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center border">
        <div class="flex flex-col items-center space-y-4">
          <div class="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
            <span class="text-slate-400 text-2xl">□</span>
          </div>
          <div class="text-xl font-bold text-slate-800">No tasks found</div>
          <div class="text-slate-500">Your tasks will appear here once they're created</div>
        </div>
      </div>
    </main>
  </div>
</template>