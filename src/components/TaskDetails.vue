<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '../types'
import { useApi } from '../composables/useApi'
import { useTasksStore } from '../stores/tasks'

interface Props {
  task: Task
}

const props = defineProps<Props>()
const tasksStore = useTasksStore()
const api = useApi()

const isLoading = ref(false)
const actionType = ref<'status' | 'delete' | null>(null)

// Computed properties
const markDoneButtonText = computed(() => {
  if (isLoading.value && actionType.value === 'status') {
    return props.task.status === 'completed' ? 'Marking In Progress...' : 'Marking Done...'
  }
  return props.task.status === 'completed' ? 'Mark In Progress' : 'Mark Done'
})

const markDoneButtonClasses = computed(() => {
  const baseClasses = 'focus:ring-green-500'
  if (props.task.status === 'completed') {
    return `${baseClasses} text-yellow-700 bg-yellow-100 hover:bg-yellow-200`
  }
  return `${baseClasses} text-green-700 bg-green-100 hover:bg-green-200`
})

// Helper functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getStatusClasses = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

// Event handlers
const handleMarkDone = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  actionType.value = 'status'
  
  try {
    const newStatus = props.task.status === 'completed' ? 'in_progress' : 'completed'
    console.log(`🔄 Updating task ${props.task.id} status to:`, newStatus)
    
    await api.updateTaskStatus(props.task.id, newStatus)
    
    // Refresh tasks to get updated data
    await tasksStore.fetchTasks()
    
    console.log('✅ Task status updated successfully')
  } catch (error: any) {
    console.error('❌ Failed to update task status:', error)
    // You could emit an error event here to show a toast notification
  } finally {
    isLoading.value = false
    actionType.value = null
  }
}

const handleEdit = () => {
  console.log('📝 Edit task:', props.task.id)
  // TODO: Implement edit modal - will be added in next phase
  alert('Edit functionality will be implemented in the modal editor phase')
}

const handleDelete = async () => {
  if (isLoading.value) return
  
  // Confirm deletion
  const confirmed = confirm(`Are you sure you want to delete "${props.task.title}"?`)
  if (!confirmed) return
  
  isLoading.value = true
  actionType.value = 'delete'
  
  try {
    console.log('🗑️ Deleting task:', props.task.id)
    
    await api.deleteTask(props.task.id)
    
    // Refresh tasks to remove deleted task from UI
    await tasksStore.fetchTasks()
    
    console.log('✅ Task deleted successfully')
  } catch (error: any) {
    console.error('❌ Failed to delete task:', error)
    alert('Failed to delete task. Please try again.')
  } finally {
    isLoading.value = false
    actionType.value = null
  }
}
</script>


<template>
  <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div class="space-y-4">
      <!-- Task Description -->
      <div>
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description:</h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ task.details }}</p>
      </div>
      
      <!-- Task Metadata -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span class="font-medium text-gray-700 dark:text-gray-300">Assignee:</span>
          <span class="ml-2 text-gray-600 dark:text-gray-400">{{ task.assignee }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700 dark:text-gray-300">Due Date:</span>
          <span class="ml-2 text-gray-600 dark:text-gray-400">{{ formatDate(task.due_date) }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700 dark:text-gray-300">Status:</span>
          <span 
            class="ml-2 px-2 py-1 rounded-full text-xs font-medium"
            :class="getStatusClasses(task.status)"
          >
            {{ task.status.replace('_', ' ').toUpperCase() }}
          </span>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex space-x-3 pt-2">
        <button
          @click="handleMarkDone"
          :disabled="isLoading"
          :class="markDoneButtonClasses"
          class="px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isLoading && actionType === 'status'" class="mr-2">
            <svg class="animate-spin h-4 w-4 inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ markDoneButtonText }}
        </button>
        
        <button
          @click="handleEdit"
          :disabled="isLoading"
          class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Edit
        </button>
        
        <button
          @click="handleDelete"
          :disabled="isLoading"
          class="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isLoading && actionType === 'delete'" class="mr-2">
            <svg class="animate-spin h-4 w-4 inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading && actionType === 'delete' ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

