<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import { useApi } from '../composables/useApi'
import TaskRow from '../components/TaskRow.vue'

const tasksStore = useTasksStore()
const authStore = useAuthStore()

// Dark mode state
const isDarkMode = ref(false)

// Dark mode toggle function
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value

  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
    console.log('Dark mode enabled')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
    console.log('Dark mode disabled')
  }
}

// Add new task state
const showAddTaskForm = ref(false)
const newTask = ref({
  title: '',
  assignee: '',
  due_date: '',
  details: '',
  status: 'in_progress' as 'in_progress' | 'completed'
})

// Add new task function
const handleAddTask = async () => {
  try {
    if (!newTask.value.title.trim() || !newTask.value.assignee.trim() || !newTask.value.due_date || !newTask.value.details.trim()) {
      alert('Please fill in all fields')
      return
    }

    console.log('Adding new task:', newTask.value)

    // Use the API to create the task
    const api = useApi()
    await api.createTask({
      title: newTask.value.title.trim(),
      assignee: newTask.value.assignee.trim(),
      due_date: newTask.value.due_date,
      details: newTask.value.details.trim(),
      status: newTask.value.status
    })

    // Refresh tasks
    await tasksStore.fetchTasks()

    // Reset form and close
    newTask.value = {
      title: '',
      assignee: '',
      due_date: '',
      details: '',
      status: 'in_progress'
    }
    showAddTaskForm.value = false


  } catch (error) {
    console.error('Error adding task:', error)
    alert('Failed to add task. Please try again.')
  }
}

const cancelAddTask = () => {
  newTask.value = {
    title: '',
    assignee: '',
    due_date: '',
    details: '',
    status: 'in_progress'
  }
  showAddTaskForm.value = false
}

// Initialize dark mode and fetch tasks
onMounted(async () => {
  try {
    // Initialize dark mode from localStorage or system preference
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode === 'true' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDarkMode.value = true
      document.documentElement.classList.add('dark')
    } else {
      isDarkMode.value = false
      document.documentElement.classList.remove('dark')
    }


    await tasksStore.fetchTasks()

  } catch (error) {
    console.error('Error in TaskList onMounted:', error)
  }
})

const handleLogout = () => {
  try {

    authStore.logout()
  } catch (error) {
    console.error('Error during logout:', error)
  }
}



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

const searchQuery = computed({
  get: () => tasksStore.searchQuery || '',
  set: (value: string) => tasksStore.setSearchQuery(value)
})


</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
    <!-- Header -->
    <header
      class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <!-- Brand Section -->
          <div class="flex items-center space-x-4">

            <div>
              <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-200">Task Dashboard</h1>
              <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Project Management Hub</p>
            </div>
          </div>

          <!-- User Section -->
          <div class="flex items-center space-x-4">
            <!-- Dark Mode Toggle -->
            <button @click="toggleDarkMode"
              class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              title="Toggle dark mode">
              <span v-if="isDarkMode" class="text-yellow-400 text-lg">☀️</span>
              <span v-else class="text-gray-600 text-lg">🌙</span>
            </button>

            <!-- User Profile -->
            <div
              class="flex items-center space-x-3 px-4 py-2 bg-white/60 dark:bg-gray-700/60 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">

              <div>
                <p class="text-slate-500 dark:text-slate-400 text-xs">Project Manager</p>
              </div>
            </div>

            <!-- Logout Button -->
            <button @click="handleLogout"
              class="px-4 py-2 bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-800 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-3"></div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 pb-12">
      <!-- Loading State -->
      <div v-if="tasksStore.isLoading"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center border dark:border-gray-700">
        <div class="flex flex-col items-center space-y-4">
          <div
            class="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin">
          </div>
          <div class="text-lg font-semibold text-slate-800 dark:text-slate-200">Loading tasks...</div>
          <div class="text-slate-500 dark:text-slate-400">Please wait while we fetch your data</div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="tasksStore.error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center">
            <span class="text-red-500 dark:text-red-400 font-bold">!</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-red-800 dark:text-red-400">Something went wrong</h3>
            <p class="text-red-600 dark:text-red-300">{{ tasksStore.error }}</p>
          </div>
        </div>
      </div>

      <!-- Tasks List -->
      <div v-else-if="taskCount > 0" class="space-y-6">
        <!-- Add Task Button -->
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-slate-800 dark:text-slate-200">Your Tasks</h2>
          <button @click="showAddTaskForm = true"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm">
            + Add New Task
          </button>
        </div>

        <!-- Add Task Form Modal -->
        <div v-if="showAddTaskForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Add New Task</h3>

            <div class="space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                <input v-model="newTask.title" type="text" placeholder="Enter task title"
                  class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <!-- Assignee -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Assignee</label>
                <input v-model="newTask.assignee" type="text" placeholder="Enter assignee name"
                  class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <!-- Due Date -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
                <input v-model="newTask.due_date" type="date"
                  class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <select v-model="newTask.status"
                  class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <!-- Details -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Details</label>
                <textarea v-model="newTask.details" placeholder="Enter task details" rows="3"
                  class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"></textarea>
              </div>
            </div>

            <!-- Form Buttons -->
            <div class="flex space-x-3 mt-6">
              <button @click="cancelAddTask"
                class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors text-sm">
                Cancel
              </button>
              <button @click="handleAddTask"
                class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm">
                Add Task
              </button>
            </div>
          </div>
        </div>
        <!-- Simple Search & Filter (if available) -->
        <div v-if="tasksStore.setSearchQuery || tasksStore.setStatusFilter"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Search & Filter Tasks</h3>

          <!-- Search Box (if available) -->
          <!-- <div v-if="tasksStore.setSearchQuery" class="mb-4">
            <input
              :value="tasksStore.searchQuery || ''"
              @input="tasksStore.setSearchQuery($event.target.value)"
              type="text"
              placeholder="Search tasks..."
              class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div> -->

          <input v-model="searchQuery" type="text" placeholder="Search tasks..."
            class="w-full px-4 py-3 mb-4 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />

          <!-- Filter Buttons (if available) -->
          <div v-if="tasksStore.setStatusFilter" class="flex space-x-2">
            <button @click="tasksStore.setStatusFilter('all')"
              :class="(tasksStore.statusFilter === 'all' || !tasksStore.statusFilter) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg font-medium transition-colors text-sm">
              All Tasks
            </button>
            <button @click="tasksStore.setStatusFilter('in_progress')"
              :class="tasksStore.statusFilter === 'in_progress' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg font-medium transition-colors text-sm">
              In Progress
            </button>
            <button @click="tasksStore.setStatusFilter('completed')"
              :class="tasksStore.statusFilter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg font-medium transition-colors text-sm">
              Completed
            </button>
          </div>
        </div>


        <!-- Task Rows -->
        <div class="space-y-3">
          <TaskRow v-for="task in displayTasks" :key="task.id" :task="task" />
        </div>

        <!-- No results message (if filtered tasks exist but are empty) -->
        <div v-if="tasksStore.filteredTasks && tasksStore.filteredTasks.length === 0"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center border dark:border-gray-700">
          <div class="text-slate-500 dark:text-slate-400">
            <div class="text-lg font-semibold mb-2">No tasks match your search or filter</div>
            <div class="text-sm">Try adjusting your search terms or filter settings</div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center border dark:border-gray-700">
        <div class="flex flex-col items-center space-y-4">
          <div class="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <span class="text-slate-400 dark:text-slate-500 text-2xl">□</span>
          </div>
          <div class="text-xl font-bold text-slate-800 dark:text-slate-200">No tasks found</div>
          <div class="text-slate-500 dark:text-slate-400">Your tasks will appear here once they're created</div>
        </div>
      </div>
    </main>
  </div>
</template>