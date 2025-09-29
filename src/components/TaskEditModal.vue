<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Task } from '../types'
import { useApi } from '../composables/useApi'
import { useTasksStore } from '../stores/tasks'

interface Props {
  task: Task | null
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const api = useApi()
const tasksStore = useTasksStore()

// Form data
const form = ref({
  title: '',
  assignee: '',
  due_date: '',
  details: '',
  status: 'in_progress' as 'in_progress' | 'completed'
})

const isLoading = ref(false)
const error = ref('')

// Watch for task changes to populate form
watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = {
      title: newTask.title,
      assignee: newTask.assignee,
      due_date: newTask.due_date,
      details: newTask.details,
      status: newTask.status
    }
    error.value = ''
  }
}, { immediate: true })

// Form validation
const isFormValid = computed(() => {
  return form.value.title.trim() && 
         form.value.assignee.trim() && 
         form.value.due_date && 
         form.value.details.trim()
})

const handleSubmit = async () => {
  if (!props.task || !isFormValid.value || isLoading.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    await api.updateTask(props.task.id, {
      title: form.value.title.trim(),
      assignee: form.value.assignee.trim(),
      due_date: form.value.due_date,
      details: form.value.details.trim(),
      status: form.value.status
    })
    
    // Refresh tasks
    await tasksStore.fetchTasks()
    
    emit('updated')
    emit('close')
  } catch (err: any) {
    
    error.value = err.message || 'Failed to update task. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  if (!isLoading.value) {
    emit('close')
  }
}

const handleOverlayClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <!-- Modal Overlay -->
  <div
    v-if="isOpen && task"
    @click="handleOverlayClick"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <!-- Modal Content -->
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-lg font-semibold text-slate-800">Edit Task</h3>
        <button
          @click="handleClose"
          :disabled="isLoading"
          class="text-gray-400 hover:text-gray-600 p-1"
        >
          ×
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Title Field -->
        <div>
          <label for="title" class="block text-sm font-medium text-slate-700 mb-2">
            Task Title
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            placeholder="Enter task title"
          />
        </div>

        <!-- Assignee Field -->
        <div>
          <label for="assignee" class="block text-sm font-medium text-slate-700 mb-2">
            Assignee
          </label>
          <input
            id="assignee"
            v-model="form.assignee"
            type="text"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            placeholder="Enter assignee name"
          />
        </div>

        <!-- Due Date Field -->
        <div>
          <label for="due_date" class="block text-sm font-medium text-slate-700 mb-2">
            Due Date
          </label>
          <input
            id="due_date"
            v-model="form.due_date"
            type="date"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
        </div>

        <!-- Status Field -->
        <div>
          <label for="status" class="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <select
            id="status"
            v-model="form.status"
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <!-- Details Field -->
        <div>
          <label for="details" class="block text-sm font-medium text-slate-700 mb-2">
            Details
          </label>
          <textarea
            id="details"
            v-model="form.details"
            rows="4"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 resize-none"
            placeholder="Enter task details"
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>

        <!-- Modal Actions -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="handleClose"
            :disabled="isLoading"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span v-if="isLoading">
              <div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            </span>
            <span>{{ isLoading ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>