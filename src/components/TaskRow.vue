<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '../types'

// Props - data passed from parent component
interface Props {
  task: Task
}

defineProps<Props>()

// Local state for expand/collapse
const isExpanded = ref(false)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

// Move functions inside script setup (this was the main issue)
const getStatusColor = (status: string) => {
  return status === 'completed' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-yellow-100 text-yellow-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  })
}
</script>

<template>
  <div class="bg-white border rounded-lg shadow-sm mb-4">
    <!-- Main Task Row - Clickable -->
    <div 
      @click="toggleExpanded"
      class="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1 grid grid-cols-4 gap-4">
          <!-- Title -->
          <div>
            <h3 class="font-medium text-gray-900">{{ task.title }}</h3>
          </div>
          
          <!-- Status -->
          <div>
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="getStatusColor(task.status)"
            >
              {{ task.status.replace('_', ' ').toUpperCase() }}
            </span>
          </div>
          
          <!-- Assignee -->
          <div class="text-gray-600">
            {{ task.assignee }}
          </div>
          
          <!-- Due Date -->
          <div class="text-gray-600">
            {{ formatDate(task.due_date) }}
          </div>
        </div>
        
        <!-- Expand/Collapse Icon -->
        <div class="ml-4">
          <svg 
            class="w-5 h-5 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': isExpanded }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Expanded Details Section -->
    <div v-if="isExpanded" class="border-t bg-gray-50 p-4">
      <!-- Full Details -->
      <div class="mb-4">
        <h4 class="font-medium text-gray-900 mb-2">Details</h4>
        <p class="text-gray-700">{{ task.details }}</p>
      </div>
      
      <!-- Action Buttons (UI only as per PDF) -->
      <div class="flex space-x-3">
        <button 
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Mark Done
        </button>
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit
        </button>
        <button 
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>