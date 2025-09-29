<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '../types'
import { useApi } from '../composables/useApi'
import { useTasksStore } from '../stores/tasks'
import TaskEditModal from '../components/TaskEditModal.vue'

interface Props {
  task: Task
}

const props = defineProps<Props>()
const tasksStore = useTasksStore()
const api = useApi()

const isLoading = ref(false)
const actionType = ref<'status' | 'delete' | null>(null)
const showEditModal = ref(false)

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
      return 'bg-green-100 text-green-800'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
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
  } finally {
    isLoading.value = false
    actionType.value = null
  }
}

const handleEdit = () => {
  console.log('📝 Opening edit modal for task:', props.task.id)
  showEditModal.value = true
}

const handleEditModalClose = () => {
  console.log('📝 Closing edit modal')
  showEditModal.value = false
}

const handleTaskUpdated = () => {
  console.log('✅ Task updated via modal')
  showEditModal.value = false
}

const handleDelete = async () => {
  if (isLoading.value) return
  
  const confirmed = confirm(`Are you sure you want to delete "${props.task.title}"?`)
  if (!confirmed) return
  
  isLoading.value = true
  actionType.value = 'delete'
  
  try {
    console.log('🗑️ Deleting task:', props.task.id)
    
    await api.deleteTask(props.task.id)
    
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
  <!-- Expanded Details Section -->
  <div class="border-t bg-gray-50 dark:bg-gray-700/50 p-6">
    <!-- Details -->
    <div class="mb-6">
      <div class="flex items-center space-x-3 mb-4">
        <h4 class="text-lg font-semibold text-slate-800">Task Details</h4>
      </div>
      
      <div class="bg-white rounded-lg p-4 border mb-4">
        <p class="text-slate-700 leading-relaxed">{{ task.details }}</p>
      </div>

      <!-- Task Metadata -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-lg p-3 border">
          <span class="font-semibold text-slate-700 text-sm">Assignee:</span>
          <span class="ml-2 text-slate-600 text-sm">{{ task.assignee }}</span>
        </div>
        <div class="bg-white rounded-lg p-3 border">
          <span class="font-semibold text-slate-700 text-sm">Due Date:</span>
          <span class="ml-2 text-slate-600 text-sm">{{ formatDate(task.due_date) }}</span>
        </div>
        <div class="bg-white rounded-lg p-3 border">
          <span class="font-semibold text-slate-700 text-sm">Status:</span>
          <span 
            class="ml-2 px-2 py-1 rounded-full text-xs font-semibold"
            :class="getStatusClasses(task.status)"
          >
            {{ task.status.replace('_', ' ').toUpperCase() }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex space-x-3">
      <button
        @click="handleMarkDone"
        :disabled="isLoading"
        :class="markDoneButtonClasses"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <span v-if="isLoading && actionType === 'status'">
          <div class="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></div>
        </span>
        <span v-else>✓</span>
        {{ markDoneButtonText }}
      </button>
      
      <button
        @click="handleEdit"
        :disabled="isLoading"
        class="flex items-center space-x-2 px-4 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <span>✎</span>
        Edit
      </button>
      
      <button
        @click="handleDelete"
        :disabled="isLoading"
        class="flex items-center space-x-2 px-4 py-2 text-red-700 bg-red-100 hover:bg-red-200 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <span v-if="isLoading && actionType === 'delete'">
          <div class="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></div>
        </span>
        <span v-else>×</span>
        {{ isLoading && actionType === 'delete' ? 'Deleting...' : 'Delete' }}
      </button>
    </div>
    
    <!-- Edit Modal -->
    <TaskEditModal
      :task="task"
      :is-open="showEditModal"
      @close="handleEditModalClose"
      @updated="handleTaskUpdated"
    />
  </div>
</template>